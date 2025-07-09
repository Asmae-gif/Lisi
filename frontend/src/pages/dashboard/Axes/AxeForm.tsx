import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Axe, AxeFormData, createEmptyAxeFormData } from "@/types/axe"
import { AxiosError } from "axios"
import { Brain, Shield, Network, Database, Smartphone,SatelliteDish,Eye,Mic, MessageCircle,Bot } from "lucide-react"

const ICON_OPTIONS = [
  { value: "Brain", label: "Intelligence Artificielle", icon: Brain },
  { value: "Shield", label: "Cybersécurité", icon: Shield },
  { value: "Network", label: "Systèmes Réseaux", icon: Network },
  { value: "Database", label: "Big Data & Systèmes d'Information", icon: Database },
  { value: "Smartphone", label: "IoT & Objets Connectés", icon: Smartphone },
  { value: "SatelliteDish", label: "Télécommunications & Hyperfréquences", icon: SatelliteDish },
  { value: "Eye", label: "Vision par Ordinateur", icon: Eye },
  { value: "Mic", label: "Traitement de la Parole", icon: Mic },
  { value: "MessageCircle", label: "Communication & NLP", icon: MessageCircle },
  { value: "Bot", label: "Systèmes Intelligents & Robotique", icon: Bot },
];

interface AxeFormProps {
  isOpen: boolean
  onClose: () => void
  editingAxe: Axe | null
  onSubmit: (formData: Record<string, unknown>) => Promise<void>
}

export const AxeForm = ({ isOpen, onClose, editingAxe, onSubmit }: AxeFormProps) => {
  const [formData, setFormData] = useState<AxeFormData>(createEmptyAxeFormData())
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [submitting, setSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState("fr")

  useEffect(() => {
    if (editingAxe) {
      setFormData({
        title_fr: editingAxe.title_fr || '',
        title_en: editingAxe.title_en || '',
        title_ar: editingAxe.title_ar || '',
        slug: editingAxe.slug,
        icon: editingAxe.icon || "",
        problematique_fr: editingAxe.problematique_fr || '',
        problematique_en: editingAxe.problematique_en || '',
        problematique_ar: editingAxe.problematique_ar || '',
        objectif_fr: editingAxe.objectif_fr || '',
        objectif_en: editingAxe.objectif_en || '',
        objectif_ar: editingAxe.objectif_ar || '',
        approche_fr: editingAxe.approche_fr || '',
        approche_en: editingAxe.approche_en || '',
        approche_ar: editingAxe.approche_ar || '',
        resultats_attendus_fr: editingAxe.resultats_attendus_fr || '',
        resultats_attendus_en: editingAxe.resultats_attendus_en || '',
        resultats_attendus_ar: editingAxe.resultats_attendus_ar || '',
      })
    } else {
      setFormData(createEmptyAxeFormData())
    }
    setErrors({})
  }, [editingAxe, isOpen])

  const handleInputChange = (field: keyof AxeFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Générer le slug à partir du titre français
    if (field === "title_fr") {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim()
      setFormData((prev) => ({ ...prev, slug }))
    }

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: [] }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setErrors({})

    try {
      await onSubmit(formData as unknown as Record<string, unknown>)
      onClose()
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response?.data?.errors) {
        setErrors(error.response.data.errors)
      }
    } finally {
      setSubmitting(false)
    }
  }

  const renderLanguageTab = (lang: 'fr' | 'en' | 'ar', label: string) => (
    <TabsContent value={lang} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={`title_${lang}`}>Titre ({label}) *</Label>
        <Input
          id={`title_${lang}`}
          value={formData[`title_${lang}`]}
          onChange={(e) => handleInputChange(`title_${lang}` as keyof AxeFormData, e.target.value)}
          placeholder={`Titre de l'axe en ${label}`}
          className={errors[`title_${lang}`] ? "border-red-500" : ""}
        />
        {errors[`title_${lang}`] && <p className="text-sm text-red-500">{errors[`title_${lang}`][0]}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor={`problematique_${lang}`}>Problématique ({label}) *</Label>
        <Textarea
          id={`problematique_${lang}`}
          value={formData[`problematique_${lang}`]}
          onChange={(e) => handleInputChange(`problematique_${lang}` as keyof AxeFormData, e.target.value)}
          placeholder={`Décrivez la problématique en ${label}...`}
          rows={3}
          className={errors[`problematique_${lang}`] ? "border-red-500" : ""}
        />
        {errors[`problematique_${lang}`] && <p className="text-sm text-red-500">{errors[`problematique_${lang}`][0]}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor={`objectif_${lang}`}>Objectif ({label}) *</Label>
        <Textarea
          id={`objectif_${lang}`}
          value={formData[`objectif_${lang}`]}
          onChange={(e) => handleInputChange(`objectif_${lang}` as keyof AxeFormData, e.target.value)}
          placeholder={`Décrivez l'objectif en ${label}...`}
          rows={3}
          className={errors[`objectif_${lang}`] ? "border-red-500" : ""}
        />
        {errors[`objectif_${lang}`] && <p className="text-sm text-red-500">{errors[`objectif_${lang}`][0]}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor={`approche_${lang}`}>Approche ({label}) *</Label>
        <Textarea
          id={`approche_${lang}`}
          value={formData[`approche_${lang}`]}
          onChange={(e) => handleInputChange(`approche_${lang}` as keyof AxeFormData, e.target.value)}
          placeholder={`Décrivez l'approche en ${label}...`}
          rows={3}
          className={errors[`approche_${lang}`] ? "border-red-500" : ""}
        />
        {errors[`approche_${lang}`] && <p className="text-sm text-red-500">{errors[`approche_${lang}`][0]}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor={`resultats_attendus_${lang}`}>Résultats Attendus ({label}) *</Label>
        <Textarea
          id={`resultats_attendus_${lang}`}
          value={formData[`resultats_attendus_${lang}`]}
          onChange={(e) => handleInputChange(`resultats_attendus_${lang}` as keyof AxeFormData, e.target.value)}
          placeholder={`Décrivez les résultats attendus en ${label}...`}
          rows={3}
          className={errors[`resultats_attendus_${lang}`] ? "border-red-500" : ""}
        />
        {errors[`resultats_attendus_${lang}`] && <p className="text-sm text-red-500">{errors[`resultats_attendus_${lang}`][0]}</p>}
      </div>
    </TabsContent>
  )

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingAxe ? "Modifier l'axe" : "Ajouter un nouvel axe"}</DialogTitle>
          <DialogDescription>
            {editingAxe
              ? "Modifiez les informations de l'axe dans les trois langues ci-dessous."
              : "Remplissez les informations pour créer un nouvel axe dans les trois langues."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Champs communs */}
        
            <div className="space-y-2">
              <Label>Icône *</Label>
              <div className="flex gap-3 flex-wrap">
                {ICON_OPTIONS.map(opt => (
                  <button
                    type="button"
                    key={opt.value}
                    className={`p-2 border rounded ${formData.icon === opt.value ? "border-primary bg-primary/10" : "border-gray-200"}`}
                    onClick={() => handleInputChange("icon", opt.value)}
                  >
                    <opt.icon className="w-6 h-6" />
                    <div className="text-xs">{opt.label}</div>
                  </button>
                ))}
              </div>
              {errors.icon && <p className="text-sm text-red-500">{errors.icon[0]}</p>}
            </div>
         

          {/* Onglets multilingues */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="fr">Français</TabsTrigger>
              <TabsTrigger value="en">English</TabsTrigger>
              <TabsTrigger value="ar">العربية</TabsTrigger>
            </TabsList>
            
            {renderLanguageTab('fr', 'Français')}
            {renderLanguageTab('en', 'English')}
            {renderLanguageTab('ar', 'العربية')}
          </Tabs>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Enregistrement..." : editingAxe ? "Modifier" : "Créer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}