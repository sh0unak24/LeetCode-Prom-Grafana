"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.submissionsRouter = void 0;
const express_1 = __importDefault(require("express"));
const submissions_controllers_1 = require("../controllers/submissions.controllers");
const authenticate_middlewate_1 = require("../../../middleware/authenticate.middlewate");
exports.submissionsRouter = express_1.default.Router();
exports.submissionsRouter.post("/", authenticate_middlewate_1.authenticate, submissions_controllers_1.createSubmission);
exports.submissionsRouter.get("/me", authenticate_middlewate_1.authenticate, submissions_controllers_1.getSubmissionForUser);
exports.submissionsRouter.get("/", authenticate_middlewate_1.authenticate, submissions_controllers_1.getSubmissionByProblemId);
exports.submissionsRouter.get("/:id", authenticate_middlewate_1.authenticate, submissions_controllers_1.getSubmissionById);
