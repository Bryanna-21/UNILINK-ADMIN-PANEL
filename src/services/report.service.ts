import api from "@/lib/axios";

// Points at /emergency/reports, not /admin/reports - no such admin-panel
// route was ever built. getAuthorizedReports (backend) already exists,
// fully built, for the EmergencyReport model - safety/medical/abuse
// reports, not flagged posts/comments. It returns everything the
// caller's role can see with no server-side status filter, so filtering
// by status happens here on the client.
//
// Status vocabulary is the real EmergencyReport enum, not the
// lowercase open/resolved/dismissed this file used to send: OPEN,
// ACKNOWLEDGED, RESPONDING, ESCALATED, RESOLVED, DISMISSED.
//
// Known backend limitation as of this writing: PATCH .../status only
// accepts role "admin" - a logged-in superadmin using this same admin
// panel would get a 403 from the backend itself. Flagged upstream,
// not silently worked around here.
export type ReportStatus = "OPEN" | "ACKNOWLEDGED" | "RESPONDING" | "ESCALATED" | "RESOLVED" | "DISMISSED";

export async function getReports(status?: ReportStatus) {
  const response = await api.get("/emergency/reports");
  const payload = response.data;
  if (!status) return payload;
  return {
    ...payload,
    data: (payload.data ?? []).filter((report: any) => report.status === status),
  };
}

// updateReportStatus (backend) only accepts moving a report to RESOLVED
// or DISMISSED - not back to OPEN, and not to ACKNOWLEDGED/RESPONDING/
// ESCALATED, which have their own dedicated endpoints below.
export async function setReportStatus(reportId: string, status: "RESOLVED" | "DISMISSED") {
  const response = await api.patch(`/emergency/reports/${reportId}/status`, { status });
  return response.data;
}

// PATCH /emergency/reports/:id/acknowledge - moves an OPEN report to ACKNOWLEDGED.
export async function acknowledgeReport(reportId: string) {
  const response = await api.patch(`/emergency/reports/${reportId}/acknowledge`);
  return response.data;
}

// POST /emergency/reports/:id/respond - records an internal note (required) and moves
// an OPEN or ACKNOWLEDGED report to RESPONDING.
export async function respondToReport(reportId: string, note: string) {
  const response = await api.post(`/emergency/reports/${reportId}/respond`, { note });
  return response.data;
}
