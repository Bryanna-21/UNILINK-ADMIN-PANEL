// Matches UNILINK-BACKEND's User model filtered to role: "student" (see
// src/models/User.js and src/controllers/admin.controller.js#getStudents).
// Course/year enrollment data is NOT included here - the platform doesn't
// currently link enrollment records to the admin API (see project notes).
export interface Student {
  _id: string;
  name: string;
  email: string;
  universityId?: string;
  status: "active" | "suspended";
  createdAt: string;
}
