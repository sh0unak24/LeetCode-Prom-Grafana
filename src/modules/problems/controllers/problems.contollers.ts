import { Request , Response } from "express"
import { prisma } from "../../../lib/prisma";
import { createProblemSchema } from "../validators/problems.validations";
import z from "zod";

export const getProblems = async ( req : Request , res : Response) => {
    try {
        const problems = await prisma.problem.findMany();
        if(!problems){
            return res.status(400).json({
                message : "No problems to fetch"
            })
        }

        res.status(200).json({
            message : "Problems fetched successfully",
            problems : problems
        })

    } catch(err){
        console.error("[GET PROBLEMS]" , err)
        res.status(500).json({
            message : "Internal Server Error"
        })
    }
}

export const getProblemBySlug = async (req: Request, res: Response) => {
    try {
        const { slug } = req.params;
  

        if (!slug || Array.isArray(slug)) {
        return res.status(400).json({
            message: "Invalid problem slug",
        });
        }
  
        const problem = await prisma.problem.findUnique({
            where: { slug },
            select: {
            id: true,
            slug: true,
            title: true,
            difficulty: true,
            description: true,
            constraints: true,
            },
        });
    
        if (!problem) {
            return res.status(404).json({
            message: "Problem not found",
            });
        }
    
        return res.status(200).json(problem);
        } catch (err) {
        console.error("[GET PROBLEM BY SLUG]", err);
    
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};


export const createProblem = async ( req : Request , res : Response) => {
    try{
        const parsed = createProblemSchema.safeParse(req.body);

        if (!parsed.success) {
            const pretty = z.prettifyError(parsed.error);
            return res.status(400).json({
                message: "Validation error",
                errors: pretty
            });
        }
        
        const {title , slug , constraints , difficulty , description} = req.body;
        if(!title || !slug || !constraints || !description || !difficulty){
            return res.status(400).json({
                message : "Please provide all the fields"
            })
        }

        const existingProblem = await prisma.problem.findUnique({
            where : {
                slug
            }
        })

        if(existingProblem){
            return res.status(409).json({
                message : "Problem already exists"
            })
        }

        const problem = await prisma.problem.create({
            data : {
                title,
                slug,
                description,
                constraints,
                difficulty
            }
        })

        return res.status(201).json({
            message : "Problem Created",
            problem : {
                id : problem.id,
                slug : problem.slug,
                description : problem.description,
                constraints : problem.constraints,
                difficulty : problem.difficulty
            }
        })

    } catch(err){
        console.error("[CREATE PROBLEM]", err);
    
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
} 