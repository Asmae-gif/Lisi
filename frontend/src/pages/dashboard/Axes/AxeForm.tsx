import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Axe, AxeFormData } from "@/types/axe"
import { AxiosError } from "axios"
import { Brain, Shield, Network, Database, Smartphone } from "lucide-react"

const ICON_OPTIONS = [
  { value: "Brain", label: "Intelligence Artificielle", icon: Brain },
  { value: "Shield", label: "Cybersécurité", icon: Shield },
  { value: "Network", label: "Systèmes", icon: Network },
  { value: "Database", label: "Big Data", icon: Database },
  { value: "Smartphone", label: "IoT", icon: Smartphone },
];

interface AxeFormProps {
  isOpen: boolean
  onClose: () => void
  editingAxe: Axe | null
  onSubmit: (formData: AxeFormData) => Promise<void>
}

export const AxeForm = ({ isOpen, onClose, editingAxe, onSubmit }: AxeFormProps) => {
  const [formData, setFormData] = useState<AxeFormData>({
    title: "",
    slug: "",
    icon: "Brain",
    problematique: "",
    objectif: "",
    approche: "",
    resultats_attendus: "",
  })
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (editingAxe) {
      setFormData({
        title: editingAxe.title,
        slug: editingAxe.slug,
        icon: editingAxe.icon || "",
        problematique: editingAxe.problematique,
        objectif: editingAxe.objectif,
        approche: editingAxe.approche,
        resultats_attendus: editingAxe.resultats_attendus,
      })
    } else {
      setFormData({
        title: "",
        slug: "",
        icon: "",
        problematique: "",
        objectif: "",
        approche: "",
        resultats_attendus: "",
      })
    }
    setErrors({})
  }, [editingAxe, isOpen])

  const handleInputChange = (field: keyof AxeFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    if (field === "title") {
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
      await onSubmit(formData)
      onClose()
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response?.data?.errors) {
        setErrors(error.response.data.errors)
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingAxe ? "Modifier l'axe" : "Ajouter un nouvel axe"}</DialogTitle>
          <DialogDescription>
            {editingAxe
              ? "Modifiez les informations de l'axe ci-dessous."
              : "Remplissez les informations pour créer un nouvel axe."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Titre de l'axe"
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && <p className="text-sm text-red-500">{errors.title[0]}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => handleInputChange("slug", e.target.value)}
                placeholder="slug-de-l-axe"
                className={errors.slug ? "border-red-500" : ""}
              />
              {errors.slug && <p className="text-sm text-red-500">{errors.slug[0]}</p>}
            </div>
          </div>

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

          <div className="space-y-2">
            <Label htmlFor="problematique">Problématique *</Label>
            <Textarea
              id="problematique"
              value={formData.problematique}
              onChange={(e) => handleInputChange("problematique", e.target.value)}
              placeholder="Décrivez la problématique de cet axe..."
              rows={3}
              className={errors.problematique ? "border-red-500" : ""}
            />
            {errors.problematique && <p className="text-sm text-red-500">{errors.problematique[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="objectif">Objectif *</Label>
            <Textarea
              id="objectif"
              value={formData.objectif}
              onChange={(e) => handleInputChange("objectif", e.target.value)}
              placeholder="Décrivez l'objectif de cet axe..."
              rows={3}
              className={errors.objectif ? "border-red-500" : ""}
            />
            {errors.objectif && <p className="text-sm text-red-500">{errors.objectif[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="approche">Approche *</Label>
            <Textarea
              id="approche"
              value={formData.approche}
              onChange={(e) => handleInputChange("approche", e.target.value)}
              placeholder="Décrivez l'approche pour cet axe..."
              rows={3}
              className={errors.approche ? "border-red-500" : ""}
            />
            {errors.approche && <p className="text-sm text-red-500">{errors.approche[0]}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="resultats_attendus">Résultats attendus *</Label>
            <Textarea
              id="resultats_attendus"
              value={formData.resultats_attendus}
              onChange={(e) => handleInputChange("resultats_attendus", e.target.value)}
              placeholder="Décrivez les résultats attendus..."
              rows={3}
              className={errors.resultats_attendus ? "border-red-500" : ""}
            />
            {errors.resultats_attendus && <p className="text-sm text-red-500">{errors.resultats_attendus[0]}</p>}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={submitting}>
              Annuler
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {editingAxe ? "Modification..." : "Ajout..."}
                </div>
              ) : editingAxe ? (
                "Modifier"
              ) : (
                "Ajouter"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}