import { IProblemRepo } from "../../../domain/repos/IProblemRepo";
import { IObjectStorageService } from "../../services/interfaces/IObjectStorageService";
import { AppError } from "../../errors/AppError";
import { ErrorCode } from "../../errors/ErrorCode";
import { assertUserIsRole } from "../../helpers/assertUserIsRole";
import { IUserRepo } from "../../../domain/repos/IUserRepo";
import { Role } from "../../../domain/types/Role";
import { Problem } from "../../../domain/entities/Problem";
import { ProblemSetup } from "../../../domain/entities/ProblemSetup";

export type SubmitTestsFileInput = {
  userId: string,
  problemId: string,
  setupId?: string,
  fileContent: Buffer,
}

export type SubmitTestsFileOutput = {
  success: boolean
};

export class SubmitTestsFileUseCase {
  constructor(
    private readonly problemRepo: IProblemRepo,
    private readonly userRepo: IUserRepo,
    private readonly objectStorageService: IObjectStorageService,
  ) {}

  public async execute(input: SubmitTestsFileInput): Promise<SubmitTestsFileOutput> {
    const { userId, problemId, setupId, fileContent } = input;

    console.log(userId, problemId, setupId, fileContent);

    await assertUserIsRole(userId, Role.ADMIN, this.userRepo);

    const problem = await this.problemRepo.findById(problemId);

    if (!problem) {
      throw new AppError(ErrorCode.PROBLEM_NOT_FOUND, "Problem not found");
    }

    if (setupId) {
      await this.uploadTestsForSetup(problem, setupId, fileContent);
    } else {
      await this.uploadDefaultTests(problem, problemId, fileContent);
    }

    return { 
      success: true
    }
  }

  private async uploadTestsForSetup(
    problem: Problem,
    setupId: string,
    fileContent: Buffer
  ): Promise<void> {
    const setup = problem.setups.find((s: ProblemSetup) => s.id === setupId);

    if (!setup) {
      throw new AppError(ErrorCode.SETUP_NOT_FOUND, "Problem setup not found");
    }

    const testsFileKey = `problems/${problem.id}/setups/${setupId}/tests`;

    await this.objectStorageService.upload(testsFileKey, fileContent);

    setup.testsFileKey = testsFileKey;
    setup.updatedAt = new Date();
    problem.updatedAt = new Date();

    try {
      await this.problemRepo.save(problem);
    } catch (error) {
      await this.objectStorageService.delete(testsFileKey);
      throw error;
    }
  }

  private async uploadDefaultTests(
    problem: Problem,
    problemId: string,
    fileContent: Buffer
  ): Promise<void> {
    const testsFileKey = `problems/${problemId}/default-tests`;

    await this.objectStorageService.upload(testsFileKey, fileContent);

    problem.defaultTestsFileKey = testsFileKey;
    problem.updatedAt = new Date();

    try {
      await this.problemRepo.save(problem);
    } catch (error) {
      await this.objectStorageService.delete(testsFileKey);
      throw error;
    }
  }
}





