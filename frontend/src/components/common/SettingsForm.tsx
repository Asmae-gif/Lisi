import React, {  useCallback, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle, Loader2, X, MapPin, ExternalLink } from "lucide-react";
import { buildImageUrlWithDefaults, handleImageError, DEFAULT_IMAGE_FALLBACK } from '@/utils/imageUtils';

/**
 * Composant de formulaire de paramètres réutilisable
 * Gère l'affichage et la soumission de formulaires de configuration avec support pour différents types de champs
 */
interface Field {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'file' | 'number' | 'email' | 'url' | 'location';
  placeholder?: string;
  required?: boolean;
  rows?: number;
  accept?: string;
}

interface Section {
  title: string;
  fields: Field[];
  description?: string;
}

interface SettingsFormProps {
  sections: Section[];
  values: Record<string, string | number | boolean | null | undefined>;
  files?: Record<string, File>;
  preview?: Record<string, string>;
  loading?: boolean;
  message?: { type: 'success' | 'error'; text: string } | null;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (key: string, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  submitText?: string;
  loadingText?: string;
  className?: string;
}

const SettingsForm = React.memo(({
  sections,
  values,
  files = {},
  preview = {},
  loading = false,
  message,
  onSubmit,
  onChange,
  submitText = "Enregistrer",
  loadingText = "Enregistrement…",
  className = ""
}: SettingsFormProps) => {

  // Optimisation avec useCallback pour la gestion des changements
  const handleChange = useCallback((key: string, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(key, e);
  }, [onChange]);

  // Optimisation avec useMemo pour le rendu des champs
  const renderField = useCallback((field: Field) => {
    const value = values[field.key] !== undefined ? values[field.key] : '';
    
    switch (field.type) {
      case 'textarea':
        return (
          <Textarea
            id={field.key}
            rows={field.rows || 4}
            value={value as string}
            onChange={(e) => handleChange(field.key, e)}
            className="border rounded px-3 py-2"
            placeholder={field.placeholder || `Entrez ${field.label.toLowerCase()}`}
            required={field.required}
          />
        );
      
      case 'file': {
        const imageUrl = buildImageUrlWithDefaults(values[field.key] as string);
        const previewUrl = preview[field.key];
        const hasImage = imageUrl || previewUrl;
        
        return (
          <div className="space-y-2">
            <Input
              id={field.key}
              type="file"
              accept={field.accept || "image/*"}
              onChange={(e) => handleChange(field.key, e)}
              className="pt-1"
            />
            <p className="text-sm text-gray-500">
              {field.required ? 'Image obligatoire' : 'Image optionnelle'}
            </p>
            {hasImage && (
              <div className="mt-2 relative">
                <img
                  src={previewUrl || imageUrl || DEFAULT_IMAGE_FALLBACK}
                  alt=""
                  className="max-h-48 object-contain border rounded"
                  onError={(e) => handleImageError(e, DEFAULT_IMAGE_FALLBACK)}
                />
                <p className="text-sm text-gray-500 mt-1">
                  {previewUrl ? 'Nouvelle image sélectionnée' : 'Image actuelle'}
                </p>
                {previewUrl && (
                  <button
                    type="button"
                    onClick={() => {
                      // Réinitialiser le preview
                      const input = document.getElementById(field.key) as HTMLInputElement;
                      if (input) {
                        input.value = '';
                      }
                      // Appeler onChange avec un événement vide
                      const event = {
                        target: { value: '', type: 'file', files: null }
                      } as React.ChangeEvent<HTMLInputElement>;
                      handleChange(field.key, event);
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    title="Supprimer l'image"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        );
      }
      
      case 'location': {
        const handleOpenGoogleMaps = () => {
          const address = value as string;
          if (address) {
            const encodedAddress = encodeURIComponent(address);
            const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
            window.open(googleMapsUrl, '_blank');
          } else {
            // Si aucune adresse n'est saisie, ouvrir Google Maps avec une recherche vide
            window.open('https://www.google.com/maps', '_blank');
          }
        };

        return (
          <div className="flex items-center space-x-2">
            <Input
              id={field.key}
              type="text"
              value={value as string}
              onChange={(e) => handleChange(field.key, e)}
              className="border rounded px-3 py-2 flex-1"
              placeholder={field.placeholder || `Entrez la localisation`}
              required={field.required}
            />
            <Button
              type="button"
              onClick={handleOpenGoogleMaps}
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
              title="Ouvrir Google Maps"
            >
              <MapPin className="h-4 w-4" />
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        );
      }
      
      default:
        return (
          <Input
            id={field.key}
            type={field.type}
            value={value as string}
            onChange={(e) => handleChange(field.key, e)}
            className="border rounded px-3 py-2"
            placeholder={field.placeholder || `Entrez ${field.label.toLowerCase()}`}
            required={field.required}
          />
        );
    }
  }, [values, preview, handleChange]);

  // Optimisation avec useMemo pour le rendu des sections
  const renderedSections = useMemo(() => {
    return sections.map((section) => (
      <Card key={section.title} className="border p-4 rounded shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-xl font-semibold">{section.title}</CardTitle>
          {section.description && (
            <p className="text-sm text-gray-600">{section.description}</p>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {section.fields.map((field) => (
              <div key={field.key} className="flex flex-col">
                <Label className="font-medium mb-1" htmlFor={field.key}>
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                {renderField(field)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    ));
  }, [sections, renderField]);

  return (
    <div className={`max-w-3xl mx-auto p-6 space-y-6 ${className}`}>
      {/* Message de notification */}
      {message && (
        <Alert className={`${
          message.type === 'success' 
            ? 'border-green-200 bg-green-50' 
            : 'border-red-200 bg-red-50'
        }`}>
          <div className="flex items-center gap-2">
            {message.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={
              message.type === 'success' ? 'text-green-800' : 'text-red-800'
            }>
              {message.text}
            </AlertDescription>
          </div>
        </Alert>
      )}

      {/* Formulaire */}
      <form onSubmit={onSubmit} className="space-y-8">
        {renderedSections}
        
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={loading}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                {loadingText}
              </>
            ) : (
              submitText
            )}
          </Button>
        </div>
      </form>
    </div>
  );
});

SettingsForm.displayName = 'SettingsForm';

export default SettingsForm; 