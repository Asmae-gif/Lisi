import React from 'react';
import { useTranslation } from 'react-i18next';

export interface KeyFigure {
  number: string | number;
  label: string;
}

export interface KeyFiguresProps {
  stats: KeyFigure[];
}

const KeyFigures: React.FC<KeyFiguresProps> = ({ stats }) => {
  const { t } = useTranslation('index');
  return (
    <section className="py-16 bg-muted/30">
  {/* CHIFFRES CLÉS */}
  <div className="bg-gray-50 py-12 px-6 rounded-lg max-w-7xl mx-auto">
  <p className="text-primary font-semibold mb-4 text-center">{t('chiffres_cles_sous_titre')}</p>
    <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-8 text-center">{t('chiffres_cles_titre')}</h2>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
      {stats.map((stat, idx) => (
        <div
          key={idx}
          className="bg-white p-6 rounded-lg shadow-sm hover:shadow-lg transform hover:scale-105 transition duration-300 ease-in-out"
        >
          <div className="text-4xl font-bold text-green-600 mb-2">{stat.number}</div>
          <div className="text-gray-700 font-medium">{stat.label}</div>
        </div>
      ))}
    </div>
  </div>
</section>

  );
};

export default KeyFigures;