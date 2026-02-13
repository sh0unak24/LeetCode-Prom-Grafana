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
Object.defineProperty(exports, "__esModule", { value: true });
exports.processSubmission = void 0;
const prisma_1 = require("../../lib/prisma");
const judge0_1 = require("../lib/judge0");
// Define or import LANGUAGE_MAP
const LANGUAGE_MAP = {
    javascript: 63,
    python: 71,
    java: 62,
    // Add other language mappings as needed
};
const processSubmission = (job) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { submissionId } = job.data;
    console.log("👷 Worker picked job:", job.id, job.data);
    const submission = yield prisma_1.prisma.submission.findUnique({
        where: { id: submissionId },
    });
    if (!submission)
        throw new Error("Submission not found");
    if (submission.status !== "PENDING")
        return;
    // 1️⃣ Mark RUNNING
    yield prisma_1.prisma.submission.update({
        where: { id: submissionId },
        data: { status: "RUNNING" },
    });
    const languageId = LANGUAGE_MAP[submission.language];
    if (!languageId)
        throw new Error("Unsupported language");
    // 2️⃣ Send to Judge0
    const token = yield (0, judge0_1.createJudge0Submission)(submission.sourceCode, languageId);
    // 3️⃣ Poll Judge0
    let result;
    while (true) {
        result = yield (0, judge0_1.getJudge0Result)(token);
        if (((_a = result.status) === null || _a === void 0 ? void 0 : _a.id) >= 3)
            break;
        yield new Promise((r) => setTimeout(r, 1000));
    }
    // 4️⃣ Map Judge0 status
    console.log("🧪 Judge0 result:", {
        status: result.status,
        stdout: result.stdout,
        stderr: result.stderr,
        compile_output: result.compile_output,
    });
    let finalStatus = "RUNTIME_ERROR";
    if (((_b = result.status) === null || _b === void 0 ? void 0 : _b.description) === "Accepted") {
        finalStatus = "ACCEPTED";
    }
    // 5️⃣ Update DB
    yield prisma_1.prisma.submission.update({
        where: { id: submissionId },
        data: {
            status: finalStatus,
            stdout: result.stdout,
            stderr: result.stderr,
        },
    });
});
exports.processSubmission = processSubmission;
