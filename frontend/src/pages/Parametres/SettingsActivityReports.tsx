import React from 'react'
import SettingsForm from '@/components/common/SettingsForm'
import { useActivityReportsSettings } from '@/hooks/useActivityReportsSettings'

/**
 * Composant de paramètres pour la page Rapports d'Activité
 * Permet de configurer les titres, sous-titres, descriptions et images de la page en 3 langues
 */

export default function SettingsActivityReports() {
  // Utiliser le hook personnalisé
  const {
    settings,
    setSettings,
    isLoading,
    files,
    preview,
    message,
    sections,
    updateSettings,
    handleFileChange,
    clearMessage
  } = useActivityReportsSettings();
  

  // Gérer les changements de valeurs du formulaire
  const handleChange = (key: string, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.target.type === 'file') {
      const file = (e.target as HTMLInputElement).files?.[0] || null;
      handleFileChange(key, file);
    } else {
      const value = e.target.value || '';
      setSettings(prev => ({
        ...prev,
        [key]: value
      }));
      
    }
  };

  // Gérer la soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateSettings(settings, files);
    } catch (error) {
      // Les erreurs sont déjà gérées par le hook
      console.error('Erreur lors de la soumission:', error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Paramètres — Page Rapports d'Activité</h1>
      
      <SettingsForm
        sections={sections}
        values={settings as unknown as Record<string, string | number | boolean | null | undefined>}
        files={files}
        preview={preview}
        loading={isLoading}
        message={message}
        onSubmit={handleSubmit}
        onChange={handleChange}
        submitText="Enregistrer"
        loadingText="Enregistrement…"
      />
    </div>
  )
} 