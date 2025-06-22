import { ArrowRight, Users,UserCheck,UserX, BookOpen, Target, Globe, Award, ChevronRight, Microscope, Zap, Shield, Handshake, Lightbulb } from 'lucide-react';

// Constantes pour les icônes
export const ICONS = {
  HANDSHAKE: 'Handshake',
  LIGHTBULB: 'Lightbulb',
  TARGET: 'Target',
  USERS: 'Users',
  GLOBE: 'Globe',
  AWARD: 'Award',
  MICROSCOPE: 'Microscope',
  ZAP: 'Zap',
  SHIELD: 'Shield',
  BOOK_OPEN: 'BookOpen',
  ARROW_RIGHT: 'ArrowRight',
  CHEVRON_RIGHT: 'ChevronRight'
} as const;

// Mapping des icônes pour les composants React
export const iconMap = {
  [ICONS.TARGET]: Target,
  [ICONS.USERS]: Users,
  [ICONS.GLOBE]: Globe,
  [ICONS.AWARD]: Award,
  [ICONS.MICROSCOPE]: Microscope,
  [ICONS.ZAP]: Zap,
  [ICONS.SHIELD]: Shield,
  [ICONS.BOOK_OPEN]: BookOpen,
  [ICONS.ARROW_RIGHT]: ArrowRight,
  [ICONS.CHEVRON_RIGHT]: ChevronRight,
  [ICONS.HANDSHAKE]: Handshake,
  [ICONS.LIGHTBULB]: Lightbulb,
  USER_CHECK: UserCheck,
  USER_X: UserX,
} as const;

// Fonction utilitaire pour obtenir une icône React à partir d'une clé d'icône
export const getIconComponent = (iconKey: string) => {
  return iconMap[iconKey as keyof typeof iconMap] || Target;
}; 