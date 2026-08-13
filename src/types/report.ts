// Matches UNILINK-BACKEND's EmergencyReport model (see
// src/models/EmergencyReport.js). Named "Report" for the admin panel's
// Reports page, but backed by emergency/safety reports specifically -
// there is no separate content-moderation report system in this backend.
export interface Report {
  _id: string;
  type: string;
  message?: string;
  location?: string;
  status: "open" | "resolved" | "dismissed";
  priority: "low" | "medium" | "high";
  createdAt: string;
  userId?: { name?: string; email?: string } | string;
}
