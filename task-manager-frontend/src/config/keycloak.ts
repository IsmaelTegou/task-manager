import Keycloak from 'keycloak-js';

const keycloakConfig = {
  url: 'http://localhost:8080', 
  realm: 'kti-service', 
  clientId: 'react-client', 
};

export const initKeycloak = (): Keycloak => {
  return new Keycloak(keycloakConfig);
};

export default keycloakConfig;