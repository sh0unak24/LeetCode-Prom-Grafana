"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rootRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_routes_1 = require("../modules/auth/routes/auth.routes");
const admin_routes_1 = require("../modules/admin/routes/admin.routes");
const problems_routes_1 = require("../modules/problems/routes/problems.routes");
const submissions_route_1 = require("../modules/submissions/routes/submissions.route");
exports.rootRouter = express_1.default.Router();
exports.rootRouter.use("/auth", auth_routes_1.authRouter);
exports.rootRouter.use("/admin", admin_routes_1.adminRouter);
exports.rootRouter.use("/problems", problems_routes_1.problemsRouter);
exports.rootRouter.use("/submission", submissions_route_1.submissionsRouter);
