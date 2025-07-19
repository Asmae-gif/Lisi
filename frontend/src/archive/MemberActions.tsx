import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Eye, Edit, Trash2, UserCheck, UserX, Link, Unlink } from "lucide-react";
import { Membre, User } from '@/types/membre';
import { MoreHorizontal } from "lucide-react";
import { CheckCircle } from "lucide-react";

interface MemberActionsProps {
  membre: Membre;
  linkedUser: User | null;
  onEdit: (membre: Membre) => void;
  onDelete: (id: number) => void;
  onApprove: (id: number) => void;
  onBlock: (id: number) => void;
  onReject: (id: number) => void;
  onUnblock: (id: number) => void;
  onToggleComite: (id: number, isComite: boolean) => void;
}

export default function MemberActions({ 
  membre, 
  linkedUser, 
  onEdit, 
  onDelete, 
  onApprove, 
  onBlock,
  onReject,
  onUnblock,
  onToggleComite 
}: MemberActionsProps) {
  const [localUser, setLocalUser] = React.useState(linkedUser)
  const [isComite, setIsComite] = React.useState(membre.is_comite)

  React.useEffect(() => {
    setLocalUser(linkedUser)
    setIsComite(membre.is_comite)
  }, [linkedUser, membre.is_comite])

  return (
    <div className="flex gap-2">
      {/* Actions d'approbation/rejet mises en évidence */}
      {localUser && !localUser.is_approved && !localUser.is_blocked && (
        <Button
          size="sm"
          variant="default"
          onClick={() => {
            onApprove(localUser.id)
            setLocalUser((prev) => ({
              ...prev,
              is_approved: true,
              email_verified_at: new Date().toISOString(),
            }));
          }}
          className="flex items-center text-white bg-green-600 hover:bg-green-700"
        >
          <UserCheck className="w-3 h-3 mr-1" />
          Approuver
        </Button>
      )}


      {/* Voir le profil du membre */}
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm" variant="ghost">
            <Eye className="w-3 h-3" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Profil du membre</DialogTitle>
            <DialogDescription>
              Informations détaillées sur le membre et son compte utilisateur
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={typeof membre.photo === 'string' ? membre.photo : undefined} />
                <AvatarFallback className="text-lg">
                  {membre.prenom[0]}
                  {membre.nom[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">
                  {membre.prenom} {membre.nom}
                </h3>
                <p className="text-gray-600">{membre.email}</p>
                <div className="flex gap-2 mt-2">
                  {localUser && localUser.is_approved ? (
                    <Badge variant="outline">
                      <Link className="w-3 h-3 mr-1" />
                      Compte lié
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <Unlink className="w-3 h-3 mr-1" />
                      Pas de compte
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Email</Label>
                <p className="text-sm text-gray-600">{membre.email}</p>
              </div>
            </div>

{/* Informations du compte utilisateur si lié */}
{localUser && (
  <div className="border-t pt-4">
    <h4 className="font-medium mb-2">Informations du compte</h4>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <Label>Statut d'approbation</Label>
        <p className="text-sm text-gray-600">
          {localUser.is_approved ? (
            <>
              <CheckCircle className="inline w-4 h-4 text-green-600 mr-1" />
              Approuvé
            </>
          ) : (
            <>
              <UserX className="inline w-4 h-4 text-red-600 mr-1" />
              En attente
            </>
          )}
        </p>
      </div>
      <div>
        <Label>Statut de blocage</Label>
        <p className="text-sm text-gray-600">
          {localUser.is_blocked ? (
            <>
              <UserX className="inline w-4 h-4 text-red-600 mr-1" />
              Bloqué
            </>
          ) : (
            <>
              <CheckCircle className="inline w-4 h-4 text-green-600 mr-1" />
              Actif
            </>
          )}
        </p>
      </div>
      <div>
        <Label>Email vérifié</Label>
        <p className="text-sm text-gray-600">
              {localUser.is_approved && !isNaN(new Date(localUser.email_verified_at).getTime()) ? (
          <>
            <CheckCircle className="inline w-4 h-4 text-green-600 mr-1" />
            Oui, le {new Date(localUser.email_verified_at).toLocaleDateString("fr-FR")}
          </>
        ) : (
          <>
            <UserX className="inline w-4 h-4 text-red-600 mr-1" />
            Non vérifié
          </>
        )}
        </p>
      </div>
      <div>
        <Label>Date de création</Label>
        <p className="text-sm text-gray-600">
          {new Date(localUser.created_at).toLocaleDateString("fr-FR")}
        </p>
      </div>
    </div>
  </div>
)}

            {/* Informations supplémentaires commentées? */}
            <div>
              <Label>Biographie</Label>
              <p className="text-sm text-gray-600">{membre.biographie|| "Non renseigné"}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>LinkedIn</Label>
                <p className="text-sm text-gray-600">{membre.linkedin || "Non renseigné"}</p>
              </div>
              <div>
                <Label>ResearchGate</Label>
                <p className="text-sm text-gray-600">{membre.researchgate || "Non renseigné"}</p>
              </div>
            </div>

            <div>
              <Label>Google Scholar</Label>
              <p className="text-sm text-gray-600">{membre.google_scholar || "Non renseigné"}</p>
            </div>
            
          </div>
        </DialogContent>
      </Dialog>

      {/* Modifier le membre */}
      <Button
        size="sm"
        variant="ghost"
        onClick={() => onEdit(membre)}
      >
        <Edit className="w-3 h-3" />
      </Button>

      {/* Supprimer le membre */}
      <Button
        size="sm"
        variant="ghost"
        onClick={() => onDelete(membre.id)}
      >
        <Trash2 className="w-3 h-3" />
      </Button>

      {/* Menu déroulant pour actions supplémentaires */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm" variant="ghost">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {/* Bouton d'approbation pour les utilisateurs non approuvés */}
          {localUser && !localUser.is_approved && !localUser.is_blocked && (
            <DropdownMenuItem
              onClick={() => {
                onApprove(localUser.id)
                setLocalUser(prev => prev ? {
                  ...prev,
                  is_approved: true,
                  email_verified_at: new Date().toISOString()
                } : null)
              }}
              className="flex items-center text-green-600"
            >
              <UserCheck className="w-4 h-4 mr-2" />
              Approuver
            </DropdownMenuItem>
          )}

          {/* Bouton de blocage/déblocage */}
          {localUser && (
            <DropdownMenuItem
              onClick={() => {
                if (localUser.is_blocked) {
                  onUnblock(localUser.id)
                  setLocalUser(prev => prev ? {
                    ...prev,
                    is_blocked: false
                  } : null)
                } else {
                  onBlock(localUser.id)
                  setLocalUser(prev => prev ? {
                    ...prev,
                    is_blocked: true,
                    is_approved: false
                  } : null)
                }
              }}
              className={`flex items-center ${localUser.is_blocked ? 'text-green-600' : 'text-red-600'}`}
            >
              {localUser.is_blocked ? (
                <>
                  <UserCheck className="w-4 h-4 mr-2" />
                  Débloquer
                </>
              ) : (
                <>
                  <UserX className="w-4 h-4 mr-2" />
                  Bloquer
                </>
              )}
            </DropdownMenuItem>
          )}

          {/* Bouton de rejet pour les utilisateurs non approuvés */}
          {localUser && !localUser.is_approved && !localUser.is_blocked && (
            <DropdownMenuItem
              onClick={() => {
                onReject(localUser.id)
                setLocalUser(prev => prev ? {
                  ...prev,
                  is_approved: false
                } : null)
              }}
              className="flex items-center text-red-600"
            >
              <UserX className="w-4 h-4 mr-2" />
              Rejeter
            </DropdownMenuItem>
          )}

          {/* Option pour gérer l'appartenance au comité - COMMENTÉE */}
          {/*
          <DropdownMenuItem
            onClick={() => {
              onToggleComite(membre.id, !isComite)
              setIsComite(!isComite)
            }}
            className={`flex items-center ${isComite ? 'text-blue-600' : 'text-gray-600'}`}
          >
            {isComite ? (
              <>
                <UserX className="w-4 h-4 mr-2" />
                Retirer du comité
              </>
            ) : (
              <>
                <UserCheck className="w-4 h-4 mr-2" />
                Ajouter au comité
              </>
            )}
          </DropdownMenuItem>
          */}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
