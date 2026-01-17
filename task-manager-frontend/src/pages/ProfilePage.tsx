import React from 'react';
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonAvatar,
  IonButton,
  IonIcon,
} from '@ionic/react';
import { logOut, personCircle, mail, calendar } from 'ionicons/icons';
import { useKeycloak } from '../contexts/KeycloakContext';
import Header from '../components/common/Header';

const ProfilePage: React.FC = () => {
  const { keycloak } = useKeycloak();
  const user = keycloak.tokenParsed;

  const handleLogout = () => {
    keycloak.logout();
  };

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  return (
    <IonPage>
      <Header title="Profile" showBackButton />
      <IonContent className="ion-padding">
        <div className="max-w-md mx-auto">
          <IonCard className="shadow-lg">
            <IonCardHeader className="text-center">
              <div className="flex flex-col items-center">
                <IonAvatar className="w-24 h-24 mb-4">
                  <IonIcon
                    icon={personCircle}
                    className="w-full h-full text-gray-400"
                  />
                </IonAvatar>
                <IonCardTitle className="text-xl font-bold">
                  {user?.name || user?.preferred_username}
                </IonCardTitle>
                <p className="text-gray-600 mt-1">{user?.email}</p>
              </div>
            </IonCardHeader>

            <IonCardContent>
              <IonList lines="none">
                <IonItem>
                  <IonIcon icon={mail} slot="start" className="text-gray-400" />
                  <IonLabel>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-gray-600">{user?.email}</p>
                  </IonLabel>
                </IonItem>

                <IonItem>
                  <IonIcon icon={calendar} slot="start" className="text-gray-400" />
                  <IonLabel>
                    <h3 className="font-medium">Account Created</h3>
                    <p className="text-gray-600">{formatDate(user?.iat)}</p>
                  </IonLabel>
                </IonItem>

                <IonItem>
                  <IonLabel>
                    <h3 className="font-medium">User ID</h3>
                    <p className="text-gray-600 text-sm break-all">{user?.sub}</p>
                  </IonLabel>
                </IonItem>

                {user?.realm_access?.roles && (
                  <IonItem>
                    <IonLabel>
                      <h3 className="font-medium">Roles</h3>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {user.realm_access.roles.map((role: string, index: number) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    </IonLabel>
                  </IonItem>
                )}
              </IonList>

              <div className="mt-8 pt-6 border-t">
                <IonButton
                  expand="block"
                  color="danger"
                  fill="outline"
                  onClick={handleLogout}
                >
                  <IonIcon icon={logOut} slot="start" />
                  Logout
                </IonButton>
              </div>
            </IonCardContent>
          </IonCard>

          <div className="mt-6 text-center text-gray-500 text-sm">
            <p>Task Manager v1.0.0</p>
            <p className="mt-1">Authenticated with Keycloak</p>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default ProfilePage;