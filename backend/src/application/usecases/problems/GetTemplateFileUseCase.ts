import { IProblemRepo } from "../../../domain/repos/IProblemRepo";
import { IObjectStorageService } from "../../services/interfaces/IObjectStorageService";
import { AppError } from "../../errors/AppError";
import { ErrorCode } from "../../errors/ErrorCode";
import { assertUserIsRole } from "../../helpers/assertUserIsRole";
import { IUserRepo } from "../../../domain/repos/IUserRepo";
import { Role } from "../../../domain/types/Role";
import { Problem } from "../../../domain/entities/Problem";
import { ProblemSetup } from "../../../domain/entities/ProblemSetup";

export type GetTemplateFileInput = {
  problemId: string,
  setupId: string,
}

export type GetTemplateFileOutput = {
  fileContent: Buffer,
};

export class GetTemplateFileUseCase {
  constructor(
    private readonly problemRepo: IProblemRepo,
    private readonly objectStorageService: IObjectStorageService,
  ) {}

  public async execute(input: GetTemplateFileInput): Promise<GetTemplateFileOutput> {
    const { problemId, setupId } = input;

    const problem = await this.problemRepo.findById(problemId);

    if (!problem) {
      throw new AppError(ErrorCode.PROBLEM_NOT_FOUND, "Problem not found");
    }


    const setup = problem.setups.find(setup => setup.id === setupId);

    if (!setup || !setup.templateFileKey) {
      throw new AppError(ErrorCode.SETUP_NOT_FOUND, "Setup or template file not found");
    }

    let fileContent: Buffer;

    fileContent = await this.objectStorageService.download(setup.templateFileKey);


    return { fileContent };
  }
}
