# 🛡️ LegacyLens

> **Autonomous Public Procurement Integrity Engine**
> Mendeteksi dan membekukan indikasi korupsi pengadaan **sebelum** dana dicairkan.
> *Proof of Concept 48 jam — [Nama Hackathon].*

![SDG 16](https://img.shields.io/badge/SDG-16%20Peace%2C%20Justice%20%26%20Strong%20Institutions-00689D?style=for-the-badge)
![AI Engine](https://img.shields.io/badge/AI%20Engine-IBM%20Bob%202.0-052FAD?style=for-the-badge&logo=ibm&logoColor=white)
![Backend](https://img.shields.io/badge/Backend-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Frontend](https://img.shields.io/badge/Frontend-Next.js%2015-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Database](https://img.shields.io/badge/Database-Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Status](https://img.shields.io/badge/status-proof%20of%20concept-orange?style=for-the-badge)

---

## 📌 Ringkasan

**LegacyLens** adalah mesin integritas pengadaan berbasis *multi-agent AI* yang menganalisis Rencana Anggaran Biaya (RAB) dan profil vendor secara otomatis, menghitung **Risk Score** 0–100, lalu **membekukan transaksi** yang melewati ambang aman — semuanya sebelum uang berpindah.

Proyek ini menyasar **SDG 16, Target 16.5** (mengurangi korupsi dan penyuapan) dan **16.6** (membangun lembaga yang efektif, akuntabel, transparan).

**Pergeseran paradigma yang ditawarkan:**

| | Pengawasan konvensional | LegacyLens |
|---|---|---|
| Waktu deteksi | Setelah dana cair (audit tahunan) | Sebelum dana cair (detik) |
| Cakupan | Sampel dokumen | Seluruh transaksi |
| Keluaran | Temuan audit | Pembekuan otomatis + laporan forensik |
| Beban auditor | Membaca semua berkas | Fokus ke transaksi ber-*flag* saja |

---

## 🎯 Masalah

Audit pengadaan publik di Indonesia umumnya bersifat **pasca-kejadian**. Ketika markup harga atau vendor fiktif terbukti, dananya sudah cair dan pemulihannya butuh proses hukum bertahun-tahun. Auditor manusia juga tidak mungkin membaca seluruh RAB yang masuk — sampling adalah keharusan, dan celah justru hidup di luar sampel.

Tiga pola yang paling sering lolos:

1. **Markup harga** — harga satuan jauh di atas harga pasar wajar.
2. **Vendor fiktif / perusahaan boneka** — badan usaha didirikan beberapa minggu sebelum tender.
3. **Data profil tidak lengkap** — dokumen krusial "kebetulan" hilang sehingga tidak terverifikasi.

---

## 💡 Solusi

Setiap pengajuan pencairan dana melewati tiga agen AI independen sebelum disetujui. Agen bekerja *stateless*, keputusan dihitung **deterministik** (bukan opini model), dan setiap keputusan meninggalkan jejak audit yang bisa ditelusuri.

```
                        ┌────────────────────────┐
   RAB + Harga Pasar ──►│ 🕵️  THE ANALYST        │──┐
                        │  Audit kewajaran harga │  │
                        └────────────────────────┘  │   ┌──────────────────────┐
                                                    ├──►│ ⚖️  THE CHIEF        │──► Keputusan
                        ┌────────────────────────┐  │   │  Circuit Breaker     │    Final
   Profil Vendor     ──►│ 📈  THE ACCOUNTANT     │──┘   └──────────────────────┘
   + reference_date     │  Verifikasi umur legal │
                        └────────────────────────┘
```

---

## ✨ Fitur Utama

* **Audit otomatis real-time** — RAB dan profil vendor dianalisis dalam hitungan detik.
* **Deteksi red flag** — markup harga tidak wajar dan indikasi perusahaan boneka.
* **Circuit Breaker otonom** — status berubah `frozen` otomatis saat `risk_score ≥ 60`.
* **Laporan forensik berbasis bukti** — setiap poin risiko menyebut item, angka, dan persentasenya.
* **Fail-safe by design** — data hilang **tidak** dianggap aman; kegagalan sistem berujung `frozen`, bukan `approved`.
* **Zero hallucination policy** — agen hanya boleh memakai angka yang ada di input, dan wajib membalas JSON ketat.

---

## 🤖 The Watchdog Network

### 🕵️ The Analyst — *Procurement Auditor*

Membandingkan tiap item RAB dengan harga pasar standar.

```
markup_percent = ((submitted_unit_price - market_unit_price) / market_unit_price) × 100
```

| Kondisi | Kategori | Poin |
|---|---|---|
| `markup_percent > 100` | Markup ekstrem | **50** |
| `15 < markup_percent ≤ 100` | Markup signifikan | **30** |
| `markup_percent ≤ 15` (termasuk negatif) | Wajar | **0** |

Skor akhir diambil dari **item berisiko tertinggi**, bukan penjumlahan — supaya RAB berisi 20 item wajar tidak menenggelamkan 1 item bermasalah, dan skor tetap dalam skala 0–50. Item tanpa data harga pasar **tidak ditebak**; ia dicatat sebagai butuh verifikasi manual dan tidak memengaruhi skor.

### 📈 The Accountant — *Vendor Profile Verifier*

Mendeteksi indikasi perusahaan boneka lewat umur legal vendor.

```
age_days = reference_date − establishment_date
```

| Kondisi | Kategori | Poin |
|---|---|---|
| `age_days < 30` | Baru berdiri | **50** |
| `30 ≤ age_days ≤ 365` | Relatif baru | **30** |
| `age_days > 365` | Mapan | **0** |
| `establishment_date` hilang/invalid | Tidak terverifikasi | **30** |

`reference_date` **selalu disuntikkan backend**, tidak pernah ditebak model — LLM tidak punya jam, dan tanggal karangan akan merusak seluruh perhitungan.

> Catatan: pemantauan aliran dana (*smurfing*, pemecahan transaksi) adalah cakupan **roadmap**, bukan PoC ini.

### ⚖️ The Chief — *Lead Investigator & Circuit Breaker*

| `total_risk_score` | Status | Aksi |
|---|---|---|
| `≥ 60` | `frozen` | Circuit Breaker Activated |
| `< 60` | `approved` | Transaction Cleared |

`forensic_report` hanya memuat agen dengan skor > 0. Bila `transaction_id` antar-agen tidak konsisten, transaksi dipaksa `frozen` karena itu menandakan kegagalan pipeline.

### 💻 The Cyber Forensic — *Roadmap*

Memantau log dan basis data dari upaya manipulasi data atau penyisipan *backdoor* oleh orang dalam. **Belum diimplementasikan.**

---

## 🛠️ Tech Stack

| Lapisan | Teknologi |
|---|---|
| **AI Engine** | IBM Bob 2.0 (Multi-Agent), `temperature = 0` |
| **Backend** | Python 3.11 · FastAPI · Pydantic v2 · Uvicorn · HTTPX |
| **Frontend** | Next.js 15 (App Router, TypeScript) · Tailwind CSS · shadcn/ui · lucide-react |
| **Database** | Supabase (PostgreSQL) |
| **Integrasi** | REST API |
| **Deploy** | Vercel (frontend) · Railway/Render (backend) |

**Keputusan teknis yang perlu dicatat:**

* `httpx.AsyncClient`, bukan `requests` — FastAPI berjalan async; klien blocking akan mengunci event loop saat menunggu balasan AI.
* Semua panggilan ke IBM Bob dan Supabase terjadi **di backend**. Kunci API tidak pernah sampai ke browser; pada sistem anti-korupsi, kunci yang bocor berarti skor risiko bisa dimanipulasi dari sisi klien.
* Skor dihitung dan divalidasi di backend. Frontend hanya menampilkan.

---

## 📂 Struktur Proyek

```
sdg-16-sentinel/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI entrypoint
│   │   ├── schemas.py           # Model Pydantic (request & response)
│   │   ├── agents/
│   │   │   ├── analyst.py       # Agent 1
│   │   │   ├── accountant.py    # Agent 2
│   │   │   └── chief.py         # Agent 3
│   │   ├── services/
│   │   │   ├── bob_client.py    # Wrapper HTTPX ke IBM Bob
│   │   │   └── supabase.py      # Persistensi & audit log
│   │   └── mock/                # Respons statis untuk MOCK_AI=true
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── app/
│   │   ├── page.tsx             # Dashboard
│   │   └── layout.tsx
│   ├── components/
│   │   ├── transaction-table.tsx
│   │   ├── circuit-breaker-panel.tsx
│   │   └── forensic-report.tsx
│   ├── lib/api.ts               # Satu-satunya pemanggil backend
│   └── .env.local.example
└── docs/                        # 1_PRD.md … 8_FRONTEND_STATE.md
```

---

## 🚀 Menjalankan Secara Lokal

### Prasyarat

* Python **3.11**
* Node.js **18+** dan npm
* Akun Supabase (gratis)
* Kunci API IBM Bob 2.0 — *opsional saat pengembangan, lihat mode mock*

### 1. Clone

```bash
git clone https://github.com/<username>/sdg-16-sentinel.git
cd sdg-16-sentinel
```

### 2. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # isi kredensial di sini
uvicorn app.main:app --reload --port 8000
```

Dokumentasi interaktif otomatis tersedia di `http://localhost:8000/docs`.

**`backend/.env`**

```env
IBM_BOB_API_KEY=your_key_here
IBM_BOB_ENDPOINT=https://...
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_KEY=your_service_key
MOCK_AI=true                    # true = pakai respons statis, tanpa panggil AI
```

> `.env` wajib masuk `.gitignore`. Jangan pernah commit kunci.

### 3. Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

**`frontend/.env.local`**

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

Buka `http://localhost:3000`.

### 4. Mode Mock

Dengan `MOCK_AI=true`, backend mengembalikan tiga respons statis dari `7_SEED_DATA.md` tanpa memanggil IBM Bob. Gunanya: frontend bisa dibangun penuh dan demo tetap bisa jalan meski kuota API habis atau jaringan panggung bermasalah.

---

## 🔌 API

### `POST /api/analyze-transaction`

**Request**

```json
{
  "transaction_id": "TRX-2026-00123",
  "vendor": {
    "vendor_name": "PT Sumber Makmur Jaya",
    "establishment_date": "2026-08-15",
    "npwp": "01.234.567.8-901.000"
  },
  "items": [
    { "item_name": "Laptop Core i7 16GB", "quantity": 10, "submitted_unit_price": 25000000 },
    { "item_name": "Printer Laser Warna",  "quantity": 5,  "submitted_unit_price": 8000000 }
  ],
  "market_reference": [
    { "item_name": "Laptop Core i7 16GB", "market_unit_price": 18000000 },
    { "item_name": "Printer Laser Warna",  "market_unit_price": 3500000 }
  ]
}
```

**Response `200 OK`**

```json
{
  "transaction_id": "TRX-2026-00123",
  "status": "frozen",
  "risk_score": 80,
  "action_taken": "Circuit Breaker Activated",
  "forensic_report": [
    {
      "agent": "The Analyst",
      "detail": "Printer Laser Warna: pengajuan Rp8.000.000 vs pasar Rp3.500.000 (markup 128,57%). Laptop Core i7 16GB: pengajuan Rp25.000.000 vs pasar Rp18.000.000 (markup 38,89%)."
    },
    {
      "agent": "The Accountant",
      "detail": "Perusahaan berumur 37 hari (didirikan 2026-08-15), tergolong relatif baru."
    }
  ]
}
```

**Fallback sistem.** Jika pipeline gagal total, backend tetap membalas JSON valid dengan `status: "frozen"` dan `risk_score: 100` — kegagalan tidak boleh berakhir dengan transaksi lolos.

Spesifikasi lengkap ada di [`docs/4_API_SPEC.md`](docs/4_API_SPEC.md).

---

## 🎬 Skenario Demo

| # | Skenario | Analyst | Accountant | Total | Status |
|---|---|---|---|---|---|
| 1 | **Transaksi normal** — harga wajar, vendor berumur 8 tahun | 0 | 0 | **0** | 🟢 `approved` |
| 2 | **Markup harga** — printer +128%, vendor mapan | 50 | 0 | **50** | 🟢 `approved`* |
| 3 | **Vendor fiktif + markup** — vendor 37 hari, printer +128% | 50 | 30 | **80** | 🔴 `frozen` |

\* Skenario 2 sengaja lolos ambang: satu sinyal risiko saja belum cukup membekukan dana. Inilah yang membuat sistem ini bukan sekadar filter kaku — pembekuan menuntut **konvergensi bukti dari dua agen independen**, sehingga false positive ditekan.

Payload ketiga skenario tersedia di [`docs/7_SEED_DATA.md`](docs/7_SEED_DATA.md).

---

## 🗄️ Skema Database (Supabase)

| Tabel | Isi |
|---|---|
| `vendors` | Profil vendor: nama, NPWP, tanggal pendirian |
| `transactions` | Header transaksi, `risk_score`, `status`, `action_taken` |
| `rab_items` | Item RAB: nama, kuantitas, harga pengajuan, harga pasar, markup |
| `audit_logs` | Input & output mentah tiap agen per transaksi |

`audit_logs` bersifat *append-only*. Ini sistem anti-korupsi — jejak auditnya sendiri harus tidak bisa disunting. Detail kolom dan relasi ada di [`docs/5_DATABASE_SCHEMA.md`](docs/5_DATABASE_SCHEMA.md).

---

## 📚 Dokumentasi

| Berkas | Isi |
|---|---|
| [`AGENT.md`](AGENT.md) | Tech stack final & pembagian kerja tim (sumber kebenaran) |
| [`docs/1_PRD.md`](docs/1_PRD.md) | Visi, target SDG, batasan in-scope / out-of-scope |
| [`docs/2_ARCHITECTURE.md`](docs/2_ARCHITECTURE.md) | Alur sistem dan peran tiap agen |
| [`docs/3_PROMPTS.md`](docs/3_PROMPTS.md) | System prompt tiap agen & matriks pembobotan |
| [`docs/4_API_SPEC.md`](docs/4_API_SPEC.md) | Spesifikasi endpoint |
| [`docs/5_DATABASE_SCHEMA.md`](docs/5_DATABASE_SCHEMA.md) | Struktur tabel Supabase |
| [`docs/6_UI_UX_SPEC.md`](docs/6_UI_UX_SPEC.md) | Tata letak dashboard & panel Circuit Breaker |
| [`docs/7_SEED_DATA.md`](docs/7_SEED_DATA.md) | Data dummy 3 skenario demo |
| [`docs/8_FRONTEND_STATE.md`](docs/8_FRONTEND_STATE.md) | Logika perubahan UI terhadap respons API |
| [`docs/9_DEMO_SCRIPT.md`](docs/9_DEMO_SCRIPT.md) | Naskah pitch, rencana cadangan, antisipasi pertanyaan juri |
| [`docs/10_TIMELINE.md`](docs/10_TIMELINE.md) | Pembagian kerja 48 jam & checklist persiapan sebelum mulai |

---

## 🧭 Batasan PoC

Transparansi soal ruang lingkup penting untuk sistem seperti ini:

* Harga pasar berasal dari dataset referensi statis, belum tersambung ke e-Katalog/LKPP.
* Pencocokan item memakai kesamaan nama; belum ada normalisasi spesifikasi teknis.
* Deteksi *splitting project* dan pemantauan aliran dana belum diimplementasikan.
* Belum ada autentikasi pengguna maupun kontrol akses berbasis peran.
* **Keluaran sistem adalah sinyal untuk auditor manusia, bukan putusan hukum.** Status `frozen` berarti "tahan dan periksa", bukan tuduhan.

## 🗺️ Roadmap

* [ ] Integrasi harga acuan e-Katalog LKPP
* [ ] Agen *Cyber Forensic* untuk integritas log & basis data
* [ ] Deteksi *splitting project* lintas transaksi
* [ ] Analisis jaringan vendor (direksi/alamat beririsan)
* [ ] Autentikasi + peran auditor & approver
* [ ] Ekspor laporan forensik ke PDF bertanda tangan digital

---

## 👥 Tim

| Peran | Nama | Tanggung jawab |
|---|---|---|
| Backend & AI | [Nama] | FastAPI, orkestrasi agen, Supabase |
| Frontend | [Nama] | Next.js, dashboard, panel Circuit Breaker |

## 📄 Lisensi

MIT — lihat [`LICENSE`](LICENSE).
