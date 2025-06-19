import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Gallery, CreateGalleryData } from '../services/galleryApi';

interface GalleryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateGalleryData) => void;
  gallery?: Gallery | null;
  loading?: boolean;
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
  { value: "publication", label: "Publication" },
  { value: "axe", label: "Axe de recherche" },
  { value: "formation", label: "Formation" },
  { value: "partnership", label: "Partenariat" }
];

const GalleryForm: React.FC<GalleryFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  gallery,
  loading = false,
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
      // Mapper le type de galerie vers le type attendu par le backend
      const mapGalleryType = (type: string): string => {
        switch (type.toLowerCase()) {
          case 'axes': return 'axe';
          case 'formations': return 'formation';
          case 'partenariats': return 'partnership';
          default: return type.toLowerCase();
        }
      };

      setFormData({
        title: gallery.title,
        description: gallery.description,
        image_path: gallery.image_path,
        galleriesable_type: mapGalleryType(gallery.galleriesable_type),
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
              onChange={(e) => handleChange('galleriesable_type', e.target.value)}
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
              ID de l'entité *
            </label>
            <input
              type="number"
              id="galleriesable_id"
              value={formData.galleriesable_id}
              onChange={(e) => handleChange('galleriesable_id', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lisiGreen"
              placeholder="1"
              disabled={loading}
            />
            <p className="mt-1 text-sm text-gray-500">
              L'ID de l'entité (projet, publication, axe, etc.) à laquelle cette galerie sera associée
            </p>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lisiGreen ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Description de l'image"
              disabled={loading}
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
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