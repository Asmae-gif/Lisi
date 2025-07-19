export interface MembreSettings {
  id?: number;
  page: string;
  
  // Champs pour le français
  membres_titre_fr?: string;
  membres_sous_titre_fr?: string;
  
  // Champs pour l'anglais
  membres_titre_en?: string;
  membres_sous_titre_en?: string;
  
  // Champs pour l'arabe
  membres_titre_ar?: string;
  membres_sous_titre_ar?: string;
  
  // Image de couverture
  membres_image?: string;
  
  created_at?: string;
  updated_at?: string;
  [key: string]: string | number | boolean | null | undefined;
}

export interface ApiResponse {
  success?: boolean;
  message?: string;
  data?: MembreSettings;
}

// Interface pour le contenu multilingue
export interface MultilingualContent {
  fr: string;
  ar: string;
  en: string;
}

export interface Field {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'file' | 'number' | 'email' | 'url';
  placeholder?: string;
  required?: boolean;
  rows?: number;
  accept?: string;
}

export interface Section {
  title: string;
  fields: Field[];
  description?: string;
}

// Valeurs par défaut pour les paramètres des membres
export const DEFAULT_MEMBRES_SETTINGS: MembreSettings = {
  page: 'membres',
  membres_titre_fr: 'Nos Membres',
  membres_sous_titre_fr: 'Découvrez les membres permanents, les membres associés et les doctorants qui contribuent aux activités scientifiques et pédagogiques de notre laboratoire.',
  membres_titre_en: 'Our Members',
  membres_sous_titre_en: 'Discover the permanent members, associate members, and doctoral students who contribute to the scientific and educational activities of our laboratory.',
  membres_titre_ar: 'أعضاءنا',
  membres_sous_titre_ar: 'اكتشف الأعضاء الدائمين والأعضاء المنتسبين وطلبة الدكتوراه الذين يساهمون في الأنشطة العلمية والبيداغوجية لمختبرنا .',
  membres_image: '/images/hero.png',
} 

// Fonction utilitaire pour récupérer le contenu dans la langue actuelle
export const getMultilingualContent = (
  settings: MembreSettings, 
  baseKey: string, 
  currentLanguage: string,
  fallbackKey?: string
): string => {
  const languageKey = currentLanguage as 'fr' | 'ar' | 'en';
  const multilingualKey = `${baseKey}_${languageKey}`;

  // Vérifie si la chaîne n’est pas vide
  if (settings[multilingualKey] && typeof settings[multilingualKey] === 'string' && settings[multilingualKey].trim() !== '') {
    return settings[multilingualKey] as string;
  }

  if (settings[baseKey] && typeof settings[baseKey] === 'string' && settings[baseKey].trim() !== '') {
    return settings[baseKey] as string;
  }

  return fallbackKey ?? '';
};


// Fonction utilitaire pour fusionner les données API avec les valeurs par défaut
export const mergeSettingsWithDefaults = (
  apiData: Partial<MembreSettings> | null | undefined
): MembreSettings => {
  if (!apiData || typeof apiData !== 'object') {
    return DEFAULT_MEMBRES_SETTINGS;
  }
  
  return {
    ...DEFAULT_MEMBRES_SETTINGS,
    ...apiData
  };
};

// Fonction pour créer un objet de contenu multilingue
export const createMultilingualField = (
  fr: string = '',
  ar: string = '',
  en: string = ''
): MultilingualContent => ({
  fr,
  ar,
  en
}); 