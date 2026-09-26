# 6. UI/UX Spec — Dashboard Report LegacyLens

## 6.1 Prinsip Desain
Dashboard ini **murni presentasi** — tidak ada logika AI di dalamnya. Fungsinya cuma menampilkan `impact_report.md` yang dihasilkan Bob (lihat Prompt 2.4 di `3_PROMPTS.md`) dengan cara yang enak dilihat juri saat demo. Kalau waktu mepet, bagian ini boleh diskip — file Markdown mentah dari Bob pun sudah cukup untuk demo.

## 6.2 Halaman yang Dibutuhkan (kalau dibangun)

### Halaman 1 — Ringkasan (Landing/Overview)
- Judul project + satu kalimat tagline
- 3 angka besar (metric card): jumlah file dianalisis, jumlah file terdampak (ripple), jumlah bug tertangkap sebelum "production"
- Tombol/tab menuju detail report

### Halaman 2 — Impact Map (visual)
- Diagram sederhana (node-link) menunjukkan file yang diubah di tengah, dengan garis panah ke file-file yang terdampak
- Tiap node bisa diklik untuk lihat alasan keterkaitannya (diambil langsung dari output Prompt 2.1)

### Halaman 3 — Full Report
- Render `impact_report.md` apa adanya (markdown-to-html), termasuk root cause trace dari Prompt 2.3

## 6.3 Komponen Visual
| Komponen | Fungsi |
|---|---|
| Metric card | Angka ringkas di halaman overview |
| Impact graph | Visualisasi node-link sederhana (bisa pakai library ringan atau SVG manual) |
| Status badge | Hijau = tervalidasi aman, Kuning = perlu review manual, Merah = bug ditemukan |
| Markdown renderer | Menampilkan isi report apa adanya |

## 6.4 Alur Interaksi Demo
1. Buka halaman overview → juri langsung lihat angka dampak (before/after).
2. Klik impact map → tunjukkan bagaimana LegacyLens/Bob "melihat" keterkaitan antar file yang manusia mungkin lewatkan.
3. Scroll ke full report → tunjukkan root cause trace sebagai bukti kedalaman analisis, bukan cuma tebakan.

## 6.5 Kalau Waktu Sangat Terbatas (Fallback)
Skip dashboard sepenuhnya. Cukup buka `impact_report.md` langsung di GitHub (rendering markdown bawaan GitHub sudah rapi) saat demo — fokuskan waktu ke kualitas prompt & hasil analisis Bob, bukan ke polish UI.