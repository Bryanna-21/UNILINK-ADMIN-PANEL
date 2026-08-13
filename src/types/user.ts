// Matches UNILINK-BACKEND's User model (see src/models/User.js).
export interface User {
  _id: string;
  name: string;
  email: string;
  role: "student" | "lecturer" | "admin";
  status: "active" | "suspended";
  universityId?: string;
  createdAt: string;
}
