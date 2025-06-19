import React, { useState } from 'react';
import { Globe, ChevronDown } from 'lucide-react';

interface Language {
  code: string;
  flag: string;
  name: string;
}

interface LanguageSelectorProps {
  currentLanguage: string;
  onChange: (code: string) => void;
  languages: Language[];
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ currentLanguage, onChange, languages }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-200 font-medium language-selector border"
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium">
          {languages.find(lang => lang.code === currentLanguage)?.flag}
        </span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 icon-rotate ${isOpen ? 'rotated' : ''}`} />
      </button>
      {isOpen && (
        <div className={`absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 dropdown-menu glass-effect`}>
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => { onChange(lang.code); setIsOpen(false); }}
              className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 flex items-center space-x-3 transition-colors ${
                currentLanguage === lang.code ? 'bg-green-50 text-green-600 font-semibold' : 'text-gray-700 font-medium'
              }`}
            >
              <span className="text-lg">{lang.flag}</span>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector; 