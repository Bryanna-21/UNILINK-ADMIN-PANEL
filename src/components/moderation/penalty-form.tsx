"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

// Impose a penalty because of a report. Backend: POST /admin/moderation/reports/:id/actions.
// The server enforces every rule (the ladder, who may act on whom, the second moderator for
// closing an account) and answers with a plain-language message, which is shown as it is. This
// form only hides choices that are certain to be refused.

type ActionType = "warning" | "feature_restriction" | "temporary_suspension" | "permanent_termination" | "content_removal";

const ACTIONS: { id: ActionType; label: string; help: string }[] = [
  { id: "warning", label: "Warning", help: "A formal warning on the person's record. Nothing is switched off." },
  { id: "feature_restriction", label: "Restrict a feature", help: "Switches off one feature for a set number of days." },
  { id: "temporary_suspension", label: "Suspend the account", help: "Blocks the whole account for a set number of days." },
  {
    id: "permanent_termination",
    label: "Close the account",
    help: "Needs a DIFFERENT moderator to approve it within 7 days. In severe cases the account is frozen while it waits.",
  },
  { id: "content_removal", label: "Remove the content", help: "Deletes the reported content. It cannot be undone, and an appeal cannot bring it back." },
];
const FEATURES: [string, string][] = [
  ["posting", "Posting"],
  ["commenting", "Commenting"],
  ["messaging", "Messaging"],
  ["communities", "Communities"],
  ["uploads", "Uploading files"],
  ["reporting", "Sending reports"],
];
const REMOVABLE = ["post", "comment", "message", "discussion", "note", "past_paper", "library_resource", "event", "media", "video"];

export default function PenaltyForm({ report, reportId, isSuper, onDone }: { report: any; reportId: string; isSuper: boolean; onDone: () => void }) {
  const severe = report.severity === "P0" || report.severity === "P1";
  const available = ACTIONS.filter((a) => {
    if (a.id === "content_removal") return REMOVABLE.includes(report.entityType);
    if (a.id === "permanent_termination") return isSuper || severe;
    return true;
  });

  const [actionType, setActionType] = useState<ActionType>("warning");
  const [feature, setFeature] = useState("messaging");
  const [days, setDays] = useState("7");
  const [policySection, setPolicySection] = useState("");
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState("");

  const { data: standards } = useQuery({
    queryKey: ["standards"],
    queryFn: async () => (await api.get("/safety/standards")).data.data,
    staleTime: Infinity,
  });
  const sections: any[] = standards?.sections || [];
  const chosen = ACTIONS.find((a) => a.id === actionType)!;
  const timed = actionType === "feature_restriction" || actionType === "temporary_suspension";
  const dayCount = Number(days);
  const daysOk = !timed || (Number.isInteger(dayCount) && dayCount >= 1 && dayCount <= 90);

  const submit = async () => {
    const who = report.reportedUser?.name || "this person";
    const detail = timed ? ` for ${dayCount} day(s)` : "";
    if (!confirm(`${chosen.label}${detail} for ${who}? They will be shown the reason you wrote.`)) return;
    const body: Record<string, unknown> = { actionType, reason: reason.trim() };
    if (policySection) body.policySection = policySection;
    if (actionType === "feature_restriction") body.feature = feature;
    if (timed) body.durationDays = dayCount;
    setBusy(true);
    setError("");
    setDone("");
    try {
      const res = await api.post(`/admin/moderation/reports/${reportId}/actions`, body);
      const d = res.data?.data;
      setDone(
        d?.awaitingApproval
          ? `Proposed. A different moderator must approve it before ${new Date(d.approvalDeadline).toLocaleDateString()}${d.accountHeld ? ". The account is frozen until then" : ""}.`
          : "Done. The person has been told."
      );
      setReason("");
      onDone();
    } catch (e: any) {
      setError(e?.response?.data?.message || "That did not work. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card p-4 space-y-3">
      <div>
        <h3 className="text-sm font-semibold text-ink">Take action on the account</h3>
        <p className="text-xs text-ink-muted mt-1">
          About {report.reportedUser?.name}. The system will not let you skip the ladder: a first offence starts low unless the case is severe.
        </p>
      </div>

      <select value={actionType} onChange={(e) => setActionType(e.target.value as ActionType)} className="input-field" aria-label="Action">
        {available.map((a) => (
          <option key={a.id} value={a.id}>
            {a.label}
          </option>
        ))}
      </select>
      <p className="text-xs text-ink-muted">{chosen.help}</p>

      {actionType === "feature_restriction" && (
        <select value={feature} onChange={(e) => setFeature(e.target.value)} className="input-field" aria-label="Feature to restrict">
          {FEATURES.map(([id, name]) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>
      )}
      {timed && (
        <div>
          <label className="block text-xs font-medium text-ink mb-1">Days (1 to 90)</label>
          <input type="number" min={1} max={90} value={days} onChange={(e) => setDays(e.target.value)} className="input-field" />
        </div>
      )}

      <div>
        <label className="block text-xs font-medium text-ink mb-1">Community Standards section</label>
        <select value={policySection} onChange={(e) => setPolicySection(e.target.value)} className="input-field">
          <option value="">The section for this report&apos;s category</option>
          {sections.map((s) => (
            <option key={s.id} value={s.id}>
              {s.number}. {s.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-ink mb-1">Reason the person will be shown</label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
          maxLength={2000}
          className="input-field"
          placeholder="State what was done and which rule it broke. Never mention who reported it."
        />
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}
      {done && <p className="text-sm text-success">{done}</p>}

      <button onClick={submit} disabled={busy || !reason.trim() || !daysOk} className="btn-primary disabled:opacity-50">
        {busy ? "Working..." : actionType === "permanent_termination" ? "Propose closing the account" : "Apply"}
      </button>
    </div>
  );
}
