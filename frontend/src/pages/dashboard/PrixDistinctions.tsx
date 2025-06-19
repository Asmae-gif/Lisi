import React from 'react';
import PrixDistinctionManager from '@/components/PrixDistinctionManager';

const PrixDistinctions: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Prix et Distinctions</h1>
          <p className="text-gray-600 mt-2">
            Gérez les prix et distinctions obtenus par les membres du laboratoire
          </p>
        </div>
        
        <PrixDistinctionManager />
      </div>
    </div>
  );
};

export default PrixDistinctions; 