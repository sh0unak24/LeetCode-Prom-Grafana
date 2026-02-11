import { z } from "zod";
import { passwordSchema } from "./password.schema";

export const adminSignupSchema = z.object({
    email: z.email("Invalid email format"),
    password: passwordSchema
});

export const adminLoginSchema = z.object({
    email: z.email("Invalid email format"),
    password: z.string().min(1, "Password is required"),
});

