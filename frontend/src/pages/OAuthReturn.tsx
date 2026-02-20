import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store";
import { fetchUser } from "@/api/functions/user";

export function OAuthReturn() {
  const [searchParams] = useSearchParams();
  const login = useAuthStore((s) => s.login);

  useEffect(() => {
    const func = async () => {
      const token = searchParams.get("token");
      const state = searchParams.get("state");

      if (!token) {
        console.error("OAuth token missing");
        return;
      }

      const user = await fetchUser(token);

      if (!user) {
        console.error("User not found");
        return;
      }

      login(user, token);

      let returnURL = "/";
      try {
        const parsed = JSON.parse(decodeURIComponent(state!));
        returnURL = parsed?.returnURL || "/";
        console.log(parsed);
      } catch {}

      window.location.href = returnURL;
    };

    func();
  }, [searchParams, login]);

  return null;
}
