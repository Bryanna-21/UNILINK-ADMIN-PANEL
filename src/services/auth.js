export const ROLES = {
  SUPER_ADMIN: "super_admin",
  MODERATOR: "moderator",
  EMERGENCY_OFFICER: "emergency_officer",
  UNIVERSITY_ADMIN: "university_admin",
};

export const hasRole = (userRole, allowedRoles) => {
  return allowedRoles.includes(userRole);
};
