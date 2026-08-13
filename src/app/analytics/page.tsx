"use client";

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

import DashboardLayout from "@/components/layout/dashboard-layout";
import ErrorState from "@/components/common/error-state";
import EmptyState from "@/components/common/empty-state";
import SkeletonCard from "@/components/loaders/skeleton-card";

import { useUserGrowth, useUniversityGrowth } from "@/hooks/use-analytics";

export default function AnalyticsPage() {
  const userGrowth = useUserGrowth(30);
  const universityGrowth = useUniversityGrowth();

  return (
    <DashboardLayout>
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-display font-semibold text-ink">Analytics</h1>
          <p className="text-ink-muted mt-2 text-sm">
            Registration growth over the last 30 days, computed from real account data.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <section className="card p-6">
            <h2 className="font-display font-semibold text-ink mb-1">User registrations</h2>
            <p className="text-ink-muted text-xs mb-4">By role, last 30 days</p>

            {userGrowth.isLoading && <SkeletonCard />}
            {userGrowth.error && (
              <ErrorState message="Couldn't load growth data." onRetry={() => userGrowth.refetch()} />
            )}
            {userGrowth.data?.data?.length === 0 && (
              <EmptyState title="No data yet" description="No registrations in this window." />
            )}
            {userGrowth.data?.data?.length > 0 && (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={userGrowth.data.data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="bucket" tick={{ fontSize: 11, fill: "var(--ink-muted)" }} />
                  <YAxis tick={{ fontSize: 11, fill: "var(--ink-muted)" }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                      borderRadius: 10,
                      fontSize: 12,
                    }}
                  />
                  <Line type="monotone" dataKey="student" stroke="var(--accent-bright)" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="lecturer" stroke="var(--warn)" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </section>

          <section className="card p-6">
            <h2 className="font-display font-semibold text-ink mb-1">University onboarding</h2>
            <p className="text-ink-muted text-xs mb-4">By month</p>

            {universityGrowth.isLoading && <SkeletonCard />}
            {universityGrowth.error && (
              <ErrorState
                message="Couldn't load university growth."
                onRetry={() => universityGrowth.refetch()}
              />
            )}
            {universityGrowth.data?.data?.length === 0 && (
              <EmptyState title="No data yet" description="No universities onboarded yet." />
            )}
            {universityGrowth.data?.data?.length > 0 && (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={universityGrowth.data.data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="bucket" tick={{ fontSize: 11, fill: "var(--ink-muted)" }} />
                  <YAxis tick={{ fontSize: 11, fill: "var(--ink-muted)" }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                      borderRadius: 10,
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="count" fill="var(--accent)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
