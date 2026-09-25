# 7. Seed Data — 3 Skenario Demo

Setiap skenario berisi dua bagian:
1. **Request** — persis bentuk body `POST /api/analyze-transaction` (lihat `4_API_SPEC.md`).
2. **Mock Response** — yang dibalas backend saat `MOCK_AI=true` dan `transaction_id` pada request cocok dengan skenario ini. Nilainya **identik** dengan yang seharusnya dihasilkan IBM Bob di mode live — sengaja dibuat manual sekali di sini supaya konsisten dan bisa direplay tanpa API key.

`reference_date` yang dipakai untuk menghitung `age_days` pada seluruh skenario: **`2026-09-21`** (dihitung server, tidak dikirim di request).

> Simpan versi JSON murni dari tiap request di `backend/app/mock/scenario_1.json`, `scenario_2.json`, `scenario_3.json` — file ini adalah dokumentasi yang dibaca manusia, bukan sumber yang di-*parse* langsung oleh kode.

---

## 7.1 Skenario 1 — Normal (`TRX-2026-00001`)

Harga wajar, vendor sudah lama berdiri. Menunjukkan sistem **tidak** asal membekukan semua transaksi.

### Request

```json
{
  "transaction_id": "TRX-2026-00001",
  "vendor": {
    "vendor_name": "CV Abadi Sentosa",
    "establishment_date": "2015-06-01",
    "npwp": "02.345.678.9-012.000"
  },
  "items": [
    { "item_name": "Kursi Kantor Ergonomis", "quantity": 20, "submitted_unit_price": 1200000 },
    { "item_name": "ATK Bulanan",             "quantity": 1,  "submitted_unit_price": 5000000 }
  ],
  "market_reference": [
    { "item_name": "Kursi Kantor Ergonomis", "market_unit_price": 1150000 },
    { "item_name": "ATK Bulanan",             "market_unit_price": 4800000 }
  ]
}
```

### Mock Response (`200 OK`)

```json
{
  "transaction_id": "TRX-2026-00001",
  "status": "approved",
  "risk_score": 0,
  "action_taken": "Transaction Cleared",
  "forensic_report": []
}
```

*Turunan skor:* Analyst 0 (markup Kursi 4,35%, ATK 4,17% — keduanya ≤15%) + Accountant 0 (berdiri 2015, umur >1 tahun) = **0**.

---

## 7.2 Skenario 2 — Markup Harga, Vendor Mapan (`TRX-2026-00002`)

Satu sinyal risiko kuat (markup ekstrem), tapi vendor terverifikasi lama berdiri. Skor gabungan **belum** melewati ambang — dipakai untuk menunjukkan bahwa Circuit Breaker menuntut **konvergensi bukti**, bukan satu red flag saja.

### Request

```json
{
  "transaction_id": "TRX-2026-00002",
  "vendor": {
    "vendor_name": "PT Mitra Teknologi Nusantara",
    "establishment_date": "2016-02-10",
    "npwp": "03.456.789.0-123.000"
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

### Mock Response (`200 OK`)

```json
{
  "transaction_id": "TRX-2026-00002",
  "status": "approved",
  "risk_score": 50,
  "action_taken": "Transaction Cleared",
  "forensic_report": [
    {
      "agent": "The Analyst",
      "detail": "Printer Laser Warna: pengajuan Rp8.000.000 vs pasar Rp3.500.000 (markup 128,57%). Laptop Core i7 16GB: pengajuan Rp25.000.000 vs pasar Rp18.000.000 (markup 38,89%)."
    }
  ]
}
```

*Turunan skor:* Analyst 50 (item berisiko tertinggi: Printer, markup 128,57%) + Accountant 0 (berdiri 2016, umur >1 tahun) = **50** → di bawah ambang 60, tetap `approved`, tapi `forensic_report` tetap mencatat temuan Analyst untuk ditindaklanjuti auditor secara manual di luar sistem otomatis ini.

---

## 7.3 Skenario 3 — Markup + Vendor Fiktif (`TRX-2026-00123`)

Dua sinyal risiko independen bertemu → Circuit Breaker aktif.

### Request

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

### Mock Response (`200 OK`)

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

*Turunan skor:* Analyst 50 + Accountant 30 (berdiri 37 hari sebelum `reference_date`) = **80** → `≥ 60` → `frozen`.

---

## 7.4 Skenario Tambahan (opsional, untuk Q&A juri)

Kalau ada waktu lebih, satu skenario ke-4 berguna untuk menjawab pertanyaan juri soal "bagaimana kalau datanya tidak lengkap":

**Skenario 4 — Data Tidak Lengkap** (`TRX-2026-00004`): `establishment_date: null`. Ekspektasi: Agent 2 memberi **30 poin**, `flag_type: "incomplete_profile_data"`, bukan 0 — menunjukkan sistem tidak memperlakukan data hilang sebagai "aman secara default". Belum dibuat requestnya secara penuh di sini; tambahkan jika sempat, prioritas tetap tiga skenario di atas.

## 7.5 Aturan Fallback Mode Mock

Jika `transaction_id` pada request **tidak** cocok dengan salah satu ID di atas saat `MOCK_AI=true`, backend membalas Mock Response Skenario 1 (Normal) sebagai default — supaya mengetik ID sembarang saat eksplorasi tidak membuat demo terlihat rusak.
