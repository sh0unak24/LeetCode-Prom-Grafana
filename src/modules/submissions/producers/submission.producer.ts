import { submissionQueue } from "../queue/submission.queue";

export const enqueueSubmission = async (submissionId: string) => {
  await submissionQueue.add(
    "execute",
    { submissionId },
    {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 2000,
      },
      removeOnComplete: true,
      removeOnFail: false,
    }
  );
};