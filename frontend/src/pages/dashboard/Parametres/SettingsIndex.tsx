import React, { useState, useEffect, useCallback } from 'react'
import SettingsForm from '@/components/common/SettingsForm'
import { indexSettingsApi } from '@/services/settingsApi'
import {  mergeSettingsWithDefaults} from '../../../types/indexSettings'

/**
 * Composant de paramètres pour la page d'accueil (Index)
 * Permet de configurer les titres, descriptions, images et contenus de la page d'accueil
 * Support multilingue : Français, Arabe, Anglais
 */

// Définir le type pour les valeurs
interface SettingsIndex {
  id?: number;
  [key: string]: string | number | boolean | null | undefined;
}

const LANGS = [
  { code: 'fr', label: 'Français' },
  { code: 'en', label: 'Anglais' },
  { code: 'ar', label: 'Arabe' },
];

const PILLARS = [
  { key: 'pilier_valeur1', defaultTitle: 'Innovation', defaultDesc: 'Recherche scientifique innovante et interdisciplinaire' },
  { key: 'pilier_valeur2', defaultTitle: 'Formation', defaultDesc: 'Formation de la nouvelle génération de chercheurs' },
  { key: 'pilier_valeur3', defaultTitle: 'Impact', defaultDesc: 'Impact sociétal et économique' },
  { key: 'pilier_valeur4', defaultTitle: 'Partenariats', defaultDesc: 'Collaboration avec des partenaires nationaux et internationaux' },
];

const missionPillarsSections = PILLARS.map((pillar, idx) => ({
  title: `Pilier ${idx + 1}`,
  description: `Configuration du pilier ${idx + 1} dans les 3 langues`,
  fields: LANGS.flatMap(lang => [
    {
      key: `${pillar.key}_titre_${lang.code}`,
      label: `Titre (${lang.label})`,
      type: "text" as const,
      placeholder: pillar.defaultTitle
    },
    {
      key: `${pillar.key}_description_${lang.code}`,
      label: `Description (${lang.label})`,
      type: "textarea" as const,
      placeholder: pillar.defaultDesc
    }
  ])
}));

// Configuration des sections du formulaire avec support multilingue
const sections = [
  {
    title: "Section Hero",
    description: "Configuration du titre principal et sous-titre dans les 3 langues",
    fields: [
      { 
        key: "hero_titre_principal_fr", 
        label: "Titre Principal (Français)", 
        type: "text" as const,
        placeholder: "Laboratoire d'Informatique et de Systèmes Intelligents"
      },
      { 
        key: "hero_titre_principal_ar", 
        label: "Titre Principal (Arabe)", 
        type: "text" as const,
        placeholder: "مختبر المعلوماتية والأنظمة الذكية"
      },
      { 
        key: "hero_titre_principal_en", 
        label: "Titre Principal (Anglais)", 
        type: "text" as const,
        placeholder: "Laboratory of Computer Science and Intelligent Systems"
      },
      { 
        key: "hero_sous_titre_fr", 
        label: "Sous-titre (Français)", 
        type: "textarea" as const,
        placeholder: "Le LISI croise l'informatique avec d'autres disciplines pour innover et répondre aux défis scientifiques et sociétaux de demain."
      },
      { 
        key: "hero_sous_titre_ar", 
        label: "Sous-titre (Arabe)", 
        type: "textarea" as const,
        placeholder: "يدمج مختبر LISI المعلوماتية مع تخصصات أخرى للابتكار والاستجابة للتحديات العلمية والمجتمعية في الغد"
      },
      { 
        key: "hero_sous_titre_en", 
        label: "Sous-titre (Anglais)", 
        type: "textarea" as const,
        placeholder: "LISI combines computer science with other disciplines to innovate and respond to tomorrow's scientific and societal challenges"
      },
      { 
        key: "hero_image", 
        label: "Image de fond du hero", 
        type: "file" as const
      },
      { 
        key: "hero_image_side", 
        label: "Image latérale du hero", 
        type: "file" as const
      },
    ],
  },
  {
    title: "Statistiques",
    description: "Configuration des chiffres clés",
    fields: [
      { 
        key: "nbr_membres", 
        label: "Nombre de membres", 
        type: "text" as const,
        placeholder: "30+"
      },
      { 
        key: "nbr_publications", 
        label: "Nombre de publications", 
        type: "text" as const,
        placeholder: "40+"
      },
      { 
        key: "nbr_projets", 
        label: "Nombre de projets", 
        type: "text" as const,
        placeholder: "15+"
      },
      { 
        key: "nbr_locaux", 
        label: "Nombre de locaux", 
        type: "text" as const,
        placeholder: "3+"
      },
    ],
  },
  {
    title: "Section Mission",
    description: "Configuration de la section mission dans les 3 langues",
    fields: [
      { 
        key: "mission_titre_fr", 
        label: "Titre principal (Français)", 
        type: "text" as const,
        placeholder: "Au cœur de l'innovation technologique"
      },
      { 
        key: "mission_titre_ar", 
        label: "Titre principal (Arabe)", 
        type: "text" as const,
        placeholder: "في قلب الابتكار التكنولوجي"
      },
      { 
        key: "mission_titre_en", 
        label: "Titre principal (Anglais)", 
        type: "text" as const,
        placeholder: "At the heart of technological innovation"
      },
      { 
        key: "mission_sous_titre_fr", 
        label: "Sous-titre (Français)", 
        type: "text" as const,
        placeholder: "NOTRE MISSION"
      },
      { 
        key: "mission_sous_titre_ar", 
        label: "Sous-titre (Arabe)", 
        type: "text" as const,
        placeholder: "مهمتنا"
      },
      { 
        key: "mission_sous_titre_en", 
        label: "Sous-titre (Anglais)", 
        type: "text" as const,
        placeholder: "OUR MISSION"
      },
      { 
        key: "mission_description_fr", 
        label: "Description principale (Français)", 
        type: "textarea" as const,
        placeholder: "Le LISI promeut une recherche scientifique innovante, interdisciplinaire et à fort impact socio-économique"
      },
      { 
        key: "mission_description_ar", 
        label: "Description principale (Arabe)", 
        type: "textarea" as const,
        placeholder: "يعزز مختبر LISI البحث العلمي المبتكر والمتعدد التخصصات وذو التأثير الاجتماعي والاقتصادي العالي"
      },
      { 
        key: "mission_description_en", 
        label: "Description principale (Anglais)", 
        type: "textarea" as const,
        placeholder: "LISI promotes innovative, interdisciplinary scientific research with high socio-economic impact"
      },
      { 
        key: "mission_texte_1_fr", 
        label: "Premier paragraphe (Français)", 
        type: "textarea" as const,
        placeholder: "Le Laboratoire d'Informatique et de Systèmes Intelligents (LISI) a pour mission de promouvoir une recherche scientifique innovante..."
      },
      { 
        key: "mission_texte_1_ar", 
        label: "Premier paragraphe (Arabe)", 
        type: "textarea" as const,
        placeholder: "مهمة مختبر المعلوماتية والأنظمة الذكية (LISI) هي تعزيز البحث العلمي المبتكر..."
      },
      { 
        key: "mission_texte_1_en", 
        label: "Premier paragraphe (Anglais)", 
        type: "textarea" as const,
        placeholder: "The Laboratory of Computer Science and Intelligent Systems (LISI) has the mission to promote innovative scientific research..."
      },
      { 
        key: "mission_texte_2_fr", 
        label: "Deuxième paragraphe (Français)", 
        type: "textarea" as const,
        placeholder: "Le LISI s'engage également à former les futurs chercheurs et experts..."
      },
      { 
        key: "mission_texte_2_ar", 
        label: "Deuxième paragraphe (Arabe)", 
        type: "textarea" as const,
        placeholder: "يتعهد مختبر LISI أيضًا بتدريب الباحثين والخبراء المستقبليين..."
      },
      { 
        key: "mission_texte_2_en", 
        label: "Deuxième paragraphe (Anglais)", 
        type: "textarea" as const,
        placeholder: "LISI also commits to training future researchers and experts..."
      },
      { 
        key: "mission_image", 
        label: "Image de la section mission", 
        type: "file" as const
      },
    ],
  },
  {
    title: "Section Actualités",
    description: "Configuration de la section actualités dans les 3 langues",
    fields: [
      { 
        key: "actualites_titre_fr", 
        label: "Titre de la section (Français)", 
        type: "text" as const,
        placeholder: "Actualités du laboratoire"
      },
      { 
        key: "actualites_titre_ar", 
        label: "Titre de la section (Arabe)", 
        type: "text" as const,
        placeholder: "أخبار المختبر"
      },
      { 
        key: "actualites_titre_en", 
        label: "Titre de la section (Anglais)", 
        type: "text" as const,
        placeholder: "Laboratory News"
      },
      { 
        key: "actualites_description_fr", 
        label: "Description (Français)", 
        type: "textarea" as const,
        placeholder: "Découvrez les dernières actualités et événements du laboratoire"
      },
      { 
        key: "actualites_description_ar", 
        label: "Description (Arabe)", 
        type: "textarea" as const,
        placeholder: "اكتشف أحدث الأخبار والأحداث في المختبر"
      },
      { 
        key: "actualites_description_en", 
        label: "Description (Anglais)", 
        type: "textarea" as const,
        placeholder: "Discover the latest news and events from the laboratory"
      },
    ],
  },
  {
    title: "Section Domaines de Recherche",
    description: "Configuration de la section domaines dans les 3 langues",
    fields: [
      { 
        key: "domaines_titre_fr", 
        label: "Titre principal (Français)", 
        type: "text" as const,
        placeholder: "Domaines de recherche"
      },
      { 
        key: "domaines_titre_ar", 
        label: "Titre principal (Arabe)", 
        type: "text" as const,
        placeholder: "مجالات البحث"
      },
      { 
        key: "domaines_titre_en", 
        label: "Titre principal (Anglais)", 
        type: "text" as const,
        placeholder: "Research Areas"
      },
      { 
        key: "domaines_sous_titre_fr", 
        label: "Sous-titre (Français)", 
        type: "text" as const,
        placeholder: "NOS EXPERTISES"
      },
      { 
        key: "domaines_sous_titre_ar", 
        label: "Sous-titre (Arabe)", 
        type: "text" as const,
        placeholder: "خبراتنا"
      },
      { 
        key: "domaines_sous_titre_en", 
        label: "Sous-titre (Anglais)", 
        type: "text" as const,
        placeholder: "OUR EXPERTISE"
      },
      { 
        key: "domaines_description_fr", 
        label: "Description (Français)", 
        type: "textarea" as const,
        placeholder: "Nos domaines de recherche couvrent les technologies les plus avancées"
      },
      { 
        key: "domaines_description_ar", 
        label: "Description (Arabe)", 
        type: "textarea" as const,
        placeholder: "تغطي مجالات بحثنا أحدث التقنيات"
      },
      { 
        key: "domaines_description_en", 
        label: "Description (Anglais)", 
        type: "textarea" as const,
        placeholder: "Our research areas cover the most advanced technologies"
      },
      { 
        key: "domaines_texte_final_fr", 
        label: "Texte final (Français)", 
        type: "textarea" as const,
        placeholder: "Ces domaines représentent notre expertise et notre vision pour l'avenir"
      },
      { 
        key: "domaines_texte_final_ar", 
        label: "Texte final (Arabe)", 
        type: "textarea" as const,
        placeholder: "تمثل هذه المجالات خبرتنا ورؤيتنا للمستقبل"
      },
      { 
        key: "domaines_texte_final_en", 
        label: "Texte final (Anglais)", 
        type: "textarea" as const,
        placeholder: "These areas represent our expertise and vision for the future"
      },
    ],
  },
  ...missionPillarsSections,
  {
    title: "Section Mot du directeur",
    description: "Configuration du mot du directeur dans les 3 langues",
    fields: [
      {
        key: "mot_directeur_titre_fr",
        label: "Titre (Français)",
        type: "text" as const,
        placeholder: "Mot du directeur"
      },
      {
        key: "mot_directeur_description_fr",
        label: "Description (Français)",
        type: "textarea" as const,
        placeholder: "Le LISI est un laboratoire de recherche en informatique et en systèmes intelligents, qui se concentre sur la recherche fondamentale et appliquée dans ces domaines."
      },
      {
        key: "mot_directeur_image",
        label: "Image (Français)",
        type: "file" as const,
        placeholder: "Image du mot du directeur"
      },
      { 
        key: "mot_directeur_titre_ar",
        label: "Titre (Arabe)",
        type: "text" as const,
        placeholder: "موضوع المدير"
      },
      {
        key: "mot_directeur_description_ar",
        label: "Description (Arabe)",
        type: "textarea" as const,
        placeholder: "يجسد مختبرنا التميز العلمي والابتكار التكنولوجي. نحن ملتزمون بدفع حدود المعرفة وتكوين الجيل القادم من الباحثين. تُمكننا مقاربتنا متعددة التخصصات من مواجهة التحديات المعقدة لعصرنا بإبداع وصرامة."
      },
      {
        key: "mot_directeur_titre_en",
        label: "Titre (Anglais)",
        type: "text" as const,
        placeholder: "Director's Message"
      },
      {
        key: "mot_directeur_description_en",
        label: "Description (Anglais)",
        type: "textarea" as const,
        placeholder: "Our laboratory embodies scientific excellence and technological innovation. We are committed to pushing the boundaries of knowledge while training the next generation of researchers. Our multidisciplinary approach enables us to address the complex challenges of our time with creativity and rigor"
      },
    ],
  },
]

export default function SettingsIndex() {
  const [values, setValues] = useState<SettingsIndex>({})
  const [files, setFiles] = useState<Record<string, File>>({})
  const [preview, setPreview] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null)

  // Optimisation avec useCallback pour le chargement des paramètres
  const loadSettings = useCallback(async () => {
    try {
      setLoading(true)
      setMessage(null)
      
      const settingsData = await indexSettingsApi.getSettings()
      
      
      // Utiliser la fonction utilitaire pour fusionner les données
      const defaultValues = mergeSettingsWithDefaults(settingsData)      
      setValues(defaultValues)
      
      // Mettre à jour les previews d'images
      Object.entries(settingsData).forEach(([key, val]) => {
        if (key.endsWith('_image') && val) {
          console.log('Image trouvée:', key, val)
          setPreview(prev => ({ ...prev, [key]: String(val) }))
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
        setValues(response)
        Object.entries(response).forEach(([key, val]) => {
          if (key.endsWith('_image') && val) {
            setPreview(prev => ({ ...prev, [key]: String(val) }))
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

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Paramètres — Page d'Accueil</h1>
        
        {/* Note informative sur le système multilingue */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                Système Multilingue
              </h3>
              <div className="mt-2 text-sm text-green-700">
                <p>
                  Vous pouvez maintenant modifier le contenu dans les 3 langues : Français, Arabe et Anglais. 
                  Chaque langue a ses propres champs pour un contrôle total sur le contenu affiché.
                </p>
              </div>
            </div>
          </div>
        </div>
        
      </div>
      
      <SettingsForm
        sections={sections}
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