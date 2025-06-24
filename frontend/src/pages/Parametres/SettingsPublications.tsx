import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axiosClient from "@/services/axiosClient";
import SettingsForm from '@/components/common/SettingsForm';
import { PublicationSettings, ApiResponse, Section, DEFAULT_PUBLICATIONS_SETTINGS } from '@/types/PublicationsSettings';
import { buildImageUrl } from '@/utils/imageUtils';

export default function SettingsPublications() {
  // Définition des sections du formulaire
  const sections: Section[] = useMemo(() => [
    {
      title: "Section Hero - Français",
      fields: [
        { key: "publications_titre_fr", label: "Titre Principal (Français)", type: "text" },
        { key: "publications_sous_titre_fr", label: "Sous-titre (Français)", type: "text" },
      ],
    },
    {
      title: "Section Hero - English",
      fields: [
        { key: "publications_titre_en", label: "Main Title (English)", type: "text" },
        { key: "publications_sous_titre_en", label: "Subtitle (English)", type: "text" },
      ],
    },
    {
      title: "Section Hero - العربية",
      fields: [
        { key: "publications_titre_ar", label: "العنوان الرئيسي (العربية)", type: "text" },
        { key: "publications_sous_titre_ar", label: "العنوان الفرعي (العربية)", type: "text" },
      ],
    },
    {
        title: "Image de couverture",
        fields: [
          { 
            key: "publications_image", 
            label: "Image de couverture", 
            type: "file" 
          },
        ],
      },
  ], []);

  const [values, setValues] = useState<PublicationSettings>(() => {
    return { ...DEFAULT_PUBLICATIONS_SETTINGS }
  })
  const [files, setFiles] = useState<Record<string, File>>({})
  const [preview, setPreview] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  // Charger les settings existants
  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      setMessage(null);
      await axiosClient.get('/sanctum/csrf-cookie');
      const response = await axiosClient.get<ApiResponse>('/api/pages/publications/settings', {
        headers: { 'Accept': 'application/json' }
      });
      const settingsData = response.data.data || response.data;
      if (settingsData && typeof settingsData === 'object') {
        const defaultValues: PublicationSettings = {
            ...DEFAULT_PUBLICATIONS_SETTINGS,
            ...settingsData
        };
        setValues(defaultValues);
        Object.entries(defaultValues).forEach(([key, val]) => {
            if (key.endsWith('_image') && val) {
                const imageUrl = buildImageUrl(String(val));
                if (imageUrl) {
                    setPreview(prev => ({...prev, [key]: imageUrl}));
                }
            }
        });
      } else {
        throw new Error('Format de données invalide reçu du serveur');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des données';
      setMessage({ type: 'error', text: `Erreur lors du chargement : ${errorMessage}` });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  // Gestion des changements
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
        if (values[key as keyof PublicationSettings]) {
          const imageUrl = buildImageUrl(String(values[key as keyof PublicationSettings]))
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

  // Soumission du formulaire
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      await axiosClient.get('/api/sanctum/csrf-cookie');
      const formData = new FormData();
      if (values.id) formData.append('id', values.id.toString());
      formData.append('page', 'publications');
      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && key !== 'id') {
          formData.append(key, String(value));
        }
      })
      // Gérer les fichiers
      Object.entries(files).forEach(([key, file]) => {
        formData.append(key, file)
      })
      const response = await axiosClient.post<ApiResponse>(
        '/api/pages/publications/settings',
        formData,
        { headers: { 'Accept': 'application/json', 'Content-Type': undefined } }

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
      <h1 className="text-2xl font-bold">Paramètres — Page Publications</h1>
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
  );
} 