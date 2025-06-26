import React from 'react';
import { X, Calendar, DollarSign, Building2, FileText, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

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

interface ProjectDetailsTableProps {
  project: Project;
  onClose: () => void;
  onAddFinance?: () => void;
  onAddIncube?: () => void;
}

const ProjectDetailsTable: React.FC<ProjectDetailsTableProps> = ({ 
  project, 
  onClose, 
  onAddFinance, 
  onAddIncube 
}) => {
  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      'en_attente': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'en_cours': 'bg-blue-100 text-blue-800 border-blue-200',
      'termine': 'bg-green-100 text-green-800 border-green-200',
      'annule': 'bg-red-100 text-red-800 border-red-200'
    };
    return statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getTypeColor = (type: string) => {
    const typeColors: Record<string, string> = {
      'finance': 'bg-purple-100 text-purple-800 border-purple-200',
      'recherche': 'bg-blue-100 text-blue-800 border-blue-200',
      'developpement': 'bg-green-100 text-green-800 border-green-200',
      'formation': 'bg-orange-100 text-orange-800 border-orange-200',
      'incube': 'bg-indigo-100 text-indigo-800 border-indigo-200'
    };
    return typeColors[type] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Détails du projet</h2>
          <div className="flex gap-2 mt-2">
            <Badge className={getTypeColor(project.type_projet)}>
              {project.type_projet}
            </Badge>
            <Badge className={getStatusColor(project.status)}>
              {project.status}
            </Badge>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      <Separator />

      {/* Informations générales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Informations générales
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom (Français)</label>
              <p className="text-gray-900">{project.name_fr}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom (Anglais)</label>
              <p className="text-gray-900">{project.name_en}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom (Arabe)</label>
              <p className="text-gray-900" dir="rtl">{project.name_ar}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
              <p className="text-gray-900">
                {project.budget ? `${project.budget.toLocaleString('fr-FR')} €` : 'Non défini'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Descriptions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Descriptions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description (Français)</label>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-gray-900 whitespace-pre-wrap">{project.description_fr}</p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description (Anglais)</label>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-gray-900 whitespace-pre-wrap">{project.description_en}</p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description (Arabe)</label>
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-gray-900 whitespace-pre-wrap" dir="rtl">{project.description_ar}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Dates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
              <p className="text-gray-900">{formatDate(project.date_debut)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin</label>
              <p className="text-gray-900">
                {project.date_fin ? formatDate(project.date_fin) : 'Non définie'}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Créé le</label>
              <p className="text-gray-900">{formatDate(project.created_at)}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Modifié le</label>
              <p className="text-gray-900">{formatDate(project.updated_at)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4">
        {project.type_projet === 'finance' && onAddFinance && (
          <Button 
            onClick={onAddFinance}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <DollarSign className="mr-2 h-4 w-4" />
            Ajouter un financement
          </Button>
        )}
        {project.type_projet === 'incube' && onAddIncube && (
          <Button 
            onClick={onAddIncube}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <Building2 className="mr-2 h-4 w-4" />
            Ajouter une incubation
          </Button>
        )}
        <Button variant="outline" onClick={onClose}>
          Fermer
        </Button>
      </div>
    </div>
  );
};

export default ProjectDetailsTable; 