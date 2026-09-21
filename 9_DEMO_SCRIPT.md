# 9. Demo Script

Total waktu diasumsikan **5 menit presentasi + 2–3 menit tanya-jawab** — sesuaikan durasi tiap bagian dengan slot yang diberikan panitia.

## 9.1 Struktur Pitch

### (0:00–0:30) Masalah
> "Audit pengadaan publik itu sifatnya pasca-kejadian. Markup harga atau vendor fiktif baru ketahuan setelah dana cair — dan waktu itu, pemulihannya butuh proses hukum bertahun-tahun."

Sampaikan satu angka/fakta konkret kalau ada (mis. dari `1_PRD.md` atau riset singkat), tapi jangan lama-lama di bagian ini — juri sudah familiar dengan masalah korupsi pengadaan, jangan habiskan waktu menjelaskan yang sudah mereka tahu.

### (0:30–1:00) Solusi dalam Satu Kalimat
> "SDG-16 Sentinel membekukan transaksi mencurigakan **sebelum** dana cair, dengan tiga agen AI yang memeriksa kewajaran harga dan keabsahan vendor secara otomatis."

Tampilkan diagram arsitektur (`2_ARCHITECTURE.md` §2.1) — satu gambar, jangan dibaca baris per baris.

### (1:00–3:00) Live Demo

Ikuti urutan ini persis — **jangan mengetik data manual di depan juri**, selalu pakai tombol "Load Skenario":

1. **Skenario 1 (Normal)** — klik load, submit, tunjukkan panel hijau. *"Transaksi wajar tetap lewat cepat — sistem ini tidak membekukan semuanya."*
2. **Skenario 2 (Markup, vendor mapan)** — klik load, submit, tunjukkan panel **tetap hijau** meski markup 128% terdeteksi. *"Satu sinyal risiko saja belum cukup membekukan dana — ini yang membuat sistem tidak jadi filter kaku yang gampang salah tangkap."* Tunjuk laporan forensik yang tetap mencatat temuan meski status approved.
3. **Skenario 3 (Markup + vendor 37 hari)** — klik load, submit, tunjukkan panel **merah**, baca satu baris laporan forensik dengan lantang. *"Dua sinyal independen bertemu, sistem membekukan otomatis, dan alasannya tertulis eksplisit — bukan kotak hitam."*

### (3:00–4:00) Dampak & SDG 16

> "Ini bukan menggantikan auditor — auditor tetap yang memutuskan. Sistem ini yang memastikan mereka melihat transaksi yang tepat, dari detik pertama, bukan dari sampel."

Kaitkan eksplisit ke Target 16.5 dan 16.6 (lihat `1_PRD.md` §1.3).

### (4:00–4:30) Batasan (jujur, bukan kelemahan)

> "Ini proof of concept 48 jam — harga acuan masih dataset statis, belum tersambung e-Katalog. Tapi logika keputusannya deterministik dan bisa diaudit, jadi menyambungkan ke sumber data resmi adalah pekerjaan integrasi, bukan merombak arsitektur."

Poin ini sengaja ada — mengakui batas ruang lingkup membuat klaim yang tersisa lebih dipercaya juri yang teliti.

### (4:30–5:00) Penutup

Satu kalimat penutup + ajakan tanya jawab. Jangan menambah fitur baru di menit terakhir ("dan sebenarnya kami juga..." — hindari, itu membingungkan bukan menambah nilai).

## 9.2 Rencana Cadangan

| Risiko saat presentasi | Mitigasi |
|---|---|
| Wifi venue mati / lambat | Jalankan seluruhnya di `localhost` (frontend + backend di laptop presenter), tidak bergantung internet venue sama sekali saat demo inti |
| IBM Bob API rate-limited/down | `MOCK_AI=true` sudah aktif secara default untuk sesi demo — live API hanya dinyalakan kalau juri secara spesifik minta bukti panggilan live |
| Laptop presenter bermasalah | Rekam video screen-capture ketiga skenario **H-1 sebelum presentasi**, siap diputar dari laptop cadangan/HP jika perlu |
| Juri bertanya di luar skrip (mis. "kenapa ambang 60?") | Siapkan jawaban singkat: *"itu parameter yang bisa dikonfigurasi — untuk PoC ini kami set di titik yang butuh dua sinyal independen untuk membekukan, supaya false positive rendah"* |

## 9.3 Antisipasi Pertanyaan Juri

| Pertanyaan | Jawaban singkat |
|---|---|
| "Bagaimana kalau AI-nya halusinasi?" | Zero Hallucination Policy di prompt + validasi Pydantic + fallback skor konservatif kalau format tidak valid — lihat `3_PROMPTS.md` §3.6 |
| "Kenapa bukan langsung 0/100, kenapa ada tahap 30?" | Supaya kategori risiko menengah tetap tercatat untuk verifikasi manual, tidak dipaksa jadi biner aman/berbahaya |
| "Apa yang terjadi kalau data vendor tidak lengkap?" | Dianggap risiko menengah (30 poin), bukan otomatis aman — demo skenario 4 kalau sempat dibuat (`7_SEED_DATA.md` §7.4) |
| "Bisa dipakai untuk instansi kami sekarang?" | Ini PoC — harga acuan dan skema vendor masih perlu disambungkan ke sumber data resmi instansi, tapi logika inti dan arsitekturnya sudah siap diperluas |

## 9.4 Checklist Sebelum Naik Panggung

- [ ] `MOCK_AI=true` di `.env` backend, sudah di-restart setelah env berubah
- [ ] Ketiga skenario sudah dicoba ulang di laptop yang **sama** dengan yang dipakai presentasi (bukan laptop lain)
- [ ] Video cadangan sudah direkam dan bisa diputar offline
- [ ] Browser di-zoom ke level yang terbaca dari jarak proyektor (coba dari belakang ruangan kalau bisa)
- [ ] Notifikasi/pop-up sistem laptop dimatikan (silent mode) sebelum demo
