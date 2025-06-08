"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { useAdmin } from "@/hooks/use-admin"
import {
  Crown,
  User,
  Users,
  GraduationCap,
  Calendar,
  Search,
  Filter,
  Clock,
  DollarSign,
  TrendingUp,
  RefreshCw,
} from "lucide-react"

interface SubscriptionManagerProps {
  users: any[]
  analytics: any
  loading: boolean
  onRefresh: () => void
}

export default function SubscriptionManager({ users, analytics, loading, onRefresh }: SubscriptionManagerProps) {
  const { updateSubscription, checkExpiredUsers } = useAdmin()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [updating, setUpdating] = useState<string | null>(null)
  const [customExpiry, setCustomExpiry] = useState("")
  const [notes, setNotes] = useState("")
  const [showExpiredCheck, setShowExpiredCheck] = useState(false)

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())

    let matchesFilter = true
    switch (filterType) {
      case "free":
        matchesFilter = user.subscriptionType === "free"
        break
      case "premium":
        matchesFilter = user.subscriptionType === "premium"
        break
      case "expired":
        matchesFilter =
          user.subscriptionType === "premium" &&
          user.subscriptionExpiry &&
          new Date(user.subscriptionExpiry) < new Date()
        break
      case "expiring_soon":
        matchesFilter =
          user.subscriptionType === "premium" &&
          user.subscriptionExpiry &&
          new Date(user.subscriptionExpiry) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) &&
          new Date(user.subscriptionExpiry) > new Date()
        break
      default:
        matchesFilter = true
    }

    return matchesSearch && matchesFilter
  })

  const handleUpdateSubscription = async (userId: string, subscriptionType: "free" | "premium") => {
    try {
      setUpdating(userId)

      let expiryDate: Date | undefined

      if (subscriptionType === "premium") {
        if (customExpiry) {
          expiryDate = new Date(customExpiry)
          if (expiryDate <= new Date()) {
            alert("Tanggal expiry harus di masa depan")
            return
          }
        } else {
          // Default 30 days
          expiryDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
      }

      await updateSubscription(userId, subscriptionType, expiryDate, notes)

      setSelectedUser(null)
      setCustomExpiry("")
      setNotes("")

      // Show success message
      alert(`✅ Berhasil mengubah langganan ${selectedUser?.email} ke ${subscriptionType}`)
    } catch (error: any) {
      alert(`❌ Error: ${error.message}`)
    } finally {
      setUpdating(null)
    }
  }

  const handleCheckExpiredUsers = async () => {
    try {
      setShowExpiredCheck(true)
      const downgraded = await checkExpiredUsers()

      if (downgraded > 0) {
        alert(`✅ ${downgraded} pengguna premium yang expired telah di-downgrade ke gratis`)
      } else {
        alert("✅ Tidak ada pengguna premium yang expired")
      }
    } catch (error: any) {
      alert(`❌ Error: ${error.message}`)
    } finally {
      setShowExpiredCheck(false)
    }
  }

  const getSubscriptionStatus = (user: any) => {
    if (user.subscriptionType === "free") {
      return { status: "free", color: "secondary", text: "Gratis" }
    }

    if (!user.subscriptionExpiry) {
      return { status: "premium", color: "default", text: "Premium" }
    }

    const expiryDate = new Date(user.subscriptionExpiry)
    const now = new Date()
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    if (expiryDate < now) {
      return { status: "expired", color: "destructive", text: "Expired" }
    } else if (daysUntilExpiry <= 7) {
      return { status: "expiring", color: "warning", text: `${daysUntilExpiry} hari lagi` }
    } else {
      return { status: "premium", color: "default", text: `${daysUntilExpiry} hari lagi` }
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Memuat Data Langganan...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-4 border rounded">
                <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">Rp {analytics.totalRevenue?.toLocaleString("id-ID")}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Conversion Rate</p>
                  <p className="text-2xl font-bold">{analytics.conversionRate}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Premium Users</p>
                  <p className="text-2xl font-bold">{analytics.premiumUsers}</p>
                </div>
                <Crown className="h-8 w-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Free Users</p>
                  <p className="text-2xl font-bold">{analytics.freeUsers}</p>
                </div>
                <User className="h-8 w-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Controls */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-amber-600" />
              Kelola Langganan ({filteredUsers.length})
            </CardTitle>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleCheckExpiredUsers} disabled={showExpiredCheck}>
                <Clock className={`h-4 w-4 mr-2 ${showExpiredCheck ? "animate-spin" : ""}`} />
                {showExpiredCheck ? "Checking..." : "Check Expired"}
              </Button>

              <Button variant="outline" size="sm" onClick={onRefresh}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cari nama atau email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="free">Gratis</SelectItem>
                <SelectItem value="premium">Premium Aktif</SelectItem>
                <SelectItem value="expired">Premium Expired</SelectItem>
                <SelectItem value="expiring_soon">Akan Expired (7 hari)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          {users.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Data Pengguna</h3>
              <p className="text-gray-500 mb-4">Data pengguna akan muncul di sini setelah ada yang mendaftar.</p>
              <Button onClick={onRefresh} variant="outline">
                Refresh Data
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((user) => {
                const subscriptionStatus = getSubscriptionStatus(user)

                return (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={user.photoURL || "/placeholder.svg"} />
                        <AvatarFallback>{user.displayName?.charAt(0) || user.email?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>

                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{user.displayName || user.email}</h3>
                          <Badge variant={subscriptionStatus.color as any}>
                            {user.subscriptionType === "premium" ? (
                              <Crown className="h-3 w-3 mr-1" />
                            ) : (
                              <User className="h-3 w-3 mr-1" />
                            )}
                            {subscriptionStatus.text}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{user.email}</p>

                        {/* Subscription Details */}
                        {user.subscriptionExpiry && (
                          <p className="text-xs text-muted-foreground">
                            Berakhir: {new Date(user.subscriptionExpiry).toLocaleDateString("id-ID")}
                          </p>
                        )}

                        {/* User Stats */}
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {user.stats?.studentsCount || 0} murid
                          </span>
                          <span className="flex items-center gap-1">
                            <GraduationCap className="h-3 w-3" />
                            {(user.stats?.ustadzCount || 0) + (user.stats?.ustadzahCount || 0)} penguji
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString("id-ID") : "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedUser(user)}>
                            Kelola
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Kelola Langganan</DialogTitle>
                            <DialogDescription>
                              Ubah paket langganan untuk {user.displayName || user.email}
                            </DialogDescription>
                          </DialogHeader>

                          <div className="space-y-4">
                            {/* Current Status */}
                            <div className="p-4 bg-muted rounded-lg">
                              <h4 className="font-medium mb-2">Status Saat Ini</h4>
                              <div className="space-y-1 text-sm">
                                <p>Email: {user.email}</p>
                                <p>Status: {user.subscriptionType === "premium" ? "Premium" : "Gratis"}</p>
                                {user.subscriptionExpiry && (
                                  <p>Berakhir: {new Date(user.subscriptionExpiry).toLocaleDateString("id-ID")}</p>
                                )}
                                <p>Murid: {user.stats?.studentsCount || 0}</p>
                                <p>Penguji: {(user.stats?.ustadzCount || 0) + (user.stats?.ustadzahCount || 0)}</p>
                              </div>
                            </div>

                            {/* Custom Expiry for Premium */}
                            <div className="space-y-2">
                              <Label htmlFor="customExpiry">Tanggal Berakhir Premium (Opsional)</Label>
                              <Input
                                id="customExpiry"
                                type="date"
                                value={customExpiry}
                                onChange={(e) => setCustomExpiry(e.target.value)}
                                min={new Date().toISOString().split("T")[0]}
                              />
                              <p className="text-xs text-muted-foreground">
                                Kosongkan untuk default 30 hari dari sekarang
                              </p>
                            </div>

                            {/* Notes */}
                            <div className="space-y-2">
                              <Label htmlFor="notes">Catatan (Opsional)</Label>
                              <Textarea
                                id="notes"
                                placeholder="Alasan perubahan langganan..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                rows={2}
                              />
                            </div>
                          </div>

                          <DialogFooter className="flex gap-2">
                            <Button
                              variant={user.subscriptionType === "free" ? "default" : "outline"}
                              onClick={() => handleUpdateSubscription(user.id, "free")}
                              disabled={updating === user.id}
                              className="flex-1"
                            >
                              {updating === user.id ? "Updating..." : "Set ke Gratis"}
                            </Button>
                            <Button
                              variant={user.subscriptionType === "premium" ? "default" : "outline"}
                              onClick={() => handleUpdateSubscription(user.id, "premium")}
                              disabled={updating === user.id}
                              className="flex-1"
                            >
                              <Crown className="h-4 w-4 mr-2" />
                              {updating === user.id ? "Updating..." : "Set ke Premium"}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                )
              })}

              {filteredUsers.length === 0 && users.length > 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  Tidak ada pengguna yang sesuai dengan filter
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
