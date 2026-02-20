import { ISubmissionRepo } from "../../domain/repos/ISubmissionRepo";
import { IObjectStorageService } from "./interfaces/IObjectStorageService";
import { SubmissionStatus } from "../../domain/types/SubmissionStatus";

export class TemporarySubmissionCleanupService {
  constructor(
    private submissionRepo: ISubmissionRepo,
    private objectStorageService: IObjectStorageService,
  ) {}

  public async cleanupTemporarySubmissions(expirationMs: number): Promise<void> {
    const now = new Date();
    const expirationDate = new Date(now.getTime() - expirationMs);

    const temporarySubmissions = await this.submissionRepo.findAllTemporaryBeforeDate(expirationDate);

    for (const submission of temporarySubmissions) {
      await this.objectStorageService.delete(submission.codeFileKey);
      if (submission.resultsFileKey) {
        await this.objectStorageService.delete(submission.resultsFileKey);
      }

      await this.submissionRepo.deleteById(submission.id);
    }
  }
}