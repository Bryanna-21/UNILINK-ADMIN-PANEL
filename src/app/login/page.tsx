"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, Eye, EyeOff } from "lucide-react";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/auth.store";

export default function LoginPage() {
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
    try {
      setLoading(true); setError("");
      const response = await api.post("/admin/auth/login", { email, password });
      const { user, accessToken } = response.data;
      setAuth(user, accessToken);
      const next = searchParams.get("next");
      router.push(next && next.startsWith("/") ? next : "/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Unable to sign you in. Check your credentials and try again.");
    } finally { setLoading(false); }
  }

  return (
    <main className="min-h-screen bg-slate-50 grid lg:grid-cols-2">
      <section className="hidden lg:flex bg-[#0b1730] relative overflow-hidden p-12 text-white items-end">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(37,99,235,.35),transparent_32%)]" />
        <div className="absolute right-[-80px] top-[-80px] h-72 w-72 rounded-full bg-blue-600/20 blur-3xl" />
        <div className="relative max-w-xl">
          <div className="flex items-center gap-3 mb-8"><div className="h-11 w-11 rounded-xl bg-blue-600 flex items-center justify-center font-extrabold">U</div><span className="text-2xl font-extrabold">UniLink</span></div>
          <p className="text-sm font-semibold text-blue-300 uppercase tracking-[.2em]">University Operations</p>
          <h1 className="text-5xl font-extrabold tracking-tight mt-4 leading-tight">One control center for the entire UniLink ecosystem.</h1>
          <p className="text-slate-300 mt-5 max-w-lg">Manage institutions, users, reports and platform activity from one secure administrative workspace.</p>
        </div>
      </section>

      <section className="flex items-center justify-center p-5 sm:p-8">
        <form onSubmit={handleLogin} className="w-full max-w-[440px]">
          <div className="mb-8">
            <div className="lg:hidden flex items-center gap-3 mb-8"><div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-extrabold">U</div><span className="text-xl font-extrabold text-slate-900">UniLink</span></div>
            <div className="h-11 w-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5"><ShieldCheck size={23} /></div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Admin sign in</h2>
            <p className="text-slate-500 mt-2">Access the UniLink administration console.</p>
          </div>

          {error && <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>}

          <label className="block text-sm font-semibold text-slate-700 mb-2">Email address</label>
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full h-12 rounded-xl border border-slate-200 bg-white px-4 text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition" placeholder="admin@unilink.app" />

          <label className="block text-sm font-semibold text-slate-700 mt-5 mb-2">Password</label>
          <div className="relative">
            <input type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full h-12 rounded-xl border border-slate-200 bg-white px-4 pr-12 text-slate-900 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition" placeholder="Enter your password" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
          </div>

          <button disabled={loading} className="w-full h-12 mt-7 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold shadow-lg shadow-blue-600/20 transition">
            {loading ? "Signing you in..." : "Sign in"}
          </button>
          <p className="text-center text-xs text-slate-400 mt-6">Authorized administrators only.</p>
        </form>
      </section>
    </main>
  );
}
