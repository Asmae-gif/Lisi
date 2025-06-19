import React, { useState, useEffect } from 'react';
import { Camera, Calendar, MapPin, Plus, Edit, Trash2, Search ,LucideIcon} from 'lucide-react';
import { galleryApiService, type Gallery, type CreateGalleryData } from '@/services/galleryApi';
import GalleryForm from '@/components/GalleryForm';
import ConfirmModal from '@/components/ConfirmModal';
import { toast } from '@/hooks/use-toast';

// Composant StatsCard réutilisable
const StatsCard = ({ title, value, icon: Icon }: {
  title: string;
  value: [number, string];
  icon: LucideIcon;
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center">
        <div className="rounded-full p-3">
          {Icon && <Icon className="h-6 w-6" />}
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value[0]} {value[1]}</p>
        </div>
      </div>
    </div>
  );
};

const Gallery: React.FC = () => {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('Tous');
  
  // États pour les modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingGallery, setEditingGallery] = useState<Gallery | null>(null);
  const [galleryToDelete, setGalleryToDelete] = useState<Gallery | null>(null);

  const galleriesableTypes = ["Tous", "projet" ,"Formations", "Partenariats","Axes"];


  useEffect(() => {
    loadGalleries();
  }, []);

  const loadGalleries = async () => {
    try {
      setLoading(true);
      const data = await galleryApiService.getGalleries();
      console.log('Données récupérées:', data);
      
      // Debug des URLs d'images
      data.forEach((gallery, index) => {
        console.log(`Image ${index + 1}:`, {
          title: gallery.title,
          image_path: gallery.image_path,
          type: gallery.galleriesable_type
        });
      });
      
      setGalleries(data);
    } catch (error) {
      console.error('Erreur lors du chargement des galeries:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les galeries.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddGallery = async (data: CreateGalleryData) => {
    try {
      setActionLoading(true);
      await galleryApiService.createGallery(data);
      await loadGalleries();
      setIsFormOpen(false);
      toast({
        title: "Succès",
        description: "Galerie ajoutée avec succès.",
      });
    } catch (error) {
      console.error('Erreur lors de l\'ajout:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de l'ajout de la galerie.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditGallery = async (data: CreateGalleryData) => {
    if (!editingGallery) return;
    
    try {
      setActionLoading(true);
      await galleryApiService.updateGallery(editingGallery.id, data);
      await loadGalleries();
      setIsFormOpen(false);
      setEditingGallery(null);
      toast({
        title: "Succès",
        description: "Galerie modifiée avec succès.",
      });
    } catch (error) {
      console.error('Erreur lors de la modification:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la modification de la galerie.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!galleryToDelete) return;
    
    try {
      setActionLoading(true);
      await galleryApiService.deleteGallery(galleryToDelete.id);
      await loadGalleries();
      setIsDeleteModalOpen(false);
      setGalleryToDelete(null);
      toast({
        title: "Succès",
        description: "Galerie supprimée avec succès.",
      });
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression de la galerie.",
        variant: "destructive",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const openEditModal = (gallery: Gallery) => {
    setEditingGallery(gallery);
    setIsFormOpen(true);
  };

  const openDeleteModal = (gallery: Gallery) => {
    setGalleryToDelete(gallery);
    setIsDeleteModalOpen(true);
  };

  const openAddModal = () => {
    setEditingGallery(null);
    setIsFormOpen(true);
  };

  const closeModals = () => {
    setIsFormOpen(false);
    setIsDeleteModalOpen(false);
    setEditingGallery(null);
    setGalleryToDelete(null);
  };

  // Filtrage des galeries
  const filteredGalleries = galleries.filter(gallery => {
    const matchesSearch = gallery.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         gallery.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'Tous' || gallery.galleriesable_type === selectedType;
    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lisiGreen mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des galeries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* En-tête */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                Gestion des Galeries
              </h1>
            </div>
            <button
              onClick={openAddModal}
              className="bg-lisiGreen text-white px-6 py-3 rounded-lg hover:bg-lisiGreen transition-colors flex items-center gap-2 font-medium"
            >
              <Plus className="h-5 w-5" />
              Ajouter une galerie
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard 
            title="Total des galeries" 
            value={[galleries.length, ""]} 
            icon={Camera} 
          />
          
          {galleriesableTypes.slice(1).map((type) => {
            const count = galleries.filter(g => g.galleriesable_type === type).length;
            
            return (
              <StatsCard
                key={type}
                title={type}
                value={[count, ""]}
                icon={MapPin}
              />
            );
          })}
        </div>

        {/* Filtres et recherche */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par titre ou description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-lisiGreen"
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {galleriesableTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedType === type
                      ? 'bg-lisiGreen text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Liste des galeries */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {filteredGalleries.length === 0 ? (
            <div className="p-12 text-center">
              <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucune galerie trouvée
              </h3>
              <p className="text-gray-600">
                {searchTerm || selectedType !== 'Tous' 
                  ? 'Aucune galerie ne correspond à vos critères de recherche.'
                  : 'Commencez par ajouter votre première galerie.'
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 p-6">
              {filteredGalleries.map((gallery) => (
                <div key={gallery.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative h-48">
                    <img
                      src={gallery.image_path}
                      alt={gallery.title}
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
                      <span className="bg-white bg-opacity-90 text-lisiGreen px-2 py-1 rounded text-xs font-medium">
                        {gallery.galleriesable_type}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
                      {gallery.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {gallery.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-500 text-sm">
                        <Calendar className="h-4 w-4 mr-1" />
                        ID: {gallery.galleriesable_id}
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(gallery)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Modifier"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openDeleteModal(gallery)}
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
        </div>
      </div>

      {/* Modals */}
      <GalleryForm
        isOpen={isFormOpen}
        onClose={closeModals}
        onSubmit={editingGallery ? handleEditGallery : handleAddGallery}
        gallery={editingGallery}
        loading={actionLoading}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={closeModals}
        onConfirm={handleDeleteConfirm}
        title="Supprimer la galerie"
        message={`Êtes-vous sûr de vouloir supprimer la galerie "${galleryToDelete?.title}" ? Cette action est irréversible.`}
        confirmText="Supprimer"
        isDangerous={true}
        loading={actionLoading}
      />
    </div>
  );
};

export default Gallery;