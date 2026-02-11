"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminLogin = exports.adminSignup = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const zod_1 = require("zod");
const admin_schema_1 = require("../validators/admin.schema");
const prisma_1 = require("../../../lib/prisma");
const adminSignup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsed = admin_schema_1.adminSignupSchema.safeParse(req.body);
        if (!parsed.success) {
            const pretty = zod_1.z.prettifyError(parsed.error);
            return res.status(400).json({
                message: "Validation error",
                errors: pretty
            });
        }
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "Please provide all the values"
            });
        }
        const existingUser = yield prisma_1.prisma.admin.findUnique({
            where: {
                email
            }
        });
        if (existingUser) {
            return res.status(409).json({
                message: "Admin already exists"
            });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const admin = yield prisma_1.prisma.admin.create({
            data: {
                email,
                password: hashedPassword
            }
        });
        res.status(200).json({
            message: "admin signup successfull",
            admin: {
                id: admin.id,
                email: admin.email
            }
        });
    }
    catch (err) {
        console.error("[SIGNUP ERROR]", err);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
});
exports.adminSignup = adminSignup;
const adminLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsed = admin_schema_1.adminLoginSchema.safeParse(req.body);
        if (!parsed.success) {
            const pretty = zod_1.z.prettifyError(parsed.error);
            return res.status(400).json({
                message: "Validation error",
                errors: pretty
            });
        }
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }
        const admin = yield prisma_1.prisma.admin.findUnique({
            where: { email },
        });
        if (!admin) {
            return res.status(401).json({
                message: "Invalid credentials",
            });
        }
        const isPasswordValid = yield bcryptjs_1.default.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid credentials",
            });
        }
        const token = jsonwebtoken_1.default.sign({ userId: admin.id,
            role: "ADMIN",
        }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        res.cookie("token", token, {
            httpOnly: true, // prevents JS access
            secure: process.env.NODE_ENV === "production", // HTTPS only in prod
            sameSite: "strict", // CSRF protection
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        return res.status(200).json({
            message: "Login successful",
            admin: {
                id: admin.id,
                email: admin.email,
            },
        });
    }
    catch (err) {
        console.error("[LOGIN_ERROR]", err);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
});
exports.adminLogin = adminLogin;
