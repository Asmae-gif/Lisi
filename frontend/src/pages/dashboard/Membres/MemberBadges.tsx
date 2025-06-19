import { Badge } from "@/components/ui/badge";
import { Link, Unlink, UserCheck, UserX, Clock } from "lucide-react";
import { User } from '@/types/membre';

interface UserStatusBadgeProps {
  hasUser: boolean;
  linkedUser?: User | null;
}

export const UserStatusBadge = ({ hasUser, linkedUser }: UserStatusBadgeProps) => {
  if (!hasUser || !linkedUser) {
    return (
      <Badge variant="secondary">
        <Unlink className="w-3 h-3 mr-1" />
        Pas de compte
      </Badge>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Badge variant="outline">
        <Link className="w-3 h-3 mr-1" />
        Compte lié
      </Badge>
      {getStatusBadge(linkedUser)}
    </div>
  );
};

export const getStatusBadge = (user: User) => {
  if (user.is_blocked) {
    return (
      <Badge variant="destructive">
        <UserX className="w-3 h-3 mr-1" />
        Bloqué
      </Badge>
    );
  }
  if (user.membre?.is_comite) {
    return (
      <Badge variant="default">
        <UserCheck className="w-3 h-3 mr-1" />
        Comité
      </Badge>
    );
  }
  return (
    <Badge variant="secondary">
      <Clock className="w-3 h-3 mr-1" />
      En attente
    </Badge>
  );
};
