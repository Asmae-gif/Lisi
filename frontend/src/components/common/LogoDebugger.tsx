import React, { useState } from 'react';
import { isValidImageUrl } from '@/utils/imageUtils';

interface LogoDebuggerProps {
  logoUrl: string;
  partenaireName: string;
}

export const LogoDebugger: React.FC<LogoDebuggerProps> = ({ logoUrl, partenaireName }) => {
  const [imageStatus, setImageStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [isValidUrl, setIsValidUrl] = useState<boolean>(false);

  React.useEffect(() => {
    // Vérifier si l'URL est valide
    setIsValidUrl(isValidImageUrl(logoUrl));
  }, [logoUrl]);

  const handleImageLoad = () => {
    setImageStatus('success');
  };

  const handleImageError = () => {
    setImageStatus('error');
  };

  return (
    <div className="border rounded-lg p-4 bg-gray-50">
      <h3 className="font-semibold mb-2">Débogage du logo pour {partenaireName}</h3>
      
      <div className="space-y-2 text-sm">
        <div>
          <strong>URL du logo:</strong> {logoUrl}
        </div>
        
        <div>
          <strong>URL valide:</strong> 
          <span className={isValidUrl ? 'text-green-600' : 'text-red-600'}>
            {isValidUrl ? ' ✓ Oui' : ' ✗ Non'}
          </span>
        </div>
        
        <div>
          <strong>Statut de l'image:</strong> 
          <span className={
            imageStatus === 'loading' ? 'text-yellow-600' :
            imageStatus === 'success' ? 'text-green-600' : 'text-red-600'
          }>
            {imageStatus === 'loading' ? ' ⏳ Chargement...' :
             imageStatus === 'success' ? ' ✓ Chargée' : ' ✗ Erreur'}
          </span>
        </div>
      </div>

      <div className="mt-4">
        <strong>Aperçu:</strong>
        <div className="mt-2 h-32 bg-white border rounded-lg flex items-center justify-center">
          <img 
            src={logoUrl} 
            alt={`Logo de ${partenaireName}`}
            className="max-h-full max-w-full object-contain"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        </div>
      </div>
    </div>
  );
}; 