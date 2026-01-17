import { useKeycloak } from '../contexts/KeycloakContext';

export interface UserInfo {
  username: string;
  email: string;
  roles: string[];
}

export const useAuth = () => {
  const { keycloak, authenticated, login, logout, getToken } = useKeycloak();

  const getUserInfo = (): UserInfo | null => {
    const userStr = localStorage.getItem('kc_user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (error) {
        return null;
      }
    }
    return null;
  };

  const getAccessToken = (): string | null => {
    return getToken();
  };

  const getRefreshToken = (): string | null => {
    return localStorage.getItem('kc_refreshToken');
  };

  const getIdToken = (): string | null => {
    return localStorage.getItem('kc_idToken');
  };

  const hasRole = (role: string): boolean => {
    const userInfo = getUserInfo();
    if (!userInfo) return false;
    return userInfo.roles.includes(role);
  };

  const isAdmin = (): boolean => {
    return hasRole('ADMIN') || hasRole('admin');
  };

  return {
    isAuthenticated: authenticated,
    userInfo: getUserInfo(),
    login,
    logout,
    getAccessToken,
    getRefreshToken,
    getIdToken,
    hasRole,
    isAdmin,
    keycloak
  };
};