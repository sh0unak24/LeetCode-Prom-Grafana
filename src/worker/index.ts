import { Worker } from "bullmq";
import { redis } from "./lib/redis";
import { SUBMISSION_QUEUE_NAME } from "./queues/submission.queue";
import { processSubmission } from "./processor/submission.processor";


console.log("🚀 Worker started, waiting for jobs...");

new Worker(
  SUBMISSION_QUEUE_NAME,
  async (job) => {
    await processSubmission(job);
  },
  {
    connection: redis,
    concurrency: 1,
  }
);