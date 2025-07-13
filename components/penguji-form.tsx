'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/contexts/auth-context'
import { useSubscription } from '@/hooks/use-subscription'
import { checkFeatureLimit } from '@/lib/subscription-system'

export function PengujiForm() {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const { currentUser } = useAuth()
  const { userSubscription } = useSubscription()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentUser) {
      toast({
        title: "Error",
        description: "Anda harus login untuk menambah penguji.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const hasLimitReached = await checkFeatureLimit(currentUser.uid, userSubscription, 'maxTeachers')
      if (hasLimitReached) {
        toast({
          title: "Batas Penguji Tercapai",
          description: "Anda telah mencapai batas maksimal penguji untuk paket langganan Anda. Silakan upgrade paket untuk menambah lebih banyak penguji.",
          variant: "destructive",
        })
        setLoading(false)
        return
      }

      await addDoc(collection(db, 'users', currentUser.uid, 'pengujis'), {
        name,
        phone,
        createdAt: serverTimestamp(),
      })
      toast({
        title: "Sukses",
        description: "Penguji berhasil ditambahkan.",
      })
      setName('')
      setPhone('')
    } catch (error) {
      console.error("Error adding penguji:", error)
      toast({
        title: "Error",
        description: "Gagal menambahkan penguji.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tambah Penguji Baru</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nama Penguji</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Nomor Telepon</Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Tambah Penguji
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
