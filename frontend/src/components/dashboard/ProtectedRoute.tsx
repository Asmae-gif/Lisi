import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly = false }) => {
  const { user, loading, checkAuth } = useAuth();
  const [isChecking, setIsChecking] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const verifyAuth = async () => {
      console.log('🔒 ProtectedRoute: Vérification de l\'authentification...');
      setIsChecking(true);
      
      try {
        // Forcer la vérification de l'authentification pour les routes protégées
        await checkAuth(true);
      } catch (error) {
        console.log('❌ ProtectedRoute: Erreur lors de la vérification:', error);
      } finally {
        setIsChecking(false);
      }
    };

    verifyAuth();
  }, [checkAuth]);

  if (loading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('❌ ProtectedRoute: Utilisateur non authentifié, redirection vers login');
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !(user.roles && user.roles.some((r) => r.name === 'admin'))) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="p-8 text-red-600 text-center">
          <h2 className="text-2xl font-bold mb-4">Accès refusé</h2>
          <p>Cette section est réservée aux administrateurs.</p>
        </div>
      </div>
    );
  }

  console.log('✅ ProtectedRoute: Utilisateur authentifié:', user);
  return <>{children}</>;
};

export default ProtectedRoute; 