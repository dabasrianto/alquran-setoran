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
  createPricingPlan,
  getPricingPlans,
  updatePricingPlan,
  deletePricingPlan,
  PricingPlan,
  formatPrice,
  subscribeToPricingChanges,
  calculateYearlyPrice,
} from '@/lib/firebase-pricing'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

export function PricingManagement() {
  const [plans, setPlans] = useState<PricingPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentPlan, setCurrentPlan] = useState<PricingPlan | null>(null)
  const [formState, setFormState] = useState<Partial<PricingPlan>>({})
  const [activeTab, setActiveTab] = useState('basic')
  const { toast } = useToast()

  useEffect(() => {
    setLoading(true)
    const unsubscribe = subscribeToPricingChanges((fetchedPlans) => {
      setPlans(fetchedPlans)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const handleAddPlan = () => {
    setCurrentPlan(null)
    setFormState({
      name: '',
      description: '',
      price: 0,
      currency: 'IDR',
      interval: 'month',
      features: [],
      maxStudents: null,
      maxTeachers: null,
      isPopular: false,
      isRecommended: false,
      order: plans.length + 1,
      active: true,
    })
    setActiveTab('basic')
    setIsModalOpen(true)
  }

  const handleEditPlan = (plan: PricingPlan) => {
    setCurrentPlan(plan)
    setFormState({
      ...plan,
      features: plan.features || [], // Ensure features is an array
    })
    setActiveTab('basic')
    setIsModalOpen(true)
  }

  const handleDeletePlan = async (planId: string) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus paket harga ini?')) {
      return
    }
    try {
      await deletePricingPlan(planId)
      toast({
        title: 'Sukses',
        description: 'Paket harga berhasil dihapus.',
      })
    } catch (error) {
      console.error('Error deleting pricing plan:', error)
      toast({
        title: 'Error',
        description: 'Gagal menghapus paket harga.',
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
      [name]: value === '' ? null : Number(value),
    }))
  }

  const handleFeatureChange = (index: number, value: string) => {
    const newFeatures = [...(formState.features || [])]
    newFeatures[index] = value
    setFormState((prev) => ({ ...prev, features: newFeatures }))
  }

  const addFeature = () => {
    setFormState((prev) => ({
      ...prev,
      features: [...(prev.features || []), ''],
    }))
  }

  const removeFeature = (index: number) => {
    const newFeatures = (formState.features || []).filter((_, i) => i !== index)
    setFormState((prev) => ({ ...prev, features: newFeatures }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formState.name || !formState.description || formState.price === undefined) {
      toast({
        title: 'Validasi Gagal',
        description: 'Nama, deskripsi, dan harga harus diisi.',
        variant: 'destructive',
      })
      return
    }

    try {
      const finalPrice = Number(formState.price)
      const yearlyPrice = calculateYearlyPrice(finalPrice)

      const dataToSave: Omit<PricingPlan, 'id' | 'createdAt' | 'updatedAt'> = {
        name: formState.name,
        description: formState.description,
        price: finalPrice,
        yearlyPrice: yearlyPrice,
        currency: formState.currency || 'IDR',
        interval: formState.interval || 'month',
        features: formState.features || [],
        maxStudents: formState.maxStudents === null ? null : Number(formState.maxStudents),
        maxTeachers: formState.maxTeachers === null ? null : Number(formState.maxTeachers),
        isPopular: formState.isPopular || false,
        isRecommended: formState.isRecommended || false,
        order: formState.order || plans.length + 1,
        active: formState.active !== undefined ? formState.active : true,
      }

      if (currentPlan) {
        await updatePricingPlan(currentPlan.id, dataToSave)
        toast({
          title: 'Sukses',
          description: 'Paket harga berhasil diperbarui.',
        })
      } else {
        await createPricingPlan(dataToSave)
        toast({
          title: 'Sukses',
          description: 'Paket harga baru berhasil ditambahkan.',
        })
      }
      setIsModalOpen(false)
    } catch (error) {
      console.error('Error saving pricing plan:', error)
      toast({
        title: 'Error',
        description: 'Gagal menyimpan paket harga.',
        variant: 'destructive',
      })
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Manajemen Harga Langganan</CardTitle>
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
        <CardTitle>Manajemen Harga Langganan</CardTitle>
        <Button onClick={handleAddPlan}>
          <PlusCircle className="mr-2 h-4 w-4" /> Tambah Paket Baru
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card key={plan.id} className={cn(
              "flex flex-col justify-between p-6 border-2",
              plan.isPopular && "border-blue-500 dark:border-blue-400",
              plan.isRecommended && "border-green-500 dark:border-green-400",
              !plan.active && "opacity-50 border-dashed"
            )}>
              <div>
                <CardHeader className="p-0 pb-4">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-xl font-semibold">{plan.name}</CardTitle>
                    <div className="flex gap-1">
                      {plan.isPopular && <Badge className="bg-blue-500 text-white">Populer</Badge>}
                      {plan.isRecommended && <Badge className="bg-green-500 text-white">Rekomendasi</Badge>}
                      {!plan.active && <Badge variant="outline">Tidak Aktif</Badge>}
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm">{plan.description}</p>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="text-4xl font-bold mb-4">
                    {formatPrice(plan.price, plan.currency)}
                    <span className="text-base text-muted-foreground font-normal">/{plan.interval}</span>
                  </div>
                  {plan.yearlyPrice !== undefined && plan.yearlyPrice > 0 && (
                    <p className="text-sm text-muted-foreground">
                      {formatPrice(plan.yearlyPrice, plan.currency)}/tahun (Hemat 20%)
                    </p>
                  )}
                  <Separator className="my-4" />
                  <ul className="space-y-2 text-sm">
                    {(plan.features || []).map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                    {plan.maxStudents !== undefined && (
                      <li className="flex items-center">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                        Maksimal {plan.maxStudents === null ? 'Tidak Terbatas' : plan.maxStudents} Santri
                      </li>
                    )}
                    {plan.maxTeachers !== undefined && (
                      <li className="flex items-center">
                        <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                        Maksimal {plan.maxTeachers === null ? 'Tidak Terbatas' : plan.maxTeachers} Penguji
                      </li>
                    )}
                  </ul>
                </CardContent>
              </div>
              <div className="flex gap-2 mt-6">
                <Button variant="outline" size="sm" onClick={() => handleEditPlan(plan)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDeletePlan(plan.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{currentPlan ? 'Edit Paket Harga' : 'Tambah Paket Harga Baru'}</DialogTitle>
              <DialogDescription>
                {currentPlan
                  ? 'Ubah detail paket harga yang sudah ada.'
                  : 'Buat paket harga baru untuk langganan Anda.'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="grid gap-4 py-4">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Info Dasar</TabsTrigger>
                  <TabsTrigger value="limits">Batas</TabsTrigger>
                  <TabsTrigger value="features">Fitur</TabsTrigger>
                </TabsList>
                <TabsContent value="basic" className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nama Paket</Label>
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
                      <Label htmlFor="price">Harga (per bulan)</Label>
                      <Input
                        id="price"
                        name="price"
                        type="number"
                        value={formState.price !== undefined ? formState.price : ''}
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
                        disabled // For now, keep it IDR
                      />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isPopular"
                      name="isPopular"
                      checked={formState.isPopular || false}
                      onCheckedChange={(checked) => setFormState((prev) => ({ ...prev, isPopular: checked }))}
                    />
                    <Label htmlFor="isPopular">Populer</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isRecommended"
                      name="isRecommended"
                      checked={formState.isRecommended || false}
                      onCheckedChange={(checked) => setFormState((prev) => ({ ...prev, isRecommended: checked }))}
                    />
                    <Label htmlFor="isRecommended">Rekomendasi</Label>
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
                  <div className="grid gap-2">
                    <Label htmlFor="order">Urutan Tampilan</Label>
                    <Input
                      id="order"
                      name="order"
                      type="number"
                      value={formState.order !== undefined ? formState.order : ''}
                      onChange={handleNumberChange}
                    />
                  </div>
                </TabsContent>
                <TabsContent value="limits" className="space-y-4">
                  <p className="text-muted-foreground">
                    Atur batas untuk santri dan penguji. Kosongkan untuk tidak terbatas.
                  </p>
                  <div className="grid gap-2">
                    <Label htmlFor="maxStudents">Maksimal Santri</Label>
                    <Input
                      id="maxStudents"
                      name="maxStudents"
                      type="number"
                      placeholder="Kosongkan untuk tidak terbatas"
                      value={formState.maxStudents === null ? '' : formState.maxStudents || ''}
                      onChange={handleNumberChange}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="maxTeachers">Maksimal Penguji</Label>
                    <Input
                      id="maxTeachers"
                      name="maxTeachers"
                      type="number"
                      placeholder="Kosongkan untuk tidak terbatas"
                      value={formState.maxTeachers === null ? '' : formState.maxTeachers || ''}
                      onChange={handleNumberChange}
                    />
                  </div>
                </TabsContent>
                <TabsContent value="features" className="space-y-4">
                  <p className="text-muted-foreground">
                    Tambahkan fitur-fitur yang termasuk dalam paket ini.
                  </p>
                  {(formState.features || []).map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={feature}
                        onChange={(e) => handleFeatureChange(index, e.target.value)}
                        placeholder={`Fitur ${index + 1}`}
                      />
                      <Button variant="outline" size="icon" onClick={() => removeFeature(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addFeature}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Tambah Fitur
                  </Button>
                </TabsContent>
              </Tabs>
              <DialogFooter>
                <Button type="submit" disabled={loading}>
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {currentPlan ? 'Simpan Perubahan' : 'Tambah Paket'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
