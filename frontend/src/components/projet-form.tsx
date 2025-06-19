import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

interface Projet {
  id?: number;
  titre: string;
  description: string;
  image: string | null;
  date_debut: string;
  date_fin: string;
  statut: 'en_cours' | 'termine' | 'planifie';
}

interface ProjetFormProps {
  projet?: Projet | null;
  onSubmit: (data: Omit<Projet, 'id'>) => Promise<void>;
  onClose: () => void;
  isSubmitting: boolean;
}

export function ProjetForm({ projet, onSubmit, onClose, isSubmitting }: ProjetFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = React.useState<Omit<Projet, 'id'>>({
    titre: projet?.titre || '',
    description: projet?.description || '',
    image: projet?.image || null,
    date_debut: projet?.date_debut || new Date().toISOString().split('T')[0],
    date_fin: projet?.date_fin || '',
    statut: projet?.statut || 'planifie',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit(formData);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la soumission",
        variant: "destructive",
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <h2 className="text-2xl font-bold mb-4">
          {projet ? 'Modifier le projet' : 'Ajouter un projet'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Titre</label>
            <Input
              value={formData.titre}
              onChange={(e) => setFormData(prev => ({ ...prev, titre: e.target.value }))}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <Textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              required
              rows={6}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Image</label>
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            {formData.image && (
              <img
                src={formData.image}
                alt="Prévisualisation"
                className="mt-2 h-32 w-32 object-cover rounded"
              />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Date de début</label>
              <Input
                type="date"
                value={formData.date_debut}
                onChange={(e) => setFormData(prev => ({ ...prev, date_debut: e.target.value }))}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Date de fin</label>
              <Input
                type="date"
                value={formData.date_fin}
                onChange={(e) => setFormData(prev => ({ ...prev, date_fin: e.target.value }))}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Statut</label>
            <select
              value={formData.statut}
              onChange={(e) => setFormData(prev => ({ ...prev, statut: e.target.value as Projet['statut'] }))}
              className="w-full p-2 border rounded-md"
              required
            >
              <option value="planifie">Planifié</option>
              <option value="en_cours">En cours</option>
              <option value="termine">Terminé</option>
            </select>
          </div>

          <div className="flex justify-end space-x-2 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Enregistrement...' : projet ? 'Modifier' : 'Ajouter'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 