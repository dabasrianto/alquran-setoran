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
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useAdmin } from "@/hooks/use-admin"
import {
  Crown,
  Shield,
  User,
  Users,
  GraduationCap,
  Calendar,
  Search,
  Filter,
  Edit,
  Trash2,
  RefreshCw,
  UserX,
  UserCheck,
  RotateCcw,
  Eye,
} from "lucide-react"

interface UserManagementProps {
  users: any[]
  loading: boolean
  onRefresh: () => void
}

export default function UserManagement({ users, loading, onRefresh }: UserManagementProps) {
  const { updateSubscription, deleteUser, updateUserProfile, toggleUserActiveStatus, resetUserData, updateUserAdminStatus } = useAdmin()

  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [updating, setUpdating] = useState<string | null>(null)
  const [editingUser, setEditingUser] = useState<any>(null)
  const [viewingUser, setViewingUser] = useState<any>(null)

  // Form states
  const [displayName, setDisplayName] = useState("")
  const [email, setEmail] = useState("")
  const [subscriptionType, setSubscriptionType] = useState<"free" | "premium">("free")
  const [customExpiry, setCustomExpiry] = useState("")
  const [isActive, setIsActive] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [notes, setNotes] = useState("")

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase())

    let matchesFilter = true
    switch (filterType) {
      case "free":
        matchesFilter = user.subscriptionType === "free"
        break
      case "premium":
        matchesFilter = user.subscriptionType === "premium"
        break
      case "active":
        matchesFilter = user.isActive !== false
        break
      case "inactive":
        matchesFilter = user.isActive === false
        break
      case "expired":
        matchesFilter =
          user.subscriptionType === "premium" &&
          user.subscriptionExpiry &&
          new Date(user.subscriptionExpiry) < new Date()
        break
      default:
        matchesFilter = true
    }

    return matchesSearch && matchesFilter
  })

  const handleEditUser = (user: any) => {
    setEditingUser(user)
    setDisplayName(user.displayName || "")
    setEmail(user.email || "")
    setSubscriptionType(user.subscriptionType || "free")
    setIsAdmin(user.isAdmin || false)
    setIsActive(user.isActive !== false)
    setCustomExpiry("")
    setNotes("")
  }

  const handleUpdateUser = async () => {
    if (!editingUser) return

    try {
      setUpdating(editingUser.id)

      // Update profile
      await updateUserProfile(editingUser.id, {
        displayName,
        email,
      })

      // Update subscription if changed
      if (subscriptionType !== editingUser.subscriptionType) {
        let expiryDate: Date | undefined
        if (subscriptionType === "premium") {
          expiryDate = customExpiry ? new Date(customExpiry) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        }
        await updateSubscription(editingUser.id, subscriptionType, expiryDate)
      }

      // Update active status if changed
      if (isActive !== (editingUser.isActive !== false)) {
        await toggleUserActiveStatus(editingUser.id, isActive)
      }
      
      // Update admin status if changed
      if (isAdmin !== (editingUser.isAdmin || false)) {
        await updateUserAdminStatus(editingUser.id, isAdmin)
      }

      setEditingUser(null)
      onRefresh()
      alert("✅ User berhasil diupdate!")
    } catch (error: any) {
      alert(`❌ Error: ${error.message}`)
    } finally {
      setUpdating(null)
    }
  }

  const handleDeleteUser = async (userId: string, userEmail: string) => {
    try {
      setUpdating(userId)
      await deleteUser(userId)
      onRefresh()
      alert(`✅ User ${userEmail} berhasil dihapus!`)
    } catch (error: any) {
      alert(`❌ Error: ${error.message}`)
    } finally {
      setUpdating(null)
    }
  }

  const handleToggleActiveStatus = async (userId: string, currentStatus: boolean) => {
    try {
      setUpdating(userId)
      await toggleUserActiveStatus(userId, !currentStatus)
      onRefresh()
      alert(`✅ Status user berhasil diubah!`)
    } catch (error: any) {
      alert(`❌ Error: ${error.message}`)
    } finally {
      setUpdating(null)
    }
  }

  const handleResetUserData = async (userId: string, userEmail: string) => {
    try {
      setUpdating(userId)
      await resetUserData(userId)
      onRefresh()
      alert(`✅ Data user ${userEmail} berhasil direset!`)
    } catch (error: any) {
      alert(`❌ Error: ${error.message}`)
    } finally {
      setUpdating(null)
    }
  }

  const getStatusBadge = (user: any) => {
    if (user.isActive === false) {
      return <Badge variant="destructive">Nonaktif</Badge>
    }
    
    if (user.isAdmin) {
      return <Badge className="bg-purple-100 text-purple-800 border-purple-200">
        <Shield className="h-3 w-3 mr-1" />
        Admin
      </Badge>
    }

    if (user.subscriptionType === "premium") {
      if (user.subscriptionExpiry && new Date(user.subscriptionExpiry) < new Date()) {
        return <Badge variant="destructive">Premium Expired</Badge>
      }
      return (
        <Badge className="bg-amber-100 text-amber-800 border-amber-200">
          <Crown className="h-3 w-3 mr-1" />
          Premium
        </Badge>
      )
    }

    return (
      <Badge variant="secondary">
        <User className="h-3 w-3 mr-1" />
        Gratis
      </Badge>
    )
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Memuat Data User...</CardTitle>
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
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Kelola User ({filteredUsers.length})
            </CardTitle>

            <Button variant="outline" size="sm" onClick={onRefresh}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cari nama, email, atau ID..."
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
                <SelectItem value="all">Semua User</SelectItem>
                <SelectItem value="active">User Aktif</SelectItem>
                <SelectItem value="inactive">User Nonaktif</SelectItem>
                <SelectItem value="free">Gratis</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="expired">Premium Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          {users.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Data User</h3>
              <p className="text-gray-500 mb-4">Data user akan muncul di sini setelah ada yang mendaftar.</p>
              <Button onClick={onRefresh} variant="outline">
                Refresh Data
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((user) => (
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
                        {getStatusBadge(user)}
                      </div>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <p className="text-xs text-muted-foreground">ID: {user.id}</p>

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
                    {/* View Details */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setViewingUser(user)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Detail User</DialogTitle>
                          <DialogDescription>
                            Informasi lengkap tentang {user.displayName || user.email}
                          </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Nama</Label>
                              <p className="text-sm">{user.displayName || "Tidak ada"}</p>
                            </div>
                            <div>
                              <Label>Email</Label>
                              <p className="text-sm">{user.email}</p>
                            </div>
                            <div>
                              <Label>Status</Label>
                              <p className="text-sm">{user.isActive !== false ? "Aktif" : "Nonaktif"}</p>
                            </div>
                            <div>
                              <Label>Langganan</Label>
                              <p className="text-sm">{user.subscriptionType === "premium" ? "Premium" : "Gratis"}</p>
                            </div>
                            {user.subscriptionExpiry && (
                              <div>
                                <Label>Berakhir</Label>
                                <p className="text-sm">
                                  {new Date(user.subscriptionExpiry).toLocaleDateString("id-ID")}
                                </p>
                              </div>
                            )}
                            <div>
                              <Label>Bergabung</Label>
                              <p className="text-sm">{new Date(user.createdAt).toLocaleDateString("id-ID")}</p>
                            </div>
                          </div>

                          <div className="border-t pt-4">
                            <Label>Statistik</Label>
                            <div className="grid grid-cols-3 gap-4 mt-2">
                              <div className="text-center">
                                <p className="text-2xl font-bold">{user.stats?.studentsCount || 0}</p>
                                <p className="text-xs text-muted-foreground">Murid</p>
                              </div>
                              <div className="text-center">
                                <p className="text-2xl font-bold">{user.stats?.totalPengujis || 0}</p>
                                <p className="text-xs text-muted-foreground">Penguji</p>
                              </div>
                              <div className="text-center">
                                <p className="text-2xl font-bold">{user.stats?.totalSetoran || 0}</p>
                                <p className="text-xs text-muted-foreground">Setoran</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>

                    {/* Edit User */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => handleEditUser(user)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Edit User</DialogTitle>
                          <DialogDescription>Edit informasi untuk {user.displayName || user.email}</DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="displayName">Nama</Label>
                            <Input
                              id="displayName"
                              value={displayName}
                              onChange={(e) => setDisplayName(e.target.value)}
                              placeholder="Nama lengkap"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="Email"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="subscriptionType">Tipe Langganan</Label>
                            <Select
                              value={subscriptionType}
                              onValueChange={(value: "free" | "premium") => setSubscriptionType(value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="free">Gratis</SelectItem>
                                <SelectItem value="premium">Premium</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {subscriptionType === "premium" && (
                            <div className="space-y-2">
                              <Label htmlFor="customExpiry">Tanggal Berakhir (Opsional)</Label>
                              <Input
                                id="customExpiry"
                                type="date"
                                value={customExpiry}
                                onChange={(e) => setCustomExpiry(e.target.value)}
                                min={new Date().toISOString().split("T")[0]}
                              />
                            </div>
                          )}

                          <div className="flex items-center space-x-2">
                            <Switch id="isActive" checked={isActive} onCheckedChange={setIsActive} />
                            <Label htmlFor="isActive">User Aktif</Label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Switch id="isAdmin" checked={isAdmin} onCheckedChange={setIsAdmin} />
                            <Label htmlFor="isAdmin">Admin</Label>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="notes">Catatan</Label>
                            <Textarea
                              id="notes"
                              value={notes}
                              onChange={(e) => setNotes(e.target.value)}
                              placeholder="Catatan perubahan..."
                              rows={2}
                            />
                          </div>
                        </div>

                        <DialogFooter>
                          <Button variant="outline" onClick={() => setEditingUser(null)}>
                            Batal
                          </Button>
                          <Button onClick={handleUpdateUser} disabled={updating === editingUser?.id}>
                            {updating === editingUser?.id ? "Updating..." : "Update"}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    {/* Toggle Active Status */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleActiveStatus(user.id, user.isActive !== false)}
                      disabled={updating === user.id}
                    >
                      {user.isActive !== false ? (
                        <UserX className="h-4 w-4 text-red-500" />
                      ) : (
                        <UserCheck className="h-4 w-4 text-green-500" />
                      )}
                    </Button>

                    {/* Reset User Data */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <RotateCcw className="h-4 w-4 text-orange-500" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Reset Data User</AlertDialogTitle>
                          <AlertDialogDescription>
                            Apakah Anda yakin ingin mereset semua data (murid dan penguji) untuk user {user.email}? User
                            akan tetap ada tapi semua datanya akan dihapus. Tindakan ini tidak dapat dibatalkan.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleResetUserData(user.id, user.email)}
                            className="bg-orange-600 hover:bg-orange-700"
                          >
                            Reset Data
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    {/* Delete User */}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Hapus User</AlertDialogTitle>
                          <AlertDialogDescription>
                            Apakah Anda yakin ingin menghapus user {user.email}? Semua data termasuk murid, penguji, dan
                            setoran akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteUser(user.id, user.email)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Hapus User
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}

              {filteredUsers.length === 0 && users.length > 0 && (
                <div className="text-center py-8 text-muted-foreground">Tidak ada user yang sesuai dengan filter</div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
