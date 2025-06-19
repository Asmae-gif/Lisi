import React from 'react';
import { Button } from "@/components/ui/button";

interface Partenaire {
  id: number;
  nom: string;
  logo: string | null;
  lien: string;
  created_at: string;
  updated_at: string;
}

interface PartenaireFormData {
  nom: string;
  logo: string;
  lien: string;
}

interface PartenaireFormProps {
  partenaire: Partenaire | null;
  onSubmit: (data: PartenaireFormData) => void;
  onClose: () => void;
  isSubmitting: boolean;
}

export function PartenaireForm({ partenaire, onSubmit, onClose, isSubmitting }: PartenaireFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit({
      nom: formData.get('nom') as string,
      logo: formData.get('logo') as string,
      lien: formData.get('lien') as string,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">
          {partenaire ? 'Modifier le partenaire' : 'Ajouter un partenaire'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nom</label>
              <input
                type="text"
                name="nom"
                defaultValue={partenaire?.nom}
                className="w-full p-2 border rounded"
                required
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">URL du logo</label>
              <input
                type="url"
                name="logo"
                defaultValue={partenaire?.logo || ''}
                className="w-full p-2 border rounded"
                placeholder="https://exemple.com/logo.png"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Lien</label>
              <input
                type="url"
                name="lien"
                defaultValue={partenaire?.lien}
                className="w-full p-2 border rounded"
                required
                placeholder="https://exemple.com"
                disabled={isSubmitting}
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'En cours...' : (partenaire ? 'Modifier' : 'Ajouter')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 