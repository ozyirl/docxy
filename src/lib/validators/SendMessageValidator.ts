import { z } from "Zod";

export const sendMessageValidator = z.object({
  fileId: z.string(),
  message: z.string(),
});
