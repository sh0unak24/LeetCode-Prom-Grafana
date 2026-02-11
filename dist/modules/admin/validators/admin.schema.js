"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminLoginSchema = exports.adminSignupSchema = void 0;
const zod_1 = require("zod");
const password_schema_1 = require("./password.schema");
exports.adminSignupSchema = zod_1.z.object({
    email: zod_1.z.email("Invalid email format"),
    password: password_schema_1.passwordSchema
});
exports.adminLoginSchema = zod_1.z.object({
    email: zod_1.z.email("Invalid email format"),
    password: zod_1.z.string().min(1, "Password is required"),
});
