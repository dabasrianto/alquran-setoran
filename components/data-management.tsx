"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import type { Student } from "@/lib/types"
import { Download, Upload, Printer } from "lucide-react"
import { preparePrintContent } from "@/lib/print-utils"

interface DataManagementProps {
  students: Student[]
  setStudents: (students: Student[]) => void
}

export default function DataManagement({ students, setStudents }: DataManagementProps) {
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

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const importedData = JSON.parse(content)

        if (!Array.isArray(importedData)) {
          throw new Error("Format data tidak valid")
        }

        setStudents(importedData)
        setImportStatus("Data berhasil diimpor!")
        setTimeout(() => setImportStatus(""), 3000)
      } catch (error) {
        console.error("Error importing data:", error)
        setImportStatus("Gagal mengimpor data. Format file tidak valid.")
      }
    }
    reader.readAsText(file)
    event.target.value = ""
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
        <Button variant="warning" onClick={() => document.getElementById("importFile")?.click()}>
          <Upload className="w-5 h-5 mr-2" />
          <span>Impor Data (JSON)</span>
        </Button>
        <Button variant="default" onClick={handlePrint}>
          <Printer className="w-5 h-5 mr-2" />
          <span>Cetak Laporan</span>
        </Button>
        <input type="file" id="importFile" accept=".json" onChange={handleImport} className="hidden" />
      </div>
      {importStatus && (
        <p className={`mt-2 text-sm ${importStatus.includes("berhasil") ? "text-green-600" : "text-red-600"}`}>
          {importStatus}
        </p>
      )}
    </div>
  )
}
