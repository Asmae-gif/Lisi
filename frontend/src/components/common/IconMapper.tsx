import { getIconComponent } from '@/utils/iconUtils';

// Composant IconMapper pour utiliser dans les composants
interface IconMapperProps {
  iconKey: string;
  className?: string;
  size?: number;
}

const IconMapper: React.FC<IconMapperProps> = ({ 
  iconKey, 
  className = "h-6 w-6", 
  size = 24 
}) => {
  const IconComponent = getIconComponent(iconKey);
  return <IconComponent className={className} size={size} />;
};

export default IconMapper; 