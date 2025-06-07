"use client"

import { Card, CardContent } from "@/components/ui/card"
import PengujiForm from "@/components/penguji-form"
import PengujiList from "@/components/penguji-list"
import { useFirebaseData } from "@/hooks/use-firebase-data"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import type { Penguji } from "@/lib/types"

export default function PengujiManager() {
  const { pengujis, loading, error, subscriptionStatus, addPenguji, updatePenguji, deletePenguji } = useFirebaseData()

  const [editingPenguji, setEditingPenguji] = useState<Penguji | null>(null)

  const handleAddPenguji = async (pengujiData: Omit<Penguji, "id">) => {
    try {
      await addPenguji(pengujiData)
    } catch (error: any) {
      console.error("Error adding penguji:", error)
      alert(error.message || "Gagal menambah ustadz/ustadzah")
    }
  }

  const handleUpdatePenguji = async (updatedPenguji: Penguji) => {
    try {
      await updatePenguji(updatedPenguji.id, updatedPenguji)
      setEditingPenguji(null)
    } catch (error: any) {
      console.error("Error updating penguji:", error)
      alert(error.message || "Gagal mengupdate ustadz/ustadzah")
    }
  }

  const handleDeletePenguji = async (pengujiId: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus ustadz/ustadzah ini?")) {
      try {
        await deletePenguji(pengujiId)
        if (editingPenguji?.id === pengujiId) {
          setEditingPenguji(null)
        }
      } catch (error: any) {
        console.error("Error deleting penguji:", error)
        alert(error.message || "Gagal menghapus ustadz/ustadzah")
      }
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Error: {error}</p>
        <Button onClick={() => window.location.reload()}>Coba Lagi</Button>
      </div>
    )
  }

  return (
    <>
      <Card className="mb-6">
        <CardContent className="p-6">
          <PengujiForm
            onAddPenguji={handleAddPenguji}
            onUpdatePenguji={handleUpdatePenguji}
            editingPenguji={editingPenguji}
            setEditingPenguji={setEditingPenguji}
            pengujis={pengujis}
            subscriptionStatus={subscriptionStatus}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <PengujiList pengujis={pengujis} onDeletePenguji={handleDeletePenguji} onEditPenguji={setEditingPenguji} />
        </CardContent>
      </Card>
    </>
  )
}
