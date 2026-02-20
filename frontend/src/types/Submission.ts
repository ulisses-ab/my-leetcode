export type Submission = {
  id: string,
  userId: string,
  problemId: string,
  setupId: string,
  status: string,
  submittedAt: Date,
  finishedAt?: Date | null,
}