# 10. Timeline 48 Jam — LegacyLens

Asumsi tim 2 orang. Sesuaikan jam mulai dengan jadwal kickoff sebenarnya.

## Hari 1

**Jam 0–2 — Setup**
- [ ] Konfirmasi akun Bob hackathon (`ibm-coding-challenge-uat`), install Bob IDE, login.
- [ ] Buat/siapkan sample codebase (`5_SAMPLE_CODEBASE.md`) — Opsi A (buat sendiri) direkomendasikan.
- [ ] Push repo awal ke GitHub, siapkan struktur folder termasuk `bob_sessions/`.

**Jam 2–5 — Konfigurasi Bob**
- [ ] Jalankan `/init` di sample project.
- [ ] Setup custom mode Legacy Analyst & Ripple Tracer (`4_BOB_CONFIG.md`).
- [ ] Setup custom rules project-level.
- [ ] Uji coba Prompt 1.1 & 1.2 — cek apakah hasil analisis masuk akal.

**Jam 5–9 — Fase 1 end-to-end**
- [ ] Jalankan penuh Fase 1 (Prompt 1.1–1.3) di sample codebase.
- [ ] Screenshot task session summary, simpan di `bob_sessions/`.
- [ ] Catat hasil: apa yang dijelaskan Bob, apa rencana modernisasinya.

**Jam 9–14 — Fase 2 end-to-end**
- [ ] Terapkan skenario bug berantai (5.5 di `5_SAMPLE_CODEBASE.md`).
- [ ] Jalankan Prompt 2.1–2.4 (Ripple Tracer).
- [ ] Validasi: apakah Bob berhasil deteksi 2 file yang diam-diam terdampak?
- [ ] Kalau hasil belum sesuai ekspektasi, iterasi prompt/custom mode.

**Jam 14–16 — Istirahat / buffer**

## Hari 2

**Jam 16–22 — Dashboard (opsional) atau perkuat report**
- [ ] Kalau waktu cukup: bangun dashboard ringan sesuai `6_UI_UX_SPEC.md` & `8_FRONTEND_STATE.md`.
- [ ] Kalau waktu mepet: fokuskan energi ke kerapian `impact_report.md` mentah — pastikan rendering markdown di GitHub rapi.

**Jam 22–26 — Latihan Fase 1 & 2 sekali lagi (full run)**
- [ ] Jalankan seluruh alur dari nol sekali lagi untuk memastikan reproducible saat demo asli (bukan demo yang keburu-buru pertama kali).
- [ ] Screenshot semua task session tambahan yang relevan.

**Jam 26–30 — Tulis & latihan Demo Script**
- [ ] Sesuaikan `9_DEMO_SCRIPT.md` dengan hasil aktual (bukan hipotetis).
- [ ] Latihan timing — pastikan muat di 4–5 menit.
- [ ] Siapkan jawaban antisipasi pertanyaan juri.

**Jam 30–34 — Finalisasi repo & submission**
- [ ] README final, pastikan semua link dokumentasi (`docs/`) tidak broken.
- [ ] Pastikan folder `bob_sessions/` lengkap dan penamaan filenya sesuai format resmi (`teamnama_taskXX_deskripsi_summary.png`).
- [ ] Submit ke platform hackathon sebelum deadline.

**Jam 34+ — Buffer cadangan**
- Sisakan waktu untuk hal tak terduga (bug demo, masalah jaringan/firewall Bob, dll) — jangan pakai semua waktu sampai mepet deadline.