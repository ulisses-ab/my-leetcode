import type { User } from "@/types/User";
import { api } from "../api";

export async function fetchUser(token: string): Promise<User | null> {
  try {
    const response = await api.get("/users/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error fetching user:", error.response?.data || error.message);
    return null;
  }
}