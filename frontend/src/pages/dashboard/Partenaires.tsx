import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Building2, Search, Filter, ExternalLink, Globe } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";
import { PartenaireForm } from '@/components/partenaire-form';

interface Partenaire {
  id: number;
  nom: string;
  logo: string | null;
  lien: string;
  created_at: string;
  updated_at: string;
}

interface PartenaireFormData {
  nom: string;
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
  const { toast } = useToast();

  const fetchPartenaires = async () => {
    try {
      setIsLoading(true);
      const response = await api.get<ApiResponse<Partenaire[]>>('/partenaires');
      setPartenaires(response.data.data || response.data);
    } catch (error: any) {
      console.error('Erreur:', error);
      toast({
        title: "Erreur",
        description: error.response?.data?.message || "Impossible de récupérer la liste des partenaires",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPartenaires();
  }, []);

  const handleAdd = () => {
    setSelectedPartenaire(null);
    setIsFormOpen(true);
  };

  const handleEdit = (partenaire: Partenaire) => {
    setSelectedPartenaire(partenaire);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce partenaire ?')) return;

    try {
      await api.delete(`/partenaires/${id}`);
      toast({
        title: "Succès",
        description: "Partenaire supprimé avec succès",
      });
      fetchPartenaires();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.response?.data?.message || "Impossible de supprimer le partenaire",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (data: PartenaireFormData) => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);

      if (selectedPartenaire) {
        await api.put(`/partenaires/${selectedPartenaire.id}`, data);
        toast({
          title: "Succès",
          description: "Partenaire modifié avec succès",
        });
      } else {
        await api.post('/partenaires', data);
        toast({
          title: "Succès",
          description: "Partenaire ajouté avec succès",
        });
      }

      setIsFormOpen(false);
      fetchPartenaires();
    } catch (error: any) {
      if (error.response?.data?.errors) {
        const validationErrors = error.response.data.errors;
        Object.entries(validationErrors).forEach(([field, messages]) => {
          toast({
            title: "Erreur de validation",
            description: `${field}: ${(messages as string[])[0]}`,
            variant: "destructive",
          });
        });
      } else {
        toast({
          title: "Erreur",
          description: error.response?.data?.message || "Une erreur est survenue",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtrer les partenaires
  const filteredPartenaires = partenaires.filter(partenaire =>
    partenaire.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
    partenaire.lien.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { 
      key: 'nom' as const, 
      label: 'Nom du partenaire',
      render: (value: string) => (
        <div className="font-medium text-gray-900">
          {value}
        </div>
      )
    },
    { 
      key: 'logo' as const, 
      label: 'Logo',
      render: (value: string | null) => value ? (
        <div className="flex items-center justify-center">
          <img 
            src={value} 
            alt="Logo" 
            className="h-12 w-12 object-contain rounded-lg border bg-white p-1"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              e.currentTarget.nextElementSibling!.style.display = 'flex';
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
      key: 'lien' as const, 
      label: 'Site web',
      render: (value: string) => {
        const domain = value.replace(/^https?:\/\//, '').replace(/^www\./, '');
        return (
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-600" />
            <a 
              href={value} 
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
      key: 'created_at' as const, 
      label: 'Ajouté le',
      render: (value: string) => new Date(value).toLocaleDateString('fr-FR')
    },
    { 
      key: 'actions' as const, 
      label: 'Actions',
      render: (value: any, partenaire: Partenaire) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => window.open(partenaire.lien, '_blank')}
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
      )
    },
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
