// Import des dépendances React et types personnalisés
import React from 'react'; 
import { Axe, getAxeContent } from '@/types/axe';

// Import des icônes depuis lucide-react
import {
  Brain, Shield, Network, Database, Smartphone,SatelliteDish,Eye,Mic, MessageCircle,Bot,
  TrendingUp // par défaut si l'icône n'existe pas
} from 'lucide-react';

import { useTranslation } from 'react-i18next';

// Mapping entre une chaîne de caractère (slug) et une icône React
const iconMap: Record<string, React.ComponentType> = {
    Brain,
    Shield,
    Network,
    Database,
    Smartphone,
    SatelliteDish,
    Eye,
    Mic, 
    MessageCircle,
    Bot,
};

// Définition des props du composant
interface AxeCardProps {
  axe: Axe;
  variant?: 'compact' | 'detailed';
  onClick?: () => void;
  className?: string;
}

// Composant principal AxeCard
const AxeCard: React.FC<AxeCardProps> = ({ 
  axe, 
  variant = 'compact', 
  onClick,
  className = ''
}) => {
    const { i18n } = useTranslation();

    // Choisir dynamiquement l’icône selon le champ `icon`
    const Icon = iconMap[axe.icon as string] || TrendingUp;
    
    // Extraire les champs traduits depuis l'objet Axe
    const title = getAxeContent(axe, 'title', i18n.language);
    const problematique = getAxeContent(axe, 'problematique', i18n.language);
    const isArabic = i18n.language === 'ar';
    
    // Fonction de clic personnalisée
    const handleClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (onClick) {
        onClick();
      }
    };
    
  //  Variante "compacte"
  if (variant === 'compact') {
    return (
      <div 
        className={`group bg-card rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border cursor-pointer ${className}`}
        onClick={handleClick}
      >
        <div className={`flex items-start ${isArabic ? 'space-x-reverse space-x-4' : 'space-x-4'}`}>
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
              <Icon className="w-6 h-6 text-primary group-hover:text-primary-foreground" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-foreground mb-2 leading-tight">
              {title}
            </h3>
          </div>
        </div>
      </div>
    );
  }
};
export default AxeCard;