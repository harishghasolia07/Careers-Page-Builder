import { auth } from '@clerk/nextjs/server';
import { UserRole } from './roles';

export async function getCurrentUser() {
  const { userId } = await auth();
  
  if (!userId) {
    return null;
  }

  // In Clerk, you can access user metadata
  const user = await auth();
  
  return {
    id: userId,
    role: (user.sessionClaims?.metadata as any)?.role || UserRole.CANDIDATE,
  };
}

export async function requireAuth() {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error('Unauthorized');
  }
  
  return user;
}

export async function requireRole(requiredRole: UserRole) {
  const user = await requireAuth();
  
  if (user.role !== requiredRole && user.role !== UserRole.ADMIN) {
    throw new Error('Forbidden: Insufficient permissions');
  }
  
  return user;
}
