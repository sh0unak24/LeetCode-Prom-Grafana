import { Queue } from "bullmq";
import { redis } from "../../../lib/redis";


export const SUBMISSION_QUEUE_NAME = "submission-execute";

export const submissionQueue = new Queue(SUBMISSION_QUEUE_NAME, {
  connection: redis,
});