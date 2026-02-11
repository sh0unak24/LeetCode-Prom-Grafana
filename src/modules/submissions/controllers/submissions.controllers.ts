import { Request , Response } from "express"
import { createSubmissionSchema } from "../validators/submissions.schema";
import z from "zod"
import { prisma } from "../../../lib/prisma";
import { AuthRequest } from "../../../middleware/authenticate.middlewate";

export const createSubmission = async ( req : AuthRequest , res : Response) => {
    try{
        const parsed = createSubmissionSchema.safeParse(req.body);
        if(!parsed.success){
            const pretty = z.prettifyError(parsed.error);
            return res.status(400).json({
                message : "Validation Error",
                error : pretty
            })
        }

        const {problemId , sourceCode , language} = req.body;
        if(!problemId || !sourceCode || !language){
            return res.status(400).json({
                message : "Please provide all the fields"
            })
        }

        const userId = req.user?.id; 

        if (!userId) {
            return res.status(400).json({
                message: "User ID is required"
            });
        }

        const submission = await prisma.submission.create({
            data: {
                userId,
                problemId,
                language,
                sourceCode
            }
        });

        return res.status(201).json({
            message : "Submission created successfully",
            submission : {
                userId  : submission.userId,
                problemId : submission.problemId,
                language : submission.language,
                sourceCode : submission.sourceCode
            }
        })

    }catch(err){
        console.error("[CREATE SUBMISSION ERROR]");
        return res.status(500).json({
            message : "Internal Server Error"
        })
    }

}


export const getSubmissionById = async ( req : Request , res : Response) => {
    try {
        const id = req.params.id as string;
        if(!id){
            return res.status(400).json({
                message : "Please provide a valid submission id"
            })
        }

        const submission = await prisma.submission.findUnique({
            where : {
                id : id
            }
        })

        if(!submission){
            return res.status(400).json({
                message : "Submission does not exist"
            })
        }

        return res.status(200).json({
            message : "Submision found",
            submission : submission
        })

    } catch(err){
        console.error("[GET SUBMISSION BY ID ERROR]");
        return res.status(500).json({
            message : "Internal Server Error"
        })
    }
} 

export const getSubmissionByProblemId = async (req : Request , res : Response) => {
    try{
        const problemId = req.query.problemId as string;
        if(!problemId){
            return res.status(400).json({
                message : "Please provide a valid problem id"
            })
        }

        const submissions = await prisma.submission.findMany({
            where : {
                problemId : problemId
            }
        });

        if (submissions.length === 0) {
            return res.status(404).json({
                message: "No submissions found for the given problem ID"
            });
        }

        return res.status(200).json({
            message: "Submissions found",
            submissions: submissions
        });
    } catch(err){
        console.error("[GET SUBMISSION BY PROBLEM ID ERROR]");
        return res.status(500).json({
            message : "Internal Server Error"
        })
    }
}

export const getSubmissionForUser = async (req : AuthRequest , res : Response) => {
    try{
        const userId = req.user?.id;
        if(!userId){
            return res.status(400).json({
                message : "userId not found"
            })
        }

        const submissions = await prisma.submission.findMany({
            where : {
                userId : userId
            }
        })
        if(!submissions){
            return res.status(400).json({
                message : "No submission for this user"
            })
        }

        return res.status(200).json({
            message : "Submission found",
            submissions : submissions
        })

    } catch(err){
        console.error("[GET SUBMISSION BY PROBLEM ID ERROR]");
        return res.status(500).json({
            message : "Internal Server Error"
        })
    }
}