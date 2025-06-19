import React, { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';

/**
 * Composant de bouton d'action réutilisable
 * Affiche un bouton avec une icône, un texte et différents variants
 */
interface ActionButtonProps {
  icon?: LucideIcon;
  children: React.ReactNode;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
}

const ActionButton: React.FC<ActionButtonProps> = React.memo(({
  icon: Icon,
  children,
  variant = "default",
  size = "default",
  onClick,
  disabled = false,
  loading = false,
  className = "",
  type = "button"
}) => {
  const handleClick = useCallback(() => {
    if (!disabled && !loading && onClick) {
      onClick();
    }
  }, [disabled, loading, onClick]);

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={disabled || loading}
      className={className}
      type={type}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
      ) : Icon ? (
        <Icon className="h-4 w-4 mr-2" />
      ) : null}
      {children}
    </Button>
  );
});

ActionButton.displayName = 'ActionButton';

export default ActionButton; 