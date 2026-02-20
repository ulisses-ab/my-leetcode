import { Submission } from "../../domain/entities/Submission";
import { SubmissionDTO } from "../dtos/SubmissionDTO";

export function mapSubmissionToDTO(submission: Submission): SubmissionDTO {
  return {
    id: submission.id,
    userId: submission.userId,
    problemId: submission.problemId,
    setupId: submission.setupId,
    status: submission.status,
    submittedAt: submission.submittedAt,
    finishedAt: submission.finishedAt,
  };
}