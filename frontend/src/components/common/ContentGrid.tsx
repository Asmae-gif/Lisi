import React from 'react';

interface ContentGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
  centered?: boolean;
}

const ContentGrid: React.FC<ContentGridProps> = ({
  children,
  columns = 3,
  gap = 'lg',
  className = '',
  centered = false
}) => {
  const gridClasses = {
    columns: {
      1: 'grid-cols-1',
      2: 'grid-cols-1 md:grid-cols-2',
      3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
    },
    gap: {
      sm: 'gap-4',
      md: 'gap-6',
      lg: 'gap-8'
    }
  };

  const classes = `grid ${gridClasses.columns[columns]} ${gridClasses.gap[gap]} ${
    centered ? 'max-w-6xl mx-auto' : ''
  } ${className}`;

  return (
    <div className={classes}>
      {children}
    </div>
  );
};

export default ContentGrid; 