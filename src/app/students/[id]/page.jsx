"use client";

import { useParams } from "next/navigation";

import DashboardLayout from "@/components/layout/dashboard-layout";

import StudentProfileCard from "@/components/students/student-profile-card";

export default function StudentProfilePage() {
  const params = useParams();

  const student = {
    id: params.id,

    name: "Sarah Johnson",

    university:
      "Harvard University",

    course:
      "Computer Science",

    status: "Active",
  };

  return (
    <DashboardLayout>
      <div>
        <div className="mb-8">
          <h1 className="text-4xl font-bold">
            Student Profile
          </h1>

          <p className="text-gray-400 mt-2">
            Detailed student
            information and account
            activity.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <StudentProfileCard
              student={student}
            />
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold mb-6">
              Activity
            </h2>

            <div className="space-y-4">
              <div
                className="
                bg-white/5
                p-4
                rounded-xl
              "
              >
                Logged in recently
              </div>

              <div
                className="
                bg-white/5
                p-4
                rounded-xl
              "
              >
                Updated profile
              </div>

              <div
                className="
                bg-white/5
                p-4
                rounded-xl
              "
              >
                Joined new course
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
