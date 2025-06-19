import { TableCell, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Membre, User } from '@/types/membre';
import MemberActions from '../../../archive/MemberActions';

interface MemberRowProps {
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

export default function MemberRow({ 
  membre, 
  linkedUser, 
  onEdit, 
  onDelete, 
  onApprove, 
  onReject,
  onUnblock,
  onBlock,
  onToggleComite
}: MemberRowProps) {
  return (
    <TableRow key={membre.id}>
      {/* Nom + avatar + email */}
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={typeof membre.photo === 'string' ? membre.photo : undefined} />
            <AvatarFallback>
              {membre.prenom[0]}
              {membre.nom[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">
              {membre.prenom} {membre.nom}
            </p>
            
            {/* Email */}
            <p className="text-sm text-gray-500">{membre.email}</p>
            <p className="text-sm text-gray-500">{membre.statut}</p>
          </div>
        </div>
      </TableCell>    

      {/* Grade - COMMENTÉ */}
      {/* <TableCell>
        <Badge variant="outline">{membre.grade}</Badge>
      </TableCell> */}

      {/* Statut du membre - COMMENTÉ */}
      {/* <TableCell>
        <Badge variant="outline">
          {membre.statut}
        </Badge>
      </TableCell> */}

      {/* Statut du compte - COMMENTÉ */}
      {/* <TableCell>
        <UserStatusBadge hasUser={!!linkedUser} linkedUser={linkedUser} />
      </TableCell> */}

      {/* Actions */}
      <TableCell>
        <MemberActions
          membre={membre}
          linkedUser={linkedUser}
          onEdit={onEdit}
          onDelete={onDelete}
          onApprove={onApprove}
          onBlock={onBlock}
          onToggleComite={onToggleComite}
        />
      </TableCell>
    </TableRow>
  );
}