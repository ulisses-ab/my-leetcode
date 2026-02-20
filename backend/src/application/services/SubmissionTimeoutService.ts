import { ISubmissionRepo } from "../../domain/repos/ISubmissionRepo";
import { SubmissionStatus } from "../../domain/types/SubmissionStatus";

export class SubmissionTimeoutService {
  constructor(
    private submissionRepo: ISubmissionRepo,
  ) {}

  async markTimedOutSubmissions(timeoutInMs: number): Promise<void> {
    const now = new Date();
    const timeoutDate = new Date(now.getTime() - timeoutInMs);

    const timedOutSubmissions = await this.submissionRepo.findAllByStatusBeforeDate(SubmissionStatus.PENDING, timeoutDate);

    for (const submission of timedOutSubmissions) {
      submission.status = SubmissionStatus.FAILED;
      submission.finishedAt = now;
      
      await this.submissionRepo.save(submission);
    }
  }
}