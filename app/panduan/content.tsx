"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Separator } from '@/components/ui/separator'
import { InfoIcon, Edit, Trash2, ChevronDown, Crown, Users } from 'lucide-react'

export default function PanduanContent() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Panduan Penggunaan Aplikasi Tasmi</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Selamat datang di aplikasi Tasmi! Panduan ini akan membantu Anda memahami dan menggunakan semua fitur yang tersedia.
                </p>
                <Separator className="my-4" />
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>1. Memulai dan Login</AccordionTrigger>
                    <AccordionContent>
                      <p>
                        Untuk memulai, Anda perlu mendaftar akun atau login jika sudah memiliki akun.
                        Gunakan email dan kata sandi Anda. Jika Anda adalah admin, Anda akan memiliki akses ke fitur tambahan.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>2. Dashboard Pengguna</AccordionTrigger>
                    <AccordionContent>
                      <p>
                        Setelah login, Anda akan diarahkan ke dashboard. Di sini Anda bisa melihat ringkasan statistik,
                        mengelola santri, penguji, riwayat setoran, dan memantau progres santri.
                      </p>
                      <ul className="list-disc pl-5 mt-2 text-muted-foreground">
                        <li>Ringkasan: Melihat statistik umum.</li>
                        <li>Santri: Menambah, mengedit, dan melihat daftar santri Anda.</li>
                        <li>Penguji: Menambah, mengedit, dan melihat daftar penguji.</li>
                        <li>Setoran: Mencatat riwayat setoran tasmi.</li>
                        <li>Progres Santri: Memantau capaian hafalan santri.</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>3. Mengelola Santri</AccordionTrigger>
                    <AccordionContent>
                      <p>
                        Di tab "Santri", Anda bisa menambah santri baru dengan mengisi nama, tanggal lahir, dan informasi lainnya.
                        Anda juga bisa mengedit detail santri yang sudah ada atau menghapus mereka dari daftar.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4">
                    <AccordionTrigger>4. Mencatat Setoran Tasmi</AccordionTrigger>
                    <AccordionContent>
                      <p>
                        Pilih tab "Setoran" untuk mencatat setoran tasmi. Pilih santri, penguji, tanggal, jenis setoran (baru/murajaah),
                        surat, ayat awal, ayat akhir, dan nilai. Ini akan membantu melacak progres hafalan.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-5">
                    <AccordionTrigger>5. Memantau Progres Santri</AccordionTrigger>
                    <AccordionContent>
                      <p>
                        Tab "Progres Santri" memberikan visualisasi progres hafalan setiap santri. Anda bisa melihat
                        surat dan ayat mana yang sudah dihafal dan mana yang masih perlu dikerjakan.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-6">
                    <AccordionTrigger>6. Fitur Premium dan Upgrade</AccordionTrigger>
                    <AccordionContent>
                      <p>
                        Aplikasi ini menawarkan berbagai paket langganan dengan fitur yang berbeda.
                        Anda bisa melihat detail paket di halaman "Paket & Harga" di dashboard Anda.
                        Untuk upgrade, ikuti petunjuk di halaman tersebut.
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-7">
                    <AccordionTrigger>7. Panel Admin (Khusus Admin)</AccordionTrigger>
                    <AccordionContent>
                      <p>
                        Jika Anda adalah admin, Anda memiliki akses ke panel admin. Di sini Anda bisa:
                      </p>
                      <ul className="list-disc pl-5 mt-2 text-muted-foreground">
                        <li>Mengelola Pengguna: Melihat, mengedit peran, dan menghapus pengguna.</li>
                        <li>Mengelola Langganan: Melihat status langganan, menyetujui permintaan upgrade.</li>
                        <li>Mengelola Harga: Mengubah harga dan fitur paket langganan.</li>
                        <li>Log Aktivitas: Memantau aktivitas penting di aplikasi.</li>
                        <li>Debug & Info: Melihat informasi teknis untuk debugging.</li>
                        <li>Aturan Keamanan: Mengelola aturan keamanan Firebase.</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-8">
                    <AccordionTrigger>8. Bantuan dan Dukungan</AccordionTrigger>
                    <AccordionContent>
                      <p>
                        Jika Anda mengalami masalah atau memiliki pertanyaan, jangan ragu untuk menghubungi tim dukungan kami.
                        Kami siap membantu Anda!
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card className="overflow-hidden">
              <CardHeader className="flex flex-row items-start bg-muted/50">
                <div className="grid gap-0.5">
                  <CardTitle className="group flex items-center gap-2 text-lg">
                    Informasi Tambahan
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 text-sm">
                <div className="grid gap-3">
                  <div className="font-semibold">Tips Cepat</div>
                  <ul className="grid gap-3">
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Pastikan koneksi internet Anda stabil saat menggunakan aplikasi.
                      </span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Selalu perbarui aplikasi ke versi terbaru untuk fitur dan perbaikan bug.
                      </span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">
                        Gunakan fitur pencarian untuk menemukan santri atau penguji dengan cepat.
                      </span>
                    </li>
                  </ul>
                </div>
                <Separator className="my-4" />
                <div className="grid gap-3">
                  <div className="font-semibold">Kontak Dukungan</div>
                  <ul className="grid gap-3">
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Email:</span>
                      <span>support@tasmi-app.com</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Telepon:</span>
                      <span>+62 812-3456-7890</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
