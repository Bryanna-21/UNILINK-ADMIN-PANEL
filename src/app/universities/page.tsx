"use client";

import DashboardLayout from "@/components/layout/dashboard-layout";

import UniversityCard from "@/components/universities/university-card";

const universities = [
  {
    id: "1",

    name: "Harvard University",

    students: 3200,

    verified: true,
  },

  {
    id: "2",

    name: "MIT",

    students: 2100,

    verified: false,
  },
];

export default function UniversitiesPage() {
  return (
    <DashboardLayout>
      <div>
        <div className="mb-8">
          <h1 className="text-4xl font-bold">
            Universities
          </h1>

          <p className="text-gray-400 mt-2">
            Institution verification
            system.
          </p>
        </div>

        <div
          className="
          grid
          grid-cols-1
          md:grid-cols-2
          gap-6
        "
        >
          {universities.map(
            (university) => (
              <UniversityCard
                key={university.id}
                university={
                  university
                }
                onVerify={() =>
                  console.log(
                    "Verify",
                    university.id
                  )
                }
              />
            )
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
