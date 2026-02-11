import { Request , Response } from "express"
import jwt from 'jsonwebtoken'
import bcrypt from "bcryptjs"

import {z} from "zod"
import { adminLoginSchema, adminSignupSchema } from "../validators/admin.schema"
import { prisma } from "../../../lib/prisma"


export const adminSignup = async ( req : Request , res : Response ) => {
    try{
        const parsed = adminSignupSchema.safeParse(req.body);

        if (!parsed.success) {
            const pretty = z.prettifyError(parsed.error);
            return res.status(400).json({
                message: "Validation error",
                errors: pretty
            });
        }

        const {email ,  password} = req.body;
        
        if(!email || !password){
            return res.status(400).json({
                message : "Please provide all the values"
            })
        }

        const existingUser = await prisma.admin.findUnique({
            where : {
                email
            }
        })

        if(existingUser){
            return res.status(409).json({
                message : "Admin already exists"
            }
        )}

        const hashedPassword = await bcrypt.hash(password , 10);

        const admin = await prisma.admin.create({
            data : {
                email,
                password : hashedPassword
            }
        })


        res.status(200).json({
            message : "admin signup successfull",
            admin : {
                id : admin.id,
                email : admin.email
            }
        })
    } catch(err){
        console.error("[SIGNUP ERROR]" , err)

        res.status(500).json({
            message : "Internal Server Error"
        })
    }
}

export const adminLogin = async (req: Request, res: Response) => {
    try {

        const parsed = adminLoginSchema.safeParse(req.body);

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
  
        const admin = await prisma.admin.findUnique({
            where: { email },
        });
    
        if (!admin) {
            return res.status(401).json({
            message: "Invalid credentials",
            });
        }
    
        const isPasswordValid = await bcrypt.compare(password, admin.password);
    
        if (!isPasswordValid) {
            return res.status(401).json({
            message: "Invalid credentials",
            });
        }
    
        const token = jwt.sign(
            { userId: admin.id, 
                role: "ADMIN",
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
            admin: {
            id: admin.id,
            email: admin.email,
            },
        });
        } catch (err) {
        console.error("[LOGIN_ERROR]", err);
    
        return res.status(500).json({
            message: "Internal Server Error",
        });
        }
};