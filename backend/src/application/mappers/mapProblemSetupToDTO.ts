import { ProblemSetup } from "../../domain/entities/ProblemSetup";
import { ProblemSetupDTO } from "../dtos/ProblemSetupDTO";

export function mapProblemSetupToDTO(setup: ProblemSetup): ProblemSetupDTO {
  return {
    id: setup.id,
    problemId: setup.problemId,
    language: setup.language,
    info: setup.info,
  };
}