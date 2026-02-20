import { Difficulty } from "../types/Difficulty"
import { ProblemSetup } from "./ProblemSetup"

export type Problem = {
  id: string,
  title: string,
  description: string,
  statement: string, 
  difficulty: Difficulty,

  setups: ProblemSetup[],
  defaultTestsFileKey?: string | null,

  creatorId: string,
  
  createdAt: Date,
  updatedAt: Date,
}