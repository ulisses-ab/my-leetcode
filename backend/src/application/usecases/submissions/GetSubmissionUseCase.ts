import { SubmissionDTO } from "../../dtos/SubmissionDTO";
import { ISubmissionRepo } from "../../../domain/repos/ISubmissionRepo";
import { AppError } from "../../errors/AppError";
import { ErrorCode } from "../../errors/ErrorCode";
import { mapSubmissionToDTO } from "../../mappers/mapSubmissionToDTO";

export type GetSubmissionInput = {
  userId: string,
  submissionId: string,
}

export type GetSubmissionOutput = {
  submission: SubmissionDTO,
}

export class GetSubmissionUseCase {
  constructor(
    private readonly submissionRepo: ISubmissionRepo,
  ) {}

  public async execute(input: GetSubmissionInput): Promise<GetSubmissionOutput> {
    const { userId, submissionId } = input;

    const submission = await this.submissionRepo.findById(submissionId);
    if (!submission) {
      throw new AppError(ErrorCode.SUBMISSION_NOT_FOUND, "Submission not found");
    }

    if (submission.userId !== userId) {
      throw new AppError(ErrorCode.UNAUTHORIZED, "User is not authorized to access this submission");
    }

    return {
      submission: mapSubmissionToDTO(submission),
    };
  }
};