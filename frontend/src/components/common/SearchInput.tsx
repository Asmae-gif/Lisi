import React, { useCallback } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

/**
 * Composant de champ de recherche réutilisable
 * Affiche un champ de recherche avec une icône et des fonctionnalités de filtrage
 */
interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  onClear?: () => void;
}

const SearchInput: React.FC<SearchInputProps> = React.memo(({
  value,
  onChange,
  placeholder = "Rechercher...",
  className = "",
  disabled = false,
  onClear
}) => {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  const handleClear = useCallback(() => {
    if (onClear) {
      onClear();
    } else {
      onChange('');
    }
  }, [onClear, onChange]);

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className="w-full pl-10 pr-4 py-2 rounded-md border bg-muted/50 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]"
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
          type="button"
        >
          ×
        </button>
      )}
    </div>
  );
});

SearchInput.displayName = 'SearchInput';

export default SearchInput; 