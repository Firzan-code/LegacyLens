# 6. UI/UX Spec

## 6.1 Prinsip Desain

* **Satu halaman.** Tidak perlu routing kompleks untuk PoC — semua terjadi di `app/page.tsx`.
* **Warna membawa arti, bukan dekorasi.** Merah/kuning/hijau harus konsisten di seluruh halaman (badge, border kartu, ikon) — jangan sampai "frozen" berwarna merah di satu tempat dan oranye di tempat lain.
* **Demo-first.** Juri akan melihat halaman ini < 3 menit. Status transaksi dan alasan pembekuan harus terbaca tanpa scroll berlebihan.

## 6.2 Layout Halaman

```
┌──────────────────────────────────────────────────────────┐
│  🛡️ SDG-16 Sentinel                     [MOCK MODE badge] │
├──────────────────────────────────────────────────────────┤
│  ┌─────────────────────────┐  ┌─────────────────────────┐ │
│  │   FORM INPUT TRANSAKSI   │  │   CIRCUIT BREAKER PANEL  │ │
│  │                          │  │                          │ │
│  │  [Load Skenario 1 ▾]     │  │   🟢 / 🟡 / 🔴            │ │
│  │  Vendor: [.........]     │  │   Status: APPROVED       │ │
│  │  Tgl berdiri: [........] │  │   Risk Score: 0 / 100    │ │
│  │  + Tambah item RAB       │  │                          │ │
│  │  [ Analisis Transaksi ]  │  │   (kosong sebelum submit)│ │
│  └─────────────────────────┘  └─────────────────────────┘ │
├──────────────────────────────────────────────────────────┤
│  LAPORAN FORENSIK                                          │
│  ┌────────────────────────────────────────────────────┐   │
│  │ 🕵️ The Analyst — Printer: markup 128,57% ...        │   │
│  │ 📈 The Accountant — vendor berumur 37 hari ...       │   │
│  └────────────────────────────────────────────────────┘   │
├──────────────────────────────────────────────────────────┤
│  RIWAYAT TRANSAKSI                                          │
│  ┌────────────────────────────────────────────────────┐   │
│  │ TRX-ID     | Vendor        | Skor | Status | Waktu  │   │
│  │ TRX-2026-… | PT Sumber …   | 80   | 🔴     | 10:23  │   │
│  └────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────┘
```

## 6.3 Komponen

### `TransactionForm`
* Field vendor: nama, tanggal berdiri (date picker), NPWP (opsional).
* Daftar item RAB dinamis (`+ Tambah item`): nama item, kuantitas, harga pengajuan, harga pasar acuan.
* **Dropdown "Load Skenario"** — mengisi seluruh form otomatis dari `7_SEED_DATA.md` (Normal / Markup Harga / Vendor Fiktif). Ini yang dipakai saat demo, **bukan** mengetik manual di depan juri.
* Tombol submit menampilkan status loading (spinner + teks "Menganalisis..."), disabled saat request berjalan agar tidak double-submit.

### `CircuitBreakerPanel`
* Kosong/netral sebelum ada hasil.
* Setelah hasil datang:
  * `approved` → border/ikon **hijau**, teks "Transaction Cleared".
  * `frozen` → border/ikon **merah**, teks "Circuit Breaker Activated", disertai animasi ringan (mis. pulse sekali) supaya terasa sebagai *event*, bukan status statis.
* Menampilkan `risk_score` sebagai angka besar + bar 0–100.

### `ForensicReport`
* Satu kartu per entri `forensic_report`, ikon sesuai agent (🕵️ Analyst, 📈 Accountant, ⚖️ Chief untuk kasus anomali pipeline).
* Jika `forensic_report` kosong → tampilkan pesan positif eksplisit ("Tidak ada temuan risiko"), **jangan** biarkan section kosong tanpa keterangan — kosong tanpa label terlihat seperti bug saat demo.

### `TransactionTable`
* Menampilkan riwayat transaksi yang sudah dianalisis dalam sesi ini (state React, tidak perlu fetch ulang dari Supabase untuk PoC).
* Baris bisa diklik untuk memuat ulang `ForensicReport` transaksi tersebut tanpa submit ulang.

### `MockModeBadge`
* Badge kecil di header, terisi dari `GET /health` → `mock_ai`. Membantu tim sendiri (bukan untuk juri) memastikan mode yang aktif saat demo tanpa buka terminal.

## 6.4 Skema Warna

| Status | Warna | Token Tailwind (contoh) |
|---|---|---|
| Approved | Hijau | `bg-green-500` / `text-green-700` |
| Frozen | Merah | `bg-red-500` / `text-red-700` |
| Loading/netral | Kuning-abu | `bg-amber-400` / `bg-slate-200` |

## 6.5 Perilaku Error di UI

| Kondisi backend | Tampilan |
|---|---|
| `422` (validasi gagal) | Pesan merah di bawah field terkait, form tetap terisi |
| `500` / fallback global | Panel Circuit Breaker tetap tampil **merah** dengan `action_taken: "System Error - Manual Audit Required"` — bukan halaman error generik. Ini justru menunjukkan fail-safe design bekerja |
| Network error / timeout | Toast: "Tidak bisa terhubung ke server. Coba lagi." + tombol retry |

Detail lengkap pemetaan state → elemen UI ada di [`8_FRONTEND_STATE.md`](8_FRONTEND_STATE.md).

## 6.6 Aksesibilitas Minimum

* Status warna selalu disertai teks/ikon (bukan warna saja) — memenuhi kebutuhan dasar dan menghindari ambiguitas saat screenshot/proyeksi ke layar venue yang kadang warnanya "menipu" di bawah lampu panggung.
* Kontras teks pada badge merah/hijau diuji minimal terhadap standar WCAG AA sederhana (teks putih di atas warna solid, bukan warna pastel).
