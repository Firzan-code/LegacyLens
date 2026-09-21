# 4. API Specification

Base URL (lokal): `http://localhost:8000`
Base URL (prod): diisi setelah deploy ke Railway/Render.

Satu-satunya endpoint bisnis untuk PoC ini: **`POST /api/analyze-transaction`**.
(`GET /health` juga tersedia untuk keperluan monitoring/deploy, lihat §4.5.)

---

## 4.1 `POST /api/analyze-transaction`

### Request

`Content-Type: application/json`

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

### Field Reference

| Field | Tipe | Wajib | Catatan |
|---|---|---|---|
| `transaction_id` | string | ✅ | Format bebas, disarankan `TRX-{tahun}-{urutan}` |
| `vendor.vendor_name` | string | ✅ | |
| `vendor.establishment_date` | string (`YYYY-MM-DD`) | ✅* | *Boleh null — akan memicu skor 30 di Agent 2, lihat `3_PROMPTS.md` §3.3 |
| `vendor.npwp` | string | ❌ | Belum dipakai untuk perhitungan skor di PoC ini, disimpan untuk audit |
| `items[].item_name` | string | ✅ | Dicocokkan ke `market_reference` berbasis nama persis |
| `items[].quantity` | integer | ✅ | Disimpan untuk konteks laporan, tidak memengaruhi skor per-unit |
| `items[].submitted_unit_price` | number | ✅ | Rupiah, tanpa titik/koma pemisah |
| `market_reference[].item_name` | string | ✅ | Harus cocok persis dengan salah satu `items[].item_name` |
| `market_reference[].market_unit_price` | number | ✅ | Rupiah |

`reference_date` **tidak dikirim oleh client** — backend menghitungnya sendiri dari waktu server saat request diterima, lalu menyuntikkannya ke payload Agent 2. Ini mencegah client memanipulasi tanggal untuk menghindari deteksi.

### Response `200 OK`

```json
{
  "transaction_id": "TRX-2026-00123",
  "status": "frozen",
  "risk_score": 80,
  "action_taken": "Circuit Breaker Activated",
  "forensic_report": [
    { "agent": "The Analyst", "detail": "Printer Laser Warna: pengajuan Rp8.000.000 vs pasar Rp3.500.000 (markup 128,57%). Laptop Core i7 16GB: pengajuan Rp25.000.000 vs pasar Rp18.000.000 (markup 38,89%)." },
    { "agent": "The Accountant", "detail": "Perusahaan berumur 37 hari (didirikan 2026-08-15), tergolong relatif baru." }
  ]
}
```

| Field | Tipe | Catatan |
|---|---|---|
| `status` | `"approved"` \| `"frozen"` | |
| `risk_score` | integer, 0–100 | `score(Analyst) + score(Accountant)` |
| `action_taken` | string | `"Circuit Breaker Activated"` atau `"Transaction Cleared"` |
| `forensic_report` | array | Kosong `[]` jika kedua agent skor 0 |

### Kode Status

| Kode | Kapan terjadi | Body |
|---|---|---|
| `200` | Pipeline berhasil (termasuk saat hasilnya `frozen`) | Objek response di atas |
| `422` | Payload gagal validasi Pydantic (field wajib hilang, tipe salah) | `{"detail": [...]}` bawaan FastAPI |
| `500` | Kegagalan tak terduga di luar penanganan fallback agent | **Tetap** balas skema di atas dengan `status: "frozen"`, `risk_score: 100` — lihat `3_PROMPTS.md` §3.6.2. Backend tidak boleh membalas HTML error polos. |

`frozen` **bukan** kode error — itu keputusan bisnis yang valid dan selalu dibalas dengan `200`. Hanya kegagalan teknis (payload tidak valid, sistem AI gagal total) yang memakai kode selain `200`.

### Contoh `curl`

```bash
curl -X POST http://localhost:8000/api/analyze-transaction \
  -H "Content-Type: application/json" \
  -d @docs/examples/skenario-3-vendor-fiktif.json
```

---

## 4.2 Skema Error Validasi (`422`)

Contoh saat `items` kosong:

```json
{
  "detail": [
    {
      "loc": ["body", "items"],
      "msg": "List should have at least 1 item after validation, not 0",
      "type": "too_short"
    }
  ]
}
```

Frontend menampilkan ini sebagai pesan form-level, bukan meneruskan mentah ke pengguna — lihat `8_FRONTEND_STATE.md` untuk pemetaan pesan error ke UI.

---

## 4.3 Mode Mock

Diaktifkan lewat env var backend `MOCK_AI=true` (bukan parameter request — supaya tidak bisa diaktifkan dari sisi client saat produksi). Saat aktif:

* Tidak ada panggilan ke IBM Bob.
* Backend mencocokkan `transaction_id` terhadap skenario di `7_SEED_DATA.md` dan membalas output yang sudah disiapkan di sana.
* Bentuk response **identik** dengan mode live — frontend tidak perlu tahu bedanya.
* `transaction_id` yang tidak cocok skenario manapun → dibalas sebagai skenario "normal" (default aman untuk demo).

---

## 4.4 Rate Limit & Timeout

| Aspek | Nilai | Catatan |
|---|---|---|
| Timeout per panggilan agent | 8 detik | Lewat batas → masuk fallback per-agent |
| Timeout total endpoint | 20 detik | Melebihi ini → fallback global (§3.6.2 di `3_PROMPTS.md`) |
| Rate limit | Tidak diimplementasikan di PoC | Dicatat sebagai item roadmap, bukan celah yang diabaikan diam-diam |

---

## 4.5 `GET /health`

Untuk keperluan Railway/Render health check saat deploy.

```json
{ "status": "ok", "mock_ai": true }
```

`mock_ai` membantu tim memastikan saat demo apakah backend sedang jalan di mode mock atau live tanpa harus membuka `.env`.
