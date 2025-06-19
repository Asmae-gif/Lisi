import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from "lucide-react";

/**
 * Composant d'avatar utilisateur réutilisable
 * Affiche l'avatar d'un utilisateur avec fallback sur les initiales
 */
interface UserAvatarProps {
  src?: string | null;
  alt: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24',
  '2xl': 'w-32 h-32'
};

const textSizes = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl'
};

const UserAvatar: React.FC<UserAvatarProps> = ({ 
  src, 
  alt, 
  fallback, 
  size = 'md',
  className = "" 
}) => {
  // Générer les initiales à partir du nom
  const getInitials = (name: string): string => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]?.toUpperCase() || ''}${parts[parts.length - 1][0]?.toUpperCase() || ''}`;
    }
    return name[0]?.toUpperCase() || '?';
  };

  // Générer une couleur de fond basée sur le nom
  const getBackgroundColor = (name: string): string => {
    const colors = [
      'bg-blue-100 text-blue-700',
      'bg-green-100 text-green-700',
      'bg-purple-100 text-purple-700',
      'bg-pink-100 text-pink-700',
      'bg-indigo-100 text-indigo-700',
      'bg-yellow-100 text-yellow-700',
      'bg-red-100 text-red-700',
      'bg-teal-100 text-teal-700'
    ];
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  const initials = fallback ? getInitials(fallback) : getInitials(alt);
  const bgColor = fallback ? getBackgroundColor(fallback) : getBackgroundColor(alt);

  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      <AvatarImage
        src={src || undefined}
        alt={alt}
        className="object-cover"
        onError={(e) => {
          // Masquer l'image en cas d'erreur pour afficher le fallback
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
        }}
      />
      <AvatarFallback className={`${bgColor} ${textSizes[size]} font-semibold`}>
        {initials || <User className="w-1/2 h-1/2" />}
      </AvatarFallback>
    </Avatar>
  );
};

UserAvatar.displayName = 'UserAvatar';

export default UserAvatar; 