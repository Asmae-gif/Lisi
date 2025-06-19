import React, { useState, useEffect } from 'react';
import { Publication } from './publications-table';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { X, Plus, User } from 'lucide-react';
import api from '../lib/api';

interface Membre {
  id: number;
  nom: string;
  prenom: string;
}

interface PublicationFormProps {
  initialData?: Partial<Publication>;
  onSubmit: (data: any) => void;
  onCancel?: () => void;
  loading?: boolean;
}

const types = [
  { value: 'article', label: 'Article' },
  { value: 'conférence', label: 'Conférence' },
  { value: 'chapitre', label: 'Chapitre' },
  { value: 'livre', label: 'Livre' },
  { value: 'rapport', label: 'Rapport' },
  { value: 'thèse', label: 'Thèse' },
];

export default function PublicationForm({ initialData = {}, onSubmit, onCancel, loading }: PublicationFormProps) {
  const [membres, setMembres] = useState<Membre[]>([]);
  const [selectedAuteurs, setSelectedAuteurs] = useState<Membre[]>([]);
  const [availableMembres, setAvailableMembres] = useState<Membre[]>([]);
  const [form, setForm] = useState<Omit<Publication, 'id'>>({
    titre_publication: initialData.titre_publication || '',
    resume: initialData.resume || '',
    type_publication: initialData.type_publication || '',
    date_publication: initialData.date_publication || '',
    fichier_pdf_url: initialData.fichier_pdf_url || '',
    lien_externe_doi: initialData.lien_externe_doi || '',
    reference_complete: initialData.reference_complete || '',
  });

  useEffect(() => {
    // Charger la liste des membres
    api.get('/membres')
      .then(response => {
        let membresData: Membre[] = [];
        if (Array.isArray(response.data)) {
          membresData = response.data;
        } else if (response.data && Array.isArray(response.data.data)) {
          membresData = response.data.data;
        }
        setMembres(membresData);
        setAvailableMembres(membresData);
      })
      .catch(error => {
        console.error('Erreur lors du chargement des membres:', error);
        setMembres([]);
        setAvailableMembres([]);
      });
  }, []);

  // Initialiser les auteurs sélectionnés si on modifie une publication
  useEffect(() => {
    if (initialData.auteurs && Array.isArray(initialData.auteurs)) {
      const auteursIds = initialData.auteurs;
      const auteursSelectionnes = membres.filter(membre => auteursIds.includes(membre.id));
      setSelectedAuteurs(auteursSelectionnes);
      setAvailableMembres(membres.filter(membre => !auteursIds.includes(membre.id)));
    }
  }, [initialData.auteurs, membres]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const addAuteur = (membreId: string) => {
    const membre = membres.find(m => m.id.toString() === membreId);
    if (membre && !selectedAuteurs.find(a => a.id === membre.id)) {
      setSelectedAuteurs([...selectedAuteurs, membre]);
      setAvailableMembres(availableMembres.filter(m => m.id !== membre.id));
    }
  };

  const removeAuteur = (membreId: number) => {
    const membre = selectedAuteurs.find(a => a.id === membreId);
    if (membre) {
      setSelectedAuteurs(selectedAuteurs.filter(a => a.id !== membreId));
      setAvailableMembres([...availableMembres, membre]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...form,
      auteurs: selectedAuteurs.map(a => a.id)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Titre */}
        <div className="md:col-span-2">
          <Label htmlFor="titre_publication" className="text-base font-semibold">
            Titre de la publication *
          </Label>
          <Input
            id="titre_publication"
            name="titre_publication"
            value={form.titre_publication}
            onChange={handleChange}
            required
            className="mt-2"
            placeholder="Entrez le titre de la publication"
          />
        </div>

        {/* Type et Date */}
      <div>
          <Label htmlFor="type_publication" className="text-base font-semibold">
            Type de publication *
          </Label>
          <Select
            value={form.type_publication}
            onValueChange={(value) => handleSelectChange('type_publication', value)}
          >
            <SelectTrigger className="mt-2">
              <SelectValue placeholder="Sélectionner un type" />
            </SelectTrigger>
            <SelectContent>
              {types.map(type => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
      </div>

      <div>
          <Label htmlFor="date_publication" className="text-base font-semibold">
            Date de publication *
          </Label>
          <Input
            id="date_publication"
            type="date"
            name="date_publication"
            value={form.date_publication}
            onChange={handleChange}
            required
            className="mt-2"
          />
        </div>

        {/* Auteurs */}
        <div className="md:col-span-2">
          <Label className="text-base font-semibold flex items-center gap-2">
            <User className="w-5 h-5" />
            Auteurs *
          </Label>
          
          {/* Auteurs sélectionnés */}
          {selectedAuteurs.length > 0 && (
            <div className="mt-3 mb-4">
              <Label className="text-sm text-gray-600 mb-2 block">Auteurs sélectionnés :</Label>
              <div className="flex flex-wrap gap-2">
                {selectedAuteurs.map(auteur => (
                  <Badge key={auteur.id} variant="secondary" className="flex items-center gap-1">
                    {auteur.prenom} {auteur.nom}
                    <button
                      type="button"
                      onClick={() => removeAuteur(auteur.id)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
      </div>
          )}

          {/* Sélection d'auteurs */}
          <div className="flex gap-2">
            <Select onValueChange={addAuteur}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Ajouter un auteur" />
              </SelectTrigger>
              <SelectContent>
                {availableMembres.map(membre => (
                  <SelectItem key={membre.id} value={membre.id.toString()}>
                    {membre.prenom} {membre.nom}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => {
                if (availableMembres.length > 0) {
                  addAuteur(availableMembres[0].id.toString());
                }
              }}
              disabled={availableMembres.length === 0}
            >
              <Plus className="w-4 h-4" />
            </Button>
      </div>
          
          {availableMembres.length === 0 && selectedAuteurs.length > 0 && (
            <p className="text-sm text-green-600 mt-2">
              ✅ Tous les membres ont été ajoutés comme auteurs
            </p>
          )}
      </div>

        {/* Résumé */}
        <div className="md:col-span-2">
          <Label htmlFor="resume" className="text-base font-semibold">
            Résumé *
          </Label>
          <Textarea
            id="resume"
            name="resume"
            value={form.resume}
            onChange={handleChange}
          required 
            className="mt-2 min-h-[120px]"
            placeholder="Entrez le résumé de la publication"
          />
      </div>

        {/* Liens */}
      <div>
          <Label htmlFor="fichier_pdf_url" className="text-base font-semibold">
            URL du fichier PDF
          </Label>
          <Input
            id="fichier_pdf_url"
            name="fichier_pdf_url"
            value={form.fichier_pdf_url}
            onChange={handleChange}
            className="mt-2"
            placeholder="https://exemple.com/document.pdf"
          />
      </div>

      <div>
          <Label htmlFor="lien_externe_doi" className="text-base font-semibold">
            DOI ou lien externe
          </Label>
          <Input
            id="lien_externe_doi"
            name="lien_externe_doi"
            value={form.lien_externe_doi}
            onChange={handleChange}
            className="mt-2"
            placeholder="10.1000/182 ou https://..."
          />
        </div>

        {/* Référence complète */}
        <div className="md:col-span-2">
          <Label htmlFor="reference_complete" className="text-base font-semibold">
            Référence complète *
          </Label>
          <Textarea
            id="reference_complete"
            name="reference_complete"
            value={form.reference_complete}
            onChange={handleChange}
            required
            className="mt-2 min-h-[100px]"
            placeholder="Format APA ou autre format de référence"
          />
      </div>
      </div>

      {/* Boutons d'action */}
      <div className="flex justify-end gap-3 pt-6 border-t">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
            Annuler
          </Button>
        )}
        <Button type="submit" disabled={loading || selectedAuteurs.length === 0}>
          {loading ? 'Enregistrement...' : (initialData.id ? 'Modifier' : 'Créer')}
        </Button>
      </div>
    </form>
  );
} 