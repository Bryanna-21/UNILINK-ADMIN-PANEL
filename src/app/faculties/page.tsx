"use client";

import { Layers } from "lucide-react";
import StructurePage from "@/components/structure/structure-page";

export default function FacultiesPage() {
  return (
    <StructurePage
      title="Faculties"
      subtitle="Manage faculties within each university"
      singular="Faculty"
      path="/admin/faculties"
      icon={Layers}
      fields={[
        { key: "name", label: "Name", required: true },
        { key: "code", label: "Code" },
        { key: "universityId", label: "University", ref: "/admin/options/universities", required: true },
      ]}
      columns={[
        { label: "Name", keys: ["name"] },
        { label: "Code", keys: ["code"] },
        { label: "University", keys: ["university", "universityName", "universityId"] },
      ]}
    />
  );
}
