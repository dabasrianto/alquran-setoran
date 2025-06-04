import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { Student, StudentSummary, Setoran } from "@/lib/types"
import { quranData, juzData } from "@/lib/quran-data"

export function generateId() {
  return "_" + Math.random().toString(36).substr(2, 9)
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateMemorizedVersesForSurah(
  setoranEntries: Setoran[],
  totalVersesInSurah: number,
): { count: number; verses: Set<number> } {
  const memorizedVerses = new Set<number>()

  setoranEntries.forEach((entry) => {
    for (let i = entry.start; i <= entry.end; i++) {
      if (i <= totalVersesInSurah) {
        memorizedVerses.add(i)
      }
    }
  })

  return {
    count: memorizedVerses.size,
    verses: memorizedVerses,
  }
}

export function calculateDetailedJuzProgress(totalUniqueVersesMemorizedSet: Set<string>) {
  const juzProgress: Record<
    string,
    {
      memorized: number
      total: number
      percentage: number
      isComplete: boolean
    }
  > = {}

  juzData.forEach((juz) => {
    let totalVersesInJuz = 0
    let memorizedVersesInJuz = 0

    // Calculate total verses in this Juz
    for (let surahNum = juz.start.surah; surahNum <= juz.end.surah; surahNum++) {
      const surahInfo = quranData.find((s) => s.number === surahNum)
      if (!surahInfo) continue

      let startAyah = 1
      let endAyah = surahInfo.verses

      // Adjust start and end ayah for first and last surahs in the juz
      if (surahNum === juz.start.surah) {
        startAyah = juz.start.ayah
      }
      if (surahNum === juz.end.surah) {
        endAyah = juz.end.ayah
      }

      // Count verses in this surah for this juz
      for (let ayah = startAyah; ayah <= endAyah; ayah++) {
        totalVersesInJuz++
        const verseKey = `${surahInfo.name}-${ayah}`
        if (totalUniqueVersesMemorizedSet.has(verseKey)) {
          memorizedVersesInJuz++
        }
      }
    }

    const percentage = totalVersesInJuz > 0 ? Math.round((memorizedVersesInJuz / totalVersesInJuz) * 100) : 0

    juzProgress[juz.juz.toString()] = {
      memorized: memorizedVersesInJuz,
      total: totalVersesInJuz,
      percentage,
      isComplete: percentage === 100,
    }
  })

  return {
    details: juzProgress,
  }
}

export function calculateStudentSummary(student: Student): StudentSummary {
  if (!student.hafalan || student.hafalan.length === 0) {
    return {
      totalMemorizedVerses: 0,
      startedSurahsCount: 0,
      completedSurahsCount: 0,
      juzProgress: { started: 0, completed: 0, details: {} },
      kelas: student.kelas || "",
      target: student.target || "",
      totalUniqueVersesMemorizedSet: new Set(),
    }
  }

  // Group hafalan by surah
  const hafalanBySurah = student.hafalan.reduce(
    (acc, item) => {
      if (!acc[item.surah]) acc[item.surah] = []
      acc[item.surah].push(item)
      return acc
    },
    {} as Record<string, Setoran[]>,
  )

  let totalMemorizedVerses = 0
  let completedSurahsCount = 0
  const startedSurahsCount = Object.keys(hafalanBySurah).length
  const totalUniqueVersesMemorizedSet = new Set<string>()

  // Calculate progress for each surah
  Object.entries(hafalanBySurah).forEach(([surahName, setoranEntries]) => {
    const surahInfo = quranData.find((s) => s.name === surahName)
    if (!surahInfo) return

    const { count: memorizedCount, verses } = calculateMemorizedVersesForSurah(setoranEntries, surahInfo.verses)
    totalMemorizedVerses += memorizedCount

    // Add to unique verses set for juz calculation
    verses.forEach((ayah) => {
      totalUniqueVersesMemorizedSet.add(`${surahName}-${ayah}`)
    })

    // Check if surah is completed
    if (memorizedCount === surahInfo.verses) {
      completedSurahsCount++
    }
  })

  // Calculate Juz progress
  const detailedJuzProgress = calculateDetailedJuzProgress(totalUniqueVersesMemorizedSet)
  const juzStarted = Object.keys(detailedJuzProgress.details).filter(
    (juzNum) => detailedJuzProgress.details[juzNum].memorized > 0,
  ).length
  const juzCompleted = Object.keys(detailedJuzProgress.details).filter(
    (juzNum) => detailedJuzProgress.details[juzNum].isComplete,
  ).length

  return {
    totalMemorizedVerses,
    startedSurahsCount,
    completedSurahsCount,
    juzProgress: {
      started: juzStarted,
      completed: juzCompleted,
      details: detailedJuzProgress.details,
    },
    kelas: student.kelas || "",
    target: student.target || "",
    totalUniqueVersesMemorizedSet,
  }
}
