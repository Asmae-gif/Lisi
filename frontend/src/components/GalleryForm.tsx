import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Gallery, CreateGalleryData } from '../services/galleryApi';
import { Entity } from '../pages/dashboard/Gallery';

interface GalleryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateGalleryData) => void;
  gallery?: Gallery | null;
  loading?: boolean;
  entities?: Record<string, Entity[]>;
}

interface FormData {
  title: string;
  description: string;
  image_path: string;
  galleriesable_type: string;
  galleriesable_id: number;
}

const galleriesableTypes = [
  { value: "projet", label: "Projet" },
  { value: "Partenariats", label: "Partenariat" },
  { value: "Axes de recherche", label: "Axe de recherche" },
  { value: "Publications", label: "Publication" },
  { value: "Prix de distinction", label: "Prix de distinction" }
];

const GalleryForm: React.FC<GalleryFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  gallery,
  loading = false,
  entities = {},
}) => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    image_path: '',
    galleriesable_type: 'projet',
    galleriesable_id: 1,
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  useEffect(() => {
    if (gallery) {
      setFormData({
        title: gallery.title,
        description: gallery.description,
        image_path: gallery.image_path,
        galleriesable_type: gallery.galleriesable_type,
        galleriesable_id: gallery.galleriesable_id,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        image_path: '',
        galleriesable_type: 'projet',
        galleriesable_id: 1,
      });
    }
    setErrors({});
  }, [gallery, isOpen]);

  // Fonction pour obtenir le nom de l'entité
  const getEntityName = (type: string, id: number): string => {
    const entityList = entities[type] || [];
    const entity = entityList.find(e => e.id === id);
    if (entity) {
      // Gérer les différents formats selon le type d'entité
      switch (type) {
        case 'Publications':
          return entity.titre_publication || entity.title_fr || entity.title || entity.name || `ID: ${id}`;
        case 'projet':
          return entity.titre_projet || entity.title_fr || entity.title || entity.name || `ID: ${id}`;
        case 'Partenariats':
          return entity.nom_partenaire || entity.title_fr || entity.title || entity.name || `ID: ${id}`;
        case 'Axes de recherche':
          return entity.title_fr || entity.title || entity.name || `ID: ${id}`;
        case 'Prix de distinction':
          return entity.nom_prix || entity.title_fr || entity.title || entity.name || `ID: ${id}`;
        default:
          return entity.title_fr || entity.title || entity.name || `ID: ${id}`;
      }
    }
    return `ID: ${id}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation simple
    const newErrors: Partial<FormData> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Le titre est requis';
    }
    
    if (!formData.image_path.trim()) {
      newErrors.image_path = 'Le chemin de l\'image est requis';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'La description est requise';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Convertir en CreateGalleryData
    const createData: CreateGalleryData = {
      title: formData.title,
      description: formData.description,
      image_path: formData.image_path,
      galleriesable_type: formData.galleriesable_type,
      galleriesable_id: formData.galleriesable_id,
    };

    onSubmit(createData);
  };

  const handleChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-900">
            {gallery ? 'Modifier la galerie' : 'Ajouter une nouvelle galerie'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={loading}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Titre *
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lisiGreen ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Titre de la galerie"
              disabled={loading}
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lisiGreen ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Description de la galerie"
              disabled={loading}
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>

          <div>
            <label htmlFor="image_path" className="block text-sm font-medium text-gray-700 mb-2">
              URL de l'image *
            </label>
            <input
              type="url"
              id="image_path"
              value={formData.image_path}
              onChange={(e) => handleChange('image_path', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lisiGreen ${
                errors.image_path ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="https://example.com/image.jpg"
              disabled={loading}
            />
            {errors.image_path && <p className="mt-1 text-sm text-red-600">Le chemin de l'image est requis</p>}
            <p className="mt-1 text-sm text-gray-500">
              Entrez l'URL complète de l'image. Exemples valides :
              <br />
              • https://picsum.photos/400/300 (service de test)
              <br />
              • https://via.placeholder.com/400x300 (placeholder)
              <br />
              • https://votre-domaine.com/images/photo.jpg (votre serveur)
              <br />
              <span className="text-red-500">⚠️ Évitez les URLs Google Photos qui nécessitent une authentification</span>
            </p>
          </div>

          <div>
            <label htmlFor="galleriesable_type" className="block text-sm font-medium text-gray-700 mb-2">
              Type d'entité *
            </label>
            <select
              id="galleriesable_type"
              value={formData.galleriesable_type}
              onChange={(e) => {
                handleChange('galleriesable_type', e.target.value);
                // Réinitialiser l'ID quand on change de type
                handleChange('galleriesable_id', 1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lisiGreen"
              disabled={loading}
            >
              {galleriesableTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="galleriesable_id" className="block text-sm font-medium text-gray-700 mb-2">
              Entité associée *
            </label>
            <select
              id="galleriesable_id"
              value={formData.galleriesable_id}
              onChange={(e) => handleChange('galleriesable_id', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lisiGreen"
              disabled={loading}
            >
              {entities[formData.galleriesable_type]?.map((entity) => (
                <option key={entity.id} value={entity.id}>
                  {entity.title_fr || entity.title || entity.name || `ID: ${entity.id}`}
                </option>
              )) || (
                <option value="">Aucune entité disponible</option>
              )}
            </select>
            {formData.galleriesable_type && entities[formData.galleriesable_type]?.length === 0 && (
              <p className="mt-1 text-sm text-yellow-600">
                Aucune entité trouvée pour ce type. Veuillez d'abord créer des entités de ce type.
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-lisiGreen text-white rounded-lg hover:bg-lisiGreen transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Enregistrement...' : (gallery ? 'Modifier' : 'Ajouter')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GalleryForm;