import React, { useState } from 'react';
import { Publication } from './publications-table';

interface PublicationFormProps {
  initialData?: Partial<Publication>;
  onSubmit: (data: Omit<Publication, 'id'>) => void;
  onCancel?: () => void;
  loading?: boolean;
}

const types = [
  'article',
  'conférence',
  'chapitre',
  'livre',
];

export default function PublicationForm({ initialData = {}, onSubmit, onCancel, loading }: PublicationFormProps) {
  const [form, setForm] = useState<Omit<Publication, 'id'>>({
    titre_publication: initialData.titre_publication || '',
    resume: initialData.resume || '',
    type_publication: initialData.type_publication || '',
    date_publication: initialData.date_publication || '',
    fichier_pdf_url: initialData.fichier_pdf_url || '',
    lien_externe_doi: initialData.lien_externe_doi || '',
    reference_complete: initialData.reference_complete || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-medium mb-1">Titre</label>
        <input name="titre_publication" value={form.titre_publication} onChange={handleChange} required className="input input-bordered w-full" />
      </div>
      <div>
        <label className="block font-medium mb-1">Résumé</label>
        <textarea name="resume" value={form.resume} onChange={handleChange} required className="input input-bordered w-full" />
      </div>
      <div>
        <label className="block font-medium mb-1">Type</label>
        <select name="type_publication" value={form.type_publication} onChange={handleChange} required className="input input-bordered w-full">
          <option value="">Sélectionner un type</option>
          {types.map(type => <option key={type} value={type}>{type}</option>)}
        </select>
      </div>
      <div>
        <label className="block font-medium mb-1">Date de publication</label>
        <input type="date" name="date_publication" value={form.date_publication} onChange={handleChange} required className="input input-bordered w-full" />
      </div>
      <div>
        <label className="block font-medium mb-1">Lien PDF (optionnel)</label>
        <input name="fichier_pdf_url" value={form.fichier_pdf_url} onChange={handleChange} className="input input-bordered w-full" />
      </div>
      <div>
        <label className="block font-medium mb-1">Lien DOI (optionnel)</label>
        <input name="lien_externe_doi" value={form.lien_externe_doi} onChange={handleChange} className="input input-bordered w-full" />
      </div>
      <div>
        <label className="block font-medium mb-1">Référence complète</label>
        <textarea name="reference_complete" value={form.reference_complete} onChange={handleChange} required className="input input-bordered w-full" />
      </div>
      <div className="flex gap-2 justify-end">
        {onCancel && <button type="button" onClick={onCancel} className="btn btn-ghost">Annuler</button>}
        <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Enregistrement...' : 'Enregistrer'}</button>
      </div>
    </form>
  );
} 