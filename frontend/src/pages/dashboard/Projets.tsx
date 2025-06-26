import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, FolderKanban, Search, Filter, DollarSign, Building2, Edit, Trash2, Eye, Calendar } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/api";
import DashboardPageLayout from "@/components/layout/DashboardPageLayout";
import ProjectForm from '@/components/ProjectForm';
import ProjectFinanceForm from '@/components/ProjectFinanceForm';
import ProjectIncubeForm from '@/components/ProjectIncubeForm';
import ProjectDetailsTable from '@/components/ProjectDetailsTable';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

// Import de l'interface Column du DataTable
type Column<T> = {
  key: keyof T;
  label: string;
  render?: (value: unknown) => React.ReactNode;
};

interface Project {
  id: number;
  name_fr: string;
  name_en: string;
  name_ar: string;
  description_fr: string;
  description_en: string;
  description_ar: string;
  type_projet: string;
  status: string;
  date_debut: string;
  date_fin?: string;
  budget?: number;
  created_at: string;
  updated_at: string;
}

interface ApiResponse<T> {
  data: T;
  message: string;
}

const Projets: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [filterStatus, setFilterStatus] = useState('all');
    const { toast } = useToast();

    // États pour les modales de financement et d'incubation
    const [isFinanceFormOpen, setIsFinanceFormOpen] = useState(false);
    const [isIncubeFormOpen, setIsIncubeFormOpen] = useState(false);
    const [selectedProjectForDetails, setSelectedProjectForDetails] = useState<Project | null>(null);
    const [isDetailsViewOpen, setIsDetailsViewOpen] = useState(false);

    const fetchProjects = async () => {
        try {
            setIsLoading(true);
            const response = await api.get<ApiResponse<Project[]>>('/projects');
            const projectsData = response.data.data || response.data;
            if (Array.isArray(projectsData)) {
                setProjects(projectsData);
            } else {
                setProjects([]);
            }
        } catch (error: unknown) {
            console.error('Erreur:', error);
            const errorMessage = error instanceof Error ? error.message : "Impossible de récupérer les projets";
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
        fetchProjects();
    }, []);

    const handleAdd = () => {
        setSelectedProject(null);
        setIsFormOpen(true);
    };

    const handleEdit = (project: Project) => {
        setSelectedProject(project);
        setIsFormOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) return;

        try {
            await api.delete(`/projects/${id}`);
            toast({
                title: "Succès",
                description: "Projet supprimé avec succès",
            });
            fetchProjects();
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Impossible de supprimer le projet";
            toast({
                title: "Erreur",
                description: errorMessage,
                variant: "destructive",
            });
        }
    };

    const handleFormSuccess = () => {
        setIsFormOpen(false);
        setSelectedProject(null);
        fetchProjects();
    };

    const handleFormCancel = () => {
        setIsFormOpen(false);
        setSelectedProject(null);
    };

    // Fonction pour voir les détails du projet
    const handleViewDetails = (project: Project) => {
        setSelectedProjectForDetails(project);
        setIsDetailsViewOpen(true);
    };

    // Fonctions pour gérer les financements et incubations
    const handleAddFinance = (project: Project) => {
        setSelectedProjectForDetails(project);
        setIsFinanceFormOpen(true);
    };

    const handleAddIncube = (project: Project) => {
        setSelectedProjectForDetails(project);
        setIsIncubeFormOpen(true);
    };

    const handleFinanceSuccess = () => {
        setIsFinanceFormOpen(false);
        setSelectedProjectForDetails(null);
        fetchProjects();
        toast({
            title: "Succès",
            description: "Financement ajouté avec succès",
        });
    };

    const handleIncubeSuccess = () => {
        setIsIncubeFormOpen(false);
        setSelectedProjectForDetails(null);
        fetchProjects();
        toast({
            title: "Succès",
            description: "Incubation ajoutée avec succès",
        });
    };

    const handleFinanceCancel = () => {
        setIsFinanceFormOpen(false);
        setSelectedProjectForDetails(null);
    };

    const handleIncubeCancel = () => {
        setIsIncubeFormOpen(false);
        setSelectedProjectForDetails(null);
    };

    // Filtrer les projets
    const filteredProjects = projects.filter(project => {
        const searchTermLower = searchTerm.toLowerCase();
        const matchesSearch = (project.name_fr && project.name_fr.toLowerCase().includes(searchTermLower)) ||
                             (project.name_en && project.name_en.toLowerCase().includes(searchTermLower)) ||
                             (project.name_ar && project.name_ar.toLowerCase().includes(searchTermLower)) ||
                             (project.description_fr && project.description_fr.toLowerCase().includes(searchTermLower)) ||
                             (project.description_en && project.description_en.toLowerCase().includes(searchTermLower)) ||
                             (project.description_ar && project.description_ar.toLowerCase().includes(searchTermLower));
        const matchesType = filterType === 'all' || project.type_projet === filterType;
        const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
        return matchesSearch && matchesType && matchesStatus;
    });

    const columns: Column<Project>[] = [
        { 
            key: 'name_fr', 
            label: 'Nom du projet',
            render: (value: string) => (
                <div className="font-medium text-gray-900 max-w-xs truncate" title={value}>
                    {value}
                </div>
            )
        },
        { 
            key: 'type_projet', 
            label: 'Type',
            render: (value: string) => {
                const typeColors: { [key: string]: string } = {
                    'finance': 'bg-blue-100 text-blue-800 border-blue-200',
                    'recherche': 'bg-purple-100 text-purple-800 border-purple-200',
                    'developpement': 'bg-green-100 text-green-800 border-green-200',
                    'formation': 'bg-orange-100 text-orange-800 border-orange-200',
                    'incube': 'bg-indigo-100 text-indigo-800 border-indigo-200'
                };
                return (
                    <Badge className={`${typeColors[value] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                        {value}
                    </Badge>
                );
            }
        },
        { 
            key: 'status', 
            label: 'Statut',
            render: (value: string) => {
                const statusColors: { [key: string]: string } = {
                    'en_attente': 'bg-yellow-100 text-yellow-800 border-yellow-200',
                    'en_cours': 'bg-blue-100 text-blue-800 border-blue-200',
                    'termine': 'bg-green-100 text-green-800 border-green-200',
                    'annule': 'bg-red-100 text-red-800 border-red-200'
                };
                return (
                    <Badge className={`${statusColors[value] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                        {value}
                    </Badge>
                );
            }
        },
        { 
            key: 'date_debut', 
            label: 'Date début',
            render: (value: string) => new Date(value).toLocaleDateString('fr-FR')
        },
        { 
            key: 'date_fin', 
            label: 'Date de fin',
            render: (value: string) => value ? new Date(value).toLocaleDateString('fr-FR') : '-'
        },
        {
            key: 'id',
            label: 'Actions',
            render: (value: number, project: Project) => (
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewDetails(project)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Voir détails"
                    >
                        <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(project)}
                        className="text-green-600 hover:text-green-800"
                        title="Modifier"
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(project.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Supprimer"
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            )
        }
    ];

    // Statistiques pour les cartes
    const statsCards = [
        {
            title: "Total",
            value: projects.length,
            icon: FolderKanban,
            iconColor: "text-blue-600"
        },
        {
            title: "En cours",
            value: projects.filter(p => p.status === 'en_cours').length,
            icon: FolderKanban,
            iconColor: "text-green-600"
        },
        {
            title: "Terminés",
            value: projects.filter(p => p.status === 'termine').length,
            icon: FolderKanban,
            iconColor: "text-purple-600"
        },
        {
            title: "Cette année",
            value: projects.filter(p => new Date(p.date_debut).getFullYear() === new Date().getFullYear()).length,
            icon: FolderKanban,
            iconColor: "text-orange-600"
        }
    ];

    // Options de filtre
    const typeFilterOptions = [
        { value: "all", label: "Tous les types" },
        { value: "finance", label: "Finance" },
        { value: "recherche", label: "Recherche" },
        { value: "developpement", label: "Développement" },
        { value: "formation", label: "Formation" },
        { value: "incube", label: "Incubation" }
    ];

    const statusFilterOptions = [
        { value: "all", label: "Tous les statuts" },
        { value: "en_attente", label: "En attente" },
        { value: "en_cours", label: "En cours" },
        { value: "termine", label: "Terminé" },
        { value: "annule", label: "Annulé" }
    ];

    return (
        <DashboardPageLayout
            title="Projets"
            description="Gérez les projets de recherche et développement du laboratoire"
            icon={FolderKanban}
            iconColor="text-blue-600"
            onAdd={handleAdd}
            addButtonText="Nouveau projet"
            showSearch={true}
            searchPlaceholder="Rechercher par nom ou description..."
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            showFilter={true}
            filterOptions={typeFilterOptions}
            filterValue={filterType}
            onFilterChange={setFilterType}
            statsCards={statsCards}
            showStats={true}
        >
            {/* Filtre supplémentaire pour le statut */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <Select value={filterStatus} onValueChange={setFilterStatus}>
                                <SelectTrigger className="w-full sm:w-48">
                                    <SelectValue placeholder="Tous les statuts" />
                                </SelectTrigger>
                                <SelectContent>
                                    {statusFilterOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Tableau des projets */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Filter className="w-5 h-5" />
                        Liste des projets ({filteredProjects.length})
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        data={filteredProjects}
                        isLoading={isLoading}
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
                                {selectedProject ? 'Modifier le projet' : 'Nouveau projet'}
                            </h2>
                        </div>
                        <div className="p-6">
                            <ProjectForm
                                projectId={selectedProject?.id}
                                onSuccess={handleFormSuccess}
                                onCancel={handleFormCancel}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Modal des détails du projet */}
            <Dialog open={isDetailsViewOpen} onOpenChange={setIsDetailsViewOpen}>
                <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                    {selectedProjectForDetails && (
                        <ProjectDetailsTable
                            project={selectedProjectForDetails}
                            onClose={() => {
                                setIsDetailsViewOpen(false);
                                setSelectedProjectForDetails(null);
                            }}
                            onAddFinance={() => {
                                setIsDetailsViewOpen(false);
                                handleAddFinance(selectedProjectForDetails);
                            }}
                            onAddIncube={() => {
                                setIsDetailsViewOpen(false);
                                handleAddIncube(selectedProjectForDetails);
                            }}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Modal du formulaire de financement */}
            <Dialog open={isFinanceFormOpen} onOpenChange={setIsFinanceFormOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Ajouter un financement</DialogTitle>
                    </DialogHeader>
                    {selectedProjectForDetails && (
                        <ProjectFinanceForm
                            projectId={selectedProjectForDetails.id}
                            onSuccess={handleFinanceSuccess}
                            onCancel={handleFinanceCancel}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Modal du formulaire d'incubation */}
            <Dialog open={isIncubeFormOpen} onOpenChange={setIsIncubeFormOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Ajouter une incubation</DialogTitle>
                    </DialogHeader>
                    {selectedProjectForDetails && (
                        <ProjectIncubeForm
                            projectId={selectedProjectForDetails.id}
                            onSuccess={handleIncubeSuccess}
                            onCancel={handleIncubeCancel}
                        />
                    )}
                </DialogContent>
            </Dialog>
        </DashboardPageLayout>
    );
};

export default Projets;
