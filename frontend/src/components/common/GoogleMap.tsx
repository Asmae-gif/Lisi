import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface GoogleMapProps {
  location: string;
  className?: string;
  height?: string;
  useDirectUrl?: boolean; // Option pour utiliser une URL directe sans clé API
}

const GoogleMap: React.FC<GoogleMapProps> = ({ 
  location, 
  className = "w-full h-64 rounded-lg overflow-hidden",
  height = "100%",
  useDirectUrl = true // Par défaut, utiliser l'URL directe
}) => {
  const { t } = useTranslation('contact');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Option 1: URL directe sans clé API (recommandé pour le développement)
  const directMapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(location)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;
  
  // Option 2: Avec clé API Google Maps (pour la production)
  const GOOGLE_MAPS_API_KEY = import.meta.env?.VITE_GOOGLE_MAPS_API_KEY || 'YOUR_GOOGLE_MAPS_API_KEY';
  const apiMapUrl = `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(location)}`;
  
  const mapUrl = useDirectUrl ? directMapUrl : apiMapUrl;

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  if (!location) {
    return (
      <div className={`${className} bg-gray-200 flex items-center justify-center`}>
        <p className="text-gray-500">{t('mapPlaceholder')}</p>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className={`${className} bg-gray-200 flex items-center justify-center`}>
        <p className="text-gray-500">{t('mapError')}</p>
      </div>
    );
  }

  return (
    <div className={`${className} relative`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center z-10">
          <p className="text-gray-500">{t('mapLoading')}</p>
        </div>
      )}
      <iframe
        src={mapUrl}
        width="100%"
        height={height}
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Localisation"
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  );
};

export default GoogleMap; 