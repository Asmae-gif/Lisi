/**
 * Hook personnalisé pour la gestion des membres
 * Gère l'état et les opérations liées aux membres et aux utilisateurs
 */

import { useState, useEffect } from 'react'
import axiosClient from "@/services/axiosClient"
import * as userService from "@/services/userService"
import { User, Membre, MembreFormData, defaultMembreFormData } from "@/types/membre"
import { useToast } from "@/components/ui/use-toast"

export function useMembres() {
  const { toast } = useToast()
  
  // États
  const [searchTerm, setSearchTerm] = useState("")
  const [users, setUsers] = useState<User[]>([])
  const [membres, setMembres] = useState<Membre[]>([])
  const [isLoadingMembres, setIsLoadingMembres] = useState(true)
  const [isLoadingUsers, setIsLoadingUsers] = useState(true)
  const [selectedMembre, setSelectedMembre] = useState<Membre | null>(null)
  const [showCreateMembre, setShowCreateMembre] = useState(false)
  const [newMembre, setNewMembre] = useState<MembreFormData>(defaultMembreFormData)

  /**
   * Récupère la liste des utilisateurs
   */
  const fetchUsers = async () => {
    setIsLoadingUsers(true)
    try {
      const users = await userService.getUsers()
      setUsers(users)
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs:", error)
    } finally {
      setIsLoadingUsers(false)
    }
  }

  /**
   * Récupère la liste des membres
   */
  const fetchMembres = async () => {
    setIsLoadingMembres(true)
    try {
      const membres = await userService.getMembres()
      setMembres(membres)
    } catch (error) {
      console.error("Erreur lors de la récupération des membres:", error)
    } finally {
      setIsLoadingMembres(false)
    }
  }

  /**
   * Filtre les membres selon le terme de recherche
   */
  const filteredMembres = (membres || []).filter((m) => {
    const searchLower = searchTerm.toLowerCase()
    const isVerified = m.user?.email_verified_at !== null
    const matchesSearch = 
      m.nom.toLowerCase().includes(searchLower) ||
      m.prenom.toLowerCase().includes(searchLower) ||
      m.email.toLowerCase().includes(searchLower) ||
      (m.grade?.toLowerCase() || '').includes(searchLower)

    return isVerified && matchesSearch
  })

  /**
   * Statistiques sur les membres et utilisateurs
   */
  const stats = {
    totalMembres: (membres || []).filter(m => m.user?.email_verified_at !== null).length,
    pendingApproval: (users || []).filter((u) => !u.is_approved && !u.is_blocked).length,
    blockedUsers: (users || []).filter((u) => u.is_blocked).length,
    unverifiedMembres: (membres || []).filter(m => m.user?.email_verified_at === null).length,
  }

  /**
   * Rejette un utilisateur
   */
  const handleRejectUser = async (userId: number) => {
    try {
      await userService.rejectUser(userId);
      await fetchUsers();
      toast({
        title: "Succès",
        description: "L'utilisateur a été rejeté avec succès",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de rejeter l'utilisateur",
        variant: "destructive",
      });
    }
  };

  /**
   * Débloque un utilisateur
   */
  const handleUnblockUser = async (userId: number) => {
    try {
      const user = (users || []).find(u => u.id === userId)
      if (!user) throw new Error("Utilisateur non trouvé")

      const updatedUser = await userService.unblockUser(userId);
      
      if (!updatedUser) {
        throw new Error("Erreur lors du déblocage")
      }

      // Mise à jour des états locaux avec les données retournées
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId 
            ? { 
                ...user, 
                ...updatedUser,
                is_blocked: false
              }
            : user
        )
      )

      setMembres(prevMembres =>
        prevMembres.map(membre =>
          membre.user?.id === userId
            ? {
                ...membre,
                user: {
                  ...membre.user,
                  ...updatedUser,
                  is_blocked: false
                }
              }
            : membre
        )
      )

      toast({
        title: "Succès",
        description: "L'utilisateur a été débloqué avec succès",
      });
    } catch (error) {
      console.error("Erreur lors du déblocage:", error);
      toast({
        title: "Erreur",
        description: "Impossible de débloquer l'utilisateur",
        variant: "destructive",
      });
    }
  };

  /**
   * Approuve un utilisateur
   */
  const handleApproveUser = async (userId: number) => {
    try {
      const updatedUser = await userService.approveUser(userId)
      
      if (!updatedUser) {
        throw new Error("Erreur lors de l'approbation: réponse invalide")
      }

      // Mise à jour des états locaux seulement (pas besoin de refaire un appel API)
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId 
            ? { 
                ...user,
                ...updatedUser,
                is_approved: true,
                email_verified_at: updatedUser.email_verified_at,
                is_blocked: false
              }
            : user
        )
      )

      setMembres(prevMembres =>
        prevMembres.map(membre =>
          membre.user?.id === userId
            ? {
                ...membre,
                user: {
                  ...membre.user,
                  ...updatedUser,
                  is_approved: true,
                  email_verified_at: updatedUser.email_verified_at,
                  is_blocked: false
                }
              }
            : membre
        )
      )

      toast({
        title: "Succès",
        description: "L'utilisateur a été approuvé avec succès",
      })

      // Pas besoin de refaire les appels API ici
    } catch (error) {
      console.error("Erreur lors de l'approbation:", error)
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Impossible d'approuver l'utilisateur",
        variant: "destructive",
      })
    }
  }

  /**
   * Bascule le statut de blocage d'un utilisateur
   */
  const handleBlockUser = async (userId: number) => {
    try {
      const user = (users || []).find(u => u.id === userId)
      if (!user) throw new Error("Utilisateur non trouvé")

      const updatedUser = await userService.toggleBlockUser(userId, user.is_blocked)
      
      if (!updatedUser) {
        throw new Error("Erreur lors du blocage/déblocage")
      }

      // Mise à jour des états locaux seulement
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId 
            ? { 
                ...user, 
                is_blocked: !user.is_blocked,
                is_approved: !user.is_blocked ? false : user.is_approved
              }
            : user
        )
      )

      setMembres(prevMembres =>
        prevMembres.map(membre =>
          membre.user?.id === userId
            ? {
                ...membre,
                user: {
                  ...membre.user,
                  is_blocked: !user.is_blocked,
                  is_approved: !user.is_blocked ? false : membre.user.is_approved
                }
              }
            : membre
        )
      )

      toast({
        title: "Succès",
        description: `L'utilisateur a été ${user.is_blocked ? 'débloqué' : 'bloqué'} avec succès`,
      })


    } catch (error) {
      console.error("Erreur lors du blocage/déblocage:", error)
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut de l'utilisateur",
        variant: "destructive",
      })
    }
  }

  /**
   * Supprime un membre
   */
  const handleDeleteMembre = async (membreId: number) => {
    try {
      if (!confirm("Êtes-vous sûr de vouloir supprimer ce membre ?")) return
      const success = await userService.deleteMembre(membreId)
      if (success) {
        setMembres((prev) => prev.filter((m) => m.id !== membreId))
        await fetchMembres()
        toast({
          title: "Succès",
          description: "Le membre a été supprimé avec succès",
        })
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le membre",
        variant: "destructive",
      })
    }
  }

  /**
   * Crée ou met à jour un membre
   */
  const handleSubmitMembre = async (data: MembreFormData) => {
    try {
      const savedMembre = await userService.saveMembre(data, selectedMembre?.id)
      if (savedMembre) {
        await fetchMembres()
        setShowCreateMembre(false)
        setSelectedMembre(null)
        setNewMembre(defaultMembreFormData)
        toast({
          title: "Succès",
          description: `Le membre a été ${selectedMembre ? "modifié" : "créé"} avec succès`,
        })
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: `Impossible de ${selectedMembre ? "modifier" : "créer"} le membre`,
        variant: "destructive",
      })
    }
  }

  /**
   * Bascule le statut d'appartenance au comité d'un membre
   */
  const handleToggleComite = async (membreId: number, isComite: boolean) => {
    try {
      const updatedMembre = await userService.updateMembreComite(membreId, isComite)
      
      if (!updatedMembre) {
        throw new Error("Erreur lors de la mise à jour du statut comité")
      }

      // Mise à jour de l'état local
      setMembres(prevMembres =>
        prevMembres.map(membre =>
          membre.id === membreId
            ? {
                ...membre,
                is_comite: isComite
              }
            : membre
        )
      )

      toast({
        title: "Succès",
        description: `Le membre a été ${isComite ? 'ajouté au' : 'retiré du'} comité avec succès`,
      })

      await fetchMembres()
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut comité:", error)
      toast({
        title: "Erreur",
        description: "Impossible de modifier le statut comité du membre",
        variant: "destructive",
      })
      await fetchMembres()
    }
  }

  // Initialisation
  useEffect(() => {
    const checkAuthAndLoad = async () => {
      try {
        // Vérifier l'authentification
        await axiosClient.get("/api/user")
        
        // Charger les données en parallèle
        await Promise.all([fetchUsers(), fetchMembres()])
      } catch (err) {
        console.error("Erreur lors de l'initialisation :", err)
        
        // Vérifier si c'est une erreur d'authentification
        const error = err as { response?: { status?: number } }
        if (error.response?.status === 401) {
          window.location.href = "/login"
        } else {
          // Pour les autres erreurs, afficher un message mais ne pas rediriger
          toast({
            title: "Erreur",
            description: "Impossible de charger les données",
            variant: "destructive",
          })
        }
      }
    }
    checkAuthAndLoad()
  }, [])

  return {
    // États
    searchTerm,
    setSearchTerm,
    users,
    membres: filteredMembres,
    isLoadingMembres,
    isLoadingUsers,
    selectedMembre,
    setSelectedMembre,
    showCreateMembre,
    setShowCreateMembre,
    newMembre,
    setNewMembre,
    stats,
    // Handlers
    handleApproveUser,
    handleBlockUser,
    handleDeleteMembre,
    handleSubmitMembre,
    handleToggleComite,
    handleRejectUser,
    handleUnblockUser
  }
} 