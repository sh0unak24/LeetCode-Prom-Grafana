"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.signupSchema = void 0;
const zod_1 = require("zod");
const password_schema_1 = require("./password.schema");
exports.signupSchema = zod_1.z.object({
    email: zod_1.z.email("Invalid email format"),
    name: zod_1.z.string().min(1, "Name is required"),
    password: password_schema_1.passwordSchema
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.email("Invalid email format"),
    password: zod_1.z.string().min(1, "Password is required"),
});
