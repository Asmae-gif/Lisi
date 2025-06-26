import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, FileText, Search, Filter, Download, Eye, Calendar, Users } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/api";
import PublicationForm from "@/components/PublicationForm";

interface Publication {
  id: number;
  titre_publication_fr: string;
  titre_publication_en: string;
  titre_publication_ar: string;
  resume_fr: string;
  resume_en: string;
  resume_ar: string;
  type_publication: string;
  date_publication: string;
  fichier_pdf_url?: string;
  lien_externe_doi?: string;
  reference_complete_fr: string;
  reference_complete_en: string;
  reference_complete_ar: string;
  auteurs?: Auteur[];
}

interface Auteur {
  id: number;
  nom: string;
  prenom: string;
}

interface Column {
  key: keyof Publication;
  label: string;
  render?: (value: unknown) => React.ReactNode;
}

interface ApiResponse<T> {
  data: T;
  message: string;
}

interface PublicationFormData {
    titre_publication_fr: string;
    titre_publication_en: string;
    titre_publication_ar: string;
    resume_fr: string;
    resume_en: string;
    resume_ar: string;
    type_publication: string;
    date_publication: string;
    fichier_pdf_url?: string;
    lien_externe_doi?: string;
    reference_complete_fr: string;
    reference_complete_en: string;
    reference_complete_ar: string;
}

export default function Publications() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
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

  const fetchPublications = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.get<ApiResponse<Publication[]>>('/publications');
      const publicationsData = response.data.data || response.data;
      if (Array.isArray(publicationsData)) {
        setPublications(publicationsData);
      } else {
        console.warn('Format de données invalide pour les publications:', publicationsData);
        setPublications([]);
      }
    } catch (error: unknown) {
      console.error('Erreur lors du chargement des publications:', error);
      const errorMessage = error instanceof Error ? error.message : "Impossible de récupérer les publications";
      setError(errorMessage);
      setPublications([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPublications();
  }, []);

  const handleAdd = () => {
    setSelectedPublication(null);
    setIsFormOpen(true);
  };

  const handleEdit = (publication: Publication) => {
    setSelectedPublication(publication);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette publication ?')) return;

    try {
      await api.delete(`/publications/${id}`);
      toast({
        title: "Succès",
        description: "Publication supprimée avec succès",
      });
      fetchPublications();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Impossible de supprimer la publication";
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (data: PublicationFormData & { auteurs: number[] }) => {
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);

      if (selectedPublication) {
        await api.put(`/publications/${selectedPublication.id}`, data);
        toast({
          title: "Succès",
          description: "Publication modifiée avec succès",
        });
      } else {
        await api.post('/publications', data);
        toast({
          title: "Succès",
          description: "Publication ajoutée avec succès",
        });
      }

      setIsFormOpen(false);
      fetchPublications();
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

  // Filtrer les publications avec protection maximale
  const filteredPublications = React.useMemo(() => {
    try {
      if (!Array.isArray(publications)) return [];
      if (!searchTerm || typeof searchTerm !== 'string') return publications;
      
      const searchLower = searchTerm.toLowerCase();
      
      return publications.filter(publication => {
        try {
          if (!publication || typeof publication !== 'object') return false;
          
          const titreFr = String(publication.titre_publication_fr || '').toLowerCase();
          const titreEn = String(publication.titre_publication_en || '').toLowerCase();
          const titreAr = String(publication.titre_publication_ar || '').toLowerCase();
          const resumeFr = String(publication.resume_fr || '').toLowerCase();
          const resumeEn = String(publication.resume_en || '').toLowerCase();
          const resumeAr = String(publication.resume_ar || '').toLowerCase();
          
          return titreFr.includes(searchLower) || 
                 titreEn.includes(searchLower) || 
                 titreAr.includes(searchLower) ||
                 resumeFr.includes(searchLower) ||
                 resumeEn.includes(searchLower) ||
                 resumeAr.includes(searchLower);
        } catch (filterError) {
          console.error('Erreur dans le filtre pour une publication:', filterError);
          return false;
        }
      });
    } catch (memoError) {
      console.error('Erreur dans le useMemo du filtre:', memoError);
      return [];
    }
  }, [publications, searchTerm]);

  // Gestion d'erreur
  if (error || hasError) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <FileText className="w-8 h-8 text-blue-600" />
              Publications
            </h1>
            <p className="text-gray-600 mt-1">
              Gérez les publications scientifiques du laboratoire
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
                <Button onClick={fetchPublications} className="bg-blue-600 hover:bg-blue-700">
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
      key: 'titre_publication_fr', 
      label: 'Titre de la publication',
      render: (value: string) => (
        <div className="font-medium text-gray-900 max-w-xs truncate" title={String(value || '')}>
          {String(value || '')}
        </div>
      )
    },
    { 
      key: 'auteurs', 
      label: 'Auteurs',
      render: (auteurs?: Auteur[]) => (
        <div className="flex flex-wrap gap-1">
          {auteurs?.map(auteur => (
            <Badge key={auteur.id} variant="outline" className="text-xs">
              {auteur.prenom} {auteur.nom}
            </Badge>
          )) || 'Aucun auteur'}
        </div>
      )
    },
    { 
      key: 'type_publication', 
      label: 'Type',
      render: (value: string) => {
        const variants: { [key: string]: 'default' | 'secondary' | 'outline' | 'destructive' } = {
          'article': 'default',
          'conférence': 'secondary',
          'chapitre': 'outline',
          'livre': 'destructive',
          'rapport': 'default',
          'thèse': 'secondary'
        };
        return (
          <Badge variant={variants[String(value)] || 'outline'}>
            {String(value)}
          </Badge>
        );
      }
    },
    { 
      key: 'date_publication', 
      label: 'Date',
      render: (value: string) => {
        try {
          return new Date(String(value || '')).getFullYear();
        } catch (error) {
          return <span className="text-gray-400">-</span>;
        }
      }
    }
  ];

  // Options de filtre pour le type
  const typeFilterOptions = [
    { value: "all", label: "Tous les types" },
    { value: "article", label: "Article" },
    { value: "conférence", label: "Conférence" },
    { value: "chapitre", label: "Chapitre" },
    { value: "livre", label: "Livre" },
    { value: "rapport", label: "Rapport" },
    { value: "thèse", label: "Thèse" }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* En-tête de la page */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-600" />
            Publications
          </h1>
          <p className="text-gray-600 mt-1">
            Gérez les publications scientifiques du laboratoire
          </p>
        </div>
        <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle publication
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
                  placeholder="Rechercher par titre ou résumé..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les types" />
                </SelectTrigger>
                <SelectContent>
                  {typeFilterOptions.map((option) => (
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

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total publications</p>
                <p className="text-2xl font-bold">{publications.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Articles</p>
                <p className="text-2xl font-bold">
                  {publications.filter(p => p && p.type_publication === 'article').length}
                </p>
              </div>
              <FileText className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Conférences</p>
                <p className="text-2xl font-bold">
                  {publications.filter(p => p && p.type_publication === 'conférence').length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cette année</p>
                <p className="text-2xl font-bold">
                  {publications.filter(p => {
                    if (!p || !p.date_publication) return false;
                    try {
                      return new Date(p.date_publication).getFullYear() === new Date().getFullYear();
                    } catch {
                      return false;
                    }
                  }).length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tableau des publications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Liste des publications ({filteredPublications.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <span className="text-gray-500">Chargement des publications...</span>
              </div>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={filteredPublications}
              isLoading={false}
              onEdit={handleEdit}
              onDelete={handleDelete}
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
                {selectedPublication ? 'Modifier la publication' : 'Nouvelle publication'}
              </h2>
            </div>
            <div className="p-6">
              <PublicationForm
                initialData={selectedPublication ? {
                  id: selectedPublication.id,
                  titre_publication_fr: selectedPublication.titre_publication_fr,
                  titre_publication_en: selectedPublication.titre_publication_en,
                  titre_publication_ar: selectedPublication.titre_publication_ar,
                  resume_fr: selectedPublication.resume_fr,
                  resume_en: selectedPublication.resume_en,
                  resume_ar: selectedPublication.resume_ar,
                  type_publication: selectedPublication.type_publication,
                  date_publication: selectedPublication.date_publication,
                  fichier_pdf_url: selectedPublication.fichier_pdf_url,
                  lien_externe_doi: selectedPublication.lien_externe_doi,
                  reference_complete_fr: selectedPublication.reference_complete_fr,
                  reference_complete_en: selectedPublication.reference_complete_en,
                  reference_complete_ar: selectedPublication.reference_complete_ar,
                  auteurs: selectedPublication.auteurs?.map(a => a.id) || []
                } : {}}
                onSubmit={handleSubmit}
                onCancel={() => setIsFormOpen(false)}
                loading={isSubmitting}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 