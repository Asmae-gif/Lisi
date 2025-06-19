import  { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useAxes } from "../../../hooks/useAxes"
import { Axe, AxeFormData } from "@/types/axe"
import { AxeNotification } from "./AxeNotification"
import { AxesTable } from "./AxesTable"
import { AxeForm } from "./AxeForm"
import { AxeDetailsModal } from "./AxeDetailsModal"
import { AxiosError } from "axios"

export default function AxesDashboard() {
  const { axes, loading, createAxe, updateAxe, deleteAxe } = useAxes()
  const [viewingAxe, setViewingAxe] = useState<Axe | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingAxe, setEditingAxe] = useState<Axe | null>(null)
  const [notification, setNotification] = useState<{
    type: "success" | "error"
    message: string
  } | null>(null)

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 5000)
  }

  const openAddModal = () => {
    setEditingAxe(null)
    setIsModalOpen(true)
  }

  const openDetailsModal = (axe: Axe) => {
    setViewingAxe(axe)
    setIsDetailsModalOpen(true)
  }

  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false)
    setViewingAxe(null)
  }

  const openEditModal = (axe: Axe) => {
    setEditingAxe(axe)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingAxe(null)
  }

  const handleSubmit = async (formData: AxeFormData) => {
    try {
      if (editingAxe) {
        await updateAxe(editingAxe.id, formData)
        showNotification(
          "success", 
          `L'axe "${formData.title}" a été modifié avec succès. Les changements ont été enregistrés.`
        )
      } else {
        await createAxe(formData)
        showNotification(
          "success", 
          `Le nouvel axe "${formData.title}" a été créé avec succès.`
        )
      }
    } catch (error: unknown) {
      console.error("Erreur lors de la soumission:", error)
      
      if (error instanceof AxiosError && !error.response?.data?.errors) {
        showNotification(
          "error", 
          error.response?.data?.message || "Une erreur inattendue est survenue lors de l'enregistrement."
        )
      }
      throw error
    }
  }

  const handleDelete = async (axe: Axe) => {
    try {
      await deleteAxe(axe.id)
      showNotification(
        "success", 
        `L'axe "${axe.title}" a été supprimé avec succès.`
      )
    } catch (error: unknown) {
      console.error("Erreur lors de la suppression:", error)
      
      const errorMessage = error instanceof AxiosError && error.response?.data?.message 
        ? `Erreur lors de la suppression : ${error.response.data.message}`
        : "Une erreur est survenue lors de la suppression de l'axe. Veuillez réessayer."
      
      showNotification("error", errorMessage)
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestion des Axes</h1>
          <p className="text-muted-foreground">Gérez les axes de votre application</p>
        </div>
        <Button onClick={openAddModal} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Ajouter un axe
        </Button>
      </div>

      {/* Notification */}
      <AxeNotification 
        notification={notification} 
        onClose={() => setNotification(null)} 
      />

      {/* Tableau des axes */}
      <AxesTable
        axes={axes}
        loading={loading}
        onView={openDetailsModal}
        onEdit={openEditModal}
        onDelete={handleDelete}
      />

      {/* Modal de formulaire */}
      <AxeForm
        isOpen={isModalOpen}
        onClose={closeModal}
        editingAxe={editingAxe}
        onSubmit={handleSubmit}
      />

      {/* Modal de détails */}
      <AxeDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={closeDetailsModal}
        axe={viewingAxe}
        onEdit={openEditModal}
      />
    </div>
  )
}