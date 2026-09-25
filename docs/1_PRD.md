# 1. PRD — Product Requirements Document

## 1.1 Visi

Mengubah pengawasan pengadaan publik dari **audit pasca-kejadian** menjadi **pencegahan real-time** — dana yang mencurigakan dibekukan sebelum dicairkan, bukan diselidiki setelah hilang.

## 1.2 Misi

Membangun *proof of concept* yang menunjukkan bahwa tiga sinyal risiko sederhana — kewajaran harga, umur legal vendor, dan konsistensi data — bisa dihitung otomatis dan dikombinasikan menjadi satu keputusan `approved` / `frozen` yang bisa dipercaya.

## 1.3 Target SDG

| Target | Bunyi | Cara proyek ini berkontribusi |
|---|---|---|
| **16.5** | Secara substansial mengurangi korupsi dan penyuapan dalam segala bentuknya | Mendeteksi markup harga & vendor fiktif sebelum dana cair |
| **16.6** | Mengembangkan lembaga yang efektif, akuntabel, dan transparan di semua tingkatan | Setiap keputusan meninggalkan jejak audit (`audit_logs`) yang bisa ditelusuri, bukan kotak hitam |

## 1.4 Masalah

1. Auditor manusia tidak mungkin memeriksa seluruh RAB yang masuk — sampling adalah keharusan, dan celah hidup di luar sampel.
2. Markup harga dan vendor fiktif baru terbukti **setelah** dana cair, ketika pemulihannya sudah butuh proses hukum.
3. Dokumen krusial (tanggal pendirian, referensi harga) sering "kebetulan" tidak lengkap — dan ketidaklengkapan itu sendiri jarang dianggap sebagai sinyal risiko.

## 1.5 Pengguna Sasaran

* **Auditor internal / APIP** — pengguna utama, menerima *flag* dan laporan forensik untuk verifikasi manual.
* **Pejabat Pembuat Komitmen (PPK)** — melihat status transaksi sebelum menyetujui pencairan.
* *(Roadmap)* Masyarakat umum — dashboard transparansi publik.

## 1.6 Cara Kerja Singkat

PPK/auditor input RAB + profil vendor → sistem memanggil 3 agen AI (`The Analyst`, `The Accountant`, `The Chief`) → sistem mengembalikan status `approved`/`frozen` beserta laporan forensik dalam hitungan detik. Alur teknis lengkap ada di [`2_ARCHITECTURE.md`](2_ARCHITECTURE.md).

## 1.7 In-Scope (48 Jam)

* [x] Endpoint tunggal `POST /api/analyze-transaction`.
* [x] Agent 1 (kewajaran harga) & Agent 2 (umur vendor) berjalan paralel, diringkas Agent 3.
* [x] Circuit Breaker otomatis (`risk_score ≥ 60 → frozen`).
* [x] Dashboard: tabel transaksi, panel status, laporan forensik.
* [x] Mode mock (`MOCK_AI=true`) untuk demo tanpa bergantung koneksi live ke AI Engine.
* [x] Penyimpanan transaksi & audit log di Supabase.
* [x] 3 skenario demo siap pakai (normal, markup, vendor fiktif).

## 1.8 Out-of-Scope (48 Jam)

Ditulis eksplisit supaya tidak ada anggota tim yang diam-diam mengerjakan ini dan kehabisan waktu untuk fitur inti:

* ❌ Integrasi harga acuan real-time ke e-Katalog/LKPP — pakai dataset referensi statis.
* ❌ Normalisasi spesifikasi teknis item (pencocokan masih berbasis nama).
* ❌ Deteksi *splitting project* lintas transaksi.
* ❌ Pemantauan aliran dana / deteksi *smurfing* (Agent "Cyber Forensic" — roadmap).
* ❌ Autentikasi pengguna & kontrol akses berbasis peran.
* ❌ Ekspor laporan ke PDF.
* ❌ Multi-bahasa UI.

## 1.9 Definisi Sukses (untuk demo)

1. Tiga skenario demo menghasilkan status yang benar dan konsisten setiap kali dijalankan ulang.
2. Waktu respons endpoint < 5 detik dalam mode live, instan dalam mode mock.
3. Juri bisa membaca laporan forensik dan memahami **alasan** pembekuan tanpa penjelasan tambahan dari tim.
4. Sistem tidak pernah crash / membalas HTML error mentah — kegagalan selalu berujung JSON `frozen`, bukan diam.

## 1.10 Risiko & Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Kuota/API key IBM Bob habis saat demo | Demo gagal total | Mode mock (`MOCK_AI=true`) sebagai jalur utama saat presentasi |
| Koneksi venue tidak stabil | Demo gagal | Rekaman video cadangan, lihat [`9_DEMO_SCRIPT.md`](9_DEMO_SCRIPT.md) |
| Format JSON dari AI tidak valid | Pipeline putus | Validasi Pydantic + fallback skor konservatif per-agent, lihat [`3_PROMPTS.md`](3_PROMPTS.md) §Fallback |
| Scope creep 2 orang / 48 jam | Tidak ada yang selesai penuh | Daftar Out-of-Scope di atas bersifat mengikat, bukan saran |
