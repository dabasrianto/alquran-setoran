"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PlusCircle, X, Save } from "lucide-react"
import type { Student } from "@/lib/types"
import { generateId } from "@/lib/utils"

interface StudentFormProps {
  onAddStudent: (student: Student) => void
  onUpdateStudent: (student: Student) => void
  editingStudent: Student | null
  setEditingStudent: (student: Student | null) => void
  students: Student[]
}

export default function StudentForm({
  onAddStudent,
  onUpdateStudent,
  editingStudent,
  setEditingStudent,
  students,
}: StudentFormProps) {
  const [name, setName] = useState("")
  const [kelas, setKelas] = useState("")
  const [target, setTarget] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (editingStudent) {
      setName(editingStudent.name)
      setKelas(editingStudent.kelas || "")
      setTarget(editingStudent.target || "")
    } else {
      resetForm()
    }
  }, [editingStudent])

  const resetForm = () => {
    setName("")
    setKelas("")
    setTarget("")
    setError("")
  }

  const handleSubmit = () => {
    setError("")

    if (!name.trim()) {
      setError("Nama murid tidak boleh kosong.")
      return
    }

    // Cek duplikasi nama
    const isDuplicate = students.some(
      (student) =>
        student.name.toLowerCase() === name.toLowerCase() && (!editingStudent || student.id !== editingStudent.id),
    )

    if (isDuplicate) {
      setError("Nama murid sudah ada.")
      return
    }

    if (editingStudent) {
      onUpdateStudent({
        ...editingStudent,
        name: name.trim(),
        kelas: kelas.trim(),
        target: target.trim(),
      })
    } else {
      onAddStudent({
        id: generateId(),
        name: name.trim(),
        kelas: kelas.trim(),
        target: target.trim(),
        hafalan: [],
      })
    }

    resetForm()
  }

  const handleCancel = () => {
    setEditingStudent(null)
    resetForm()
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-700">
        {editingStudent ? "Edit Data Murid" : "Tambah Murid Baru"}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="studentName" className="block text-sm font-medium text-gray-600 mb-1">
            Nama Murid:
          </label>
          <Input id="studentName" placeholder="Nama Murid" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label htmlFor="studentKelas" className="block text-sm font-medium text-gray-600 mb-1">
            Kelas/Halaqah:
          </label>
          <Input
            id="studentKelas"
            placeholder="Contoh: Kelas A"
            value={kelas}
            onChange={(e) => setKelas(e.target.value)}
          />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="studentTarget" className="block text-sm font-medium text-gray-600 mb-1">
            Target Hafalan (Opsional):
          </label>
          <Input
            id="studentTarget"
            placeholder="Contoh: Selesai Juz 30"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
          />
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <Button onClick={handleSubmit} className="w-full sm:w-auto">
          {editingStudent ? (
            <>
              <Save className="w-5 h-5 mr-2" />
              <span>Simpan Perubahan</span>
            </>
          ) : (
            <>
              <PlusCircle className="w-5 h-5 mr-2" />
              <span>Tambah Murid</span>
            </>
          )}
        </Button>
        {editingStudent && (
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
