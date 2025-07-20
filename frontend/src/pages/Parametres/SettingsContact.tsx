// src/pages/SettingsContact.tsx
import React, { useState, useEffect, useCallback } from 'react'
import axiosClient from "@/services/axiosClient"
import { ContactSettings, ApiResponse, Section, DEFAULT_CONTACT_SETTINGS } from '@/types/contactSettings'
import SettingsForm from '@/components/common/SettingsForm'
import { useMemo } from 'react'
/**
 * Composant de paramètres pour la page Contact
 * Permet de configurer les titres, sous-titres et images de la page contact
 */
export default function SettingsContact() {
// Configuration des sections du formulaire
const sections: Section[] = useMemo(() =>  [
  {
    title: "Section Hero - Français",
    fields: [
      { 
        key: "contact_titre_fr", 
        label: "Titre Principal", 
        type: "text", 
        placeholder: "Contactez-nous" 
      },
      { 
        key: "contact_sous_titre_fr", 
        label: "Sous-titre", 
        type: "text", 
        placeholder: "Nous sommes à votre disposition pour répondre à vos questions, discuter de collaborations ou explorer de nouvelles opportunités de recherche." 
      },
      { 
        key: "contact_titre2_fr", 
        label: "Titre 2", 
        type: "text", 
        placeholder: "Informations de Contact" 
      },
    ],
  },
  {
    title: "Section Contact - Anglais",
    fields: [
      { 
        key: "contact_titre_en", 
        label: "Titre Principal", 
        type: "text", 
        placeholder: "Contact Us" 
      },
      { 
        key: "contact_sous_titre_en", 
        label: "Sous-titre", 
        type: "text", 
        placeholder: "We are at your disposal to answer your questions, discuss collaborations or explore new research opportunities." 
      },
      { 
        key: "contact_titre2_en", 
        label: "Titre 2", 
        type: "text", 
        placeholder: "Contact Information" 
      },
    ],
  },
  {
    title: "Section Contact - Arabe",
    fields: [
      { 
        key: "contact_titre_ar", 
        label: "Titre Principal", 
        type: "text", 
        placeholder: "اتصل بنا" 
      },
      { 
        key: "contact_sous_titre_ar", 
        label: "Sous-titre", 
        type: "text", 
        placeholder: "نحن على استعداد للإجابة على أسئلتكم ونناقش التعاون واستكشاف الفرص البحثية الجديدة." 
      },
      {
        key: "contact_titre2_ar", 
        label: "Titre 2", 
        type: "text", 
        placeholder: "معلومات الاتصال" 
      },
    ],
  },
  {
    title: "Section Contact",
    fields: [
      
      { 
        key: "contact_adresse_fr", 
        label: "Adresse", 
        type: "text", 
        placeholder: "Av Abdelkrim Khattabi, B.P. 511 - 40000 –Marrakech "
      },
      {
        key: "contact_adresse_en", 
        label: "Adresse", 
        type: "text", 
        placeholder: "Av Abdelkrim Khattabi, B.P. 511 - 40000 –Marrakech "
      },
      {
        key: "contact_adresse_ar", 
        label: "Adresse", 
        type: "text", 
        placeholder: "شارع عبد الكريم الخطابي، ص. ب 511 - 40000 – مراكش"
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
      { 
        key: "contact_location", 
        label: "Localisation (pour Google Maps)", 
        type: "location", 
        placeholder: "Marrakech, Maroc"
      },
    ],
  },
  {
    title: "Image de couverture",
    fields: [
      { 
        key: "contact_image", 
        label: "Image de couverture", 
        type: "file" 
      },
    ],
  },
], [])


  // Initialiser avec les valeurs par défaut dès le départ
  const [values, setValues] = useState<ContactSettings>(() => {
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
      const settingsData = response.data.data || response.data

      if (settingsData && typeof settingsData === 'object') {
        
        // Utiliser les valeurs par défaut partagées
        const defaultValues: ContactSettings = {
          ...DEFAULT_CONTACT_SETTINGS,
          ...settingsData
        }
        
        setValues(defaultValues)
        
        // Mettre à jour les previews d'images
        Object.entries(defaultValues).forEach(([key, val]) => {
          if (key.endsWith('_image') && val) {
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
