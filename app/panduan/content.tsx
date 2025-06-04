"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon, Edit, Trash2, ChevronDown } from "lucide-react"

export default function PanduanContent() {
  return (
    <Tabs defaultValue="pengenalan" className="w-full">
      <TabsList className="w-full mb-6 grid grid-cols-3 md:grid-cols-6">
        <TabsTrigger value="pengenalan">Pengenalan</TabsTrigger>
        <TabsTrigger value="murid">Murid</TabsTrigger>
        <TabsTrigger value="setoran">Setoran</TabsTrigger>
        <TabsTrigger value="penguji">Penguji</TabsTrigger>
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        <TabsTrigger value="data">Data</TabsTrigger>
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
                Aplikasi Tasmi' adalah sistem manajemen dan analisis hafalan Al-Quran yang dirancang untuk membantu
                guru/ustadz dalam memantau dan mengevaluasi progres hafalan murid. Aplikasi ini memungkinkan Anda untuk:
              </p>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>Mengelola data murid dan ustadz/ustadzah (penguji)</li>
                <li>Mencatat dan melacak setoran hafalan</li>
                <li>Melihat progres hafalan per surat dan juz</li>
                <li>Menganalisis data hafalan melalui dashboard</li>
                <li>Mengekspor dan mengimpor data</li>
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
              <AlertTitle>Penyimpanan Data</AlertTitle>
              <AlertDescription>
                Aplikasi Tasmi' menggunakan penyimpanan lokal (localStorage) di browser Anda. Ini berarti data tersimpan
                di perangkat yang Anda gunakan. Pastikan untuk mengekspor data secara berkala sebagai cadangan.
              </AlertDescription>
            </Alert>
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
                    <li>Murid baru akan muncul di daftar murid di bawah formulir</li>
                  </ol>
                  <div className="mt-2 text-sm text-muted-foreground">
                    <strong>Catatan:</strong> Nama murid harus unik dan tidak boleh sama dengan murid yang sudah ada.
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
                  </ol>
                  <div className="mt-2 text-sm text-muted-foreground">
                    <strong>Tip:</strong> Jika Anda ingin membatalkan pengeditan, klik tombol "Batal Edit".
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
                  </ol>
                  <div className="mt-2 text-sm text-red-500">
                    <strong>Peringatan:</strong> Menghapus murid akan menghapus semua data setoran hafalan yang terkait
                    dengan murid tersebut. Tindakan ini tidak dapat dibatalkan.
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

              <AccordionItem value="item-5">
                <AccordionTrigger>Memfilter dan Mengurutkan Daftar Murid</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-2">Anda dapat memfilter dan mengurutkan daftar murid dengan beberapa cara:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>Filter Nama</strong> - Ketik nama murid di kotak "Filter Nama..." untuk mencari murid
                      tertentu
                    </li>
                    <li>
                      <strong>Filter Kelas</strong> - Pilih kelas dari dropdown "Semua Kelas" untuk menampilkan murid
                      dari kelas tertentu
                    </li>
                    <li>
                      <strong>Urutkan</strong> - Pilih opsi pengurutan dari dropdown "Urutkan Berdasarkan" untuk
                      mengurutkan murid berdasarkan:
                      <ul className="list-disc pl-6 mt-1">
                        <li>Nama (A-Z atau Z-A)</li>
                        <li>Total Ayat Hafal (Terbanyak atau Tersedikit)</li>
                        <li>Surat Selesai (Terbanyak)</li>
                        <li>Juz Selesai (Terbanyak)</li>
                      </ul>
                    </li>
                  </ul>
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
                        <strong>Penilaian</strong> (wajib) - Pilih penilaian untuk setoran (Ulang Lagi, Kurang Lancar,
                        Lancar, atau Mutqin)
                      </li>
                      <li>
                        <strong>Penguji</strong> (opsional) - Pilih ustadz/ustadzah yang menguji
                      </li>
                      <li>
                        <strong>Catatan</strong> (opsional) - Tambahkan catatan atau komentar untuk setoran
                      </li>
                    </ul>
                    <li>Klik tombol "Tambah Setoran"</li>
                    <li>Setoran baru akan tercatat dan muncul di riwayat setoran murid</li>
                  </ol>
                  <div className="mt-2 text-sm text-muted-foreground">
                    <strong>Catatan:</strong> Pastikan ayat mulai dan ayat selesai valid dan tidak melebihi jumlah ayat
                    dalam surat yang dipilih.
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>Mengedit Setoran Hafalan</AccordionTrigger>
                <AccordionContent>
                  <ol className="list-decimal pl-6 space-y-2">
                    <li>Temukan murid yang setorannya ingin diedit</li>
                    <li>Klik tombol expand untuk melihat riwayat setoran</li>
                    <li>
                      Klik tombol{" "}
                      <span className="inline-flex items-center">
                        <Edit className="h-3 w-3 mr-1" /> Edit
                      </span>{" "}
                      di samping setoran yang ingin diedit
                    </li>
                    <li>Form setoran akan diisi dengan data setoran yang ada</li>
                    <li>Ubah informasi yang diperlukan</li>
                    <li>Klik tombol "Simpan Perubahan"</li>
                  </ol>
                  <div className="mt-2 text-sm text-muted-foreground">
                    <strong>Tip:</strong> Saat mengedit setoran, Anda tidak dapat mengubah murid yang terkait dengan
                    setoran tersebut.
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>Menghapus Setoran Hafalan</AccordionTrigger>
                <AccordionContent>
                  <ol className="list-decimal pl-6 space-y-2">
                    <li>Temukan murid yang setorannya ingin dihapus</li>
                    <li>Klik tombol expand untuk melihat riwayat setoran</li>
                    <li>
                      Klik tombol{" "}
                      <span className="inline-flex items-center">
                        <Trash2 className="h-3 w-3 mr-1" /> Hapus
                      </span>{" "}
                      di samping setoran yang ingin dihapus
                    </li>
                    <li>Konfirmasi penghapusan pada dialog yang muncul</li>
                  </ol>
                  <div className="mt-2 text-sm text-red-500">
                    <strong>Peringatan:</strong> Menghapus setoran akan menghapus data hafalan tersebut dari progres
                    murid. Tindakan ini tidak dapat dibatalkan.
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>Memahami Sistem Penilaian</AccordionTrigger>
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
                    <strong>Tip:</strong> Gunakan catatan untuk memberikan detail spesifik tentang kesalahan atau
                    kelebihan dalam setoran.
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
                    <li>Ustadz/Ustadzah baru akan muncul di daftar</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>Mengedit Data Ustadz/Ustadzah</AccordionTrigger>
                <AccordionContent>
                  <ol className="list-decimal pl-6 space-y-2">
                    <li>Temukan ustadz/ustadzah yang ingin diedit di daftar</li>
                    <li>
                      Klik tombol{" "}
                      <span className="inline-flex items-center">
                        <Edit className="h-3 w-3 mr-1" /> Edit
                      </span>
                    </li>
                    <li>Form akan diisi dengan data yang ada</li>
                    <li>Ubah informasi yang diperlukan</li>
                    <li>Klik tombol "Simpan Perubahan"</li>
                  </ol>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>Menghapus Ustadz/Ustadzah</AccordionTrigger>
                <AccordionContent>
                  <ol className="list-decimal pl-6 space-y-2">
                    <li>Temukan ustadz/ustadzah yang ingin dihapus di daftar</li>
                    <li>
                      Klik tombol{" "}
                      <span className="inline-flex items-center">
                        <Trash2 className="h-3 w-3 mr-1" /> Hapus
                      </span>
                    </li>
                    <li>Konfirmasi penghapusan pada dialog yang muncul</li>
                  </ol>
                  <div className="mt-2 text-sm text-red-500">
                    <strong>Peringatan:</strong> Menghapus ustadz/ustadzah tidak akan menghapus setoran yang terkait,
                    tetapi referensi penguji pada setoran tersebut akan hilang.
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>Mengaitkan Penguji dengan Setoran</AccordionTrigger>
                <AccordionContent>
                  <ol className="list-decimal pl-6 space-y-2">
                    <li>
                      Saat menambahkan atau mengedit setoran hafalan, pilih ustadz/ustadzah dari dropdown "Penguji"
                    </li>
                    <li>Informasi penguji akan tercatat bersama dengan setoran</li>
                    <li>Nama penguji akan ditampilkan di riwayat setoran murid</li>
                  </ol>
                  <div className="mt-2 text-sm text-muted-foreground">
                    <strong>Tip:</strong> Mengaitkan penguji dengan setoran membantu melacak siapa yang menguji hafalan
                    tertentu, yang berguna untuk analisis dan akuntabilitas.
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
                    <li>Dashboard akan menampilkan berbagai visualisasi dan statistik hafalan</li>
                  </ol>
                  <div className="mt-2 text-sm text-muted-foreground">
                    <strong>Catatan:</strong> Dashboard hanya akan menampilkan data jika ada murid dan setoran hafalan
                    yang telah diinput.
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
                <AccordionTrigger>Menggunakan Tab Visualisasi</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-2">Dashboard memiliki beberapa tab visualisasi:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>Progres Murid</strong> - Menampilkan grafik murid dengan hafalan terbanyak
                    </li>
                    <li>
                      <strong>Progres Surat</strong> - Menampilkan grafik progres hafalan per surat
                    </li>
                    <li>
                      <strong>Progres Juz</strong> - Menampilkan grafik progres hafalan per juz
                    </li>
                    <li>
                      <strong>Penilaian</strong> - Menampilkan distribusi penilaian setoran dalam bentuk diagram
                      lingkaran
                    </li>
                  </ul>
                  <div className="mt-2 text-sm text-muted-foreground">
                    <strong>Tip:</strong> Klik pada tab yang berbeda untuk beralih antara visualisasi.
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>Memfilter Data Dashboard</AccordionTrigger>
                <AccordionContent>
                  <ol className="list-decimal pl-6 space-y-2">
                    <li>Gunakan dropdown "Filter Kelas" di bagian atas dashboard</li>
                    <li>Pilih kelas tertentu untuk melihat statistik dan visualisasi khusus untuk kelas tersebut</li>
                    <li>Pilih "Semua Kelas" untuk melihat data keseluruhan</li>
                  </ol>
                  <div className="mt-2 text-sm text-muted-foreground">
                    <strong>Tip:</strong> Memfilter berdasarkan kelas sangat berguna untuk membandingkan kinerja antar
                    kelas atau fokus pada kelas tertentu.
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger>Menginterpretasikan Grafik</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-2">Beberapa tips untuk menginterpretasikan grafik di dashboard:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>Grafik Murid</strong> - Menunjukkan murid dengan jumlah ayat hafalan terbanyak, membantu
                      mengidentifikasi murid berprestasi
                    </li>
                    <li>
                      <strong>Grafik Surat</strong> - Menunjukkan surat mana yang paling banyak dihafal (selesai) dan
                      yang masih dalam proses, membantu merencanakan fokus pembelajaran
                    </li>
                    <li>
                      <strong>Grafik Juz</strong> - Menunjukkan progres per juz, membantu melihat distribusi hafalan
                      dalam Al-Quran
                    </li>
                    <li>
                      <strong>Diagram Penilaian</strong> - Menunjukkan distribusi kualitas hafalan, membantu
                      mengevaluasi efektivitas metode pengajaran
                    </li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="data">
        <Card>
          <CardHeader>
            <CardTitle>Manajemen Data</CardTitle>
            <CardDescription>Cara mengelola, mengekspor, dan mengimpor data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Mengekspor Data</AccordionTrigger>
                <AccordionContent>
                  <ol className="list-decimal pl-6 space-y-2">
                    <li>Buka tab "Data" di halaman Beranda</li>
                    <li>Klik tombol "Ekspor Data (JSON)"</li>
                    <li>File JSON akan diunduh ke perangkat Anda</li>
                    <li>Simpan file ini di tempat yang aman sebagai cadangan</li>
                  </ol>
                  <div className="mt-2 text-sm text-muted-foreground">
                    <strong>Tip:</strong> Lakukan ekspor data secara berkala (misalnya mingguan atau bulanan) untuk
                    mencegah kehilangan data.
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>Mengimpor Data</AccordionTrigger>
                <AccordionContent>
                  <ol className="list-decimal pl-6 space-y-2">
                    <li>Buka tab "Data" di halaman Beranda</li>
                    <li>Klik tombol "Impor Data (JSON)"</li>
                    <li>Pilih file JSON yang sebelumnya diekspor dari aplikasi Tasmi'</li>
                    <li>Data akan dimuat ke dalam aplikasi</li>
                  </ol>
                  <div className="mt-2 text-sm text-red-500">
                    <strong>Peringatan:</strong> Mengimpor data akan menimpa semua data yang ada saat ini. Pastikan
                    untuk mengekspor data saat ini sebelum mengimpor data baru jika Anda ingin menyimpannya.
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>Mencetak Laporan</AccordionTrigger>
                <AccordionContent>
                  <ol className="list-decimal pl-6 space-y-2">
                    <li>Buka tab "Data" di halaman Beranda</li>
                    <li>Klik tombol "Cetak Laporan"</li>
                    <li>Jendela cetak baru akan terbuka dengan laporan yang siap dicetak</li>
                    <li>Gunakan dialog cetak browser untuk mencetak atau menyimpan sebagai PDF</li>
                  </ol>
                  <div className="mt-2 text-sm text-muted-foreground">
                    <strong>Tip:</strong> Laporan cetak berisi ringkasan progres hafalan untuk semua murid, yang berguna
                    untuk pertemuan dengan orang tua atau evaluasi program.
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>Memahami Penyimpanan Data Lokal</AccordionTrigger>
                <AccordionContent>
                  <p className="mb-2">
                    Aplikasi Tasmi' menggunakan localStorage browser untuk menyimpan data. Ini berarti:
                  </p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Data disimpan di perangkat yang Anda gunakan</li>
                    <li>Data tidak akan hilang saat Anda menutup browser atau me-refresh halaman</li>
                    <li>Data dapat hilang jika Anda menghapus cache browser atau data browsing</li>
                    <li>Data tidak tersinkronisasi antar perangkat secara otomatis</li>
                  </ul>
                  <div className="mt-2 text-sm text-red-500">
                    <strong>Penting:</strong> Karena keterbatasan penyimpanan lokal, sangat disarankan untuk secara
                    teratur mengekspor data sebagai cadangan dan untuk memindahkan data antar perangkat.
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
