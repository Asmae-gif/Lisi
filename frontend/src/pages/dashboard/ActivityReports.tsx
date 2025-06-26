import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, FileText, Search, Filter, Download, Eye, Calendar } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useActivityReports } from "@/hooks/useActivityReports";
import { 
  ActivityReport, 
  ActivityReportFormData, 
  Column
} from "@/types/ActivityReportsSettings";
import { activityReportsApi } from "@/services/activityReportsApi";

export default function ActivityReports() {
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
    setForm({
      report_date: '',
      pdf: null,
    });
  };

  const columns: Column[] = [
    { 
      key: 'report_date', 
      label: 'Année',
      render: (value: unknown) => (
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-blue-600" />
          <Badge variant="outline" className="font-medium text-lg">
            {new Date(value as string).getFullYear()}
          </Badge>
        </div>
      )
    },
    { 
      key: 'created_at', 
      label: 'Actions',
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
              Voir PDF
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

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Gestion des rapports d'activité</h1>
      <button className="btn btn-primary mb-4" onClick={handleAdd}>Ajouter un rapport</button>
      
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
                  Fichier PDF {selectedReport ? '' : '*'}
                </label>
                <Input
                  type="file"
                  onChange={handleFileChange}
                  accept="application/pdf"
                  required={!selectedReport}
                  className="w-full"
                />
                {selectedReport && (
                  <p className="text-sm text-gray-500 mt-1">
                    Laissez vide pour conserver le fichier actuel
                  </p>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t">
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
                  {isSubmitting ? 'En cours...' : (selectedReport ? 'Modifier' : 'Ajouter')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tableau des rapports */}
      {reports.length > 0 ? (
        <>
          <DataTable
            columns={columns}
            data={reports}
            isLoading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          <div className="mt-4 text-sm text-muted-foreground">
            Double-cliquez sur une ligne pour modifier, ou utilisez le menu d'actions.
          </div>
        </>
      ) : (
        <div className="text-center py-8 text-gray-500">
          Aucun rapport d'activité trouvé
        </div>
      )}
    </div>
  );
} 