import React, { useMemo} from "react"
import { Badge } from "@/components/ui/badge"
import { Eye, Trash2, Edit, Brain, Shield, Network, Database, Smartphone } from "lucide-react"
import { Axe } from "@/types/axe"
import DataTableWithActions from "@/components/common/DataTableWithActions"

// Mapping des icônes
const iconMap: Record<string, React.ComponentType> = {
  Brain,
  Shield,
  Network,
  Database,
  Smartphone,
};

/**
 * Composant de tableau des axes de recherche
 * Affiche la liste des axes avec possibilité de voir, modifier et supprimer
 */
interface AxesTableProps {
  axes: Axe[]
  loading: boolean 
  onView: (axe: Axe) => void
  onEdit: (axe: Axe) => void
  onDelete: (axe: Axe) => void
}

export const AxesTable = React.memo(({ axes, loading, onView, onEdit, onDelete }: AxesTableProps) => {
  
  // Optimisation avec useMemo pour les colonnes
  const columns = useMemo(() => [
    {
      key: 'title',
      label: 'Titre',
      render: (value: unknown, item: Record<string, unknown>) => (
        <span className="font-medium">{String(item?.title || value || 'N/A')}</span>
      )
    },
    {
      key: 'slug',
      label: 'Slug',
      render: (value: unknown, item: Record<string, unknown>) => (
        <Badge variant="secondary">{String(item?.slug || value || 'N/A')}</Badge>
      )
    },
    {
      key: 'icon',
      label: 'Icône',
      render: (value: unknown, item: Record<string, unknown>) => {
        const iconName = String(item?.icon || value || '');
        if (!iconName || iconName === 'N/A') {
          return <span className="text-muted-foreground text-sm">Aucune</span>;
        }
        
        const hasIcon = iconMap[iconName];
        return (
          <div className="flex items-center gap-2">
            <div className={`w-5 h-5 rounded bg-primary/10 flex items-center justify-center ${hasIcon ? 'text-primary' : 'text-muted-foreground'}`}>
              {hasIcon ? '✓' : '?'}
            </div>
            <span className="text-sm text-muted-foreground">{iconName}</span>
          </div>
        );
      }
    },
    {
      key: 'created_at',
      label: 'Date de création',
      render: (value: unknown, item: Record<string, unknown>) => {
        const date = String(item?.created_at || value || '');
        return date && date !== 'N/A' ? new Date(date).toLocaleDateString("fr-FR") : 'N/A';
      }
    }
  ], []);

  // Optimisation avec useCallback pour les actions
  const actions = useMemo(() => [
    {
      label: 'Voir',
      icon: Eye,
      variant: 'outline' as const,
      onClick: (item: Record<string, unknown>) => onView(item as unknown as Axe)
    },
    {
      label: 'Modifier',
      icon: Edit,
      variant: 'outline' as const,
      onClick: (item: Record<string, unknown>) => onEdit(item as unknown as Axe)
    },
    {
      label: 'Supprimer',
      icon: Trash2,
      variant: 'destructive' as const,
      onClick: (item: Record<string, unknown>) => onDelete(item as unknown as Axe),
      confirmDialog: {
        title: 'Confirmer la suppression',
        description: 'Êtes-vous sûr de vouloir supprimer cet axe ? Cette action peut être annulée.',
        confirmText: 'Supprimer',
        cancelText: 'Annuler'
      }
    }
  ], [onView, onEdit, onDelete]);

  return (
    <DataTableWithActions
      data={axes
        .filter(axe => axe !== undefined && axe !== null)
        .map(axe => ({
          ...axe,
          icon: axe?.icon || 'N/A'
        }))}
      columns={columns}
      actions={actions}
      title="Liste des Axes"
      description={`${axes.length} axe${axes.length > 1 ? "s" : ""} enregistré${axes.length > 1 ? "s" : ""}`}
      loading={loading}
      emptyMessage="Aucun axe trouvé. Commencez par en ajouter un."
      itemName="axe"
    />
  );
});

AxesTable.displayName = 'AxesTable';