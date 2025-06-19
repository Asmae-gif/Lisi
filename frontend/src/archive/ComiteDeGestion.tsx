import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Users, User, Mail, Phone, Calendar, Award } from 'lucide-react';
import { membreApiService, Membre } from '../services/membreApi';
import { toast } from '@/hooks/use-toast';

const ComiteDeGestion = () => {
  const [membres, setMembres] = useState<Membre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadComiteMembres();
  }, []);

  const loadComiteMembres = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await membreApiService.getComiteMembres();
      console.log('Membres du comité récupérés:', data);
      setMembres(data);
    } catch (error) {
      console.error('Erreur lors du chargement des membres du comité:', error);
      setError('Impossible de charger les membres du comité');
      toast({
        title: "Erreur",
        description: "Impossible de charger les membres du comité.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lisiGreen mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des membres du comité...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Erreur de chargement
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={loadComiteMembres}
              className="bg-lisiGreen text-white px-6 py-3 rounded-lg hover:bg-lisiGreen/90 transition-colors"
            >
              Réessayer
            </button>
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
                Comité de Gestion
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Découvrez les membres de notre comité de gestion qui dirigent 
                et supervisent nos activités et projets
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-8 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-lisiGreen rounded-full mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {membres.length} Membre{membres.length > 1 ? 's' : ''} du Comité
              </h2>
              <p className="text-gray-600">
                Une équipe expérimentée et dédiée à l'excellence
              </p>
            </div>
          </div>
        </section>

        {/* Membres Grid */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {membres.length === 0 ? (
              <div className="text-center py-16">
                <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Aucun membre trouvé
                </h3>
                <p className="text-gray-600">
                  Aucun membre du comité n'est actuellement disponible.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {membres.map((membre) => (
                  <div
                    key={membre.id}
                    className="group bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
                  >
                    {/* Image du membre */}
                    <div className="relative h-64 bg-gradient-to-br from-lisiGreen to-indigo-100">
                      {membre.photo ? (
                        <img
                          src={membre.photo as string}
                          alt={`${membre.prenom} ${membre.nom}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            console.error('Erreur de chargement image:', membre.photo);
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="h-24 w-24 text-white opacity-50" />
                        </div>
                      )}
                      <div className="absolute top-4 right-4">
                        <span className="bg-white bg-opacity-90 text-lisiGreen px-3 py-1 rounded-full text-sm font-medium">
                          <Award className="h-4 w-4 inline mr-1" />
                          Comité
                        </span>
                      </div>
                    </div>

                    {/* Informations du membre */}
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-lisiGreen transition-colors duration-300">
                        {membre.name} {membre.last_name}
                      </h3>
                      
                      <div className="mb-4">
                        <span className="inline-block bg-lisiGreen/10 text-lisiGreen px-3 py-1 rounded-full text-sm font-medium mb-3">
                          {membre.statut}
                        </span>
                      </div>

                      {membre.biographie && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                          {membre.biographie}
                        </p>
                      )}

                      {/* Informations de contact */}
                      <div className="space-y-2">
                        {membre.email && (
                          <div className="flex items-center text-sm text-gray-500">
                            <Mail className="h-4 w-4 mr-2 text-lisiGreen" />
                            <span className="truncate">{membre.email}</span>
                          </div>
                        )}
                        

                        {membre.created_at && (
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-2 text-lisiGreen" />
                            <span>
                              Membre depuis {new Date(membre.created_at).toLocaleDateString('fr-FR')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ComiteDeGestion; 