"use client"

import { CheckCircle } from "lucide-react"
import type { StudentWithSummary } from "@/lib/types"
import { quranData } from "@/lib/quran-data"
import { calculateMemorizedVersesForSurah, calculateDetailedJuzProgress } from "@/lib/utils"

interface StudentProgressProps {
  student: StudentWithSummary
}

export default function StudentProgress({ student }: StudentProgressProps) {
  const hafalanBySurah =
    student.hafalan?.reduce(
      (acc, item) => {
        if (!acc[item.surah]) acc[item.surah] = []
        acc[item.surah].push(item)
        return acc
      },
      {} as Record<string, any[]>,
    ) || {}

  const sortedSurahNames = Object.keys(hafalanBySurah).sort(
    (a, b) => (quranData.find((s) => s.name === a)?.number || 0) - (quranData.find((s) => s.name === b)?.number || 0),
  )

  const detailedJuzProgress = calculateDetailedJuzProgress(student.summary?.totalUniqueVersesMemorizedSet || new Set())

  return (
    <div className="space-y-4">
      <div className="progress-section">
        <p className="text-sm font-medium text-gray-600 mb-2">Progres per Surat:</p>
        {sortedSurahNames.length > 0 ? (
          <div className="progress-list space-y-3">
            {sortedSurahNames.map((surahName) => {
              const surahEntries = hafalanBySurah[surahName]
              const surahInfo = quranData.find((s) => s.name === surahName)
              if (!surahInfo) return null

              const totalVersesInSurah = surahInfo.verses
              const { count: memorizedCount } = calculateMemorizedVersesForSurah(surahEntries, totalVersesInSurah)
              const percentage = totalVersesInSurah > 0 ? Math.round((memorizedCount / totalVersesInSurah) * 100) : 0
              const isComplete = percentage === 100
              const surahDisplay = `${surahInfo.number}. ${surahName}`

              return (
                <div key={surahName} className="text-sm">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium text-gray-700">{surahDisplay}</span>
                    <span className="text-gray-600">
                      {memorizedCount}/{totalVersesInSurah} ({percentage}%)
                      {isComplete && <CheckCircle className="inline-block w-4 h-4 ml-1 text-success" />}
                    </span>
                  </div>
                  <div className="progress-bar-container">
                    <div
                      className={`progress-bar ${isComplete ? "progress-bar-complete" : ""}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">Belum ada progres surat.</p>
        )}
      </div>

      <div className="progress-section">
        <p className="text-sm font-medium text-gray-600 mb-2">Progres per Juz:</p>
        {Object.keys(detailedJuzProgress.details).length > 0 ? (
          <div className="progress-list space-y-3">
            {Object.keys(detailedJuzProgress.details)
              .sort((a, b) => Number.parseInt(a) - Number.parseInt(b))
              .map((juzNum) => {
                const juzDetail = detailedJuzProgress.details[juzNum]
                return (
                  <div key={juzNum} className="text-sm">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-medium text-gray-700">Juz {juzNum}</span>
                      <span className="text-gray-600">
                        {juzDetail.memorized}/{juzDetail.total} ({juzDetail.percentage}%)
                        {juzDetail.isComplete && <CheckCircle className="inline-block w-4 h-4 ml-1 text-success" />}
                      </span>
                    </div>
                    <div className="progress-bar-container">
                      <div
                        className={`progress-bar progress-bar-juz ${
                          juzDetail.isComplete ? "progress-bar-juz progress-bar-complete" : ""
                        }`}
                        style={{ width: `${juzDetail.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">Belum ada progres juz.</p>
        )}
      </div>
    </div>
  )
}
