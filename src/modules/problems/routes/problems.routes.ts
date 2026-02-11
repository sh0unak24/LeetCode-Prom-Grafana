import express from "express"
import { createProblem, getProblemBySlug, getProblems } from "../controllers/problems.contollers"
import { authenticate } from "../../../middleware/authenticate.middlewate"
import { requireAdmin } from "../../../middleware/admin.middleware"

export const problemsRouter = express.Router()

problemsRouter.get("/" , authenticate , getProblems)
problemsRouter.get("/:slug" , getProblemBySlug)
problemsRouter.post("/" , authenticate , requireAdmin , createProblem)