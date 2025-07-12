"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Plus, Edit, Trash2, Save, RefreshCw, DollarSign, CheckCircle, AlertTriangle } from "lucide-react"
import {
  getPricingPlans,
  savePricingPlan,
  deletePricingPlan,
  initializePricingPlans,
  formatPrice,
} from "@/lib/firebase-pricing"
import type { SubscriptionTierInfo, TierFeatures } from "@/lib/types"
import { toast } from "@/hooks/use-toast"

const FEATURE_LABELS = {
  maxStudents: "Maksimal Santri",
  maxUstadz: "Maksimal Ustadz",
  maxUstadzah: "Maksimal Ustadzah",
  exportPDF: "Export PDF",
  prioritySupport: "Priority Support",
  customReports: "Custom Reports",
  multipleInstitutions: "Multiple Institutions",
  apiAccess: "API Access",
  advancedAnalytics: "Advanced Analytics",
  bulkImport: "Bulk Import",
}

export default function PricingManagement() {
  const [plans, setPlans] = useState<SubscriptionTierInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editingPlan, setEditingPlan] = useState<SubscriptionTierInfo | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Load pricing plans
  const loadPricingPlans = async () => {
    try {
      setLoading(true)
      setError(null)
      const pricingPlans = await getPricingPlans()
      setPlans(pricingPlans)
    } catch (err) {
      console.error("Error loading pricing plans:", err)
      setError("Gagal memuat data harga langganan")
    } finally {
      setLoading(false)
    }
  }

  // Initialize with default plans
  const initializeDefaults = async () => {
    try {
      setSaving(true)
      await initializePricingPlans()
      await loadPricingPlans()
      toast({
        title: "Berhasil",
        description: "Harga default berhasil diinisialisasi",
      })
    } catch (err) {
      console.error("Error initializing defaults:", err)
      toast({
        title: "Error",
        description: "Gagal menginisialisasi harga default",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  // Save pricing plan
  const handleSavePlan = async (plan: SubscriptionTierInfo) => {
    try {
      setSaving(true)
      await savePricingPlan(plan)
      await loadPricingPlans()
      setIsDialogOpen(false)
      setEditingPlan(null)
      toast({
        title: "Berhasil",
        description: `Paket ${plan.name} berhasil disimpan`,
      })
    } catch (err) {
      console.error("Error saving plan:", err)
      toast({
        title: "Error",
        description: "Gagal menyimpan paket langganan",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  // Delete pricing plan
  const handleDeletePlan = async (planId: string) => {
    try {
      setSaving(true)
      await deletePricingPlan(planId)
      await loadPricingPlans()
      toast({
        title: "Berhasil",
        description: "Paket langganan berhasil dihapus",
      })
    } catch (err) {
      console.error("Error deleting plan:", err)
      toast({
        title: "Error",
        description: "Gagal menghapus paket langganan",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  // Create new plan
  const createNewPlan = () => {
    const newPlan: SubscriptionTierInfo = {
      id: `plan_${Date.now()}`,
      name: "",
      description: "",
      price: 0,
      currency: "IDR",
      billingPeriod: "monthly",
      features: {
        maxStudents: 10,
        maxUstadz: 1,
        maxUstadzah: 1,
        exportPDF: false,
        prioritySupport: false,
        customReports: false,
        multipleInstitutions: false,
        apiAccess: false,
        advancedAnalytics: false,
        bulkImport: false,
      },
    }
    setEditingPlan(newPlan)
    setIsDialogOpen(true)
  }

  // Edit existing plan
  const editPlan = (plan: SubscriptionTierInfo) => {
    setEditingPlan({ ...plan })
    setIsDialogOpen(true)
  }

  useEffect(() => {
    loadPricingPlans()
  }, [])

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin mr-2" />
          Memuat data harga...
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <DollarSign className="h-6 w-6" />
            Kelola Harga Langganan
          </h2>
          <p className="text-muted-foreground">Atur harga dan fitur untuk setiap paket langganan</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadPricingPlans} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button onClick={createNewPlan}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Paket
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            {error}
            <Button variant="outline" size="sm" onClick={initializeDefaults}>
              Inisialisasi Default
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Pricing Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className="relative">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {plan.name}
                    {plan.popular && <Badge variant="secondary">Popular</Badge>}
                    {plan.recommended && <Badge variant="default">Recommended</Badge>}
                  </CardTitle>
                  <CardDescription className="mt-2">{plan.description}</CardDescription>
                </div>
              </div>

              <div className="text-3xl font-bold text-primary">
                {formatPrice(plan.price)}
                <span className="text-sm font-normal text-muted-foreground">
                  /{plan.billingPeriod === "monthly" ? "bulan" : "tahun"}
                </span>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Santri:</span>
                    <span className="font-medium ml-1">
                      {plan.features.maxStudents === -1 ? "Unlimited" : plan.features.maxStudents}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Ustadz:</span>
                    <span className="font-medium ml-1">
                      {plan.features.maxUstadz === -1 ? "Unlimited" : plan.features.maxUstadz}
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Ustadzah:</span>
                    <span className="font-medium ml-1">
                      {plan.features.maxUstadzah === -1 ? "Unlimited" : plan.features.maxUstadzah}
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-1">
                  {Object.entries(plan.features).map(([key, value]) => {
                    if (["maxStudents", "maxUstadz", "maxUstadzah"].includes(key)) return null
                    return (
                      <div key={key} className="flex items-center justify-between text-sm">
                        <span>{FEATURE_LABELS[key as keyof TierFeatures]}</span>
                        {value ? <CheckCircle className="h-4 w-4 text-green-500" /> : <div className="h-4 w-4" />}
                      </div>
                    )
                  })}
                </div>

                <div className="flex gap-2 pt-4">
                  <Button variant="outline" size="sm" onClick={() => editPlan(plan)} className="flex-1">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Paket Langganan</AlertDialogTitle>
                        <AlertDialogDescription>
                          Apakah Anda yakin ingin menghapus paket "{plan.name}"? Tindakan ini tidak dapat dibatalkan.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeletePlan(plan.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Hapus
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit/Create Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPlan?.name ? `Edit Paket: ${editingPlan.name}` : "Tambah Paket Baru"}</DialogTitle>
            <DialogDescription>Atur detail paket langganan dan fitur yang tersedia</DialogDescription>
          </DialogHeader>

          {editingPlan && (
            <PlanEditor
              plan={editingPlan}
              onSave={handleSavePlan}
              onCancel={() => {
                setIsDialogOpen(false)
                setEditingPlan(null)
              }}
              saving={saving}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Plan Editor Component
function PlanEditor({
  plan,
  onSave,
  onCancel,
  saving,
}: {
  plan: SubscriptionTierInfo
  onSave: (plan: SubscriptionTierInfo) => void
  onCancel: () => void
  saving: boolean
}) {
  const [editedPlan, setEditedPlan] = useState<SubscriptionTierInfo>(plan)

  const updatePlan = (updates: Partial<SubscriptionTierInfo>) => {
    setEditedPlan((prev) => ({ ...prev, ...updates }))
  }

  const updateFeatures = (updates: Partial<TierFeatures>) => {
    setEditedPlan((prev) => ({
      ...prev,
      features: { ...prev.features, ...updates },
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(editedPlan)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
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
                value={editedPlan.name}
                onChange={(e) => updatePlan({ name: e.target.value })}
                placeholder="Basic, Premium, Pro..."
                required
              />
            </div>
            <div>
              <Label htmlFor="price">Harga (IDR)</Label>
              <Input
                id="price"
                type="number"
                value={editedPlan.price}
                onChange={(e) => updatePlan({ price: Number.parseInt(e.target.value) || 0 })}
                placeholder="99000"
                min="0"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              value={editedPlan.description}
              onChange={(e) => updatePlan({ description: e.target.value })}
              placeholder="Deskripsi paket langganan..."
              rows={3}
            />
          </div>

          <div className="flex gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="popular"
                checked={editedPlan.popular || false}
                onCheckedChange={(checked) => updatePlan({ popular: checked })}
              />
              <Label htmlFor="popular">Popular</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="recommended"
                checked={editedPlan.recommended || false}
                onCheckedChange={(checked) => updatePlan({ recommended: checked })}
              />
              <Label htmlFor="recommended">Recommended</Label>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="limits" className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="maxStudents">Maksimal Santri</Label>
              <Input
                id="maxStudents"
                type="number"
                value={editedPlan.features.maxStudents === -1 ? "" : editedPlan.features.maxStudents}
                onChange={(e) => {
                  const value = e.target.value === "" ? -1 : Number.parseInt(e.target.value) || 0
                  updateFeatures({ maxStudents: value })
                }}
                placeholder="Unlimited"
                min="1"
              />
              <p className="text-xs text-muted-foreground mt-1">Kosongkan untuk unlimited</p>
            </div>
            <div>
              <Label htmlFor="maxUstadz">Maksimal Ustadz</Label>
              <Input
                id="maxUstadz"
                type="number"
                value={editedPlan.features.maxUstadz === -1 ? "" : editedPlan.features.maxUstadz}
                onChange={(e) => {
                  const value = e.target.value === "" ? -1 : Number.parseInt(e.target.value) || 0
                  updateFeatures({ maxUstadz: value })
                }}
                placeholder="Unlimited"
                min="1"
              />
            </div>
            <div>
              <Label htmlFor="maxUstadzah">Maksimal Ustadzah</Label>
              <Input
                id="maxUstadzah"
                type="number"
                value={editedPlan.features.maxUstadzah === -1 ? "" : editedPlan.features.maxUstadzah}
                onChange={(e) => {
                  const value = e.target.value === "" ? -1 : Number.parseInt(e.target.value) || 0
                  updateFeatures({ maxUstadzah: value })
                }}
                placeholder="Unlimited"
                min="1"
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(FEATURE_LABELS).map(([key, label]) => {
              if (["maxStudents", "maxUstadz", "maxUstadzah"].includes(key)) return null
              return (
                <div key={key} className="flex items-center justify-between">
                  <Label htmlFor={key}>{label}</Label>
                  <Switch
                    id={key}
                    checked={editedPlan.features[key as keyof TierFeatures] as boolean}
                    onCheckedChange={(checked) => updateFeatures({ [key]: checked })}
                  />
                </div>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit" disabled={saving}>
          {saving && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
          <Save className="h-4 w-4 mr-2" />
          Simpan
        </Button>
      </div>
    </form>
  )
}
