import React, { useEffect, useRef } from 'react';
import { Save } from 'lucide-react';

interface AutoSaveProps {
  onSave: () => Promise<void>;
  data: Record<string, unknown>;
  interval?: number; // en millisecondes
  className?: string;
}

const AutoSave: React.FC<AutoSaveProps> = ({
  onSave,
  data,
  interval = 30000, // 30 secondes par défaut
  className = ""
}) => {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastDataRef = useRef<string>('');

  useEffect(() => {
    const currentData = JSON.stringify(data);
    
    // Si les données ont changé
    if (currentData !== lastDataRef.current) {
      lastDataRef.current = currentData;
      
      // Annuler le timeout précédent
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Programmer une nouvelle sauvegarde
      timeoutRef.current = setTimeout(async () => {
        try {
          await onSave();
          console.log('Sauvegarde automatique effectuée');
        } catch (error) {
          console.error('Erreur lors de la sauvegarde automatique:', error);
        }
      }, interval);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, onSave, interval]);

  return (
    <div className={`flex items-center gap-2 text-sm text-gray-500 ${className}`}>
      <Save className="h-4 w-4" />
      <span>Sauvegarde automatique dans {Math.ceil(interval / 1000)}s</span>
    </div>
  );
};

export default AutoSave; 