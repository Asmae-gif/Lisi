import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { axesApi } from '../../services/api';
import { Axe } from '../../types/axe';
import AxeCard from '../common/AxeCard';

interface AxesRechercheProps {
  sousTitre: string;
  titre: string;
  description: string;
  texteFinal: string;
}

const AxesRecherche: React.FC<AxesRechercheProps> = () => {
  const { t } = useTranslation('index');
  const [axes, setAxes] = useState<Axe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les axes depuis l'API
  useEffect(() => {
    const loadAxes = async () => {
      try {
        setLoading(true);
        const response = await axesApi.getAxes();
        
        if (response.success && response.data) {
          setAxes(response.data as unknown as Axe[]);
        } else {
          setError(response.message || 'Erreur lors du chargement des axes');
        }
      } catch (err) {
        console.error('Erreur lors du chargement des axes:', err);
        setError('Erreur lors du chargement des axes');
      } finally {
        setLoading(false);
      }
    };

    loadAxes();
  }, []);

  // Générer les cartes des domaines avec les données des axes
  const domainCards = useMemo(() => {
    return axes.map((axe) => (
      <AxeCard 
        key={axe.id} 
        axe={axe} 
        variant="compact"
      />
    ));
  }, [axes]);

  if (loading) {
    return (
      <section className="py-20" >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {[1, 2, 3, 4, 5, 6].map((index) => (
            <div key={index} className="group bg-card rounded-2xl p-6 shadow-lg border animate-pulse">
              <div className="flex items-start rtl:space-x-revers space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                </div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {domainCards}
      </div>
    </section>
  );
};

export default AxesRecherche;
