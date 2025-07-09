import { useTranslation } from 'react-i18next';
import { useIndexSettingsAPI } from '@/hooks/useIndexSettingsAPI';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { buildImageUrl, buildImageUrlWithDefaults } from '@/utils/imageUtils';

function useScrollToHash() {
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.replace('#', ''));
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [hash]);
}

const DirectorMessage = () => {
  const { t, i18n } = useTranslation('index');
  useScrollToHash();
  
  // Utiliser le hook au lieu de la logique directe
  const { settings } = useIndexSettingsAPI();

  useEffect(() => {
    if (i18n.language === 'ar') {
      document.body.dir = 'rtl';
      document.body.lang = 'ar';
    } else {
      document.body.dir = 'ltr';
      document.body.lang = i18n.language;
    }
  }, [i18n.language]);

  // Fonction utilitaire pour récupérer le contenu dans la langue actuelle
  const getContent = (baseKey: string, fallbackKey: string): string => {
    const languageKey = i18n.language as 'fr' | 'ar' | 'en';
    const langSettings = settings[languageKey];
    
    if (langSettings && typeof langSettings === 'object') {
      const content = langSettings[baseKey as keyof typeof langSettings];
      if (content) {
        return content;
      }
    }
    
    return t(fallbackKey);
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Photo du directeur */}
          <div className="relative">
            <div className="relative">
               <img 
                    src={buildImageUrlWithDefaults(settings.mot_directeur_image)}
                    alt={t('mot_directeur_image')}
                    className="w-56 h-56 rounded-full mx-auto mb-6 object-cover shadow-lg"
                  />
            </div>
          </div>

          {/* Message du directeur */}
          <div>
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {getContent('mot_directeur_titre', 'mot_directeur_titre')}
              </h2>
              <div className="w-20 h-1 bg-green-600 mb-6"></div>
            </div>

            <blockquote className="text-lg text-gray-700 leading-relaxed mb-8">
              {getContent('mot_directeur_description', 'mot_directeur_description')}
            </blockquote>

            <div
  className={`${
    i18n.language === 'ar' ? 'border-r-4 pr-10 text-right' : 'border-l-4 pl-6 text-left'
  } border-green-600`}
  dir={i18n.language === 'ar' ? 'rtl' : 'ltr'}
>
  <div className="font-semibold text-gray-900 text-lg">{t('nom_directeur')}</div>
  <div className="text-green-600 font-medium">{t('titre_directeur')}</div>
</div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default DirectorMessage;
