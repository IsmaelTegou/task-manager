import { useAuth } from './useAuth';

export const useRoles = () => {
  const { userInfo, hasRole: hasRoleFromAuth } = useAuth();

  const hasRole = (role: string): boolean => {
    return hasRoleFromAuth(role);
  };

  const hasAnyRole = (roles: string[]): boolean => {
    return roles.some(role => hasRole(role));
  };

  const hasAllRoles = (roles: string[]): boolean => {
    return roles.every(role => hasRole(role));
  };

  const getUserRoles = (): string[] => {
    return userInfo?.roles || [];
  };

  const isAdmin = (): boolean => {
    return hasRole('ADMIN') || hasRole('admin');
  };

  return {
    hasRole,
    hasAnyRole,
    hasAllRoles,
    getUserRoles,
    isAdmin,
    userInfo
  };
};