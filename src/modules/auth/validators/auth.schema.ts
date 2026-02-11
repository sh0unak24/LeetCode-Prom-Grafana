import { z } from "zod";
import { passwordSchema } from "./password.schema";

export const signupSchema = z.object({
    email: z.email("Invalid email format"),
    name: z.string().min(1, "Name is required"),
    password: passwordSchema
});

export const loginSchema = z.object({
    email: z.email("Invalid email format"),
    password: z.string().min(1, "Password is required"),
});

