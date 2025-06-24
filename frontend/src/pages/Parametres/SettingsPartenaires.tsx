import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axiosClient from "@/services/axiosClient";
import SettingsForm from '@/components/common/SettingsForm';
import { PartenaireSettings, ApiResponse, DEFAULT_PARTENAIRE_SETTINGS } from '@/types/PartenaireSettings';
import { Section } from '@/types/common';
import { buildImageUrl } from '@/utils/imageUtils';

export default function SettingsPartenaires() {
  const sections: Section[] = useMemo(() => [
    {
      title: "Section Hero - Français",
      fields: [
        { key: "partenaire_titre_fr", label: "Titre Principal (Français)", type: "text" as const },
        { key: "partenaire_sous_titre_fr", label: "Sous-titre (Français)", type: "text" as const },
        { key: "partenaire_heading_fr", label: "Titre de la section (Français)", type: "text" as const },
        { key: "partenaire_description_fr", label: "Description (Français)", type: "textarea" as const },
      ],
    },
    {
      title: "Section Hero - English",
      fields: [
        { key: "partenaire_titre_en", label: "Main Title (English)", type: "text" as const },
        { key: "partenaire_sous_titre_en", label: "Subtitle (English)", type: "text" as const },
        { key: "partenaire_heading_en", label: "Section Title (English)", type: "text" as const },
        { key: "partenaire_description_en", label: "Description (English)", type: "textarea" as const },
      ],
    },
    {
      title: "Section Hero - العربية",
      fields: [
        { key: "partenaire_titre_ar", label: "العنوان الرئيسي (العربية)", type: "text" as const },
        { key: "partenaire_sous_titre_ar", label: "العنوان الفرعي (العربية)", type: "text" as const },
        { key: "partenaire_heading_ar", label: "عنوان القسم (العربية)", type: "text" as const },
        { key: "partenaire_description_ar", label: "الوصف (العربية)", type: "textarea" as const },
      ],
    },
    {
      title: "Image de couverture",
      fields: [
        { 
          key: "partenaire_image", 
          label: "Image de couverture", 
          type: "file" as const 
        },
      ],
    },
  ], []);

  const [values, setValues] = useState<PartenaireSettings>(() => {
    return { ...DEFAULT_PARTENAIRE_SETTINGS }
  });
  const [files, setFiles] = useState<Record<string, File>>({});
  const [preview, setPreview] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      setMessage(null);
      await axiosClient.get('/sanctum/csrf-cookie');
      const response = await axiosClient.get<ApiResponse>('/api/pages/partenaires/settings');
      const settingsData = response.data.data || response.data;
      if (settingsData && typeof settingsData === 'object') {
        const filteredSettings: Partial<PartenaireSettings> = {};
        Object.keys(DEFAULT_PARTENAIRE_SETTINGS).forEach(key => {
          if (key in settingsData) {
            filteredSettings[key as keyof PartenaireSettings] = settingsData[key as keyof typeof settingsData] as string;
          }
        });

        const defaultValues: PartenaireSettings = {
          ...DEFAULT_PARTENAIRE_SETTINGS,
          ...filteredSettings
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

  const handleChange = useCallback((key: string, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.target.type === 'file') {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        setFiles(f => ({ ...f, [key]: file }))
        setPreview(p => ({ ...p, [key]: URL.createObjectURL(file) }))
      }
    } else {
      const value = e.target.value || ''
      setValues(v => ({ ...v, [key]: value }))
    }
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const formData = new FormData();
      if (values.id) formData.append('id', values.id.toString());
      formData.append('page', 'partenaires');
      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && key !== 'id') {
          formData.append(key, String(value));
        }
      });
      Object.entries(files).forEach(([key, file]) => {
        formData.append(key, file);
      });

      const response = await axiosClient.post<ApiResponse>(
        '/api/pages/partenaires/settings',
        formData,
        { headers: { 'Accept': 'application/json', 'Content-Type': 'multipart/form-data' } }
      );

      if (response.data?.success) {
        setMessage({ type: 'success', text: 'Paramètres enregistrés avec succès !' });
        if (response.data.data) {
          setValues(response.data.data);
        }
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la sauvegarde';
      setMessage({ type: 'error', text: `Erreur lors de la sauvegarde : ${errorMessage}` });
    } finally {
      setLoading(false);
    }
  }, [values, files]);

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Paramètres — Page Partenaires</h1>
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
  );
} 