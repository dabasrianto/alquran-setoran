"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { X, Save, UserPlus } from "lucide-react"
import type { Penguji } from "@/lib/types"
import { generateId } from "@/lib/utils"

interface PengujiFormProps {
  onAddPenguji: (penguji: Penguji) => void
  onUpdatePenguji: (penguji: Penguji) => void
  editingPenguji: Penguji | null
  setEditingPenguji: (penguji: Penguji | null) => void
  pengujis: Penguji[]
}

export default function PengujiForm({
  onAddPenguji,
  onUpdatePenguji,
  editingPenguji,
  setEditingPenguji,
  pengujis,
}: PengujiFormProps) {
  const [name, setName] = useState("")
  const [gender, setGender] = useState<"L" | "P">("L")
  const [keterangan, setKeterangan] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (editingPenguji) {
      setName(editingPenguji.name)
      setGender(editingPenguji.gender)
      setKeterangan(editingPenguji.keterangan || "")
    } else {
      resetForm()
    }
  }, [editingPenguji])

  const resetForm = () => {
    setName("")
    setGender("L")
    setKeterangan("")
    setError("")
  }

  const handleSubmit = () => {
    setError("")

    if (!name.trim()) {
      setError("Nama ustadz/ustadzah tidak boleh kosong.")
      return
    }

    // Cek duplikasi nama
    const isDuplicate = pengujis.some(
      (penguji) =>
        penguji.name.toLowerCase() === name.toLowerCase() && (!editingPenguji || penguji.id !== editingPenguji.id),
    )

    if (isDuplicate) {
      setError("Nama ustadz/ustadzah sudah ada.")
      return
    }

    if (editingPenguji) {
      onUpdatePenguji({
        ...editingPenguji,
        name: name.trim(),
        gender,
        keterangan: keterangan.trim(),
      })
    } else {
      onAddPenguji({
        id: generateId(),
        name: name.trim(),
        gender,
        keterangan: keterangan.trim(),
      })
    }

    resetForm()
  }

  const handleCancel = () => {
    setEditingPenguji(null)
    resetForm()
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-700">
        {editingPenguji ? "Edit Data Ustadz/Ustadzah" : "Tambah Ustadz/Ustadzah"}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="pengujiName" className="block text-sm font-medium text-gray-600 mb-1">
            Nama Ustadz/Ustadzah:
          </label>
          <Input
            id="pengujiName"
            placeholder="Nama Ustadz/Ustadzah"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Jenis Kelamin:</label>
          <RadioGroup
            value={gender}
            onValueChange={(value) => setGender(value as "L" | "P")}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="L" id="gender-l" />
              <Label htmlFor="gender-l">Ustadz (L)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="P" id="gender-p" />
              <Label htmlFor="gender-p">Ustadzah (P)</Label>
            </div>
          </RadioGroup>
        </div>
        <div className="md:col-span-2">
          <label htmlFor="pengujiKeterangan" className="block text-sm font-medium text-gray-600 mb-1">
            Keterangan (Opsional):
          </label>
          <Textarea
            id="pengujiKeterangan"
            placeholder="Contoh: Spesialisasi, kontak, dll"
            value={keterangan}
            onChange={(e) => setKeterangan(e.target.value)}
            rows={2}
          />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <Button onClick={handleSubmit} className="w-full sm:w-auto">
          {editingPenguji ? (
            <>
              <Save className="w-5 h-5 mr-2" />
              <span>Simpan Perubahan</span>
            </>
          ) : (
            <>
              <UserPlus className="w-5 h-5 mr-2" />
              <span>Tambah Ustadz/Ustadzah</span>
            </>
          )}
        </Button>
        {editingPenguji && (
          <Button variant="secondary" onClick={handleCancel} className="w-full sm:w-auto">
            <X className="w-5 h-5 mr-2" />
            <span>Batal Edit</span>
          </Button>
        )}
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  )
}
