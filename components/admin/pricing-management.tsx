"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  getPricingPlans,
  updatePricingPlans,
  initializePricingPlans,
  formatPrice,
  calculateDiscount,
  type PricingPlan,
} from "@/lib/firebase-pricing"
import {
  Save,
  Plus,
  Trash2,
  DollarSign,
  Star,
  Award,
  Loader2,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Settings,
} from "lucide-react"

export default function PricingManagement() {
  const [plans, setPlans] = useState<PricingPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [initializing, setInitializing] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    loadPricingPlans()
  }, [])

  const loadPricingPlans = async () => {
    try {
      setLoading(true)
      setMessage(null)
      console.log("Loading pricing plans...")

      const pricingPlans = await getPricingPlans()
      console.log("Loaded plans:", pricingPlans)

      setPlans(pricingPlans.sort((a, b) => a.order - b.order))
      setMessage({ type: "success", text: "Data harga berhasil dimuat" })
    } catch (error: any) {
      console.error("Error loading pricing plans:", error)
      setMessage({
        type: "error",
        text: `Gagal memuat data harga: ${error.message || "Unknown error"}`,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInitialize = async () => {
    try {
      setInitializing(true)
      setMessage(null)

      await initializePricingPlans()
      await loadPricingPlans()

      setMessage({ type: "success", text: "Data harga berhasil diinisialisasi" })
    } catch (error: any) {
      console.error("Error initializing pricing plans:", error)
      setMessage({
        type: "error",
        text: `Gagal menginisialisasi data: ${error.message || "Unknown error"}`,
      })
    } finally {
      setInitializing(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setMessage(null)

      // Validate plans
      for (const plan of plans) {
        if (!plan.name.trim()) {
          throw new Error("Nama paket tidak boleh kosong")
        }
        if (plan.price < 0) {
          throw new Error("Harga tidak boleh negatif")
        }
        if (plan.features.length === 0) {
          throw new Error(`Paket ${plan.name} harus memiliki minimal 1 fitur`)
        }
      }

      await updatePricingPlans(plans)
      setMessage({ type: "success", text: "Harga berhasil diperbarui!" })
    } catch (error: any) {
      console.error("Error saving pricing plans:", error)
      setMessage({ type: "error", text: error.message || "Gagal menyimpan perubahan" })
    } finally {
      setSaving(false)
    }
  }

  const updatePlan = (planId: string, updates: Partial<PricingPlan>) => {
    setPlans((prev) => prev.map((plan) => (plan.id === planId ? { ...plan, ...updates } : plan)))
  }

  const addFeature = (planId: string) => {
    updatePlan(planId, {
      features: [...(plans.find((p) => p.id === planId)?.features || []), ""],
    })
  }

  const updateFeature = (planId: string, featureIndex: number, value: string) => {
    const plan = plans.find((p) => p.id === planId)
    if (!plan) return

    const newFeatures = [...plan.features]
    newFeatures[featureIndex] = value
    updatePlan(planId, { features: newFeatures })
  }

  const removeFeature = (planId: string, featureIndex: number) => {
    const plan = plans.find((p) => p.id === planId)
    if (!plan) return

    const newFeatures = plan.features.filter((_, index) => index !== featureIndex)
    updatePlan(planId, { features: newFeatures })
  }

  const toggleUnlimited = (planId: string, field: "maxStudents" | "maxTeachers") => {
    const plan = plans.find((p) => p.id === planId)
    if (!plan) return

    const currentValue = plan[field]
    const newValue = currentValue === "unlimited" ? 1 : "unlimited"
    updatePlan(planId, { [field]: newValue })
  }

  const addNewPlan = () => {
    const newPlan: PricingPlan = {
      id: `plan_${Date.now()}`,
      name: "Paket Baru",
      price: 0,
      description: "Deskripsi paket baru",
      features: ["Fitur 1"],
      maxStudents: 10,
      maxTeachers: 1,
      isActive: true,
      order: plans.length + 1,
    }
    setPlans([...plans, newPlan])
  }

  const removePlan = (planId: string) => {
    setPlans(plans.filter((plan) => plan.id !== planId))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Memuat data harga...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Manajemen Harga Langganan</h2>
          <p className="text-muted-foreground">Kelola paket langganan dan harga untuk aplikasi</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={loadPricingPlans} disabled={loading}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Settings className="mr-2 h-4 w-4" />
                Inisialisasi
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Inisialisasi Data Harga</DialogTitle>
                <DialogDescription>
                  Ini akan membuat data harga default jika belum ada. Data yang sudah ada tidak akan terhapus.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => {}}>
                  Batal
                </Button>
                <Button onClick={handleInitialize} disabled={initializing}>
                  {initializing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Menginisialisasi...
                    </>
                  ) : (
                    "Inisialisasi"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button onClick={addNewPlan} variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Tambah Paket
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Simpan Perubahan
              </>
            )}
          </Button>
        </div>
      </div>

      {message && (
        <Alert variant={message.type === "error" ? "destructive" : "default"}>
          {message.type === "success" ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      {plans.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <DollarSign className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Belum Ada Data Harga</h3>
            <p className="text-muted-foreground text-center mb-4">
              Belum ada paket langganan yang tersedia. Klik tombol di bawah untuk menginisialisasi data default.
            </p>
            <Button onClick={handleInitialize} disabled={initializing}>
              {initializing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Menginisialisasi...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Inisialisasi Data Harga
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {plans.map((plan) => (
            <Card key={plan.id} className="relative">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CardTitle className="flex items-center space-x-2">
                      <DollarSign className="h-5 w-5" />
                      <Input
                        value={plan.name}
                        onChange={(e) => updatePlan(plan.id, { name: e.target.value })}
                        className="text-lg font-bold border-0 p-0 h-auto bg-transparent"
                        placeholder="Nama Paket"
                      />
                    </CardTitle>
                    {plan.isPopular && (
                      <Badge variant="secondary">
                        <Star className="h-3 w-3 mr-1" />
                        Popular
                      </Badge>
                    )}
                    {plan.isRecommended && (
                      <Badge>
                        <Award className="h-3 w-3 mr-1" />
                        Recommended
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removePlan(plan.id)}
                      disabled={plans.length <= 1}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center space-x-2">
                      <Label htmlFor={`active-${plan.id}`} className="text-sm">
                        Aktif
                      </Label>
                      <Switch
                        id={`active-${plan.id}`}
                        checked={plan.isActive}
                        onCheckedChange={(checked) => updatePlan(plan.id, { isActive: checked })}
                      />
                    </div>
                  </div>
                </div>
                <CardDescription>
                  <Textarea
                    value={plan.description}
                    onChange={(e) => updatePlan(plan.id, { description: e.target.value })}
                    placeholder="Deskripsi paket..."
                    className="min-h-[60px]"
                  />
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Pricing */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Harga Saat Ini (Rp)</Label>
                    <Input
                      type="number"
                      value={plan.price}
                      onChange={(e) => updatePlan(plan.id, { price: Number.parseInt(e.target.value) || 0 })}
                      placeholder="0"
                    />
                    <p className="text-sm text-muted-foreground">Tampil: {formatPrice(plan.price)}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Harga Asli (Opsional)</Label>
                    <Input
                      type="number"
                      value={plan.originalPrice || ""}
                      onChange={(e) =>
                        updatePlan(plan.id, {
                          originalPrice: e.target.value ? Number.parseInt(e.target.value) : undefined,
                        })
                      }
                      placeholder="Kosongkan jika tidak ada diskon"
                    />
                    {plan.originalPrice && plan.originalPrice > plan.price && (
                      <p className="text-sm text-green-600">
                        Diskon: {calculateDiscount(plan.originalPrice, plan.price)}%
                      </p>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Limits */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Maksimal Murid</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        value={plan.maxStudents === "unlimited" ? "" : plan.maxStudents}
                        onChange={(e) =>
                          updatePlan(plan.id, {
                            maxStudents: e.target.value ? Number.parseInt(e.target.value) : 1,
                          })
                        }
                        disabled={plan.maxStudents === "unlimited"}
                        placeholder="Jumlah murid"
                      />
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={plan.maxStudents === "unlimited"}
                          onCheckedChange={() => toggleUnlimited(plan.id, "maxStudents")}
                        />
                        <Label className="text-sm">Unlimited</Label>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Maksimal Ustadz</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        value={plan.maxTeachers === "unlimited" ? "" : plan.maxTeachers}
                        onChange={(e) =>
                          updatePlan(plan.id, {
                            maxTeachers: e.target.value ? Number.parseInt(e.target.value) : 1,
                          })
                        }
                        disabled={plan.maxTeachers === "unlimited"}
                        placeholder="Jumlah ustadz"
                      />
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={plan.maxTeachers === "unlimited"}
                          onCheckedChange={() => toggleUnlimited(plan.id, "maxTeachers")}
                        />
                        <Label className="text-sm">Unlimited</Label>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Features */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Fitur-fitur</Label>
                    <Button type="button" variant="outline" size="sm" onClick={() => addFeature(plan.id)}>
                      <Plus className="h-4 w-4 mr-1" />
                      Tambah Fitur
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Input
                          value={feature}
                          onChange={(e) => updateFeature(plan.id, index, e.target.value)}
                          placeholder="Nama fitur..."
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeFeature(plan.id, index)}
                          disabled={plan.features.length <= 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Badges */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={plan.isPopular || false}
                      onCheckedChange={(checked) => updatePlan(plan.id, { isPopular: checked })}
                    />
                    <Label>Popular</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={plan.isRecommended || false}
                      onCheckedChange={(checked) => updatePlan(plan.id, { isRecommended: checked })}
                    />
                    <Label>Recommended</Label>
                  </div>
                  <div className="space-y-2">
                    <Label>Urutan</Label>
                    <Input
                      type="number"
                      value={plan.order}
                      onChange={(e) => updatePlan(plan.id, { order: Number.parseInt(e.target.value) || 1 })}
                      min="1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
