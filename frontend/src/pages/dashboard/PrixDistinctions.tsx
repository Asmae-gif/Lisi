import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Award, Search, Filter, Calendar, Users, ExternalLink, Image } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/api";
import DashboardPageLayout from "@/components/layout/DashboardPageLayout";
import PrixDistinctionForm from "@/components/PrixDistinctionForm";
import { PrixDistinction, PrixDistinctionFormData, PrixDistinctionMembre } from "@/types/prixDistinction";

interface Column {
  key: keyof PrixDistinction;
  label: string;
  render?: (value: unknown) => React.ReactNode;
}

interface ApiResponse<T> {
  data: T;
  message: string;
}

export default function PrixDistinctions() {
  const [prixDistinctions, setPrixDistinctions] = useState<PrixDistinction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPrix, setSelectedPrix] = useState<PrixDistinction | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOrganisme, setFilterOrganisme] = useState('all');
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

  const fetchPrixDistinctions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get<ApiResponse<PrixDistinction[]>>('/prix-distinctions');
      const prixData = response.data.data || response.data;
      if (Array.isArray(prixData)) {
        setPrixDistinctions(prixData);
      } else {
        console.warn('Format de données invalide pour les prix:', prixData);
        setPrixDistinctions([]);
      }
    } catch (error: unknown) {
      console.error('Erreur lors du chargement des prix:', error);
      const errorMessage = error instanceof Error ? error.message : "Impossible de récupérer les prix et distinctions";
      setError(errorMessage);
      setPrixDistinctions([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrixDistinctions();
  }, []);

  const handleAdd = () => {
    setSelectedPrix(null);
    setIsFormOpen(true);
  };

  const handleEdit = (prix: PrixDistinction) => {
    setSelectedPrix(prix);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce prix/distinction ?')) return;

    try {
      await api.delete(`/prix-distinctions/${id}`);
      toast({
        title: "Succès",
        description: "Prix/distinction supprimé avec succès",
      });
      fetchPrixDistinctions();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Impossible de supprimer le prix/distinction";
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (data: PrixDistinctionFormData) => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);

      if (selectedPrix) {
        await api.put(`/prix-distinctions/${selectedPrix.id}`, data);
        toast({
          title: "Succès",
          description: "Prix/distinction modifié avec succès",
        });
      } else {
        await api.post('/prix-distinctions', data);
        toast({
          title: "Succès",
          description: "Prix/distinction ajouté avec succès",
        });
      }

      setIsFormOpen(false);
      fetchPrixDistinctions();
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { errors?: Record<string, string[]>, message?: string } } };
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
            description: axiosError.response?.data?.message || "Une erreur est survenue",
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

  // Filtrer les prix avec protection maximale
  const filteredPrix = React.useMemo(() => {
    try {
      if (!Array.isArray(prixDistinctions)) return [];
      
      let filtered = prixDistinctions;
      
      // Filtre par recherche
      if (searchTerm && typeof searchTerm === 'string') {
        const searchLower = searchTerm.toLowerCase();
        filtered = filtered.filter(prix => {
          try {
            if (!prix || typeof prix !== 'object') return false;
            
            const titreFr = String(prix.titre_fr || '').toLowerCase();
            const titreEn = String(prix.titre_en || '').toLowerCase();
            const titreAr = String(prix.titre_ar || '').toLowerCase();
            const descriptionFr = String(prix.description_fr || '').toLowerCase();
            const descriptionEn = String(prix.description_en || '').toLowerCase();
            const descriptionAr = String(prix.description_ar || '').toLowerCase();
            const organisme = String(prix.organisme || '').toLowerCase();
            
            return titreFr.includes(searchLower) || 
                   titreEn.includes(searchLower) || 
                   titreAr.includes(searchLower) ||
                   descriptionFr.includes(searchLower) ||
                   descriptionEn.includes(searchLower) ||
                   descriptionAr.includes(searchLower) ||
                   organisme.includes(searchLower);
          } catch (filterError) {
            console.error('Erreur dans le filtre pour un prix:', filterError);
            return false;
          }
        });
      }
      
      // Filtre par organisme
      if (filterOrganisme !== 'all') {
        filtered = filtered.filter(prix => prix.organisme === filterOrganisme);
      }
      
      return filtered;
    } catch (memoError) {
      console.error('Erreur dans le useMemo du filtre:', memoError);
      return [];
    }
  }, [prixDistinctions, searchTerm, filterOrganisme]);

  // Gestion d'erreur
  if (error || hasError) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Award className="w-8 h-8 text-yellow-600" />
              Prix et Distinctions
            </h1>
            <p className="text-gray-600 mt-1">
              Gérez les prix et distinctions obtenus par les membres du laboratoire
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
                <Button onClick={fetchPrixDistinctions} className="bg-blue-600 hover:bg-blue-700">
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

  const columns: Column[] = [
    { 
      key: 'titre_fr', 
      label: 'Titre du prix',
      render: (value: string) => (
        <div className="font-medium text-gray-900 w-32">
          <div className="truncate" title={String(value || '')}>
            {String(value || '')}
          </div>
        </div>
      )
    },
    { 
      key: 'organisme', 
      label: 'Organisme',
      render: (value: string) => (
        <div className="text-gray-900 w-28">
          <div className="truncate" title={String(value || 'N/A')}>
            {String(value || 'N/A')}
          </div>
        </div>
      )
    },
    { 
      key: 'membres', 
      label: 'Membres',
      render: (membres?: PrixDistinctionMembre[]) => (
        <div className="w-36">
          {membres && membres.length > 0 ? (
            <div className="flex flex-wrap gap-1">
              {membres.slice(0, 1).map(membre => (
                <Badge key={membre.id} variant="outline" className="text-xs">
                  {membre.prenom} {membre.nom}
                </Badge>
              ))}
              {membres.length > 1 && (
                <Badge variant="outline" className="text-xs">
                  +{membres.length - 1}
                </Badge>
              )}
            </div>
          ) : (
            <span className="text-gray-400 text-sm">Aucun membre</span>
          )}
        </div>
      )
    },
    { 
      key: 'date_obtention', 
      label: 'Date d\'obtention',
      render: (value: string) => {
        try {
          return (
            <div className="w-24 text-sm">
              {new Date(String(value || '')).toLocaleDateString('fr-FR')}
            </div>
          );
        } catch (error) {
          return <span className="text-gray-400 text-sm">-</span>;
        }
      }
    },
    { 
      key: 'image_url', 
      label: 'Image',
      render: (value: string) => {
        if (!value) return <span className="text-gray-400 text-sm">-</span>;
        
        return (
          <div className="w-16">
            <div className="flex items-center gap-1">
              <Image className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <a 
                href={String(value)} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-600 hover:underline text-sm truncate"
              >
                Voir
              </a>
            </div>
          </div>
        );
      }
    },
    { 
      key: 'lien_externe', 
      label: 'Lien externe',
      render: (value: string) => {
        if (!value) return <span className="text-gray-400 text-sm">-</span>;
        
        return (
          <div className="w-16">
            <div className="flex items-center gap-1">
              <ExternalLink className="w-4 h-4 text-green-600 flex-shrink-0" />
              <a 
                href={String(value)} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-green-600 hover:underline text-sm truncate"
              >
                Lien
              </a>
            </div>
          </div>
        );
      }
    }
  ];

  // Options de filtre pour l'organisme
  const organismeFilterOptions = [
    { value: "all", label: "Tous les organismes" },
    ...Array.from(new Set(prixDistinctions.map(p => p.organisme).filter(Boolean))).map(org => ({
      value: String(org),
      label: String(org)
    }))
  ];

  return (
    <DashboardPageLayout
      title="Prix et Distinctions"
      description="Gérez les prix et distinctions obtenus par les membres du laboratoire"
      icon={Award}
      iconColor="text-yellow-600"
      onAdd={handleAdd}
      addButtonText="Nouveau prix"
      addButtonClassName="bg-yellow-600 hover:bg-yellow-700"
      showSearch={true}
      searchPlaceholder="Rechercher par titre, description ou organisme..."
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
      showFilter={true}
      filterOptions={organismeFilterOptions}
      filterValue={filterOrganisme}
      onFilterChange={setFilterOrganisme}
      statsCards={[
        {
          title: "Total prix",
          value: prixDistinctions.length,
          icon: Award,
          iconColor: "text-yellow-600"
        },
        {
          title: "Organismes",
          value: new Set(prixDistinctions.map(p => p.organisme).filter(Boolean)).size,
          icon: Award,
          iconColor: "text-blue-600"
        },
        {
          title: "Avec image",
          value: prixDistinctions.filter(p => p && p.image_url).length,
          icon: Image,
          iconColor: "text-green-600"
        },
        {
          title: "Cette année",
          value: prixDistinctions.filter(p => {
            if (!p || !p.date_obtention) return false;
            try {
              return new Date(p.date_obtention).getFullYear() === new Date().getFullYear();
            } catch {
              return false;
            }
          }).length,
          icon: Calendar,
          iconColor: "text-purple-600"
        }
      ]}
      showStats={true}
    >
      {/* Tableau des prix */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Liste des prix et distinctions ({filteredPrix.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600 mx-auto mb-2"></div>
                <span className="text-gray-500">Chargement des prix et distinctions...</span>
              </div>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={filteredPrix}
              isLoading={false}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleEdit}
            />
          )}
        </CardContent>
      </Card>

      {/* Modal du formulaire */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold">
                {selectedPrix ? 'Modifier le prix/distinction' : 'Nouveau prix/distinction'}
              </h2>
            </div>
            <div className="p-6">
              <PrixDistinctionForm
                prix={selectedPrix}
                onSave={() => {
                  setIsFormOpen(false);
                  setSelectedPrix(null);
                  fetchPrixDistinctions();
                }}
                onCancel={() => {
                  setIsFormOpen(false);
                  setSelectedPrix(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </DashboardPageLayout>
  );
} 