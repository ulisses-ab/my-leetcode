import { ISubmissionRepo } from "../../../domain/repos/ISubmissionRepo";
import { IUserRepo } from "../../../domain/repos/IUserRepo";
import { IObjectStorageService } from "../../services/interfaces/IObjectStorageService";
import { assertUserIsRole } from "../../helpers/assertUserIsRole";
import { Role } from "../../../domain/types/Role";
import { AppError } from "../../errors/AppError";
import { ErrorCode } from "../../errors/ErrorCode";
import { SubmissionStatus } from "../../../domain/types/SubmissionStatus";

export type SubmitExecutionResultsInput = {
  userId: string,
  submissionId: string,
  fileContent: Buffer,
  status: SubmissionStatus, 
}

export type SubmitExecutionResultsOutput = void;

export class SubmitExecutionResultsUseCase {
  constructor(
    private readonly submissionRepo: ISubmissionRepo,
    private readonly userRepo: IUserRepo,
    private readonly objectStorageService: IObjectStorageService,
  ) {}

  public async execute(input: SubmitExecutionResultsInput): Promise<SubmitExecutionResultsOutput> {
    const { userId, submissionId, fileContent, status } = input;

    await assertUserIsRole(userId, Role.EXECUTION_ENGINE, this.userRepo);

    if(status == SubmissionStatus.PENDING) {
      throw new AppError(ErrorCode.INVALID_INPUT, "Invalid submission status");
    }

    const submission = await this.submissionRepo.findById(submissionId);
    if(!submission) {
      throw new AppError(ErrorCode.SUBMISSION_NOT_FOUND, "Submission not found");
    }

    if(submission.status !== SubmissionStatus.PENDING) {
      throw new AppError(ErrorCode.INVALID_SUBMISSION_STATE, "Cannot submit results for a submission that is not in PENDING state");
    }

    const resultsFileKey = `submissions/${submissionId}/results`;
    await this.objectStorageService.upload(resultsFileKey, fileContent);

    submission.resultsFileKey = resultsFileKey;
    submission.status = status;
    submission.finishedAt = new Date();

    try {
      await this.submissionRepo.save(submission);
    }
    catch (error) {
      await this.objectStorageService.delete(resultsFileKey);
      throw error;
    }
  }
}