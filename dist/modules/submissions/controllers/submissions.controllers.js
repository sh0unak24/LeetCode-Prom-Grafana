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
exports.getSubmissionForUser = exports.getSubmissionByProblemId = exports.getSubmissionById = exports.createSubmission = void 0;
const submissions_schema_1 = require("../validators/submissions.schema");
const zod_1 = __importDefault(require("zod"));
const prisma_1 = require("../../../lib/prisma");
const createSubmission = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const parsed = submissions_schema_1.createSubmissionSchema.safeParse(req.body);
        if (!parsed.success) {
            const pretty = zod_1.default.prettifyError(parsed.error);
            return res.status(400).json({
                message: "Validation Error",
                error: pretty
            });
        }
        const { problemId, sourceCode, language } = req.body;
        if (!problemId || !sourceCode || !language) {
            return res.status(400).json({
                message: "Please provide all the fields"
            });
        }
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(400).json({
                message: "User ID is required"
            });
        }
        const submission = yield prisma_1.prisma.submission.create({
            data: {
                userId,
                problemId,
                language,
                sourceCode
            }
        });
        return res.status(201).json({
            message: "Submission created successfully",
            submission: {
                userId: submission.userId,
                problemId: submission.problemId,
                language: submission.language,
                sourceCode: submission.sourceCode
            }
        });
    }
    catch (err) {
        console.error("[CREATE SUBMISSION ERROR]");
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
});
exports.createSubmission = createSubmission;
const getSubmissionById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        if (!id) {
            return res.status(400).json({
                message: "Please provide a valid submission id"
            });
        }
        const submission = yield prisma_1.prisma.submission.findUnique({
            where: {
                id: id
            }
        });
        if (!submission) {
            return res.status(400).json({
                message: "Submission does not exist"
            });
        }
        return res.status(200).json({
            message: "Submision found",
            submission: submission
        });
    }
    catch (err) {
        console.error("[GET SUBMISSION BY ID ERROR]");
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
});
exports.getSubmissionById = getSubmissionById;
const getSubmissionByProblemId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const problemId = req.query.problemId;
        if (!problemId) {
            return res.status(400).json({
                message: "Please provide a valid problem id"
            });
        }
        const submissions = yield prisma_1.prisma.submission.findMany({
            where: {
                problemId: problemId
            }
        });
        if (submissions.length === 0) {
            return res.status(404).json({
                message: "No submissions found for the given problem ID"
            });
        }
        return res.status(200).json({
            message: "Submissions found",
            submissions: submissions
        });
    }
    catch (err) {
        console.error("[GET SUBMISSION BY PROBLEM ID ERROR]");
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
});
exports.getSubmissionByProblemId = getSubmissionByProblemId;
const getSubmissionForUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            return res.status(400).json({
                message: "userId not found"
            });
        }
        const submissions = yield prisma_1.prisma.submission.findMany({
            where: {
                userId: userId
            }
        });
        if (!submissions) {
            return res.status(400).json({
                message: "No submission for this user"
            });
        }
        return res.status(200).json({
            message: "Submission found",
            submissions: submissions
        });
    }
    catch (err) {
        console.error("[GET SUBMISSION BY PROBLEM ID ERROR]");
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
});
exports.getSubmissionForUser = getSubmissionForUser;
