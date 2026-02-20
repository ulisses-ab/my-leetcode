import { useQuery } from "@tanstack/react-query";
import { fetchProblem, fetchProblems, fetchTemplate, fetchTests } from "../functions/problems";

export function useProblem(problemId: string | null) {
  return useQuery({
    queryKey: ["problem", problemId],
    queryFn: () => fetchProblem(problemId!),
    enabled: !!problemId,
  });
}

export function useProblems() {
  return useQuery({
    queryKey: ["problem"],
    queryFn: fetchProblems,
  });
}

export function useTemplate(problemId: string, setupId: string) {
  return useQuery({
    queryKey: ["template", problemId, setupId],
    queryFn: () => fetchTemplate(problemId, setupId),
    enabled: !!problemId && !!setupId,
    retry: 1,
  });
}

export function useTests(problemId: string, setupId: string) {
  return useQuery({
    queryKey: ["tests", problemId, setupId],
    queryFn: () => fetchTests(problemId, setupId),
  });
}