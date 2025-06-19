// src/components/SettingsRecherche.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import axiosClient from "@/services/axiosClient"
import SettingsForm from '@/components/common/SettingsForm'
import { RechercheSettings, DEFAULT_RECHERCHE_SETTINGS, PROCESSUS_ETAPES } from '@/types/rechercheSettings'

/**
 * Composant de paramètres pour la page Recherche
 * Permet de configurer les titres, descriptions et images de la page recherche
 */

// Configuration des sections du formulaire
const sections = [
  {
    title: "Nos Domaines d'Excellence",
    fields: [
      { key: "nos_domaines_titre",      label: "Titre",               type: "text" as const     },
      { key: "nos_domaines_texte_intro",label: "Texte d'introduction", type: "textarea" as const },
      { key: "nos_domaines_image",      label: "Image de fond",       type: "file" as const     },
    ],
  },
  {
    title: "Nos Axes Stratégiques",
    fields: [
      { key: "axes_strategiques_titre",      label: "Titre de section", type: "text" as const     },
      { key: "axes_strategiques_description",label: "Description",      type: "textarea" as const },
    ],
  },
  {
    title: "Analyse Détaillée par Axe",
    fields: [
      { key: "analyse_detaillee_titre", label: "Titre", type: "text" as const },
    ],
  },
  {
    title: "Processus de Recherche",
    fields: [
      { key: "processus_recherche_titre", label: "Titre", type: "text" as const     },
      { key: "processus_recherche_texte", label: "Texte explicatif", type: "textarea" as const },
    ],
  },
]

export default function SettingsRecherche() {
   // Initialiser avec les valeurs par défaut dès le départ
   const [values, setValues] = useState<RechercheSettings>(DEFAULT_RECHERCHE_SETTINGS)
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
        
        // Mettre à jour les valeurs avec les valeurs par défaut comme fallback
        setValues({ ...DEFAULT_RECHERCHE_SETTINGS, ...settingsData })
        
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
      
      // Nos Domaines d'Excellence
      if (values['nos_domaines_titre']) {
        formData.append('nos_domaines_titre', String(values['nos_domaines_titre']))
      }
      if (values['nos_domaines_texte_intro']) {
        formData.append('nos_domaines_texte_intro', String(values['nos_domaines_texte_intro']))
      }
      
      // Gérer l'image des domaines
      if (files['nos_domaines_image']) {
        formData.append('nos_domaines_image', files['nos_domaines_image'])
      } else if (values['nos_domaines_image']) {
        formData.append('nos_domaines_image', String(values['nos_domaines_image']))
      }
      
      // Axes Stratégiques
      if (values['axes_strategiques_titre']) {
        formData.append('axes_strategiques_titre', String(values['axes_strategiques_titre']))
      }
      if (values['axes_strategiques_description']) {
        formData.append('axes_strategiques_description', String(values['axes_strategiques_description']))
      }
      
      // Analyse Détaillée par Axe
      if (values['analyse_detaillee_titre']) {
        formData.append('analyse_detailee_titre', String(values['analyse_detaillee_titre']))
      }
      
      // Processus de Recherche
      if (values['processus_recherche_titre']) {
        formData.append('processus_recherche_titre', String(values['processus_recherche_titre']))
      }
      if (values['processus_recherche_texte']) {
        formData.append('processus_recherche_texte', String(values['processus_recherche_texte']))
      }
      
      // Ajouter les étapes du processus
      PROCESSUS_ETAPES.forEach(step => {
        const titreKey = `processus_recherche_etapes_${step.number}_titre`
        const descriptionKey = `processus_recherche_etapes_${step.number}_description`
        
        // Toujours envoyer les étapes, même si vides
        const titreValue = values[titreKey] || step.title
        const descriptionValue = values[descriptionKey] || step.description
        
        formData.append(titreKey, String(titreValue))
        formData.append(descriptionKey, String(descriptionValue))
        
        console.log(`Étape ${step.number}:`, { titreKey, titreValue, descriptionKey, descriptionValue })
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

  // Optimisation avec useMemo pour les sections étendues avec les étapes
  const extendedSections = useMemo(() => {
    const baseSections = [...sections];
    
    // Ajouter la section des étapes du processus
    const processStepsSection = {
      title: "Étapes du processus de recherche",
      fields: PROCESSUS_ETAPES.flatMap(step => [
        {
          key: `processus_recherche_etapes_${step.number}_titre`,
          label: `Titre de l'étape ${step.number}`,
          type: "text" as const,
          placeholder: step.title
        },
        {
          key: `processus_recherche_etapes_${step.number}_description`,
          label: `Description de l'étape ${step.number}`,
          type: "textarea" as const,
          rows: 2,
          placeholder: step.description
        }
      ])
    };
    
    return [...baseSections, processStepsSection];
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Paramètres — Page Recherche</h1>
      
      <SettingsForm
        sections={extendedSections}
        values={values}
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
