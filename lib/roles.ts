// User roles in the system
export enum UserRole {
  ADMIN = 'admin',           // Platform admin - can manage all companies
  RECRUITER = 'recruiter',   // Company recruiter - can edit their company's page
  CANDIDATE = 'candidate',   // Job seeker - can only view careers pages
}

// Check if user has specific role
export function hasRole(userRole: string | undefined, requiredRole: UserRole): boolean {
  if (!userRole) return false;
  return userRole === requiredRole;
}

// Check if user has any of the specified roles
export function hasAnyRole(userRole: string | undefined, roles: UserRole[]): boolean {
  if (!userRole) return false;
  return roles.includes(userRole as UserRole);
}

// Check if user is admin
export function isAdmin(userRole: string | undefined): boolean {
  return userRole === UserRole.ADMIN;
}

// Check if user is recruiter
export function isRecruiter(userRole: string | undefined): boolean {
  return userRole === UserRole.RECRUITER;
}

// Check if user can edit company
export function canEditCompany(userRole: string | undefined, userId: string, companyUserId: string): boolean {
  // Admins can edit any company
  if (isAdmin(userRole)) return true;
  
  // Recruiters can only edit their own company
  if (isRecruiter(userRole) && userId === companyUserId) return true;
  
  return false;
}
