import React from 'react';
import { Link } from 'react-router-dom';
import IconMapper from '@/components/common/IconMapper';

interface ContentCardProps {
  title: string;
  description?: string;
  subtitle?: string;
  date?: string;
  status?: string;
  statusColor?: string;
  image?: string;
  link?: string;
  externalLink?: string;
  children?: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
  currentLanguage?: string;
}

const ContentCard: React.FC<ContentCardProps> = ({
  title,
  description,
  subtitle,
  date,
  status,
  statusColor = 'bg-primary/10 text-primary',
  image,
  link,
  externalLink,
  children,
  className = '',
  hoverEffect = true,
  currentLanguage
}) => {
  const cardClasses = `bg-card rounded-2xl p-6 shadow-lg border ${
    hoverEffect ? 'hover:shadow-xl transition-all duration-300 hover:-translate-y-2' : ''
  } ${className}`;

  const CardContent = () => (
    <div className={cardClasses}>
      {/* Image optionnelle */}
      {image && (
        <div className="mb-4">
          <img
            src={image}
            alt={title}
            className="w-full h-48 object-cover rounded-xl"
          />
        </div>
      )}

      {/* En-tête avec date et statut */}
      {(date || status) && (
        <div className="flex items-center justify-between mb-4">
          {date && (
            <span className="text-sm text-muted-foreground">
              {new Date(date).toLocaleDateString('fr-FR')}
            </span>
          )}
          {status && (
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${statusColor}`}>
              {status}
            </span>
          )}
        </div>
      )}

      {/* Contenu principal */}
      <div className="space-y-3">
        <h3
          className="font-bold text-foreground leading-tight text-lg"
          dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
          style={{ textAlign: currentLanguage === 'ar' ? 'right' : 'left' }}
        >
          {title}
        </h3>
        
        {subtitle && (
          <p className="text-muted-foreground text-sm font-medium">
            {subtitle}
          </p>
        )}
        
        {description && (
          <p
            className="text-muted-foreground leading-relaxed"
            dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
            style={{ textAlign: currentLanguage === 'ar' ? 'right' : 'left' }}
          >
            {description}
          </p>
        )}

        {children}

        {/* Liens - Commentés pour éviter le double lien, car la carte entière est déjà un lien */}
        {/* {(link || externalLink) && (
          <div className="pt-4">
            {link ? (
              <Link 
                to={link} 
                className="text-primary hover:text-primary/80 font-medium flex items-center group"
              >
                {externalLink ? 'Visiter le site' : 'Lire la suite'}
                <IconMapper iconKey="ArrowRight" className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <a
                href={externalLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 font-medium flex items-center group"
              >
                Visiter le site
                <IconMapper iconKey="ExternalLink" className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>
            )}
          </div>
        )} */}
      </div>
    </div>
  );

  // Si la carte ne doit pas être un lien, retourner juste le contenu
  if (!link && !externalLink) {
    return <CardContent />;
  }

  // Si lien externe, utiliser une balise a
  if (externalLink) {
    return (
      <a
        href={externalLink}
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <CardContent />
      </a>
    );
  }

  // Sinon, utiliser Link de React Router
  return (
    <Link to={link!} className="block">
      <CardContent />
    </Link>
  );
};

export default ContentCard; 