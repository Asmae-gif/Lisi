import React, { useState, useEffect, useCallback, useMemo } from 'react'
import axiosClient from "@/services/axiosClient"
import { GallerySettings, ApiResponse, Section, DEFAULT_GALLERY_SETTINGS } from '@/types/GallerySettings'
import SettingsForm from '@/components/common/SettingsForm'
import { buildImageUrl } from '@/utils/imageUtils'

/**
 * Composant de paramètres pour la page Galerie
 * Permet de configurer les titres, sous-titres et images de la page Galerie en 3 langues
 */

export default function SettingsGalerie() {
  // Configuration des sections du formulaire avec champs pour chaque langue
  const sections: Section[] = useMemo(() => [
    {
      title: "Section Hero - Français",
      fields: [
        { 
          key: "galerie_titre_fr", 
          label: "Titre Principal (Français)", 
          type: "text"
        },
        { 
          key: "galerie_sous_titre_fr", 
          label: "Sous-titre (Français)", 
          type: "text"
        },
      ],
    },
    {
      title: "Section Hero - English",
      fields: [
        { 
          key: "galerie_titre_en", 
          label: "Main Title (English)", 
          type: "text"
        },
        { 
          key: "galerie_sous_titre_en", 
          label: "Subtitle (English)", 
          type: "text"
        },
      ],
    },
    {
      title: "Section Hero - العربية",
      fields: [
        { 
          key: "galerie_titre_ar", 
          label: "العنوان الرئيسي (العربية)", 
          type: "text"
        },
        { 
          key: "galerie_sous_titre_ar", 
          label: "العنوان الفرعي (العربية)", 
          type: "text" 
        },
      ],
    },
    {
      title: "Image de couverture",
      fields: [
        { 
          key: "galerie_image", 
          label: "Image de couverture", 
          type: "file" 
        },
      ],
    },
  ], [])

  // Initialiser avec les valeurs par défaut dès le départ
  const [values, setValues] = useState<GallerySettings>(() => {
    return { ...DEFAULT_GALLERY_SETTINGS }
  })
  const [files, setFiles] = useState<Record<string, File>>({})
  const [preview, setPreview] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)

  // Optimisation avec useCallback pour le chargement des paramètres
  const loadSettings = useCallback(async () => {
    try {
      setLoading(true)
      setMessage(null)
      
      await axiosClient.get('/sanctum/csrf-cookie')
      
      const response = await axiosClient.get<ApiResponse>('/api/pages/galerie/settings', {
        headers: { 'Accept': 'application/json' }
      })

      const settingsData = response.data.data || response.data

      if (settingsData && typeof settingsData === 'object') {
        
        // Utiliser les valeurs par défaut partagées
        const defaultValues: GallerySettings = {
          ...DEFAULT_GALLERY_SETTINGS,
          ...settingsData
        }
        
        setValues(defaultValues)
        
        // Mettre à jour les previews d'images avec les URLs correctes
        Object.entries(defaultValues).forEach(([key, val]) => {
          if (key.endsWith('_image') && val) {
            const imageUrl = buildImageUrl(String(val))
            if (imageUrl) {
              setPreview(prev => ({ ...prev, [key]: imageUrl }))
            }
          }
        })
      } else {
        throw new Error('Format de données invalide reçu du serveur')
      }
    } catch (err: unknown) {
      console.error('Erreur lors du chargement:', err)
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des données';
      setMessage({ 
        type: 'error', 
        text: `Erreur lors du chargement : ${errorMessage}`
      })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadSettings()
  }, [loadSettings])

  // Optimisation avec useCallback pour la gestion des changements
  const handleChange = useCallback((key: string, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.target.type === 'file') {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        setFiles(f => ({ ...f, [key]: file }))
        setPreview(p => ({ ...p, [key]: URL.createObjectURL(file) }))
      } else {
        setFiles(f => {
          const newFiles = { ...f }
          delete newFiles[key]
          return newFiles
        })
        // Garder l'image existante si on supprime le fichier
        if (values[key as keyof GallerySettings]) {
          const imageUrl = buildImageUrl(String(values[key as keyof GallerySettings]))
          if (imageUrl) {
            setPreview(p => ({ ...p, [key]: imageUrl }))
          }
        }
      }
    } else {
      const value = e.target.value || ''
      setValues(v => ({ ...v, [key]: value }))
    }
  }, [values])

  // Optimisation avec useCallback pour la soumission
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      await axiosClient.get('/api/sanctum/csrf-cookie')
      const formData = new FormData()
      
      if (values.id) {
        formData.append('id', values.id.toString())
      }
      
      formData.append('page', 'galerie')
      
      // Ajouter tous les champs de configuration
      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && key !== 'id') {
          formData.append(key, String(value))
        }
      })
      
      // Gérer les fichiers
      Object.entries(files).forEach(([key, file]) => {
        formData.append(key, file)
      })
      
      const response = await axiosClient.post<ApiResponse>(
        '/api/pages/galerie/settings',
        formData,
        { 
          headers: { 
            'Accept': 'application/json',
            'Content-Type': undefined,
          }
        }
      )
      
      if (response.data?.success || response.data?.message === 'Settings updated successfully') {
        if (response.data.data) {
          setValues(response.data.data)
          // Mettre à jour les previews d'images avec les URLs correctes
          Object.entries(response.data.data).forEach(([key, val]) => {
            if (key.endsWith('_image') && val) {
              const imageUrl = buildImageUrl(String(val))
              if (imageUrl) {
                setPreview(prev => ({ ...prev, [key]: imageUrl }))
              }
            }
          })
        }
        
        setMessage({ type: 'success', text: 'Paramètres enregistrés avec succès !' })
        setFiles({})
      } else {
        throw new Error(response.data?.message || 'Erreur lors de la sauvegarde')
      }
    } catch (err: unknown) {
      console.error('Erreur détaillée:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des données';
      setMessage({ 
        type: 'error', 
        text: `Erreur lors du chargement : ${errorMessage}`
      })
    } finally {
      setLoading(false)
    }
  }, [values, files])

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Paramètres — Page Galerie</h1>
      
      <SettingsForm
        sections={sections}
        values={values as unknown as Record<string, string | number | boolean | null | undefined>}
        files={files}
        preview={preview}
        loading={loading}
        message={message}
        onSubmit={handleSubmit}
        onChange={handleChange}
        submitText="Enregistrer"
        loadingText="Enregistrement…"
      />
    </div>
  )
} 