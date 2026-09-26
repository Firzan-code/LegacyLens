# HANDOFF.md — Modernisasi sample-project

> Dokumen ini dibuat otomatis oleh **Legacy Analyst** (IBM Bob 2.0) setelah
> menyelesaikan satu siklus modernisasi. Baca seluruh dokumen ini sebelum
> melanjutkan pekerjaan di codebase ini.

---

## 1. Ringkasan Perubahan

Sesi modernisasi ini mengubah **6 file** sekaligus. Berikut rinciannya:

| File | Jenis Perubahan | Status |
|---|---|---|
| `utils/pricing.js` | Refactor: callback pattern → `async function` | ✅ Selesai & benar |
| `checkout.js` | Migrasi: callback consumer → `async/await` consumer | ✅ Selesai & benar |
| `invoice.js` | Migrasi parsial (ada bug — lihat §3) | ⚠️ Bug tersembunyi |
| `report.js` | Refactor: callback hell → `Promise.all` + `async/await` | ✅ Selesai & benar |
| `app.js` | Update: Express route handler → `async/await` + try/catch | ✅ Selesai & benar |
| `package.json` | Upgrade: `moment` dari `2.24.0` → `2.31.0` | ✅ Selesai |
| `tests/checkout.test.js` | Update: done-callback pattern → `async/await` | ✅ Selesai & benar |

### Detail perubahan per file

**`utils/pricing.js`** — Inti dari semua perubahan ini.
- Signature lama: `calculateDiscount(price, rate, callback)`
- Signature baru: `async calculateDiscount(price, rate)` → mengembalikan `Promise<result>`
- Error kini dilempar dengan `throw new Error(...)`, bukan diteruskan ke `callback(err)`

**`checkout.js`** — Dimigrasi dengan benar.
- `processCheckout(order, callback)` → `async processCheckout(order)`
- Menggunakan `await calculateDiscount(...)` dan mengembalikan result langsung.

**`report.js`** — Direfactor sepenuhnya.
- Callback rekursif `processNext()` dihapus total.
- Diganti dengan `Promise.all(transactions.map(...))` — lebih ringkas dan paralel.

**`app.js`** — Route handler diupdate.
- Semua `function(req, res)` dengan callback error diubah ke `async (req, res)` dengan `try/catch`.

**`package.json`** — Upgrade moment.
- `moment 2.24.0` → `2.31.0`. API `moment().format()` tidak ada breaking change.

---

## 2. Status Test Suite

```
PASS tests/checkout.test.js
  processCheckout
    ✓ menghitung grand total dengan diskon 10%
    ✓ menghitung grand total tanpa diskon (rate 0)
    ✓ menghitung grand total dengan diskon 100%
    ✓ melempar error jika harga negatif
    ✓ melempar error jika rate melebihi 100

Tests: 5 passed, 5 total ✅
```

Test suite **lolos 100%** dan tidak ada regresi di `checkout.js`.

---

## 3. ⚠️ PERINGATAN: Bug Tersembunyi di `invoice.js`

> **Ini disengaja sebagai bahan demo Ripple Tracer.**

**Lokasi bug:** [`invoice.js`, baris 42](invoice.js)

**Deskripsi:** Fungsi `createInvoice()` lupa menambahkan kata kunci `await` saat memanggil
`calculateDiscount()`. Karena `calculateDiscount()` kini mengembalikan `Promise`, baris:

```js
// BUGGY — 'await' hilang
const result = calculateDiscount(transaction.amount, transaction.discountRate);
```

… membuat `result` berisi **objek `Promise`**, bukan hasil kalkulasi. Akibatnya:

| Properti invoice | Nilai yang dihasilkan | Dampak |
|---|---|---|
| `totalDue` | `undefined` | Tagihan tanpa nominal — tidak bisa diproses pembayaran |
| `lineItems[].amount` | `undefined` | Baris item kosong di invoice |
| `issuedAt` | `undefined` | Invoice tanpa tanggal penerbitan |

**Kenapa tidak ketahuan oleh test?**
`tests/checkout.test.js` hanya mengetes `checkout.js`. `invoice.js` **tidak memiliki satu pun
unit test**. Bug ini tidak akan muncul di CI pipeline — ia hanya akan ketahuan saat invoice
sungguhan dikirimkan ke pelanggan dan semua nilai Rupiah terlihat kosong.

**Cara membuktikan bug:**
```bash
node -e "
const { createInvoice } = require('./invoice');
createInvoice({ customerId: 'C001', customerName: 'Budi', amount: 500000, discountRate: 15 })
  .then(inv => console.log('totalDue:', inv.totalDue)); // → undefined
"
```

---

## 4. Instruksi untuk Pengerja Selanjutnya

### Untuk menemukan & memperbaiki bug di atas, jalankan Ripple Tracer:

Aktifkan custom mode **Ripple Tracer** di Bob IDE, lalu gunakan prompt berikut:

```
File utils/pricing.js baru saja diubah — signature calculateDiscount()
berubah dari callback (price, rate, callback) menjadi async (price, rate).

Telusuri seluruh file di codebase ini yang memanggil calculateDiscount().
Untuk setiap pemanggil, verifikasi apakah mereka sudah menggunakan signature
baru dengan benar (async/await, tanpa argumen ketiga, tanpa callback).

Jika ada yang belum dimigrasi dengan benar, tandai sebagai bug dan jelaskan
dampaknya. Jalankan simulasi manual jika perlu untuk membuktikan bug tersebut
nyata (bukan sekadar analisis statis).

Hasilkan impact_report.md dengan format sesuai docs/7_OUTPUT_SPEC.md.
```

### Checklist sebelum merge ke production:

- [ ] Jalankan `npm test` — pastikan tetap hijau
- [ ] Jalankan Ripple Tracer dengan prompt di atas
- [ ] Perbaiki `invoice.js` sesuai temuan Ripple Tracer
- [ ] Tambah test untuk `invoice.js` dan `report.js` untuk menutup blind spot
- [ ] Verifikasi endpoint `/invoice` via `curl` atau Postman — pastikan `totalDue` bukan `undefined`

---

*Dokumen ini di-generate oleh Legacy Analyst — IBM Bob 2.0 | LegacyLens PoC*
