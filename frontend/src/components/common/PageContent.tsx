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
}

const PageContent: React.FC<PageContentProps> = ({
  title,
  subtitle,
  description,
  children,
  showBackButton = false,
  backButtonText,
  backButtonPath = '/index',
  className = ''
}) => {
  const { t } = useTranslation();

  return (
    <section className={`py-20 bg-background ${className}`}>
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
        <div className="text-center mb-16">
          {subtitle && (
            <p className="text-primary font-semibold mb-4">{subtitle}</p>
          )}
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-8">
            {title}
          </h1>
          {description && (
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* Contenu */}
        {children}
      </div>
    </section>
  );
};

export default PageContent; 