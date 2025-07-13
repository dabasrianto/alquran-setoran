'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2 } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { addDoc, collection, serverTimestamp, getDocs, query } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/contexts/auth-context'
import { QURAN_DATA } from '@/lib/quran-data'

interface Student {
  id: string
  name: string
}

interface Penguji {
  id: string
  name: string
}

export function SetoranForm() {
  const [selectedStudent, setSelectedStudent] = useState('')
  const [selectedPenguji, setSelectedPenguji] = useState('')
  const [date, setDate] = useState('')
  const [type, setType] = useState('')
  const [surah, setSurah] = useState('')
  const [startAyat, setStartAyat] = useState('')
  const [endAyat, setEndAyat] = useState('')
  const [score, setScore] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [students, setStudents] = useState<Student[]>([])
  const [pengujis, setPengujis] = useState<Penguji[]>([])
  const { toast } = useToast()
  const { currentUser } = useAuth()

  useEffect(() => {
    const fetchDependencies = async () => {
      if (!currentUser) return

      // Fetch students
      const studentsRef = collection(db, 'users', currentUser.uid, 'students')
      const studentsSnapshot = await getDocs(query(studentsRef))
      const fetchedStudents: Student[] = studentsSnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
      }))
      setStudents(fetchedStudents)

      // Fetch pengujis
      const pengujisRef = collection(db, 'users', currentUser.uid, 'pengujis')
      const pengujisSnapshot = await getDocs(query(pengujisRef))
      const fetchedPengujis: Penguji[] = pengujisSnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
      }))
      setPengujis(fetchedPengujis)
    }
    fetchDependencies()
  }, [currentUser])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser) {
      toast({
        title: "Error",
        description: "Anda harus login untuk mencatat setoran.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      await addDoc(collection(db, 'users', currentUser.uid, 'setoran'), {
        studentId: selectedStudent,
        pengujiId: selectedPenguji,
        date: new Date(date),
        type,
        surah,
        startAyat: parseInt(startAyat),
        endAyat: parseInt(endAyat),
        score: parseInt(score),
        notes,
        createdAt: serverTimestamp(),
      })
      toast({
        title: "Sukses",
        description: "Setoran berhasil dicatat.",
      })
      // Reset form
      setSelectedStudent('')
      setSelectedPenguji('')
      setDate('')
      setType('')
      setSurah('')
      setStartAyat('')
      setEndAyat('')
      setScore('')
      setNotes('')
    } catch (error) {
      console.error("Error adding setoran:", error)
      toast({
        title: "Error",
        description: "Gagal mencatat setoran.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Catat Setoran Baru</CardTitle>
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
            <Label htmlFor="penguji">Penguji</Label>
            <Select value={selectedPenguji} onValueChange={setSelectedPenguji} required>
              <SelectTrigger id="penguji">
                <SelectValue placeholder="Pilih Penguji" />
              </SelectTrigger>
              <SelectContent>
                {pengujis.map((penguji) => (
                  <SelectItem key={penguji.id} value={penguji.id}>
                    {penguji.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="date">Tanggal</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="type">Jenis Setoran</Label>
            <Select value={type} onValueChange={setType} required>
              <SelectTrigger id="type">
                <SelectValue placeholder="Pilih Jenis Setoran" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="baru">Baru</SelectItem>
                <SelectItem value="murajaah">Murajaah</SelectItem>
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
          <div className="grid gap-2">
            <Label htmlFor="score">Nilai (1-100)</Label>
            <Input
              id="score"
              type="number"
              value={score}
              onChange={(e) => setScore(e.target.value)}
              min="1"
              max="100"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">Catatan (Opsional)</Label>
            <Input
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Catat Setoran
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
