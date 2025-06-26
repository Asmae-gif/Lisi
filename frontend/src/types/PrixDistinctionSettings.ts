export interface PrixDistinctionSettings {
    id?: number;
    prix_titre_fr: string;
    prix_titre_en: string;
    prix_titre_ar: string;
    prix_sous_titre_fr: string;
    prix_sous_titre_en: string;
    prix_sous_titre_ar: string;
    prix_image: string;
}

export interface ApiResponse {
    success: boolean;
    message?: string;
    data?: PrixDistinctionSettings;
}

export interface Section {
    title: string;
    fields: {
        key: string;
        label: string;
        type: string;
    }[];
}

export const DEFAULT_PRIX_DISTINCTION_SETTINGS: PrixDistinctionSettings = {
    prix_titre_fr: 'Prix et Distinctions',
    prix_titre_en: 'Awards and Honors',
    prix_titre_ar: 'الجوائز والتكريمات',
    prix_sous_titre_fr: "Nos membres sont régulièrement récompensés pour l'excellence de leurs travaux et leurs contributions innovantes à la recherche scientifique",
    prix_sous_titre_en: 'Our members are regularly recognized for the excellence of their work and their innovative contributions to scientific research.',
    prix_sous_titre_ar: 'يتم تكريم أعضائنا بانتظام تقديراً لتميز أعمالهم ومساهماتهم المبتكرة في البحث العلمي.',
    prix_image: '/images/hero.png'
};

// Fonction utilitaire pour le contenu multilingue
export const getMultilingualContent = (
  settings: PrixDistinctionSettings, 
  baseKey: string, 
  currentLanguage: string,
  fallbackKey?: string
): string => {
  const languageKey = currentLanguage as 'fr' | 'ar' | 'en';
  const multilingualKey = `${baseKey}_${languageKey}`;
  
  // Essayer d'abord le contenu multilingue
  const multilingualContent = settings[multilingualKey as keyof PrixDistinctionSettings] as string;
  if (multilingualContent) {
    return multilingualContent;
  }
  
  // Fallback vers l'ancien système (champ unique)
  const legacyContent = settings[baseKey as keyof PrixDistinctionSettings] as string;
  if (legacyContent) {
    return legacyContent;
  }
  
  // Fallback vers la clé de traduction
  if (fallbackKey) {
    return fallbackKey;
  }
  
  return '';
}; 