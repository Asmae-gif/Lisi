import React from 'react';
import { useTranslation } from 'react-i18next';
import { useTranslatedContent } from '@/hooks/useTranslatedContent';

/**
 * Composant Hero de la page d'accueil
 * Affiche le contenu français de la base de données avec traduction automatique
 */
export const HeroSection: React.FC = () => {
  const { t } = useTranslation('index');
  const { settings, loading, error, getTranslatedField } = useTranslatedContent();

  // Logs pour diagnostiquer l'affichage
  console.log('🎨 HeroSection: Rendu du composant');
  console.log('📊 HeroSection: Settings actuels:', settings);
  console.log('🔤 HeroSection: Exemple de contenu:', {
    hero_titre_principal: settings.hero_titre_principal,
    hero_sous_titre: settings.hero_sous_titre
  });

  if (loading) {
    console.log('⏳ HeroSection: Affichage du loading');
    return (
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-white/20 rounded mb-4 max-w-2xl mx-auto"></div>
            <div className="h-4 bg-white/20 rounded mb-2 max-w-xl mx-auto"></div>
            <div className="h-4 bg-white/20 rounded max-w-lg mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    console.log('❌ HeroSection: Affichage de l\'erreur:', error);
    return (
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-4">
            {t('erreur_chargement')}
          </h1>
          <p className="text-lg opacity-90">
            {t('utilisation_donnees_defaut')}
          </p>
        </div>
      </div>
    );
  }

  // Test direct d'affichage
  const titrePrincipal = settings.hero_titre_principal || t('hero_titre_principal');
  const sousTitre = settings.hero_sous_titre || t('hero_sous_titre');

  console.log('✅ HeroSection: Affichage du contenu normal');
  console.log('🔤 HeroSection: Titre principal direct:', titrePrincipal);
  console.log('🔤 HeroSection: Sous-titre direct:', sousTitre);
  console.log('🔤 HeroSection: Titre via getTranslatedField:', getTranslatedField('hero_titre_principal', 'hero_titre_principal'));

  return (
    <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Contenu texte */}
          <div className="text-center lg:text-left">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              {/* Test direct d'affichage */}
              {titrePrincipal}
            </h1>
            
            <p className="text-xl lg:text-2xl mb-8 opacity-90 leading-relaxed">
              {/* Test direct d'affichage */}
              {sousTitre}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                {t('decouvrir_mission')}
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
                {t('nos_domaines_recherche')}
              </button>
            </div>
          </div>
          
          {/* Image */}
          <div className="relative">
            {settings.hero_image_side ? (
              <img 
                src={settings.hero_image_side} 
                alt={t('alt_hero_image')}
                className="w-full h-auto rounded-lg shadow-2xl"
              />
            ) : (
              <div className="w-full h-64 bg-white/10 rounded-lg flex items-center justify-center">
                <span className="text-white/60">
                  {t('alt_hero_image')}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 