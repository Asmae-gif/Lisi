// src/pages/SettingsContact.tsx
import React, { useState, useEffect, useCallback } from 'react'
import axiosClient from "@/services/axiosClient"
import { ContactSettings, ApiResponse, Field, Section, DEFAULT_CONTACT_SETTINGS } from '../types/contactSettings'
import SettingsForm from '@/components/common/SettingsForm'

/**
 * Composant de paramètres pour la page Contact
 * Permet de configurer les titres, sous-titres et images de la page contact
 */

// Configuration des sections du formulaire
const sections: Section[] = [
  {
    title: "Section Hero",
    fields: [
      { 
        key: "contact_titre", 
        label: "Titre Principal", 
        type: "text", 
        placeholder: "Contactez-nous" 
      },
      { 
        key: "contact_sous_titre", 
        label: "Sous-titre", 
        type: "text", 
        placeholder: "Nous sommes à votre disposition pour répondre à vos questions, discuter de collaborations ou explorer de nouvelles opportunités de recherche." 
      },
      { 
        key: "contact_image", 
        label: "Image de couverture", 
        type: "file" 
      },
    ],
  },
  {
    title: "Section Contact",
    fields: [
      { 
        key: "contact_titre2", 
        label: "Titre 2", 
        type: "text", 
        placeholder: "Informations de Contact" 
      },
      { 
        key: "contact_adresse", 
        label: "Adresse", 
        type: "text", 
        placeholder: "123 Rue de la Recherche, 75000 Paris, France" 
      },
      { 
        key: "contact_email", 
        label: "Email", 
        type: "text", 
        placeholder: "contact@example.com" 
      },
      { 
        key: "contact_telephone", 
        label: "Téléphone", 
        type: "text", 
        placeholder: "+33 1 23 45 67 89" 
      },
    ],
  }
]

export default function SettingsContact() {
  // Initialiser avec les valeurs par défaut dès le départ
  const [values, setValues] = useState<ContactSettings>(() => {
    console.log('Initialisation avec les valeurs par défaut:', DEFAULT_CONTACT_SETTINGS)
    return { ...DEFAULT_CONTACT_SETTINGS }
  })
  const [files, setFiles] = useState<Record<string, File>>({})
  const [preview, setPreview] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)

  // Optimisation avec useCallback pour le chargement des paramètres
  const loadSettings = useCallback(async () => {
    try {
      setLoading(true)
      setMessage(null)
      
      await axiosClient.get('/sanctum/csrf-cookie')
      
      const response = await axiosClient.get<ApiResponse>('/api/pages/contact/settings', {
        headers: { 'Accept': 'application/json' }
      })

      console.log('Données reçues:', response.data)

      const settingsData = response.data.data || response.data

      if (settingsData && typeof settingsData === 'object') {
        console.log('Données à utiliser:', settingsData)
        
        // Utiliser les valeurs par défaut partagées
        const defaultValues: ContactSettings = {
          ...DEFAULT_CONTACT_SETTINGS,
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
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des données';
      console.error('Erreur lors du chargement:', err)
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
      
      formData.append('page', 'contact')
      
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
        '/api/pages/contact/settings',
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
      console.error('Erreur détaillée:', err)
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
      <h1 className="text-2xl font-bold">Paramètres — Page Contact</h1>
      
      <SettingsForm
        sections={sections}
        values={values as Record<string, string | number | boolean | null | undefined>}
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
