import { Difficulty } from "../../domain/types/Difficulty"
import { ProblemSetupDTO } from "./ProblemSetupDTO"

export type ProblemDTO = {
  id: string,
  title: string,
  statement: string,
  description: string,
  difficulty: Difficulty,
  setups: ProblemSetupDTO[],
  createdAt: Date,
  updatedAt: Date,
}