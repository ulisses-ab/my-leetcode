import { Language } from "../types/Language";

export type ProblemSetup = {
  id: string,
  problemId: string,
  language: Language,
  info: string,

  templateFileKey: string | null,
  runnerFileKey: string | null,
  testsFileKey: string | null,

  createdAt: Date,
  updatedAt: Date,
}