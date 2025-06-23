import React from 'react';

interface Stat {
  number: number | string;
  label: string;
  icon?: React.ReactNode;
}

interface StatsSectionProps {
  stats: Stat[];
  title?: string;
  subtitle?: string;
  description?: string;
  className?: string;
}

const StatsSection: React.FC<StatsSectionProps> = ({
  stats,
  title,
  subtitle,
  description,
  className = ''
}) => {
  return (
    <section className={`py-20 bg-muted/30 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(title || subtitle || description) && (
          <div className="text-center mb-16">
            {subtitle && (
              <p className="text-primary font-semibold mb-4">{subtitle}</p>
            )}
            {title && (
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-8">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                {description}
              </p>
            )}
          </div>
        )}
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              {stat.icon && (
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                  {stat.icon}
                </div>
              )}
              <div className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                {stat.number}
              </div>
              <p className="text-muted-foreground font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection; 