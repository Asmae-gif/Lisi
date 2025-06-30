import React from 'react';
import { getSafeImageUrl, generateFallbackLogo } from '@/utils/imageUtils';

interface ImageTestProps {
  testUrls: string[];
}

export const ImageTest: React.FC<ImageTestProps> = ({ testUrls }) => {
  return (
    <div className="p-6 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Test d'affichage des images</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {testUrls.map((url, index) => (
          <div key={index} className="bg-white p-4 rounded-lg border">
            <h4 className="font-medium mb-2">Test {index + 1}</h4>
            <p className="text-xs text-gray-600 mb-2 break-all">{url}</p>
            <div className="h-32 bg-gray-100 rounded flex items-center justify-center">
              <img 
                src={getSafeImageUrl(url, `Test ${index + 1}`)}
                alt={`Test ${index + 1}`}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </div>
        ))}
        
        {/* Test avec fallback automatique */}
        <div className="bg-white p-4 rounded-lg border">
          <h4 className="font-medium mb-2">Fallback automatique</h4>
          <p className="text-xs text-gray-600 mb-2">Logo INWI généré automatiquement</p>
          <div className="h-32 bg-gray-100 rounded flex items-center justify-center">
            <img 
              src={generateFallbackLogo('INWI', 300, 150)}
              alt="INWI Fallback"
              className="max-h-full max-w-full object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}; 