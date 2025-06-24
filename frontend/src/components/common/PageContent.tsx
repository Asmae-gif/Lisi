import React from 'react';
import { Link } from 'react-router-dom';
import IconMapper from '@/components/common/IconMapper';
import { useTranslation } from 'react-i18next';

interface PageContentProps {
  title: string;
  subtitle?: string;
  description?: string;
  children: React.ReactNode;
  showBackButton?: boolean;
  backButtonText?: string;
  backButtonPath?: string;
  className?: string;
  hero?: boolean;
  backgroundImage?: string;
  backgroundClassName?: string;
}

const PageContent: React.FC<PageContentProps> = ({
  title,
  subtitle,
  description,
  children,
  showBackButton = false,
  backButtonText,
  backButtonPath = '/index',
  className = '',
  hero = false,
  backgroundImage,
  backgroundClassName = '',
}) => {
  const { t } = useTranslation();

  // Hero section style: match Membres.tsx and similar
  const sectionClass = hero
    ? `bg-gradient-to-br from-green-50 to-indigo-100 py-16 ${className}`
    : `py-20 bg-background ${className}`;

  const sectionStyle = hero && backgroundImage
    ? {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : undefined;

  return (
    <section className={sectionClass} style={sectionStyle}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Bouton retour */}
        {showBackButton && (
          <div className="mb-8">
            <Link
              to={backButtonPath}
              className="inline-flex items-center text-primary hover:text-primary/80 font-medium group"
            >
              <IconMapper iconKey="ArrowLeft" className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              {backButtonText || t('retour_accueil')}
            </Link>
          </div>
        )}

        {/* En-tête de page */}
       
        <div className="text-center">
  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">{title}</h1>
  {subtitle && (
    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
      {subtitle}
    </p>
  )}
</div>

          </div>


        {/* Contenu */}
        {children}
   
    </section>
  );
};

export default PageContent; 