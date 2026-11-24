// Pure helpers for the Problem Reports page: labels, what an admin may do next, and a defensive reader for what the
// server sends. No React and no network, so they are unit-tested (tests/feedback-view.test.mjs).

export type FeedbackStatus = "new" | "seen" | "closed";
export type FeedbackFilter = FeedbackStatus | "all";
export type FeedbackCategory = "bug" | "idea" | "other";

export interface FeedbackContext {
  platform: string;
  appVersion: string;
  screen: string;
  userAgent: string;
}

export interface FeedbackItem {
  id: string;
  reference: string;
  category: FeedbackCategory;
  message: string; // plain text: always rendered as text, never as markup
  context: FeedbackContext;
  status: FeedbackStatus;
  universityId: string | null;
  reporterId: string;
  reporterName: string;
  handledAt: string | null;
  createdAt: string;
}

export interface FeedbackCounts {
  new: number;
  seen: number;
  closed: number;
}

export interface FeedbackPage {
  items: FeedbackItem[];
  counts: FeedbackCounts;
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export const STATUS_TABS: { label: string; value: FeedbackFilter }[] = [
  { label: "New", value: "new" },
  { label: "Seen", value: "seen" },
  { label: "Closed", value: "closed" },
  { label: "All", value: "all" },
];

const STATUSES: FeedbackStatus[] = ["new", "seen", "closed"];
const CATEGORIES: FeedbackCategory[] = ["bug", "idea", "other"];

const isObject = (v: unknown): v is Record<string, unknown> => v !== null && typeof v === "object" && !Array.isArray(v);
const str = (v: unknown, max = 5000): string => (typeof v === "string" ? v.slice(0, max) : "");
const num = (v: unknown, fallback = 0): number => (typeof v === "number" && Number.isFinite(v) && v >= 0 ? Math.floor(v) : fallback);

export function categoryLabel(category: string): string {
  return category === "bug" ? "Bug" : category === "idea" ? "Idea" : "Other";
}

export function statusLabel(status: string): string {
  return status === "seen" ? "Seen" : status === "closed" ? "Closed" : "New";
}

// The page's coloured edge uses the panel's existing status colours (see globals.css).
export function statusEdge(status: string): "open" | "pending" | "resolved" {
  return status === "closed" ? "resolved" : status === "seen" ? "pending" : "open";
}

export function platformLabel(platform: string): string {
  const p = platform.toLowerCase();
  return p === "android" ? "Android" : p === "ios" ? "iOS" : p === "web" ? "Website" : "";
}

// Short facts about where the report came from, skipping anything the app did not send.
export function contextFacts(context: Partial<FeedbackContext> | null | undefined): string[] {
  const c = context || {};
  const out: string[] = [];
  const platform = platformLabel(str(c.platform, 20));
  if (platform) out.push(platform);
  if (str(c.appVersion, 20)) out.push(`Version ${str(c.appVersion, 20)}`);
  if (str(c.screen, 80)) out.push(`Screen: ${str(c.screen, 80)}`);
  return out;
}

// What an admin may do next. Closed reports can be reopened, so a mistake is never permanent.
export function nextActions(status: string): { status: FeedbackStatus; label: string }[] {
  if (status === "new") return [{ status: "seen", label: "Mark seen" }, { status: "closed", label: "Close" }];
  if (status === "seen") return [{ status: "closed", label: "Close" }, { status: "new", label: "Mark new again" }];
  return [{ status: "new", label: "Reopen" }];
}

export function tabCount(filter: FeedbackFilter, counts: FeedbackCounts): number {
  return filter === "all" ? counts.new + counts.seen + counts.closed : counts[filter];
}

function readItem(raw: unknown): FeedbackItem | null {
  if (!isObject(raw)) return null;
  const id = str(raw.id, 64);
  if (!id) return null;
  const status = STATUSES.includes(raw.status as FeedbackStatus) ? (raw.status as FeedbackStatus) : "new";
  const category = CATEGORIES.includes(raw.category as FeedbackCategory) ? (raw.category as FeedbackCategory) : "other";
  const ctx = isObject(raw.context) ? raw.context : {};
  return {
    id,
    reference: str(raw.reference, 20),
    category,
    message: str(raw.message, 2500),
    context: { platform: str(ctx.platform, 20), appVersion: str(ctx.appVersion, 20), screen: str(ctx.screen, 80), userAgent: str(ctx.userAgent, 200) },
    status,
    universityId: typeof raw.universityId === "string" ? raw.universityId : null,
    reporterId: str(raw.reporterId, 64),
    reporterName: str(raw.reporterName, 120) || "Unknown user",
    handledAt: typeof raw.handledAt === "string" ? raw.handledAt : null,
    createdAt: str(raw.createdAt, 40),
  };
}

// Reads the server's answer to GET /api/admin/feedback. Anything malformed becomes an empty, safe page.
export function readFeedbackPage(raw: unknown): FeedbackPage {
  const body = isObject(raw) ? raw : {};
  const items = (Array.isArray(body.data) ? body.data : []).map(readItem).filter((x): x is FeedbackItem => x !== null);
  const counts = isObject(body.counts) ? body.counts : {};
  return {
    items,
    counts: { new: num(counts.new), seen: num(counts.seen), closed: num(counts.closed) },
    page: Math.max(1, num(body.page, 1)),
    limit: Math.max(1, num(body.limit, 25)),
    total: num(body.total, items.length),
    totalPages: Math.max(1, num(body.totalPages, 1)),
  };
}
