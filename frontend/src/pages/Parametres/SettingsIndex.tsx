import React, { useState, useEffect, useCallback } from 'react'
import SettingsForm from '@/components/common/SettingsForm'
import { indexSettingsApi } from '@/services/settingsApi'
import { AVAILABLE_LANGUAGES, LanguageCode, IndexSettings, LanguageSettings, DEFAULT_INDEX_SETTINGS } from '@/types/indexSettings'
import { buildImageUrl } from '@/utils/imageUtils'
import axiosClient from '@/services/axiosClient'

/**
 * Composant de paramètres pour la page d'accueil (Index)
 * Permet de configurer les titres, descriptions, images et contenus de la page d'accueil
 * Support multilingue : Français, Arabe, Anglais
 */

type SettingsValues = Record<string, string | number | boolean | null | undefined>;

// Toutes les fonctions et constantes helper sont déplacées ici, hors du composant
const PILLARS = [
  { key: 'pilier_valeur1', defaultTitle: 'Innovation', defaultDesc: 'Recherche scientifique innovante et interdisciplinaire' },
  { key: 'pilier_valeur2', defaultTitle: 'Formation', defaultDesc: 'Formation de la nouvelle génération de chercheurs' },
  { key: 'pilier_valeur3', defaultTitle: 'Impact', defaultDesc: 'Impact sociétal et économique' },
  { key: 'pilier_valeur4', defaultTitle: 'Partenariats', defaultDesc: 'Collaboration avec des partenaires nationaux et internationaux' },
];

const createLanguageSections = (language: LanguageCode) => {
  const langLabel = AVAILABLE_LANGUAGES.find(l => l.code === language)?.label || language.toUpperCase();
  
  const missionPillarsSections = PILLARS.map((pillar, idx) => ({
    title: `Pilier ${idx + 1} (${langLabel})`,
    description: `Configuration du pilier ${idx + 1} en ${langLabel}`,
    fields: [
      { key: `${pillar.key}_titre_${language}`, label: `Titre`, type: "text" as const, placeholder: pillar.defaultTitle },
      { key: `${pillar.key}_description_${language}`, label: `Description`, type: "textarea" as const, placeholder: pillar.defaultDesc }
    ]
  }));

  return [
    {
      title: `Section Hero (${langLabel})`,
      description: `Configuration du titre principal et sous-titre en ${langLabel}`,
      fields: [
        { key: `hero_titre_principal_${language}`, label: "Titre Principal", type: "text" as const },
        { key: `hero_sous_titre_${language}`, label: "Sous-titre", type: "textarea" as const },
      ],
    },
    {
      title: `Section Mission (${langLabel})`,
      description: `Configuration de la section mission en ${langLabel}`,
      fields: [
        { key: `mission_titre_${language}`, label: "Titre principal", type: "text" as const },
        { key: `mission_sous_titre_${language}`, label: "Sous-titre", type: "text" as const },
        { key: `mission_description_${language}`, label: "Description principale", type: "textarea" as const },
        { key: `mission_texte_1_${language}`, label: "Premier paragraphe", type: "textarea" as const },
        { key: `mission_texte_2_${language}`, label: "Deuxième paragraphe", type: "textarea" as const },
      ],
    },
    {
      title: `Section Actualités (${langLabel})`,
      description: `Configuration de la section actualités en ${langLabel}`,
      fields: [
        { key: `actualites_titre_${language}`, label: "Titre de la section", type: "text" as const },
        { key: `actualites_description_${language}`, label: "Description", type: "textarea" as const },
      ],
    },
    {
      title: `Section Domaines de Recherche (${langLabel})`,
      description: `Configuration de la section domaines en ${langLabel}`,
      fields: [
        { key: `domaines_titre_${language}`, label: "Titre principal", type: "text" as const },
        { key: `domaines_sous_titre_${language}`, label: "Sous-titre", type: "text" as const },
        { key: `domaines_description_${language}`, label: "Description", type: "textarea" as const },
        { key: `domaines_texte_final_${language}`, label: "Texte final", type: "textarea" as const },
      ],
    },
    ...missionPillarsSections,
    {
      title: `Section Mot du directeur (${langLabel})`,
      description: `Configuration du mot du directeur en ${langLabel}`,
      fields: [
        { key: `mot_directeur_titre_${language}`, label: "Titre", type: "text" as const },
        { key: `mot_directeur_description_${language}`, label: "Description", type: "textarea" as const },
      ],
    },
  ];
};

const commonSections = [
  { title: "Images", fields: [ { key: "hero_image_side", label: "Image latérale du hero", type: "file" as const }, { key: "mission_image", label: "Image de la section mission", type: "file" as const }, { key: "mot_directeur_image", label: "Image du mot du directeur", type: "file" as const } ] },
  { title: "Statistiques", fields: [ { key: "nbr_membres", label: "Nombre de membres", type: "text" as const }, { key: "nbr_publications", label: "Nombre de publications", type: "text" as const }, { key: "nbr_projets", label: "Nombre de projets", type: "text" as const }, { key: "nbr_locaux", label: "Nombre de locaux", type: "text" as const } ] },
];

const flattenSettings = (settings: IndexSettings): SettingsValues => {
  const flat: SettingsValues = {};
  
  // Traiter les champs non-traduisibles
  if (settings.mission_image) flat.mission_image = settings.mission_image;
  if (settings.hero_image_side) flat.hero_image_side = settings.hero_image_side;
  if (settings.mot_directeur_image) flat.mot_directeur_image = settings.mot_directeur_image;
  if (settings.nbr_membres) flat.nbr_membres = settings.nbr_membres;
  if (settings.nbr_publications) flat.nbr_publications = settings.nbr_publications;
  if (settings.nbr_projets) flat.nbr_projets = settings.nbr_projets;
  if (settings.nbr_locaux) flat.nbr_locaux = settings.nbr_locaux;
  
  // Traiter les champs multilingues
  AVAILABLE_LANGUAGES.forEach(lang => {
    const langCode = lang.code;
    const langSettings = settings[langCode];
    if (langSettings && typeof langSettings === 'object') {
      Object.entries(langSettings).forEach(([key, value]) => {
        flat[`${key}_${langCode}`] = value;
      });
    }
  });
  
  return flat;
};

const mergeSettingsWithDefaults = (apiData: Partial<IndexSettings> | null | undefined): IndexSettings => {
  if (!apiData || typeof apiData !== 'object') {
    return DEFAULT_INDEX_SETTINGS;
  }
  
  return {
    ...DEFAULT_INDEX_SETTINGS,
    ...apiData
  };
};

export default function SettingsIndex() {
  const [values, setValues] = useState<SettingsValues>({})
  const [files, setFiles] = useState<Record<string, File>>({})
  const [preview, setPreview] = useState<Record<string, string>>({})
  const [language, setLanguage] = useState<LanguageCode>('fr')
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)

  const loadSettings = useCallback(async () => {
    try {
      setLoading(true)
      setMessage(null)
      
      const settingsData = await indexSettingsApi.getSettings()
      
      // Fusionner avec les valeurs par défaut
      const mergedSettings = mergeSettingsWithDefaults(settingsData)      
      const flatValues = flattenSettings(mergedSettings)      
      setValues(flatValues)
      
      // Mettre à jour les previews d'images
      Object.entries(flatValues).forEach(([key, val]) => {
        if (key.endsWith('_image') && val) {
          console.log('Image trouvée:', key, val)
          setPreview(prev => ({ ...prev, [key]: buildImageUrl(String(val)) }))
        }
      })
    } catch (err: unknown) {
      console.error('❌ SettingsIndex: Erreur lors du chargement:', err)
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des données';
      setMessage({ 
        type: 'error', 
        text: `Erreur lors du chargement : ${errorMessage}`
      })
    } finally {
      setLoading(false)
    }
  }, []);

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
      const formData = new FormData()
      
      if (values.id) {
        formData.append('id', values.id.toString())
      }
      
      formData.append('page', 'index')
      
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
      
      const response = await indexSettingsApi.saveSettings(formData)
      
      if (response) {
        const flatResponse = flattenSettings(response);
        setValues(flatResponse)
        Object.entries(flatResponse).forEach(([key, val]) => {
          if (key.endsWith('_image') && val) {
            setPreview(prev => ({ ...prev, [key]: buildImageUrl(String(val)) }))
          }
        })
        
        setMessage({ type: 'success', text: 'Paramètres enregistrés avec succès !' })
        setFiles({})
      } else {
        throw new Error('Erreur lors de la sauvegarde')
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

  // Créer les sections dynamiquement en fonction de la langue sélectionnée
  const currentLanguageSections = createLanguageSections(language);
  
  // N'afficher les sections communes (Images, Statistiques) que si le français est sélectionné
  const allSections = language === 'fr' 
    ? [...commonSections, ...currentLanguageSections] 
    : currentLanguageSections;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Paramètres — Page d'Accueil</h1>
        
        {/* Sélecteur de langue UI */}
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Sélectionner la langue à modifier</h3>
          <div className="flex space-x-4">
            {AVAILABLE_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                  language === lang.code
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-lg">{lang.flag}</span>
                <span className="font-medium">{lang.label}</span>
              </button>
            ))}
          </div>
        </div>
        
      </div>
      
      <SettingsForm
        sections={allSections}
        values={values}
        files={files}
        preview={preview}
        loading={loading}
        message={message}
        onSubmit={handleSubmit}
        onChange={handleChange}
        submitText="Enregistrer les paramètres"
        loadingText="Enregistrement..."
      />
    </div>
  )
} 