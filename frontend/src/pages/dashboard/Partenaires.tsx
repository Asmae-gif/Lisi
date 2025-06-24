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
  const { toast } = useToast();

  const getPartenaires = async () => {
    try {
      setIsLoading(true);
      const response = await api.get<ApiResponse<Partenaire[]>>('/partenaires');
      const partenairesData = response.data.data || response.data;
      if (Array.isArray(partenairesData)) {
        setPartenaires(partenairesData);
      } else {
        setPartenaires([]);
      }
    } catch (error: unknown) {
      console.error('Erreur:', error);
      const errorMessage = error instanceof Error ? error.message : "Impossible de récupérer les partenaires";  
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
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
      await api.delete(`/admin/partenaires/${id}`);
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
        const response = await api.put(`/admin/partenaires/${selectedPartenaire.id}`, data);
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

        if (axiosError.response?.data?.errors) {
          const validationErrors = axiosError.response.data.errors;
          Object.entries(validationErrors).forEach(([field, messages]) => {
            toast({
              title: "Erreur de validation",
              description: `${field}: ${messages[0]}`,
              variant: "destructive",
            });
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
            description: "Une erreur est survenue lors de la création du partenaire",
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

  // Filtrer les partenaires
  const filteredPartenaires = partenaires.filter(partenaire =>
    partenaire.nom_fr.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partenaire.nom_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partenaire.nom_ar.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partenaire.lien.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns: Column<Partenaire>[] = [
    { 
      key: 'nom_fr',
      label: 'Nom du partenaire',
      render: (value) => (
        <div className="font-medium text-gray-900 max-w-xs truncate" title={String(value)}>
          {String(value)}
        </div>
      )
    },
    { 
      key: 'logo',
      label: 'Logo',
      render: (value) => value ? (
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
      ) : (
        <div className="h-12 w-12 bg-gray-100 rounded-lg border flex items-center justify-center text-gray-400 text-xs">
          Pas de logo
        </div>
      )
    },
    { 
      key: 'lien',
      label: 'Site web',
      render: (value) => {
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
      }
    },
    { 
      key: 'created_at',
      label: 'Ajouté le',
      render: (value) => new Date(String(value)).toLocaleDateString('fr-FR')
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
                  {partenaires.filter(p => p.logo).length}
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
                  {partenaires.filter(p => new Date(p.created_at).getFullYear() === new Date().getFullYear()).length}
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
          <DataTable
            columns={columns}
            data={filteredPartenaires}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
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
