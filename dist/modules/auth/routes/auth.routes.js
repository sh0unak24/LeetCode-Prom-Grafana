"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_controllers_1 = require("../controllers/auth.controllers");
exports.authRouter = express_1.default.Router();
exports.authRouter.get("/", () => {
    console.log("Inside auth router");
});
exports.authRouter.post("/signup", auth_controllers_1.signup);
exports.authRouter.post("/login", auth_controllers_1.login);
