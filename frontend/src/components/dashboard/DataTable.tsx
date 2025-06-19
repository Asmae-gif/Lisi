import React, { useState, useMemo, useCallback } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * Composant de tableau de données réutilisable
 * Affiche des données dans un tableau avec recherche, pagination et actions
 */
interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: T[keyof T], item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  title: string;
  onAdd?: () => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  searchable?: boolean;
  itemsPerPage?: number;
  loading?: boolean;
  emptyMessage?: string;
}

export const DataTable = React.memo(<T extends Record<string, any>>({
  columns,
  data,
  title,
  onAdd,
  onEdit,
  onDelete,
  searchable = true,
  itemsPerPage = 10,
  loading = false,
  emptyMessage = "Aucun résultat trouvé"
}: DataTableProps<T>) => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Optimisation avec useMemo pour le filtrage des données
  const filteredData = useMemo(() => {
    if (!search) return data;
    
    return data.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [data, search]);

  // Optimisation avec useMemo pour la pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = useMemo(() => {
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, startIndex, itemsPerPage]);

  // Optimisation avec useCallback pour les handlers
  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
  }, []);

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    setCurrentPage(1); // Reset to first page when searching
  }, []);

  const handleEdit = useCallback((item: T) => {
    if (onEdit) {
      onEdit(item);
    }
  }, [onEdit]);

  const handleDelete = useCallback((item: T) => {
    if (onDelete) {
      onDelete(item);
    }
  }, [onDelete]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex space-x-4">
                {[...Array(columns.length)].map((_, j) => (
                  <div key={j} className="h-10 bg-gray-200 rounded w-1/4"></div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        {onAdd && (
          <Button
            onClick={onAdd}
            className="bg-[hsl(var(--primary))] text-white px-4 py-2 rounded-md font-medium hover:bg-[hsl(var(--primary))]/90 transition-colors"
          >
            + Ajouter
          </Button>
        )}
      </div>

      {searchable && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md border bg-muted/50 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--primary))]"
          />
        </div>
      )}

      <div className="bg-background rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted text-muted-foreground">
                {columns.map((column) => (
                  <th key={String(column.key)} className="px-4 py-2 text-left">
                    {column.label}
                  </th>
                ))}
                {(onEdit || onDelete) && (
                  <th className="px-4 py-2 text-left">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="px-4 py-8 text-center text-muted-foreground">
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, index) => (
                  <tr key={index} className="border-b last:border-0 hover:bg-muted/50">
                    {columns.map((column) => (
                      <td key={String(column.key)} className="px-4 py-2">
                        {column.render
                          ? column.render(item[column.key], item)
                          : item[column.key]}
                      </td>
                    ))}
                    {(onEdit || onDelete) && (
                      <td className="px-4 py-2">
                        <div className="flex items-center gap-2">
                          {onEdit && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(item)}
                              className="text-muted-foreground hover:text-[hsl(var(--primary))]"
                            >
                              Modifier
                            </Button>
                          )}
                          {onDelete && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(item)}
                              className="text-red-600 hover:text-red-700"
                            >
                              Supprimer
                            </Button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {startIndex + 1} - {Math.min(startIndex + itemsPerPage, filteredData.length)} sur{" "}
            {filteredData.length} élément(s)
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={20} />
            </Button>
            <span className="text-sm">
              Page {currentPage} sur {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={20} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
});

DataTable.displayName = 'DataTable'; 