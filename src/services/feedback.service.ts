import api from "@/lib/axios";
import { readFeedbackPage, type FeedbackFilter, type FeedbackItem, type FeedbackPage, type FeedbackStatus } from "@/lib/feedback-view";

// Problem reports and ideas sent from the app and the website (backend /api/admin/feedback).
// An administrator tied to one university sees only that university's reports; the backend decides, not this file.
export async function getFeedback(status: FeedbackFilter, page: number, limit = 20): Promise<FeedbackPage> {
  const response = await api.get("/admin/feedback", { params: { status, page, limit } });
  return readFeedbackPage(response.data);
}

export async function setFeedbackStatus(id: string, status: FeedbackStatus): Promise<FeedbackItem | null> {
  const response = await api.patch(`/admin/feedback/${id}`, { status });
  const page = readFeedbackPage({ data: [response.data?.data] });
  return page.items[0] ?? null;
}
