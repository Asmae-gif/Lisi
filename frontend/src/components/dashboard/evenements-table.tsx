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

type Evenement = {
  id: string
  titre: string
  type: "conférence" | "séminaire" | "soutenance" | "workshop"
  date: string
  lieu: string
  organisateur: string
  statut: "à venir" | "en cours" | "terminé"
}

const data: Evenement[] = [
  {
    id: "EVT-001",
    titre: "Conférence internationale sur l'IA",
    type: "conférence",
    date: "2024-06-15",
    lieu: "Marrakech, Maroc",
    organisateur: "Dr. Jean Dupont",
    statut: "à venir",
  },
  {
    id: "EVT-002",
    titre: "Séminaire sur les systèmes distribués",
    type: "séminaire",
    date: "2024-07-10",
    lieu: "Faculté des Sciences Semlalia",
    organisateur: "Dr. Sarah Martin",
    statut: "à venir",
  },
  {
    id: "EVT-003",
    titre: "Soutenance de thèse: Sécurité des IoT",
    type: "soutenance",
    date: "2024-09-05",
    lieu: "Amphithéâtre A, FSSM",
    organisateur: "Dr. Robert Benali",
    statut: "à venir",
  },
  {
    id: "EVT-004",
    titre: "Workshop sur l'apprentissage profond",
    type: "workshop",
    date: "2024-04-20",
    lieu: "Laboratoire LISI",
    organisateur: "Dr. Jean Dupont",
    statut: "terminé",
  },
  {
    id: "EVT-005",
    titre: "Journée portes ouvertes du laboratoire",
    type: "séminaire",
    date: "2024-03-15",
    lieu: "Faculté des Sciences Semlalia",
    organisateur: "Dr. Sarah Martin",
    statut: "terminé",
  },
]

const columns: ColumnDef<Evenement>[] = [
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
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.getValue("type") as string
      return (
        <Badge variant={type === "conférence" ? "default" : type === "séminaire" ? "secondary" : "outline"}>
          {type}
        </Badge>
      )
    },
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"))
      return <div>{date.toLocaleDateString("fr-FR")}</div>
    },
  },
  {
    accessorKey: "lieu",
    header: "Lieu",
    cell: ({ row }) => <div>{row.getValue("lieu")}</div>,
  },
  {
    accessorKey: "organisateur",
    header: "Organisateur",
    cell: ({ row }) => <div>{row.getValue("organisateur")}</div>,
  },
  {
    accessorKey: "statut",
    header: "Statut",
    cell: ({ row }) => {
      const statut = row.getValue("statut") as string
      return (
        <Badge variant={statut === "à venir" ? "default" : statut === "en cours" ? "secondary" : "outline"}>
          {statut}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const evenement = row.original

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
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(evenement.id)}>Copier l'ID</DropdownMenuItem>
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

export function EvenementsTable() {
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
                  Type <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => table.getColumn("type")?.setFilterValue("")}>Tous</DropdownMenuItem>
                <DropdownMenuItem onClick={() => table.getColumn("type")?.setFilterValue("conférence")}>
                  Conférence
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => table.getColumn("type")?.setFilterValue("séminaire")}>
                  Séminaire
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => table.getColumn("type")?.setFilterValue("soutenance")}>
                  Soutenance
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => table.getColumn("type")?.setFilterValue("workshop")}>
                  Workshop
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Statut <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => table.getColumn("statut")?.setFilterValue("")}>Tous</DropdownMenuItem>
                <DropdownMenuItem onClick={() => table.getColumn("statut")?.setFilterValue("à venir")}>
                  À venir
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => table.getColumn("statut")?.setFilterValue("en cours")}>
                  En cours
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => table.getColumn("statut")?.setFilterValue("terminé")}>
                  Terminé
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
