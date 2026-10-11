"use client";

import { useEffect, useState } from "react";
import { FileText, Search, Trash2 } from "lucide-react";
import DashboardLayout from "@/components/layout/dashboard-layout";
import api from "@/lib/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// Moderation: find a post and delete it. Backend: GET /admin/posts (list) and DELETE /posts/:id.
// An admin tied to one university only sees and can delete that university's posts.
export default function PostsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebounced(search.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-posts", page, debounced],
    queryFn: async () => (await api.get("/admin/posts", { params: { page, limit: 20, search: debounced || undefined } })).data,
  });
  const posts: any[] = data?.data || [];
  const totalPages: number = data?.pagination?.totalPages || 1;

  const remove = useMutation({
    mutationFn: async (id: string) => api.delete(`/posts/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-posts"] }),
    onError: (e: any) => alert(e?.response?.data?.message || "Could not delete the post."),
  });

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-3xl font-display font-semibold text-ink">Posts</h1>
          <p className="text-ink-muted mt-1 text-sm">Review posts and remove ones that break the community standards.</p>
        </div>

        <div className="relative max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-9" placeholder="Search post text" aria-label="Search posts" />
        </div>

        {error && <p className="text-danger text-sm">{(error as any)?.response?.data?.message || "Could not load posts."}</p>}

        {isLoading ? (
          <div className="card p-8 text-center text-ink-muted">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="card p-12 text-center">
            <FileText size={48} className="mx-auto mb-4 text-ink-muted opacity-30" />
            <p className="text-ink-muted">{debounced ? "No posts match your search." : "No posts yet."}</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {posts.map((p) => (
              <li key={p.id} className="card p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs text-ink-muted">
                      {p.authorName}
                      {p.authorRole ? ` (${p.authorRole})` : ""} · {new Date(p.createdAt).toLocaleString()}
                      {p.mediaCount ? ` · ${p.mediaCount} attachment${p.mediaCount > 1 ? "s" : ""}` : ""}
                    </p>
                    {p.title && <p className="font-semibold text-ink mt-2">{p.title}</p>}
                    <p className="text-sm text-ink mt-1 whitespace-pre-wrap break-words">{p.content || "(no text)"}</p>
                  </div>
                  <button
                    onClick={() => confirm("Delete this post for everyone? This cannot be undone.") && remove.mutate(p.id)}
                    disabled={remove.isPending}
                    className="p-2 hover:bg-danger/10 rounded-lg text-ink-muted hover:text-danger transition shrink-0 disabled:opacity-50"
                    title="Delete post"
                    aria-label="Delete post"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="btn-secondary disabled:opacity-50">
              Previous
            </button>
            <span className="text-sm text-ink-muted">
              Page {page} of {totalPages}
            </span>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="btn-secondary disabled:opacity-50">
              Next
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
