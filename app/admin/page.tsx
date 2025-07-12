import type { Metadata } from "next"
import AdminDashboard from "@/components/admin/admin-dashboard"

export const metadata: Metadata = {
  title: "Admin Dashboard - Tasmi App",
  description: "Dashboard admin untuk mengelola aplikasi Tasmi",
}

export default function AdminPage() {
  return <AdminDashboard />
}
