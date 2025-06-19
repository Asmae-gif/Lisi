// src/components/SettingsRecherche.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import axiosClient from "../services/axiosClient"
import { MembreSettings, ApiResponse, Field, Section, DEFAULT_MEMBRES_SETTINGS } from '../types/MembresSettings'
import SettingsForm from '../components/common/SettingsForm'
import LoadingSkeleton from '../components/common/LoadingSkeleton'

/**
 * Composant de paramètres pour la page Membres
 * Permet de configurer les titres, sous-titres et images de la page Membres en 3 langues
 */

export default function SettingsMembres() {
  // Configuration des sections du formulaire avec champs pour chaque langue
  const sections: Section[] = useMemo(() => [
    {
      title: "Section Hero - Français",
      fields: [
        { 
          key: "membres_titre_fr", 
          label: "Titre Principal (Français)", 
          type: "text"
        },
        { 
          key: "membres_sous_titre_fr", 
          label: "Sous-titre (Français)", 
          type: "text"
        },
      ],
    },
    {
      title: "Section Hero - English",
      fields: [
        { 
          key: "membres_titre_en", 
          label: "Main Title (English)", 
          type: "text"
        },
        { 
          key: "membres_sous_titre_en", 
          label: "Subtitle (English)", 
          type: "text"
        },
      ],
    },
    {
      title: "Section Hero - العربية",
      fields: [
        { 
          key: "membres_titre_ar", 
          label: "العنوان الرئيسي (العربية)", 
          type: "text"
        },
        { 
          key: "membres_sous_titre_ar", 
          label: "العنوان الفرعي (العربية)", 
          type: "text" 
        },
      ],
    },
    {
      title: "Image de couverture",
      fields: [
        { 
          key: "membres_image", 
          label: "Image de couverture", 
          type: "file" 
        },
      ],
    },
  ], [])

  // Initialiser avec les valeurs par défaut dès le départ
  const [values, setValues] = useState<MembreSettings>(() => {
    console.log('Initialisation avec les valeurs par défaut:', DEFAULT_MEMBRES_SETTINGS)
    return { ...DEFAULT_MEMBRES_SETTINGS }
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
      
      const response = await axiosClient.get<ApiResponse>('/api/pages/membres/settings', {
        headers: { 'Accept': 'application/json' }
      })

      console.log('Données reçues:', response.data)

      const settingsData = response.data.data || response.data

      if (settingsData && typeof settingsData === 'object') {
        console.log('Données à utiliser:', settingsData)
        
        // Utiliser les valeurs par défaut partagées
        const defaultValues: MembreSettings = {
          ...DEFAULT_MEMBRES_SETTINGS,
          ...settingsData
        }
        
        setValues(defaultValues)
        
        // Mettre à jour les previews d'images
        Object.entries(defaultValues).forEach(([key, val]) => {
          if (key.endsWith('_image') && val) {
            console.log('Image trouvée:', key, val)
            setPreview(prev => ({ ...prev, [key]: String(val) }))
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
      }
    } else {
      const value = e.target.value || ''
      setValues(v => ({ ...v, [key]: value }))
    }
  }, [])

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
      
      formData.append('page', 'membres')
      
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
        '/api/pages/membres/settings',
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
          Object.entries(response.data.data).forEach(([key, val]) => {
            if (key.endsWith('_image') && val) {
              setPreview(prev => ({ ...prev, [key]: String(val) }))
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
      <h1 className="text-2xl font-bold">Paramètres — Page Membres</h1>
      
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
