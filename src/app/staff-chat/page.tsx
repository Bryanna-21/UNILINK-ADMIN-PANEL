"use client";

import { useEffect, useRef, useState } from "react";
import { Send, Trash2, MessagesSquare } from "lucide-react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { useAuthStore } from "@/store/auth.store";
import api from "@/lib/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// One shared room for admins and superadmins. Backend: GET/POST /staff-chat/messages,
// DELETE /staff-chat/messages/:id. Refreshes every 5 seconds while the tab is visible.
interface Msg {
  id: string;
  text: string;
  createdAt: string;
  sender: { id: string; name: string; role: string };
  mine: boolean;
}

export default function StaffChatPage() {
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();
  const [text, setText] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const { data: messages = [], isLoading, error } = useQuery<Msg[]>({
    queryKey: ["staff-chat"],
    queryFn: async () => (await api.get("/staff-chat/messages", { params: { limit: 100 } })).data.data || [],
    refetchInterval: 5000,
    refetchIntervalInBackground: false,
  });

  const send = useMutation({
    mutationFn: async (body: string) => api.post("/staff-chat/messages", { text: body }),
    onSuccess: () => {
      setText("");
      queryClient.invalidateQueries({ queryKey: ["staff-chat"] });
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => api.delete(`/staff-chat/messages/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["staff-chat"] }),
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const submit = () => {
    const body = text.trim();
    if (body && !send.isPending) send.mutate(body);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-8rem)]">
        <div className="mb-4">
          <h1 className="text-3xl font-display font-semibold text-ink">Staff Chat</h1>
          <p className="text-ink-muted mt-2 text-sm">A shared room for admins and superadmins.</p>
        </div>

        <div className="card flex-1 overflow-y-auto p-4 space-y-3">
          {isLoading && <p className="text-ink-muted text-sm">Loading...</p>}
          {error && <p className="text-danger text-sm">Could not load the staff room.</p>}
          {!isLoading && !error && messages.length === 0 && (
            <div className="text-center py-12 text-ink-muted">
              <MessagesSquare size={40} className="mx-auto mb-3 opacity-30" />
              No messages yet. Say hello.
            </div>
          )}
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.mine ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] rounded-card px-4 py-2 border ${m.mine ? "bg-accent text-white border-accent" : "bg-surface-raised text-ink border-border"}`}>
                {!m.mine && (
                  <p className="text-xs font-semibold text-ink-muted mb-1">
                    {m.sender.name} · {m.sender.role}
                  </p>
                )}
                <p className="text-sm whitespace-pre-wrap break-words">{m.text}</p>
                <div className="flex items-center justify-end gap-2 mt-1">
                  <span className={`text-[10px] ${m.mine ? "text-white/80" : "text-ink-muted"}`}>
                    {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                  {(m.mine || user?.role === "superadmin") && (
                    <button
                      onClick={() => confirm("Delete this message for everyone?") && remove.mutate(m.id)}
                      className={`${m.mine ? "text-white/80 hover:text-white" : "text-ink-muted hover:text-danger"}`}
                      title="Delete"
                      aria-label="Delete message"
                    >
                      <Trash2 size={12} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="mt-3 flex gap-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit();
              }
            }}
            rows={2}
            maxLength={2000}
            className="input-field flex-1"
            placeholder="Message the staff room (Enter to send, Shift+Enter for a new line)"
            aria-label="Message"
          />
          <button onClick={submit} disabled={!text.trim() || send.isPending} className="btn-primary flex items-center gap-2 disabled:opacity-50">
            <Send size={16} />
            Send
          </button>
        </div>
        {send.isError && <p className="text-danger text-sm mt-2">Message not sent. Please try again.</p>}
      </div>
    </DashboardLayout>
  );
}
