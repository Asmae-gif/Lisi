import { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { activityReportsSettingsApi } from '@/services/settingsApi';
import { buildImageUrl } from '@/utils/imageUtils';
import { 
  ActivityReportsSettings, 
  DEFAULT_ACTIVITY_REPORTS_SETTINGS,
  Section 
} from '@/types/ActivityReportsSettings';

interface UseActivityReportsSettingsReturn {
  // État
  settings: ActivityReportsSettings;
  isLoading: boolean;
  error: string | null;
  
  // Fichiers et previews
  files: Record<string, File>;
  preview: Record<string, string>;
  
  // Messages
  message: { type: 'success' | 'error'; text: string } | null;
  
  // Configuration du formulaire
  sections: Section[];
  
  // Actions
  loadSettings: () => Promise<void>;
  updateSettings: (settings: Partial<ActivityReportsSettings>, files?: Record<string, File>) => Promise<ActivityReportsSettings>;
  handleFileChange: (key: string, file: File | null) => void;
  clearMessage: () => void;
  
  // Fonctions utilitaires
  getLocalizedText: (key: string, fallback: string) => string;
  resetToDefaults: () => void;
}

/**
 * Hook personnalisé pour gérer les paramètres des rapports d'activité
 * Centralise toute la logique métier des paramètres ActivityReports
 */
export function useActivityReportsSettings(): UseActivityReportsSettingsReturn {
  // État local
  const [settings, setSettings] = useState<ActivityReportsSettings>(() => ({
    ...DEFAULT_ACTIVITY_REPORTS_SETTINGS
  }));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<Record<string, File>>({});
  const [preview, setPreview] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const { i18n } = useTranslation();

  // Configuration des sections du formulaire
  const sections: Section[] = useMemo(() => [
    {
      title: "Section Hero - Français",
      fields: [
        { 
          key: "activity_reports_titre_fr", 
          label: "Titre Principal (Français)", 
          type: "text"
        },
        { 
          key: "activity_reports_sous_titre_fr", 
          label: "Sous-titre (Français)", 
          type: "text"
        },
        { 
          key: "activity_reports_description_fr", 
          label: "Description (Français)", 
          type: "textarea"
        },
      ],
    },
    {
      title: "Section Hero - English",
      fields: [
        { 
          key: "activity_reports_titre_en", 
          label: "Main Title (English)", 
          type: "text"
        },
        { 
          key: "activity_reports_sous_titre_en", 
          label: "Subtitle (English)", 
          type: "text"
        },
        { 
          key: "activity_reports_description_en", 
          label: "Description (English)", 
          type: "textarea"
        },
      ],
    },
    {
      title: "Section Hero - العربية",
      fields: [
        { 
          key: "activity_reports_titre_ar", 
          label: "العنوان الرئيسي (العربية)", 
          type: "text"
        },
        { 
          key: "activity_reports_sous_titre_ar", 
          label: "العنوان الفرعي (العربية)", 
          type: "text" 
        },
        { 
          key: "activity_reports_description_ar", 
          label: "الوصف (العربية)", 
          type: "textarea"
        },
      ],
    },
    {
      title: "Image de couverture",
      fields: [
        { 
          key: "activity_reports_image", 
          label: "Image de couverture", 
          type: "file" 
        },
      ],
    },
  ], []);

  /**
   * Charger les paramètres depuis l'API
   */
  const loadSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      setMessage(null);
      
      const data = await activityReportsSettingsApi.getSettings();
      
      // Merger avec les valeurs par défaut
      const mergedSettings = {
        ...DEFAULT_ACTIVITY_REPORTS_SETTINGS,
        ...data
      };
      
      setSettings(mergedSettings);
      
      // Mettre à jour les previews d'images
      Object.entries(mergedSettings).forEach(([key, value]) => {
        if (key.endsWith('_image') && value) {
          const imageUrl = buildImageUrl(String(value));
          if (imageUrl) {
            setPreview(prev => ({ ...prev, [key]: imageUrl }));
          }
        }
      });
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement';
      setError(errorMessage);
      setMessage({ 
        type: 'error', 
        text: `Erreur lors du chargement : ${errorMessage}`
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Mettre à jour les paramètres
   */
  const updateSettings = useCallback(async (
    newSettings: Partial<ActivityReportsSettings>, 
    newFiles?: Record<string, File>
  ): Promise<ActivityReportsSettings> => {
    try {
      setIsLoading(true);
      setMessage(null);
      
      const updatedSettings = await activityReportsSettingsApi.updateSettings(newSettings, newFiles);
      
      setSettings(updatedSettings);
      
      // Mettre à jour les previews d'images
      Object.entries(updatedSettings).forEach(([key, value]) => {
        if (key.endsWith('_image') && value) {
          const imageUrl = buildImageUrl(String(value));
          if (imageUrl) {
            setPreview(prev => ({ ...prev, [key]: imageUrl }));
          }
        }
      });
      
      setMessage({ 
        type: 'success', 
        text: 'Paramètres enregistrés avec succès !' 
      });
      
      // Nettoyer les fichiers en attente
      setFiles({});
      
      return updatedSettings;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur lors de la sauvegarde';
      setMessage({ 
        type: 'error', 
        text: `Erreur lors de la sauvegarde : ${errorMessage}`
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Gérer les changements de fichiers
   */
  const handleFileChange = useCallback((key: string, file: File | null) => {
    if (file) {
      setFiles(prev => ({ ...prev, [key]: file }));
      setPreview(prev => ({ ...prev, [key]: URL.createObjectURL(file) }));
    } else {
      // Supprimer le fichier en attente
      setFiles(prev => {
        const newFiles = { ...prev };
        delete newFiles[key];
        return newFiles;
      });
      
      // Restaurer l'image existante si elle existe
      const existingValue = settings[key as keyof ActivityReportsSettings];
      if (existingValue) {
        const imageUrl = buildImageUrl(String(existingValue));
        if (imageUrl) {
          setPreview(prev => ({ ...prev, [key]: imageUrl }));
        }
      } else {
        setPreview(prev => {
          const newPreview = { ...prev };
          delete newPreview[key];
          return newPreview;
        });
      }
    }
  }, [settings]);

  /**
   * Effacer le message
   */
  const clearMessage = useCallback(() => {
    setMessage(null);
  }, []);

  /**
   * Obtenir un texte localisé
   */
  const getLocalizedText = useCallback((key: string, fallback: string): string => {
    const currentLanguage = i18n.language || 'fr';
    const settingKey = `activity_reports_${key}_${currentLanguage}`;
    const value = settings[settingKey as keyof ActivityReportsSettings];
    return (typeof value === 'string' ? value : fallback) || fallback;
  }, [settings, i18n.language]);

  /**
   * Réinitialiser aux valeurs par défaut
   */
  const resetToDefaults = useCallback(() => {
    setSettings({ ...DEFAULT_ACTIVITY_REPORTS_SETTINGS });
    setFiles({});
    setPreview({});
    setMessage(null);
  }, []);

  // Chargement initial
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  return {
    // État
    settings,
    isLoading,
    error,
    
    // Fichiers et previews
    files,
    preview,
    
    // Messages
    message,
    
    // Configuration du formulaire
    sections,
    
    // Actions
    loadSettings,
    updateSettings,
    handleFileChange,
    clearMessage,
    
    // Fonctions utilitaires
    getLocalizedText,
    resetToDefaults,
  };
} 