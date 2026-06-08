"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import api from "@/lib/axios";

import { useAuthStore } from "@/store/auth.store";

export default function LoginPage() {
  const router = useRouter();

  const { setAuth } =
    useAuthStore();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleLogin(
    e: React.FormEvent
  ) {
    e.preventDefault();

    try {
      setLoading(true);

      setError("");

      const response =
        await api.post(
          "/admin/auth/login",
          {
            email,
            password,
          }
        );

      const { user, accessToken } =
        response.data;

      setAuth(user, accessToken);

      router.push("/dashboard");
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
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
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
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
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
          disabled={loading}
          className="
          w-full
          bg-violet-600
          hover:bg-violet-700
          transition-all
          p-4
          rounded-xl
          font-semibold
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
