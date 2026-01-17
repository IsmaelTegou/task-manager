import { useEffect } from 'react';
import { useKeycloak } from '../contexts/KeycloakContext';
import { apiService } from '../services/api';

export const useApiToken = () => {
  const { keycloak, initialized } = useKeycloak();

  useEffect(() => {
    if (initialized && keycloak.token) {
      apiService.setToken(keycloak.token);
    } else {
      apiService.setToken(null);
    }
  }, [keycloak.token, initialized]);
};