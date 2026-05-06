import React, { Suspense, Component } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from "./api/queryClient";

// Lightweight routes — load eagerly
import { Problems } from "./pages/Problems";
import { OAuthReturn } from "./pages/OAuthReturn";
import { Terms } from "./pages/Terms";
import { Privacy } from "./pages/Privacy";

// Heavy routes — lazy-load so mobile only pays for what it visits
const ProblemDetail = React.lazy(() =>
  import("./pages/ProblemDetail").then((m) => ({ default: m.ProblemDetail }))
);
const Profile = React.lazy(() =>
  import("./pages/Profile").then((m) => ({ default: m.Profile }))
);
const Resources = React.lazy(() =>
  import("./pages/Resources").then((m) => ({ default: m.Resources }))
);

function ViewportFrame() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[100] border-[4px] md:border-[6px] border-bb-accent"
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[99] bb-scanlines"
      />
    </>
  );
}


interface ErrorBoundaryState { error: Error | null }

class AppErrorBoundary extends Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex h-screen flex-col items-center justify-center gap-4 bg-bb-bg px-6">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-bb-error">
            Something went wrong
          </p>
          <pre className="max-w-sm overflow-auto font-mono text-[10px] text-bb-muted-strong whitespace-pre-wrap">
            {this.state.error.message}
          </pre>
          <button
            onClick={() => window.location.reload()}
            className="px-3 py-1.5 border-2 border-bb-border/55 font-mono text-[10px] uppercase tracking-[0.14em] text-bb-muted-strong hover:text-bb-accent hover:border-bb-accent transition-colors"
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const App: React.FC = () => {
  return (
    <AppErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Router>
          <ViewportFrame />
            <Routes>
              <Route path="/oauth-return" element={<OAuthReturn />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/problems/:id" element={<ProblemDetail />} />
              <Route path="/problems" element={<Problems />} />
              <Route path="/" element={<Problems />} />
            </Routes>
        </Router>
      </QueryClientProvider>
    </AppErrorBoundary>
  );
};

export default App;
