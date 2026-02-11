import express from "express"
import { createSubmission, getSubmissionById, getSubmissionByProblemId, getSubmissionForUser } from "../controllers/submissions.controllers"
import { authenticate } from "../../../middleware/authenticate.middlewate"

export const submissionsRouter = express.Router()


submissionsRouter.post("/" , authenticate ,createSubmission)

submissionsRouter.get("/me" , authenticate , getSubmissionForUser);
submissionsRouter.get("/" , authenticate , getSubmissionByProblemId);
submissionsRouter.get("/:id" , authenticate , getSubmissionById);
