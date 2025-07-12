"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { addDoc, collection, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/contexts/auth-context"
import { useSubscription } from "@/hooks/use-subscription"
import { checkFeatureLimit } from "@/lib/subscription-system"

export function StudentForm() {
  const [name, setName] = useState("")
  const [dob, setDob] = useState("")
  const [gender, setGender] = useState("")
  const [kelas, setKelas] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const { currentUser } = useAuth()
  const { userSubscription } = useSubscription()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser) {
      toast({
        title: "Error",
        description: "Anda harus login untuk menambah santri.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const hasLimitReached = await checkFeatureLimit(currentUser.uid, userSubscription, "maxStudents")
      if (hasLimitReached) {
        toast({
          title: "Batas Santri Tercapai",
          description:
            "Anda telah mencapai batas maksimal santri untuk paket langganan Anda. Silakan upgrade paket untuk menambah lebih banyak santri.",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      await addDoc(collection(db, "users", currentUser.uid, "students"), {
        name,
        dob: new Date(dob),
        gender,
        kelas,
        createdAt: serverTimestamp(),
      })
      toast({
        title: "Sukses",
        description: "Santri berhasil ditambahkan.",
      })
      setName("")
      setDob("")
      setGender("")
      setKelas("")
    } catch (error) {
      console.error("Error adding student:", error)
      toast({
        title: "Error",
        description: "Gagal menambahkan santri.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tambah Santri Baru</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nama Santri</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="dob">Tanggal Lahir</Label>
            <Input id="dob" type="date" value={dob} onChange={(e) => setDob(e.target.value)} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="gender">Jenis Kelamin</Label>
            <Select value={gender} onValueChange={setGender} required>
              <SelectTrigger id="gender">
                <SelectValue placeholder="Pilih Jenis Kelamin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Laki-laki">Laki-laki</SelectItem>
                <SelectItem value="Perempuan">Perempuan</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="kelas">Kelas</Label>
            <Input
              id="kelas"
              value={kelas}
              onChange={(e) => setKelas(e.target.value)}
              placeholder="Contoh: Kelas A, Tahfidz 1"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Tambah Santri
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
