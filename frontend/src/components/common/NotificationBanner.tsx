import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

/**
 * Composant de bannière de notification réutilisable
 * Affiche des messages de succès ou d'erreur avec possibilité de fermeture
 */
interface NotificationBannerProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  onClose?: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
  className?: string;
}

const NotificationBanner = React.memo(({
  type,
  message,
  onClose,
  autoClose = false,
  autoCloseDelay = 5000,
  className = ""
}: NotificationBannerProps) => {
  
  // Auto-fermeture si activée
  React.useEffect(() => {
    if (autoClose && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);
      
      return () => clearTimeout(timer);
    }
  }, [autoClose, onClose, autoCloseDelay]);

  // Configuration des styles selon le type
  const getStyles = () => {
    switch (type) {
      case 'success':
        return {
          alertClass: 'border-green-200 bg-green-50',
          iconClass: 'text-green-600',
          textClass: 'text-green-800',
          icon: CheckCircle2
        };
      case 'error':
        return {
          alertClass: 'border-red-200 bg-red-50',
          iconClass: 'text-red-600',
          textClass: 'text-red-800',
          icon: AlertCircle
        };
      case 'warning':
        return {
          alertClass: 'border-yellow-200 bg-yellow-50',
          iconClass: 'text-yellow-600',
          textClass: 'text-yellow-800',
          icon: AlertCircle
        };
      case 'info':
        return {
          alertClass: 'border-blue-200 bg-blue-50',
          iconClass: 'text-blue-600',
          textClass: 'text-blue-800',
          icon: AlertCircle
        };
      default:
        return {
          alertClass: 'border-gray-200 bg-gray-50',
          iconClass: 'text-gray-600',
          textClass: 'text-gray-800',
          icon: AlertCircle
        };
    }
  };

  const styles = getStyles();
  const Icon = styles.icon;

  return (
    <Alert className={`${styles.alertClass} ${className}`}>
      <div className="flex items-center gap-2">
        <Icon className={`h-4 w-4 ${styles.iconClass}`} />
        <AlertDescription className={styles.textClass}>
          {message}
        </AlertDescription>
        {onClose && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose} 
            className="ml-auto h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </Alert>
  );
});

NotificationBanner.displayName = 'NotificationBanner';

export default NotificationBanner; 