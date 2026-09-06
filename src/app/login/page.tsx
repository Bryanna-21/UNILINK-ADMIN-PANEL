"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

import api from "@/lib/axios";
import { useAuthStore } from "@/store/auth.store";

type LoginStep = "credentials" | "twoFactor";

function safeNextPath(raw: string | null): string {
  if (!raw) return "/dashboard";
  if (!raw.startsWith("/") || raw.startsWith("//")) return "/dashboard";
  return raw;
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setAuth } = useAuthStore();

  const [step, setStep] = useState<LoginStep>("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [pendingUserId, setPendingUserId] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/login", {
        email: email.trim().toLowerCase(),
        password,
      });

      const data = response.data;

      // Backend requires 2FA verification before issuing a JWT.
      if (data?.requiresTwoFactor && data?.userId) {
        setPendingUserId(String(data.userId));
        setStep("twoFactor");
        return;
      }

      const { user, token } = data ?? {};

      if (!token || !user) {
        throw new Error(
          "The server returned an incomplete login response."
        );
      }

      // Only administrators may enter this panel.
      if (
        user.role !== "admin" &&
        user.role !== "superadmin"
      ) {
        setError(
          "This account doesn't have administrator access."
        );
        return;
      }

      setAuth(user, token);

      router.replace(
        safeNextPath(searchParams.get("next"))
      );
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleTwoFactor(e: React.FormEvent) {
    e.preventDefault();

    const code = twoFactorCode
      .replace(/\D/g, "")
      .slice(0, 6);

    if (code.length !== 6) {
      setError("Enter the 6-digit verification code.");
      return;
    }

    if (!pendingUserId) {
      setError(
        "Your login session expired. Please sign in again."
      );

      setStep("credentials");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await api.post(
        "/auth/verify-login-otp",
        {
          userId: pendingUserId,
          code,
        }
      );

      const { user, token } = response.data ?? {};

      if (!token || !user) {
        throw new Error(
          "The server returned an incomplete login response."
        );
      }

      if (
        user.role !== "admin" &&
        user.role !== "superadmin"
      ) {
        setError(
          "This account doesn't have administrator access."
        );
        return;
      }

      setAuth(user, token);

      router.replace(
        safeNextPath(searchParams.get("next"))
      );
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Invalid or expired verification code."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-bg">
      <form
        onSubmit={
          step === "credentials"
            ? handleLogin
            : handleTwoFactor
        }
        className="card w-full max-w-[420px] p-8"
      >
        <div className="mb-8">
          <h1 className="text-3xl font-display font-semibold text-ink">
            UniLink
          </h1>

          <p className="text-ink-muted mt-2 text-sm">
            {step === "credentials"
              ? "Admin authentication"
              : "Two-factor verification"}
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="bg-danger/10 border border-danger/25 text-danger p-4 rounded-lg mb-6 text-sm"
          >
            {error}
          </div>
        )}

        {step === "credentials" ? (
          <>
            <div className="mb-5">
              <label
                htmlFor="email"
                className="block mb-2 text-sm text-ink-muted"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                required
                autoComplete="username"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="input-field"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="password"
                className="block mb-2 text-sm text-ink-muted"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  className="input-field pr-11"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((v) => !v)
                  }
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading
                ? "Signing in..."
                : "Sign in"}
            </button>
          </>
        ) : (
          <>
            <div className="mb-6">
              <label
                htmlFor="twoFactorCode"
                className="block mb-2 text-sm text-ink-muted"
              >
                Verification code
              </label>

              <input
                id="twoFactorCode"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]{6}"
                maxLength={6}
                required
                autoFocus
                value={twoFactorCode}
                onChange={(e) =>
                  setTwoFactorCode(
                    e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 6)
                  )
                }
                className="input-field tracking-[0.35em] text-center"
              />

              <p className="text-ink-muted text-xs mt-2">
                Enter the 6-digit code sent to your email.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full"
            >
              {loading
                ? "Verifying..."
                : "Verify and sign in"}
            </button>

            <button
              type="button"
              onClick={() => {
                setStep("credentials");
                setPendingUserId("");
                setTwoFactorCode("");
                setError("");
              }}
              className="w-full mt-3 text-sm text-ink-muted hover:text-ink"
            >
              Back to sign in
            </button>
          </>
        )}
      </form>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
