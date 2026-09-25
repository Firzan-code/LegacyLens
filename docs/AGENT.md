# AGENT.md — SDG-16 Sentinel

Dokumen ini adalah **satu-satunya sumber kebenaran** untuk tech stack dan pembagian kerja tim.
Kalau ada dokumen lain (termasuk `README.md`) yang bertentangan dengan file ini, file ini yang menang.

---

## 0. Catatan Revisi (v2)

| # | Masalah di versi sebelumnya | Perbaikan di v2 |
|---|---|---|
| 1 | Komponen UI masih "shadcn/ui **atau** Chakra UI" — belum diputuskan | Dikunci ke **shadcn/ui** (alasan di §1.1) |
| 2 | API client masih "Axios **atau** Fetch" | Dikunci ke **fetch bawaan**, dibungkus satu file `lib/api.ts` |
| 3 | HTTP client backend masih "HTTPX **atau** Requests" | Dikunci ke **HTTPX**. `requests` **dilarang** — blocking, bisa membekukan event loop FastAPI saat demo |
| 4 | `README.md` menulis "Database / Backend: Supabase / MongoDB (MERN Stack)" | MongoDB & MERN **dihapus total**. Backend = Python/FastAPI, DB = Supabase (PostgreSQL). README wajib disinkronkan |
| 5 | Versi bahasa/runtime longgar ("Python 3.10+", "Next.js") | Versi dipatok eksplisit supaya laptop dua anggota identik |
| 6 | Tidak ada aturan siapa boleh memanggil apa | Ditambah §3: frontend **tidak pernah** memanggil IBM Bob atau Supabase langsung |
| 7 | Frontend bisa terblokir menunggu backend selesai | Ditambah §4 kontrak API + mode mock, supaya dua anggota bisa jalan paralel sejak jam ke-0 |

---

## 1. Tech Stack

### 1.1 Frontend — Anggota 2

| Komponen | Pilihan final | Catatan |
|---|---|---|
| Framework | **Next.js 15 (App Router), TypeScript** | Cukup 1–2 halaman; jangan bikin routing rumit |
| Styling | **Tailwind CSS v4** | |
| Komponen UI | **shadcn/ui** | Dipilih karena komponennya di-*copy* ke repo (bisa diubah bebas, tidak ada konflik tema), dan sudah satu ekosistem dengan Tailwind. Chakra UI membawa runtime CSS-in-JS sendiri — mubazir kalau sudah pakai Tailwind |
| Ikon | **lucide-react** | Sudah bawaan shadcn/ui, tidak perlu install library ikon lain |
| API client | **fetch bawaan Next.js** | Bungkus dalam satu file `lib/api.ts`. Tidak perlu Axios — hanya ada 1 endpoint |
| State | **`useState` / `useReducer` saja** | Jangan pasang Redux/Zustand untuk 1 endpoint |
| Deploy | **Vercel** | |

**Komponen wajib ada (minimum demo):** tabel transaksi, badge status (hijau `approved` / merah `frozen`), panel *Circuit Breaker*, dan tampilan `forensic_report`.

### 1.2 Backend — Anggota 1

| Komponen | Pilihan final | Catatan |
|---|---|---|
| Bahasa | **Python 3.11** | Patok versi yang sama di kedua laptop |
| Framework | **FastAPI** | |
| Validasi | **Pydantic v2** | Dipakai untuk mem-*parse* JSON balasan agent. Kalau gagal validasi → jalankan fallback, jangan sampai 500 ke frontend |
| Server | **Uvicorn** (`--reload` saat dev) | |
| HTTP client | **HTTPX (`httpx.AsyncClient`)** | **`requests` dilarang.** FastAPI async; `requests` blocking, satu panggilan AI yang lambat akan menahan seluruh server |
| Env | **python-dotenv** | API key IBM Bob & Supabase hanya di `.env`, `.env` masuk `.gitignore` |
| Deploy | **Railway / Render** | Sertakan `requirements.txt` sejak awal |

### 1.3 Database

* **Supabase (PostgreSQL)** — satu-satunya database.
* **Tidak ada MongoDB. Tidak ada MERN stack.** Kalimat itu di `README.md` adalah sisa draf lama dan harus dihapus.
* Diakses **hanya dari backend** memakai *service key*. *Anon key* tidak dipakai di frontend.

### 1.4 AI Engine

* **IBM Bob 2.0** — fitur *multi-agent*: *The Analyst*, *The Accountant*, *The Chief Agent*.
* Dipanggil **eksklusif dari backend** lewat REST (HTTPX), lihat §3.
* Jalankan dengan `temperature = 0` agar hasil demo konsisten.

---

## 2. Arsitektur Aliran Data

```
Browser (Next.js)
      │  POST /api/analyze-transaction   ← satu-satunya jalur
      ▼
FastAPI (Python 3.11)
      ├──► IBM Bob 2.0  : Agent 1 & Agent 2 (paralel) ──► Agent 3
      └──► Supabase     : simpan transaksi + audit log
      │
      ▼  JSON hasil keputusan
Browser (render status & forensic report)
```

---

## 3. Aturan Batas Tanggung Jawab (jangan dilanggar)

1. **Frontend tidak pernah memanggil IBM Bob langsung.** API key tidak boleh sampai ke browser — di sistem anti-korupsi, kunci yang bocor artinya skor risiko bisa dimanipulasi dari sisi klien.
2. **Frontend tidak pernah memanggil Supabase langsung.** Semua lewat FastAPI.
3. **Frontend tidak menghitung `risk_score`.** Angka dan status datang jadi dari backend; frontend hanya menampilkan.
4. **Backend tidak mengirim HTML.** Hanya JSON.

---

## 4. Kontrak Antar-Anggota (sepakati di jam ke-0)

Endpoint tunggal: `POST /api/analyze-transaction`.
Bentuk *request* dan *response*-nya difinalkan di `4_API_SPEC.md` **sebelum** kode mulai ditulis.

Supaya Anggota 2 tidak menunggu:

* Anggota 1 menyediakan **mode mock** sejak awal (`MOCK_AI=true` di `.env`) yang mengembalikan 3 respons statis: normal, markup harga, vendor fiktif.
* Respons mock ini diambil dari `7_SEED_DATA.md`, jadi frontend bisa dibangun penuh sebelum IBM Bob tersambung.

---

## 5. Daftar 8 File Markdown Pra-Hackathon

**Fondasi bersama**

1. `1_PRD.md` — visi, target SDG 16, masalah, solusi, batasan 48 jam (In-Scope & Out of Scope).
2. `2_ARCHITECTURE.md` — alur kerja sistem dan pembagian peran 3 agen IBM Bob 2.0.

**Backend (Anggota 1)**

3. `3_PROMPTS.md` — prompt ketat tiap agen, aturan pembobotan *Risk Score*, batasan anti-halusinasi, wajib output JSON.
4. `4_API_SPEC.md` — dokumentasi `POST /api/analyze-transaction`, skema request & response, plus format respons mock.
5. `5_DATABASE_SCHEMA.md` — tabel Supabase: `transactions`, `vendors`, `rab_items`, `audit_logs`, beserta tipe data dan relasi.

**Frontend (Anggota 2)**

6. `6_UI_UX_SPEC.md` — tata letak dashboard, tabel transaksi, panel *Circuit Breaker* (merah/kuning/hijau).
7. `7_SEED_DATA.md` — data dummy JSON untuk 3 skenario demo (Normal, Markup Harga, Vendor Fiktif) **plus output kalengan tiap agent** untuk mode mock.
8. `8_FRONTEND_STATE.md` — perubahan UI berdasarkan respons API (mis. tombol pencairan mati + laporan merah saat status `frozen`).

**Bersama (baru — tidak ada di draf awal)**

9. `9_DEMO_SCRIPT.md` — naskah pitch, rencana cadangan kalau wifi/API bermasalah saat presentasi, antisipasi pertanyaan juri.
10. `10_TIMELINE.md` — pembagian kerja per blok waktu 48 jam, checklist akun/API key yang harus siap sebelum jam nol.

---

## 6. Yang Harus Diperbaiki di `README.md`

Ganti blok Tech Stack di README agar cocok dengan dokumen ini:

```markdown
## 🛠️ Tech Stack
- **AI & Logic:** IBM Bob 2.0 (Multi-Agent)
- **Backend:** Python 3.11, FastAPI, Pydantic v2, Uvicorn, HTTPX
- **Frontend:** Next.js 15 (TypeScript), Tailwind CSS, shadcn/ui
- **Database:** Supabase (PostgreSQL)
- **Integration:** REST API
```

Hapus baris `Supabase / MongoDB (MERN Stack)` dan `Python / Node.js`.
Di *Prerequisites*, ganti `Python 3.x` menjadi `Python 3.11`.
