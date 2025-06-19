// services/userService.ts

import axiosClient from "@/services/axiosClient";
import { toast } from "@/components/ui/use-toast";
import type { User, Membre, MembreFormData, ApiResponse } from "@/types/membre"; 
import { convertMembre } from '@/types/membre'

/**
 * Service pour la gestion des utilisateurs et des membres
 * Ce service gère les opérations CRUD sur les utilisateurs et les membres
 */

/**
 * Récupère la liste des utilisateurs
 * @returns Liste des utilisateurs ou tableau vide en cas d'erreur
 */

export const getUsers = async (): Promise<User[]> => {
  try {
    const res = await axiosClient.get<{ data: User[] }>("/api/admin/users");
    return res.data.data;
  } catch (err: unknown) {
    console.error("Erreur lors de la récupération des utilisateurs :", err);
    throw err;
  }
};

/**
 * Récupère la liste des membres
 * @returns Liste des membres ou tableau vide en cas d'erreur
 */
export const getMembres = async (): Promise<Membre[]> => {
  try {
    const res = await axiosClient.get("/api/membres");
    
    let membresArray: unknown[] = [];
    
    // Normalisation des différentes structures de réponse possibles
    if (res.data && typeof res.data === "object") {
      if (Array.isArray(res.data)) {
        membresArray = res.data;
      } else if (Array.isArray(res.data.data)) {
        membresArray = res.data.data;
      } else if (Array.isArray(res.data.data?.membres)) {
        membresArray = res.data.data.membres;
      } else if (typeof res.data.data === "object") {
        membresArray = Object.values(res.data.data);
      }
    }

    // On convertit seulement si ce n'est pas déjà un Membre
    return membresArray.map((item) => {
      return (item && typeof item === 'object' && 'id' in item && 'nom' in item && 'prenom' in item) ? item as Membre : convertMembre(item as Record<string, unknown>);
    });
  } catch (err) {
    const error = err as { response?: { data?: { message?: string } } };
    console.error("Erreur récupération membres :", error?.response || err);
    toast({
      title: "Erreur",
      description: "Impossible de récupérer les membres",
      variant: "destructive",
    });
    return [];
  }
};

/**
 * Approuve un utilisateur
 * @param userId - ID de l'utilisateur à approuver
 * @returns Utilisateur mis à jour ou null en cas d'erreur
 */
export const approveUser = async (userId: number): Promise<User | null> => {
  try {
    const response = await axiosClient.post(`/api/admin/users/${userId}/approve`);
    
    if (response.data.status === 'success' && response.data.data) {
      const userData = response.data.data;
      return {
        id: userData.id,
        name: userData.name || '',
        email: userData.email,
        email_verified_at: userData.email_verified_at || new Date().toISOString(),
        is_approved: true,
        is_blocked: false,
        created_at: userData.created_at,
        updated_at: userData.updated_at,
        roles: userData.roles || [],
        membre: userData.membre ? convertMembre(userData.membre) : null
      };
    }
    
    console.error("Réponse inattendue:", response.data);
    return null;
  } catch (err) {
    const error = err as { response?: { data?: { message?: string } } };
    console.error("Erreur lors de l'approbation:", error);
    throw new Error(error.response?.data?.message || "Une erreur est survenue lors de l'approbation");
  }
};

/**
 * Bascule le statut de blocage d'un utilisateur
 * @param userId - ID de l'utilisateur
 * @param isBlocked - État actuel du blocage
 * @returns Utilisateur mis à jour ou null en cas d'erreur
 */
export const toggleBlockUser = async (userId: number, isBlocked: boolean): Promise<User | null> => {
  try {
    const response = await axiosClient.post(`/api/admin/users/${userId}/block`);
    return response.data.data;
  } catch (err) {
    const error = err as { response?: { data?: { message?: string } } };
    console.error("Erreur lors du blocage/déblocage :", error);
    throw new Error(error.response?.data?.message || "Impossible de modifier ce statut");
  }
};

/**
 * Supprime un membre
 * @param membreId - ID du membre à supprimer
 * @returns true si la suppression a réussi
 */
export const deleteMembre = async (membreId: number): Promise<boolean> => {
  try {
    await axiosClient.delete(`/api/admin/membres/${membreId}`);
    return true;
  } catch (err) {
    const error = err as { response?: { data?: { message?: string } } };
    console.error("Erreur lors de la suppression :", error);
    throw new Error(error.response?.data?.message || "Impossible de supprimer ce membre");
  }
};

/**
 * Crée ou met à jour un membre
 * @param data - Données du membre
 * @param membreId - ID du membre pour la mise à jour (optionnel)
 * @returns Membre créé/mis à jour ou null en cas d'erreur
 */
export const saveMembre = async (data: MembreFormData, membreId?: number): Promise<Membre | null> => {
  try {
    const formData = new FormData();
    
    // Ajout des champs au FormData
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        formData.append(key, value.toString());
      }
    });

    // Champs supplémentaires pour la création
    if (!membreId) {
      formData.append('password', 'temp_password_' + Date.now());
      formData.append('create_user', 'false');
    }

    const response = membreId
      ? await axiosClient.post(`/api/admin/membres/${membreId}`, formData, {
          params: { _method: "PUT" },
        })
      : await axiosClient.post("/api/admin/membres", formData);

    return response.data.data ? convertMembre(response.data.data) : null;
  } catch (err) {
    const error = err as { response?: { data?: { message?: string } } };
    console.error("Erreur lors de l'enregistrement :", error);
    throw new Error(error.response?.data?.message || "Impossible de sauvegarder le membre");
  }
};

/**
 * Bascule le statut d'appartenance au comité d'un membre
 * @param membreId - ID du membre
 * @param isComite - Nouveau statut d'appartenance au comité
 * @returns Membre mis à jour ou null en cas d'erreur
 */
export const updateMembreComite = async (membreId: number, isComite: boolean): Promise<Membre | null> => {
  try {
    const response = await axiosClient.post(`/api/admin/membres/${membreId}/toggle-comite`, {
      is_comite: isComite,
    });
    
    if (response.data && response.data.data) {
      return convertMembre(response.data.data);
    }
    return null;
  } catch (err) {
    const error = err as { response?: { data?: { message?: string } } };
    console.error("Erreur mise à jour statut comité:", error);
    throw new Error(error.response?.data?.message || "Impossible de mettre à jour le statut comité");
  }
};

/**
 * Rejette un utilisateur
 * @param userId - ID de l'utilisateur à rejeter
 * @returns true si le rejet a réussi
 */
export const rejectUser = async (userId: number): Promise<boolean> => {
  try {
    await axiosClient.post(`/api/admin/users/${userId}/reject`);
    return true;
  } catch (err) {
    const error = err as { response?: { data?: { message?: string } } };
    console.error("Erreur lors du rejet :", error);
    throw new Error(error.response?.data?.message || "Impossible de rejeter cet utilisateur");
  }
};

/**
 * Débloque un utilisateur
 * @param userId - ID de l'utilisateur à débloquer
 * @returns true si le déblocage a réussi
 */
export const unblockUser = async (userId: number): Promise<boolean> => {
  try {
    await axiosClient.post(`/api/admin/users/${userId}/unblock`);
    return true;
  } catch (err) {
    const error = err as { response?: { data?: { message?: string } } };
    console.error("Erreur lors du déblocage :", error);
    throw new Error(error.response?.data?.message || "Impossible de débloquer cet utilisateur");
  }
};
