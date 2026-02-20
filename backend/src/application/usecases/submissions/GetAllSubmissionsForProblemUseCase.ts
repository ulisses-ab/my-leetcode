import { SubmissionDTO } from "../../dtos/SubmissionDTO";
import { ISubmissionRepo } from "../../../domain/repos/ISubmissionRepo";
import { mapSubmissionToDTO } from "../../mappers/mapSubmissionToDTO";

export type GetAllSubmissionsForProblemInput = {
  userId: string,
  problemId: string,
}

export type GetAllSubmissionsForProblemOutput = {
  submissions: SubmissionDTO[],
}

export class GetAllSubmissionsForProblemUseCase {
  constructor(
    private readonly submissionRepo: ISubmissionRepo,
  ) {}

  public async execute(input: GetAllSubmissionsForProblemInput): Promise<GetAllSubmissionsForProblemOutput> {
    const { userId, problemId } = input;

    const submissions = await this.submissionRepo.findAllByUserIdAndProblemId(userId, problemId);

    return {
      submissions: submissions.map(mapSubmissionToDTO)
    };
  }
}