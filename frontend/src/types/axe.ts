/**
 * Types centralisés pour les axes de recherche
 * Ce fichier unifie toutes les définitions d'axes dans l'application
 */

export interface Axe {
  id: number
  // Champs multilingues
  title_fr: string
  title_en: string
  title_ar: string
  slug: string
  icon?: string
  problematique_fr: string
  problematique_en: string
  problematique_ar: string
  objectif_fr: string
  objectif_en: string
  objectif_ar: string
  approche_fr: string
  approche_en: string
  approche_ar: string
  resultats_attendus_fr: string
  resultats_attendus_en: string
  resultats_attendus_ar: string
  created_at: string
  updated_at: string
}

export interface AxeFormData {
  // Champs multilingues
  title_fr: string
  title_en: string
  title_ar: string
  slug: string
  icon?: string
  problematique_fr: string
  problematique_en: string
  problematique_ar: string
  objectif_fr: string
  objectif_en: string
  objectif_ar: string
  approche_fr: string
  approche_en: string
  approche_ar: string
  resultats_attendus_fr: string
  resultats_attendus_en: string
  resultats_attendus_ar: string
}

export interface AxeApiResponse {
  success?: boolean
  message?: string
  data?: Axe | Axe[]
}

/**
 * Fonction utilitaire pour convertir les données brutes en objet Axe
 */
export const convertAxe = (rawData: Record<string, unknown>): Axe => {
  return {
    id: (rawData.id as number) || 0,
    // Champs multilingues
    title_fr: (rawData.title_fr as string) || '',
    title_en: (rawData.title_en as string) || '',
    title_ar: (rawData.title_ar as string) || '',
    slug: (rawData.slug as string) || '',
    icon: (rawData.icon as string) || undefined,
    problematique_fr: (rawData.problematique_fr as string) || '',
    problematique_en: (rawData.problematique_en as string) || '',
    problematique_ar: (rawData.problematique_ar as string) || '',
    objectif_fr: (rawData.objectif_fr as string) || '',
    objectif_en: (rawData.objectif_en as string) || '',
    objectif_ar: (rawData.objectif_ar as string) || '',
    approche_fr: (rawData.approche_fr as string) || '',
    approche_en: (rawData.approche_en as string) || '',
    approche_ar: (rawData.approche_ar as string) || '',
    resultats_attendus_fr: (rawData.resultats_attendus_fr as string) || '',
    resultats_attendus_en: (rawData.resultats_attendus_en as string) || '',
    resultats_attendus_ar: (rawData.resultats_attendus_ar as string) || '',
    created_at: (rawData.created_at as string) || new Date().toISOString(),
    updated_at: (rawData.updated_at as string) || new Date().toISOString(),
  }
}

/**
 * Fonction utilitaire pour récupérer le contenu dans la langue actuelle
 */
export const getAxeContent = (
  axe: Axe, 
  field: 'title' | 'problematique' | 'objectif' | 'approche' | 'resultats_attendus',
  language: string = 'fr'
): string => {
  const key = `${field}_${language}` as keyof Axe;
  return (axe[key] as string) || (axe[`${field}_fr`] as string) || '';
}

/**
 * Fonction utilitaire pour créer un objet AxeFormData vide
 */
export const createEmptyAxeFormData = (): AxeFormData => ({
  title_fr: '',
  title_en: '',
  title_ar: '',
  slug: '',
  icon: '',
  problematique_fr: '',
  problematique_en: '',
  problematique_ar: '',
  objectif_fr: '',
  objectif_en: '',
  objectif_ar: '',
  approche_fr: '',
  approche_en: '',
  approche_ar: '',
  resultats_attendus_fr: '',
  resultats_attendus_en: '',
  resultats_attendus_ar: '',
}); 