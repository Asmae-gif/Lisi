import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface FilterBarProps {
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  filterOptions?: FilterOption[];
  selectedFilter: string;
  onFilterChange: (value: string) => void;
  showSearch?: boolean;
  showFilter?: boolean;
}

const FilterBar: React.FC<FilterBarProps> = ({
  searchPlaceholder = 'Rechercher...',
  searchValue,
  onSearchChange,
  filterOptions = [],
  selectedFilter,
  onFilterChange,
  showSearch = true,
  showFilter = true
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { t, i18n } = useTranslation('translation');
  const isArabic = i18n.language === 'ar';

  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Barre de recherche */}
        {showSearch && (
          <div className="relative flex-1 max-w-md">
            <Search
              className={`absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground ${
                isArabic ? 'right-3' : 'left-3'
              }`}
            />
            <input
              type="text"
              placeholder={searchPlaceholder || t('search_placeholder')}
              aria-label={t('search_placeholder')}
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              dir={isArabic ? 'rtl' : 'ltr'}
              className={`w-full py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                isArabic ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4 text-left'
              }`}
            />
          </div>
        )}

        {/* Filtres */}
        {showFilter && filterOptions.length > 0 && (
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
              dir={isArabic ? 'rtl' : 'ltr'}
            >
              <Filter className="h-4 w-4" />
              <span>{t('filter')}</span>
              {selectedFilter !== 'all' && (
                <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                  {filterOptions.find(opt => opt.value === selectedFilter)?.label}
                </span>
              )}
            </button>

            {isFilterOpen && (
              <div
                className={`absolute ${
                  isArabic ? 'left-0' : 'right-0'
                } top-full mt-2 bg-card border border-border rounded-lg shadow-lg z-10 min-w-[200px]`}
              >
                <div className="p-2" dir={isArabic ? 'rtl' : 'ltr'}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{t('filter_by')}</span>
                    <button
                      onClick={() => setIsFilterOpen(false)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        onFilterChange('all');
                        setIsFilterOpen(false);
                      }}
                      className={`w-full px-3 py-2 rounded text-sm transition-colors ${
                        selectedFilter === 'all'
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`}
                      style={{ textAlign: isArabic ? 'right' : 'left' }}
                    >
                      {t('all')}
                    </button>
                    {filterOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          onFilterChange(option.value);
                          setIsFilterOpen(false);
                        }}
                        className={`w-full px-3 py-2 rounded text-sm transition-colors ${
                          selectedFilter === option.value
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-muted'
                        }`}
                        style={{ textAlign: isArabic ? 'right' : 'left' }}
                      >
                        {option.label}
                        {option.count !== undefined && (
                          <span className="ml-2 text-xs text-muted-foreground">
                            ({option.count})
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Résultats de recherche */}
      {(searchValue || selectedFilter !== 'all') && (
        <div
          className="mt-4 flex items-center gap-2 text-sm text-muted-foreground"
          dir={isArabic ? 'rtl' : 'ltr'}
        >
          <span>{t('active_filters')}:</span>
          {searchValue && (
            <span className="bg-muted px-2 py-1 rounded">
              {t('search')}: "{searchValue}"
            </span>
          )}
          {selectedFilter !== 'all' && (
            <span className="bg-muted px-2 py-1 rounded">
              {filterOptions.find(opt => opt.value === selectedFilter)?.label}
            </span>
          )}
          <button
            onClick={() => {
              onSearchChange('');
              onFilterChange('all');
            }}
            className="text-primary hover:underline"
          >
            {t('clear_all_filters')}
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
