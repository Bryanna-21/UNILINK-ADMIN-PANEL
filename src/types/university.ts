// Matches UNILINK-BACKEND's University model plus the computed
// studentCount added by getUniversities (see src/controllers/admin.controller.js).
export interface University {
  _id: string;
  name: string;
  country?: string;
  domainCode?: string;
  verified: boolean;
  studentCount: number;
  createdAt: string;
}
