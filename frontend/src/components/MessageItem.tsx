import React, { useState } from 'react';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Mail, Eye, EyeOff, Trash2, Check, X } from "lucide-react";
import { ContactMessage, contactAPI } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

interface MessageItemProps {
  message: ContactMessage;
}

const MessageItem = ({ message }: MessageItemProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Utiliser directement message.isRead au lieu d'un état local
  const isRead = !!message.is_read;

  const toggleReadMutation = useMutation({
    mutationFn: () => contactAPI.toggleRead(message.id),
    onSuccess: () => {
      // Invalider et refetch les données
      queryClient.invalidateQueries({ queryKey: ["contactMessages"] });
      toast({
        title: isRead ? "Message marqué comme non lu" : "Message marqué comme lu",
        description: "Le statut du message a été mis à jour."
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut du message.",
        variant: "destructive"
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: () => contactAPI.deleteMessage(message.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contactMessages"] });
      toast({
        title: "Message supprimé",
        description: "Le message a été supprimé avec succès."
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le message.",
        variant: "destructive"
      });
    }
  });

  return (
    <>
      <Card
        className={`transition-all duration-200 hover:shadow-md ${
          isRead ? "opacity-75" : "ring-2 ring-blue-200"
        }`}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-500" />
                <span className="font-medium">{message.name}</span>
              </div>
              <Badge variant={isRead ? "secondary" : "default"}>
                {isRead ? "Lu" : "Non lu"}
              </Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost"
                size="sm"
                onClick={() => toggleReadMutation.mutate()}
                disabled={toggleReadMutation.isPending}
              >
                {isRead ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteMutation.mutate()}
                disabled={deleteMutation.isPending}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Mail className="h-3 w-3" />
              <span>
                {format(new Date(message.created_at), "PPP 'à' p", {
                  locale: fr
                })}
              </span>
            </div>
            <div className="text-sm">
              <span className="font-medium">Email :</span> {message.email}
            </div>
            <div className="text-sm">
              <span className="font-medium">Sujet :</span> {message.subject}
            </div>
            <div className="mt-3">
              <p className="text-sm text-gray-700 line-clamp-3">
                {message.message}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDetails(true)}
              className="mt-2"
            >
              Voir le détail
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Message de {message.name}</DialogTitle>
            <DialogDescription>
              Reçu le{" "}
              {format(new Date(message.created_at), "PPP 'à' p", {
                locale: fr
              })}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 text-sm">
            <div>
              <span className="font-medium">Email :</span> {message.email}
            </div>
            <div>
              <span className="font-medium">Sujet :</span> {message.subject}
            </div>
            <div>
              <span className="font-medium">Message :</span>
              <p className="mt-2 p-3 bg-gray-50 rounded-md whitespace-pre-wrap">
                {message.message}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MessageItem;
