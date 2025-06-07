"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import type { Student } from "@/lib/types"
import { Download, Printer } from "lucide-react"
import { preparePrintContent } from "@/lib/print-utils"

interface DataManagementProps {
  students: Student[]
}

export default function DataManagement({ students }: DataManagementProps) {
  const [importStatus, setImportStatus] = useState("")

  const handleExport = () => {
    try {
      const dataStr = JSON.stringify(students, null, 2)
      const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
      const exportFileDefaultName = `tasmi-data-${new Date().toISOString().slice(0, 10)}.json`

      const linkElement = document.createElement("a")
      linkElement.setAttribute("href", dataUri)
      linkElement.setAttribute("download", exportFileDefaultName)
      linkElement.click()
      setImportStatus("Data berhasil diekspor!")
      setTimeout(() => setImportStatus(""), 3000)
    } catch (error) {
      console.error("Error exporting data:", error)
      setImportStatus("Gagal mengekspor data. Silakan coba lagi.")
    }
  }

  const handlePrint = () => {
    if (students.length === 0) {
      alert("Tidak ada data untuk dicetak.")
      return
    }

    try {
      const printWindow = window.open("", "_blank")
      if (!printWindow) {
        alert("Gagal membuka jendela cetak. Pastikan pop-up tidak diblokir.")
        return
      }

      const printContent = preparePrintContent(students)
      printWindow.document.write(printContent)
      printWindow.document.close()
      printWindow.focus()

      setTimeout(() => {
        printWindow.print()
      }, 500)
    } catch (error) {
      console.error("Error during printing:", error)
      alert("Terjadi kesalahan saat mencetak. Silakan coba lagi.")
    }
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Manajemen Data</h2>
      <div className="data-actions flex flex-wrap gap-4">
        <Button variant="success" onClick={handleExport}>
          <Download className="w-5 h-5 mr-2" />
          <span>Ekspor Data (JSON)</span>
        </Button>
        <Button variant="default" onClick={handlePrint}>
          <Printer className="w-5 h-5 mr-2" />
          <span>Cetak Laporan</span>
        </Button>
      </div>
      {importStatus && (
        <p className={`mt-2 text-sm ${importStatus.includes("berhasil") ? "text-green-600" : "text-red-600"}`}>
          {importStatus}
        </p>
      )}
      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">Catatan:</h3>
        <p className="text-sm text-blue-700">
          Data sekarang tersimpan di Firebase dan tersinkronisasi secara real-time. Fitur impor data telah dinonaktifkan
          untuk menjaga konsistensi data.
        </p>
      </div>
    </div>
  )
}
