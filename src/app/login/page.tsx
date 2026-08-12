"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import api from "@/lib/axios";
import { useAuthStore } from "@/store/auth.store";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const { setAuth } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await api.post("/admin/auth/login", {
        email,
        password,
      });

      const { user, accessToken } = response.data;

      setAuth(user, accessToken);

      const next = searchParams.get("next");

      router.push(
        next && next.startsWith("/")
          ? next
          : "/dashboard"
      );
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="
        min-h-screen
        flex
        items-center
        justify-center
        p-6
      "
    >
      <form
        onSubmit={handleLogin}
        className="
          glass
          w-full
          max-w-[420px]
          rounded-3xl
          p-8
        "
      >
        <div className="mb-8">
          <h1 className="text-4xl font-bold">
            UniLink
          </h1>

          <p className="text-gray-400 mt-2">
            Admin authentication portal
          </p>
        </div>

        {error && (
          <div
            className="
              bg-red-500/20
              text-red-400
              p-4
              rounded-xl
              mb-6
            "
          >
            {error}
          </div>
        )}

        <div className="mb-5">
          <label className="block mb-2">
            Email
          </label>

          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="
              w-full
              p-4
              rounded-xl
              bg-white/5
              border
              border-white/10
              outline-none
            "
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2">
            Password
          </label>

          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="
              w-full
              p-4
              rounded-xl
              bg-white/5
              border
              border-white/10
              outline-none
            "
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="
            w-full
            bg-slate-700
            hover:bg-slate-600
            transition-all
            p-4
            rounded-xl
            font-semibold
            disabled:opacity-50
            disabled:cursor-not-allowed
          "
        >
          {loading
            ? "Authenticating..."
            : "Login"}
        </button>
      </form>
    </div>
  );
}

function LoginLoading() {
  return (
    <div
      className="
        min-h-screen
        flex
        items-center
        justify-center
        p-6
      "
    >
      <div className="glass w-full max-w-[420px] rounded-3xl p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-10 w-32 rounded bg-white/10" />
          <div className="h-4 w-56 rounded bg-white/10" />
          <div className="h-12 rounded bg-white/10" />
          <div className="h-12 rounded bg-white/10" />
          <div className="h-12 rounded bg-white/10" />
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoading />}>
      <LoginForm />
    </Suspense>
  );
}
