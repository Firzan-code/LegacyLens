# 📦 sample-project

> **Legacy Node.js/Express codebase** — disiapkan sebagai bahan demo [LegacyLens](../README.md).
> Mengandung pattern lama dan dependency usang secara sengaja untuk mendemonstrasikan
> kemampuan analisis & modernisasi IBM Bob 2.0.

---

## Cara Menjalankan

### Prasyarat
- Node.js >= 14
- npm >= 6

### Install dependency
```bash
npm install
```

### Jalankan server
```bash
npm start
# Server berjalan di http://localhost:3000
```

### Jalankan test
```bash
npm test
```

---

## Struktur File

```
sample-project/
├── app.js              # Entry point Express — semua route terdaftar di sini
├── checkout.js         # Modul checkout — hitung total + diskon
├── invoice.js          # Modul invoice — buat tagihan resmi ke pelanggan
├── report.js           # Modul laporan — agregasi diskon dari banyak transaksi
├── utils/
│   └── pricing.js      # ⚠️ Fungsi calculateDiscount() — dipakai 3 modul di atas
├── tests/
│   └── checkout.test.js # Test hanya untuk checkout.js (invoice & report tidak ditest)
└── package.json
```

---

## Endpoint API

### `POST /checkout`
Proses checkout satu pesanan.
```json
// Request
{ "price": 100000, "quantity": 2, "discountRate": 10 }

// Response
{
  "orderId": "ORD-1234567890",
  "subtotal": 200000,
  "discountRate": 10,
  "discountAmount": 20000,
  "grandTotal": 180000,
  "status": "pending_payment",
  "processedAt": "01/01/2024 12:00:00"
}
```

### `POST /invoice`
Buat invoice untuk satu transaksi.
```json
// Request
{ "customerId": "C001", "customerName": "Budi", "amount": 500000, "discountRate": 15 }

// Response
{
  "invoiceId": "INV-C001-1234567890",
  "customerName": "Budi",
  "lineItems": [...],
  "totalDue": 425000,
  "issuedAt": "01/01/2024 12:00:00",
  "dueDate": "30 hari dari tanggal penerbitan"
}
```

### `POST /report`
Generate laporan ringkasan diskon dari banyak transaksi.
```json
// Request
{ "transactions": [{ "amount": 100000, "rate": 10 }, { "amount": 200000, "rate": 20 }] }

// Response
{ "totalOriginal": 300000, "totalDiscounted": 250000, "totalSaved": 50000, "count": 2 }
```

---

## ⚠️ Legacy Issues yang Sengaja Disiapkan

Codebase ini mengandung masalah-masalah berikut **secara sengaja** sebagai bahan demo:

| # | File | Masalah | Kategori |
|---|------|---------|----------|
| 1 | `utils/pricing.js` | `calculateDiscount()` memakai callback Node-style padahal tidak ada I/O | Pattern usang |
| 2 | `report.js` | Memproses array dengan callback rekursif (callback hell) alih-alih `Promise.all` | Pattern usang |
| 3 | `package.json` | `moment` di-pin ke `2.24.0` — versi yang sudah deprecated & ada breaking change di versi baru | Dependency usang |
| 4 | `tests/` | Hanya `checkout.js` yang ditest — `invoice.js` dan `report.js` punya **blind spot** | Coverage gap |

**Skenario bug berantai:** Jika `calculateDiscount(price, rate, callback)` dimodernisasi menjadi
`async calculateDiscount(price, rate)`, test akan tetap **hijau** (karena checkout sudah di-update),
tapi `invoice.js` dan `report.js` akan **diam-diam rusak** karena tidak ada test yang menjaganya.
