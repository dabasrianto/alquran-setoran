export interface Setoran {
  id: string
  surah: string
  start: number
  end: number
  penilaian: string
  catatan?: string
  timestamp: string
  pengujiId?: string // ID ustadz/ustadzah yang menguji
}

export interface Student {
  id: string
  name: string
  kelas: string
  target: string
  hafalan: Setoran[]
}

export interface Penguji {
  id: string
  name: string
  gender: "L" | "P" // L untuk Ustadz, P untuk Ustadzah
  keterangan?: string
}

export interface JuzProgress {
  started: number
  completed: number
  details?: Record<
    string,
    {
      memorized: number
      total: number
      percentage: number
      isComplete: boolean
    }
  >
}

export interface StudentSummary {
  totalMemorizedVerses: number
  startedSurahsCount: number
  completedSurahsCount: number
  juzProgress: JuzProgress
  kelas: string
  target: string
  totalUniqueVersesMemorizedSet: Set<string>
}

export interface StudentWithSummary extends Student {
  summary: StudentSummary
}
