import { SubmissionDTO } from "../../dtos/SubmissionDTO";
import { ISubmissionRepo } from "../../../domain/repos/ISubmissionRepo";
import { mapSubmissionToDTO } from "../../mappers/mapSubmissionToDTO";

export type GetLatestSubmissionForProblemInput = {
  userId: string,
  problemId: string,
}

export type GetLatestSubmissionForProblemOutput = {
  submission: SubmissionDTO | null,
}

export class GetLatestSubmissionForProblemUseCase {
  constructor(
    private readonly submissionRepo: ISubmissionRepo,
  ) {}

  public async execute(input: GetLatestSubmissionForProblemInput): Promise<GetLatestSubmissionForProblemOutput> {
    const { userId, problemId } = input;

    const submission = await this.submissionRepo.findLatestByUserIdAndProblemId(userId, problemId);

    return {
      submission: submission ? mapSubmissionToDTO(submission) : null,
    };
  }
}