import React, { useState, Suspense, lazy } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { UserCheck, UserX, Plus } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import MemberActions from '../../../archive/MemberActions'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useMembres } from "@/hooks/useMembres"
import IconMapper from '@/components/common/IconMapper'
import { Membre, User, MembreFormData } from "@/types/membre"

// Interfaces pour les props des composants
interface MobileMemberCardProps {
  membre: Membre;
  linkedUser?: User;
  onEdit: (membre: Membre) => void;
  onDelete: (id: number) => void;
  onApprove: (id: number) => void;
  onBlock: (id: number) => void;
  onToggleComite: (id: number, isComite: boolean) => void;
  onReject: (id: number) => void;
  onUnblock: (id: number) => void;
}

interface StatsCardProps {
  title: string;
  value: number;
  icon: string;
  variant?: "default" | "success" | "danger";
}

// Lazy load components
const MemberRow = lazy(() => import("./MemberRow"))

export default function Membres() {

  //const { toast } = useToast()
  const {
    searchTerm,
    setSearchTerm,
    users,
    membres,
    isLoadingMembres,
    isLoadingUsers,
    selectedMembre,
    setSelectedMembre,
    showCreateMembre,
    setShowCreateMembre,
    newMembre,
    setNewMembre,
    stats,
    handleApproveUser,
    handleBlockUser,
    handleDeleteMembre,
    handleSubmitMembre,
    handleToggleComite,
    handleRejectUser,
    handleUnblockUser
  } = useMembres() as {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    users: User[];
    membres: Membre[];
    isLoadingMembres: boolean;
    isLoadingUsers: boolean;
    selectedMembre: Membre | null;
    setSelectedMembre: React.Dispatch<React.SetStateAction<Membre | null>>;
    showCreateMembre: boolean;
    setShowCreateMembre: (show: boolean) => void;
    newMembre: Partial<MembreFormData>;
    setNewMembre: React.Dispatch<React.SetStateAction<Partial<MembreFormData>>>;
    stats: {
      totalMembres: number;
      pendingApproval: number;
      blockedUsers: number;
    };
    handleApproveUser: (id: number) => void;
    handleBlockUser: (id: number) => void;
    handleDeleteMembre: (id: number) => void;
    handleSubmitMembre: (membre: Partial<MembreFormData>) => void;
    handleToggleComite: (id: number, isComite: boolean) => Promise<void>;
    handleRejectUser: (id: number) => void;
    handleUnblockUser: (id: number) => void;
  };
  const [activeTab, setActiveTab] = useState("membres")

  const StatsCard: React.FC<StatsCardProps> = ({
    title,
    value,
    icon,
    variant = "default",
  }) => {
    const variants = {
      default: "border-muted text-muted-foreground",
      success: "border-green-100 text-green-600 bg-green-50",
      danger: "border-red-100 text-red-600 bg-red-50",
    }
    return (
      <Card className={`${variants[variant]} transition-all hover:shadow-md`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">{title}</CardTitle>
          <IconMapper iconKey={icon} className="h-3 w-3 sm:h-4 sm:w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-lg sm:text-2xl font-bold">{value}</div>
        </CardContent>
      </Card>
    )
  }

  // Loading components
const TableSkeleton = () => (
  <div className="space-y-3">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex space-x-4 animate-pulse">
        <div className="h-10 bg-gray-200 rounded w-1/4"></div>
        <div className="h-10 bg-gray-200 rounded w-1/4"></div>
        <div className="h-10 bg-gray-200 rounded w-1/4"></div>
        <div className="h-10 bg-gray-200 rounded w-1/4"></div>
      </div>
    ))}
  </div>
)
  
  const MobileMemberCard = ({
    membre,
    linkedUser,
    onEdit,
    onDelete,
    onApprove,
    onBlock,
    onToggleComite,
    onReject,
    onUnblock
  }: MobileMemberCardProps) => (
    <Card key={membre.id}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={membre.photo_url || (typeof membre.photo === 'string' ? membre.photo : undefined)} />
              <AvatarFallback>{membre.prenom[0]}{membre.nom[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{membre.prenom} {membre.nom}</h3>
              <p className="text-sm text-gray-500">{membre.email}</p>
              <p className="text-sm text-gray-500">{membre.statut}</p>
            </div>
          </div>
          <MemberActions
            membre={membre}
            linkedUser={linkedUser}
            onEdit={onEdit}
            onDelete={onDelete}
            onApprove={onApprove}
            onToggleComite={(id) => onToggleComite(id, !membre.is_comite)}
            onBlock={onBlock}
            onReject={onReject}
            onUnblock={onUnblock}
          />
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      {/* Header - Fixed height */}
      <div className="flex-none bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h1 className="text-2xl sm:text-3xl font-bold">Gestion des Membres</h1>
              {/* Stats Cards - Responsive grid */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                <StatsCard title="Membres" value={stats.totalMembres} icon="Users" />
                <StatsCard title="En Attente" value={stats.pendingApproval} icon="USER_CHECK" variant="success" />
                <StatsCard title="Bloqués" value={stats.blockedUsers} icon="USER_X" variant="danger" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Fixed height with overflow */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full px-4 sm:px-6 lg:px-8 py-4">
          <div className="max-w-7xl mx-auto h-full">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              {/* Tabs Navigation - Fixed height */}
              <div className="flex-none mb-4">
                <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-none lg:flex">
                  <TabsTrigger value="membres" className="text-sm">Gestion des Membres</TabsTrigger>
                  <TabsTrigger value="approbations">
                    Approbations en attente
                    {stats.pendingApproval > 0 && (
                      <span className="ml-2 px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                        {stats.pendingApproval}
                      </span>
                    )}
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Tab Content - Scrollable with fixed height */}
              <div className="flex-1 overflow-hidden">
                <TabsContent value="membres" className="h-full mt-0">
                  <div className="h-full flex flex-col space-y-4">
                    {/* Filters - Fixed height */}
                    <Card className="flex-none">
                      <CardHeader className="pb-4">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                          <CardTitle className="text-lg">Membres</CardTitle>
                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                            <div className="relative flex-1 sm:flex-none sm:w-64">
                              <Input
                                placeholder="Rechercher..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                              />
                            </div>
                            <Button 
                              onClick={() => {
                                setSelectedMembre(null)
                                setShowCreateMembre(true)
                              }}
                              className="w-full sm:w-auto"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              <span className="hidden sm:inline">Ajouter un membre</span>
                              <span className="sm:hidden"></span>
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>

                    {/* Members List - Scrollable with fixed height */}
                    <Card className="flex-1 overflow-hidden">
                      <CardContent className="h-full p-0">
                        <div className="h-full overflow-auto">
                          <Suspense fallback={<div className="p-6"><TableSkeleton /></div>}>
                            {/* Desktop Table */}
                            <div className="hidden lg:block">
                              <Table>
                                <TableHeader className="sticky top-0 bg-white z-10">
                                  <TableRow>
                                    <TableHead className="w-[300px]">Membre</TableHead>
                                    {/* <TableHead className="w-[150px]">Grade</TableHead> */}
                                    {/* <TableHead className="w-[100px]">Statut</TableHead> */}
                                    {/* <TableHead className="w-[150px]">Compte</TableHead> */}
                                    <TableHead className="w-[100px]">Actions</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {isLoadingMembres ? (
                                    <TableRow>
                                      <TableCell colSpan={2} className="text-center">
                                        Chargement...
                                      </TableCell>
                                    </TableRow>
                                  ) : membres.length > 0 ? (
                                    membres.map((membre) => {
                                      const linkedUser = users.find((u) => u.id === membre.user?.id)
                                      return (
                                        <MemberRow
                                          key={membre.id}
                                          membre={membre}
                                          linkedUser={linkedUser}
                                          onEdit={(editedMembre: Membre) => {
                                            setSelectedMembre(editedMembre);
                                            setNewMembre({
                                              nom: editedMembre.nom,
                                              prenom: editedMembre.prenom,
                                              email: editedMembre.email,
                                              grade: editedMembre.grade || "",
                                              statut: editedMembre.statut,
                                              biographie: editedMembre.biographie || "",
                                              linkedin: editedMembre.linkedin || "",
                                              researchgate: editedMembre.researchgate || "",
                                              google_scholar: editedMembre.google_scholar || "",
                                              is_comite: editedMembre.is_comite,
                                              axe_ids: editedMembre.axe_ids,
                                            });
                                            setShowCreateMembre(true);
                                          }}
                                          onDelete={handleDeleteMembre}
                                          onApprove={handleApproveUser}
                                          onBlock={handleBlockUser}
                                          onToggleComite={handleToggleComite}
                                          onUnblock={handleUnblockUser}
                                          onReject={handleRejectUser}
                                        />
                                      )
                                    })
                                  ) : (
                                    <TableRow>
                                      <TableCell colSpan={2} className="text-center">
                                        Aucun membre trouvé.
                                      </TableCell>
                                    </TableRow>
                                  )}
                                </TableBody>
                              </Table>
                            </div>

                            {/* Mobile Cards */}
                            <div className="lg:hidden space-y-4 p-4">
                              {isLoadingMembres ? (
                                <TableSkeleton />
                              ) : membres.length > 0 ? (
                                membres.map((membre: Membre) => {
                                  const linkedUser = users.find((u) => u.id === membre.user?.id);
                                  return (
                                    <MobileMemberCard
                                      key={membre.id}
                                      membre={membre}
                                      linkedUser={linkedUser}
                                      onEdit={(editedMembre: Membre) => {
                                        setSelectedMembre(editedMembre);
                                        setNewMembre({
                                          nom: editedMembre.nom,
                                          prenom: editedMembre.prenom,
                                          email: editedMembre.email,
                                          grade: editedMembre.grade || "",
                                          statut: editedMembre.statut,
                                          biographie: editedMembre.biographie || "",
                                          linkedin: editedMembre.linkedin || "",
                                          researchgate: editedMembre.researchgate || "",
                                          google_scholar: editedMembre.google_scholar || "",
                                          is_comite: editedMembre.is_comite,
                                          axe_ids: editedMembre.axe_ids,
                                        });
                                        setShowCreateMembre(true);
                                      }}
                                      onDelete={handleDeleteMembre}
                                      onApprove={handleApproveUser}
                                      onBlock={handleBlockUser}
                                      onToggleComite={handleToggleComite}
                                      onUnblock={handleUnblockUser}
                                      onReject={handleRejectUser}
                                    />
                                  );
                                })
                              ) : (
                                <div className="text-center py-8">
                                  <p className="text-gray-500">Aucun membre trouvé.</p>
                                </div>
                              )}
                            </div>
                          </Suspense>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                {/* Approbations Tab - Same height as Members tab */}
                <TabsContent value="approbations" className="h-full mt-0">
                  <Card className="h-full">
                    <CardHeader className="flex-none">
                      <CardTitle>Utilisateurs en attente d'approbation</CardTitle>
                      <CardDescription>
                        Validez ou refusez l'accès aux nouveaux utilisateurs
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 overflow-auto">
                      <Suspense fallback={<TableSkeleton />}>
                        <div className="space-y-4">
                          {isLoadingUsers ? (
                            <p>Chargement…</p>
                          ) : users.filter((u) => !u.is_approved && !u.is_blocked).length > 0 ? (
                            users
                              .filter((u) => !u.is_approved && !u.is_blocked)
                              .map((user) => (
                                <div
                                  key={user.id}
                                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-4"
                                >
                                  <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                      <span className="text-lg font-medium">
                                        {user.name.charAt(0)}
                                      </span>
                                    </div>
                                    <div>
                                      <p className="font-medium">{user.name}</p>
                                      <p className="text-sm text-gray-500">
                                        Demande envoyée le{" "}
                                        {new Date(user.created_at).toLocaleDateString("fr-FR")}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex flex-col sm:flex-row gap-2">
                                    <Button
                                      size="sm"
                                      onClick={() => handleApproveUser(user.id)}
                                      className="w-full sm:w-auto"
                                      
                                    >
                                      <UserCheck className="w-4 h-4 mr-2" />
                                      Approuver
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => handleRejectUser(user.id)}
                                      className="w-full sm:w-auto"
                                    >
                                      <UserX className="w-4 h-4 mr-2" />
                                      Refuser
                                    </Button>
                                  </div>
                                </div>
                              ))
                          ) : (
                            <div className="text-center py-8">
                              <UserCheck className="mx-auto h-12 w-12 text-green-500 mb-4" />
                              <h3 className="text-lg font-medium text-gray-900">
                                Aucune demande en attente
                              </h3>
                              <p className="text-gray-500">
                                Toutes les demandes d'approbation ont été traitées
                              </p>
                            </div>
                          )}
                        </div>
                      </Suspense>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Create/Edit Member Dialog */}
      <Dialog open={showCreateMembre} onOpenChange={setShowCreateMembre}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedMembre ? "Modifier le membre" : "Créer un nouveau membre"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="prenom">Prénom</Label>
              <Input
                id="prenom"
                value={newMembre.prenom}
                onChange={(e) => setNewMembre({ ...newMembre, prenom: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="nom">Nom</Label>
              <Input
                id="nom"
                value={newMembre.nom}
                onChange={(e) => setNewMembre({ ...newMembre, nom: e.target.value })}
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newMembre.email}
                onChange={(e) => setNewMembre({ ...newMembre, email: e.target.value })}
              />
            </div>
            <div>
                <Label htmlFor="statut">Statut</Label>
                <Input
                id="statut"
                  value={newMembre.statut}
                  onChange={(e) => setNewMembre({ ...newMembre, statut: e.target.value  })}
                />
                  
              </div>
            {/*
            <div>
              <Label htmlFor="grade">Grade</Label>
              <Input
                value={newMembre.grade}
                onChange={(e) => setNewMembre({ ...newMembre, grade: e.target.value })}
              />
               
            </div>
              <div className="sm:col-span-2">
              <Label htmlFor="biographie">Biographie</Label>
              <Textarea
                id="biographie"
                value={newMembre.biographie || ""}
                onChange={(e) => setNewMembre({ ...newMembre, biographie: e.target.value })}
                rows={3}
              />
            </div>
            <div>
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                value={newMembre.linkedin || ""}
                onChange={(e) => setNewMembre({ ...newMembre, linkedin: e.target.value })}
                placeholder="https://linkedin.com/in/…"
              />
            </div>
            <div>
              <Label htmlFor="researchgate">ResearchGate</Label>
              <Input
                id="researchgate"
                value={newMembre.researchgate || ""}
                onChange={(e) => setNewMembre({ ...newMembre, researchgate: e.target.value })}
                placeholder="https://researchgate.net/profile/…"
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="google_scholar">Google Scholar</Label>
              <Input
                id="google_scholar"
                value={newMembre.google_scholar || ""}
                onChange={(e) => setNewMembre({ ...newMembre, google_scholar: e.target.value })}
                placeholder="https://scholar.google.com/citations?user=…"
              />
            </div>
          */}
          
          </div>
          <div className="flex flex-col sm:flex-row justify-end gap-2 mt-6">
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateMembre(false)
                setSelectedMembre(null)
              }}
              className="w-full sm:w-auto"
            >
              Annuler
            </Button>
            <Button
              onClick={() => handleSubmitMembre(newMembre)}
              disabled={
                !newMembre.nom || !newMembre.prenom || !newMembre.email || !newMembre.statut
              }
              className="w-full sm:w-auto"
            >
              {selectedMembre ? "Modifier" : "Créer"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
