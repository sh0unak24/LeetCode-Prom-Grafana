import { Job } from "bullmq";
import { prisma } from "../../lib/prisma";
import {
  createJudge0Submission,
  getJudge0Result,
} from "../lib/judge0";

// Define SubmissionStatus type
type SubmissionStatus = "PENDING" | "RUNNING" | "ACCEPTED" | "RUNTIME_ERROR";

// Define or import LANGUAGE_MAP
const LANGUAGE_MAP: { [key: string]: number } = {
  javascript: 63,
  python: 71,
  java: 62,
  // Add other language mappings as needed
};


export const processSubmission = async (
  job: Job<{ submissionId: string }>
) => {
  const { submissionId } = job.data;
  console.log("👷 Worker picked job:", job.id, job.data);
  const submission = await prisma.submission.findUnique({
    where: { id: submissionId },
  });

  if (!submission) throw new Error("Submission not found");

  if (submission.status !== "PENDING") return;

  // 1️⃣ Mark RUNNING
  await prisma.submission.update({
    where: { id: submissionId },
    data: { status: "RUNNING" },
  });

  const languageId = LANGUAGE_MAP[submission.language];
  if (!languageId) throw new Error("Unsupported language");

  // 2️⃣ Send to Judge0
  const token = await createJudge0Submission(
    submission.sourceCode,
    languageId,
  );

  // 3️⃣ Poll Judge0
  let result;
  while (true) {
    result = await getJudge0Result(token);

    if (result.status?.id >= 3) break;

    await new Promise((r) => setTimeout(r, 1000));
  }

  // 4️⃣ Map Judge0 status
  console.log("🧪 Judge0 result:", {
    status: result.status,
    stdout: result.stdout,
    stderr: result.stderr,
    compile_output: result.compile_output,
  });
  let finalStatus: SubmissionStatus = "RUNTIME_ERROR";

  if (result.status?.description === "Accepted") {
    finalStatus = "ACCEPTED";
  }

  // 5️⃣ Update DB
  await prisma.submission.update({
    where: { id: submissionId },
    data: {
      status: finalStatus,
      stdout: result.stdout,
      stderr: result.stderr,
    },
  });
};