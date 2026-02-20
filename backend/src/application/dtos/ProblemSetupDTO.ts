import { Language } from "../../domain/types/Language"

export type ProblemSetupDTO = {
  id: string,
  problemId: string,
  language: Language,
  info: string,
}