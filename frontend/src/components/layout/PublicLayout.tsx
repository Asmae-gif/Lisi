import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';
import { useTranslation } from 'react-i18next';

interface PublicLayoutProps {
  children: React.ReactNode;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  pageTitle?: string;
  pageDescription?: string;
  showHero?: boolean;
  heroTitle?: string;
  heroSubtitle?: string;
  heroImage?: string;
}

const PublicLayout: React.FC<PublicLayoutProps> = ({
  children,
  loading = false,
  error = null,
  onRetry,
  pageTitle,
  pageDescription,
  showHero = false,
  heroTitle,
  heroSubtitle,
  heroImage
}) => {
  const { t } = useTranslation();

  // Affichage de l'état de chargement
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <LoadingSkeleton type="grid" rows={3} />
        </div>
        <Footer />
      </div>
    );
  }

  // Affichage de l'erreur
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center max-w-lg mx-auto p-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              {error === 'Request failed with status code 401' 
                ? t('chargement_donnees')
                : t('erreur_chargement')}
            </h2>
            <p className="text-muted-foreground mb-4">
              {error === 'Request failed with status code 401'
                ? t('utilisation_donnees_defaut')
                : error}
            </p>
            {error !== 'Request failed with status code 401' && onRetry && (
              <button 
                onClick={onRetry}
                className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90"
              >
                {t('reessayer')}
              </button>
            )}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero Section optionnelle */}
        {showHero && (
          <section className="relative bg-gradient-to-br from-primary/5 via-background to-accent/10 py-24 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div className="animate-fade-in">
                  <h1 className="text-4xl font-bold text-gray-900 mb-6">
                    <span className="block">{heroTitle || pageTitle}</span>
                  </h1>
                  <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                    {heroSubtitle || pageDescription}
                  </p>
                </div>
                {heroImage && (
                  <div className="relative animate-fade-in">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-3xl"></div>
                    <div className="relative bg-card rounded-3xl p-8 shadow-2xl border">
                      <img 
                        src={heroImage}
                        alt={heroTitle || pageTitle}
                        className="rounded-2xl w-full h-80 object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Contenu principal */}
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default PublicLayout; 