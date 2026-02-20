import type { Results } from "./Results"
import type { Submission } from "./Submission"

export type SubmissionWithResults = {
  results: Results,
  submission: Submission,
}