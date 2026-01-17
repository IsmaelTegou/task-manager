import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { IonAlert } from '@ionic/react';

interface ProtectedComponentProps {
  children: React.ReactNode;
  requiredRole: string | string[];
  fallback?: React.ReactNode;
  showAlert?: boolean;
}

export const ProtectedComponent: React.FC<ProtectedComponentProps> = ({ 
  children, 
  requiredRole,
  fallback = null,
  showAlert = false
}) => {
  const { hasRole } = useAuth();
  
  const hasAccess = Array.isArray(requiredRole) 
    ? requiredRole.some(role => hasRole(role))
    : hasRole(requiredRole);
  
  if (!hasAccess) {
    if (showAlert) {
      const roleText = Array.isArray(requiredRole) 
        ? requiredRole.join(' or ') 
        : requiredRole;
      
      return (
        <IonAlert
          isOpen={true}
          header="Access Denied"
          message={`You need the ${roleText} role to access this content.`}
          buttons={['OK']}
        />
      );
    }
    
    return <>{fallback}</>;
  }
  
  return <>{children}</>;
};