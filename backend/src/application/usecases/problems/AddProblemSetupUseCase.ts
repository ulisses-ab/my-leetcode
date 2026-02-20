import { ProblemSetup } from "../../../domain/entities/ProblemSetup";
import { ProblemSetupDTO } from "../../dtos/ProblemSetupDTO";
import { mapProblemSetupToDTO } from "../../mappers/mapProblemSetupToDTO";
import { Language } from "../../../domain/types/Language";
import { IProblemRepo } from "../../../domain/repos/IProblemRepo";
import { IUserRepo } from "../../../domain/repos/IUserRepo";
import { IUUIDService } from "../../services/interfaces/IUUIDService";
import { AppError } from "../../errors/AppError";
import { ErrorCode } from "../../errors/ErrorCode";
import { Role } from "../../../domain/types/Role";
import { assertUserIsRole } from "../../helpers/assertUserIsRole";

export type AddProblemSetupInput = {
  userId: string,
  problemId: string,
  language: Language,
  info: string,
}

export type AddProblemSetupOutput = {
  setup: ProblemSetupDTO,
}

export class AddProblemSetupUseCase {
  constructor(
    private readonly problemRepo: IProblemRepo,
    private readonly userRepo: IUserRepo,
    private readonly uuidService: IUUIDService,
  ) {}

  public async execute(input: AddProblemSetupInput): Promise<AddProblemSetupOutput> {
    const { userId, problemId, language, info } = input;
    
    await assertUserIsRole(userId, Role.ADMIN, this.userRepo);

    const problem = await this.problemRepo.findById(problemId);

    console.log("prob before", problem);

    if (!problem) {
      throw new AppError(ErrorCode.PROBLEM_NOT_FOUND, "Problem not found");
    }

    const setup: ProblemSetup = {
      id: this.uuidService.generate(),
      problemId,
      language,
      info,
      createdAt: new Date(),
      updatedAt: new Date(),
      testsFileKey: null,
      runnerFileKey: null,
      templateFileKey: null,
    }

    problem.setups.push(setup);

    console.log("prob after", problem);
    await this.problemRepo.save(problem);

    return {
      setup: mapProblemSetupToDTO(setup),
    }
  }
}