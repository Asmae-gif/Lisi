export interface RechercheSettings {
  id?: number;
  page: string;
  // Champs pour le français
  titre_fr?: string;
  texte_intro_fr?: string;
  title_strategic_fr?: string;
  subtitle_strategic_fr?: string;
  title_analysis_fr?: string;
  title_process_fr?: string;
  subtitle_process_fr?: string;
  step_1_title_fr?: string;
  step_1_desc_fr?: string;
  step_2_title_fr?: string;
  step_2_desc_fr?: string;
  step_3_title_fr?: string;
  step_3_desc_fr?: string;
  step_4_title_fr?: string;
  step_4_desc_fr?: string;
  step_5_title_fr?: string;
  step_5_desc_fr?: string;
  // Champs pour l'anglais
  titre_en?: string;
  texte_intro_en?: string;  
  title_strategic_en?: string;
  subtitle_strategic_en?: string;
  title_analysis_en?: string;
  title_process_en?: string;
  subtitle_process_en?: string;
  step_1_title_en?: string;
  step_1_desc_en?: string;
  step_2_title_en?: string;
  step_2_desc_en?: string;
  step_3_title_en?: string;
  step_3_desc_en?: string;
  step_4_title_en?: string;
  step_4_desc_en?: string;
  step_5_title_en?: string;
  step_5_desc_en?: string;
  // Champs pour l'arabe
  titre_ar?: string;
  texte_intro_ar?: string;  
  title_strategic_ar?: string;
  subtitle_strategic_ar?: string;
  title_analysis_ar?: string;
  title_process_ar?: string;
  subtitle_process_ar?: string;
  step_1_title_ar?: string;
  step_1_desc_ar?: string;
  step_2_title_ar?: string;
  step_2_desc_ar?: string;
  step_3_title_ar?: string;
  step_3_desc_ar?: string;
  step_4_title_ar?: string;
  step_4_desc_ar?: string;
  step_5_title_ar?: string;
  step_5_desc_ar?: string;

  // Image de couverture
  recherche_image?: string;
  [key: string]: string | number | boolean | null | undefined;
}

export interface ApiResponse {
  success?: boolean;
  message?: string;
  data?: RechercheSettings;
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

// Valeurs par défaut pour les paramètres
export const DEFAULT_RECHERCHE_SETTINGS: RechercheSettings = {
  page: "recherche",

  // 🇫🇷 Français
  titre_fr: "Nos Domaines d'Excellence",
  texte_intro_fr: "Découvrez nos domaines d'expertise et nos axes de recherche stratégiques.",
  title_strategic_fr: "Nos Axes Stratégiques",
  subtitle_strategic_fr: "Nos axes de recherche sont organisés autour de thématiques clés qui répondent aux défis technologiques contemporains.",
  title_analysis_fr: "Analyse Détaillée par Axe",
  title_process_fr: "Processus de Recherche",
  subtitle_process_fr: "Notre approche méthodologique suit un processus rigoureux en plusieurs étapes.",
  step_1_title_fr: "Problématique",
  step_1_desc_fr: "Identification des défis scientifiques",
  step_2_title_fr: "Objectifs",
  step_2_desc_fr: "Définition claire des objectifs visés",
  step_3_title_fr: "Approche",
  step_3_desc_fr: "Développement de méthodologies adaptées",
  step_4_title_fr: "Expérimentation",
  step_4_desc_fr: "Tests et validation des hypothèses",
  step_5_title_fr: "Résultats",
  step_5_desc_fr: "Publication et valorisation des découvertes",
  recherche_image: '/images/hero.png',

  // 🇬🇧 English
  titre_en: "Our Research Domains",
  texte_intro_en: "Discover our areas of expertise and our strategic research axes.",
  title_strategic_en: "Our Strategic Axes",
  subtitle_strategic_en: "Our research axes are organized around key themes that respond to current technological challenges.",
  title_analysis_en: "Detailed Analysis by Axis",
  title_process_en: "Research Process",
  subtitle_process_en: "Our methodological approach follows a rigorous process in several steps.",
  step_1_title_en: "Problem Statement",
  step_1_desc_en: "Identifying scientific challenges",
  step_2_title_en: "Objectives",
  step_2_desc_en: "Clearly defining the goals to be achieved",
  step_3_title_en: "Approach",
  step_3_desc_en: "Developing appropriate methodologies",
  step_4_title_en: "Experimentation",
  step_4_desc_en: "Testing and validating hypotheses",
  step_5_title_en: "Results",
  step_5_desc_en: "Publishing and promoting  discoveries",

  // 🇸🇦 Arabe
    "titre_ar": "مجالات بحثنا",
    "texte_intro_ar": "اكتشف مجالات خبرتنا ومحاورنا البحثية الاستراتيجية.",
    "title_strategic_ar": "محاورنا الاستراتيجية",
    "subtitle_strategic_ar": "يتم تنظيم محاور البحث لدينا حول مواضيع رئيسية تستجيب للتحديات التكنولوجية المعاصرة.",
    "title_analysis_ar": "تحليل مفصل حسب المحور",
    "title_process_ar": "عملية البحث",
    "subtitle_process_ar": "يعتمد نهجنا المنهجي على عملية دقيقة تتكون من مراحل متعددة.",
    "step_1_title_ar": "الإشكالية",
    "step_1_desc_ar": "تحديد التحديات العلمية",
    "step_2_title_ar": "الأهداف",
    "step_2_desc_ar": "تحديد واضح للأهداف المراد تحقيقها",
    "step_3_title_ar": "المنهجية",
    "step_3_desc_ar": "تطوير مناهج مناسبة",
    "step_4_title_ar": "التجريب",
    "step_4_desc_ar": "اختبار الفرضيات والتحقق من صحتها",
    "step_5_title_ar": "النتائج",
    "step_5_desc_ar": "نشر النتائج وتعزيز نتائج البحث"
  
}; 

// Fonction utilitaire pour récupérer le contenu dans la langue actuelle
export const getMultilingualContent = (
  settings: RechercheSettings, 
  baseKey: string, 
  currentLanguage: string,
  fallbackKey?: string
): string => {
  const languageKey = currentLanguage as 'fr' | 'ar' | 'en';
  const multilingualKey = `${baseKey}_${languageKey}`;
  
  // Priorité 1: Champ multilingue spécifique (ex: titre_fr)
  // On vérifie si la clé existe, même si sa valeur est une chaîne vide
  if (multilingualKey in settings && settings[multilingualKey] !== null && settings[multilingualKey] !== undefined) {
    return settings[multilingualKey] as string;
  }
  
  // Priorité 2: Champ générique (ex: titre)
  if (baseKey in settings && settings[baseKey] !== null && settings[baseKey] !== undefined) {
    return settings[baseKey] as string;
  }
  
  // Fallback vers la clé de traduction si rien n'est trouvé
  if (fallbackKey) {
    return fallbackKey;
  }
  
  return '';
};

// Fonction utilitaire pour fusionner les données API avec les valeurs par défaut
export const mergeSettingsWithDefaults = (
  apiData: Partial<RechercheSettings> | null | undefined
): RechercheSettings => {
  if (!apiData || typeof apiData !== 'object') {
    return DEFAULT_RECHERCHE_SETTINGS;
  }
  
  return {
    ...DEFAULT_RECHERCHE_SETTINGS,
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