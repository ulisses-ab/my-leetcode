import type { ProblemSetup } from "./ProblemSetup"

export type Problem = {
  id: string,
  title: string,
  statement: string,
  difficulty: string,
  description: string,
  setups: ProblemSetup[],
  createdAt: Date,
  updatedAt: Date,
}