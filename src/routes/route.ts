import express from 'express'
import { authRouter } from '../modules/auth/routes/auth.routes'
import { adminRouter } from '../modules/admin/routes/admin.routes'
import { problemsRouter } from '../modules/problems/routes/problems.routes'
import { submissionsRouter } from '../modules/submissions/routes/submissions.route'

export const rootRouter = express.Router()

rootRouter.use("/auth" , authRouter)
rootRouter.use("/admin" , adminRouter)
rootRouter.use("/problems" , problemsRouter)
rootRouter.use("/submission" , submissionsRouter)