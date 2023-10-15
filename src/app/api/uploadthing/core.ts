import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createUploadthing } from "uploadthing/next";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { getPineconeClient } from "@/lib/pinecone";

const f = createUploadthing();

const middleware = async () => {
  const { getUser } = getKindeServerSession();
  const user = getUser();
  if (!user || !user.id) throw new Error("Unauthorized");
  return { userId: user.id };
};

export const ourFileRouter = {
  pdfUploader: f({ pdf: { maxFileSize: "4MB" } })
    .middleware(async ({ req }) => {
      const { getUser } = getKindeServerSession();
      const user = getUser();
      if (!user || !user.id) throw new Error("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(
      async ({ metadata, file }: { metadata: any; file: any }) => {
        const isFileExist = await db.file.findFirst({
          where: { key: file.key },
        });
        if (isFileExist) return;

        const createdFile = await db.file.create({
          data: {
            key: file.key,
            name: file.name,
            userId: metadata.userId,
            url: `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`,
            uploadStatus: "PROCESSING",
          },
        });

        try {
          const response = await fetch(
            `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`
          );
          const blob = await response.blob();
          const loader = new PDFLoader(blob);
          const pageLevelDocs = await loader.load();
          const pagesAmt = pageLevelDocs.length;

          const pinecone = await getPineconeClient();
          const pineconeIndex = pinecone.Index("docxyy");

          const combinedData = pageLevelDocs.map((document) => {
            return {
              ...document,
              dataset: "pdf",
            };
          });

          const embeddings = new OpenAIEmbeddings({
            openAIApiKey: process.env.OPENAI_API_KEY,
          });

          await PineconeStore.fromDocuments(combinedData, embeddings, {
            pineconeIndex,
          });

          await db.file.update({
            data: { uploadStatus: "SUCCESS" },
            where: { id: createdFile.id },
          });
        } catch (err) {
          console.log("err");

          await db.file.update({
            data: { uploadStatus: "FAILED" },
            where: { id: createdFile.id },
          });
        }
      }
    ),
};

export type OurFileRouter = typeof ourFileRouter;
