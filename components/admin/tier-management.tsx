'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Loader2, PlusCircle, Edit, Trash2, CheckCircle2, XCircle } from 'lucide-react'
import {
  createSubscriptionTier,
  getSubscriptionTiers,
  updateSubscriptionTier,
  deleteSubscriptionTier,
  SubscriptionTier,
  subscribeToSubscriptionTierChanges,
} from '@/lib/subscription-tiers'
import { useToast } from '@/components/ui/use-toast'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'

export function TierManagement() {
  const [tiers, setTiers] = useState<SubscriptionTier[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentTier, setCurrentTier] = useState<SubscriptionTier | null>(null)
  const [formState, setFormState] = useState<Partial<SubscriptionTier>>({})
  const { toast } = useToast()

  useEffect(() => {
    setLoading(true)
    const unsubscribe = subscribeToSubscriptionTierChanges((fetchedTiers) => {
      setTiers(fetchedTiers)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const handleAddTier = () => {
    setCurrentTier(null)
    setFormState({
      name: '',
      description: '',
      maxStudents: 0,
      maxTeachers: 0,
      canExportPdf: false,
      hasPrioritySupport: false,
      hasCustomReports: false,
      price: 0,
      currency: 'IDR',
      interval: 'monthly',
      active: true,
    })
    setIsModalOpen(true)
  }

  const handleEditTier = (tier: SubscriptionTier) => {
    setCurrentTier(tier)
    setFormState(tier)
    setIsModalOpen(true)
  }

  const handleDeleteTier = async (tierId: string) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus tier langganan ini?')) {
      return
    }
    try {
      await deleteSubscriptionTier(tierId)
      toast({
        title: 'Sukses',
        description: 'Tier langganan berhasil dihapus.',
      })
    } catch (error) {
      console.error('Error deleting subscription tier:', error)
      toast({
        title: 'Error',
        description: 'Gagal menghapus tier langganan.',
        variant: 'destructive',
      })
    }
  }

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement
    setFormState((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({
      ...prev,
      [name]: Number(value),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (currentTier) {
        await updateSubscriptionTier(currentTier.id, formState)
        toast({
          title: 'Sukses',
          description: 'Tier langganan berhasil diperbarui.',
        })
      } else {
        await createSubscriptionTier(formState as SubscriptionTier)
        toast({
          title: 'Sukses',
          description: 'Tier langganan baru berhasil ditambahkan.',
        })
      }
      setIsModalOpen(false)
    } catch (error) {
      console.error('Error saving subscription tier:', error)
      toast({
        title: 'Error',
        description: 'Gagal menyimpan tier langganan.',
        variant: 'destructive',
      })
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Manajemen Tier Langganan</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Manajemen Tier Langganan</CardTitle>
        <Button onClick={handleAddTier}>
          <PlusCircle className="mr-2 h-4 w-4" /> Tambah Tier Baru
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tiers.map((tier) => (
            <Card key={tier.id} className="flex flex-col justify-between p-6">
              <div>
                <CardHeader className="p-0 pb-4">
                  <CardTitle className="text-xl font-semibold">{tier.name}</CardTitle>
                  <p className="text-muted-foreground text-sm">{tier.description}</p>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="text-4xl font-bold mb-4">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: tier.currency }).format(tier.price)}
                    <span className="text-base text-muted-foreground font-normal">/{tier.interval}</span>
                  </div>
                  <Separator className="my-4" />
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" /> Maksimal {tier.maxStudents} Santri
                    </li>
                    <li className="flex items-center">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" /> Maksimal {tier.maxTeachers} Penguji
                    </li>
                    <li className="flex items-center">
                      {tier.canExportPdf ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500 mr-2" />
                      )}
                      Export PDF
                    </li>
                    <li className="flex items-center">
                      {tier.hasPrioritySupport ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500 mr-2" />
                      )}
                      Dukungan Prioritas
                    </li>
                    <li className="flex items-center">
                      {tier.hasCustomReports ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-500 mr-2" />
                      )}
                      Laporan Kustom
                    </li>
                  </ul>
                </CardContent>
              </div>
              <div className="flex gap-2 mt-6">
                <Button variant="outline" size="sm" onClick={() => handleEditTier(tier)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDeleteTier(tier.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{currentTier ? 'Edit Tier Langganan' : 'Tambah Tier Langganan Baru'}</DialogTitle>
              <DialogDescription>
                {currentTier
                  ? 'Ubah detail tier langganan yang sudah ada.'
                  : 'Buat tier langganan baru untuk aplikasi Anda.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nama Tier</Label>
                <Input
                  id="name"
                  name="name"
                  value={formState.name || ''}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formState.description || ''}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="price">Harga</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={formState.price || ''}
                    onChange={handleNumberChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="currency">Mata Uang</Label>
                  <Input
                    id="currency"
                    name="currency"
                    value={formState.currency || 'IDR'}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="maxStudents">Maksimal Santri</Label>
                  <Input
                    id="maxStudents"
                    name="maxStudents"
                    type="number"
                    value={formState.maxStudents || ''}
                    onChange={handleNumberChange}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="maxTeachers">Maksimal Penguji</Label>
                  <Input
                    id="maxTeachers"
                    name="maxTeachers"
                    type="number"
                    value={formState.maxTeachers || ''}
                    onChange={handleNumberChange}
                    required
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="canExportPdf"
                  name="canExportPdf"
                  checked={formState.canExportPdf || false}
                  onCheckedChange={(checked) => setFormState((prev) => ({ ...prev, canExportPdf: checked }))}
                />
                <Label htmlFor="canExportPdf">Bisa Export PDF</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="hasPrioritySupport"
                  name="hasPrioritySupport"
                  checked={formState.hasPrioritySupport || false}
                  onCheckedChange={(checked) => setFormState((prev) => ({ ...prev, hasPrioritySupport: checked }))}
                />
                <Label htmlFor="hasPrioritySupport">Dukungan Prioritas</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="hasCustomReports"
                  name="hasCustomReports"
                  checked={formState.hasCustomReports || false}
                  onCheckedChange={(checked) => setFormState((prev) => ({ ...prev, hasCustomReports: checked }))}
                />
                <Label htmlFor="hasCustomReports">Laporan Kustom</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  name="active"
                  checked={formState.active !== undefined ? formState.active : true}
                  onCheckedChange={(checked) => setFormState((prev) => ({ ...prev, active: checked }))}
                />
                <Label htmlFor="active">Aktif</Label>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {currentTier ? 'Simpan Perubahan' : 'Tambah Tier'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
