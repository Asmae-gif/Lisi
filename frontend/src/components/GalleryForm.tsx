import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Gallery, CreateGalleryData } from '@/services/galleryApi';
import { Entity, getEntityName, galleriesableTypesWithOptions } from '@/utils/entityUtils';

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
  title_fr: string;
  title_en: string;
  title_ar: string;
  description: string;
  description_fr: string;
  description_en: string;
  description_ar: string;
  image_path: string;
  galleriesable_type: string;
  galleriesable_id: number;
}

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
    title_fr: '',
    title_en: '',
    title_ar: '',
    description: '',
    description_fr: '',
    description_en: '',
    description_ar: '',
    image_path: '',
    galleriesable_type: 'projet',
    galleriesable_id: 1,
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});

  useEffect(() => {
    if (gallery) {
      setFormData({
        title: gallery.title || '',
        title_fr: gallery.title_fr || '',
        title_en: gallery.title_en || '',
        title_ar: gallery.title_ar || '',
        description: gallery.description || '',
        description_fr: gallery.description_fr || '',
        description_en: gallery.description_en || '',
        description_ar: gallery.description_ar || '',
        image_path: gallery.image_path,
        galleriesable_type: gallery.galleriesable_type,
        galleriesable_id: gallery.galleriesable_id,
      });
    } else {
      setFormData({
        title: '',
        title_fr: '',
        title_en: '',
        title_ar: '',
        description: '',
        description_fr: '',
        description_en: '',
        description_ar: '',
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
    
    if (!formData.title_fr.trim()) {
      newErrors.title_fr = 'Le titre en français est requis';
    }
    
    if (!formData.image_path.trim()) {
      newErrors.image_path = 'Le chemin de l\'image est requis';
    }
    
    if (!formData.description_fr.trim()) {
      newErrors.description_fr = 'La description en français est requise';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Convertir en CreateGalleryData
    const createData: CreateGalleryData = {
      title: formData.title_fr || formData.title_en || formData.title_ar || '',
      title_fr: formData.title_fr,
      title_en: formData.title_en,
      title_ar: formData.title_ar,
      description: formData.description_fr || formData.description_en || formData.description_ar || '',
      description_fr: formData.description_fr,
      description_en: formData.description_en,
      description_ar: formData.description_ar,
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
          {/* Titre multilingue */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900 border-b pb-2">Titre</h4>
            
            <div>
              <label htmlFor="title_fr" className="block text-sm font-medium text-gray-700 mb-2">
                Titre (Français) *
              </label>
              <input
                type="text"
                id="title_fr"
                value={formData.title_fr}
                onChange={(e) => handleChange('title_fr', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lisiGreen ${
                  errors.title_fr ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Titre de la galerie en français"
                disabled={loading}
              />
              {errors.title_fr && <p className="mt-1 text-sm text-red-600">{errors.title_fr}</p>}
            </div>

            <div>
              <label htmlFor="title_en" className="block text-sm font-medium text-gray-700 mb-2">
                Titre (Anglais)
              </label>
              <input
                type="text"
                id="title_en"
                value={formData.title_en}
                onChange={(e) => handleChange('title_en', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lisiGreen ${
                  errors.title_en ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Gallery title in English"
                disabled={loading}
              />
              {errors.title_en && <p className="mt-1 text-sm text-red-600">{errors.title_en}</p>}
            </div>

            <div>
              <label htmlFor="title_ar" className="block text-sm font-medium text-gray-700 mb-2">
                Titre (Arabe)
              </label>
              <input
                type="text"
                id="title_ar"
                value={formData.title_ar}
                onChange={(e) => handleChange('title_ar', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lisiGreen text-right ${
                  errors.title_ar ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="عنوان المعرض بالعربية"
                dir="rtl"
                disabled={loading}
              />
              {errors.title_ar && <p className="mt-1 text-sm text-red-600">{errors.title_ar}</p>}
            </div>
          </div>

          {/* Description multilingue */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900 border-b pb-2">Description</h4>
            
            <div>
              <label htmlFor="description_fr" className="block text-sm font-medium text-gray-700 mb-2">
                Description (Français) *
              </label>
              <textarea
                id="description_fr"
                value={formData.description_fr}
                onChange={(e) => handleChange('description_fr', e.target.value)}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lisiGreen ${
                  errors.description_fr ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Description de la galerie en français"
                disabled={loading}
              />
              {errors.description_fr && <p className="mt-1 text-sm text-red-600">{errors.description_fr}</p>}
            </div>

            <div>
              <label htmlFor="description_en" className="block text-sm font-medium text-gray-700 mb-2">
                Description (Anglais)
              </label>
              <textarea
                id="description_en"
                value={formData.description_en}
                onChange={(e) => handleChange('description_en', e.target.value)}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lisiGreen ${
                  errors.description_en ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Gallery description in English"
                disabled={loading}
              />
              {errors.description_en && <p className="mt-1 text-sm text-red-600">{errors.description_en}</p>}
            </div>

            <div>
              <label htmlFor="description_ar" className="block text-sm font-medium text-gray-700 mb-2">
                Description (Arabe)
              </label>
              <textarea
                id="description_ar"
                value={formData.description_ar}
                onChange={(e) => handleChange('description_ar', e.target.value)}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-lisiGreen text-right ${
                  errors.description_ar ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="وصف المعرض بالعربية"
                dir="rtl"
                disabled={loading}
              />
              {errors.description_ar && <p className="mt-1 text-sm text-red-600">{errors.description_ar}</p>}
            </div>
          </div>

          {/* Champs hérités pour compatibilité */}
          <div className="hidden">
            <input
              type="text"
              value={formData.title_fr || formData.title_en || formData.title_ar || ''}
              onChange={(e) => handleChange('title', e.target.value)}
            />
            <textarea
              value={formData.description_fr || formData.description_en || formData.description_ar || ''}
              onChange={(e) => handleChange('description', e.target.value)}
            />
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
              {galleriesableTypesWithOptions.map((type) => (
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
                  {getEntityName(formData.galleriesable_type, entity.id, entities)}
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