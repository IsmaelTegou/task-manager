import { useCallback } from 'react';
import { useKeycloak } from '../contexts/KeycloakContext';
import { apiService } from '../services/api';

export const useAuthenticatedFetch = () => {
  const { keycloak } = useKeycloak();

  const authenticatedFetch = useCallback(
    async (url: string, options: RequestInit = {}) => {
      if (!keycloak.authenticated) {
        throw new Error('Not authenticated');
      }

      const headers = {
        ...options.headers,
        Authorization: `Bearer ${keycloak.token}`,
      };

      return fetch(url, { ...options, headers });
    },
    [keycloak]
  );

  const authenticatedAxios = useCallback(
    async (config: any) => {
      if (!keycloak.authenticated) {
        throw new Error('Not authenticated');
      }

      return apiService.getAxiosInstance()(config);
    },
    [keycloak]
  );

  return { authenticatedFetch, authenticatedAxios };
};