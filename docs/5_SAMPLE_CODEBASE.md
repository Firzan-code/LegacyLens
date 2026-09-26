# 5. Sample Codebase — Bahan Demo LegacyLens

## 5.1 Kenapa Butuh Sample Codebase
Ketentuan hackathon mewajibkan peserta membawa dataset/bahan sendiri, dengan syarat: tidak mengandung data confidential, data client, atau data pribadi (PI). Untuk LegacyLens, "dataset"-nya adalah **sebuah codebase lama** yang sengaja mengandung pattern usang, dependency versi lama, dan potensi bug berantai — supaya Bob punya bahan konkret untuk dianalisis saat demo.

## 5.2 Kriteria Codebase yang Dipilih
- Ukuran kecil-menengah (cukup untuk demo 48 jam, tidak butuh berjam-jam dianalisis)
- Punya **minimal 3–4 modul yang saling bergantung** (supaya efek "ripple" terlihat jelas saat satu modul diubah)
- Punya dependency yang sengaja dibuat/dipertahankan versi lama
- Tidak mengandung data pribadi, kredensial, atau informasi confidential apa pun
- Idealnya berlisensi open-source yang mengizinkan pemakaian, atau dibuat sendiri dari nol

## 5.3 Opsi A — Buat Sample Sendiri (direkomendasikan)
Bangun aplikasi kecil (misal: Node.js/Express API sederhana untuk "manajemen tugas" atau "toko buku mini") dengan sengaja:
- Fungsi utilitas yang dipakai di banyak file (contoh: `formatCurrency()` dipanggil dari 4 modul berbeda)
- Satu dependency versi lama yang punya breaking change di versi baru (contoh: library formatting tanggal versi lama vs baru)
- Pattern callback lama yang sebaiknya diubah ke async/await

**Keuntungan:** kamu 100% kontrol atas skenario "bug berantai" yang mau ditunjukkan ke juri — bisa disetel supaya efeknya jelas dan reproducible.

## 5.4 Opsi B — Pakai Codebase Open-Source Kecil
Ambil project starter/tutorial open-source (misal boilerplate Express API lama dari GitHub) dengan lisensi MIT/Apache yang mengizinkan modifikasi bebas. Catat sumbernya untuk dicantumkan di README (transparansi ke juri soal asal dataset).

**Keuntungan:** terlihat lebih "real-world", tapi risikonya efek ripple mungkin tidak sejelas kalau kamu desain sendiri.

## 5.5 Skenario Bug Berantai yang Disiapkan (contoh konkret)
1. Fungsi `calculateDiscount(price, rate)` dipanggil dari 3 tempat: `checkout.js`, `invoice.js`, `report.js`.
2. Saat modernisasi (misal upgrade ke TypeScript atau ubah signature fungsi jadi `calculateDiscount(price, rate, options)`), dua dari tiga pemanggil itu tidak ikut ter-update.
3. Test suite awalnya lolos karena test hanya mengecek `checkout.js` (yang sudah diupdate manual), tapi `invoice.js` dan `report.js` mulai menghasilkan angka salah secara diam-diam.
4. Ini yang harus ditangkap oleh **Ripple Tracer** — mendeteksi dua file lain yang belum ikut ter-update sebelum masuk production, bukan setelah user melapor.

## 5.6 Checklist Persiapan Sebelum Demo
- [ ] Codebase sudah di-push ke repo terpisah (atau folder `sample-project/` di repo utama)
- [ ] Ada minimal 1 test suite yang berjalan (`npm test` atau setara)
- [ ] Skenario bug berantai di 5.5 sudah dicoba manual sekali untuk memastikan reproducible
- [ ] README kecil di dalam sample project menjelaskan struktur & cara jalanin