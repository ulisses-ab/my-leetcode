import { Queue } from "bullmq";

import dotenv from "dotenv";
dotenv.config();

export const queue = new Queue("execution-queue", {
  connection: {
    url: process.env.REDIS_URL!
  }
});
