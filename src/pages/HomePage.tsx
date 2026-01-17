import React from 'react';
import {
  IonPage,
  IonContent,
  IonButton,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
} from '@ionic/react';
import { useKeycloak } from '../contexts/KeycloakContext';
import { useHistory } from 'react-router-dom';
import { person, logOut, checkmarkCircle } from 'ionicons/icons';
import Header from '../components/common/Header';


const HomePage: React.FC = () => {
  const { keycloak } = useKeycloak();
  const history = useHistory();

  const handleLogout = () => {
    keycloak.logout();
  };

  const userRoles = keycloak.tokenParsed?.realm_access?.roles || [];

  return (
    <IonPage>
      <Header title="Dashboard" />
      <IonContent className="ion-padding">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome, {keycloak.tokenParsed?.preferred_username || 'User'}
          </h1>
          <p className="text-gray-600">Manage your tasks efficiently</p>
        </div>

        <IonGrid>
          <IonRow>
            <IonCol size="12" sizeMd="6">
              <IonCard 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => history.push('/tasks')}
              >
                <IonCardHeader>
                  <div className="flex items-center">
                    <IonIcon icon={checkmarkCircle} className="text-blue-500 text-2xl mr-3" />
                    <IonCardTitle>Task Management</IonCardTitle>
                  </div>
                </IonCardHeader>
                <IonCardContent>
                  <p className="text-gray-600">
                    Create, organize, and track your daily tasks. Stay productive and never miss a deadline.
                  </p>
                  <IonButton expand="block" fill="clear" className="mt-4">
                    Go to Tasks
                  </IonButton>
                </IonCardContent>
              </IonCard>
            </IonCol>

            <IonCol size="12" sizeMd="6">
              <IonCard 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => history.push('/profile')}
              >
                <IonCardHeader>
                  <div className="flex items-center">
                    <IonIcon icon={person} className="text-green-500 text-2xl mr-3" />
                    <IonCardTitle>Profile</IonCardTitle>
                  </div>
                </IonCardHeader>
                <IonCardContent>
                  <p className="text-gray-600">
                    View and manage your profile information and preferences.
                  </p>
                  <IonButton expand="block" fill="clear" className="mt-4">
                    Go to Profile
                  </IonButton>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>

        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-lg font-semibold mb-3">Your Roles</h2>
          <div className="flex flex-wrap gap-2">
            {userRoles.map((role: string, index: number) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {role}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <IonButton
            expand="block"
            color="danger"
            fill="outline"
            onClick={handleLogout}
            className="mt-4"
          >
            <IonIcon icon={logOut} slot="start" />
            Logout
          </IonButton>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default HomePage;