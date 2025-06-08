"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useAdmin } from "@/hooks/use-admin"
import { Crown, User, Users, GraduationCap, Calendar, Search, Filter, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface AdminUsersListProps {
  users: any[]
  loading: boolean
  onRefresh: () => void
  showSubscriptionActions?: boolean
}

export default function AdminUsersList({
  users,
  loading,
  onRefresh,
  showSubscriptionActions = false,
}: AdminUsersListProps) {
  const { updateSubscription } = useAdmin()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [updating, setUpdating] = useState<string | null>(null)

  console.log("AdminUsersList render:", { users, loading, usersLength: users?.length })

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === "all" || user.subscriptionType === filterType
    return matchesSearch && matchesFilter
  })

  const handleUpdateSubscription = async (userId: string, subscriptionType: "free" | "premium") => {
    try {
      setUpdating(userId)
      const expiryDate =
        subscriptionType === "premium"
          ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
          : undefined

      await updateSubscription(userId, subscriptionType, expiryDate)
      onRefresh()
      setSelectedUser(null)
    } catch (error: any) {
      alert(`Error: ${error.message}`)
    } finally {
      setUpdating(null)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Memuat Data Pengguna...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center space-x-4 p-4 border rounded">
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Daftar Pengguna ({filteredUsers.length})
        </CardTitle>

        {/* Debug Info */}
        {process.env.NODE_ENV === "development" && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Debug: Total users loaded: {users.length} | Filtered: {filteredUsers.length}
            </AlertDescription>
          </Alert>
        )}

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
            <SelectTrigger className="w-full sm:w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter tipe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Pengguna</SelectItem>
              <SelectItem value="free">Gratis</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        {users.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Belum Ada Data Pengguna</h3>
            <p className="text-gray-500 mb-4">
              Data pengguna akan muncul di sini setelah ada yang mendaftar ke aplikasi.
            </p>
            <Button onClick={onRefresh} variant="outline">
              Refresh Data
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={user.photoURL || "/placeholder.svg"} />
                    <AvatarFallback>{user.displayName?.charAt(0) || user.email?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{user.displayName || user.email}</h3>
                      {user.subscriptionType === "premium" ? (
                        <Badge className="bg-amber-100 text-amber-800 border-amber-200">
                          <Crown className="h-3 w-3 mr-1" />
                          Premium
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <User className="h-3 w-3 mr-1" />
                          Gratis
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{user.email}</p>

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
                  {showSubscriptionActions && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedUser(user)}>
                          Kelola Langganan
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Kelola Langganan</DialogTitle>
                          <DialogDescription>
                            Ubah paket langganan untuk {user.displayName || user.email}
                          </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4">
                          <div className="p-4 bg-muted rounded-lg">
                            <h4 className="font-medium mb-2">Informasi Pengguna</h4>
                            <p className="text-sm">Email: {user.email}</p>
                            <p className="text-sm">
                              Status: {user.subscriptionType === "premium" ? "Premium" : "Gratis"}
                            </p>
                            {user.subscriptionExpiry && (
                              <p className="text-sm">
                                Berakhir: {new Date(user.subscriptionExpiry).toLocaleDateString("id-ID")}
                              </p>
                            )}
                          </div>

                          <div className="flex gap-2">
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
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </div>
              </div>
            ))}

            {filteredUsers.length === 0 && users.length > 0 && (
              <div className="text-center py-8 text-muted-foreground">Tidak ada pengguna yang sesuai dengan filter</div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
