// src/components/SettingsRecherche.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import axiosClient from "@/services/axiosClient"
import SettingsForm from '@/components/common/SettingsForm'
import { RechercheSettings, Section, DEFAULT_RECHERCHE_SETTINGS } from '@/types/rechercheSettings'

/**
 * Composant de paramètres pour la page Recherche
 * Permet de configurer les titres, descriptions et images de la page recherche
 */
export default function SettingsRecherche() {
// Configuration des sections du formulaire
const sections : Section[] = useMemo(() => [
  {
    title: "Section Hero - Français",
    fields: [
      { key: "titre_fr",      label: "Titre",               type: "text" as const     },
      { key: "texte_intro_fr",label: "Texte d'introduction", type: "textarea" as const },
    ],
  },
  {
    title: "Section Hero - English",
    fields: [
      { key: "titre_en",      label: "Titre",               type: "text" as const     },
      { key: "texte_intro_en",label: "Texte d'introduction", type: "textarea" as const },
    ],
  },
  {
    title: "Section Hero - Arabic",
    fields: [
      { key: "titre_ar",      label: "Titre",               type: "text" as const     },
      { key: "texte_intro_ar",label: "Texte d'introduction", type: "textarea" as const },
    ],
  },
  {
    title: "Axes Stratégiques - Français",
    fields: [
      { key: "title_strategic_fr",      label: "Titre de section", type: "text" as const     },
      { key: "subtitle_strategic_fr",label: "Description",      type: "textarea" as const },
    ],
  },
  {
    title: "Axes Stratégiques - English",
    fields: [
      { key: "title_strategic_en",      label: "Titre de section", type: "text" as const     },
      { key: "subtitle_strategic_en",label: "Description",      type: "textarea" as const },
    ],
  },
  {
    title: "Axes Stratégiques - Arabic",
    fields: [
      { key: "title_strategic_ar",      label: "Titre de section", type: "text" as const     },
      { key: "subtitle_strategic_ar",label: "Description",      type: "textarea" as const },
    ],
  },
  {
    title: "Analyse par axe - Français",
    fields: [
      { key: "title_analysis_fr", label: "Titre", type: "text" as const },
    ],
  },
  {
    title: "Analyse par axe - English",
    fields: [
      { key: "title_analysis_en", label: "Titre", type: "text" as const },
    ],
  },
  {
    title: "Analyse par axe - Arabic",
    fields: [
      { key: "title_analysis_ar", label: "Titre", type: "text" as const },
    ],
  },
  {
    title: "Processus de Recherche",
    fields: [
      { key: "title_process_fr", label: "Titre (FR)", type: "text" },
      { key: "subtitle_process_fr", label: "Sous-titre (FR)", type: "textarea" },
      { key: "title_process_en", label: "Title (EN)", type: "text" },
      { key: "subtitle_process_en", label: "Subtitle (EN)", type: "textarea" },
      { key: "title_process_ar", label: "العنوان (AR)", type: "text" },
      { key: "subtitle_process_ar", label: "الوصف (AR)", type: "textarea" },
    ],
  },
  {
    title: "Étapes du Processus",
    fields: [
      // Étape 1
      { key: "step_1_title_fr", label: "Étape 1 - Titre (FR)", type: "text" },
      { key: "step_1_desc_fr", label: "Étape 1 - Description (FR)", type: "textarea" },
      { key: "step_1_title_en", label: "Step 1 - Title (EN)", type: "text" },
      { key: "step_1_desc_en", label: "Step 1 - Description (EN)", type: "textarea" },
      { key: "step_1_title_ar", label: "المرحلة 1 - العنوان", type: "text" },
      { key: "step_1_desc_ar", label: "المرحلة 1 - الوصف", type: "textarea" },
      // Étape 2
      { key: "step_2_title_fr", label: "Étape 2 - Titre (FR)", type: "text" },
      { key: "step_2_desc_fr", label: "Étape 2 - Description (FR)", type: "textarea" },
      { key: "step_2_title_en", label: "Step 2 - Title (EN)", type: "text" },
      { key: "step_2_desc_en", label: "Step 2 - Description (EN)", type: "textarea" },
      { key: "step_2_title_ar", label: "المرحلة 2 - العنوان", type: "text" },
      { key: "step_2_desc_ar", label: "المرحلة 2 - الوصف", type: "textarea" },
      // Étape 3
      { key: "step_3_title_fr", label: "Étape 3 - Titre (FR)", type: "text" },
      { key: "step_3_desc_fr", label: "Étape 3 - Description (FR)", type: "textarea" },
      { key: "step_3_title_en", label: "Step 3 - Title (EN)", type: "text" },
      { key: "step_3_desc_en", label: "Step 3 - Description (EN)", type: "textarea" },
      { key: "step_3_title_ar", label: "المرحلة 3 - العنوان", type: "text" },
      { key: "step_3_desc_ar", label: "المرحلة 3 - الوصف", type: "textarea" },
       // Étape 4
      { key: "step_4_title_fr", label: "Étape 4 - Titre (FR)", type: "text" },
      { key: "step_4_desc_fr", label: "Étape 4 - Description (FR)", type: "textarea" },
      { key: "step_4_title_en", label: "Step 4 - Title (EN)", type: "text" },
      { key: "step_4_desc_en", label: "Step 4 - Description (EN)", type: "textarea" },
      { key: "step_4_title_ar", label: "المرحلة 4 - العنوان", type: "text" },
      { key: "step_4_desc_ar", label: "المرحلة 4 - الوصف", type: "textarea" },
      // Étape 5
      { key: "step_5_title_fr", label: "Étape 5 - Titre (FR)", type: "text" },
      { key: "step_5_desc_fr", label: "Étape 5 - Description (FR)", type: "textarea" },
      { key: "step_5_title_en", label: "Step 5 - Title (EN)", type: "text" },
      { key: "step_5_desc_en", label: "Step 5 - Description (EN)", type: "textarea" },
      { key: "step_5_title_ar", label: "المرحلة 5 - العنوان", type: "text" },
      { key: "step_5_desc_ar", label: "المرحلة 5 - الوصف", type: "textarea" },
    ],
  },
  {
    title: "Image de couverture",
    fields: [
      { 
        key: "recherche_image", 
        label: "Image de couverture", 
        type: "file" 
      },
    ],
  },
], [])


   // Initialiser avec les valeurs par défaut dès le départ
   const [values, setValues] = useState<RechercheSettings>(() => {
    console.log('Initialisation avec les valeurs par défaut:', DEFAULT_RECHERCHE_SETTINGS)
    return { ...DEFAULT_RECHERCHE_SETTINGS }
  })
  const [files,  setFiles]  = useState<Record<string, File>>({})
  const [preview, setPreview]= useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)

  // Optimisation avec useCallback pour le chargement des paramètres
  const loadSettings = useCallback(async () => {
    try {
      setLoading(true)
      setMessage(null)
      
      // S'assurer d'avoir un token CSRF
      await axiosClient.get('/sanctum/csrf-cookie')
      
      // Charger les données
      const response = await axiosClient.get('/api/pages/recherche/settings', {
        headers: { 'Accept': 'application/json' }
      })

      console.log('Données reçues:', response.data)

      // Vérifier si les données sont dans un sous-objet data
      const settingsData = response.data.data || response.data

      if (settingsData && typeof settingsData === 'object') {
        // Log des données pour déboguer
        console.log('Données à utiliser:', settingsData)

        // Utiliser les valeurs par défaut partagées
        const defaultValues: RechercheSettings = {
          ...DEFAULT_RECHERCHE_SETTINGS,
          ...settingsData
        }
        
        setValues(defaultValues)
        
    
        
        // Mettre à jour les previews d'images
        Object.entries(settingsData).forEach(([key, val]) => {
          if (key.endsWith('.image') && val) {
            console.log('Image trouvée:', key, val)
            setPreview(prev => ({ ...prev, [key]: String(val) }))
          }
        })
      } else {
        console.error('Format de données invalide:', settingsData)
        setMessage({ 
          type: 'error', 
          text: 'Format de données invalide reçu du serveur' 
        })
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
        // Ne pas mettre à jour values pour les fichiers
      } else {
        // Supprimer le fichier des files si aucun n'est sélectionné
        setFiles(f => {
          const newFiles = { ...f }
          delete newFiles[key]
          return newFiles
        })
      }
    } else {
      // S'assurer que la valeur est une chaîne
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
      await axiosClient.get('/sanctum/csrf-cookie')
      const formData = new FormData()
      
      // Ajouter l'ID s'il existe pour éviter la création d'un nouveau record
      if (values.id) {
        formData.append('id', values.id.toString())
      }
      
      // Ajouter le type de page pour identifier le bon record
      formData.append('page', 'recherche')
      
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

      const response = await axiosClient.post(
        '/api/pages/recherche/settings',
        formData,
        { 
          headers: { 
            'Accept': 'application/json',
            'Content-Type': undefined, // Supprimer le Content-Type pour FormData
          }
        }
      )
      
      if (response.data && (response.data.success || response.data.message === 'Settings updated successfully')) {
        // Mettre à jour avec les données retournées par le serveur
        if (response.data.data) {
          setValues({ ...DEFAULT_RECHERCHE_SETTINGS, ...response.data.data })
          // Mettre à jour les previews d'images
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
      <h1 className="text-2xl font-bold">Paramètres — Page Recherche</h1>
      
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
