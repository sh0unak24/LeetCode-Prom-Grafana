"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRouter = void 0;
const express_1 = __importDefault(require("express"));
const admin_controllers_1 = require("../controllers/admin.controllers");
exports.adminRouter = express_1.default.Router();
exports.adminRouter.post("/signup", admin_controllers_1.adminSignup);
exports.adminRouter.post("/login", admin_controllers_1.adminLogin);
