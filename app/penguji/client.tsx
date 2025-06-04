"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import PengujiForm from "@/components/penguji-form"
import PengujiList from "@/components/penguji-list"
import type { Penguji } from "@/lib/types"
import { useLocalStorage } from "@/hooks/use-local-storage"

const STORAGE_KEY = "pengujiData"

export default function PengujiManager() {
  const [pengujis, setPengujis] = useLocalStorage<Penguji[]>(STORAGE_KEY, [])
  const [editingPenguji, setEditingPenguji] = useState<Penguji | null>(null)

  const handleAddPenguji = (penguji: Penguji) => {
    setPengujis([...pengujis, penguji])
  }

  const handleUpdatePenguji = (updatedPenguji: Penguji) => {
    setPengujis(pengujis.map((p) => (p.id === updatedPenguji.id ? updatedPenguji : p)))
    setEditingPenguji(null)
  }

  const handleDeletePenguji = (pengujiId: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus ustadz/ustadzah ini?")) {
      setPengujis(pengujis.filter((p) => p.id !== pengujiId))
      if (editingPenguji?.id === pengujiId) {
        setEditingPenguji(null)
      }
    }
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
