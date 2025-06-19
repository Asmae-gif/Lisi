import React, { useMemo, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import LoadingSkeleton from './LoadingSkeleton';

/**
 * Composant de tableau de données avec actions réutilisable
 * Affiche un tableau avec des actions (voir, modifier, supprimer) et support pour la personnalisation
 */
export interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: T[keyof T], item: T) => React.ReactNode;
  width?: string;
}

export interface Action<T> {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  onClick: (item: T) => void;
  confirmDialog?: {
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
  };
}

interface DataTableWithActionsProps<T> {
  data: T[];
  columns: Column<T>[];
  actions: Action<T>[];
  title: string;
  description?: string;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
  itemName?: string; // Pour les messages de confirmation
}

const DataTableWithActions = React.memo(<T extends Record<string, unknown>>({
  data,
  columns,
  actions,
  title,
  description,
  loading = false,
  emptyMessage = "Aucun élément trouvé",
  className = "",
}: DataTableWithActionsProps<T>) => {
  
  // Optimisation avec useMemo pour le rendu des actions
  const renderActions = useCallback((item: T) => {
    return (
      <div className="flex justify-end gap-2">
        {actions.map((action, index) => {
          const ActionIcon = action.icon;
          
          if (action.confirmDialog) {
            return (
              <AlertDialog key={index}>
                <AlertDialogTrigger asChild>
                  <Button
                    variant={action.variant || "outline"}
                    size="sm"
                    className={`flex items-center gap-1 ${
                      action.variant === "destructive" ? "text-red-600 hover:text-red-700" : ""
                    }`}
                  >
                    <ActionIcon className="h-3 w-3" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{action.confirmDialog.title}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {action.confirmDialog.description}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>
                      {action.confirmDialog.cancelText || "Annuler"}
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => action.onClick(item)}
                      className={action.variant === "destructive" ? "bg-red-600 hover:bg-red-700" : ""}
                    >
                      {action.confirmDialog.confirmText || "Confirmer"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            );
          }
          
          return (
            <Button
              key={index}
              variant={action.variant || "outline"}
              size="sm"
              onClick={() => action.onClick(item)}
              className={`flex items-center gap-1 ${
                action.variant === "destructive" ? "text-red-600 hover:text-red-700" : ""
              }`}
            >
              <ActionIcon className="h-3 w-3" />
            </Button>
          );
        })}
      </div>
    );
  }, [actions]);

  // Optimisation avec useMemo pour le contenu du tableau
  const tableContent = useMemo(() => {
    if (loading) {
      return <LoadingSkeleton type="table" rows={5} columns={columns.length} />;
    }

    if (data.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          {emptyMessage}
        </div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={String(column.key)} style={{ width: column.width }}>
                {column.label}
              </TableHead>
            ))}
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.filter(item => item !== undefined && item !== null).map((item, index) => (
            <TableRow key={index}>
              {columns.map((column) => (
                <TableCell key={String(column.key)}>
                  {column.render
                    ? column.render(item?.[column.key], item)
                    : String(item?.[column.key] ?? 'N/A')}
                </TableCell>
              ))}
              <TableCell className="text-right">
                {renderActions(item)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }, [data, columns, loading, emptyMessage, renderActions]);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && (
          <CardDescription>
            {description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {tableContent}
      </CardContent>
    </Card>
  );
});

DataTableWithActions.displayName = 'DataTableWithActions';

export default DataTableWithActions; 