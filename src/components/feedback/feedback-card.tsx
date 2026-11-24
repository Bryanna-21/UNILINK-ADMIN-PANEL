"use client";

import { categoryLabel, contextFacts, nextActions, statusEdge, statusLabel, type FeedbackItem, type FeedbackStatus } from "@/lib/feedback-view";

interface Props {
  item: FeedbackItem;
  busy?: boolean;
  error?: string;
  onSetStatus: (status: FeedbackStatus) => void;
}

export default function FeedbackCard({ item, busy, error, onSetStatus }: Props) {
  const facts = contextFacts(item.context);
  const actions = nextActions(item.status);

  return (
    <div className="card p-6 status-edge" data-status={statusEdge(item.status)}>
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-display font-semibold text-ink">{categoryLabel(item.category)}</h2>
            <span className="px-2.5 py-0.5 rounded-full bg-surface-raised text-xs text-ink-muted">{statusLabel(item.status)}</span>
            {item.reference && (
              <span className="px-2.5 py-0.5 rounded-full bg-surface-raised text-xs font-mono text-ink-muted select-all" title="Reference the person was given">
                {item.reference}
              </span>
            )}
          </div>

          <p className="text-ink-muted mt-2 text-sm">
            From {item.reporterName}
            {item.createdAt ? ` · ${new Date(item.createdAt).toLocaleString()}` : ""}
          </p>

          {/* Plain text only: React escapes it, and whitespace-pre-wrap keeps the person's line breaks. */}
          <p className="text-ink mt-3 text-sm whitespace-pre-wrap break-words">{item.message}</p>

          {facts.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {facts.map((fact) => (
                <span key={fact} className="px-2 py-0.5 rounded bg-surface-raised text-xs text-ink-muted">
                  {fact}
                </span>
              ))}
            </div>
          )}
          {item.context.userAgent && <p className="text-ink-muted text-xs mt-2 break-all">{item.context.userAgent}</p>}
        </div>

        <div className="flex flex-wrap gap-2 shrink-0">
          {actions.map((action, index) => (
            <button
              key={action.status}
              onClick={() => onSetStatus(action.status)}
              disabled={busy}
              aria-label={`${action.label}: report ${item.reference || item.id}`}
              className={`px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 ${
                index === 0 ? "bg-accent/15 text-accent-bright hover:bg-accent/25" : "bg-surface-raised text-ink-muted hover:text-ink"
              }`}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="text-sm text-danger mt-3" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
