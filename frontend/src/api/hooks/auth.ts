import { useMutation } from "@tanstack/react-query";
import { api } from "@/api/api";
import { useAuthStore } from "@/features/auth/store";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "../queryClient";

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await api.get(`/users/me`);
      return res.data;
    },
  });
}