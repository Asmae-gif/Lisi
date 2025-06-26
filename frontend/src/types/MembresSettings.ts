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
}

export interface ApiResponse {
  success?: boolean;
  message?: string;
  data?: MembreSettings;
}

export interface Field {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'file' | 'number' | 'email' | 'url';
  placeholder?: string;
  required?: boolean;
}

export interface Section {
  title: string;
  fields: Field[];
}

// Valeurs par défaut pour les paramètres des membres
export const DEFAULT_MEMBRES_SETTINGS: MembreSettings = {
  page: 'membres',
  membres_titre_fr: 'Nos Membres',
  membres_sous_titre_fr: 'Découvrez l\'équipe de chercheurs, d\'enseignants et de doctorants qui composent notre laboratoire',
  membres_titre_en: 'Our Members',
  membres_sous_titre_en: 'Discover the team of researchers, teachers and PhD students who make up our laboratory',
  membres_titre_ar: 'أعضاءنا',
  membres_sous_titre_ar: 'اكتشف فريق الباحثين والمعلمين وطلاب الدكتوراه الذين يشكلون مختبرنا',
  membres_image: '/images/hero.png'
} 