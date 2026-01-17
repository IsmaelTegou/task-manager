import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useKeycloak } from '../../contexts/KeycloakContext';
import { IonLoading } from '@ionic/react';

interface ProtectedRouteProps {
  component: React.ComponentType<any>;
  path: string;
  exact?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  component: Component, 
  ...rest 
}) => {
  const { keycloak, initialized, authenticated } = useKeycloak();

  if (!initialized) {
    return <IonLoading isOpen={true} message="Checking authentication..." />;
  }

  if (!keycloak) {
    return <IonLoading isOpen={true} message="Authentication service unavailable..." />;
  }

  return (
    <Route
      {...rest}
      render={(props) => {
        if (authenticated) {
          return <Component {...props} />;
        } else {
          // Rediriger vers la page de login si non authentifié
          // Keycloak gérera automatiquement la redirection vers le serveur d'authentification
          return (
            <Redirect
              to={{
                pathname: '/login',
                state: { from: props.location },
              }}
            />
          );
        }
      }}
    />
  );
};