import React from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
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
  onToggleComite: (id: number, isComite: boolean) => void;
}

export default function MemberActions({ 
  membre, 
  linkedUser, 
  onEdit, 
  onDelete, 
  onApprove, 
  onBlock,
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
            setLocalUser(prev => prev ? {
              ...prev,
              is_approved: true,
              email_verified_at: new Date().toISOString()
            } : null)
          }}
          className="flex items-center text-white bg-green-600 hover:bg-green-700"
        >
          <UserCheck className="w-3 h-3 mr-1" />
          Approuver
        </Button>
      )}

      {localUser && (
        <Button
          size="sm"
          variant={localUser.is_blocked ? "default" : "destructive"}
          onClick={() => {
            onBlock(localUser.id)
            setLocalUser(prev => prev ? {
              ...prev,
              is_blocked: !prev.is_blocked,
              is_approved: !prev.is_blocked ? false : prev.is_approved
            } : null)
          }}
          className={`flex items-center ${localUser.is_blocked ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-red-600 hover:bg-red-700 text-white'}`}
        >
          {localUser.is_blocked ? (
            <>
              <UserCheck className="w-3 h-3 mr-1" />
              Débloquer
            </>
          ) : (
            <>
              <UserX className="w-3 h-3 mr-1" />
              Bloquer
            </>
          )}
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
                                                  <Label>Email vérifié</Label>
                                                  <p className="text-sm text-gray-600">
                                                    {localUser.email_verified_at ? (
                                                      <>
                                                        <CheckCircle className="inline w-4 h-4 text-green-600 mr-1" />
                                                        Oui, le{" "}
                                                        {new Date(localUser.email_verified_at).toLocaleDateString(
                                                          "fr-FR",
                                                        )}
                                                      </>
                                                    ) : null}
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

            {/* Informations supplémentaires commentées
            <div>
              <Label>Biographie</Label>
              <p className="text-sm text-gray-600">{membre.biographie}</p>
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
            */}
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
          {/* Option pour gérer l'appartenance au comité */}
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
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
