import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, FileText, Search, Filter, Download, Eye } from "lucide-react";
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
  const { toast } = useToast();

  const fetchPublications = async () => {
    try {
      setIsLoading(true);
      const response = await api.get<ApiResponse<Publication[]>>('/publications');
      const publicationsData = response.data.data || response.data;
      if (Array.isArray(publicationsData)) {
        setPublications(publicationsData);
      } else {
        setPublications([]);
      }
    } catch (error: unknown) {
      console.error('Erreur:', error);
      const errorMessage = error instanceof Error ? error.message : "Impossible de récupérer les publications";
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

  // Filtrer les publications
  const filteredPublications = publications.filter(pub => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch = (pub.titre_publication_fr && pub.titre_publication_fr.toLowerCase().includes(searchTermLower)) ||
                         (pub.titre_publication_en && pub.titre_publication_en.toLowerCase().includes(searchTermLower)) ||
                         (pub.titre_publication_ar && pub.titre_publication_ar.toLowerCase().includes(searchTermLower)) ||
                         (pub.resume_fr && pub.resume_fr.toLowerCase().includes(searchTermLower)) ||
                         (pub.resume_en && pub.resume_en.toLowerCase().includes(searchTermLower)) ||
                         (pub.resume_ar && pub.resume_ar.toLowerCase().includes(searchTermLower)) ||
                         (pub.reference_complete_fr && pub.reference_complete_fr.toLowerCase().includes(searchTermLower)) ||
                         (pub.reference_complete_en && pub.reference_complete_en.toLowerCase().includes(searchTermLower)) ||
                         (pub.reference_complete_ar && pub.reference_complete_ar.toLowerCase().includes(searchTermLower));
    const matchesType = filterType === 'all' || !filterType || pub.type_publication === filterType;
    return matchesSearch && matchesType;
  });

  const columns: Column[] = [
    { 
      key: 'titre_publication_fr', 
      label: 'Titre (FR)',
      render: (value: string) => (
        <div className="font-medium text-gray-900 max-w-xs truncate" title={value}>
          {value}
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
          <Badge variant={variants[value] || 'outline'}>
            {value}
          </Badge>
        );
      }
    },
    { 
      key: 'date_publication', 
      label: 'Date',
      render: (value: string) => new Date(value).getFullYear()
    }
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
                  placeholder="Rechercher par titre, résumé ou référence..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Tous les types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="article">Article</SelectItem>
                <SelectItem value="conférence">Conférence</SelectItem>
                <SelectItem value="chapitre">Chapitre</SelectItem>
                <SelectItem value="livre">Livre</SelectItem>
                <SelectItem value="rapport">Rapport</SelectItem>
                <SelectItem value="thèse">Thèse</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
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
                  {publications.filter(p => p.type_publication === 'article').length}
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
                  {publications.filter(p => p.type_publication === 'conférence').length}
                </p>
              </div>
              <FileText className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cette année</p>
                <p className="text-2xl font-bold">
                  {publications.filter(p => new Date(p.date_publication).getFullYear() === new Date().getFullYear()).length}
                </p>
              </div>
              <FileText className="w-8 h-8 text-orange-600" />
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
          <DataTable
            columns={columns}
            data={filteredPublications}
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
