import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Axe } from "@/types/axe"

interface AxeDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  axe: Axe | null
  onEdit: (axe: Axe) => void
}

export const AxeDetailsModal = ({ isOpen, onClose, axe, onEdit }: AxeDetailsModalProps) => {
  if (!axe) return null

  const renderLanguageContent = (lang: 'fr' | 'en' | 'ar', label: string) => (
    <TabsContent value={lang} className="space-y-6">
      {/* Titre */}
      <div className="space-y-2">
        <Label className="text-lg font-semibold text-gray-700">Titre ({label})</Label>
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-lg font-medium" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            {axe[`title_${lang}`] || 'Non renseigné'}
          </p>
        </div>
      </div>

      {/* Problématique */}
      <div className="space-y-2">
        <Label className="text-lg font-semibold text-blue-700">Problématique ({label})</Label>
        <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            {axe[`problematique_${lang}`] || 'Non renseigné'}
          </p>
        </div>
      </div>

      {/* Objectif */}
      <div className="space-y-2">
        <Label className="text-lg font-semibold text-green-700">Objectif ({label})</Label>
        <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            {axe[`objectif_${lang}`] || 'Non renseigné'}
          </p>
        </div>
      </div>

      {/* Approche */}
      <div className="space-y-2">
        <Label className="text-lg font-semibold text-purple-700">Approche ({label})</Label>
        <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            {axe[`approche_${lang}`] || 'Non renseigné'}
          </p>
        </div>
      </div>

      {/* Résultats attendus */}
      <div className="space-y-2">
        <Label className="text-lg font-semibold text-orange-700">Résultats attendus ({label})</Label>
        <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
            {axe[`resultats_attendus_${lang}`] || 'Non renseigné'}
          </p>
        </div>
      </div>
    </TabsContent>
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Détails de l'axe : {axe.title_fr || axe.title_en || axe.title_ar || 'Sans titre'}
          </DialogTitle>
          <DialogDescription>
            Informations complètes sur l'axe dans les trois langues
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Informations générales */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <Label className="text-sm font-semibold text-gray-600">Slug</Label>
              <Badge variant="secondary" className="mt-1">
                {axe.slug}
              </Badge>
            </div>
            <div>
              <Label className="text-sm font-semibold text-gray-600">Date de création</Label>
              <p className="text-sm text-gray-600">
                {new Date(axe.created_at).toLocaleDateString("fr-FR")}
              </p>
            </div>
          </div>

          {/* Contenu multilingue */}
          <Tabs defaultValue="fr" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="fr">Français</TabsTrigger>
              <TabsTrigger value="en">English</TabsTrigger>
              <TabsTrigger value="ar">العربية</TabsTrigger>
            </TabsList>
            
            {renderLanguageContent('fr', 'Français')}
            {renderLanguageContent('en', 'English')}
            {renderLanguageContent('ar', 'العربية')}
          </Tabs>

          {/* Métadonnées */}
          <div className="pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
              <div>
                <Label className="font-semibold">Dernière modification</Label>
                <p>
                  {new Date(axe.updated_at).toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div>
                <Label className="font-semibold">ID</Label>
                <p>#{axe.id}</p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
          <Button
            onClick={() => {
              onClose()
              onEdit(axe)
            }}
          >
            Modifier cet axe
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
