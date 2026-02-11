import { z } from "zod";

export const createProblemSchema = z.object({
  title: z.string().min(1),
  slug: z.string().regex(/^[a-z0-9-]+$/, "Invalid slug"),
  difficulty: z.enum(["EASY", "MEDIUM", "HARD"]),
  description: z.string().min(1),
  constraints: z.string().optional(),
});