import React, { createContext, useContext, ReactNode, useEffect, useState, useRef } from 'react';
import Keycloak from 'keycloak-js';
import { initKeycloak } from '../config/keycloak';
import { IonLoading } from '@ionic/react';

interface KeycloakContextType {
  keycloak: Keycloak | null;
  initialized: boolean;
  authenticated: boolean;
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

// Instance singleton de Keycloak
let keycloakInstance: Keycloak | null = null;

export const KeycloakProvider: React.FC<KeycloakProviderProps> = ({ children }) => {
  const [initialized, setInitialized] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const initializedRef = useRef(false);

  useEffect(() => {
    // Empêcher l'initialisation multiple en mode strict React
    if (initializedRef.current) return;
    initializedRef.current = true;

    const initializeKeycloak = async () => {
      try {
        // Utiliser l'instance singleton ou en créer une nouvelle
        if (!keycloakInstance) {
          keycloakInstance = initKeycloak();
        }

        // Options d'initialisation avec les types corrects
        const initOptions: Keycloak.KeycloakInitOptions = {
          onLoad: 'login-required', // Forcer la connexion
          checkLoginIframe: false, // Désactiver la vérification iframe qui cause timeout
          pkceMethod: 'S256',
          // Utiliser une URL locale pour éviter les erreurs CORS
          redirectUri: window.location.origin,
          silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
          flow: 'standard' as Keycloak.KeycloakFlow, // Ajouter cette propriété
        };

        const auth = await keycloakInstance.init(initOptions);
        
        console.log('Keycloak initialized:', auth);
        setAuthenticated(auth);
        setInitialized(true);
        setLoading(false);

        if (!auth) {
          // Si non authentifié, rediriger vers le login
          await keycloakInstance.login();
        }

      } catch (error) {
        console.error('Failed to initialize Keycloak:', error);
        setLoading(false);
        // En cas d'erreur, on initialise quand même pour permettre le développement
        setInitialized(true);
        setAuthenticated(false);
      }
    };

    initializeKeycloak();

    // Nettoyage
    return () => {
      // Ne pas détruire l'instance Keycloak pour éviter les réinitialisations
    };
  }, []);

  // Gérer le rafraîchissement du token
  useEffect(() => {
    if (keycloakInstance && authenticated) {
      const refreshInterval = setInterval(async () => {
        try {
          const refreshed = await keycloakInstance!.updateToken(70); // Rafraîchir à 70% d'expiration
          if (refreshed) {
            console.log('Token refreshed');
          }
        } catch (error) {
          console.error('Failed to refresh token:', error);
        }
      }, 60000); // Vérifier toutes les minutes

      return () => clearInterval(refreshInterval);
    }
  }, [authenticated]);

  if (loading) {
    return <IonLoading isOpen={true} message="Initializing authentication..." />;
  }

  return (
    <KeycloakContext.Provider value={{ 
      keycloak: keycloakInstance, 
      initialized, 
      authenticated 
    }}>
      {children}
    </KeycloakContext.Provider>
  );
};