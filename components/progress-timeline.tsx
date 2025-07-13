'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Timeline, TimelineItem, TimelineConnector, TimelineHeader, TimelineIcon, TimelineContent, TimelineTitle, TimelineDescription } from '@/components/ui/timeline'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, BookOpen, CheckCircle2 } from 'lucide-react'
import { collection, query, onSnapshot, orderBy, where } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useToast } from '@/components/ui/use-toast'
import { useAuth } from '@/contexts/auth-context'
import { QURAN_DATA } from '@/lib/quran-data'
import { format } from 'date-fns'

interface Student {
  id: string
  name: string
}

interface ProgressEntry {
  id: string
  studentId: string
  surah: string
  startAyat: number
  endAyat: number
  timestamp: Date
}

export function ProgressTimeline() {
  const [students, setStudents] = useState<Student[]>([])
  const [selectedStudent, setSelectedStudent] = useState('')
  const [progressEntries, setProgressEntries] = useState<ProgressEntry[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const { currentUser } = useAuth()

  useEffect(() => {
    if (!currentUser) {
      setLoading(false)
      return
    }

    const fetchStudents = async () => {
      const studentsRef = collection(db, 'users', currentUser.uid, 'students')
      const q = query(studentsRef)
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedStudents: Student[] = snapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
        }))
        setStudents(fetchedStudents)
        if (fetchedStudents.length > 0 && !selectedStudent) {
          setSelectedStudent(fetchedStudents[0].id)
        }
      }, (error) => {
        console.error("Error fetching students:", error)
        toast({
          title: "Error",
          description: "Gagal memuat daftar santri.",
          variant: "destructive",
        })
      })
      return unsubscribe
    }

    const unsubscribeStudents = fetchStudents()
    return () => {
      unsubscribeStudents.then(unsub => unsub && unsub())
    }
  }, [currentUser, selectedStudent, toast])

  useEffect(() => {
    if (!currentUser || !selectedStudent) {
      setProgressEntries([])
      setLoading(false)
      return
    }

    setLoading(true)
    const progressRef = collection(db, 'users', currentUser.uid, 'progress')
    const q = query(progressRef, where('studentId', '==', selectedStudent), orderBy('timestamp', 'desc'))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedProgress: ProgressEntry[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate(),
      })) as ProgressEntry[]
      setProgressEntries(fetchedProgress)
      setLoading(false)
    }, (error) => {
      console.error("Error fetching progress entries:", error)
      setLoading(false)
      toast({
        title: "Error",
        description: "Gagal memuat progres hafalan.",
        variant: "destructive",
      })
    })

    return () => unsubscribe()
  }, [currentUser, selectedStudent, toast])

  const getSurahName = (surahId: string) => {
    const surah = QURAN_DATA.find(s => s.name.transliteration.id === surahId)
    return surah ? `${surah.number}. ${surah.name.transliteration.id}` : surahId
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Progres Hafalan Santri</CardTitle>
        <div className="mt-4">
          <Label htmlFor="select-student">Pilih Santri</Label>
          <Select value={selectedStudent} onValueChange={setSelectedStudent}>
            <SelectTrigger id="select-student">
              <SelectValue placeholder="Pilih Santri untuk melihat progres" />
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
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <>
            {selectedStudent && progressEntries.length === 0 && (
              <p className="text-center text-muted-foreground">Belum ada progres hafalan untuk santri ini.</p>
            )}
            {!selectedStudent && (
              <p className="text-center text-muted-foreground">Silakan pilih santri untuk melihat progres hafalan.</p>
            )}
            {selectedStudent && progressEntries.length > 0 && (
              <Timeline>
                {progressEntries.map((entry, index) => (
                  <TimelineItem key={entry.id}>
                    <TimelineHeader>
                      <TimelineIcon className="bg-primary text-primary-foreground">
                        <BookOpen className="h-4 w-4" />
                      </TimelineIcon>
                      <TimelineTitle>{getSurahName(entry.surah)} ({entry.startAyat}-{entry.endAyat})</TimelineTitle>
                      <TimelineDescription>{format(entry.timestamp, 'dd MMMM yyyy, HH:mm')}</TimelineDescription>
                    </TimelineHeader>
                    <TimelineContent>
                      <p className="text-muted-foreground">
                        Santri menghafal dari ayat {entry.startAyat} hingga {entry.endAyat} surah {entry.surah}.
                      </p>
                    </TimelineContent>
                    {index < progressEntries.length - 1 && <TimelineConnector />}
                  </TimelineItem>
                ))}
              </Timeline>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
