import { SubmissionStatus } from "../../domain/types/SubmissionStatus";

export type SubmissionDTO = {
  id: string,
  userId: string,
  problemId: string,
  setupId: string,
  status: SubmissionStatus,
  submittedAt: Date,
  finishedAt?: Date | null,
}