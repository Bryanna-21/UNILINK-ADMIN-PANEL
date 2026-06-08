"use client";

import DashboardLayout from "@/components/layout/dashboard-layout";

import StudentProfileCard from "@/components/students/student-profile-card";

const student = {
  name: "Sarah Johnson",

  university:
    "Harvard University",

  course:
    "Computer Science",

  status: "Active",
};

export default function StudentPage() {
  return (
    <DashboardLayout>
      <div>
        <div className="mb-8">
          <h1 className="text-4xl font-bold">
            Student Profile
          </h1>

          <p className="text-gray-400 mt-2">
            Detailed student
            information.
          </p>
        </div>

        <div className="max-w-[700px]">
          <StudentProfileCard
            student={student}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
