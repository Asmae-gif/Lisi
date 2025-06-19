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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type Membre = {
  id: string
  nom: string
  prenom: string
  statut: "Enseignant-Chercheur" | "Doctorant" | "Post-doctorant" | "Administratif"
  email: string
  equipe: string
  publications: number
}

const data: Membre[] = [
  {
    id: "MEM-001",
    nom: "Dupont",
    prenom: "Jean",
    statut: "Enseignant-Chercheur",
    email: "jean.dupont@uca.ac.ma",
    equipe: "IA",
    publications: 28,
  },
  {
    id: "MEM-002",
    nom: "Martin",
    prenom: "Sarah",
    statut: "Enseignant-Chercheur",
    email: "sarah.martin@uca.ac.ma",
    equipe: "Systèmes Distribués",
    publications: 35,
  },
  {
    id: "MEM-003",
    nom: "Benali",
    prenom: "Robert",
    statut: "Enseignant-Chercheur",
    email: "robert.benali@uca.ac.ma",
    equipe: "Sécurité",
    publications: 22,
  },
  {
    id: "MEM-004",
    nom: "Alaoui",
    prenom: "Karim",
    statut: "Doctorant",
    email: "karim.alaoui@etu.uca.ac.ma",
    equipe: "IA",
    publications: 5,
  },
  {
    id: "MEM-005",
    nom: "Berrada",
    prenom: "Fatima",
    statut: "Doctorant",
    email: "fatima.berrada@etu.uca.ac.ma",
    equipe: "Systèmes Distribués",
    publications: 3,
  },
]

const columns: ColumnDef<Membre>[] = [
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
    id: "membre",
    header: "Membre",
    cell: ({ row }) => {
      const membre = row.original
      return (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="/placeholder.svg" alt={`${membre.prenom} ${membre.nom}`} />
            <AvatarFallback className="bg-lisi-green text-white">
              {membre.prenom.charAt(0)}
              {membre.nom.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">
              {membre.prenom} {membre.nom}
            </div>
            <div className="text-sm text-muted-foreground">{membre.email}</div>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "statut",
    header: "Statut",
    cell: ({ row }) => {
      const statut = row.getValue("statut") as string
      return (
        <Badge
          variant={statut === "Enseignant-Chercheur" ? "default" : statut === "Doctorant" ? "secondary" : "outline"}
        >
          {statut}
        </Badge>
      )
    },
  },
  {
    accessorKey: "equipe",
    header: "Équipe",
    cell: ({ row }) => <div>{row.getValue("equipe")}</div>,
  },
  {
    accessorKey: "publications",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Publications
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="text-center">{row.getValue("publications")}</div>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const membre = row.original

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
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(membre.id)}>Copier l'ID</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Voir profil</DropdownMenuItem>
            <DropdownMenuItem>Modifier</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Supprimer</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function MembresTable() {
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
              placeholder="Rechercher un membre..."
              value={(table.getColumn("membre")?.getFilterValue() as string) ?? ""}
              onChange={(event) => table.getColumn("membre")?.setFilterValue(event.target.value)}
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
                <DropdownMenuItem onClick={() => table.getColumn("statut")?.setFilterValue("Enseignant-Chercheur")}>
                  Enseignant-Chercheur
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => table.getColumn("statut")?.setFilterValue("Doctorant")}>
                  Doctorant
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => table.getColumn("statut")?.setFilterValue("Post-doctorant")}>
                  Post-doctorant
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => table.getColumn("statut")?.setFilterValue("Administratif")}>
                  Administratif
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
