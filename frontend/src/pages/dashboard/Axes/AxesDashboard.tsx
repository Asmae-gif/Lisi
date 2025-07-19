import React, { useState, useEffect } from 'react';
import { Brain, Filter } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/api";
import { AxeForm } from "./AxeForm";
import { AxeDetailsModal } from "./AxeDetailsModal";
import DashboardPageLayout from "@/components/layout/DashboardPageLayout";
import { Axe } from '@/types/axe';

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
      const response = await api.get<ApiResponse<Axe[]>>('/admin/axes');
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
          'Smartphone': 'IoT',
          'SatelliteDish': 'Télécommunications',
          'Eye': 'Vision',
          'Mic': 'Traitement de la Parole',
          'MessageCircle': 'Communication',
          'Bot': 'Systèmes Intelligents'
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

  // Options de filtre
  const filterOptions = [
    { value: "all", label: "Toutes les icônes" },
    { value: "Brain", label: "Intelligence Artificielle" },
    { value: "Shield", label: "Cybersécurité" },
    { value: "Network", label: "Systèmes" },
    { value: "Database", label: "Big Data" },
    { value: "Smartphone", label: "IoT" },
    { value: "SatelliteDish", label: "Télécommunications" },
    { value: "Eye", label: "Vision" },
    { value: "Mic", label: "Traitement de la Parole" },
    { value: "MessageCircle", label: "Communication" },
    { value: "Bot", label: "Systèmes Intelligents" }
  ];

  return (
    <DashboardPageLayout
      title="Axes de Recherche"
      description="Gérez les axes de recherche du laboratoire"
      icon={Brain}
      iconColor="text-green-600"
      onAdd={handleAdd}
      addButtonText="Nouvel axe"
      showSearch={true}
      searchPlaceholder="Rechercher par titre ou slug..."
      searchValue={searchTerm}
      onSearchChange={setSearchTerm}
      showFilter={true}
      filterOptions={filterOptions}
      filterValue={filterIcon}
      onFilterChange={setFilterIcon}
      showStats={false}
    >
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
    </DashboardPageLayout>
  );
}