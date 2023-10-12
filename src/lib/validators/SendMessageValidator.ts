import { z } from "Zod";

export const SendMessageValidator = z.object({
  fileId: z.string(),
  message: z.string(),
});
