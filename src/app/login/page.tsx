"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

import api from "@/lib/axios";
import { useAuthStore } from "@/store/auth.store";

// Only ever redirect to a path within this app after login — never an
// absolute/external URL, even if one somehow ends up in ?next=. This is
// what section 7 of the original brief means by "do not allow arbitrary
// external redirect URLs" (an open redirect is a real phishing vector).
function safeNextPath(raw: string | null): string {
  if (!raw) return "/dashboard";
  if (!raw.startsWith("/") || raw.startsWith("//")) return "/dashboard";
  return raw;
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Real backend contract: POST /api/auth/login returns
      // { status, message, token, user }. NOT /admin/auth/login,
      // and NOT accessToken — see UNILINK-BACKEND src/routes/auth.routes.js.
      const response = await api.post("/auth/login", { email, password });
      const { user, token } = response.data;

      if (user.role !== "admin") {
        // Authentication succeeded, but this account has no admin
        // access. Do not sign them into the panel's auth store at all —
        // send them to /unauthorized without a session, rather than
        // create a token in localStorage for an account that can't use it.
        setError("This account doesn't have administrator access.");
        setLoading(false);
        return;
      }

      setAuth(user, token);
      router.push(safeNextPath(searchParams.get("next")));
    } catch (err: any) {
      setError(err?.response?.data?.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-bg">
      <form onSubmit={handleLogin} className="card w-full max-w-[420px] p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-semibold text-ink">UniLink</h1>
          <p className="text-ink-muted mt-2 text-sm">Admin authentication</p>
        </div>

        {error && (
          <div
            role="alert"
            className="bg-danger/10 border border-danger/25 text-danger p-4 rounded-lg mb-6 text-sm"
          >
            {error}
          </div>
        )}

        <div className="mb-5">
          <label htmlFor="email" className="block mb-2 text-sm text-ink-muted">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="password" className="block mb-2 text-sm text-ink-muted">
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field pr-11"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}

// useSearchParams requires a Suspense boundary in the App Router.
export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
