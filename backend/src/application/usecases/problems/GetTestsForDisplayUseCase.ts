import { IProblemRepo } from "../../../domain/repos/IProblemRepo";
import { IObjectStorageService } from "../../services/interfaces/IObjectStorageService";
import { AppError } from "../../errors/AppError";
import { ErrorCode } from "../../errors/ErrorCode";
import { Problem } from "../../../domain/entities/Problem";
import test from "node:test";

export type GetTestsForDisplayInput = {
  problemId: string,
  setupId?: string,
}

export type GetTestsForDisplayOutput = {
  tests: {
    testcases: unknown[]; 
    [key: string]: unknown;
  };
};

type TestsRaw = {
  testcases: unknown[];
  [key: string]: unknown;
};

export class GetTestsForDisplayUseCase {
  constructor(
    private readonly problemRepo: IProblemRepo,
    private readonly objectStorageService: IObjectStorageService,
  ) {}

  public async execute(input: GetTestsForDisplayInput): Promise<GetTestsForDisplayOutput> {
    const { problemId, setupId } = input;

    const problem = await this.problemRepo.findById(problemId);

    if (!problem) {
      throw new AppError(ErrorCode.PROBLEM_NOT_FOUND, "Problem not found");
    }

    const testsFileKey = this.getTestsFileKey(problem, setupId);
    const testsRaw = await this.downloadAndParseTests(testsFileKey);
    const maskedTestcases = this.maskTestcases(testsRaw.testcases);

    return { 
      tests: {
        ...testsRaw,
        testcases: maskedTestcases,
      }
    };
  }

  private getTestsFileKey(problem: Problem, setupId?: string): string {
    if (setupId) {
      return this.getSetupTestsFileKey(problem, setupId);
    }
    return this.getDefaultTestsFileKey(problem);
  }

  private getSetupTestsFileKey(problem: Problem, setupId: string): string {
    const setup = problem.setups.find(s => s.id === setupId);

    if (!setup) {
      throw new AppError(ErrorCode.SETUP_NOT_FOUND, "Problem setup not found");
    }

    if (setup.testsFileKey) {
      return setup.testsFileKey;
    }

    if (problem.defaultTestsFileKey) {
      return problem.defaultTestsFileKey;
    }

    throw new AppError(ErrorCode.TESTS_NOT_FOUND, "Tests file not found for this setup");
  }

  private getDefaultTestsFileKey(problem: Problem): string {
    if (!problem.defaultTestsFileKey) {
      throw new AppError(ErrorCode.TESTS_NOT_FOUND, "Default tests file not found for this problem");
    }

    return problem.defaultTestsFileKey;
  }

  private async downloadAndParseTests(testsFileKey: string): Promise<TestsRaw> {
    console.log("DS")
    const testsFileContent = await this.objectStorageService.download(testsFileKey);
    console.log("DE")

    let testsRaw: TestsRaw;
    try {
      testsRaw = JSON.parse(testsFileContent.toString());
    } catch {
      throw new AppError(ErrorCode.INVALID_TESTS_FILE, "Tests file is invalid JSON");
    }

    if (!testsRaw || !Array.isArray(testsRaw.testcases)) {
      throw new AppError(ErrorCode.INVALID_TESTS_FILE, "Tests must have a testcases array");
    }

    return testsRaw;
  }

  private maskTestcases(testcases: unknown[]): unknown[] {
    return testcases.map((testcase: any) => {
      if (testcase?.hidden) {
        return { hidden: true };
      }
      return testcase;
    });
  }
}