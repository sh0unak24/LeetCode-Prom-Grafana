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
exports.getJudge0Result = exports.createJudge0Submission = void 0;
const axios_1 = __importDefault(require("axios"));
const JUDGE0_URL = process.env.JUDGE0_URL || "http://localhost:2358";
const createJudge0Submission = (sourceCode, languageId) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield axios_1.default.post(`${JUDGE0_URL}/submissions`, {
        source_code: sourceCode,
        language_id: languageId,
        stdin: "",
    });
    return res.data.token;
});
exports.createJudge0Submission = createJudge0Submission;
const getJudge0Result = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield axios_1.default.get(`${JUDGE0_URL}/submissions/${token}`, {
        params: {
            base64_encoded: false,
            wait: false,
        },
    });
    return res.data;
});
exports.getJudge0Result = getJudge0Result;
