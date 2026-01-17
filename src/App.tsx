import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';
import { useApiToken } from './hooks/useApiToken';
import { KeycloakProvider } from './contexts/KeycloakContext';
import { Route } from 'react-router';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import TasksPage from './pages/TasksPage';


setupIonicReact();

const ApiTokenInitializer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useApiToken();
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <KeycloakProvider>
      <ApiTokenInitializer>
        <IonApp>
          <IonReactRouter>
            <IonRouterOutlet>
              <Route exact path="/login" component={LoginPage} />
              <ProtectedRoute exact path="/" component={HomePage} />
              <ProtectedRoute exact path="/tasks" component={TasksPage} />
              <ProtectedRoute exact path="/profile" component={ProfilePage} />
            </IonRouterOutlet>
          </IonReactRouter>
        </IonApp>
      </ApiTokenInitializer>
    </KeycloakProvider>
  );
};

export default App;
