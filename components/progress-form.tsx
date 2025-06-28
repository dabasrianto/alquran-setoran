"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Save, X, AlertCircle, BookOpen, User } from "lucide-react"
import type { Student, Setoran, Penguji } from "@/lib/types"
import { quranData } from "@/lib/quran-data"

interface ProgressFormProps {
  student: Student
  pengujis: Penguji[]
  editingSetoran?: {
    setoran: Setoran
    studentId: string
  } | null
  onSubmit: (setoran: Omit<Setoran, "id">) => Promise<void>
  onCancel: () => void
}

export default function ProgressForm({
  student,
  pengujis,
  editingSetoran,
  onSubmit,
  onCancel,
}: ProgressFormProps) {
  const [surah, setSurah] = useState("")
  const [startAyah, setStartAyah] = useState("")
  const [endAyah, setEndAyah] = useState("")
  const [penilaian, setPenilaian] = useState("")
  const [catatan, setCatatan] = useState("")
  const [pengujiId, setPengujiId] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  // Load data for editing
  useEffect(() => {
    if (editingSetoran) {
      const { setoran } = editingSetoran
      setSurah(setoran.surah)
      setStartAyah(setoran.start.toString())
      setEndAyah(setoran.end.toString())
      setPenilaian(setoran.penilaian || "")
      setCatatan(setoran.catatan || "")
      setPengujiId(setoran.pengujiId || "")
    } else {
      resetForm()
    }
  }, [editingSetoran])

  const resetForm = () => {
    setSurah("")
    setStartAyah("")
    setEndAyah("")
    setPenilaian("")
    setCatatan("")
    setPengujiId("")
    setError("")
    setShowPreview(false)
  }

  const validateForm = () => {
    if (!surah) {
      setError("Silakan pilih surat.")
      return false
    }
    if (!penilaian) {
      setError("Silakan pilih penilaian.")
      return false
    }

    const start = Number.parseInt(startAyah)
    const end = Number.parseInt(endAyah)

    if (isNaN(start) || start < 1) {
      setError("Ayat mulai tidak valid.")
      return false
    }
    if (isNaN(end) || end < 1) {
      setError("Ayat selesai tidak valid.")
      return false
    }
    if (end < start) {
      setError("Ayat selesai tidak boleh kurang dari ayat mulai.")
      return false
    }

    const surahInfo = quranData.find((s) => s.name === surah)
    if (!surahInfo) {
      setError("Informasi surat tidak ditemukan.")
      return false
    }
    if (start > surahInfo.verses) {
      setError(`Ayat mulai (${start}) melebihi jumlah ayat di ${surahInfo.name} (${surahInfo.verses} ayat).`)
      return false
    }
    if (end > surahInfo.verses) {
      setError(`Ayat selesai (${end}) melebihi jumlah ayat di ${surahInfo.name} (${surahInfo.verses} ayat).`)
      return false
    }

    return true
  }

  const handlePreview = () => {
    if (validateForm()) {
      setShowPreview(true)
    }
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setLoading(true)
    setError("")

    try {
      const setoranData: Omit<Setoran, "id"> = {
        surah,
        start: Number.parseInt(startAyah),
        end: Number.parseInt(endAyah),
        penilaian,
        catatan: catatan.trim(),
        timestamp: editingSetoran?.setoran.timestamp || new Date().toISOString(),
        pengujiId: pengujiId || undefined,
      }

      await onSubmit(setoranData)
      resetForm()
    } catch (err: any) {
      console.error("Error saving progress:", err)
      setError(err.message || "Terjadi kesalahan saat menyimpan data.")
    } finally {
      setLoading(false)
    }
  }

  const getPenilaianColor = (penilaian: string) => {
    switch (penilaian) {
      case "Ulang Lagi":
        return "bg-red-100 text-red-800"
      case "Kurang Lancar":
        return "bg-orange-100 text-orange-800"
      case "Lancar":
        return "bg-green-100 text-green-800"
      case "Mutqin":
        return "bg-teal-100 text-teal-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const selectedSurah = quranData.find((s) => s.name === surah)
  const selectedPenguji = pengujis.find((p) => p.id === pengujiId)

  if (showPreview) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Preview Progres
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Murid</Label>
                <p className="font-medium">{student.name}</p>
                {student.kelas && <Badge variant="outline" className="mt-1">{student.kelas}</Badge>}
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Surat</Label>
                <p className="font-medium">
                  {selectedSurah ? `${selectedSurah.number}. ${selectedSurah.name}` : surah}
                </p>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Ayat</Label>
                <p className="font-medium">{startAyah} - {endAyah}</p>
                <p className="text-sm text-muted-foreground">
                  {Number.parseInt(endAyah) - Number.parseInt(startAyah) + 1} ayat
                </p>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Penilaian</Label>
                <Badge className={getPenilaianColor(penilaian)}>
                  {penilaian}
                </Badge>
              </div>
              
              {selectedPenguji && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Penguji</Label>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="font-medium">
                      {selectedPenguji.gender === "L" ? "Ustadz" : "Ustadzah"} {selectedPenguji.name}
                    </span>
                  </div>
                </div>
              )}
            </div>
            
            {catatan && (
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Catatan</Label>
                <div className="mt-1 p-3 bg-muted rounded-md">
                  <p className="text-sm whitespace-pre-wrap">{catatan}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button onClick={() => setShowPreview(false)} variant="outline" className="flex-1">
            <X className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button onClick={handleSubmit} disabled={loading} className="flex-1">
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {editingSetoran ? "Update Progres" : "Simpan Progres"}
              </>
            )}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Student Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">{student.name}</h3>
              {student.kelas && <Badge variant="outline">{student.kelas}</Badge>}
              {student.target && (
                <p className="text-sm text-muted-foreground mt-1">Target: {student.target}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="surah">Surat *</Label>
            <Select value={surah} onValueChange={setSurah}>
              <SelectTrigger id="surah">
                <SelectValue placeholder="-- Pilih Surat --" />
              </SelectTrigger>
              <SelectContent>
                {quranData.map((surah) => (
                  <SelectItem key={surah.number} value={surah.name}>
                    {surah.number}. {surah.name} ({surah.verses} ayat)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startAyah">Ayat Mulai *</Label>
              <Input
                id="startAyah"
                type="number"
                placeholder="1"
                min="1"
                max={selectedSurah?.verses || 999}
                value={startAyah}
                onChange={(e) => setStartAyah(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="endAyah">Ayat Selesai *</Label>
              <Input
                id="endAyah"
                type="number"
                placeholder="7"
                min="1"
                max={selectedSurah?.verses || 999}
                value={endAyah}
                onChange={(e) => setEndAyah(e.target.value)}
              />
            </div>
          </div>

          {selectedSurah && startAyah && endAyah && (
            <div className="text-sm text-muted-foreground">
              Total: {Math.max(0, Number.parseInt(endAyah) - Number.parseInt(startAyah) + 1)} ayat
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="penilaian">Penilaian *</Label>
            <Select value={penilaian} onValueChange={setPenilaian}>
              <SelectTrigger id="penilaian">
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

          <div>
            <Label htmlFor="penguji">Penguji</Label>
            <Select value={pengujiId} onValueChange={setPengujiId}>
              <SelectTrigger id="penguji">
                <SelectValue placeholder="-- Pilih Penguji --" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tidak Ada</SelectItem>
                {pengujis.map((penguji) => (
                  <SelectItem key={penguji.id} value={penguji.id}>
                    {penguji.gender === "L" ? "Ustadz" : "Ustadzah"} {penguji.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="catatan">Catatan</Label>
        <Textarea
          id="catatan"
          rows={3}
          placeholder="Tambahkan catatan untuk progres ini..."
          value={catatan}
          onChange={(e) => setCatatan(e.target.value)}
        />
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="flex gap-3">
        <Button onClick={onCancel} variant="outline" className="flex-1">
          <X className="h-4 w-4 mr-2" />
          Batal
        </Button>
        <Button onClick={handlePreview} className="flex-1">
          <BookOpen className="h-4 w-4 mr-2" />
          Preview
        </Button>
      </div>
    </div>
  )
}