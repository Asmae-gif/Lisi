import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Brain, Search, Filter } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/api";
import { AxeForm } from "./AxeForm";
import { AxeDetailsModal } from "./AxeDetailsModal";

interface Axe {
  id: number;
  slug: string;
  title_fr: string;
  title_en: string;
  title_ar: string;
  icon: string;
  problematique_fr: string;
  problematique_en: string;
  problematique_ar: string;
  objectif_fr: string;
  objectif_en: string;
  objectif_ar: string;
  approche_fr: string;
  approche_en: string;
  approche_ar: string;
  resultats_attendus_fr: string;
  resultats_attendus_en: string;
  resultats_attendus_ar: string;
  created_at: string;
  updated_at: string;
}

interface Column {
  key: keyof Axe;
  label: string;
  render?: (value: unknown) => React.ReactNode;
}

interface ApiResponse<T> {
  data: T;
  message: string;
}

export default function AxesDashboard() {
  const [axes, setAxes] = useState<Axe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedAxe, setSelectedAxe] = useState<Axe | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterIcon, setFilterIcon] = useState('all');
  const { toast } = useToast();

  const getAxes = async () => {
    try {
      setIsLoading(true);
      const response = await api.get<ApiResponse<Axe[]>>('/axes');
      const axesData = response.data.data || response.data;
      if (Array.isArray(axesData)) {
        setAxes(axesData);
      } else {
        setAxes([]);
      }
    } catch (error: unknown) {
      console.error('Erreur:', error);
      const errorMessage = error instanceof Error ? error.message : "Impossible de récupérer les axes";
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
    getAxes();
  }, []);

  const handleAdd = () => {
    setSelectedAxe(null);
    setIsFormOpen(true);
  };

  const handleEdit = (axe: Axe) => {
    setSelectedAxe(axe);
    setIsFormOpen(true);
  };

  const handleView = (axe: Axe) => {
    setSelectedAxe(axe);
    setIsDetailsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet axe ?')) return;

    try {
      await api.delete(`/admin/axes/${id}`);
      toast({
        title: "Succès",
        description: "Axe supprimé avec succès",
      });
      setAxes(prev => prev.filter(axe => axe.id !== id));
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Impossible de supprimer l'axe";
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (data: Record<string, unknown>) => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);

      if (selectedAxe) {
        const response = await api.put(`/admin/axes/${selectedAxe.id}`, data);
        const updatedAxe = response.data.data || response.data;
        
        setAxes(prev => prev.map(axe => axe.id === selectedAxe.id ? updatedAxe : axe));
        
        toast({
          title: "Succès",
          description: "Axe modifié avec succès",
        });
      } else {
        const response = await api.post('/admin/axes', data);
        const newAxe = response.data.data || response.data;
        
        setAxes(prev => [...prev, newAxe]);
        
        toast({
          title: "Succès",
          description: "Axe ajouté avec succès",
        });
      }

      setIsFormOpen(false);
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

  // Filtrer les axes
  const filteredAxes = axes.filter(axe => {
    const matchesSearch = axe.title_fr.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         axe.title_en.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         axe.title_ar.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         axe.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIcon = filterIcon === 'all' || !filterIcon || axe.icon === filterIcon;
    return matchesSearch && matchesIcon;
  });

  const columns: Column[] = [
    { 
      key: 'title_fr', 
      label: 'Titre (FR)',
      render: (value: unknown) => (
        <div className="font-medium text-gray-900 max-w-xs truncate" title={String(value)}>
          {String(value)}
        </div>
      )
    },
    { 
      key: 'icon', 
      label: 'Icône',
      render: (value: unknown) => {
        const iconMap: { [key: string]: string } = {
          'Brain': 'Intelligence Artificielle',
          'Shield': 'Cybersécurité',
          'Network': 'Systèmes',
          'Database': 'Big Data',
          'Smartphone': 'IoT'
        };
        return (
          <Badge variant="outline">
            {iconMap[String(value)] || String(value)}
          </Badge>
        );
      }
    },
    { 
      key: 'created_at', 
      label: 'Date de création',
      render: (value: unknown) => new Date(String(value)).toLocaleDateString("fr-FR")
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* En-tête de la page */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Brain className="w-8 h-8 text-blue-600" />
            Axes de Recherche
          </h1>
          <p className="text-gray-600 mt-1">
            Gérez les axes de recherche du laboratoire
          </p>
        </div>
        <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Nouvel axe
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
                  placeholder="Rechercher par titre ou slug..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterIcon} onValueChange={setFilterIcon}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Toutes les icônes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les icônes</SelectItem>
                <SelectItem value="Brain">Intelligence Artificielle</SelectItem>
                <SelectItem value="Shield">Cybersécurité</SelectItem>
                <SelectItem value="Network">Systèmes</SelectItem>
                <SelectItem value="Database">Big Data</SelectItem>
                <SelectItem value="Smartphone">IoT</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tableau des axes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Liste des axes ({filteredAxes.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={filteredAxes}
            isLoading={isLoading}
            onView={handleView}
            onEdit={handleEdit}
        onDelete={handleDelete}
      />
        </CardContent>
      </Card>

      {/* Modal du formulaire */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-2xl font-bold">
                {selectedAxe ? 'Modifier l\'axe' : 'Nouvel axe'}
              </h2>
            </div>
            <div className="p-6">
      <AxeForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                editingAxe={selectedAxe}
        onSubmit={handleSubmit}
      />
            </div>
          </div>
        </div>
      )}

      {/* Modal de détails */}
      {isDetailsModalOpen && selectedAxe && (
      <AxeDetailsModal
        isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          axe={selectedAxe}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
}