"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  DialogTrigger as AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { Plus, Edit, Trash2, Crown, Star, Users, GraduationCap, Check, X } from "lucide-react"
import {
  type PricingPlan,
  createPricingPlan,
  updatePricingPlan,
  deletePricingPlan,
  formatPrice,
  calculateYearlyPrice,
  subscribeToPricingChanges,
} from "@/lib/firebase-pricing"

interface PricingFormData {
  name: string
  price: number
  currency: string
  description: string
  features: string[]
  maxStudents: number | null
  maxTeachers: number | null
  isPopular: boolean
  isRecommended: boolean
  order: number
  active: boolean
}

const defaultFormData: PricingFormData = {
  name: "",
  price: 0,
  currency: "IDR",
  description: "",
  features: [],
  maxStudents: null,
  maxTeachers: null,
  isPopular: false,
  isRecommended: false,
  order: 1,
  active: true,
}

export function PricingManagement() {
  const [plans, setPlans] = useState<PricingPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null)
  const [formData, setFormData] = useState<PricingFormData>(defaultFormData)
  const [newFeature, setNewFeature] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("basic")

  useEffect(() => {
    const unsubscribe = subscribeToPricingChanges((updatedPlans) => {
      setPlans(updatedPlans)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const handleEdit = (plan: PricingPlan) => {
    setEditingPlan(plan)
    setFormData({
      name: plan.name,
      price: plan.price,
      currency: plan.currency,
      description: plan.description,
      features: [...plan.features],
      maxStudents: plan.maxStudents,
      maxTeachers: plan.maxTeachers,
      isPopular: plan.isPopular || false,
      isRecommended: plan.isRecommended || false,
      order: plan.order,
      active: plan.active,
    })
    setDialogOpen(true)
  }

  const handleCreate = () => {
    setEditingPlan(null)
    setFormData({
      ...defaultFormData,
      order: plans.length + 1,
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    try {
      if (!formData.name.trim()) {
        toast.error("Nama paket harus diisi")
        return
      }

      if (editingPlan) {
        await updatePricingPlan(editingPlan.id, formData)
        toast.success("Paket berhasil diperbarui")
      } else {
        await createPricingPlan(formData)
        toast.success("Paket berhasil dibuat")
      }

      setDialogOpen(false)
      setFormData(defaultFormData)
      setEditingPlan(null)
    } catch (error) {
      console.error("Error saving plan:", error)
      toast.error("Gagal menyimpan paket")
    }
  }

  const handleDelete = async (planId: string) => {
    try {
      await deletePricingPlan(planId)
      toast.success("Paket berhasil dihapus")
    } catch (error) {
      console.error("Error deleting plan:", error)
      toast.error("Gagal menghapus paket")
    }
  }

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData((prev) => ({
        ...prev,
        features: [...prev.features, newFeature.trim()],
      }))
      setNewFeature("")
    }
  }

  const removeFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }))
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Kelola Harga Langganan</h2>
          <p className="text-muted-foreground">Atur paket langganan dan harga untuk aplikasi</p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Tambah Paket
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.id} className={`relative ${!plan.active ? "opacity-60" : ""}`}>
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {plan.name}
                    {plan.isPopular && (
                      <Badge variant="secondary">
                        <Star className="w-3 h-3" />
                      </Badge>
                    )}
                    {plan.isRecommended && (
                      <Badge>
                        <Crown className="w-3 h-3" />
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(plan)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Paket</AlertDialogTitle>
                        <AlertDialogDescription>
                          Apakah Anda yakin ingin menghapus paket "{plan.name}"? Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(plan.id)}>Hapus</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-3xl font-bold">{formatPrice(plan.price)}</div>
                <div className="text-sm text-muted-foreground">per bulan</div>
                {plan.price > 0 && (
                  <div className="text-sm text-green-600">
                    {formatPrice(calculateYearlyPrice(plan.price))}/tahun (hemat 20%)
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4" />
                  <span>
                    {plan.maxStudents === null ? "Santri tidak terbatas" : `Maksimal ${plan.maxStudents} santri`}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <GraduationCap className="w-4 h-4" />
                  <span>
                    {plan.maxTeachers === null ? "Penguji tidak terbatas" : `Maksimal ${plan.maxTeachers} penguji`}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                {plan.features.slice(0, 3).map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <Check className="w-3 h-3 text-green-500" />
                    <span>{feature}</span>
                  </div>
                ))}
                {plan.features.length > 3 && (
                  <div className="text-xs text-muted-foreground">+{plan.features.length - 3} fitur lainnya</div>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Order: {plan.order}</span>
                <span className={plan.active ? "text-green-600" : "text-red-600"}>
                  {plan.active ? "Aktif" : "Nonaktif"}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPlan ? "Edit Paket" : "Tambah Paket Baru"}</DialogTitle>
            <DialogDescription>
              {editingPlan ? "Perbarui informasi paket langganan" : "Buat paket langganan baru"}
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="basic">Info Dasar</TabsTrigger>
              <TabsTrigger value="limits">Batasan</TabsTrigger>
              <TabsTrigger value="features">Fitur</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nama Paket</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Contoh: Premium"
                  />
                </div>
                <div>
                  <Label htmlFor="price">Harga (per bulan)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData((prev) => ({ ...prev, price: Number(e.target.value) }))}
                    placeholder="50000"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Deskripsi</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Deskripsi singkat tentang paket ini"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="order">Urutan Tampil</Label>
                  <Input
                    id="order"
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData((prev) => ({ ...prev, order: Number(e.target.value) }))}
                    min="1"
                  />
                </div>
                <div className="space-y-3 pt-6">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="active"
                      checked={formData.active}
                      onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, active: checked }))}
                    />
                    <Label htmlFor="active">Aktif</Label>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="popular"
                    checked={formData.isPopular}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isPopular: checked }))}
                  />
                  <Label htmlFor="popular">Populer</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="recommended"
                    checked={formData.isRecommended}
                    onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isRecommended: checked }))}
                  />
                  <Label htmlFor="recommended">Direkomendasikan</Label>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="limits" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="maxStudents">Maksimal Santri</Label>
                  <Input
                    id="maxStudents"
                    type="number"
                    value={formData.maxStudents || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        maxStudents: e.target.value ? Number(e.target.value) : null,
                      }))
                    }
                    placeholder="Kosongkan untuk tidak terbatas"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Kosongkan untuk tidak terbatas</p>
                </div>
                <div>
                  <Label htmlFor="maxTeachers">Maksimal Penguji</Label>
                  <Input
                    id="maxTeachers"
                    type="number"
                    value={formData.maxTeachers || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        maxTeachers: e.target.value ? Number(e.target.value) : null,
                      }))
                    }
                    placeholder="Kosongkan untuk tidak terbatas"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Kosongkan untuk tidak terbatas</p>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Preview Batasan</h4>
                <div className="space-y-1 text-sm text-blue-800">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>
                      {formData.maxStudents === null
                        ? "Santri tidak terbatas"
                        : `Maksimal ${formData.maxStudents} santri`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    <span>
                      {formData.maxTeachers === null
                        ? "Penguji tidak terbatas"
                        : `Maksimal ${formData.maxTeachers} penguji`}
                    </span>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="features" className="space-y-4">
              <div>
                <Label>Tambah Fitur</Label>
                <div className="flex gap-2">
                  <Input
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Masukkan fitur baru"
                    onKeyPress={(e) => e.key === "Enter" && addFeature()}
                  />
                  <Button onClick={addFeature} type="button">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div>
                <Label>Daftar Fitur</Label>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => removeFeature(index)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  {formData.features.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">Belum ada fitur ditambahkan</p>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleSave}>{editingPlan ? "Perbarui" : "Buat"} Paket</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
