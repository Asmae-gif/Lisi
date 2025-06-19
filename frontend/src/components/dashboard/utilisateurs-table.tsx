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

type Utilisateur = {
  id: string
  nom: string
  prenom: string
  email: string
  role: "admin" | "enseignant" | "editeur"
  statut: "actif" | "inactif" | "en attente"
  derniereConnexion: string
}

const data: Utilisateur[] = [
  {
    id: "USR-001",
    nom: "Dupont",
    prenom: "Jean",
    email: "jean.dupont@uca.ac.ma",
    role: "enseignant",
    statut: "actif",
    derniereConnexion: "2024-05-20T10:30:00",
  },
  {
    id: "USR-002",
    nom: "Martin",
    prenom: "Sarah",
    email: "sarah.martin@uca.ac.ma",
    role: "enseignant",
    statut: "actif",
    derniereConnexion: "2024-05-19T14:45:00",
  },
  {
    id: "USR-003",
    nom: "Benali",
    prenom: "Robert",
    email: "robert.benali@uca.ac.ma",
    role: "enseignant",
    statut: "actif",
    derniereConnexion: "2024-05-18T09:15:00",
  },
  {
    id: "USR-004",
    nom: "Admin",
    prenom: "Super",
    email: "admin@lisi.uca.ac.ma",
    role: "admin",
    statut: "actif",
    derniereConnexion: "2024-05-21T08:30:00",
  },
  {
    id: "USR-005",
    nom: "Alaoui",
    prenom: "Karim",
    email: "karim.alaoui@uca.ac.ma",
    role: "editeur",
    statut: "en attente",
    derniereConnexion: "",
  },
]

const columns: ColumnDef<Utilisateur>[] = [
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
    id: "utilisateur",
    header: "Utilisateur",
    cell: ({ row }) => {
      const utilisateur = row.original
      return (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="/placeholder.svg" alt={`${utilisateur.prenom} ${utilisateur.nom}`} />
            <AvatarFallback className="bg-lisi-green text-white">
              {utilisateur.prenom.charAt(0)}
              {utilisateur.nom.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">
              {utilisateur.prenom} {utilisateur.nom}
            </div>
            <div className="text-sm text-muted-foreground">{utilisateur.email}</div>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "role",
    header: "Rôle",
    cell: ({ row }) => {
      const role = row.getValue("role") as string
      return (
        <Badge variant={role === "admin" ? "default" : role === "enseignant" ? "secondary" : "outline"}>{role}</Badge>
      )
    },
  },
  {
    accessorKey: "statut",
    header: "Statut",
    cell: ({ row }) => {
      const statut = row.getValue("statut") as string
      return (
        <Badge variant={statut === "actif" ? "default" : statut === "inactif" ? "secondary" : "outline"}>
          {statut}
        </Badge>
      )
    },
  },
  {
    accessorKey: "derniereConnexion",
    header: ({ column }) => {
      return (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Dernière connexion
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = row.getValue("derniereConnexion") as string
      if (!date) return <div className="text-muted-foreground">Jamais connecté</div>

      const formattedDate = new Date(date).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
      return <div>{formattedDate}</div>
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const utilisateur = row.original

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
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(utilisateur.id)}>
              Copier l'ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Voir profil</DropdownMenuItem>
            <DropdownMenuItem>Modifier</DropdownMenuItem>
            <DropdownMenuItem>Réinitialiser mot de passe</DropdownMenuItem>
            <DropdownMenuSeparator />
            {utilisateur.statut === "actif" ? (
              <DropdownMenuItem className="text-destructive">Désactiver</DropdownMenuItem>
            ) : utilisateur.statut === "inactif" ? (
              <DropdownMenuItem className="text-lisi-green">Activer</DropdownMenuItem>
            ) : (
              <DropdownMenuItem className="text-lisi-green">Approuver</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export function UtilisateursTable() {
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
              placeholder="Rechercher un utilisateur..."
              value={(table.getColumn("utilisateur")?.getFilterValue() as string) ?? ""}
              onChange={(event) => table.getColumn("utilisateur")?.setFilterValue(event.target.value)}
              className="max-w-sm"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Rôle <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => table.getColumn("role")?.setFilterValue("")}>Tous</DropdownMenuItem>
                <DropdownMenuItem onClick={() => table.getColumn("role")?.setFilterValue("admin")}>
                  Admin
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => table.getColumn("role")?.setFilterValue("enseignant")}>
                  Enseignant
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => table.getColumn("role")?.setFilterValue("editeur")}>
                  Éditeur
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
                <DropdownMenuItem onClick={() => table.getColumn("statut")?.setFilterValue("actif")}>
                  Actif
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => table.getColumn("statut")?.setFilterValue("inactif")}>
                  Inactif
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => table.getColumn("statut")?.setFilterValue("en attente")}>
                  En attente
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
