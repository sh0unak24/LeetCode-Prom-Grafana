"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProblemSchema = void 0;
const zod_1 = require("zod");
exports.createProblemSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    slug: zod_1.z.string().regex(/^[a-z0-9-]+$/, "Invalid slug"),
    difficulty: zod_1.z.enum(["EASY", "MEDIUM", "HARD"]),
    description: zod_1.z.string().min(1),
    constraints: zod_1.z.string().optional(),
});
