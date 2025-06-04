"use client"

import { Button } from "@/components/ui/button"
import { Edit, Trash2, User } from "lucide-react"
import type { StudentWithSummary, Setoran, Penguji } from "@/lib/types"
import { quranData } from "@/lib/quran-data"
import { useLocalStorage } from "@/hooks/use-local-storage"

interface SetoranHistoryProps {
  student: StudentWithSummary
  onDeleteSetoran: (studentId: string, setoranId: string) => void
  onEditSetoran: (data: { setoran: Setoran; studentId: string }) => void
}

export default function SetoranHistory({ student, onDeleteSetoran, onEditSetoran }: SetoranHistoryProps) {
  // Ambil data penguji dari localStorage
  const [pengujis] = useLocalStorage<Penguji[]>("pengujiData", [])

  const getPenilaianClass = (penilaian: string) => {
    switch (penilaian) {
      case "Ulang Lagi":
        return "penilaian-ulang"
      case "Kurang Lancar":
        return "penilaian-kurang"
      case "Lancar":
        return "penilaian-lancar"
      case "Mutqin":
        return "penilaian-mutqin"
      default:
        return ""
    }
  }

  const getPengujiName = (pengujiId?: string) => {
    if (!pengujiId) return null
    const penguji = pengujis.find((p) => p.id === pengujiId)
    if (!penguji) return null
    return `${penguji.gender === "L" ? "Ustadz" : "Ustadzah"} ${penguji.name}`
  }

  const sortedHafalan = [...(student.hafalan || [])].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  )

  return (
    <div>
      <p className="text-sm font-medium text-gray-600 mb-1">Riwayat Setoran:</p>
      {sortedHafalan.length === 0 ? (
        <p className="text-sm text-gray-500 italic mt-2">Belum ada riwayat setoran.</p>
      ) : (
        <ul className="setoran-list max-h-[250px] overflow-y-auto pr-2 mt-2">
          {sortedHafalan.map((item) => {
            const surahInfo = quranData.find((s) => s.name === item.surah)
            const surahDisplay = surahInfo ? `${surahInfo.number}. ${item.surah}` : item.surah
            const dateTimeDisplay = new Date(item.timestamp).toLocaleString("id-ID", {
              day: "2-digit",
              month: "short",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            })
            const penilaianClass = getPenilaianClass(item.penilaian || "")
            const pengujiName = getPengujiName(item.pengujiId)

            return (
              <li key={item.id} className="setoran-item flex flex-col py-3 border-b border-dashed last:border-b-0">
                <div className="setoran-item-main flex justify-between items-center mb-1">
                  <span className="setoran-details flex-grow mr-2">
                    <strong>{surahDisplay}</strong>: {item.start}-{item.end}
                    <em className="text-xs text-gray-500 ml-1">({dateTimeDisplay})</em>
                    {item.penilaian && <span className={`penilaian-label ${penilaianClass}`}>{item.penilaian}</span>}
                    {pengujiName && (
                      <span className="inline-flex items-center text-xs text-gray-600 ml-1">
                        <User className="w-3 h-3 mr-1" />
                        {pengujiName}
                      </span>
                    )}
                  </span>
                  <span className="setoran-actions">
                    <Button
                      variant="warning"
                      size="sm"
                      className="mr-1"
                      onClick={() =>
                        onEditSetoran({
                          setoran: item,
                          studentId: student.id,
                        })
                      }
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => onDeleteSetoran(student.id, item.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </span>
                </div>
                {item.catatan && (
                  <div className="setoran-catatan bg-muted p-2 rounded-md text-sm mt-1 border whitespace-pre-wrap">
                    {item.catatan}
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
