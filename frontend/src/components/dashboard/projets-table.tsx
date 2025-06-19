"use client"

import { useState } from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

type Projet = {
  id: string
  titre: string
  responsable: string
  dateDebut: string
  dateFin: string
  statut: "en cours" | "terminé" | "planifié"
  equipe: string
}

const data: Projet[] = [
  {
    id: "PRJ-001",
    titre: "Développement d'algorithmes d'apprentissage profond pour la détection d'anomalies",
    responsable: "Dr. Jean Dupont",
    dateDebut: "2023-01-15",
    dateFin: "2025-01-14",
    statut: "en cours",
    equipe: "IA",
  },
  {
    id: "PRJ-002",
    titre: "Optimisation des systèmes distribués pour le traitement de données massives",
    responsable: "Dr. Sarah Martin",
    dateDebut: "2022-06-01",
    dateFin: "2024-05-31",
    statut: "en cours",
    equipe: "Systèmes Distribués",
  },
  {
    id: "PRJ-003",
    titre: "Sécurité des applications IoT dans les environnements industriels",
    responsable: "Dr. Robert Benali",
    dateDebut: "2021-09-01",
    dateFin: "2023-08-31",
    statut: "terminé",
    equipe: "Sécurité",
  },
  {
    id: "PRJ-004",
    titre: "Analyse prédictive pour la maintenance préventive des équipements industriels",
    responsable: "Dr. Jean Dupont",
    dateDebut: "2022-03-15",
    dateFin: "2024-03-14",
    statut: "en cours",
    equipe: "IA",
  },
  {
    id: "PRJ-005",
    titre: "Développement d'une plateforme de collaboration scientifique basée sur la blockchain",
    responsable: "Dr. Sarah Martin",
    dateDebut: "2024-09-01",
    dateFin: "2026-08-31",
    statut: "planifié",
    equipe: "Systèmes Distribués",
  },
]

const columns: ColumnDef<Projet>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "titre",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Titre
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="max-w-[500px] truncate">{row.getValue("titre")}</div>,
  },
  {
    accessorKey: "responsable",
    header: "Responsable",
    cell: ({ row }) => <div>{row.getValue("responsable")}</div>,
  },
  {
    accessorKey: "equipe",
    header: "Équipe",
    cell: ({ row }) => <div>{row.getValue("equipe")}</div>,
  },
  {
    accessorKey: "dateDebut",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Début
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("dateDebut"))
      return <div>{date.toLocaleDateString("fr-FR")}</div>
    },
  },
  {
    accessorKey: "dateFin",
    header: "Fin",
    cell: ({ row }) => {
      const date = new Date(row.getValue("dateFin"))
      return <div>{date.toLocaleDateString("fr-FR")}</div>
    },
  },
  {
    accessorKey: "statut",
    header: "Statut",
    cell: ({ row }) => {
      const statut = row.getValue("statut") as string
      return (
        <Badge variant={statut === "en cours" ? "default" : statut === "terminé" ? "secondary" : "outline"}>
          {statut}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const projet = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Ouvrir menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(projet.id)}>Copier l'ID</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Voir détails</DropdownMenuItem>
            <DropdownMenuItem>Modifier</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Supprimer</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function ProjetsTable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Filtrer par titre..."
              value={(table.getColumn("titre")?.getFilterValue() as string) ?? ""}
              onChange={(event) => table.getColumn("titre")?.setFilterValue(event.target.value)}
              className="max-w-sm"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Statut <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => table.getColumn("statut")?.setFilterValue("")}>Tous</DropdownMenuItem>
                <DropdownMenuItem onClick={() => table.getColumn("statut")?.setFilterValue("en cours")}>
                  En cours
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => table.getColumn("statut")?.setFilterValue("terminé")}>
                  Terminé
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => table.getColumn("statut")?.setFilterValue("planifié")}>
                  Planifié
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Équipe <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => table.getColumn("equipe")?.setFilterValue("")}>
                  Toutes
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => table.getColumn("equipe")?.setFilterValue("IA")}>IA</DropdownMenuItem>
                <DropdownMenuItem onClick={() => table.getColumn("equipe")?.setFilterValue("Systèmes Distribués")}>
                  Systèmes Distribués
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => table.getColumn("equipe")?.setFilterValue("Sécurité")}>
                  Sécurité
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Colonnes <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    Aucun résultat.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} sur {table.getFilteredRowModel().rows.length} ligne(s)
            sélectionnée(s).
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Précédent
            </Button>
            <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              Suivant
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
