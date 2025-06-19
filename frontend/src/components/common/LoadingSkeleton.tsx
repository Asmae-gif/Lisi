import React from 'react';

/**
 * Composant de skeleton de chargement réutilisable
 * Affiche des éléments de chargement animés pour différents types de contenu
 */
interface LoadingSkeletonProps {
  type?: "table" | "card" | "list" | "grid";
  rows?: number;
  columns?: number;
  className?: string;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = React.memo(({
  type = "table",
  rows = 5,
  columns = 4,
  className = ""
}) => {
  const renderTableSkeleton = () => (
    <div className="space-y-3">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex space-x-4 animate-pulse">
          {[...Array(columns)].map((_, j) => (
            <div key={j} className="h-10 bg-gray-200 rounded w-1/4"></div>
          ))}
        </div>
      ))}
    </div>
  );

  const renderCardSkeleton = () => (
    <div className="space-y-4">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="bg-white p-6 rounded-lg border shadow animate-pulse">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-32"></div>
              <div className="h-6 bg-gray-200 rounded w-24"></div>
            </div>
            <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderListSkeleton = () => (
    <div className="space-y-3">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4 animate-pulse">
          <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderGridSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(rows)].map((_, i) => (
        <div key={i} className="bg-white p-6 rounded-lg border shadow animate-pulse">
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="h-3 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderSkeleton = () => {
    switch (type) {
      case "table":
        return renderTableSkeleton();
      case "card":
        return renderCardSkeleton();
      case "list":
        return renderListSkeleton();
      case "grid":
        return renderGridSkeleton();
      default:
        return renderTableSkeleton();
    }
  };

  return (
    <div className={className}>
      {renderSkeleton()}
    </div>
  );
});

LoadingSkeleton.displayName = 'LoadingSkeleton';

export default LoadingSkeleton; 