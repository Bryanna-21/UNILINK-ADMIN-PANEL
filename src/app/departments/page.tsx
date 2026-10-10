"use client";

import { Landmark } from "lucide-react";
import StructurePage from "@/components/structure/structure-page";

export default function DepartmentsPage() {
  return (
    <StructurePage
      title="Departments"
      subtitle="Manage departments within each faculty"
      singular="Department"
      path="/admin/departments"
      icon={Landmark}
      fields={[
        { key: "name", label: "Name", required: true },
        { key: "code", label: "Code" },
        { key: "facultyId", label: "Faculty", ref: "/admin/faculties", required: true },
      ]}
      columns={[
        { label: "Name", keys: ["name"] },
        { label: "Code", keys: ["code"] },
        { label: "Faculty", keys: ["faculty", "facultyName", "facultyId"] },
        { label: "University", keys: ["university", "universityName", "universityId"] },
      ]}
    />
  );
}
