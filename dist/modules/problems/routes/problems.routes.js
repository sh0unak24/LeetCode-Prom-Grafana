"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.problemsRouter = void 0;
const express_1 = __importDefault(require("express"));
const problems_contollers_1 = require("../controllers/problems.contollers");
const authenticate_middlewate_1 = require("../../../middleware/authenticate.middlewate");
const admin_middleware_1 = require("../../../middleware/admin.middleware");
exports.problemsRouter = express_1.default.Router();
exports.problemsRouter.get("/", authenticate_middlewate_1.authenticate, problems_contollers_1.getProblems);
exports.problemsRouter.get("/:slug", problems_contollers_1.getProblemBySlug);
exports.problemsRouter.post("/", authenticate_middlewate_1.authenticate, admin_middleware_1.requireAdmin, problems_contollers_1.createProblem);
