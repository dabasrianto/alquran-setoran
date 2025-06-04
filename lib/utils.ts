import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

import type { Student, StudentSummary } from "@/lib/types"
import { quranData, juzData } from "@/lib/quran-data"

export function generateId() {
  return "_" + Math.random().toString(36).substr(2, 9)
}

export function calculateMemorizedVersesForSurah(surahEntries: any[], totalVerses: number) {
  if (!surahEntries || !Array.isArray(surahEntries) || surahEntries.length === 0) {
    return { count: 0, verses: new Set() }
  }

  const memorizedSet = new Set()
  surahEntries.forEach((entry) => {
    if (entry && typeof entry.start === "number" && typeof entry.end === "number") {
      const start = Math.max(1, entry.start)
      const end = Math.min(totalVerses, entry.end)
      if (start <= end) {
        for (let i = start; i <= end; i++) {
          memorizedSet.add(i)
        }
      }
    }
  })

  return { count: memorizedSet.size, verses: memorizedSet }
}

export function calculateJuzProgress(memorizedVersesSet: Set<string>) {
  let startedJuzCount = 0
  let completedJuzCount = 0

  if (!(memorizedVersesSet instanceof Set)) {
    return { started: 0, completed: 0 }
  }

  juzData.forEach((juz) => {
    let isStarted = false
    let isComplete = true
    let totalAyahsInJuz = 0

    for (let s = juz.start.surah; s <= juz.end.surah; s++) {
      const surahInfo = quranData.find((qs) => qs.number === s)
      if (!surahInfo) continue

      const ayahStart = s === juz.start.surah ? juz.start.ayah : 1
      const ayahEnd = s === juz.end.surah ? juz.end.ayah : surahInfo.verses

      for (let a = ayahStart; a <= ayahEnd; a++) {
        totalAyahsInJuz++
        const verseKey = `${s}-${a}`
        if (memorizedVersesSet.has(verseKey)) {
          isStarted = true
        } else {
          isComplete = false
        }
      }
    }

    if (isStarted) startedJuzCount++
    if (isStarted && isComplete && totalAyahsInJuz > 0) completedJuzCount++
  })

  return { started: startedJuzCount, completed: completedJuzCount }
}

export function calculateDetailedJuzProgress(memorizedVersesSet: Set<string>) {
  const progress: Record<string, any> = {}
  let startedJuzCount = 0
  let completedJuzCount = 0

  if (!(memorizedVersesSet instanceof Set)) {
    return { started: 0, completed: 0, details: {} }
  }

  juzData.forEach((juz) => {
    let memorizedInJuz = 0
    let totalAyahsInJuz = 0
    let isStarted = false

    for (let s = juz.start.surah; s <= juz.end.surah; s++) {
      const surahInfo = quranData.find((qs) => qs.number === s)
      if (!surahInfo) continue

      const ayahStart = s === juz.start.surah ? juz.start.ayah : 1
      const ayahEnd = s === juz.end.surah ? juz.end.ayah : surahInfo.verses

      for (let a = ayahStart; a <= ayahEnd; a++) {
        totalAyahsInJuz++
        const verseKey = `${s}-${a}`
        if (memorizedVersesSet.has(verseKey)) {
          memorizedInJuz++
          isStarted = true
        }
      }
    }

    const percentage = totalAyahsInJuz > 0 ? Math.round((memorizedInJuz / totalAyahsInJuz) * 100) : 0
    const isComplete = percentage === 100

    if (isStarted) {
      startedJuzCount++
      progress[juz.juz] = {
        memorized: memorizedInJuz,
        total: totalAyahsInJuz,
        percentage: percentage,
        isComplete: isComplete,
      }
    }

    if (isComplete && isStarted) {
      completedJuzCount++
    }
  })

  return { started: startedJuzCount, completed: completedJuzCount, details: progress }
}

export function calculateStudentSummary(student: Student): StudentSummary {
  let totalMemorizedVerses = 0
  let startedSurahsCount = 0
  let completedSurahsCount = 0
  let juzProgressSummary = { started: 0, completed: 0 }
  const totalUniqueVersesMemorizedSet = new Set<string>()

  if (student && student.hafalan && Array.isArray(student.hafalan) && student.hafalan.length > 0) {
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

    startedSurahsCount = Object.keys(hafalanBySurah).length

    Object.keys(hafalanBySurah).forEach((surahName) => {
      const surahEntries = hafalanBySurah[surahName]
      const surahInfo = quranData.find((s) => s.name === surahName)

      if (surahInfo) {
        const { count: memorizedCount, verses: memorizedVersesSet } = calculateMemorizedVersesForSurah(
          surahEntries,
          surahInfo.verses,
        )

        if (memorizedCount === surahInfo.verses) {
          completedSurahsCount++
        }

        memorizedVersesSet.forEach((verse) => {
          totalUniqueVersesMemorizedSet.add(`${surahInfo.number}-${verse}`)
        })
      }
    })

    totalMemorizedVerses = totalUniqueVersesMemorizedSet.size
    juzProgressSummary = calculateJuzProgress(totalUniqueVersesMemorizedSet)
  }

  return {
    totalMemorizedVerses,
    startedSurahsCount,
    completedSurahsCount,
    juzProgress: juzProgressSummary,
    kelas: student?.kelas || "",
    target: student?.target || "",
    totalUniqueVersesMemorizedSet,
  }
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
