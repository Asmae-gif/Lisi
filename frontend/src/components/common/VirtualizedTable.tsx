import React, { useMemo, useCallback, useState } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import LoadingSkeleton from './LoadingSkeleton';

/**
 * Composant de tableau optimisé pour les longues listes
 * Utilise des optimisations React pour améliorer les performances
 */
interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: T[keyof T], item: T) => React.ReactNode;
  width?: number;
  sortable?: boolean;
}

interface VirtualizedTableProps<T> {
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
  className?: string;
  maxHeight?: number;
}

const VirtualizedTable = React.memo(<T extends Record<string, any>>({
  columns,
  data,
  title,
  onAdd,
  onEdit,
  onDelete,
  searchable = true,
  itemsPerPage = 50,
  loading = false,
  emptyMessage = "Aucun résultat trouvé",
  className = "",
  maxHeight = 600
}: VirtualizedTableProps<T>) => {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Optimisation avec useMemo pour le filtrage et tri
  const filteredAndSortedData = useMemo(() => {
    let filtered = data.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(search.toLowerCase())
      )
    );

    if (sortColumn) {
      filtered = filtered.sort((a, b) => {
        const aValue = a[sortColumn];
        const bValue = b[sortColumn];
        
        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [data, search, sortColumn, sortDirection]);

  // Optimisation avec useMemo pour la pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);

  // Optimisation avec useCallback pour les handlers
  const handlePageChange = useCallback((newPage: number) => {
    setCurrentPage(newPage);
  }, []);

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    setCurrentPage(1);
  }, []);

  const handleSort = useCallback((column: keyof T) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  }, [sortColumn, sortDirection]);

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
    return <LoadingSkeleton type="table" rows={5} columns={columns.length} />;
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          {onAdd && (
            <Button onClick={onAdd} className="bg-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/90">
              + Ajouter
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {searchable && (
          <div className="relative mb-4">
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
          <div className="overflow-x-auto" style={{ maxHeight }}>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted text-muted-foreground">
                  {columns.map((column) => (
                    <TableHead 
                      key={String(column.key)} 
                      className="px-4 py-2 text-left cursor-pointer hover:bg-muted/80"
                      onClick={() => column.sortable && handleSort(column.key)}
                      style={{ width: column.width }}
                    >
                      <div className="flex items-center gap-2">
                        {column.label}
                        {column.sortable && sortColumn === column.key && (
                          <span className="text-xs">
                            {sortDirection === 'asc' ? '↑' : '↓'}
                          </span>
                        )}
                      </div>
                    </TableHead>
                  ))}
                  {(onEdit || onDelete) && (
                    <TableHead className="px-4 py-2 text-left">Actions</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell 
                      colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} 
                      className="px-4 py-8 text-center text-muted-foreground"
                    >
                      {emptyMessage}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((item, index) => (
                    <TableRow key={index} className="border-b last:border-0 hover:bg-muted/50">
                      {columns.map((column) => (
                        <TableCell key={String(column.key)} className="px-4 py-2" style={{ width: column.width }}>
                          {column.render
                            ? column.render(item[column.key], item)
                            : item[column.key]}
                        </TableCell>
                      ))}
                      {(onEdit || onDelete) && (
                        <TableCell className="px-4 py-2">
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
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, filteredAndSortedData.length)} sur{" "}
              {filteredAndSortedData.length} élément(s)
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
      </CardContent>
    </Card>
  );
});

VirtualizedTable.displayName = 'VirtualizedTable';

export default VirtualizedTable; 