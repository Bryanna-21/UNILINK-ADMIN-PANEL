"use client";

import { MapPin } from "lucide-react";
import StructurePage from "@/components/structure/structure-page";

export default function CampusesPage() {
  return (
    <StructurePage
      title="Campuses"
      subtitle="Manage the campuses of each university"
      singular="Campus"
      path="/admin/campuses"
      icon={MapPin}
      fields={[
        { key: "name", label: "Name", required: true },
        { key: "code", label: "Code" },
        { key: "universityId", label: "University", ref: "/admin/universities", required: true },
      ]}
      columns={[
        { label: "Name", keys: ["name"] },
        { label: "Code", keys: ["code"] },
        { label: "University", keys: ["university", "universityName", "universityId"] },
      ]}
    />
  );
}
