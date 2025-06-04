import type { Student } from "@/lib/types"
import { quranData } from "@/lib/quran-data"
import { calculateStudentSummary, calculateMemorizedVersesForSurah, calculateDetailedJuzProgress } from "@/lib/utils"

export function preparePrintContent(students: Student[]): string {
  let printHtml = ""

  try {
    const studentsWithStats = students.map((student) => {
      const summary = calculateStudentSummary(student)
      return { ...student, summary }
    })

    studentsWithStats.forEach((student) => {
      const { totalMemorizedVerses, startedSurahsCount, completedSurahsCount, juzProgress, target } = student.summary
      const detailedJuzProgress = calculateDetailedJuzProgress(student.summary.totalUniqueVersesMemorizedSet)
      let progressBarSuratHtml = ""
      let progressBarJuzHtml = ""
      let setoranListHtml = "<em>Tidak ada riwayat setoran.</em>"
      const kelasLabel = student.kelas ? `<span class="kelas-label">(${student.kelas})</span>` : ""
      const targetLabel = target ? `<div class="target-label">Target: <strong>${target}</strong></div>` : ""

      if (student.hafalan && student.hafalan.length > 0) {
        const hafalanBySurah = student.hafalan.reduce(
          (acc, item) => {
            if (item && item.surah) {
              if (!acc[item.surah]) acc[item.surah] = []
              acc[item.surah].push(item)
            }
            return acc
          },
          {} as Record<string, any[]>,
        )

        const sortedSurahNames = Object.keys(hafalanBySurah).sort(
          (a, b) =>
            (quranData.find((s) => s.name === a)?.number || 0) - (quranData.find((s) => s.name === b)?.number || 0),
        )

        progressBarSuratHtml = '<div class="progress-list">'
        sortedSurahNames.forEach((surahName) => {
          const surahEntries = hafalanBySurah[surahName]
          const surahInfo = quranData.find((s) => s.name === surahName)

          if (surahInfo) {
            const totalVersesInSurah = surahInfo.verses
            const { count: memorizedCount } = calculateMemorizedVersesForSurah(surahEntries, totalVersesInSurah)
            const percentage = totalVersesInSurah > 0 ? Math.round((memorizedCount / totalVersesInSurah) * 100) : 0
            const isComplete = percentage === 100
            const surahDisplay = `${surahInfo.number}. ${surahName}`
            const checkmarkText = isComplete ? `(✓)` : ""

            progressBarSuratHtml += `
              <div class="text-sm">
                <div class="flex justify-between items-center mb-1">
                  <span class="font-medium">${surahDisplay}</span>
                  <span>${memorizedCount}/${totalVersesInSurah} (${percentage}%) ${checkmarkText}</span>
                </div>
                <div class="progress-bar-container">
                  <div class="progress-bar ${isComplete ? "progress-bar-complete" : ""}" style="width: ${percentage}%;"></div>
                </div>
              </div>
            `
          }
        })
        progressBarSuratHtml += "</div>"

        progressBarJuzHtml = '<div class="progress-list">'
        let hasStartedJuz = false

        Object.keys(detailedJuzProgress.details)
          .sort((a, b) => Number.parseInt(a) - Number.parseInt(b))
          .forEach((juzNum) => {
            const juzDetail = detailedJuzProgress.details[juzNum]
            hasStartedJuz = true
            const checkmarkText = juzDetail.isComplete ? `(✓)` : ""

            progressBarJuzHtml += `
              <div class="text-sm">
                <div class="flex justify-between items-center mb-1">
                  <span class="font-medium">Juz ${juzNum}</span>
                  <span>${juzDetail.memorized}/${juzDetail.total} (${juzDetail.percentage}%) ${checkmarkText}</span>
                </div>
                <div class="progress-bar-container">
                  <div class="progress-bar progress-bar-juz ${juzDetail.isComplete ? "progress-bar-complete" : ""}" style="width: ${juzDetail.percentage}%;"></div>
                </div>
              </div>
            `
          })
        progressBarJuzHtml += "</div>"

        if (!hasStartedJuz) {
          progressBarJuzHtml = "<em>Belum ada progres juz.</em>"
        }

        setoranListHtml = '<ul class="setoran-list">'
        const sortedHafalan = [...student.hafalan].sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
        )

        sortedHafalan.forEach((item) => {
          if (item && item.id && item.surah && item.start && item.end && item.timestamp) {
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
            const penilaian = item.penilaian || ""
            const penilaianLabel = penilaian ? `<span class="penilaian-label">${penilaian}</span>` : ""
            const catatan = item.catatan
              ? `<div class="setoran-catatan">${item.catatan.replace(/\n/g, "<br>")}</div>`
              : ""

            setoranListHtml += `
              <li class="setoran-item">
                <span class="setoran-details">
                  <strong>${surahDisplay}</strong>: ${item.start}-${item.end}
                  <em class="text-xs">(${dateTimeDisplay})</em>
                  ${penilaianLabel}
                </span>
                ${catatan}
              </li>
            `
          }
        })
        setoranListHtml += "</ul>"
      }

      const summaryHtml = `
        <div class="summary-grid">
          <div class="summary-item">
            <div class="summary-value">${totalMemorizedVerses}</div>
            <div class="summary-label">Total Ayat Hafal</div>
          </div>
          <div class="summary-item">
            <div class="summary-value">${startedSurahsCount}</div>
            <div class="summary-label">Surat Dimulai</div>
          </div>
          <div class="summary-item">
            <div class="summary-value">${completedSurahsCount}</div>
            <div class="summary-label">Surat Selesai</div>
          </div>
          <div class="summary-item">
            <div class="summary-value">${juzProgress.started}</div>
            <div class="summary-label">Juz Dimulai</div>
          </div>
          <div class="summary-item">
            <div class="summary-value">${juzProgress.completed}</div>
            <div class="summary-label">Juz Selesai</div>
          </div>
        </div>
      `

      printHtml += `
        <div class="print-student-item">
          <h3>${student.name} ${kelasLabel}</h3>
          ${targetLabel}
          ${summaryHtml}
          <div class="progress-section">
            <p><strong>Progres per Surat:</strong></p>
            ${progressBarSuratHtml || "<em>Belum ada progres surat.</em>"}
          </div>
          <div class="progress-section">
            <p><strong>Progres per Juz:</strong></p>
            ${progressBarJuzHtml}
          </div>
          <div>
            <p><strong>Riwayat Setoran:</strong></p>
            ${setoranListHtml}
          </div>
        </div>
        <hr style="border-top: 1px solid #ccc; margin: 20px 0;">
      `
    })

    const printWindowHtml = `
      <html>
        <head>
          <title>Laporan Hafalan</title>
          <style>
            body { font-family: 'Times New Roman', Times, serif; color: black; margin: 20px;}
            h1 { font-size: 18pt; font-weight: bold; text-align: center; margin-bottom: 20px; }
            h3 { font-size: 14pt; font-weight: bold; margin-top: 25px; margin-bottom: 5px; page-break-before: auto; }
            .kelas-label { font-size: 10pt; color: #555; margin-left: 5px; }
            .target-label { font-size: 10pt; color: #333; margin-bottom: 10px; font-weight: normal;}
            .target-label strong { font-weight: bold; }
            .summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 15px; padding: 10px; border: 1px solid #ccc; background-color: #f8f8f8 !important; -webkit-print-color-adjust: exact !important; color-adjust: exact !important;}
            .summary-item { text-align: center; }
            .summary-value { font-size: 12pt; font-weight: bold; }
            .summary-label { font-size: 9pt; color: #333; }
            .progress-section { margin-top: 15px; margin-bottom: 15px; }
            .progress-list { margin-top: 5px; }
            .progress-bar-container { background-color: #eee !important; border: 1px solid #ccc; height: 10px; border-radius: 3px; overflow: hidden; }
            .progress-bar { background-color: #999 !important; height: 100%; -webkit-print-color-adjust: exact !important; color-adjust: exact !important;}
            .progress-bar-complete { background-color: #555 !important; -webkit-print-color-adjust: exact !important; color-adjust: exact !important;}
            .checklist-icon { display: inline; margin-left: 3px; font-weight: bold; }
            .progress-section p, .progress-list span { font-size: 10pt; }
            .setoran-list { list-style: none; padding: 0; margin: 0; }
            .setoran-item { border-bottom: 1px dotted #ccc; padding: 3px 0; page-break-inside: avoid; }
            .setoran-details { font-size: 10pt; }
            .setoran-catatan { font-size: 9pt; color: #444; background-color: #f0f0f0 !important; padding: 2px 4px; border-radius: 3px; margin-top: 2px; border: 1px solid #e0e0e0; white-space: pre-wrap; -webkit-print-color-adjust: exact !important; color-adjust: exact !important;}
            .penilaian-label { display: inline; padding: 0; font-size: 9pt; font-weight: normal; border-radius: 0; margin-left: 5px; border: none; background-color: transparent !important; color: #555; }
            .penilaian-label::before { content: "["; }
            .penilaian-label::after { content: "]"; }
            hr { border-top: 1px solid #ccc; margin: 20px 0; }
            .print-student-item { page-break-inside: avoid; }
          </style>
        </head>
        <body>
          <h1>Laporan Progres Hafalan Quran Murid</h1>
          ${printHtml}
        </body>
      </html>
    `

    return printWindowHtml
  } catch (error) {
    console.error("Error preparing print content:", error)
    return `
      <html>
        <head><title>Error</title></head>
        <body>
          <h1>Terjadi Kesalahan</h1>
          <p>Maaf, terjadi kesalahan saat menyiapkan data cetak.</p>
        </body>
      </html>
    `
  }
}
