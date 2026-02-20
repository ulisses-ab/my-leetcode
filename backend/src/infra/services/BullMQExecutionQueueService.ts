import { Queue } from "bullmq";
import { IExecutionQueueService } from "../../application/services/interfaces/IExecutionQueueService";

export class BullMQExecutionQueueService implements IExecutionQueueService {
  constructor(
    private readonly queue: Queue
  ) {}

  async enqueue(submissionId: string): Promise<void> {
    await this.queue.add("execute-submission", { submissionId });
  }
}