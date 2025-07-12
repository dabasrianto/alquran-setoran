"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { addDoc, collection, serverTimestamp, getDocs, query } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/contexts/auth-context"
import { QURAN_DATA } from "@/lib/quran-data"

interface Student {
  id: string
  name: string
}

export function ProgressForm() {
  const [selectedStudent, setSelectedStudent] = useState("")
  const [surah, setSurah] = useState("")
  const [startAyat, setStartAyat] = useState("")
  const [endAyat, setEndAyat] = useState("")
  const [loading, setLoading] = useState(false)
  const [students, setStudents] = useState<Student[]>([])
  const { toast } = useToast()
  const { currentUser } = useAuth()

  useEffect(() => {
    const fetchStudents = async () => {
      if (!currentUser) return
      const studentsRef = collection(db, "users", currentUser.uid, "students")
      const q = query(studentsRef)
      const querySnapshot = await getDocs(q)
      const fetchedStudents: Student[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().name,
      }))
      setStudents(fetchedStudents)
    }
    fetchStudents()
  }, [currentUser])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser) {
      toast({
        title: "Error",
        description: "Anda harus login untuk mencatat progres.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      await addDoc(collection(db, "users", currentUser.uid, "progress"), {
        studentId: selectedStudent,
        surah,
        startAyat: Number.parseInt(startAyat),
        endAyat: Number.parseInt(endAyat),
        timestamp: serverTimestamp(),
      })
      toast({
        title: "Sukses",
        description: "Progres hafalan berhasil dicatat.",
      })
      setSelectedStudent("")
      setSurah("")
      setStartAyat("")
      setEndAyat("")
    } catch (error) {
      console.error("Error adding progress:", error)
      toast({
        title: "Error",
        description: "Gagal mencatat progres hafalan.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Catat Progres Hafalan</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="student">Santri</Label>
            <Select value={selectedStudent} onValueChange={setSelectedStudent} required>
              <SelectTrigger id="student">
                <SelectValue placeholder="Pilih Santri" />
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
          <div className="grid gap-2">
            <Label htmlFor="surah">Surah</Label>
            <Select value={surah} onValueChange={setSurah} required>
              <SelectTrigger id="surah">
                <SelectValue placeholder="Pilih Surah" />
              </SelectTrigger>
              <SelectContent>
                {QURAN_DATA.map((s) => (
                  <SelectItem key={s.number} value={s.name.transliteration.id}>
                    {s.number}. {s.name.transliteration.id} ({s.numberOfVerses} ayat)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="start-ayat">Ayat Awal</Label>
              <Input
                id="start-ayat"
                type="number"
                value={startAyat}
                onChange={(e) => setStartAyat(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="end-ayat">Ayat Akhir</Label>
              <Input
                id="end-ayat"
                type="number"
                value={endAyat}
                onChange={(e) => setEndAyat(e.target.value)}
                required
              />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Catat Progres
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
