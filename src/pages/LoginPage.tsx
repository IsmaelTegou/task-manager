import React, { useEffect } from 'react';
import {
  IonPage,
  IonContent,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  IonIcon,
} from '@ionic/react';
import { useKeycloak } from '../contexts/KeycloakContext';
import { useHistory } from 'react-router-dom';
import { keyOutline, logInOutline } from 'ionicons/icons';

const LoginPage: React.FC = () => {
  const { keycloak, authenticated } = useKeycloak();
  const history = useHistory();

  useEffect(() => {
    if (authenticated && keycloak) {
      history.replace('/');
    }
  }, [authenticated, keycloak, history]);

  const handleLogin = async () => {
    if (keycloak) {
      try {
        await keycloak.login();
      } catch (error) {
        console.error('Login error:', error);
      }
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Task Manager - Login</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonGrid className="h-full">
          <IonRow className="ion-justify-content-center ion-align-items-center h-full">
            <IonCol size="12" sizeMd="6" sizeLg="4">
              <IonCard className="shadow-lg">
                <IonCardContent className="ion-text-center ion-padding">
                  <div className="mb-8">
                    <IonIcon
                      icon={keyOutline}
                      className="text-6xl text-primary"
                    />
                  </div>
                  
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    Task Manager
                  </h1>
                  <p className="text-gray-600 mb-6">
                    Sign in to access your tasks and manage your productivity
                  </p>

                  <IonButton
                    expand="block"
                    size="large"
                    onClick={handleLogin}
                    className="mt-6"
                  >
                    <IonIcon icon={logInOutline} slot="start" />
                    Sign in with Keycloak
                  </IonButton>

                  <div className="mt-8 text-sm text-gray-500">
                    <p>You'll be redirected to Keycloak for authentication</p>
                  </div>

                  {/* Message d'erreur ou d'information */}
                  {!keycloak && (
                    <div className="mt-4 p-3 bg-yellow-100 text-yellow-800 rounded">
                      <p className="text-sm">
                        Keycloak instance not available. Please check your configuration.
                      </p>
                    </div>
                  )}
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;