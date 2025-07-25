import React, { useState, useEffect } from 'react';
import {  Camera, Search, Filter, Edit, Trash2, Calendar, Eye, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { galleryApiService, type Gallery, type CreateGalleryData } from '@/services/galleryApi';
import GalleryForm from '@/components/GalleryForm';
import ConfirmModal from '@/components/ConfirmModal';
import api from '@/lib/api';
import { Entity, getEntityName, galleriesableTypes } from '@/utils/entityUtils';
import DashboardPageLayout from "@/components/layout/DashboardPageLayout";

interface Column {
  key: keyof Gallery;
  label: string;
  render?: (value: unknown) => React.ReactNode;
}

interface ApiResponse<T> {
  data: T;
  message: string;
}

const Gallery: React.FC = () => {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [entities, setEntities] = useState<Record<string, Entity[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedGallery, setSelectedGallery] = useState<Gallery | null>(null);
  const [galleryToDelete, setGalleryToDelete] = useState<Gallery | null>(null);
  const [galleryToView, setGalleryToView] = useState<Gallery | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const { toast } = useToast();

  const fetchGalleries = async () => {
    try {
      setIsLoading(true);
      const data = await galleryApiService.getAllGalleries();
      setGalleries(data);
    } catch (error: unknown) {
      console.error('Erreur:', error);
      const errorMessage = error instanceof Error ? error.message : "Impossible de récupérer les galeries";
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Charger les entités pour chaque type
  const fetchEntities = async () => {
    try {
      const entitiesData: Record<string, Entity[]> = {};
  
      // Projets
      try {
        const projectsResponse = await api.get('/projects');
        entitiesData['projet'] = projectsResponse.data.data || projectsResponse.data || [];
      } catch (error) {
        console.warn('[projet] Erreur de chargement:', error);
        entitiesData['projet'] = [];
      }
  
      // Partenariats
      try {
        const partenairesResponse = await api.get('/partenaires');
        entitiesData['Partenariats'] = partenairesResponse.data.data || partenairesResponse.data || [];
      } catch (error) {
        console.warn('[Partenariats] Erreur de chargement:', error);
        entitiesData['Partenariats'] = [];
      }
  
      // Axes de recherche
      try {
        const axesResponse = await api.get('/axes');
        entitiesData['Axes de recherche'] = axesResponse.data.data || axesResponse.data || [];
      } catch (error) {
        console.warn('[Axes de recherche] Erreur de chargement:', error);
        entitiesData['Axes de recherche'] = [];
      }
  
      // Publications
      try {
        const publicationsResponse = await api.get('/publications');
        entitiesData['Publications'] = publicationsResponse.data.data || publicationsResponse.data || [];
      } catch (error) {
        console.warn('[Publications] Erreur de chargement:', error);
        entitiesData['Publications'] = [];
      }
  
      // Prix de distinction
      try {
        const prixDistinctionsResponse = await api.get('/prix-distinctions');
        entitiesData['Prix de distinction'] = prixDistinctionsResponse.data.data || prixDistinctionsResponse.data || [];
      } catch (error) {
        console.warn('[Prix de distinction] Erreur de chargement:', error);
        entitiesData['Prix de distinction'] = [];
      }
      setEntities(entitiesData);
    } catch (error) {
      console.error('[Global] Erreur lors du chargement des entités:', error);
    }
  };

  useEffect(() => {
    fetchGalleries();
    fetchEntities();
  }, []);

  const handleAdd = () => {
    setSelectedGallery(null);
    setIsFormOpen(true);
  };

  const handleEdit = (gallery: Gallery) => {
    setSelectedGallery(gallery);
    setIsFormOpen(true);
  };

  const handleViewDetails = (gallery: Gallery) => {
    setGalleryToView(gallery);
    setIsDetailsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette galerie ?')) return;

    try {
      await galleryApiService.deleteGallery(id);
      toast({
        title: "Succès",
        description: "Galerie supprimée avec succès",
      });
      fetchGalleries();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Impossible de supprimer la galerie";
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!galleryToDelete) return;
    
    try {
      setIsSubmitting(true);
      await galleryApiService.deleteGallery(galleryToDelete.id);
      await fetchGalleries();
      setIsDeleteModalOpen(false);
      setGalleryToDelete(null);
      toast({
        title: "Succès",
        description: "Galerie supprimée avec succès",
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Erreur lors de la suppression de la galerie";
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (data: CreateGalleryData) => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);

      if (selectedGallery) {
        await galleryApiService.updateGallery(selectedGallery.id, data);
        toast({
          title: "Succès",
          description: "Galerie modifiée avec succès",
        });
      } else {
        await galleryApiService.createGallery(data);
        toast({
          title: "Succès",
          description: "Galerie ajoutée avec succès",
        });
      }

      setIsFormOpen(false);
      fetchGalleries();
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { errors?: Record<string, string[]> } } };
        if (axiosError.response?.data?.errors) {
          const validationErrors = axiosError.response.data.errors;
          Object.entries(validationErrors).forEach(([field, messages]) => {
            toast({
              title: "Erreur de validation",
              description: `${field}: ${messages[0]}`,
              variant: "destructive",
            });
          });
        } else {
          toast({
            title: "Erreur",
            description: "Une erreur est survenue",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Erreur",
          description: "Une erreur est survenue",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Fonction pour obtenir le titre multilingue
  const getGalleryTitle = (gallery: Gallery): string => {
    return gallery.title_fr || gallery.title_en || gallery.title_ar || gallery.title || 'Sans titre';
  };

  // Fonction pour obtenir la description multilingue
  const getGalleryDescription = (gallery: Gallery): string => {
    return gallery.description_fr || gallery.description_en || gallery.description_ar || gallery.description || 'Aucune description';
  };

  // Filtrer les galeries
  const filteredGalleries = galleries.filter(gallery => {
    const title = getGalleryTitle(gallery);
    const description = getGalleryDescription(gallery);
    const matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || !filterType || gallery.galleriesable_type === filterType;
    return matchesSearch && matchesType;
  });

  // Statistiques pour les cartes
  const statsCards = [
    {
      title: "Total",
      value: galleries.length,
      icon: Camera,
      iconColor: "text-blue-600"
    },
    ...galleriesableTypes.map((type) => ({
      title: type,
      value: galleries.filter(g => g.galleriesable_type === type).length,
      icon: Camera,
      iconColor: "text-green-600"
    }))
  ];

  // Options de filtre
  const filterOptions = [
    { value: "all", label: "Tous les types" },
    ...galleriesableTypes.map((type) => ({
      value: type,
      label: type
    }))
  ];

  return (
    <DashboardPageLayout
      title="Galeries"
      description="Gérez les galeries d'images du laboratoire"
      icon={Camera}
      iconColor="text-blue-600"
      onAdd={handleAdd}
      addButtonText="Nouvelle galerie"
      showSearch={true}
      searchPlaceholder="Rechercher par titre ou description..."
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
      showFilter={true}
      filterOptions={filterOptions}
      filterValue={filterType}
      onFilterChange={setFilterType}
      statsCards={statsCards}
      showStats={true}
    >
      {/* Liste des galeries */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Liste des galeries ({filteredGalleries.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredGalleries.length === 0 ? (
            <div className="p-12 text-center">
              <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucune galerie trouvée
              </h3>
              <p className="text-gray-600">
                {searchTerm || filterType !== 'all' 
                  ? 'Aucune galerie ne correspond à vos critères de recherche.'
                  : 'Commencez par ajouter votre première galerie.'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredGalleries.map((gallery) => (
                <div key={gallery.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative h-48">
                    <img
                      src={gallery.image_path}
                      alt={getGalleryTitle(gallery)}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error('Erreur de chargement image:', gallery.image_path);
                        // Afficher un placeholder en cas d'erreur
                        e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Image+non+disponible';
                        e.currentTarget.className = 'w-full h-full object-cover bg-gray-100';
                      }}
                      onLoad={(e) => {
                        // Remettre la classe normale si l'image se charge correctement
                        e.currentTarget.className = 'w-full h-full object-cover';
                      }}
                    />
                    <div className="absolute top-2 right-2">
                      <Badge variant="secondary" className="bg-white bg-opacity-90 text-blue-600">
                        {gallery.galleriesable_type}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
                      {getGalleryTitle(gallery)}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {getGalleryDescription(gallery)}
                    </p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-sm text-gray-500">
                        Entité: {getEntityName(gallery.galleriesable_type, gallery.galleriesable_id, entities)}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-500 text-sm">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(gallery.created_at).toLocaleDateString("fr-FR")}
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewDetails(gallery)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Voir détails"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(gallery)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setGalleryToDelete(gallery);
                            setIsDeleteModalOpen(true);
                          }}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal du formulaire */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold">
                {selectedGallery ? 'Modifier la galerie' : 'Nouvelle galerie'}
              </h2>
            </div>
            <div className="p-6">
              <GalleryForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleSubmit}
                gallery={selectedGallery}
                loading={isSubmitting}
                entities={entities}
              />
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmation de suppression */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Supprimer la galerie"
        message={`Êtes-vous sûr de vouloir supprimer la galerie "${galleryToDelete ? getGalleryTitle(galleryToDelete) : ''}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        isDangerous={true}
        loading={isSubmitting}
      />

      {/* Modal de détails */}
      {isDetailsModalOpen && galleryToView && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Détails de la galerie</h2>
                <button
                  onClick={() => setIsDetailsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Image */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Image</h3>
                  <div className="relative h-64 rounded-lg overflow-hidden">
                    <img
                      src={galleryToView.image_path}
                      alt={getGalleryTitle(galleryToView)}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Image+non+disponible';
                        e.currentTarget.className = 'w-full h-full object-cover bg-gray-100';
                      }}
                    />
                  </div>
                </div>

                {/* Informations */}
                <div className="space-y-6">
                  {/* Titres multilingues */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Titres</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Français</label>
                        <p className="text-gray-900">{galleryToView.title_fr }</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Anglais</label>
                        <p className="text-gray-900">{galleryToView.title_en }</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Arabe</label>
                        <p className="text-gray-900 text-right" dir="rtl">{galleryToView.title_ar}</p>
                      </div>
                    </div>
                  </div>

                  {/* Descriptions multilingues */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Descriptions</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Français</label>
                        <p className="text-gray-900">{galleryToView.description_fr }</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Anglais</label>
                        <p className="text-gray-900">{galleryToView.description_en }</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Arabe</label>
                        <p className="text-gray-900 text-right" dir="rtl">{galleryToView.description_ar || 'غير محدد'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Informations générales */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Informations générales</h3>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Type d'entité</label>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-600">
                          {galleryToView.galleriesable_type}
                        </Badge>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Entité associée</label>
                        <p className="text-gray-900">
                          {getEntityName(galleryToView.galleriesable_type, galleryToView.galleriesable_id, entities)}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Date de création</label>
                        <p className="text-gray-900">
                          {new Date(galleryToView.created_at).toLocaleDateString("fr-FR", {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">URL de l'image</label>
                        <p className="text-gray-900 text-sm break-all">{galleryToView.image_path}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
                <button
                  onClick={() => {
                    setIsDetailsModalOpen(false);
                    handleEdit(galleryToView);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Modifier
                </button>
                <button
                  onClick={() => setIsDetailsModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardPageLayout>
  );
};

export default Gallery;