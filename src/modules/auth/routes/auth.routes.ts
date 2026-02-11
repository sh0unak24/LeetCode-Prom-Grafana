import express from 'express'
import { login, signup } from '../controllers/auth.controllers'


export const authRouter = express.Router()

authRouter.get("/" , () => {
    console.log("Inside auth router")
})
authRouter.post("/signup" , signup)
authRouter.post("/login" , login)
