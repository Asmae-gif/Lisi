import { useEffect, useState } from 'react';
import { partenaireApi } from '@/services/partenaireApi';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useTranslation } from 'react-i18next';
import { PartenaireSettings } from '@/types/PartenaireSettings';
import { usePartenaireSettings } from '@/hooks/usePartenaireSettings';
import { buildImageUrl, handleImageError, getSafeImageUrl } from '@/utils/imageUtils';

interface Partenaire {
  id: number;
  nom_fr: string;
  nom_en: string;
  nom_ar: string;
  logo?: string;
  lien: string;
  created_at: string;
  updated_at: string;
}

export default function Partenaires() {
  const [partenaires, setPartenaires] = useState<Partenaire[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t, i18n } = useTranslation('partenaires');
  const currentLang = i18n.language;
  const { settings, loading: settingsLoading, error: settingsError } = usePartenaireSettings();

  useEffect(() => {
    const fetchPartenaires = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await partenaireApi.getAll();
        const data = response.data.data || response.data;
        if (Array.isArray(data)) {
          setPartenaires(data);
        } else {
          setPartenaires([]);
        }
      } catch (err) {
        console.error('Erreur lors du chargement des partenaires:', err);
        setError('Erreur lors du chargement des partenaires');
        setPartenaires([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPartenaires();
  }, []);

  const getLocalizedTitle = (partenaire: Partenaire) => {
    if (!partenaire) return '';
    
    switch (currentLang) {
      case 'en':
        return partenaire.nom_en || partenaire.nom_fr || '';
      case 'ar':
        return partenaire.nom_ar || partenaire.nom_fr || '';
      default:
        return partenaire.nom_fr || '';
    }
  };

  const getLocalizedField = (baseKey: string) => {
    if (!settings) return '';
    
    return settings[`${baseKey}_${currentLang}` as keyof PartenaireSettings]
      || settings[`${baseKey}_fr` as keyof PartenaireSettings]
      || '';
  };

  const heroTitle = getLocalizedField('partenaire_titre') || 'Nos Partenaires';
  const heroSubtitle = getLocalizedField('partenaire_sous_titre') || 'Nous collaborons avec des institutions académiques prestigieuses et des entreprises innovantes.';
  const heading = getLocalizedField('partenaire_heading') || 'Collaborations d\'Excellence';
  const description = getLocalizedField('partenaire_description') || 'Notre réseau de partenaires comprend des institutions académiques de renommée mondiale.';

  if (loading || settingsLoading) {
    return (
      <div className={`min-h-screen bg-white ${currentLang === 'ar' ? 'rtl' : 'ltr'}`}>
        <Header />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <span className="text-gray-500 text-lg">Chargement des partenaires...</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || settingsError) {
    return (
      <div className={`min-h-screen bg-white ${currentLang === 'ar' ? 'rtl' : 'ltr'}`}>
        <Header />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center max-w-md mx-auto px-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Erreur de chargement</h3>
            <p className="text-gray-600 mb-4">{error || settingsError}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Réessayer
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-white ${currentLang === 'ar' ? 'rtl' : 'ltr'}`}>
      <Header />

      {/* Hero Section */}
      <section 
        className="bg-gradient-to-br from-green-50 to-indigo-100 py-16"
        style={settings?.partenaire_image ? {
          backgroundImage: `url(${buildImageUrl(settings.partenaire_image)})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        } : undefined}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {heroTitle}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {heroSubtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Statistiques */}
        <section className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
              <div className="flex items-center rtl:space-x-reverse space-x-3">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-blue-600">{t('stats.total', 'Total Partenaires')}</p>
                  <p className="text-2xl font-bold text-blue-900">{partenaires.length}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
              <div className="flex items-center rtl:space-x-reverse space-x-3">
                <div className="p-2 bg-green-500 rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-green-600">{t('stats.academic', 'Partenaires Académiques')}</p>
                  <p className="text-2xl font-bold text-green-900">
                    {partenaires.filter(p => {
                      const title = getLocalizedTitle(p);
                      return title && (title.toLowerCase().includes('université') || 
                                     title.toLowerCase().includes('école') || 
                                     title.toLowerCase().includes('institut'));
                    }).length}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
              <div className="flex items-center rtl:space-x-reverse space-x-3">
                <div className="p-2 bg-purple-500 rounded-lg">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-purple-600">{t('stats.industrial', 'Partenaires Industriels')}</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {partenaires.filter(p => {
                      const title = getLocalizedTitle(p);
                      return title && !title.toLowerCase().includes('université') && 
                             !title.toLowerCase().includes('école') && 
                             !title.toLowerCase().includes('institut');
                    }).length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section d'introduction */}
        <div className="mb-12 bg-gradient-to-r from-gray-50 to-gray-100 p-8 rounded-2xl border border-gray-200">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {heading}
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        {/* Liste des partenaires */}
        {partenaires && partenaires.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {partenaires.map((partenaire) => (
              <div key={partenaire.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group">
                {/* Logo du partenaire */}
                <div className="h-48 bg-gray-50 flex items-center justify-center p-6 border-b border-gray-100">
                  <img 
                    src={getSafeImageUrl(partenaire.logo, getLocalizedTitle(partenaire))}
                    alt={getLocalizedTitle(partenaire)}
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => handleImageError(e, undefined, getLocalizedTitle(partenaire))}
                  />
                </div>
                
                {/* Informations du partenaire */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 text-center min-h-[3rem] flex items-center justify-center">
                    {getLocalizedTitle(partenaire)}
                  </h3>
                  
                  {partenaire.lien && (
                    <a
                      href={partenaire.lien}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors group-hover:bg-blue-700"
                    >
                      <span>{t('common.visitWebsite', 'Visiter le site web')}</span>
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t('noPartenaires.title', 'Aucun partenaire disponible')}
              </h3>
              <p className="text-gray-600">
                {t('noPartenaires.description', 'Aucun partenaire n\'est disponible pour le moment. Revenez bientôt pour découvrir nos nouvelles collaborations.')}
              </p>
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
} 