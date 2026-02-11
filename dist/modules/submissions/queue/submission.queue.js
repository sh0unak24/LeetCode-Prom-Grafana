"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.submissionQueue = exports.SUBMISSION_QUEUE_NAME = void 0;
const bullmq_1 = require("bullmq");
const redis_1 = require("../../../lib/redis");
exports.SUBMISSION_QUEUE_NAME = "submission-execute";
exports.submissionQueue = new bullmq_1.Queue(exports.SUBMISSION_QUEUE_NAME, {
    connection: redis_1.redis,
});
