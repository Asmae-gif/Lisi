import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { X, User } from 'lucide-react';
import api from '../lib/api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Membre {
  id: number;
  nom: string;
  prenom: string;
}

interface Publication {
    id: number;
    titre_publication_fr: string;
    titre_publication_en: string;
    titre_publication_ar: string;
    resume_fr: string;
    resume_en: string;
    resume_ar: string;
    type_publication: string;
    date_publication: string;
    fichier_pdf_url?: string;
    lien_externe_doi?: string;
    reference_complete_fr: string;
    reference_complete_en: string;
    reference_complete_ar: string;
    auteurs?: number[];
}

interface PublicationFormData {
    titre_publication_fr: string;
    titre_publication_en: string;
    titre_publication_ar: string;
    resume_fr: string;
    resume_en: string;
    resume_ar: string;
    type_publication: string;
    date_publication: string;
    fichier_pdf_url?: string;
    lien_externe_doi?: string;
    reference_complete_fr: string;
    reference_complete_en: string;
    reference_complete_ar: string;
}

interface PublicationFormProps {
  initialData?: Partial<Publication>;
  onSubmit: (data: PublicationFormData & { auteurs: number[] }) => void;
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

const createEmptyPublicationFormData = (): PublicationFormData => ({
    titre_publication_fr: '',
    titre_publication_en: '',
    titre_publication_ar: '',
    resume_fr: '',
    resume_en: '',
    resume_ar: '',
    type_publication: '',
    date_publication: '',
    fichier_pdf_url: '',
    lien_externe_doi: '',
    reference_complete_fr: '',
    reference_complete_en: '',
    reference_complete_ar: '',
});

export default function PublicationForm({ initialData = {}, onSubmit, onCancel, loading }: PublicationFormProps) {
  const [membres, setMembres] = useState<Membre[]>([]);
  const [selectedAuteurs, setSelectedAuteurs] = useState<Membre[]>([]);
  const [availableMembres, setAvailableMembres] = useState<Membre[]>([]);
  const [form, setForm] = useState<PublicationFormData>(createEmptyPublicationFormData());
  const [activeTab, setActiveTab] = useState("fr");

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
        setForm({
            titre_publication_fr: initialData.titre_publication_fr || '',
            titre_publication_en: initialData.titre_publication_en || '',
            titre_publication_ar: initialData.titre_publication_ar || '',
            resume_fr: initialData.resume_fr || '',
            resume_en: initialData.resume_en || '',
            resume_ar: initialData.resume_ar || '',
            type_publication: initialData.type_publication || '',
            date_publication: initialData.date_publication || '',
            fichier_pdf_url: initialData.fichier_pdf_url || '',
            lien_externe_doi: initialData.lien_externe_doi || '',
            reference_complete_fr: initialData.reference_complete_fr || '',
            reference_complete_en: initialData.reference_complete_en || '',
            reference_complete_ar: initialData.reference_complete_ar || '',
        });
    } else {
        setForm(createEmptyPublicationFormData());
    }
  }, [initialData]);

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
    if (initialData.auteurs && Array.isArray(initialData.auteurs) && membres.length > 0) {
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

  const renderLanguageTab = (lang: 'fr' | 'en' | 'ar', label: string) => (
    <TabsContent value={lang} className="space-y-6">
        <div>
            <Label htmlFor={`titre_publication_${lang}`} className="text-base font-semibold">Titre de la publication ({label}) *</Label>
            <Input
                id={`titre_publication_${lang}`}
                name={`titre_publication_${lang}`}
                value={form[`titre_publication_${lang}`]}
                onChange={handleChange}
                required
                className="mt-2"
                placeholder={`Entrez le titre en ${label}`}
            />
        </div>
        <div>
            <Label htmlFor={`resume_${lang}`} className="text-base font-semibold">Résumé ({label}) *</Label>
            <Textarea
                id={`resume_${lang}`}
                name={`resume_${lang}`}
                value={form[`resume_${lang}`]}
                onChange={handleChange}
                required
                className="mt-2 min-h-[120px]"
                placeholder={`Entrez le résumé en ${label}`}
            />
        </div>
        <div>
            <Label htmlFor={`reference_complete_${lang}`} className="text-base font-semibold">Référence complète ({label})</Label>
            <Textarea
                id={`reference_complete_${lang}`}
                name={`reference_complete_${lang}`}
                value={form[`reference_complete_${lang}`]}
                onChange={handleChange}
                className="mt-2 min-h-[80px]"
                placeholder={`Entrez la référence complète en ${label}`}
            />
        </div>
    </TabsContent>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="fr">Français</TabsTrigger>
              <TabsTrigger value="en">English</TabsTrigger>
              <TabsTrigger value="ar">العربية</TabsTrigger>
            </TabsList>
            {renderLanguageTab('fr', 'Français')}
            {renderLanguageTab('en', 'English')}
            {renderLanguageTab('ar', 'العربية')}
        </Tabs>
      
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t">
        {/* Type et Date */}
        <div>
          <Label htmlFor="type_publication" className="text-base font-semibold">Type de publication *</Label>
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
          <Label htmlFor="date_publication" className="text-base font-semibold">Date de publication *</Label>
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
          <Label className="text-base font-semibold flex items-center gap-2"><User className="w-5 h-5" />Auteurs *</Label>
          
          {selectedAuteurs.length > 0 && (
            <div className="mt-3 mb-4">
              <Label className="text-sm text-gray-600 mb-2 block">Auteurs sélectionnés :</Label>
              <div className="flex flex-wrap gap-2">
                {selectedAuteurs.map(auteur => (
                  <Badge key={auteur.id} variant="secondary" className="flex items-center gap-1">
                    {auteur.prenom} {auteur.nom}
                    <button type="button" onClick={() => removeAuteur(auteur.id)} className="ml-1 hover:text-red-500">
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          )}

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
          </div>
        </div>

        {/* Liens */}
        <div>
          <Label htmlFor="fichier_pdf_url" className="text-base font-semibold">URL du fichier PDF</Label>
          <Input
            id="fichier_pdf_url"
            name="fichier_pdf_url"
            value={form.fichier_pdf_url || ''}
            onChange={handleChange}
            className="mt-2"
            placeholder="https://example.com/publication.pdf"
          />
        </div>

        <div>
          <Label htmlFor="lien_externe_doi" className="text-base font-semibold">Lien externe (DOI)</Label>
          <Input
            id="lien_externe_doi"
            name="lien_externe_doi"
            value={form.lien_externe_doi || ''}
            onChange={handleChange}
            className="mt-2"
            placeholder="https://doi.org/xxxx"
          />
        </div>
      </div>

      <div className="flex justify-end gap-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Annuler
          </Button>
        )}
        <Button type="submit" disabled={loading}>
          {loading ? "Enregistrement..." : (initialData && initialData.id ? 'Modifier' : 'Créer')}
        </Button>
      </div>
    </form>
  );
} 