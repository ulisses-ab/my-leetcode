import { ProblemDTO } from "../../dtos/ProblemDTO";
import { mapProblemToDTO } from "../../mappers/mapProblemToDTO";
import { IProblemRepo } from "../../../domain/repos/IProblemRepo";
import { Difficulty } from "../../../domain/types/Difficulty";
import { Language } from "../../../domain/types/Language";

export type ListProblemsInput = {
  limit?: number;
  offset?: number;
  difficulty?: Difficulty; 
  language?: Language;
  searchText?: string;
} 

export type ListProblemsOutput = {
  problems: ProblemDTO[],
}

export class ListProblemsUseCase {
  constructor(
    private readonly problemRepo: IProblemRepo,
  ) {}

  public async execute(input: ListProblemsInput = {}): Promise<ListProblemsOutput> {
    const { limit, language,  offset, difficulty, searchText } = input;

    const problems = await this.problemRepo.findFiltered(
      limit,
      offset || 0,
      searchText,
      difficulty,
      language,
    );

    return {
      problems: problems.map(mapProblemToDTO)
    }
  }
}