import { db } from "@/db";
import { openai } from "@/lib/openai";
import { getPineconeClient } from "@/lib/pinecone";
import { SendMessageValidator } from "@/lib/validators/SendMessageValidator";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { NextRequest } from "next/server";
import { OpenAIStream, StreamingTextResponse } from "ai";

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const { getUser } = getKindeServerSession();
  const user = getUser();
  const { id: userId } = user;

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { fileId, message } = SendMessageValidator.parse(body);
  const file = await db.file.findFirst({ where: { id: fileId, userId } });

  if (!file) {
    return new Response("Not found", { status: 404 });
  }

  await db.message.create({
    data: {
      text: message,
      isUserMessage: true,
      userId,
      fileId,
    },
  });

  const embeddings = new OpenAIEmbeddings({
    openAIApiKey: process.env.OPENAI_API_KEY,
  });

  const pinecone = await getPineconeClient();
  const pineconeIndex = pinecone.Index("docxyy");

  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex,
    namespace: file.id,
  });

  console.log(vectorStore);

  try {
    const results = await vectorStore.similaritySearch(message, 4);
    const prevMessages = await db.message.findMany({
      where: { fileId },
      orderBy: { createdAt: "asc" },
      take: 6,
    });
    const formattedPrevMessages = prevMessages.map((msg) => ({
      role: msg.isUserMessage ? "user" : "assistant",
      content: msg.text,
    }));

    const context = `PREVIOUS CONVERSATION:${formattedPrevMessages.map(
      (msg) => {
        if (msg.role === "user") return `User:${msg.content}\n`;
        return `Assistant:${msg.content}\n`;
      }
    )}CONTEXT:${results
      .map((r) => r.pageContent)
      .join("\n\n")}USER INPUT:${message}`;

    console.log(context);

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      stream: true,
      messages: [
        {
          role: "system",
          content:
            "You have access to a PDF document. Please use the information from the document to answer the user's question.",
        },
        {
          role: "user",
          content: context,
        },
      ],
    });

    const stream = OpenAIStream(response, {
      async onCompletion(completion: any) {
        await db.message.create({
          data: {
            text: completion,
            isUserMessage: false,
            fileId,
            userId,
          },
        });
      },
    });

    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error("Error searching for similar messages:", error);
    return new Response("InternalServerError", { status: 500 });
  }
};
