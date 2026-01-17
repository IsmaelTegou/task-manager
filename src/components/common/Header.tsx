import React from 'react';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonMenuButton,
  IonBackButton,
} from '@ionic/react';
import { useKeycloak } from '../../contexts/KeycloakContext';

interface HeaderProps {
  title: string;
  showBackButton?: boolean;
  showMenuButton?: boolean;
  showLogoutButton?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = false,
  showMenuButton = true,
  showLogoutButton = false,
}) => {
  const { keycloak } = useKeycloak();
  //const history = useHistory();

  const handleLogout = () => {
    keycloak.logout();
  };

  return (
    <IonHeader className="shadow-sm">
      <IonToolbar>
        <IonButtons slot="start">
          {showBackButton && <IonBackButton />}
          {showMenuButton && <IonMenuButton />}
        </IonButtons>

        <IonTitle className="font-bold">{title}</IonTitle>

        <IonButtons slot="end">
          {showLogoutButton && (
            <IonButton onClick={handleLogout}>Logout</IonButton>
          )}
        </IonButtons>
      </IonToolbar>
    </IonHeader>
  );
};

export default Header;