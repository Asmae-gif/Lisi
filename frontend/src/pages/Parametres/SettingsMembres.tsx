// src/components/SettingsRecherche.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import axiosClient from "@/services/axiosClient"
import { MembreSettings, ApiResponse,Section, DEFAULT_MEMBRES_SETTINGS } from '@/types/MembresSettings'
import SettingsForm from '@/components/common/SettingsForm'
import { buildImageUrlWithDefaults } from '@/utils/imageUtils'

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
          label: "Titre Principal ", 
          type: "text"
        },
        { 
          key: "membres_sous_titre_fr", 
          label: "Texte d'introduction", 
          type: "text"
        },
      ],
    },
    {
      title: "Section Hero - English",
      fields: [
        { 
          key: "membres_titre_en", 
          label: "Titre Principal ", 
          type: "text"
        },
        { 
          key: "membres_sous_titre_en", 
          label: "Texte d'introduction",  
          type: "text"
        },
      ],
    },
    {
      title: "Section Hero - العربية",
      fields: [
        { 
          key: "membres_titre_ar", 
          label: "Titre Principal ", 
          type: "text"
        },
        { 
          key: "membres_sous_titre_ar", 
          label: "Texte d'introduction", 
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

  const [values, setValues] = useState<MembreSettings>(() => {
    return { ...DEFAULT_MEMBRES_SETTINGS }
  })
  const [files, setFiles] = useState<Record<string, File>>({})
  const [preview, setPreview] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)

  // Optimisation avec useCallback pour le chargement des paramètres
  const loadSettings = useCallback(async () => {
    setLoading(true)
      setMessage(null)
    try {
      // S'assurer d'avoir un token CSRF
      await axiosClient.get('/sanctum/csrf-cookie')
      
      // Charger les données
      const response = await axiosClient.get<ApiResponse>('/api/pages/membres/settings', {  
        headers: { 'Accept': 'application/json' }
      })
      const settingsData = response.data.data || response.data
      console.log('Données reçues depuis la base de données:', settingsData)
      if (settingsData && typeof settingsData === 'object') { 
         
      const defaultValues: MembreSettings = {
        ...DEFAULT_MEMBRES_SETTINGS,
        ...settingsData
      }
      setValues(defaultValues)
 // Mettre à jour les previews d'images
 Object.entries(settingsData).forEach(([key, val]) => {
  if (key.endsWith('.image') && val) {
    setPreview(prev => ({ ...prev, [key]: String(val) }))
  }
})
} else {
setMessage({ 
  type: 'error', 
  text: 'Format de données invalide reçu du serveur' 
})
}
} catch (err: unknown) {
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
      
      if (response.data && (response.data.success || response.data.message === 'Settings updated successfully')) {
        if (response.data.data) {
          setValues({ ...DEFAULT_MEMBRES_SETTINGS, ...response.data.data })
          Object.entries(response.data.data).forEach(([key, val]) => {
            if (key.endsWith('.image') && val) {
              setPreview(prev => ({ ...prev, [key]: String(val) }))
            }
          })
        }
        
        setMessage({ type: 'success', text: 'Enregistré !' })
        setFiles({})
      } else {
        throw new Error(response.data?.message || 'Erreur lors de la sauvegarde')
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la sauvegarde.'
      setMessage({ 
        type: 'error', 
        text: `Erreur lors de la sauvegarde : ${errorMessage}`
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
