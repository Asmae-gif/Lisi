import React, { useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Linkedin, ArrowRight } from "lucide-react";
import type { Membre } from '../types/membre';
import UserAvatar from '../components/common/UserAvatar';
import { useNavigate } from 'react-router-dom';

/**
 * Composant de carte de membre réutilisable
 * Affiche les informations d'un membre avec photo, nom, grade et liens de contact
 */
interface MembreCardProps {
  membre: Membre;
  onClick: () => void;
  className?: string;
}

const MembreCard: React.FC<MembreCardProps> = React.memo(({ 
  membre, 
  onClick, 
  className = "" 
}) => {
  const navigate = useNavigate();

  // Optimisation avec useCallback pour éviter les re-renders
  const handleClick = () => {
    navigate(`/membres/${membre.id}`);
  };

  const handleEmailClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  const handleLinkedinClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  // Fonction pour obtenir l'URL de la photo
  const getPhotoUrl = useCallback(() => {
    if (typeof membre.photo === 'string') {
      return membre.photo;
    }
    return null;
  }, [membre.photo]);

  return (
    <Card className={`group hover:shadow-lg transition-all duration-300 ${className}`}>
      <CardHeader>
        <div className="flex justify-center mb-4">
          <UserAvatar
            src={getPhotoUrl()}
            alt={`${membre.prenom} ${membre.nom}`}
            fallback={`${membre.prenom} ${membre.nom}`}
            size="xl"
            className="mx-auto"
          />
        </div>
        <CardTitle className="text-xl text-center">
          {membre.prenom} {membre.nom}
        </CardTitle>
        {membre.statut && <p className="text-gray-600 text-center">{membre.statut}</p>}
        {membre.grade && <p className="text-gray-600 text-center">{membre.grade}</p>}
      </CardHeader>
      <CardContent>
        <div className="flex justify-center space-x-4">
          {membre.email && (
            <a
              href={`mailto:${membre.email}`}
              className="text-blue-600 hover:text-blue-800"
              onClick={handleEmailClick}
            >
              <Mail className="w-4 h-4" />
            </a>
          )}
          {membre.linkedin && (
            <a
              href={membre.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800"
              onClick={handleLinkedinClick}
            >
              <Linkedin className="w-4 h-4" />
            </a>
          )}
        </div>
        <div className="mt-4 flex justify-center">
          <button 
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100 transition-colors duration-200"
            onClick={handleClick}
          >
            Voir le profil
            <ArrowRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
});

MembreCard.displayName = 'MembreCard';

export default MembreCard; 