"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import {
  getPricingPlans,
  savePricingPlan,
  deletePricingPlan,
  initializePricingPlans,
  formatPrice,
  type PricingPlan,
} from "@/lib/firebase-pricing"
import { Plus, Edit, Trash2, Save, X, AlertCircle, DollarSign, Users, BookOpen } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function PricingManagement() {
  const [plans, setPlans] = useState<PricingPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    loadPricingPlans()
  }, [])

  const loadPricingPlans = async () => {
    try {
      setLoading(true)
      const pricingPlans = await getPricingPlans()
      setPlans(pricingPlans.sort((a, b) => a.order - b.order))
    } catch (error) {
      console.error("Error loading pricing plans:", error)
      toast({
        title: "Error",
        description: "Gagal memuat data pricing. Mencoba inisialisasi...",
        variant: "destructive",
      })

      // Try to initialize default plans
      try {
        await initializePricingPlans()
        const pricingPlans = await getPricingPlans()
        setPlans(pricingPlans.sort((a, b) => a.order - b.order))
        toast({
          title: "Success",
          description: "Pricing plans berhasil diinisialisasi dengan data default",
        })
      } catch (initError) {
        console.error("Error initializing pricing plans:", initError)
        toast({
          title: "Error",
          description: "Gagal menginisialisasi pricing plans",
          variant: "destructive",
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSavePlan = async (planData: Omit<PricingPlan, "createdAt" | "updatedAt">) => {
    try {
      setSaving(true)
      await savePricingPlan(planData)
      await loadPricingPlans()
      setIsDialogOpen(false)
      setEditingPlan(null)
      toast({
        title: "Success",
        description: "Pricing plan berhasil disimpan",
      })
    } catch (error) {
      console.error("Error saving pricing plan:", error)
      toast({
        title: "Error",
        description: "Gagal menyimpan pricing plan",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleDeletePlan = async (planId: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus pricing plan ini?")) return

    try {
      await deletePricingPlan(planId)
      await loadPricingPlans()
      toast({
        title: "Success",
        description: "Pricing plan berhasil dihapus",
      })
    } catch (error) {
      console.error("Error deleting pricing plan:", error)
      toast({
        title: "Error",
        description: "Gagal menghapus pricing plan",
        variant: "destructive",
      })
    }
  }

  const openEditDialog = (plan?: PricingPlan) => {
    setEditingPlan(
      plan || {
        id: "",
        name: "",
        description: "",
        price: 0,
        features: [],
        maxStudents: 10,
        maxTeachers: 2,
        isActive: true,
        isPopular: false,
        isRecommended: false,
        order: plans.length + 1,
      },
    )
    setIsDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-24 mb-2" />
                <Skeleton className="h-8 w-32 mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((j) => (
                    <Skeleton key={j} className="h-4 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Pricing Management</h2>
          <p className="text-muted-foreground">Kelola paket harga dan fitur untuk pengguna</p>
        </div>
        <Button onClick={() => openEditDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Tambah Paket
        </Button>
      </div>

      {plans.length === 0 && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Belum ada pricing plans. Klik "Tambah Paket" untuk membuat yang pertama.</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.id} className={`relative ${!plan.isActive ? "opacity-60" : ""}`}>
            {/* Badges */}
            <div className="absolute -top-2 -right-2 flex flex-col gap-1">
              {plan.isRecommended && <Badge className="bg-blue-500">Recommended</Badge>}
              {plan.isPopular && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  Popular
                </Badge>
              )}
              {!plan.isActive && <Badge variant="outline">Inactive</Badge>}
            </div>

            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{plan.name}</span>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => openEditDialog(plan)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeletePlan(plan.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="text-2xl font-bold">{formatPrice(plan.price)}</span>
                  {plan.price > 0 && <span className="text-muted-foreground">/bulan</span>}
                </div>
                {plan.originalPrice && plan.originalPrice > plan.price && (
                  <div className="text-sm text-muted-foreground">
                    <span className="line-through">{formatPrice(plan.originalPrice)}</span>
                  </div>
                )}
              </div>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Limits */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <div>
                    <div className="font-semibold">{plan.maxStudents === "unlimited" ? "∞" : plan.maxStudents}</div>
                    <div className="text-xs text-muted-foreground">Murid</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-purple-600" />
                  <div>
                    <div className="font-semibold">{plan.maxTeachers === "unlimited" ? "∞" : plan.maxTeachers}</div>
                    <div className="text-xs text-muted-foreground">Ustadz</div>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-1">
                <div className="text-sm font-medium">Fitur:</div>
                <div className="text-xs text-muted-foreground">
                  {plan.features.slice(0, 3).join(", ")}
                  {plan.features.length > 3 && ` +${plan.features.length - 3} lainnya`}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPlan?.id ? "Edit Pricing Plan" : "Tambah Pricing Plan"}</DialogTitle>
            <DialogDescription>Atur detail paket harga dan fitur yang tersedia</DialogDescription>
          </DialogHeader>

          {editingPlan && (
            <PricingPlanForm
              plan={editingPlan}
              onSave={handleSavePlan}
              onCancel={() => setIsDialogOpen(false)}
              saving={saving}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Pricing Plan Form Component
function PricingPlanForm({
  plan,
  onSave,
  onCancel,
  saving,
}: {
  plan: PricingPlan
  onSave: (plan: Omit<PricingPlan, "createdAt" | "updatedAt">) => void
  onCancel: () => void
  saving: boolean
}) {
  const [formData, setFormData] = useState(plan)
  const [newFeature, setNewFeature] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
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

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="limits">Limits</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Paket</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="order">Urutan</Label>
              <Input
                id="order"
                type="number"
                value={formData.order}
                onChange={(e) => setFormData((prev) => ({ ...prev, order: Number.parseInt(e.target.value) }))}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Harga (Rp)</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData((prev) => ({ ...prev, price: Number.parseInt(e.target.value) }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="originalPrice">Harga Asli (Opsional)</Label>
              <Input
                id="originalPrice"
                type="number"
                value={formData.originalPrice || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    originalPrice: e.target.value ? Number.parseInt(e.target.value) : undefined,
                  }))
                }
              />
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isActive: checked }))}
              />
              <Label htmlFor="isActive">Aktif</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="isPopular"
                checked={formData.isPopular}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isPopular: checked }))}
              />
              <Label htmlFor="isPopular">Popular</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="isRecommended"
                checked={formData.isRecommended}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, isRecommended: checked }))}
              />
              <Label htmlFor="isRecommended">Recommended</Label>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="limits" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxStudents">Maksimal Murid</Label>
              <div className="flex gap-2">
                <Input
                  id="maxStudents"
                  type="number"
                  value={formData.maxStudents === "unlimited" ? "" : formData.maxStudents}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      maxStudents: e.target.value ? Number.parseInt(e.target.value) : 0,
                    }))
                  }
                  disabled={formData.maxStudents === "unlimited"}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      maxStudents: prev.maxStudents === "unlimited" ? 100 : "unlimited",
                    }))
                  }
                >
                  {formData.maxStudents === "unlimited" ? "Limited" : "Unlimited"}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxTeachers">Maksimal Ustadz</Label>
              <div className="flex gap-2">
                <Input
                  id="maxTeachers"
                  type="number"
                  value={formData.maxTeachers === "unlimited" ? "" : formData.maxTeachers}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      maxTeachers: e.target.value ? Number.parseInt(e.target.value) : 0,
                    }))
                  }
                  disabled={formData.maxTeachers === "unlimited"}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      maxTeachers: prev.maxTeachers === "unlimited" ? 10 : "unlimited",
                    }))
                  }
                >
                  {formData.maxTeachers === "unlimited" ? "Limited" : "Unlimited"}
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <div className="space-y-2">
            <Label>Fitur-fitur</Label>
            <div className="flex gap-2">
              <Input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                placeholder="Tambah fitur baru..."
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
              />
              <Button type="button" onClick={addFeature}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            {formData.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 p-2 border rounded">
                <span className="flex-1">{feature}</span>
                <Button type="button" variant="ghost" size="sm" onClick={() => removeFeature(index)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit" disabled={saving}>
          {saving && <Save className="h-4 w-4 mr-2 animate-spin" />}
          Simpan
        </Button>
      </DialogFooter>
    </form>
  )
}
