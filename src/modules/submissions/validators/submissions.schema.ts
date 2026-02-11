import { z } from "zod";

export const createSubmissionSchema = z.object({
  problemId: z.string().min(1),
  language: z.string().min(1),
  sourceCode: z.string().min(1),
});