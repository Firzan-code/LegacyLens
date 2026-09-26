# 1. Product Requirements Document — LegacyLens

## 1.1 Nama Produk
**LegacyLens** — *"Paham kode lama, upgrade dengan percaya diri, tangkap bug berantai sebelum sampai production."*

Dibangun untuk **IBM Bob 2.0 Hackathon** (tema: *Build with purpose using IBM Bob 2.0*), fokus pada workflow developer: **application maintenance & legacy modernization**.

## 1.2 Problem Statement
Developer sering takut menyentuh kode lama (legacy code) karena dua alasan:

1. **Tidak paham** — kode ditulis lama, tanpa dokumentasi, oleh orang yang sudah tidak ada di tim. Butuh waktu lama untuk sekadar mengerti apa yang dilakukan sebuah fungsi/modul.
2. **Takut efek samping** — bahkan setelah paham, developer ragu melakukan upgrade/refactor karena tidak tahu file lain mana saja yang bergantung pada kode yang mau diubah. Ketakutan ini membuat technical debt terus menumpuk — filosofi tim jadi "kalau masih jalan, jangan disentuh".

Akibatnya: modernisasi tertunda, dependency using versi usang & rawan celah keamanan, dan ketika perubahan akhirnya terpaksa dilakukan, bug berantai (cascading bugs) baru ketahuan setelah masuk production — bukan sebelum.

## 1.3 Target Pengguna
- Developer yang mewarisi (inherit) codebase lama tanpa dokumentasi memadai.
- Tech lead yang perlu menilai risiko sebelum menyetujui rencana upgrade/refactor.
- Tim kecil/startup tanpa dedicated QA yang bergantung pada review manual.

## 1.4 Solusi (Ringkasan)
LegacyLens adalah pendamping dua fase yang seluruhnya dijalankan lewat **IBM Bob IDE**, memanfaatkan *full repository context*, *agent mode*, dan *subagents*:

**Fase 1 — Understand & Modernize**
Bob menganalisis kode lama, menjelaskan fungsinya dalam bahasa manusia, mengidentifikasi bagian berisiko, dan menyarankan langkah modernisasi (upgrade dependency, refactor pattern usang) — lalu mengeksekusinya dengan persetujuan developer.

**Fase 2 — Predict & Catch Cascading Bugs**
Begitu perubahan diterapkan, subagent Bob menelusuri seluruh file yang terhubung ke kode yang berubah, memprediksi dampak lintas file, menjalankan validasi (test), dan jika ada bug — melacak root cause-nya lintas file, bukan hanya di titik errornya.

Output akhir: **Modernization Impact Report** — ringkasan apa yang diubah, apa yang berisiko, dan apa yang sudah tervalidasi aman.

## 1.5 Fitur Bob yang Digunakan (wajib ditunjukkan ke juri)
- **Agent mode** — eksekusi otonom untuk analisis & perubahan kode
- **Subagents** — satu subagent khusus untuk "impact tracing" lintas file, terpisah dari subagent "code explainer"
- **Parallel tasks** — menganalisis beberapa modul yang saling bergantung secara bersamaan
- **Document understanding** — membaca file konfigurasi/dependency (package.json, requirements.txt, dll) sebagai konteks
- **Custom modes** — mode khusus "Legacy Analyst" dan "Ripple Tracer"
- **/init (AGENTS.md)** — memberi Bob konteks proyek yang persisten

## 1.6 Success Metrics (untuk demo)
- Waktu pemahaman kode: dari estimasi "berjam-jam baca manual" → di bawah 5 menit dengan LegacyLens.
- Cakupan deteksi dampak: jumlah file terdampak yang berhasil diidentifikasi sebelum dijalankan test, dibandingkan yang ditemukan test itu sendiri.
- Jumlah bug berantai yang tertangkap sebelum "production" (disimulasikan lewat sample project) dibanding baseline tanpa LegacyLens.

## 1.7 Scope untuk 48 Jam (Hackathon)
**In scope:**
- Satu sample legacy codebase (lihat `5_SAMPLE_CODEBASE.md`) sebagai target demo.
- Prompt/skill/custom mode Bob untuk Fase 1 dan Fase 2 (lihat `3_PROMPTS.md`, `4_BOB_CONFIG.md`).
- Report output dalam format Markdown/HTML sederhana, ditampilkan lewat dashboard ringan (lihat `6_UI_UX_SPEC.md`).
- Demo script end-to-end (lihat `9_DEMO_SCRIPT.md`).

**Out of scope:**
- Integrasi ke CI/CD sungguhan.
- Dukungan multi-bahasa pemrograman (fokus satu stack saja untuk demo).
- Autentikasi/multi-user (dashboard demo bersifat lokal/single-user).

## 1.8 Kepatuhan Ketentuan Hackathon
- Bob IDE = core component (bukan cuma alat bantu nulis kode).
- Sample codebase dipakai sebagai "dataset" — kode sendiri/open-source dengan lisensi yang mengizinkan penggunaan, tanpa data pribadi/confidential.
- Semua task session Bob IDE yang relevan di-screenshot dan disimpan di folder `bob_sessions/` sesuai syarat submission.