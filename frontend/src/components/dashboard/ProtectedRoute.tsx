import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import axiosClient from '../../services/axiosClient';
import { User } from '../../types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, adminOnly = false }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    console.log('🔒 ProtectedRoute: Vérification de l\'authentification...');
    axiosClient.get('/api/user')
      .then(res => {
        // La réponse peut être soit directement l'utilisateur, soit dans un objet { user: ... }
        const userData = res.data.user || res.data;
        console.log('✅ ProtectedRoute: Utilisateur authentifié:', userData);
        setUser(userData as User);
      })
      .catch((error) => {
        console.log('❌ ProtectedRoute: Utilisateur non authentifié:', error);
        setUser(null);
      })
      .then(() => setLoading(false));
  }, []);

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !(user.roles && user.roles.some((r) => r.name === 'admin'))) {
    return <div className="p-8 text-red-600">Accès réservé aux administrateurs.</div>;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 