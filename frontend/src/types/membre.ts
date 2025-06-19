/**
 * Types pour la gestion des membres et des utilisateurs
 */

/**
 * Rôle d'un utilisateur
 */
export interface Role {
  id: number
  name: string
  guard_name: string
  created_at: string
  updated_at: string
}

/**
 * Utilisateur du système
 */
export interface User {
  id: number
  name: string
  email: string
  email_verified_at: string | null
  is_blocked: boolean
  is_approved: boolean
  created_at: string
  updated_at: string
  roles: Role[]
  membre: Membre | null
}

/**
 * Liens externes d'un membre
 */
export interface MemberLinks {
  linkedin?: string
  publication?: string
  personal?: string
  researchgate?: string
  google_scholar?: string
}

/**
 * Membre de l'équipe
 */
export interface Membre {
  id: number
  user: User | null
  nom: string
  prenom: string
  email: string
  photo: string | File | null
  photo_url:string | null
  statut: string
  biographie: string
  slug: string
  google_id: string | null
  linkedin: string | null
  researchgate: string | null
  google_scholar: string | null
  grade: string
  is_comite: boolean
  axe_ids: number[]
  created_at: string
  updated_at?: string
}

/**
 * Catégorie de membres (par statut)
 */
export interface MemberCategory {
  id: string
  title: string
  members: Membre[]
}

/**
 * Données pour la création/modification d'un membre
 */
export interface MembreFormData {
  nom: string
  prenom: string
  email: string
  grade: string
  statut: string
  photo?: File | null
  biographie?: string
  linkedin?: string
  researchgate?: string
  google_scholar?: string
  is_comite?: boolean
  axe_ids?: number[]
}

/**
 * Données par défaut pour le formulaire de création/modification d'un membre
 */
export const defaultMembreFormData: MembreFormData = {
  nom: "",
  prenom: "",
  email: "",
  grade: null,
  statut: "",
  photo: null,
  biographie: "",
  linkedin: "",
  researchgate: "",
  google_scholar: "",
  is_comite: false,
  axe_ids: [],
}

/**
 * Réponse de l'API pour les opérations sur les membres
 */
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message: string
  error?: string
}

/**
 * Fonction utilitaire pour convertir les données brutes en objet Membre
 */
export const convertMembre = (rawData: Record<string, unknown>): Membre => {
  return {
    id: (rawData.id as number) || 0,
    user: (rawData.user as User) || null,
    nom: (rawData.nom as string) || '',
    prenom: (rawData.prenom as string) || '',
    email: (rawData.email as string) || '',
    statut: (rawData.statut as string) || '',
    biographie: (rawData.biographie as string) || '',
    slug: (rawData.slug as string) || '',
    google_id: (rawData.google_id as string) || null,
    linkedin: (rawData.linkedin as string) || null,
    researchgate: (rawData.researchgate as string) || null,
    google_scholar: (rawData.google_scholar as string) || null,
    grade: (rawData.grade as string) || '',
    photo: (rawData.photo as string) || null,
    created_at: (rawData.created_at as string) || new Date().toISOString(),
    updated_at: (rawData.updated_at as string),
    is_comite: Boolean(rawData.is_comite),
    axe_ids: Array.isArray(rawData.axe_ids) ? rawData.axe_ids : [],
    photo_url: (rawData.photo_url as string) || null,
  }
}

export interface Axe {
  id: number;
  nom: string;
  slug: string;
  title: string;
  description?: string;
  problematique?: string;
  objectif?: string;
  approche?: string;
  resultats_attendus?: string;
  responsable?: Membre;
  membres: Membre[];
} 


/**
 * Fonction utilitaire pour convertir les données brutes en objet Membre
 */
export const convertAxe = (rawData: Record<string, unknown>): Axe => {
  return {
    id: (rawData.id as number) || 0,
    nom: (rawData.nom as string) || '',
    slug: (rawData.slug as string) || '',
    title: (rawData.title as string) || '',
    description: (rawData.description as string) || '',
    problematique: (rawData.problematique as string) || '',
    objectif: (rawData.objectif as string) || '',
    approche: (rawData.approche as string) || '',
    resultats_attendus: (rawData.resultats_attendus as string) || '',
    responsable: (rawData.responsable as Membre) || null,
    membres: (rawData.membres as Membre[]) || [],
  }
}

