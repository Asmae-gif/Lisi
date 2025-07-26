import React from 'react';
import { IndexSettings } from '@/types/indexSettings';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

interface ValidationError {
  field: string;
  message: string;
  type: 'error' | 'warning' | 'info';
}

interface IndexSettingsValidationProps {
  settings: IndexSettings;
  className?: string;
}

const IndexSettingsValidation: React.FC<IndexSettingsValidationProps> = ({ 
  settings, 
  className = "" 
}) => {
  const validateSettings = (): ValidationError[] => {
    const errors: ValidationError[] = [];

    // Validation des champs requis
    if (!String(settings.hero_titre_principal)?.trim()) {
      errors.push({
        field: 'hero_titre_principal',
        message: 'Le titre principal est requis',
        type: 'error'
      });
    }

    if (!String(settings.hero_sous_titre)?.trim()) {
      errors.push({
        field: 'hero_sous_titre',
        message: 'Le sous-titre est requis',
        type: 'error'
      });
    }

    // Validation des statistiques
    if (!String(settings.stats_chercheurs)?.trim()) {
      errors.push({
        field: 'stats_chercheurs',
        message: 'Le nombre de chercheurs est requis',
        type: 'error'
      });
    }

    if (!String(settings.stats_publications)?.trim()) {
      errors.push({
        field: 'stats_publications',
        message: 'Le nombre de publications est requis',
        type: 'error'
      });
    }

    if (!String(settings.stats_projets)?.trim()) {
      errors.push({
        field: 'stats_projets',
        message: 'Le nombre de projets est requis',
        type: 'error'
      });
    }

    if (!String(settings.stats_partenaires)?.trim()) {
      errors.push({
        field: 'stats_partenaires',
        message: 'Le nombre de partenaires est requis',
        type: 'error'
      });
    }

    // Validation des piliers de mission
    if (!String(settings.pilier_innovation_titre)?.trim()) {
      errors.push({
        field: 'pilier_innovation_titre',
        message: 'Le titre du pilier Innovation est requis',
        type: 'error'
      });
    }

    if (!String(settings.pilier_formation_titre)?.trim()) {
      errors.push({
        field: 'pilier_formation_titre',
        message: 'Le titre du pilier Formation est requis',
        type: 'error'
      });
    }

    if (!String(settings.pilier_impact_titre)?.trim()) {
      errors.push({
        field: 'pilier_impact_titre',
        message: 'Le titre du pilier Impact est requis',
        type: 'error'
      });
    }

    if (!String(settings.pilier_partenariats_titre)?.trim()) {
      errors.push({
        field: 'pilier_partenariats_titre',
        message: 'Le titre du pilier Partenariats est requis',
        type: 'error'
      });
    }

    // Validation des domaines de recherche
    if (!String(settings.domaine_ia_titre)?.trim()) {
      errors.push({
        field: 'domaine_ia_titre',
        message: 'Le titre du domaine IA est requis',
        type: 'error'
      });
    }

    if (!String(settings.domaine_donnees_titre)?.trim()) {
      errors.push({
        field: 'domaine_donnees_titre',
        message: 'Le titre du domaine Données est requis',
        type: 'error'
      });
    }

    // Avertissements pour les champs optionnels mais recommandés
    if (!settings.mission_image) {
      errors.push({
        field: 'mission_image',
        message: 'Une image pour la section mission est recommandée',
        type: 'warning'
      });
    }

    if (!settings.hero_image_side) {
      errors.push({
        field: 'hero_image_side',
        message: 'Une image latérale pour le hero est recommandée',
        type: 'warning'
      });
    }

    // Validation de la longueur des textes
    if (settings.hero_sous_titre && String(settings.hero_sous_titre).length > 200) {
      errors.push({
        field: 'hero_sous_titre',
        message: 'Le sous-titre est trop long (max 200 caractères)',
        type: 'warning'
      });
    }


    if (settings.mission_description && String(settings.mission_description).length > 300) {
      errors.push({
        field: 'mission_description',
        message: 'La description de la mission est trop longue (max 300 caractères)',
        type: 'warning'
      });
    }

    return errors;
  };

  const errors = validateSettings();
  const errorCount = errors.filter(e => e.type === 'error').length;
  const warningCount = errors.filter(e => e.type === 'warning').length;

  if (errors.length === 0) {
    return (
      <Alert className={`border-green-200 bg-green-50 ${className}`}>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Tous les paramètres sont valides !
          </AlertDescription>
        </div>
      </Alert>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Résumé */}
      <div className="flex items-center gap-4 text-sm">
        <span className="font-medium">Validation :</span>
        {errorCount > 0 && (
          <span className="text-red-600 font-medium">{errorCount} erreur(s)</span>
        )}
        {warningCount > 0 && (
          <span className="text-yellow-600 font-medium">{warningCount} avertissement(s)</span>
        )}
      </div>

      {/* Erreurs */}
      {errors.filter(e => e.type === 'error').map((error, index) => (
        <Alert key={index} className="border-red-200 bg-red-50">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              <strong>{error.field}:</strong> {error.message}
            </AlertDescription>
          </div>
        </Alert>
      ))}

      {/* Avertissements */}
      {errors.filter(e => e.type === 'warning').map((error, index) => (
        <Alert key={index} className="border-yellow-200 bg-yellow-50">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              <strong>{error.field}:</strong> {error.message}
            </AlertDescription>
          </div>
        </Alert>
      ))}
    </div>
  );
};

export default IndexSettingsValidation; 