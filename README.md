# 🔍 LegacyLens

> **Legacy Code Modernization Companion** — Paham kode lama, upgrade dengan percaya diri, tangkap bug berantai sebelum sampai production. *Proof of Concept 48 jam — IBM Bob 2.0 Hackathon.*

![Theme](https://img.shields.io/badge/Theme-Developer%20Workflow-0689D8?style=for-the-badge) ![AI Core](https://img.shields.io/badge/AI%20Core-IBM%20Bob%202.0-052FAD?style=for-the-badge&logo=ibm&logoColor=white) ![Status](https://img.shields.io/badge/status-proof%20of%20concept-orange?style=for-the-badge)

---

## 📌 Ringkasan

**LegacyLens** adalah pendamping modernisasi kode berbasis **IBM Bob 2.0** yang membantu developer memahami codebase lama, merencanakan upgrade dengan aman, lalu secara otomatis memetakan dan menangkap **bug berantai (cascading bugs)** sebelum perubahan sampai ke production.

Proyek ini menyasar tema resmi hackathon: **application maintenance & legacy modernization** — memperbaiki workflow developer yang selama ini penuh keraguan dan risiko tak terlihat.

**Pergeseran paradigma yang ditawarkan:**

| | Cara lama | LegacyLens |
|---|---|---|
| Pemahaman kode lama | Baca manual, berjam-jam/berhari-hari | Dijelaskan Bob dalam hitungan menit |
| Deteksi efek samping perubahan | Ketahuan setelah bug muncul di production | Dipetakan sebelum diterapkan |
| Root cause bug | Ditelusuri manual, file per file | Ditelusuri otomatis lintas file oleh Bob |
| Kepercayaan diri developer | Takut menyentuh kode lama | Berani upgrade dengan validasi jelas |

---

## 🎯 Masalah

Developer sering menghindari menyentuh kode lama karena dua alasan:

1. **Tidak paham** — kode ditulis lama, tanpa dokumentasi, oleh orang yang sudah tidak ada di tim.
2. **Takut efek samping** — bahkan setelah paham, ragu upgrade karena tidak tahu file lain mana yang bergantung pada kode tersebut.

Akibatnya: technical debt menumpuk, dependency usang dibiarkan (rawan celah keamanan), dan ketika perubahan terpaksa dilakukan, bug berantai baru ketahuan setelah masuk production — bukan sebelum.

---

## 💡 Solusi

LegacyLens bekerja dalam dua fase, seluruhnya dijalankan **di dalam Bob IDE** (bukan dipanggil dari luar lewat API):
                ┌──────────────────────────┐
                Kode Lama ────────► │ 🔎 LEGACY ANALYST │
│ Jelaskan & susun rencana│
└──────────────────────────┘
│ (developer approve)
▼
┌──────────────────────────┐
│ ⚙️ AGENT MODE │
│ Eksekusi modernisasi │
└──────────────────────────┘
│
▼
┌──────────────────────────┐
│ 🕸️ RIPPLE TRACER │──► Impact Report
│ Petakan dampak lintas │
│ file + trace root cause │
└──────────────────────────┘

---

## ✨ Fitur Utama

- **Penjelasan kode otomatis** — Bob membaca kode lama dan menjelaskannya dalam bahasa manusia.
- **Rencana modernisasi bertahap** — daftar prioritas upgrade dependency & refactor, bukan asal ubah semua sekaligus.
- **Impact mapping lintas file** — memanfaatkan *full repository context* Bob untuk menemukan file yang diam-diam terdampak perubahan.
- **Root cause tracing** — kalau ada bug, dilacak balik ke penyebab aslinya lintas file, bukan cuma titik error muncul.
- **Human-in-the-loop** — setiap perubahan tetap butuh persetujuan developer, bukan auto-fix membabi buta.

---

## 🤖 Custom Mode & Subagent Bob

### 🔎 Legacy Analyst
Membaca & menjelaskan kode lama, menyusun rencana modernisasi bertahap (upgrade dependency, refactor pattern usang). Akses read-only sampai rencana disetujui.

### 🕸️ Ripple Tracer *(subagent terpisah)*
Setelah perubahan diterapkan, menelusuri seluruh file yang terhubung ke kode yang berubah, menjalankan test, dan jika ada kegagalan — melacak root cause lintas file dengan rantai sebab-akibat eksplisit (File A → File B → File C).

Detail konfigurasi lengkap ada di [`docs/4_BOB_CONFIG.md`](docs/4_BOB_CONFIG.md).

---

## 🛠️ Tech Stack

| Layer | Teknologi | Catatan |
|---|---|---|
| **AI Engine / Core** | **IBM Bob IDE 2.0** | Agent mode, subagents, custom modes, document understanding — bukan dipanggil lewat API, tapi jadi mesin eksekusi langsung |
| **Sample project (bahan demo)** | Node.js / Express | Codebase contoh dengan pattern legacy sengaja disiapkan (lihat `docs/5_SAMPLE_CODEBASE.md`) |
| **Report output** | Markdown (`impact_report.md`) | Format terstruktur, lihat `docs/7_OUTPUT_SPEC.md` |
| **Dashboard (opsional)** | Next.js + Tailwind CSS, statis | Hanya menampilkan report, tanpa backend/API sendiri |
| **AI tambahan (opsional)** | IBM watsonx.ai / watsonx Orchestrate | Boleh dipakai untuk pemrosesan natural language tambahan atau otomasi workflow — bukan wajib |
| **Version control** | Git / GitHub | Termasuk folder wajib `bob_sessions/` (bukti pemakaian Bob) |

---

## 📂 Struktur Proyek

legacylens/
├── sample-project/ # Codebase demo (lihat docs/5_SAMPLE_CODEBASE.md)
├── bob_sessions/ # Screenshot task session Bob (wajib untuk submission)
├── dashboard/ # (opsional) Next.js statis penampil report
├── impact_report.md # Output akhir dari Bob (di-generate saat demo)
├── AGENT.md # Konfigurasi Bob & sumber kebenaran project
└── docs/ # 1_PRD.md … 10_TIMELINE.md


---

## 🚀 Cara Menjalankan

### Prasyarat
- Akun Bob hackathon terkonfirmasi (`ibm-coding-challenge-uat`)
- Bob IDE terinstal & login (lihat panduan resmi hackathon)

### Langkah
```bash
git clone https://github.com/<username>/legacylens.git
cd legacylens/sample-project
```
1. Buka folder `sample-project/` di Bob IDE.
2. Jalankan `/init` untuk generate `AGENTS.md`.
3. Setup custom mode **Legacy Analyst** & **Ripple Tracer** sesuai `docs/4_BOB_CONFIG.md`.
4. Jalankan prompt Fase 1 & Fase 2 dari `docs/3_PROMPTS.md`, urut satu per satu.
5. Hasil akhir tersimpan sebagai `impact_report.md`.

---

## 🎬 Skenario Demo

Detail lengkap skenario bug berantai yang disiapkan ada di [`docs/5_SAMPLE_CODEBASE.md`](docs/5_SAMPLE_CODEBASE.md), dan skrip pitch lengkap ada di [`docs/9_DEMO_SCRIPT.md`](docs/9_DEMO_SCRIPT.md).

---

## 📚 Dokumentasi

| Berkas | Isi |
|---|---|
| [`AGENT.md`](AGENT.md) | Konfigurasi Bob & sumber kebenaran project |
| [`docs/1_PRD.md`](docs/1_PRD.md) | Problem statement, solusi, success metrics |
| [`docs/2_ARCHITECTURE.md`](docs/2_ARCHITECTURE.md) | Alur sistem & komponen |
| [`docs/3_PROMPTS.md`](docs/3_PROMPTS.md) | Daftar prompt siap pakai untuk Bob IDE |
| [`docs/4_BOB_CONFIG.md`](docs/4_BOB_CONFIG.md) | Setup custom mode & subagent |
| [`docs/5_SAMPLE_CODEBASE.md`](docs/5_SAMPLE_CODEBASE.md) | Bahan demo & skenario bug berantai |
| [`docs/6_UI_UX_SPEC.md`](docs/6_UI_UX_SPEC.md) | Desain dashboard report (opsional) |
| [`docs/7_OUTPUT_SPEC.md`](docs/7_OUTPUT_SPEC.md) | Format `impact_report.md` |
| [`docs/8_FRONTEND_STATE.md`](docs/8_FRONTEND_STATE.md) | State dashboard (kalau dibangun) |
| [`docs/9_DEMO_SCRIPT.md`](docs/9_DEMO_SCRIPT.md) | Naskah pitch & antisipasi pertanyaan juri |
| [`docs/10_TIMELINE.md`](docs/10_TIMELINE.md) | Pembagian kerja 48 jam |

---

## 🧭 Batasan PoC

- Sample codebase bersifat disiapkan sendiri untuk demo, bukan production codebase sungguhan.
- Dashboard (jika dibangun) bersifat statis, tanpa autentikasi/multi-user.
- Fokus pada satu bahasa/stack (Node.js) untuk demo — belum mendukung multi-bahasa.

## 🗺️ Roadmap

- [ ] Dukungan multi-bahasa pemrograman
- [ ] Integrasi MCP server ke GitHub untuk auto pull request
- [ ] Riwayat perbandingan antar-run (tracking technical debt dari waktu ke waktu)

---

## 👥 Tim

| Peran | Nama | Tanggung jawab |
|---|---|---|
| Bob Config & Prompt Engineering | [Nama] | Custom mode, subagent, prompt Fase 1 & 2 |
| Sample Project & Dashboard | [Nama] | Sample codebase, dashboard presentasi |

## 📄 Lisensi

MIT — lihat [`LICENSE`](LICENSE).