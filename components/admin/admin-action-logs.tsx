"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  TrendingUp, 
  Search, 
  Calendar,
  User,
  Shield,
  Activity,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle
} from "lucide-react"
import type { AdminActionLog } from "@/lib/types"

interface AdminActionLogsProps {
  logs: AdminActionLog[]
  onRefresh: () => Promise<void>
}

export default function AdminActionLogs({ logs, onRefresh }: AdminActionLogsProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterAction, setFilterAction] = useState("all")
  const [filterTarget, setFilterTarget] = useState("all")

  // Filter logs
  const filteredLogs = logs.filter((log) => {
    const matchesSearch = 
      log.adminEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.targetId.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesAction = filterAction === "all" || log.action.includes(filterAction)
    const matchesTarget = filterTarget === "all" || log.targetType === filterTarget
    
    return matchesSearch && matchesAction && matchesTarget
  })

  const getActionIcon = (action: string) => {
    if (action.includes("approve")) return <CheckCircle className="h-4 w-4 text-green-600" />
    if (action.includes("reject")) return <XCircle className="h-4 w-4 text-red-600" />
    if (action.includes("update")) return <Edit className="h-4 w-4 text-blue-600" />
    if (action.includes("delete")) return <Trash2 className="h-4 w-4 text-red-600" />
    if (action.includes("view")) return <Eye className="h-4 w-4 text-gray-600" />
    return <Activity className="h-4 w-4 text-gray-600" />
  }

  const getActionBadge = (action: string) => {
    if (action.includes("approve")) {
      return <Badge className="bg-green-100 text-green-800">Approve</Badge>
    }
    if (action.includes("reject")) {
      return <Badge className="bg-red-100 text-red-800">Reject</Badge>
    }
    if (action.includes("update")) {
      return <Badge className="bg-blue-100 text-blue-800">Update</Badge>
    }
    if (action.includes("delete")) {
      return <Badge className="bg-red-100 text-red-800">Delete</Badge>
    }
    if (action.includes("create")) {
      return <Badge className="bg-green-100 text-green-800">Create</Badge>
    }
    return <Badge variant="outline">{action.replace(/_/g, " ")}</Badge>
  }

  const getTargetBadge = (targetType: string) => {
    switch (targetType) {
      case "user":
        return <Badge variant="outline"><User className="h-3 w-3 mr-1" />User</Badge>
      case "upgrade_request":
        return <Badge variant="outline"><TrendingUp className="h-3 w-3 mr-1" />Upgrade Request</Badge>
      case "payment":
        return <Badge variant="outline"><Activity className="h-3 w-3 mr-1" />Payment</Badge>
      default:
        return <Badge variant="outline">{targetType}</Badge>
    }
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatActionDescription = (log: AdminActionLog) => {
    const action = log.action.replace(/_/g, " ")
    return `${action} on ${log.targetType} ${log.targetId.slice(-8)}`
  }

  // Get unique actions and targets for filters
  const uniqueActions = [...new Set(logs.map(log => log.action.split("_")[0]))].sort()
  const uniqueTargets = [...new Set(logs.map(log => log.targetType))].sort()

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Admin Action Logs ({filteredLogs.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cari admin, action, atau target..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterAction} onValueChange={setFilterAction}>
              <SelectTrigger>
                <SelectValue placeholder="Semua Actions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Actions</SelectItem>
                {uniqueActions.map((action) => (
                  <SelectItem key={action} value={action}>
                    {action.charAt(0).toUpperCase() + action.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterTarget} onValueChange={setFilterTarget}>
              <SelectTrigger>
                <SelectValue placeholder="Semua Targets" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Targets</SelectItem>
                {uniqueTargets.map((target) => (
                  <SelectItem key={target} value={target}>
                    {target.replace(/_/g, " ")}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button onClick={onRefresh} variant="outline">
              <Activity className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardContent className="p-0">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-8">
              <TrendingUp className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm || filterAction !== "all" || filterTarget !== "all" 
                  ? "Tidak ada log yang sesuai filter" 
                  : "Belum ada admin action logs"}
              </h3>
              <p className="text-gray-500">
                {searchTerm || filterAction !== "all" || filterTarget !== "all"
                  ? "Coba ubah filter pencarian"
                  : "Admin action logs akan muncul di sini"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Admin</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Target ID</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-blue-600" />
                          <div>
                            <div className="font-medium">{log.adminEmail}</div>
                            <div className="text-xs text-muted-foreground">
                              {log.ipAddress && `IP: ${log.ipAddress}`}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getActionIcon(log.action)}
                          {getActionBadge(log.action)}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        {getTargetBadge(log.targetType)}
                      </TableCell>
                      
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {log.targetId.slice(-12)}
                        </code>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          {formatDateTime(log.timestamp)}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="max-w-xs">
                          {log.details && typeof log.details === "object" ? (
                            <details className="cursor-pointer">
                              <summary className="text-sm text-blue-600 hover:underline">
                                View Details
                              </summary>
                              <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-auto">
                                {JSON.stringify(log.details, null, 2)}
                              </pre>
                            </details>
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              {formatActionDescription(log)}
                            </span>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Actions</p>
                <p className="text-2xl font-bold">{logs.length}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approvals</p>
                <p className="text-2xl font-bold text-green-600">
                  {logs.filter(l => l.action.includes("approve")).length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rejections</p>
                <p className="text-2xl font-bold text-red-600">
                  {logs.filter(l => l.action.includes("reject")).length}
                </p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Updates</p>
                <p className="text-2xl font-bold text-blue-600">
                  {logs.filter(l => l.action.includes("update")).length}
                </p>
              </div>
              <Edit className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
