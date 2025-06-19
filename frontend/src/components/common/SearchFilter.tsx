import React, { useState, useMemo } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SearchFilterProps {
  data: Record<string, any>[];
  onFilteredDataChange: (filteredData: Record<string, any>[]) => void;
  searchFields?: string[];
  placeholder?: string;
  className?: string;
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  data,
  onFilteredDataChange,
  searchFields,
  placeholder = "Rechercher...",
  className = ""
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});

  const filteredData = useMemo(() => {
    let filtered = [...data];

    // Filtrage par recherche
    if (searchTerm) {
      filtered = filtered.filter(item => {
        if (searchFields) {
          return searchFields.some(field => 
            item[field]?.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        return Object.values(item).some(value => 
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    // Filtrage par filtres actifs
    Object.entries(activeFilters).forEach(([key, value]) => {
      if (value) {
        filtered = filtered.filter(item => 
          String(item[key]).toLowerCase().includes(value.toLowerCase())
        );
      }
    });

    return filtered;
  }, [data, searchTerm, activeFilters, searchFields]);

  // Mettre à jour les données filtrées
  React.useEffect(() => {
    onFilteredDataChange(filteredData);
  }, [filteredData, onFilteredDataChange]);

  const clearFilters = () => {
    setSearchTerm('');
    setActiveFilters({});
  };

  const hasActiveFilters = searchTerm || Object.values(activeFilters).some(v => v);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Barre de recherche */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filtres actifs */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-gray-500">Filtres actifs:</span>
          
          {searchTerm && (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded">
              Recherche: "{searchTerm}"
              <button
                onClick={() => setSearchTerm('')}
                className="ml-1 hover:text-blue-600"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          
          {Object.entries(activeFilters).map(([key, value]) => (
            value && (
              <span key={key} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-800 text-sm rounded">
                {key}: "{value}"
                <button
                  onClick={() => setActiveFilters(prev => ({ ...prev, [key]: '' }))}
                  className="ml-1 hover:text-gray-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )
          ))}
          
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="text-xs"
          >
            Effacer tout
          </Button>
        </div>
      )}

      {/* Résultats */}
      <div className="text-sm text-gray-500">
        {filteredData.length} résultat(s) trouvé(s)
      </div>
    </div>
  );
};

export default SearchFilter; 