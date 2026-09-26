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