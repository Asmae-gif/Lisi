/**
 * Types centralisés pour les axes de recherche
 * Ce fichier unifie toutes les définitions d'axes dans l'application
 */

export interface Axe {
  id: number
  title: string
  slug: string
  icon?: string
  problematique: string
  objectif: string
  approche: string
  resultats_attendus: string
  created_at: string
  updated_at: string
}

export interface AxeFormData {
  title: string
  slug: string
  icon?: string
  problematique: string
  objectif: string
  approche: string
  resultats_attendus: string
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
    title: (rawData.title as string) || '',
    slug: (rawData.slug as string) || '',
    icon: (rawData.icon as string) || undefined,
    problematique: (rawData.problematique as string) || '',
    objectif: (rawData.objectif as string) || '',
    approche: (rawData.approche as string) || '',
    resultats_attendus: (rawData.resultats_attendus as string) || '',
    created_at: (rawData.created_at as string) || new Date().toISOString(),
    updated_at: (rawData.updated_at as string) || new Date().toISOString(),
  }
} 