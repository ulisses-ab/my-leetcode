export interface IExecutionQueueService {
  enqueue(submissionId: string): Promise<void>;
}