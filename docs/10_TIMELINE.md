# 10. Timeline — 48 Jam, 2 Orang

Asumsi: hackathon mulai jam **0** dan submission ditutup jam **48**. Sesuaikan jam absolut dengan jadwal panitia.

## 10.1 Checklist SEBELUM Jam Nol (H-1 atau lebih awal)

Ini yang paling sering menghabiskan 1–2 jam pertama hackathon kalau tidak disiapkan lebih dulu — sign-up akun bukan pekerjaan yang butuh kreativitas tim, jadi kerjakan sebelum jam mulai:

- [ ] Kunci/akses API **IBM Bob 2.0** sudah didapat dan sudah dites sekali dengan panggilan minimal
- [ ] Proyek **Supabase** sudah dibuat, `SUPABASE_URL` & `SUPABASE_SERVICE_KEY` sudah tersalin ke tempat aman
- [ ] Akun **Vercel** (frontend) dan **Railway/Render** (backend) sudah dibuat dan tersambung ke GitHub
- [ ] Repo GitHub dibuat, kedua anggota punya akses push
- [ ] Node.js 18+, Python 3.11, `git` sudah terpasang di kedua laptop dan versinya **sama**
- [ ] `AGENT.md`, `README.md`, dan 10 file `docs/` ini sudah dibaca oleh kedua anggota — bukan cuma yang menulis

## 10.2 Blok Waktu

### Jam 0–2 — Setup & Kontrak API (BERDUA, bukan paralel)

Dua anggota duduk bersama, **menyepakati** `4_API_SPEC.md` sebelum kode pertama ditulis. Ini investasi kecil yang mencegah integrasi jam ke-40 gagal karena bentuk JSON tidak cocok.

- [ ] `git init`, struktur folder `backend/` & `frontend/` sesuai `AGENT.md`
- [ ] `.env.example` dan `.env.local.example` dibuat, `.gitignore` mencakup `.env*`
- [ ] Skema request/response di `4_API_SPEC.md` dikonfirmasi berdua — kalau ada perubahan, ubah di sini dulu sebelum ubah kode

### Jam 2–8 — Build Inti Paralel

| Anggota 1 (Backend) | Anggota 2 (Frontend) |
|---|---|
| Setup FastAPI + Pydantic models dari `4_API_SPEC.md` | Setup Next.js + Tailwind + shadcn/ui, komponen kosong sesuai `6_UI_UX_SPEC.md` |
| Implementasi **mode mock** dulu — `MOCK_AI=true` membalas dari `7_SEED_DATA.md` | Bangun `TransactionForm` + dropdown "Load Skenario" memakai data statis dari `7_SEED_DATA.md` (belum perlu backend hidup) |
| Endpoint `/api/analyze-transaction` jalan end-to-end dengan mock | `CircuitBreakerPanel` + `ForensicReport` render dari JSON contoh statis |

> Kenapa mode mock lebih dulu daripada koneksi IBM Bob asli: kedua anggota bisa bekerja **sepenuhnya paralel** tanpa saling menunggu, dan tim tetap punya demo yang jalan meski integrasi AI live telat atau gagal.

### Jam 8–14 — Sambung ke Backend Sungguhan

- [ ] Frontend memanggil `http://localhost:8000` beneran, ganti data statis dengan hasil fetch
- [ ] Backend: implementasi Supabase client, simpan `transactions` + `rab_items` + `audit_logs`
- [ ] Uji ketiga skenario dari `7_SEED_DATA.md` lewat UI (masih mode mock)

**Checkpoint jam 14:** ketiga skenario demo harus sudah jalan end-to-end lewat UI dalam mode mock. Kalau belum tercapai di titik ini, tunda integrasi IBM Bob live dan prioritaskan checkpoint ini dulu.

### Jam 14–20 — Integrasi IBM Bob Live

- [ ] Implementasi `bob_client.py` (HTTPX async) dengan system prompt dari `3_PROMPTS.md`
- [ ] `asyncio.gather` untuk Agent 1 & 2 paralel
- [ ] Validasi Pydantic + fallback per-agent (§3.6.1 di `3_PROMPTS.md`)
- [ ] Uji dengan `MOCK_AI=false` — bandingkan hasil live dengan mock response yang sudah didefinisikan, pastikan konsisten

### Jam 20–30 — Tidur / Istirahat Bergantian + Buffer

Jadwalkan **eksplisit**, jangan diserahkan ke insting masing-masing — kelelahan di jam 30–40 lebih mahal daripada kehilangan 3–4 jam tidur terjadwal. Satu orang bisa lanjut kerja ringan (dokumentasi, styling) sementara yang lain istirahat.

### Jam 30–40 — Polish & Robustness

- [ ] Fallback global (§3.6.2 di `3_PROMPTS.md`) diuji dengan mematikan koneksi ke IBM Bob secara sengaja
- [ ] Responsive check dasar (minimal tidak pecah di ukuran layar proyektor)
- [ ] `TransactionTable` (riwayat), `MockModeBadge`
- [ ] Deploy ke Vercel + Railway/Render, tes dari URL publik (bukan hanya localhost)

### Jam 40–46 — Freeze Fitur, Latihan Demo

- [ ] **Tidak ada fitur baru** setelah titik ini — hanya perbaikan bug
- [ ] Rekam video cadangan (`9_DEMO_SCRIPT.md` §9.2)
- [ ] Gladi bersih pitch minimal 2× dengan stopwatch
- [ ] Isi bagian `[Nama]`, `<username>`, dan detail placeholder lain di `README.md`

### Jam 46–48 — Submission

- [ ] README final, link deploy, video demo (kalau diwajibkan panitia) diunggah
- [ ] Cek submission form panitia terisi lengkap **sebelum** deadline, jangan mepet menit terakhir

## 10.3 Sinyal Bahaya (kalau ini terjadi, potong scope segera)

- Jam 14 tapi mode mock belum jalan end-to-end lewat UI → hentikan fitur baru, fokus checkpoint jam 14
- Jam 30 tapi integrasi IBM Bob live belum berhasil sekali pun → tetap demo dengan mode mock, jangan paksakan live di menit akhir
- Salah satu anggota belum tidur sama sekali di jam 30 → jadwalkan istirahat paksa, kualitas kerja jam 40+ tanpa tidur lebih buruk daripada kehilangan waktu kerja
