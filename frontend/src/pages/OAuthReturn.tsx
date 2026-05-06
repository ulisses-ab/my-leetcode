import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/features/auth/store";
import { fetchUser } from "@/api/functions/user";

export function OAuthReturn() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      if (searchParams.get("error")) {
        setError("Authentication failed. Please try again.");
        return;
      }

      const token = searchParams.get("token");
      if (!token) {
        setError("Authentication failed: no token received.");
        return;
      }

      const user = await fetchUser(token);
      if (!user) {
        setError("Authentication failed: could not load user.");
        return;
      }

      login(user, token);

      let returnPath = "/";
      try {
        const state = searchParams.get("state");
        const parsed = JSON.parse(state!);
        const url = new URL(parsed?.returnURL ?? "/");
        returnPath = url.pathname + url.search + url.hash;
      } catch {}

      navigate(returnPath, { replace: true });
    };

    run();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bb-red-grid">
        <p className="font-display uppercase text-bb-error text-lg tracking-tight">{error}</p>
        <a
          href="/"
          className="inline-flex items-center px-4 h-9 border-2 border-bb-border/55 bg-bb-surface/72 font-sans text-xs uppercase tracking-wide text-bb-ink hover:border-bb-accent hover:text-bb-accent transition-colors"
        >
          Go back
        </a>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bb-red-grid">
      <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-bb-muted-strong animate-pulse">
        Signing in…
      </p>
    </div>
  );
}
