import { Request , Response } from "express"
import jwt from 'jsonwebtoken'
import bcrypt from "bcryptjs"

import {z} from "zod"
import { prisma } from "../../../lib/prisma";
import { loginSchema, signupSchema } from "../validators/auth.schema";

export const signup = async ( req : Request , res : Response ) => {
    try{
        const parsed = signupSchema.safeParse(req.body);

        if (!parsed.success) {
            const pretty = z.prettifyError(parsed.error);
            return res.status(400).json({
                message: "Validation error",
                errors: pretty
            });
        }

        const {email , name ,  password} = req.body;
        
        if(!email || !password || !name){
            return res.status(400).json({
                message : "Please provide all the values"
            })
        }

        const existingUser = await prisma.user.findUnique({
            where : {
                email 
            }
        })

        if(existingUser){
            return res.status(409).json({
                message : "User already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password , 10);

        const user = await prisma.user.create({
            data : {
                email,
                name , 
                password : hashedPassword
            }
        })


        res.status(200).json({
            message : "User signup successfull",
            user : {
                id : user.id,
                name : user.name,
                email : user.email
            }
        })
    } catch(err){
        console.error("[SIGNUP ERROR]" , err)

        res.status(500).json({
            message : "Internal Server Error"
        })
    }
}

export const login = async (req: Request, res: Response) => {
    try {

        const parsed = loginSchema.safeParse(req.body);

        if (!parsed.success) {
            const pretty = z.prettifyError(parsed.error);
            return res.status(400).json({
                message: "Validation error",
                errors: pretty
            });
        }

        const { email, password } = req.body;
  
        if (!email || !password) {
            return res.status(400).json({
            message: "Email and password are required",
            });
        }
  
        const user = await prisma.user.findUnique({
            where: { email },
        });
    
        if (!user) {
            return res.status(401).json({
            message: "Invalid credentials",
            });
        }
    
        const isPasswordValid = await bcrypt.compare(password, user.password);
    
        if (!isPasswordValid) {
            return res.status(401).json({
            message: "Invalid credentials",
            });
        }
    
        const token = jwt.sign(
            { userId: user.id , 
                role: "USER",
             },
            process.env.JWT_SECRET as string,
            {
            expiresIn: "7d",
            }
        );
    
        res.cookie("token", token, {
            httpOnly: true,       // prevents JS access
            secure: process.env.NODE_ENV === "production", // HTTPS only in prod
            sameSite: "strict",   // CSRF protection
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
    
        return res.status(200).json({
            message: "Login successful",
            user: {
            id: user.id,
            name: user.name,
            email: user.email,
            },
        });
        } catch (err) {
        console.error("[LOGIN_ERROR]", err);
    
        return res.status(500).json({
            message: "Internal Server Error",
        });
        }
};