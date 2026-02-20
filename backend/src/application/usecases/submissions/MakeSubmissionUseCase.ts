import { SubmissionDTO } from "../../dtos/SubmissionDTO";
import { ISubmissionRepo } from "../../../domain/repos/ISubmissionRepo";
import { IProblemRepo } from "../../../domain/repos/IProblemRepo";
import { IUserRepo } from "../../../domain/repos/IUserRepo";
import { IObjectStorageService } from "../../services/interfaces/IObjectStorageService";
import { IUUIDService } from "../../services/interfaces/IUUIDService";
import { AppError } from "../../errors/AppError";
import { ErrorCode } from "../../errors/ErrorCode";
import { IExecutionQueueService } from "../../services/interfaces/IExecutionQueueService";
import { Submission } from "../../../domain/entities/Submission";
import { SubmissionStatus } from "../../../domain/types/SubmissionStatus";
import { mapSubmissionToDTO } from "../../mappers/mapSubmissionToDTO";

export type MakeSubmissionInput = {
  userId: string,
  problemId: string,
  setupId: string,
  fileContent: Buffer,
  temporary: boolean,
}

export type MakeSubmissionOutput = {
  submission: SubmissionDTO, 
}

export class MakeSubmissionUseCase {
  constructor(
    private readonly userRepo: IUserRepo,
    private readonly problemRepo: IProblemRepo,
    private readonly objectStorageService: IObjectStorageService,
    private readonly uuidService: IUUIDService,
    private readonly submissionRepo: ISubmissionRepo,
    private readonly executionQueueService: IExecutionQueueService,
  ) {}

  public async execute(input: MakeSubmissionInput): Promise<MakeSubmissionOutput> {
    const { userId, problemId, setupId, fileContent, temporary } = input;

    const user = this.userRepo.findById(userId);
    if (!user) {
      throw new AppError(ErrorCode.USER_NOT_FOUND, "User not found");
    }

    const problem = await this.problemRepo.findById(problemId);
    if (!problem) {
      throw new AppError(ErrorCode.PROBLEM_NOT_FOUND, "Problem not found");
    }

    const setup = problem.setups.find(s => s.id === setupId);
    if (!setup) {
      throw new AppError(ErrorCode.SETUP_NOT_FOUND, "Problem setup not found");
    }

    const id = this.uuidService.generate();

    const codeFileKey = `submissions/${id}/code`;
    await this.objectStorageService.upload(codeFileKey, fileContent);

    const testsFileKey = setup.testsFileKey;

    if (!testsFileKey) {
      //throw new AppError(ErrorCode.SETUP_INCOMPLETE, "Problem setup is incomplete");
    }
    
    const submission: Submission = {
      id,
      userId,
      problemId,
      setupId,
      codeFileKey,
      status: SubmissionStatus.PENDING,
      submittedAt: new Date(),
      temporary,
    }

    try {
      await this.executionQueueService.enqueue(id);

      await this.submissionRepo.save(submission);
    }
    catch (error) {
      await this.objectStorageService.delete(codeFileKey);
      throw error;
    }

    console.log(submission);

    return {
      submission: mapSubmissionToDTO(submission),
    }
  }
}