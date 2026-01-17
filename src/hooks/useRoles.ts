import { useKeycloak } from '../contexts/KeycloakContext';

export const useRoles = () => {
  const { keycloak } = useKeycloak();

  const hasRole = (role: string): boolean => {
    if (!keycloak.authenticated) return false;
    
    const roles = keycloak.tokenParsed?.realm_access?.roles || [];
    return roles.includes(role);
  };

  const hasAnyRole = (roles: string[]): boolean => {
    if (!keycloak.authenticated) return false;
    
    const userRoles = keycloak.tokenParsed?.realm_access?.roles || [];
    return roles.some(role => userRoles.includes(role));
  };

  const hasAllRoles = (roles: string[]): boolean => {
    if (!keycloak.authenticated) return false;
    
    const userRoles = keycloak.tokenParsed?.realm_access?.roles || [];
    return roles.every(role => userRoles.includes(role));
  };

  const getUserRoles = (): string[] => {
    if (!keycloak.authenticated) return [];
    return keycloak.tokenParsed?.realm_access?.roles || [];
  };

  return {
    hasRole,
    hasAnyRole,
    hasAllRoles,
    getUserRoles,
    isAuthenticated: keycloak.authenticated,
  };
};