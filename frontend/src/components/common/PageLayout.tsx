import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { useRTL } from '@/hooks/useRTL';

/**
 * Composant de layout de page réutilisable
 * Fournit une structure cohérente pour les pages avec header, contenu et sections
 */
interface PageLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  showCard?: boolean;
  backgroundImage?: string;
  backgroundGradient?: string;
}

const PageLayout: React.FC<PageLayoutProps> = React.memo(({
  title,
  subtitle,
  children,
  className = "",
  headerClassName = "",
  contentClassName = "",
  showCard = false,
  backgroundImage,
  backgroundGradient = "bg-gradient-to-br from-blue-50 to-indigo-100"
}) => {
  const { isRTL, direction, getTextAlignClass } = useRTL();

  const backgroundStyle = backgroundImage 
    ? {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      } 
    : {};

  const headerSection = (
    <section 
      className={`py-16 ${backgroundGradient} ${headerClassName}`}
      style={backgroundStyle}
      dir={direction}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center ${getTextAlignClass()}`}>
          <h1 className={`text-4xl md:text-5xl font-bold text-gray-900 mb-6 ${getTextAlignClass()}`} dir={direction}>
            {title}
          </h1>
          {subtitle && (
            <p className={`text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed ${getTextAlignClass()}`} dir={direction}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  );

  const content = showCard ? (
    <Card className={contentClassName} dir={direction}>
      <CardHeader>
        <CardTitle className={getTextAlignClass()}>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  ) : (
    <div className={contentClassName} dir={direction}>
      {children}
    </div>
  );

  return (
    <div className={`min-h-screen bg-gray-50 ${className} ${isRTL ? 'rtl' : 'ltr'}`} dir={direction}>
      {headerSection}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          {content}
        </div>
      </section>
    </div>
  );
});

PageLayout.displayName = 'PageLayout';

export default PageLayout; 