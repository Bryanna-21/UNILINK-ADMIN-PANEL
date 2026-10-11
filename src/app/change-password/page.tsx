"use client";

import { useState } from "react";
import { KeyRound } from "lucide-react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import api from "@/lib/axios";

// Two steps, same as the app: 1) confirm your current password and choose a new one, which
// emails a code (POST /auth/request-password-change); 2) enter the code
// (POST /auth/confirm-password-change). The new password only takes effect after step 2.
export default function ChangePasswordPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirmNext, setConfirmNext] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const fail = (e: any, fallback: string) => setError(e?.response?.data?.message || fallback);

  const requestCode = async () => {
    setError("");
    if (next.length < 8) return setError("The new password must be at least 8 characters long.");
    if (next !== confirmNext) return setError("The new passwords do not match.");
    setBusy(true);
    try {
      await api.post("/auth/request-password-change", {
        currentPassword: current,
        newPassword: next,
        confirmNewPassword: confirmNext,
      });
      setStep(2);
    } catch (e) {
      fail(e, "Could not start the password change.");
    } finally {
      setBusy(false);
    }
  };

  const confirmCode = async () => {
    setError("");
    setBusy(true);
    try {
      await api.post("/auth/confirm-password-change", { code: code.trim() });
      setCurrent("");
      setNext("");
      setConfirmNext("");
      setCode("");
      setStep(3);
    } catch (e) {
      fail(e, "That code was not accepted.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-md">
        <div className="mb-6">
          <h1 className="text-3xl font-display font-semibold text-ink">Change Password</h1>
          <p className="text-ink-muted mt-2 text-sm">A code is emailed to you to confirm the change.</p>
        </div>

        <div className="card p-6 space-y-4">
          {step === 1 && (
            <>
              <div>
                <label className="block text-sm font-medium text-ink mb-2">Current password</label>
                <input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} className="input-field" autoComplete="current-password" />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-2">New password</label>
                <input type="password" value={next} onChange={(e) => setNext(e.target.value)} className="input-field" autoComplete="new-password" />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink mb-2">Confirm new password</label>
                <input type="password" value={confirmNext} onChange={(e) => setConfirmNext(e.target.value)} className="input-field" autoComplete="new-password" />
              </div>
              <button onClick={requestCode} disabled={busy || !current || !next || !confirmNext} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
                <KeyRound size={16} />
                {busy ? "Sending code..." : "Send me a code"}
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <p className="text-sm text-ink">Enter the code we emailed you.</p>
              <input type="text" inputMode="numeric" value={code} onChange={(e) => setCode(e.target.value)} className="input-field" placeholder="Code" autoComplete="one-time-code" />
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} disabled={busy} className="btn-secondary flex-1">
                  Back
                </button>
                <button onClick={confirmCode} disabled={busy || !code.trim()} className="btn-primary flex-1 disabled:opacity-50">
                  {busy ? "Checking..." : "Change password"}
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <div className="text-center py-4">
              <p className="text-ink font-semibold">Password changed.</p>
              <p className="text-ink-muted text-sm mt-1">Use the new password the next time you sign in.</p>
            </div>
          )}

          {error && <p className="text-danger text-sm">{error}</p>}
        </div>
      </div>
    </DashboardLayout>
  );
}
