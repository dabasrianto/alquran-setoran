"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Edit, Trash2, User } from "lucide-react"
import type { Penguji } from "@/lib/types"

interface PengujiListProps {
  pengujis: Penguji[]
  onDeletePenguji: (id: string) => void
  onEditPenguji: (penguji: Penguji) => void
}

export default function PengujiList({ pengujis, onDeletePenguji, onEditPenguji }: PengujiListProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Daftar Ustadz/Ustadzah</h2>
      {pengujis.length === 0 ? (
        <p className="text-gray-500 italic p-4 text-center">Belum ada ustadz/ustadzah ditambahkan.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pengujis.map((penguji) => (
            <Card key={penguji.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center">
                    <div className="bg-primary/10 p-2 rounded-full mr-3">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">
                        {penguji.name}{" "}
                        <span className="text-xs text-muted-foreground">
                          ({penguji.gender === "L" ? "Ustadz" : "Ustadzah"})
                        </span>
                      </h3>
                      {penguji.keterangan && <p className="text-sm text-muted-foreground">{penguji.keterangan}</p>}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="warning" size="sm" onClick={() => onEditPenguji(penguji)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => onDeletePenguji(penguji.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
