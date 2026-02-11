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
exports.createProblem = exports.getProblemBySlug = exports.getProblems = void 0;
const prisma_1 = require("../../../lib/prisma");
const problems_validations_1 = require("../validators/problems.validations");
const zod_1 = __importDefault(require("zod"));
const getProblems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const problems = yield prisma_1.prisma.problem.findMany();
        if (!problems) {
            return res.status(400).json({
                message: "No problems to fetch"
            });
        }
        res.status(200).json({
            message: "Problems fetched successfully",
            problems: problems
        });
    }
    catch (err) {
        console.error("[GET PROBLEMS]", err);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
});
exports.getProblems = getProblems;
const getProblemBySlug = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { slug } = req.params;
        if (!slug || Array.isArray(slug)) {
            return res.status(400).json({
                message: "Invalid problem slug",
            });
        }
        const problem = yield prisma_1.prisma.problem.findUnique({
            where: { slug },
            select: {
                id: true,
                slug: true,
                title: true,
                difficulty: true,
                description: true,
                constraints: true,
            },
        });
        if (!problem) {
            return res.status(404).json({
                message: "Problem not found",
            });
        }
        return res.status(200).json(problem);
    }
    catch (err) {
        console.error("[GET PROBLEM BY SLUG]", err);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
});
exports.getProblemBySlug = getProblemBySlug;
const createProblem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsed = problems_validations_1.createProblemSchema.safeParse(req.body);
        if (!parsed.success) {
            const pretty = zod_1.default.prettifyError(parsed.error);
            return res.status(400).json({
                message: "Validation error",
                errors: pretty
            });
        }
        const { title, slug, constraints, difficulty, description } = req.body;
        if (!title || !slug || !constraints || !description || !difficulty) {
            return res.status(400).json({
                message: "Please provide all the fields"
            });
        }
        const existingProblem = yield prisma_1.prisma.problem.findUnique({
            where: {
                slug
            }
        });
        if (existingProblem) {
            return res.status(409).json({
                message: "Problem already exists"
            });
        }
        const problem = yield prisma_1.prisma.problem.create({
            data: {
                title,
                slug,
                description,
                constraints,
                difficulty
            }
        });
        return res.status(201).json({
            message: "Problem Created",
            problem: {
                id: problem.id,
                slug: problem.slug,
                description: problem.description,
                constraints: problem.constraints,
                difficulty: problem.difficulty
            }
        });
    }
    catch (err) {
        console.error("[CREATE PROBLEM]", err);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
});
exports.createProblem = createProblem;
