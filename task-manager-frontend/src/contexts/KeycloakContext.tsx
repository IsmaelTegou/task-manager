import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import Keycloak from 'keycloak-js';
import { initKeycloak } from '../config/keycloak';
import { apiService } from '../services/api'; // Import du service API
import { IonLoading } from '@ionic/react';

interface KeycloakContextType {
  keycloak: Keycloak | null;
  initialized: boolean;
  authenticated: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  getToken: () => string | null;
}

const KeycloakContext = createContext<KeycloakContextType | undefined>(undefined);

export const useKeycloak = () => {
  const context = useContext(KeycloakContext);
  if (!context) {
    throw new Error('useKeycloak must be used within KeycloakProvider');
  }
  return context;
};

interface KeycloakProviderProps {
  children: ReactNode;
}

export const KeycloakProvider: React.FC<KeycloakProviderProps> = ({ children }) => {
  const [keycloak, setKeycloak] = useState<Keycloak | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fonction pour stocker les tokens
  const storeTokens = (kc: Keycloak) => {
    if (kc.token) {
      localStorage.setItem('kc_token', kc.token);
      localStorage.setItem('kc_refreshToken', kc.refreshToken || '');
      localStorage.setItem('kc_idToken', kc.idToken || '');
      
      // Stocker les infos utilisateur
      if (kc.tokenParsed) {
        localStorage.setItem('kc_user', JSON.stringify({
          username: kc.tokenParsed.preferred_username,
          email: kc.tokenParsed.email,
          roles: kc.tokenParsed.realm_access?.roles || []
        }));
      }
    }
  };

  // Fonction pour récupérer le token
  const getToken = (): string | null => {
    return localStorage.getItem('kc_token');
  };

  // Fonction pour nettoyer les tokens
  const clearTokens = () => {
    localStorage.removeItem('kc_token');
    localStorage.removeItem('kc_refreshToken');
    localStorage.removeItem('kc_idToken');
    localStorage.removeItem('kc_user');
  };

  useEffect(() => {
    const initializeKeycloak = async () => {
      try {
        const keycloakInstance = initKeycloak();
        setKeycloak(keycloakInstance);

        const initOptions: Keycloak.KeycloakInitOptions = {
          onLoad: 'check-sso',
          checkLoginIframe: false,
          pkceMethod: 'S256',
        };

        const auth = await keycloakInstance.init(initOptions);
        
        if (auth) {
          storeTokens(keycloakInstance);
          // Configurer le service API avec la fonction pour obtenir le token
          apiService.setTokenGetter(getToken);
        }
        
        setAuthenticated(auth);
        setInitialized(true);
        setLoading(false);

        // Configurer le rafraîchissement automatique du token
        if (auth) {
          setInterval(async () => {
            try {
              const refreshed = await keycloakInstance.updateToken(70);
              if (refreshed) {
                console.log('Token refreshed');
                storeTokens(keycloakInstance);
              }
            } catch (error) {
              console.error('Failed to refresh token:', error);
            }
          }, 60000); // Toutes les minutes
        }

      } catch (error) {
        console.error('Failed to initialize Keycloak:', error);
        setLoading(false);
        setInitialized(true);
        setAuthenticated(false);
      }
    };

    initializeKeycloak();
  }, []);

  const login = async () => {
    if (keycloak) {
      await keycloak.login();
    }
  };

  const logout = async () => {
    if (keycloak) {
      clearTokens();
      await keycloak.logout();
    }
  };

  if (loading) {
    return <IonLoading isOpen={true} message="Initializing authentication..." />;
  }

  return (
    <KeycloakContext.Provider value={{ 
      keycloak, 
      initialized, 
      authenticated,
      login,
      logout,
      getToken
    }}>
      {children}
    </KeycloakContext.Provider>
  );
};