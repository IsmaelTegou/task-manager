import Keycloak from 'keycloak-js';

// Configuration standard de Keycloak (sans propriétés non standard)
const keycloakConfig = {
  url: import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8080',
  realm: import.meta.env.VITE_KEYCLOAK_REALM || 'kti-service',
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'react-client',
};

// Créer une instance unique de Keycloak
let keycloakInstance: Keycloak | null = null;

export const initKeycloak = (): Keycloak => {
  if (!keycloakInstance) {
    console.log('Creating new Keycloak instance with config:', {
      ...keycloakConfig,
      // N'incluez pas les propriétés non standard dans l'objet config
    });
    
    keycloakInstance = new Keycloak(keycloakConfig);
    
    // Configurer les options supplémentaires après création si nécessaire
    // Ces options sont généralement passées à init(), pas à new Keycloak()
  }
  return keycloakInstance;
};

// Fonction pour obtenir l'instance existante
export const getKeycloakInstance = (): Keycloak | null => {
  return keycloakInstance;
};

export default keycloakConfig;