"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { 
  Crown, 
  Users, 
  Clock, 
  CheckCircle,
  XCircle,
  Search,
  RefreshCw,
  Calendar,
  AlertTriangle
} from "lucide-react"
import { getAllSubscriptions, updateSubscription, checkExpiredTrials } from "@/lib/firebase-subscription"
import { getDaysRemaining, isTrialExpired, formatPrice, SUBSCRIPTION_PLANS } from "@/lib/subscription-system"
import type { UserSubscription } from "@/lib/subscription-system"

export default function SubscriptionAdmin() {
  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [selectedUser, setSelectedUser] = useState<UserSubscription | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)

  const loadSubscriptions = async () => {
    try {
      setLoading(true)
      const data = await getAllSubscriptions()
      setSubscriptions(data)
    } catch (error) {
      console.error("Error loading subscriptions:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCheckExpired = async () => {
    try {
      setLoading(true)
      const expiredUsers = await checkExpiredTrials()
      if (expiredUsers.length > 0) {
        alert(`${expiredUsers.length} trial yang expired telah dinonaktifkan`)
        await loadSubscriptions()
      } else {
        alert("Tidak ada trial yang expired")
      }
    } catch (error) {
      console.error("Error checking expired trials:", error)
      alert("Error checking expired trials")
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateSubscription = async (
    userId: string, 
    subscriptionType: 'trial' | 'premium' | 'unlimited'
  ) => {
    try {
      setUpdating(userId)
      await updateSubscription(userId, subscriptionType, 'admin')
      await loadSubscriptions()
      setSelectedUser(null)
      alert(`Subscription updated to ${subscriptionType}`)
    } catch (error) {
      console.error("Error updating subscription:", error)
      alert("Error updating subscription")
    } finally {
      setUpdating(null)
    }
  }

  useEffect(() => {
    loadSubscriptions()
  }, [])

  const filteredSubscriptions = subscriptions.filter((sub) => {
    const matchesSearch = sub.userId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === "all" || sub.subscriptionType === filterType
    return matchesSearch && matchesFilter
  })

  const getStatusBadge = (subscription: UserSubscription) => {
    if (!subscription.isActive) {
      return <Badge variant="destructive">Inactive</Badge>
    }

    if (subscription.subscriptionType === 'trial') {
      const expired = isTrialExpired(subscription)
      const daysRemaining = getDaysRemaining(subscription)
      
      if (expired) {
        return <Badge variant="destructive">Expired</Badge>
      } else {
        return <Badge variant="secondary">Trial ({daysRemaining}d)</Badge>
      }
    }

    if (subscription.subscriptionType === 'premium') {
      return <Badge className="bg-amber-100 text-amber-800">Premium</Badge>
    }

    if (subscription.subscriptionType === 'unlimited') {
      return <Badge className="bg-purple-100 text-purple-800">Unlimited</Badge>
    }

    return <Badge variant="outline">{subscription.subscriptionType}</Badge>
  }

  const formatDate = (date?: Date) => {
    if (!date) return '-'
    return date.toLocaleDateString('id-ID')
  }

  // Calculate statistics
  const stats = {
    total: subscriptions.length,
    trial: subscriptions.filter(s => s.subscriptionType === 'trial').length,
    premium: subscriptions.filter(s => s.subscriptionType === 'premium').length,
    unlimited: subscriptions.filter(s => s.subscriptionType === 'unlimited').length,
    expired: subscriptions.filter(s => s.subscriptionType === 'trial' && isTrialExpired(s)).length,
    active: subscriptions.filter(s => s.isActive).length,
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Crown className="h-6 w-6 text-amber-600" />
            Subscription Management
          </h2>
          <p className="text-muted-foreground">Kelola langganan dan trial pengguna</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleCheckExpired} variant="outline">
            <Clock className="h-4 w-4 mr-2" />
            Check Expired
          </Button>
          <Button onClick={loadSubscriptions} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <div className="text-sm text-muted-foreground">Total Users</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.trial}</div>
            <div className="text-sm text-muted-foreground">Trial</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-amber-600">{stats.premium}</div>
            <div className="text-sm text-muted-foreground">Premium</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{stats.unlimited}</div>
            <div className="text-sm text-muted-foreground">Unlimited</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{stats.expired}</div>
            <div className="text-sm text-muted-foreground">Expired</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            <div className="text-sm text-muted-foreground">Active</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Subscriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by user ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="trial">Trial</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="unlimited">Unlimited</SelectItem>
              </SelectContent>
            </Select>

            <div className="text-sm text-muted-foreground flex items-center">
              Showing {filteredSubscriptions.length} of {subscriptions.length} subscriptions
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscriptions Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Trial Period</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubscriptions.map((subscription) => (
                  <TableRow key={subscription.userId}>
                    <TableCell>
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {subscription.userId.slice(-8)}
                      </code>
                    </TableCell>
                    
                    <TableCell>
                      {getStatusBadge(subscription)}
                    </TableCell>
                    
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {subscription.isActive ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                        {subscription.isActive ? 'Active' : 'Inactive'}
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      <div className="text-sm">
                        <div>Teachers: {subscription.currentTeachers}/{subscription.maxTeachers}</div>
                        <div>Students: {subscription.currentStudents}/{subscription.maxStudents}</div>
                      </div>
                    </TableCell>
                    
                    <TableCell>
                      {subscription.subscriptionType === 'trial' ? (
                        <div className="text-sm">
                          <div>Start: {formatDate(subscription.trialStartDate)}</div>
                          <div>End: {formatDate(subscription.trialEndDate)}</div>
                          {subscription.trialEndDate && (
                            <div className="text-xs text-muted-foreground">
                              {getDaysRemaining(subscription)} days left
                            </div>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedUser(subscription)}
                          >
                            Manage
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Manage Subscription</DialogTitle>
                            <DialogDescription>
                              Update subscription for user {subscription.userId.slice(-8)}
                            </DialogDescription>
                          </DialogHeader>
                          
                          {selectedUser && (
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <strong>Current Type:</strong> {selectedUser.subscriptionType}
                                </div>
                                <div>
                                  <strong>Status:</strong> {selectedUser.isActive ? 'Active' : 'Inactive'}
                                </div>
                                <div>
                                  <strong>Teachers:</strong> {selectedUser.currentTeachers}/{selectedUser.maxTeachers}
                                </div>
                                <div>
                                  <strong>Students:</strong> {selectedUser.currentStudents}/{selectedUser.maxStudents}
                                </div>
                              </div>
                              
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  onClick={() => handleUpdateSubscription(selectedUser.userId, 'trial')}
                                  disabled={updating === selectedUser.userId}
                                  className="flex-1"
                                >
                                  Set Trial
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() => handleUpdateSubscription(selectedUser.userId, 'premium')}
                                  disabled={updating === selectedUser.userId}
                                  className="flex-1"
                                >
                                  <Crown className="h-4 w-4 mr-1" />
                                  Set Premium
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() => handleUpdateSubscription(selectedUser.userId, 'unlimited')}
                                  disabled={updating === selectedUser.userId}
                                  className="flex-1"
                                >
                                  Set Unlimited
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}