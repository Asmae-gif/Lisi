import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { X, ChevronLeft, ChevronRight, Camera, Calendar, MapPin } from 'lucide-react';
import { galleryApiService, Gallery as GalleryType } from '../services/galleryApi';
import { toast } from '@/hooks/use-toast';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [galleryImages, setGalleryImages] = useState<GalleryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('Tous');

  const galleriesableTypes = ["Tous", "projet" ,"Formations", "Partenariats","Axes"];

  useEffect(() => {
    loadGalleryImages();
  }, []);

  const loadGalleryImages = async () => {
    try {
      setLoading(true);
      // Récupérer toutes les galeries sans filtrage obligatoire
      const images = await galleryApiService.getGalleries();
      setGalleryImages(images);
    } catch (error) {
      console.error('Erreur lors du chargement des images:', error);
      setGalleryImages([]);
      toast({
        title: "Erreur",
        description: "Impossible de charger les images de la galerie.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredImages = selectedType === "Tous" 
    ? galleryImages 
    : galleryImages.filter(img => img.galleriesable_type === selectedType);

  const openModal = (index: number) => {
    setSelectedImage(index);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % filteredImages.length);
    }
  };

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage(selectedImage === 0 ? filteredImages.length - 1 : selectedImage - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lisiGreen mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement de la galerie...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-lisiGreen to-indigo-100 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Galerie
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Découvrez nos installations, projets et moments marquants 
                à travers cette collection d'images
              </p>
            </div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-8 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-4">
              {galleriesableTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    selectedType === type
                      ? 'bg-lisiGreen text-white shadow-lg transform scale-105'
                      : 'bg-white text-gray-700 hover:bg-lisiGreen hover:text-white shadow-md'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {filteredImages.length === 0 ? (
              <div className="text-center py-16">
                <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Aucune image trouvée
                </h3>
                <p className="text-gray-600">
                  Aucune image ne correspond à la catégorie sélectionnée.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredImages.map((image, index) => (
                  <div
                    key={image.id}
                    className="group cursor-pointer overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                    onClick={() => openModal(index)}
                  >
                    <div className="relative">
                      <img
                        src={image.image_path}
                        alt={image.title}
                        className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          console.error('Erreur de chargement image:', image.image_path);
                          // Pas d'image de fallback - laisser vide
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                        <Camera className="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <div className="absolute top-4 right-4">
                        <span className="bg-white bg-opacity-90 text-lisiGreen px-3 py-1 rounded-full text-sm font-medium">
                          {image.galleriesable_type}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 bg-white">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-lisiGreen transition-colors duration-300">
                        {image.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">{image.description}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-2" />
                        {image.created_at ? new Date(image.created_at).toLocaleDateString('fr-FR') : 'Date inconnue'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Modal */}
        {selectedImage !== null && filteredImages[selectedImage] && (
          <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
            <div className="relative max-w-4xl w-full">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-all duration-200"
              >
                <X className="h-6 w-6 text-white" />
              </button>
              
              {filteredImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-all duration-200"
                  >
                    <ChevronLeft className="h-6 w-6 text-white" />
                  </button>
                  
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2 transition-all duration-200"
                  >
                    <ChevronRight className="h-6 w-6 text-white" />
                  </button>
                </>
              )}

              <div className="bg-white rounded-lg overflow-hidden">
                <img
                  src={filteredImages[selectedImage].image_path}
                  alt={filteredImages[selectedImage].title}
                  className="w-full h-96 object-cover"
                  onError={(e) => {
                    console.error('Erreur de chargement image modal:', filteredImages[selectedImage].image_path);
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {filteredImages[selectedImage].title}
                    </h3>
                    <span className="bg-lisiGreen text-white px-3 py-1 rounded-full text-sm font-medium">
                      {filteredImages[selectedImage].galleriesable_type}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-4">
                    {filteredImages[selectedImage].description}
                  </p>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-2" />
                    {filteredImages[selectedImage].created_at ? new Date(filteredImages[selectedImage].created_at).toLocaleDateString('fr-FR') : 'Date inconnue'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Gallery;