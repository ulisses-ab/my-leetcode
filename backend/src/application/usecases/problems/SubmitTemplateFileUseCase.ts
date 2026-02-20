import { IProblemRepo } from "../../../domain/repos/IProblemRepo";
import { IObjectStorageService } from "../../services/interfaces/IObjectStorageService";
import { AppError } from "../../errors/AppError";
import { ErrorCode } from "../../errors/ErrorCode";
import { assertUserIsRole } from "../../helpers/assertUserIsRole";
import { IUserRepo } from "../../../domain/repos/IUserRepo";
import { Role } from "../../../domain/types/Role";
import { Problem } from "../../../domain/entities/Problem";
import { ProblemSetup } from "../../../domain/entities/ProblemSetup";

export type SubmitTemplateFileInput = {
  userId: string,
  problemId: string,
  setupId: string,
  fileContent: Buffer,
}

export type SubmitTemplateFileOutput = {
  success: boolean
};

export class SubmitTemplateFileUseCase {
  constructor(
    private readonly problemRepo: IProblemRepo,
    private readonly userRepo: IUserRepo,
    private readonly objectStorageService: IObjectStorageService,
  ) {}

  public async execute(input: SubmitTemplateFileInput): Promise<SubmitTemplateFileOutput> {
    const { userId, problemId, setupId, fileContent } = input;

    console.log(userId, problemId, setupId, fileContent);

    await assertUserIsRole(userId, Role.ADMIN, this.userRepo);

    const problem = await this.problemRepo.findById(problemId);

    if (!problem) {
      throw new AppError(ErrorCode.PROBLEM_NOT_FOUND, "Problem not found");
    }

    const setup = problem.setups.find(setup => setup.id === setupId);

    if (!setup) {
      throw new AppError(ErrorCode.SETUP_NOT_FOUND, "Setup not found");
    }

    const templateFileKey = `problems/${problem.id}/setups/${setupId}/template`;

    await this.objectStorageService.upload(templateFileKey, fileContent);

    setup.templateFileKey = templateFileKey
    setup.updatedAt = new Date();
    problem.updatedAt = new Date();

    try {
      await this.problemRepo.save(problem);
    } catch (error) {
      await this.objectStorageService.delete(templateFileKey);
      throw error;
    }

    return { 
      success: true
    }
  }
}





