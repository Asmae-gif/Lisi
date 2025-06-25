import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Building2, Search, Filter, ExternalLink, Globe } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/api";
import { PartenaireForm } from '@/components/partenaire-form';

interface Partenaire {
  id: number;
  nom_fr: string;
  nom_en: string;
  nom_ar: string;
  logo: string | null;
  lien: string;
  created_at: string;
  updated_at: string;
}

interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: unknown) => React.ReactNode;
}

interface PartenaireFormData {
  nom_fr: string;
  nom_en: string;
  nom_ar: string;
  logo: string;
  lien: string;
}

interface ApiResponse<T> {
  data: T;
  message: string;
}

export default function Partenaires() {
  const [partenaires, setPartenaires] = useState<Partenaire[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPartenaire, setSelectedPartenaire] = useState<Partenaire | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const { toast } = useToast();

  // Gestion d'erreur globale
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('Erreur JavaScript capturée:', event.error);
      setHasError(true);
      setError('Une erreur JavaScript est survenue. Veuillez recharger la page.');
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  const getPartenaires = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get<ApiResponse<Partenaire[]>>('/partenaires');
      const partenairesData = response.data.data || response.data;
      if (Array.isArray(partenairesData)) {
        setPartenaires(partenairesData);
      } else {
        console.warn('Format de données invalide pour les partenaires:', partenairesData);
        setPartenaires([]);
      }
    } catch (error: unknown) {
      console.error('Erreur lors du chargement des partenaires:', error);
      const errorMessage = error instanceof Error ? error.message : "Impossible de récupérer les partenaires";  
      setError(errorMessage);
      setPartenaires([]);
    } finally {
      setIsLoading(false);
    }
  };
  

  useEffect(() => {
    getPartenaires();
  }, []);

  const handleAdd = () => {
    setSelectedPartenaire(null);
    setIsFormOpen(true);
  };

  const handleEdit = (partenaire: Partenaire) => {
    setSelectedPartenaire(partenaire);
    setIsFormOpen(true);
  };
  const handleView = (partenaire: Partenaire) => {
    setSelectedPartenaire(partenaire);
    setIsDetailsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce partenaire ?')) return;

    try {
      await api.delete(`/partenaires/${id}`);
      toast({
        title: "Succès",
        description: "Partenaire supprimé avec succès",
      });
      getPartenaires();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Impossible de supprimer le partenaire";
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (data: PartenaireFormData) => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);
      console.log('Données envoyées:', data);
    
      if (selectedPartenaire) {
        const response = await api.put(`/partenaires/${selectedPartenaire.id}`, data);
        console.log('Réponse de modification:', response);
        const updatedPartenaire = response.data.data || response.data;
    
        setPartenaires(prev =>
          prev.map(p => p.id === selectedPartenaire.id ? updatedPartenaire : p)
        );
    
        toast({
          title: "Succès",
          description: "Partenaire modifié avec succès",
        });
      } else {
        const response = await api.post('/partenaires', data);
        console.log('Réponse de création:', response);
        const newPartenaire = response.data.data || response.data;
    
        setPartenaires(prev => [...prev, newPartenaire]);
    
        toast({
          title: "Succès",
          description: "Partenaire ajouté avec succès",
        });
      }
    
      setIsFormOpen(false);
    } catch (error: unknown) {
      console.error('Erreur complète:', error);
      
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { 
          response?: { 
            data?: { 
              errors?: Record<string, string[]>,
              message?: string 
            },
            status?: number
          } 
        };
        
        console.error('Détails de l\'erreur:', {
          status: axiosError.response?.status,
          data: axiosError.response?.data
        });

        if (axiosError.response?.status === 422) {
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
              title: "Erreur de validation",
              description: "Veuillez vérifier les données saisies",
              variant: "destructive",
            });
          }
        } else if (axiosError.response?.status === 500) {
          toast({
            title: "Erreur serveur",
            description: "Une erreur est survenue côté serveur. Veuillez réessayer.",
            variant: "destructive",
          });
        } else if (axiosError.response?.data?.message) {
          toast({
            title: "Erreur",
            description: axiosError.response.data.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Erreur",
            description: "Une erreur est survenue lors de la sauvegarde du partenaire",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Erreur",
          description: "Une erreur inattendue est survenue",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtrer les partenaires avec protection maximale
  const filteredPartenaires = React.useMemo(() => {
    try {
      if (!Array.isArray(partenaires)) return [];
      if (!searchTerm || typeof searchTerm !== 'string') return partenaires;
      
      const searchLower = searchTerm.toLowerCase();
      
      return partenaires.filter(partenaire => {
        try {
          if (!partenaire || typeof partenaire !== 'object') return false;
          
          const nomFr = String(partenaire.nom_fr || '').toLowerCase();
          const nomEn = String(partenaire.nom_en || '').toLowerCase();
          const nomAr = String(partenaire.nom_ar || '').toLowerCase();
          const lien = String(partenaire.lien || '').toLowerCase();
          
          return nomFr.includes(searchLower) || 
                 nomEn.includes(searchLower) || 
                 nomAr.includes(searchLower) || 
                 lien.includes(searchLower);
        } catch (filterError) {
          console.error('Erreur dans le filtre pour un partenaire:', filterError);
          return false;
        }
      });
    } catch (memoError) {
      console.error('Erreur dans le useMemo du filtre:', memoError);
      return [];
    }
  }, [partenaires, searchTerm]);

  // Gestion d'erreur
  if (error || hasError) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Building2 className="w-8 h-8 text-green-600" />
              Partenaires
            </h1>
            <p className="text-gray-600 mt-1">
              Gérez les partenaires institutionnels et industriels du laboratoire
            </p>
          </div>
        </div>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Erreur de chargement</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <div className="flex gap-2 justify-center">
                <Button onClick={getPartenaires} className="bg-blue-600 hover:bg-blue-700">
                  Réessayer
                </Button>
                <Button onClick={() => window.location.reload()} variant="outline">
                  Recharger la page
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const columns: Column<Partenaire>[] = [
    { 
      key: 'nom_fr',
      label: 'Nom du partenaire',
      render: (value) => (
        <div className="font-medium text-gray-900 max-w-xs truncate" title={String(value || '')}>
          {String(value || '')}
        </div>
      )
    },
    { 
      key: 'logo',
      label: 'Logo',
      render: (value) => {
        if (!value) {
          return (
            <div className="h-12 w-12 bg-gray-100 rounded-lg border flex items-center justify-center text-gray-400 text-xs">
              Pas de logo
            </div>
          );
        }
        
        return (
          <div className="flex items-center justify-center">
            <img 
              src={String(value)} 
              alt="Logo" 
              className="h-12 w-12 object-contain rounded-lg border bg-white p-1"
              onError={(e) => {
                const target = e.currentTarget as HTMLImageElement;
                target.style.display = 'none';
                const nextSibling = target.nextElementSibling as HTMLElement;
                if (nextSibling) {
                  nextSibling.style.display = 'flex';
                }
              }}
            />
            <div className="h-12 w-12 bg-gray-100 rounded-lg border flex items-center justify-center text-gray-400 text-xs" style={{display: 'none'}}>
              Logo
            </div>
          </div>
        );
      }
    },
    { 
      key: 'lien',
      label: 'Site web',
      render: (value) => {
        if (!value) return <span className="text-gray-400">-</span>;
        
        try {
          const domain = String(value).replace(/^https?:\/\//, '').replace(/^www\./, '');
          return (
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-600" />
              <a 
                href={String(value)} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 hover:underline text-sm"
              >
                {domain}
              </a>
            </div>
          );
        } catch (error) {
          return <span className="text-gray-400">URL invalide</span>;
        }
      }
    },
    { 
      key: 'created_at',
      label: 'Ajouté le',
      render: (value) => {
        try {
          return new Date(String(value || '')).toLocaleDateString('fr-FR');
        } catch (error) {
          return <span className="text-gray-400">-</span>;
        }
      }
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* En-tête de la page */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Building2 className="w-8 h-8 text-green-600" />
            Partenaires
          </h1>
          <p className="text-gray-600 mt-1">
            Gérez les partenaires institutionnels et industriels du laboratoire
          </p>
        </div>
        <Button onClick={handleAdd} className="bg-green-600 hover:bg-green-700">
          <Plus className="mr-2 h-4 w-4" />
          Nouveau partenaire
        </Button>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Rechercher par nom ou site web..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total partenaires</p>
                <p className="text-2xl font-bold">{partenaires.length}</p>
              </div>
              <Building2 className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avec logo</p>
                <p className="text-2xl font-bold">
                  {partenaires.filter(p => p && p.logo).length}
                </p>
              </div>
              <Globe className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cette année</p>
                <p className="text-2xl font-bold">
                  {partenaires.filter(p => {
                    if (!p || !p.created_at) return false;
                    try {
                      return new Date(p.created_at).getFullYear() === new Date().getFullYear();
                    } catch {
                      return false;
                    }
                  }).length}
                </p>
              </div>
              <Building2 className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tableau des partenaires */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Liste des partenaires ({filteredPartenaires.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <span className="text-gray-500">Chargement des partenaires...</span>
              </div>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={filteredPartenaires}
              isLoading={false}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </CardContent>
      </Card>

      {/* Modal du formulaire */}
      {isFormOpen && (
        <PartenaireForm
          partenaire={selectedPartenaire}
          onSubmit={handleSubmit}
          onClose={() => setIsFormOpen(false)}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  );
}
