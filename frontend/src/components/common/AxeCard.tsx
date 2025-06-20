import React from 'react';
import { Axe, getAxeContent } from '@/types/axe';
import {
  Brain, Shield, Network, Database, Smartphone,
  TrendingUp
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

// mapping slug → composant icône
const iconMap: Record<string, React.ComponentType> = {
    Brain,
    Shield,
    Network,
    Database,
    Smartphone,
};

interface AxeCardProps {
  axe: Axe;
  variant?: 'default' | 'compact' | 'detailed';
  onClick?: () => void;
  className?: string;
}

const AxeCard: React.FC<AxeCardProps> = ({ 
  axe, 
  variant = 'default', 
  onClick,
  className = ''
}) => {
    const { i18n } = useTranslation();
    const Icon = iconMap[axe.icon as string] || TrendingUp;
    
    // Récupérer le contenu dans la langue actuelle
    const title = getAxeContent(axe, 'title', i18n.language);
    const problematique = getAxeContent(axe, 'problematique', i18n.language);

  if (variant === 'compact') {
    return (
      <div 
        className={`group bg-card rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border cursor-pointer ${className}`}
        onClick={onClick}
      >
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
              <Icon className="w-6 h-6 text-primary group-hover:text-primary-foreground" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-foreground mb-2 leading-tight">
              {title}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {problematique.length > 100 
                ? `${problematique.substring(0, 100)}...` 
                : problematique
              }
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <div 
        className={`group bg-card rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border cursor-pointer ${className}`}
        onClick={onClick}
      >
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
            <Icon className="w-6 h-6 text-primary group-hover:text-primary-foreground" />
          </div>
          <h3 className="text-xl font-bold text-foreground">
            {title}
          </h3>
        </div>
        <p className="text-muted-foreground leading-relaxed">
          {problematique}
        </p>
      </div>
    );
  }

  // Variant par défaut
  return (
    <div 
      className={`group bg-card rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border cursor-pointer ${className}`}
      onClick={onClick}
    >
      <div className="flex items-start space-x-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
            <Icon className="w-6 h-6 text-primary group-hover:text-primary-foreground" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-foreground mb-2 leading-tight">
            {title}
          </h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {problematique.length > 100 
              ? `${problematique.substring(0, 100)}...` 
              : problematique
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default AxeCard; 