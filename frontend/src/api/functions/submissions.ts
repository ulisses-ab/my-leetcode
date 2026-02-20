import type { Submission } from "@/types/Submission";
import { api } from "../api";
import type { SubmissionWithResults } from "@/types/SubmissionWithResults";

export async function postSubmission(
  problemId: string,
  setupId: string,
  file: File,
  temporary?: boolean
): Promise<Submission> {
  const formData = new FormData();
  formData.append("file", file);
  if (temporary !== undefined) {
    formData.append("temporary", temporary.toString());
  }

  const res = await api.post(
    `/problems/${problemId}/setups/${setupId}/submissions`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data.submission;
}

export async function getAllSubmissionsForProblem(
  problemId: string,
): Promise<Submission[]> {
  const res = await api.get(
    `/problems/${problemId}/submissions`
  );
  return res.data.submissions;
}

export async function getLatestSubmissionForProblem(
  problemId: string,
): Promise<Submission | null> {
  const res = await api.get(
    `/problems/${problemId}/submissions/latest`
  );
  return res.data.submission;
}

export async function getSubmissionWithResults(id: string): Promise<SubmissionWithResults | null> {
  const res = await api.get(
    `/submissions/${id}/results`
  );
  return res.data;
}