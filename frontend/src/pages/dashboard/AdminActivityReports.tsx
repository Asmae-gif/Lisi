import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, FileText, Search, Filter, Download, Eye, Calendar, BarChart3 } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useActivityReports } from "@/hooks/useActivityReports";
import { 
  ActivityReport, 
  ActivityReportFormData, 
  Column
} from "@/types/ActivityReportsSettings";

export default function AdminActivityReports() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ActivityReport | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [form, setForm] = useState<ActivityReportFormData>({
    report_date: '',
    pdf: null,
  });

  // Utiliser les hooks personnalisés
  const {
    reports,
    filteredReports,
    availableYears,
    stats,
    isLoading,
    createReport,
    updateReport,
    deleteReport,
    handleView,
    handleDownload
  } = useActivityReports({
    searchTerm,
    filterYear,
    sortOrder
  });

  const handleAdd = () => {
    setSelectedReport(null);
    setForm({
      report_date: '',
      pdf: null,
    });
    setIsFormOpen(true);
  };

  const handleEdit = (report: ActivityReport) => {
    setSelectedReport(report);
    setForm({
      report_date: report.report_date,
      pdf: null,
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce rapport d\'activité ?')) return;
    await deleteReport(id);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm(prev => ({ ...prev, pdf: file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    try {
      setIsSubmitting(true);

      if (selectedReport) {
        await updateReport(selectedReport.id, form);
      } else {
        await createReport(form);
      }

      setIsFormOpen(false);
      setForm({ report_date: '', pdf: null });
    } catch (error) {
      // Les erreurs sont déjà gérées par les hooks
      console.error('Erreur lors de la soumission:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsFormOpen(false);
    setSelectedReport(null);
  };

  const columns: Column[] = [
    { 
      key: 'report_date', 
      label: 'Date du rapport',
      render: (value: unknown) => (
        <div className="font-medium text-gray-900 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-blue-600" />
          {new Date(value as string).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
      )
    },
    { 
      key: 'id', 
      label: 'Année',
      render: (value: unknown, item?: ActivityReport) => (
        <Badge variant="outline" className="font-medium">
          {item ? new Date(item.report_date).getFullYear() : '-'}
        </Badge>
      )
    },
    { 
      key: 'created_at', 
      label: 'Actions PDF',
      render: (value: unknown, item?: ActivityReport) => {
        if (!item) return null;
        
        return (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleView(item)}
              className="flex items-center gap-1"
            >
              <Eye className="w-4 h-4" />
              Voir
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDownload(item)}
              className="flex items-center gap-1"
            >
              <Download className="w-4 h-4" />
              Télécharger
            </Button>
          </div>
        );
      }
    }
  ];

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <span className="text-gray-500">Chargement des rapports d'activité...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* En-tête de la page */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-blue-600" />
            Rapports d'activité
          </h1>
          <p className="text-gray-600 mt-1">
            Gérez les rapports d'activité annuels du laboratoire
          </p>
        </div>
        <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Nouveau rapport
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
                  placeholder="Rechercher par date..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <Select value={filterYear} onValueChange={setFilterYear}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrer par année" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les années</SelectItem>
                  {availableYears.map(year => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-48">
              <Select value={sortOrder} onValueChange={(value: 'asc' | 'desc') => setSortOrder(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Plus récent</SelectItem>
                  <SelectItem value="asc">Plus ancien</SelectItem>
                </SelectContent>
              </Select>
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
                <p className="text-sm text-gray-600">Total rapports</p>
                <p className="text-2xl font-bold">{reports.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cette année</p>
                <p className="text-2xl font-bold">
                  {reports.filter(report => {
                    try {
                      return new Date(report.report_date).getFullYear() === new Date().getFullYear();
                    } catch {
                      return false;
                    }
                  }).length}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Années couvertes</p>
                <p className="text-2xl font-bold">
                  {new Set(reports.map(report => {
                    try {
                      return new Date(report.report_date).getFullYear();
                    } catch {
                      return null;
                    }
                  }).filter(Boolean)).size}
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tableau des rapports */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Liste des rapports d'activité ({filteredReports.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <span className="text-gray-500">Chargement des rapports...</span>
              </div>
            </div>
          ) : filteredReports.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun rapport trouvé</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || filterYear !== 'all' 
                  ? 'Aucun rapport ne correspond à vos critères de recherche.'
                  : 'Aucun rapport d\'activité n\'a été ajouté pour le moment.'
                }
              </p>
              <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                Ajouter le premier rapport
              </Button>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={filteredReports}
              isLoading={false}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </CardContent>
      </Card>

      {/* Modal du formulaire */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div
            className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg"
            style={{ maxHeight: '90vh', overflowY: 'auto' }}
          >
            <h2 className="text-xl font-semibold mb-4">{selectedReport ? 'Modifier' : 'Ajouter'} un rapport</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date du rapport *
                </label>
                <Input
                  type="date"
                  value={form.report_date}
                  onChange={(e) => setForm(prev => ({ ...prev, report_date: e.target.value }))}
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fichier PDF *
                </label>
                <Input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  required={!selectedReport}
                  className="w-full"
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isSubmitting ? 'Enregistrement...' : (selectedReport ? 'Modifier' : 'Ajouter')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 