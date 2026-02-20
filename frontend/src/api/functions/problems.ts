import type { Problem } from "@/types/Problem";
import { api } from "../api";
import type { Tests } from "@/types/Tests";

export async function fetchProblems(): Promise<Problem[]> {
  const res = await api.get("/problems");
  return res.data.problems;
}

export async function fetchProblem(id: string): Promise<Problem | null> {
  const res = await api.get(`/problems/${id}`);
  return res.data.problem;
}

export async function fetchTemplate(problemId: string, setupId: string): Promise<File | null> {
  const res = await api.get(`/problems/${problemId}/setups/${setupId}/template`, {
    responseType: "arraybuffer",
  });

  const file = new File([res.data], `${setupId}-template.zip`, { type: "application/zip" });
  return file;
}

export async function fetchTests(problemId: string, setupId: string): Promise<Tests | null> {
  const res = await api.get(`/problems/${problemId}/setups/${setupId}/tests`);
  return res.data.tests;
}