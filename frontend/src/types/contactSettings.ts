export interface ContactSettings {
    id?: number;
    page: string;

    // Champs pour le français
    contact_titre_fr?: string;
    contact_sous_titre_fr?: string;
    contact_titre2_fr?:string;
    contact_adresse_fr?: string;
    
    //champs pour l'anglais
    contact_titre_en?: string;
    contact_sous_titre_en?: string;
    contact_titre2_en?:string;
    contact_adresse_en?: string;

    //champs pour l'arabe
    contact_titre_ar?: string;
    contact_sous_titre_ar?: string;
    contact_titre2_ar?:string;
    contact_adresse_ar?: string;

    contact_email?: string;
    contact_telephone?: string;
    contact_location?: string;

    contact_image?: string;
  }
  
  export const DEFAULT_CONTACT_SETTINGS: ContactSettings = {
    page: "contact",
    contact_titre_fr: "Contactez-nous",
    contact_sous_titre_fr: "Nous sommes à votre disposition pour répondre à vos questions, discuter de collaborations ou explorer de nouvelles opportunités de recherche.",
    contact_titre2_fr: "Informations de Contact",
    contact_adresse_fr: "Av Abdelkrim Khattabi, B.P. 511 - 40000 –Marrakech ",
    contact_titre_en: "Contact Us",
    contact_sous_titre_en: "We are at your disposal to answer your questions, discuss collaborations or explore new research opportunities.",
    contact_titre2_en: "Contact Information",
    contact_adresse_en: "Av Abdelkrim Khattabi, B.P. 511 - 40000 –Marrakech ",
    contact_titre_ar: "اتصل بنا",
    contact_sous_titre_ar: "نحن على استعداد للإجابة على أسئلتكم ونناقش التعاون واستكشاف الفرص البحثية الجديدة.",
    contact_titre2_ar: "معلومات الاتصال",
    contact_adresse_ar: "شارع عبد الكريم الخطابي، ص. ب 511 - 40000 – مراكش",
    contact_telephone: "06 70 09 85 53 / 06 70 09 89 50 ",
    contact_location: "Faculté des Sciences Semlalia, Marrakech, Maroc",
    contact_image: '/images/hero.png'
  }
  
  export interface ApiResponse {
    success?: boolean;
    message?: string;
    data?: ContactSettings;
  }
  
  export interface Field {
    key: string;
    label: string;
    type: 'text' | 'textarea' | 'file' | 'location';
    placeholder?: string;
  }

  // Interface pour le contenu multilingue
export interface MultilingualContent {
  fr: string;
  ar: string;
  en: string;
}
  
  export interface Section {
    title: string;
    fields: Field[];
  } 

// Fonction utilitaire pour récupérer le contenu dans la langue actuelle
export const getMultilingualContent = (
  settings: ContactSettings, 
  baseKey: string, 
  currentLanguage: string,
  fallbackKey?: string
): string => {
  const languageKey = currentLanguage as 'fr' | 'ar' | 'en';
  const multilingualKey = `${baseKey}_${languageKey}`;
  
  // Essayer d'abord le contenu multilingue
  const multilingualContent = settings[multilingualKey] as string;
  if (multilingualContent) {
    return multilingualContent;
  }
  
  // Fallback vers l'ancien système (champ unique)
  const legacyContent = settings[baseKey] as string;
  if (legacyContent) {
    return legacyContent;
  }
  
  // Fallback vers la clé de traduction
  if (fallbackKey) {
    return fallbackKey;
  }
  
  return '';
};

// Fonction utilitaire pour fusionner les données API avec les valeurs par défaut
export const mergeSettingsWithDefaults = (
  apiData: Partial<ContactSettings> | null | undefined
): ContactSettings => {
  if (!apiData || typeof apiData !== 'object') {
    return DEFAULT_CONTACT_SETTINGS;
  }
  
  return {
    ...DEFAULT_CONTACT_SETTINGS,
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