'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { useAuth } from '@/contexts/auth-context'
import { createUpgradeRequest } from '@/lib/firebase-subscription'
import { SubscriptionTierInfo } from '@/lib/types'

interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  tier: SubscriptionTierInfo
}

export function UpgradeModal({ isOpen, onClose, tier }: UpgradeModalProps) {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const { currentUser } = useAuth()

  const handleUpgrade = async () => {
    if (!currentUser) {
      toast({
        title: "Error",
        description: "Anda harus login untuk melakukan upgrade.",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      await createUpgradeRequest(currentUser.uid, tier.id, tier.price, tier.billingPeriod)
      toast({
        title: "Permintaan Upgrade Terkirim",
        description: `Permintaan upgrade Anda ke paket ${tier.name} telah diterima. Kami akan segera memprosesnya.`,
      })
      onClose()
    } catch (error) {
      console.error("Error creating upgrade request:", error)
      toast({
        title: "Error",
        description: "Gagal mengirim permintaan upgrade. Silakan coba lagi.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Konfirmasi Upgrade ke {tier.name}</DialogTitle>
          <DialogDescription>
            Anda akan mengupgrade ke paket **{tier.name}** dengan harga **{tier.price} {tier.currency}/{tier.billingPeriod}**.
            Fitur yang akan Anda dapatkan:
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
            {tier.features.exportPDF && <li>Export PDF</li>}
            {tier.features.prioritySupport && <li>Dukungan Prioritas</li>}
            {tier.features.customReports && <li>Laporan Kustom</li>}
            {tier.features.multipleInstitutions && <li>Manajemen Multi-Institusi</li>}
            {tier.features.apiAccess && <li>Akses API</li>}
            {tier.features.advancedAnalytics && <li>Analitik Lanjutan</li>}
            {tier.features.bulkImport && <li>Impor Massal</li>}
            <li>Maksimal {tier.features.maxStudents === -1 ? 'Tidak Terbatas' : tier.features.maxStudents} Santri</li>
            <li>Maksimal {tier.features.maxUstadz === -1 ? 'Tidak Terbatas' : tier.features.maxUstadz} Ustadz</li>
            <li>Maksimal {tier.features.maxUstadzah === -1 ? 'Tidak Terbatas' : tier.features.maxUstadzah} Ustadzah</li>
          </ul>
          <p className="text-sm text-red-500">
            **Catatan**: Ini adalah permintaan upgrade. Anda akan dihubungi untuk proses pembayaran lebih lanjut.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Batal
          </Button>
          <Button onClick={handleUpgrade} disabled={loading}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Konfirmasi Upgrade
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
