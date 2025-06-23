import React from 'react';

interface AlternatingSectionProps {
  children: React.ReactNode;
  className?: string;
  background?: 'light' | 'muted' | 'primary' | 'gradient';
  fullWidth?: boolean;
}

const AlternatingSection: React.FC<AlternatingSectionProps> = ({
  children,
  className = '',
  background = 'light',
  fullWidth = false
}) => {
  const backgroundClasses = {
    light: 'bg-background',
    muted: 'bg-muted/30',
    primary: 'bg-primary/5',
    gradient: 'bg-gradient-to-br from-primary/5 via-background to-accent/10'
  };

  const containerClasses = fullWidth ? 'w-full' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8';

  return (
    <section className={`py-20 ${backgroundClasses[background]} ${className}`}>
      <div className={containerClasses}>
        {children}
      </div>
    </section>
  );
};

export default AlternatingSection; 