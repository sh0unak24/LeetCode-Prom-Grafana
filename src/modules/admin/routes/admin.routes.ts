import express from 'express'
import { adminLogin, adminSignup } from '../controllers/admin.controllers'

export const adminRouter = express.Router()

adminRouter.post("/signup" , adminSignup)
adminRouter.post("/login" , adminLogin)
