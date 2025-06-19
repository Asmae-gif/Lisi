import { useState, useEffect, useCallback } from "react"
import axiosClient from "@/services/axiosClient"
import { Axe, AxeFormData, AxeApiResponse } from "@/types/axe"

/**
 * Hook personnalisé pour gérer les axes de recherche
 * Centralise toute la logique CRUD des axes
 */
export const useAxes = () => {
  const [axes, setAxes] = useState<Axe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fonction optimisée pour récupérer tous les axes
  const getAxes = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await axiosClient.get<AxeApiResponse>("/api/axes")
      
      // Vérifier la structure de la réponse
      const axesData = response.data.data || response.data
      
      if (Array.isArray(axesData)) {
        setAxes(axesData)
      } else {
        console.error("Format de données incorrect:", axesData)
        setError("Format de données incorrect reçu du serveur")
      }
    } catch (error: unknown) {
      console.error("Erreur lors du chargement des axes:", error)
      const errorMessage = error instanceof Error ? error.message : "Erreur lors du chargement des axes"
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  // Charger les axes au montage du composant
  useEffect(() => {
    getAxes()
  }, [getAxes])

  // Fonction pour créer un nouvel axe
  const createAxe = useCallback(async (formData: AxeFormData): Promise<Axe> => {
    try {
      setError(null)
      const response = await axiosClient.post<AxeApiResponse>("/api/admin/axes", formData)
      
      const newAxe = response.data.data as Axe
      setAxes(prev => [...prev.filter(axe => axe !== undefined && axe !== null), newAxe])
      
      return newAxe
    } catch (error: unknown) {
      console.error("Erreur lors de la création:", error)
      const errorMessage = error instanceof Error ? error.message : "Erreur lors de la création de l'axe"
      setError(errorMessage)
      throw error
    }
  }, [])

  // Fonction pour modifier un axe existant
  const updateAxe = useCallback(async (id: number, formData: AxeFormData): Promise<Axe> => {
    try {
      setError(null)
      const response = await axiosClient.put<AxeApiResponse>(`/api/admin/axes/${id}`, formData)
      
      const updatedAxe = response.data.data as Axe
      setAxes(prev => prev
        .filter(axe => axe !== undefined && axe !== null)
        .map(axe => axe?.id === id ? updatedAxe : axe)
        .filter(axe => axe !== undefined && axe !== null)
      )
      
      return updatedAxe
    } catch (error: unknown) {
      console.error("Erreur lors de la modification:", error)
      const errorMessage = error instanceof Error ? error.message : "Erreur lors de la modification de l'axe"
      setError(errorMessage)
      throw error
    }
  }, [])

  // Fonction pour supprimer un axe
  const deleteAxe = useCallback(async (id: number): Promise<void> => {
    try {
      setError(null)
      await axiosClient.delete(`/api/admin/axes/${id}`)
      
      setAxes(prev => prev
        .filter(axe => axe !== undefined && axe !== null)
        .filter(axe => axe?.id !== id)
      )
    } catch (error: unknown) {
      console.error("Erreur lors de la suppression:", error)
      const errorMessage = error instanceof Error ? error.message : "Erreur lors de la suppression de l'axe"
      setError(errorMessage)
      throw error
    }
  }, [])

  return {
    axes,
    loading,
    error,
    getAxes,
    createAxe,
    updateAxe,
    deleteAxe
  }
}

// Export des types pour la compatibilité
export type { Axe, AxeFormData }