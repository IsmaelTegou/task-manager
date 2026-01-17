import React from 'react';
import { IonSpinner, IonContent, IonPage } from '@ionic/react';

interface LoadingSpinnerProps {
  message?: string;
  fullScreen?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  message = 'Loading...', 
  fullScreen = false 
}) => {
  const content = (
    <div className="flex flex-col items-center justify-center h-full">
      <IonSpinner name="crescent" className="w-12 h-12 text-primary" />
      {message && <p className="mt-4 text-gray-600">{message}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <IonPage>
        <IonContent className="ion-padding">{content}</IonContent>
      </IonPage>
    );
  }

  return content;
};

export default LoadingSpinner;