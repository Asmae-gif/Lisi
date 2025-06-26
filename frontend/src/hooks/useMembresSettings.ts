import { useState, useEffect } from 'react'
import axiosClient from "@/services/axiosClient"
import { MembreSettings, DEFAULT_MEMBRES_SETTINGS } from '@/types/MembresSettings'

export function useMembresSettings() {
  const [settings, setSettings] = useState<MembreSettings>(DEFAULT_MEMBRES_SETTINGS)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const response = await axiosClient.get('/api/pages/membres/settings', {
          headers: { 'Accept': 'application/json' }
        })

        const settingsData = response.data.data || response.data

        if (settingsData && typeof settingsData === 'object') {
          // Gérer la nouvelle structure hiérarchique des paramètres
          let flattenedSettings = {};
          const settingsDataTyped = settingsData as any;
          if (settingsDataTyped.fr || settingsDataTyped.en || settingsDataTyped.ar) {
            // Structure hiérarchique - aplatir
            Object.keys(settingsDataTyped).forEach(lang => {
              if (typeof settingsDataTyped[lang] === 'object') {
                Object.keys(settingsDataTyped[lang]).forEach(key => {
                  flattenedSettings[`membres_${key}_${lang}`] = settingsDataTyped[lang][key];
                });
              }
            });
          } else {
            // Structure plate - utiliser directement
            flattenedSettings = settingsDataTyped;
          }
          
          // Utiliser les valeurs par défaut partagées
          const defaultSettings: MembreSettings = {
            ...DEFAULT_MEMBRES_SETTINGS,
            ...flattenedSettings
          }
          
          setSettings(defaultSettings)
        } else {
          throw new Error('Format de données invalide')
        }
      } catch (err: unknown) {
        console.error('Erreur lors du chargement des paramètres:', err)
        setError(err instanceof Error ? err.message : 'Erreur lors du chargement des paramètres')
      } finally {
        setLoading(false)
      }
    }

    loadSettings()
  }, [])

  return { settings, loading, error }
} 