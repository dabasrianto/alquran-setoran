"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon, Edit, Trash2, ChevronDown, Crown, Users } from "lucide-react"

export default function PanduanContent() {
  return (
    <Tabs defaultValue="pengenalan" className="w-full">
      <TabsList className="w-full mb-6 grid grid-cols-3 md:grid-cols-7">
        <TabsTrigger value="pengenalan">Pengenalan</TabsTrigger>
        <TabsTrigger value="akun">Akun</TabsTrigger>
        <TabsTrigger value="subscription">Langganan</TabsTrigger>
        <TabsTrigger value="murid">Murid</TabsTrigger>
        <TabsTrigger value="setoran">Setoran</TabsTrigger>
        <TabsTrigger value="penguji">Penguji</TabsTrigger>
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
      </TabsList>

      <TabsContent value="pengenalan">
        <Card>
          <CardHeader>
            <CardTitle>Pengenalan Aplikasi Tasmi'</CardTitle>
            <CardDescription>Memahami dasar-dasar aplikasi Tasmi'</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Apa itu Aplikasi Tasmi'?</h3>
              <p>
                Aplikasi Tasmi' adalah sistem manajemen dan analisis hafalan Al-Quran berbasis cloud yang dirancang
                untuk membantu guru/ustadz dalam memantau dan mengevaluasi progres hafalan murid. Aplikasi ini
                memungkinkan Anda untuk:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Mengelola data murid dan ustadz/ustadzah (penguji) secara online</li>
                <li>Mencatat dan melacak setoran hafalan dengan sinkronisasi real-time</li>
                <li>Melihat progres hafalan per surat dan juz</li>
                <li>Menganalisis data hafalan melalui dashboard interaktif</li>
                <li>Akses data dari berbagai perangkat dengan akun Google</li>
                <li>Sistem langganan dengan fitur unlimited untuk premium</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Navigasi Aplikasi</h3>
              <p>Aplikasi Tasmi' terdiri dari beberapa bagian utama:</p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>
                  <strong>Beranda</strong> - Halaman utama untuk mengelola murid dan setoran hafalan
                </li>
                <li>
                  <strong>Dashboard</strong> - Visualisasi data dan statistik hafalan
                </li>
                <li>
                  <strong>Ustadz/Ustadzah</strong> - Manajemen data penguji
                </li>
                <li>
                  <strong>Panduan</strong> - Dokumentasi dan bantuan penggunaan aplikasi
                </li>
              </ul>
            </div>

            <Alert>
              <InfoIcon className="h-4 w-4" />
              <AlertTitle>Penyimpanan Data Cloud</AlertTitle>
              <AlertDescription>
                Aplikasi Tasmi' menggunakan Firebase (Google Cloud) untuk menyimpan data Anda. Data tersinkronisasi
                secara real-time antar perangkat dan aman tersimpan di cloud. Anda dapat mengakses data dari mana saja
                dengan akun Google yang sama.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="akun">
        <Card>
          <CardHeader>
            <CardTitle>Manajemen Akun</CardTitle>
            <CardDescription>Cara mengelola akun dan autentikasi</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Login dengan Google</AccordionTrigger>
                <AccordionContent>
                  <ol className="list-decimal pl-6 space-y-2">
                    <li>Buka aplikasi Tasmi' di browser</li>
                    <li>Klik tombol "Masuk dengan Google"</li>
                    <li>Pilih akun Google yang ingin digunakan</li>
                    <li>Berikan izin akses yang diperlukan</li>
                    <li>Anda akan diarahkan ke halaman utama aplikasi</li>
                  </ol>
                  <div className="mt-2 text-sm text-muted-foreground">
                    <strong>Catatan:</strong> Gunakan akun Google yang sama untuk mengakses data dari berbagai
                    perangkat.
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>Logout dari Aplikasi</AccordionTrigger>
                <AccordionContent>
                  <ol className="list-decimal pl-6 space-y-2">
                    <li>Klik foto profil Anda di pojok kanan atas</li>
                    <li>Pilih "Log out" dari menu dropdown</li>
                    <li>Anda akan diarahkan kembali ke halaman login</li>
                  </ol>
                  <div className="mt-2 text-sm text-muted-foreground">
                    <strong>Tip:</strong> Data Anda tetap aman tersimpan di cloud meskipun logout.
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>Sinkronisasi Data Antar Perangkat</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-2">Data Anda otomatis tersinkronisasi antar perangkat:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Login dengan akun Google yang sama di perangkat lain</li>
                    <li>Data akan otomatis muncul dalam beberapa detik</li>
                    <li>Perubahan yang dibuat di satu perangkat akan terlihat di perangkat lain</li>
                    <li>Tidak perlu export/import data manual</li>
                  </ul>
                  <div className="mt-2 text-sm text-muted-foreground">
                    <strong>Catatan:</strong> Pastikan koneksi internet stabil untuk sinkronisasi optimal.
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="subscription">
        <Card>
          <CardHeader>
            <CardTitle>Paket Langganan</CardTitle>
            <CardDescription>Memahami dan mengelola paket langganan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="border-2">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    Paket Gratis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Murid:</span>
                      <span className="font-semibold">Maksimal 5</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ustadz:</span>
                      <span className="font-semibold">Maksimal 1</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ustadzah:</span>
                      <span className="font-semibold">Maksimal 1</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Harga:</span>
                      <span className="font-semibold text-green-600">Gratis</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-amber-200 bg-amber-50">
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="h-5 w-5 text-amber-600" />
                    Paket Premium
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Murid:</span>
                      <span className="font-semibold">Unlimited</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ustadz:</span>
                      <span className="font-semibold">Unlimited</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ustadzah:</span>
                      <span className="font-semibold">Unlimited</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Harga:</span>
                      <span className="font-semibold text-amber-600">Rp 750.000/bulan</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Cara Upgrade ke Premium</AccordionTrigger>
                <AccordionContent>
                  <ol className="list-decimal pl-6 space-y-2">
                    <li>Klik tombol "Upgrade Premium" di banner langganan (halaman utama)</li>
                    <li>Atau klik foto profil → pilih menu upgrade</li>
                    <li>Pilih metode pembayaran yang tersedia</li>
                    <li>Lakukan pembayaran sesuai instruksi</li>
                    <li>Akun akan otomatis upgrade setelah pembayaran dikonfirmasi</li>
                  </ol>
                  <div className="mt-2 text-sm text-blue-600">
                    <strong>Info:</strong> Fitur upgrade sedang dalam pengembangan. Hubungi admin untuk upgrade manual.
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>Melihat Status Langganan</AccordionTrigger>
                <AccordionContent>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Status langganan ditampilkan di foto profil (pojok kanan atas)</li>
                    <li>Banner di halaman utama menunjukkan limit yang tersisa</li>
                    <li>Ikon crown (👑) menandakan akun premium</li>
                    <li>Ikon user (👤) menandakan akun gratis</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>Limit dan Pembatasan</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-2">Ketika mencapai limit akun gratis:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Sistem akan menampilkan pesan error saat mencoba menambah data</li>
                    <li>Data yang sudah ada tetap dapat diedit dan dihapus</li>
                    <li>Fitur dashboard dan laporan tetap berfungsi normal</li>
                    <li>Upgrade ke premium untuk menghilangkan semua batasan</li>
                  </ul>
                  <div className="mt-2 text-sm text-amber-600">
                    <strong>Tip:</strong> Upgrade ke premium jika mengelola lebih dari 5 murid atau butuh lebih banyak
                    ustadz/ustadzah.
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="murid">
        <Card>
          <CardHeader>
            <CardTitle>Manajemen Murid</CardTitle>
            <CardDescription>Cara mengelola data murid</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Menambahkan Murid Baru</AccordionTrigger>
                <AccordionContent>
                  <ol className="list-decimal pl-6 space-y-2">
                    <li>Buka tab "Murid" di halaman Beranda</li>
                    <li>Isi formulir "Tambah Murid Baru" dengan informasi murid:</li>
                    <ul className="list-disc pl-6 mt-1">
                      <li>
                        <strong>Nama Murid</strong> (wajib) - Nama lengkap murid
                      </li>
                      <li>
                        <strong>Kelas/Halaqah</strong> (opsional) - Kelas atau kelompok murid
                      </li>
                      <li>
                        <strong>Target Hafalan</strong> (opsional) - Target hafalan yang ingin dicapai
                      </li>
                    </ul>
                    <li>Klik tombol "Tambah Murid"</li>
                    <li>Data akan otomatis tersimpan ke cloud dan muncul di daftar murid</li>
                  </ol>
                  <div className="mt-2 text-sm text-muted-foreground">
                    <strong>Catatan:</strong> Nama murid harus unik. Akun gratis dibatasi maksimal 5 murid.
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>Mengedit Data Murid</AccordionTrigger>
                <AccordionContent>
                  <ol className="list-decimal pl-6 space-y-2">
                    <li>Temukan murid yang ingin diedit di daftar murid</li>
                    <li>
                      Klik tombol{" "}
                      <span className="inline-flex items-center">
                        <Edit className="h-3 w-3 mr-1" /> Edit
                      </span>{" "}
                      di samping nama murid
                    </li>
                    <li>Form akan diisi dengan data murid yang ada</li>
                    <li>Ubah informasi yang diperlukan</li>
                    <li>Klik tombol "Simpan Perubahan"</li>
                    <li>Data akan otomatis tersinkronisasi ke cloud</li>
                  </ol>
                  <div className="mt-2 text-sm text-muted-foreground">
                    <strong>Tip:</strong> Perubahan akan langsung terlihat di semua perangkat yang login dengan akun
                    yang sama.
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>Menghapus Murid</AccordionTrigger>
                <AccordionContent>
                  <ol className="list-decimal pl-6 space-y-2">
                    <li>Temukan murid yang ingin dihapus di daftar murid</li>
                    <li>
                      Klik tombol{" "}
                      <span className="inline-flex items-center">
                        <Trash2 className="h-3 w-3 mr-1" /> Hapus
                      </span>{" "}
                      di samping nama murid
                    </li>
                    <li>Konfirmasi penghapusan pada dialog yang muncul</li>
                    <li>Data akan terhapus permanen dari cloud</li>
                  </ol>
                  <div className="mt-2 text-sm text-red-500">
                    <strong>Peringatan:</strong> Menghapus murid akan menghapus semua data setoran hafalan yang terkait.
                    Tindakan ini tidak dapat dibatalkan.
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>Melihat Detail Progres Murid</AccordionTrigger>
                <AccordionContent>
                  <ol className="list-decimal pl-6 space-y-2">
                    <li>Temukan murid yang ingin dilihat di daftar murid</li>
                    <li>
                      Klik tombol{" "}
                      <span className="inline-flex items-center">
                        <ChevronDown className="h-3 w-3 mr-1" /> Expand
                      </span>{" "}
                      di samping nama murid
                    </li>
                    <li>Detail progres akan ditampilkan, termasuk:</li>
                    <ul className="list-disc pl-6 mt-1">
                      <li>Progres per Surat - menunjukkan persentase hafalan untuk setiap surat</li>
                      <li>Progres per Juz - menunjukkan persentase hafalan untuk setiap juz</li>
                      <li>Riwayat Setoran - daftar semua setoran hafalan murid</li>
                    </ul>
                  </ol>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="setoran">
        <Card>
          <CardHeader>
            <CardTitle>Manajemen Setoran Hafalan</CardTitle>
            <CardDescription>Cara mencatat dan mengelola setoran hafalan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Menambahkan Setoran Hafalan</AccordionTrigger>
                <AccordionContent>
                  <ol className="list-decimal pl-6 space-y-2">
                    <li>Buka tab "Setoran" di halaman Beranda</li>
                    <li>Isi formulir "Tambah Setoran Hafalan" dengan informasi setoran:</li>
                    <ul className="list-disc pl-6 mt-1">
                      <li>
                        <strong>Pilih Murid</strong> (wajib) - Pilih murid yang menyetorkan hafalan
                      </li>
                      <li>
                        <strong>Pilih Surat</strong> (wajib) - Pilih surat yang disetorkan
                      </li>
                      <li>
                        <strong>Ayat Mulai</strong> (wajib) - Nomor ayat awal yang disetorkan
                      </li>
                      <li>
                        <strong>Ayat Selesai</strong> (wajib) - Nomor ayat akhir yang disetorkan
                      </li>
                      <li>
                        <strong>Penilaian</strong> (wajib) - Pilih penilaian untuk setoran
                      </li>
                      <li>
                        <strong>Penguji</strong> (opsional) - Pilih ustadz/ustadzah yang menguji
                      </li>
                      <li>
                        <strong>Catatan</strong> (opsional) - Tambahkan catatan untuk setoran
                      </li>
                    </ul>
                    <li>Klik tombol "Tambah Setoran"</li>
                    <li>Data akan tersimpan ke cloud dan langsung muncul di progres murid</li>
                  </ol>
                  <div className="mt-2 text-sm text-muted-foreground">
                    <strong>Catatan:</strong> Sistem akan otomatis menghitung progres hafalan berdasarkan setoran yang
                    diinput.
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>Sistem Penilaian</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-2">Aplikasi Tasmi' menggunakan empat kategori penilaian:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong className="text-red-600">Ulang Lagi</strong> - Murid perlu mengulang hafalan karena masih
                      banyak kesalahan
                    </li>
                    <li>
                      <strong className="text-orange-600">Kurang Lancar</strong> - Murid dapat menghafal tetapi masih
                      ada beberapa kesalahan
                    </li>
                    <li>
                      <strong className="text-green-600">Lancar</strong> - Murid dapat menghafal dengan lancar dengan
                      sedikit atau tanpa kesalahan
                    </li>
                    <li>
                      <strong className="text-teal-600">Mutqin</strong> - Murid menghafal dengan sempurna, termasuk
                      tajwid dan makharijul huruf
                    </li>
                  </ul>
                  <div className="mt-2 text-sm text-muted-foreground">
                    <strong>Tip:</strong> Data penilaian akan ditampilkan dalam grafik di dashboard untuk analisis
                    kualitas hafalan.
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="penguji">
        <Card>
          <CardHeader>
            <CardTitle>Manajemen Ustadz/Ustadzah (Penguji)</CardTitle>
            <CardDescription>Cara mengelola data ustadz/ustadzah</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Menambahkan Ustadz/Ustadzah</AccordionTrigger>
                <AccordionContent>
                  <ol className="list-decimal pl-6 space-y-2">
                    <li>Buka halaman "Ustadz/Ustadzah" dari menu navigasi</li>
                    <li>Isi formulir "Tambah Ustadz/Ustadzah" dengan informasi:</li>
                    <ul className="list-disc pl-6 mt-1">
                      <li>
                        <strong>Nama Ustadz/Ustadzah</strong> (wajib) - Nama lengkap
                      </li>
                      <li>
                        <strong>Jenis Kelamin</strong> (wajib) - Pilih Ustadz (L) atau Ustadzah (P)
                      </li>
                      <li>
                        <strong>Keterangan</strong> (opsional) - Informasi tambahan seperti spesialisasi atau kontak
                      </li>
                    </ul>
                    <li>Klik tombol "Tambah Ustadz/Ustadzah"</li>
                    <li>Data akan tersimpan ke cloud dan dapat dipilih saat input setoran</li>
                  </ol>
                  <div className="mt-2 text-sm text-muted-foreground">
                    <strong>Catatan:</strong> Akun gratis dibatasi maksimal 1 ustadz dan 1 ustadzah.
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="dashboard">
        <Card>
          <CardHeader>
            <CardTitle>Menggunakan Dashboard</CardTitle>
            <CardDescription>Cara menganalisis data hafalan dengan dashboard</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Mengakses Dashboard</AccordionTrigger>
                <AccordionContent>
                  <ol className="list-decimal pl-6 space-y-2">
                    <li>Klik tombol "Dashboard" di menu navigasi</li>
                    <li>Dashboard akan otomatis memuat data terbaru dari cloud</li>
                    <li>Data akan refresh otomatis setiap 30 detik</li>
                  </ol>
                  <div className="mt-2 text-sm text-muted-foreground">
                    <strong>Catatan:</strong> Dashboard menampilkan data real-time yang tersinkronisasi dengan input
                    terbaru.
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>Memahami Statistik Ringkasan</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-2">Dashboard menampilkan statistik ringkasan di bagian atas:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>Total Murid</strong> - Jumlah total murid yang terdaftar
                    </li>
                    <li>
                      <strong>Total Ayat Dihafal</strong> - Jumlah total ayat yang telah dihafal oleh semua murid
                    </li>
                    <li>
                      <strong>Surat Selesai</strong> - Jumlah total surat yang telah selesai dihafal
                    </li>
                    <li>
                      <strong>Juz Selesai</strong> - Jumlah total juz yang telah selesai dihafal
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>Menggunakan Visualisasi Data</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-2">Dashboard memiliki beberapa tab visualisasi:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>Progres Murid</strong> - Grafik murid dengan hafalan terbanyak
                    </li>
                    <li>
                      <strong>Progres Surat</strong> - Grafik progres hafalan per surat
                    </li>
                    <li>
                      <strong>Progres Juz</strong> - Grafik progres hafalan per juz
                    </li>
                    <li>
                      <strong>Penilaian</strong> - Diagram lingkaran distribusi penilaian setoran
                    </li>
                  </ul>
                  <div className="mt-2 text-sm text-muted-foreground">
                    <strong>Tip:</strong> Gunakan filter kelas untuk melihat statistik spesifik per kelas.
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>Sinkronisasi Data Real-time</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-2">Dashboard menggunakan sinkronisasi real-time:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Data otomatis update setiap 30 detik</li>
                    <li>Perubahan dari perangkat lain akan terlihat tanpa refresh manual</li>
                    <li>Grafik dan statistik selalu menampilkan data terbaru</li>
                    <li>Tidak perlu export/import data untuk melihat update</li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
