import { SubmissionDTO } from "../../dtos/SubmissionDTO";
import { ISubmissionRepo } from "../../../domain/repos/ISubmissionRepo";
import { AppError } from "../../errors/AppError";
import { ErrorCode } from "../../errors/ErrorCode";
import { mapSubmissionToDTO } from "../../mappers/mapSubmissionToDTO";
import { IObjectStorageService } from "../../services/interfaces/IObjectStorageService";

export type GetSubmissionWithResultsInput = {
  userId: string,
  submissionId: string,
}

export type GetSubmissionWithResultsOutput = {
  submission: SubmissionDTO,
  results: unknown | null,
}

export class GetSubmissionWithResultsUseCase {
  constructor(
    private readonly submissionRepo: ISubmissionRepo,
    private readonly objectStorageService: IObjectStorageService,
  ) {}

  public async execute(input: GetSubmissionWithResultsInput): Promise<GetSubmissionWithResultsOutput> {
    const { userId, submissionId } = input;

    const submission = await this.submissionRepo.findById(submissionId);
    if (!submission) {
      throw new AppError(ErrorCode.SUBMISSION_NOT_FOUND, "Submission not found");
    }

    if (submission.userId !== userId) {
      throw new AppError(ErrorCode.UNAUTHORIZED, "User is not authorized to access this submission");
    }

    let results: unknown | null = null;

    if(submission.resultsFileKey) {
      const resultsFileContent = await this.objectStorageService.download(submission.resultsFileKey);
      results = JSON.parse(resultsFileContent.toString());
    }

    return {
      submission: mapSubmissionToDTO(submission),
      results,
    };
  }
};