"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle, X } from "lucide-react"
import type { Student, Setoran, Penguji } from "@/lib/types"
import { quranData } from "@/lib/quran-data"

interface SetoranFormProps {
  students: Student[]
  pengujis: Penguji[]
  onAddSetoran: (studentId: string, setoran: Omit<Setoran, "id">) => Promise<void>
  onUpdateSetoran: (studentId: string, setoranId: string, updatedSetoran: Partial<Setoran>) => Promise<void>
  editingSetoran: {
    setoran: Setoran
    studentId: string
  } | null
  setEditingSetoran: (
    data: {
      setoran: Setoran
      studentId: string
    } | null,
  ) => void
}

export default function SetoranForm({
  students,
  pengujis,
  onAddSetoran,
  onUpdateSetoran,
  editingSetoran,
  setEditingSetoran,
}: SetoranFormProps) {
  const [studentId, setStudentId] = useState("")
  const [surah, setSurah] = useState("")
  const [startAyah, setStartAyah] = useState("")
  const [endAyah, setEndAyah] = useState("")
  const [penilaian, setPenilaian] = useState("")
  const [catatan, setCatatan] = useState("")
  const [pengujiId, setPengujiId] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (editingSetoran) {
      setStudentId(editingSetoran.studentId)
      setSurah(editingSetoran.setoran.surah)
      setStartAyah(editingSetoran.setoran.start.toString())
      setEndAyah(editingSetoran.setoran.end.toString())
      setPenilaian(editingSetoran.setoran.penilaian || "")
      setCatatan(editingSetoran.setoran.catatan || "")
      setPengujiId(editingSetoran.setoran.pengujiId || "")
    } else {
      resetForm()
    }
  }, [editingSetoran])

  const resetForm = () => {
    if (!editingSetoran) {
      setStudentId("")
    }
    setSurah("")
    setStartAyah("")
    setEndAyah("")
    setPenilaian("")
    setCatatan("")
    setPengujiId("")
    setError("")
  }

  const handleSubmit = async () => {
    setError("")
    setLoading(true)

    try {
      if (!studentId) {
        setError("Silakan pilih murid.")
        return
      }
      if (!surah) {
        setError("Silakan pilih surat.")
        return
      }
      if (!penilaian) {
        setError("Silakan pilih penilaian.")
        return
      }

      const start = Number.parseInt(startAyah)
      const end = Number.parseInt(endAyah)

      if (isNaN(start) || start < 1) {
        setError("Ayat mulai tidak valid.")
        return
      }
      if (isNaN(end) || end < 1) {
        setError("Ayat selesai tidak valid.")
        return
      }
      if (end < start) {
        setError("Ayat selesai tidak boleh kurang dari ayat mulai.")
        return
      }

      const surahInfo = quranData.find((s) => s.name === surah)
      if (!surahInfo) {
        setError("Informasi surat tidak ditemukan.")
        return
      }
      if (start > surahInfo.verses) {
        setError(`Ayat mulai (${start}) melebihi jumlah ayat di ${surahInfo.name} (${surahInfo.verses} ayat).`)
        return
      }
      if (end > surahInfo.verses) {
        setError(`Ayat selesai (${end}) melebihi jumlah ayat di ${surahInfo.name} (${surahInfo.verses} ayat).`)
        return
      }

      if (editingSetoran) {
        await onUpdateSetoran(studentId, editingSetoran.setoran.id, {
          surah,
          start,
          end,
          penilaian,
          catatan: catatan.trim(),
          pengujiId: pengujiId || undefined,
        })
      } else {
        await onAddSetoran(studentId, {
          surah,
          start,
          end,
          penilaian,
          catatan: catatan.trim(),
          timestamp: new Date().toISOString(),
          pengujiId: pengujiId || undefined,
        })
      }

      resetForm()
    } catch (err: any) {
      console.error("Error saving setoran:", err)
      setError(err.message || "Terjadi kesalahan saat menyimpan data.")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setEditingSetoran(null)
    resetForm()
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-700">
        {editingSetoran
          ? `Edit Setoran (${students.find((s) => s.id === editingSetoran.studentId)?.name || "Murid"})`
          : "Tambah Setoran Hafalan"}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1">
          <label htmlFor="selectStudent" className="block text-sm font-medium text-gray-600 mb-1">
            Pilih Murid:
          </label>
          <Select value={studentId} onValueChange={setStudentId} disabled={!!editingSetoran || loading}>
            <SelectTrigger id="selectStudent">
              <SelectValue placeholder="-- Pilih Murid --" />
            </SelectTrigger>
            <SelectContent>
              {students.map((student) => (
                <SelectItem key={student.id} value={student.id}>
                  {student.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-2 grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="selectSurah" className="block text-sm font-medium text-gray-600 mb-1">
              Pilih Surat:
            </label>
            <Select value={surah} onValueChange={setSurah} disabled={loading}>
              <SelectTrigger id="selectSurah">
                <SelectValue placeholder="-- Pilih Surat --" />
              </SelectTrigger>
              <SelectContent>
                {quranData.map((surah) => (
                  <SelectItem key={surah.number} value={surah.name}>
                    {surah.number}. {surah.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label htmlFor="selectPenilaian" className="block text-sm font-medium text-gray-600 mb-1">
              Penilaian:
            </label>
            <Select value={penilaian} onValueChange={setPenilaian} disabled={loading}>
              <SelectTrigger id="selectPenilaian">
                <SelectValue placeholder="-- Pilih Penilaian --" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ulang Lagi">Ulang Lagi</SelectItem>
                <SelectItem value="Kurang Lancar">Kurang Lancar</SelectItem>
                <SelectItem value="Lancar">Lancar</SelectItem>
                <SelectItem value="Mutqin">Mutqin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="md:col-span-3 grid grid-cols-3 gap-4">
          <div>
            <label htmlFor="startAyah" className="block text-sm font-medium text-gray-600 mb-1">
              Ayat Mulai:
            </label>
            <Input
              id="startAyah"
              type="number"
              placeholder="1"
              min="1"
              value={startAyah}
              onChange={(e) => setStartAyah(e.target.value)}
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="endAyah" className="block text-sm font-medium text-gray-600 mb-1">
              Ayat Selesai:
            </label>
            <Input
              id="endAyah"
              type="number"
              placeholder="Contoh: 7"
              min="1"
              value={endAyah}
              onChange={(e) => setEndAyah(e.target.value)}
              disabled={loading}
            />
          </div>
          <div>
            <label htmlFor="selectPenguji" className="block text-sm font-medium text-gray-600 mb-1">
              Penguji:
            </label>
            <Select value={pengujiId} onValueChange={setPengujiId} disabled={loading}>
              <SelectTrigger id="selectPenguji">
                <SelectValue placeholder="-- Pilih Penguji --" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Tidak Ada</SelectItem>
                {pengujis.map((penguji) => (
                  <SelectItem key={penguji.id} value={penguji.id}>
                    {penguji.gender === "L" ? "Ustadz" : "Ustadzah"} {penguji.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="md:col-span-3">
          <label htmlFor="setoranCatatan" className="block text-sm font-medium text-gray-600 mb-1">
            Catatan (Opsional):
          </label>
          <Textarea
            id="setoranCatatan"
            rows={2}
            placeholder="Masukkan catatan untuk setoran ini..."
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            disabled={loading}
          />
        </div>
      </div>
      <div className="mt-4 flex flex-col sm:flex-row gap-2">
        <Button onClick={handleSubmit} className="w-full sm:w-auto" disabled={loading}>
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              <span>Menyimpan...</span>
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5 mr-2" />
              <span>{editingSetoran ? "Simpan Perubahan" : "Tambah Setoran"}</span>
            </>
          )}
        </Button>
        {editingSetoran && (
          <Button variant="secondary" onClick={handleCancel} className="w-full sm:w-auto" disabled={loading}>
            <X className="w-5 h-5 mr-2" />
            <span>Batal Edit</span>
          </Button>
        )}
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  )
}
