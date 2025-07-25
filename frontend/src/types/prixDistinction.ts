// Types pour les prix et distinctions

export interface PrixDistinctionMembre {
  id: number;
  nom: string;
  prenom: string;
  role?: string;
  ordre?: number;
}

export interface PrixDistinction {
  id: number;
  titre_fr: string;
  titre_en: string;
  titre_ar: string;
  description_fr: string;
  description_en: string;
  description_ar: string;
  date_obtention: string;
  organisme?: string;
  image_url?: string;
  lien_externe?: string;
  membres: PrixDistinctionMembre[];
  created_at: string;
  updated_at: string;
}

export interface PrixDistinctionFormData {
  titre_fr: string;
  titre_en: string;
  titre_ar: string;
  description_fr: string;
  description_en: string;
  description_ar: string;
  date_obtention: string;
  organisme?: string;
  image_url?: string;
  lien_externe?: string;
  membres: {
    membre_id: number;
    role?: string;
    ordre?: number;
  }[];
}

export interface PrixDistinctionApiResponse {
  success: boolean;
  data: PrixDistinction[];
  message: string;
}

export interface PrixDistinctionSingleApiResponse {
  success: boolean;
  data: PrixDistinction;
  message: string;
} 