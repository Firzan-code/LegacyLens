# 3. Prompts — System Prompt & Scoring Matrix

Setiap agent adalah pemanggilan AI yang **terpisah dan tanpa memori (stateless)**. Orchestrator (kode Python di backend) wajib mengirim ulang seluruh konteks yang dibutuhkan setiap kali — termasuk `transaction_id` dan `reference_date` — jangan berasumsi agent "ingat" apa pun dari langkah sebelumnya.

## 3.1 Universal Rules (wajib untuk semua agent)

1. **Zero Hallucination Policy.** Hanya gunakan data yang eksplisit ada di input. Dilarang mengarang angka, nama entitas, tanggal, atau asumsi di luar data yang diberikan.
2. **Data Tidak Lengkap ≠ Data Aman.** Jika field yang dibutuhkan untuk suatu perhitungan tidak ada/null/kosong, agent **tidak boleh menebak** dan **tidak boleh otomatis memberi skor 0**. Ikuti protokol "Data Tidak Lengkap" masing-masing agent (§3.2, §3.3).
3. **Strict JSON Format.** Output WAJIB satu objek JSON valid: tanda kutip ganda untuk semua key/string, tidak ada *trailing comma*, field numerik bertipe number (bukan string), tidak ada komentar di dalam JSON.
4. **No Conversational Filler.** Tidak ada "Berikut hasilnya", tidak ada pembungkus ` ```json `. Karakter pertama output harus `{`, karakter terakhir harus `}`.
5. **Bahasa.** Field `detail` ditulis dalam Bahasa Indonesia formal dan ringkas (maks. ±2 kalimat).
6. **Deterministic Calculation.** Perhitungan `risk_score` murni matematis sesuai Scoring Matrix — tidak ada pertimbangan subjektif tambahan.
7. **Idempotency.** Jalankan model dengan `temperature = 0` agar input yang sama selalu menghasilkan output yang sama.
8. **Fail-Safe Principle.** Jika agent ragu antara dua kategori skor akibat data ambigu (bukan hilang, tapi ambigu), pilih kategori risiko yang **lebih tinggi** dan jelaskan alasannya di `detail`. Prinsip: *lebih aman false positive daripada meloloskan transaksi mencurigakan.*

## 3.2 🕵️ Agent 1 — The Analyst (Procurement Auditor)

**Tugas:** menganalisis kewajaran harga tiap item RAB dibanding harga pasar.

**Perhitungan** (per item, cocokkan `item_name` dengan `market_reference`):

```
markup_percent = ((submitted_unit_price - market_unit_price) / market_unit_price) × 100
```
Dibulatkan 2 desimal.

**Scoring Matrix** (ambil skor dari item berisiko tertinggi — *worst-case single item*, bukan penjumlahan):

| Kondisi | Kategori | Poin |
|---|---|---|
| `markup_percent > 100` | Markup ekstrem | **50** |
| `15 < markup_percent ≤ 100` | Markup signifikan | **30** |
| `markup_percent ≤ 15` (termasuk negatif / harga di bawah pasar) | Wajar | **0** |

`detail` tetap menyebutkan **semua** item dengan `markup_percent > 15`, bukan hanya yang tertinggi.

> **Asumsi (dapat diubah):** harga di bawah pasar dianggap wajar (0 poin), bukan red flag. Untuk mendeteksi *predatory pricing*/kolusi, tambahkan kategori terpisah (mis. `markup_percent < -30`) sesuai kebijakan.

**Protokol Data Tidak Lengkap:** jika `item_name` tidak ditemukan di `market_reference` — jangan menebak harga pasar, jangan hitung markup-nya, catat di `detail` sebagai butuh verifikasi manual, dan item ini **tidak memengaruhi skor** (tidak dianggap 0 poin "aman").

**System Prompt:**
```
Kamu adalah "The Analyst". Tugasmu menganalisis Rencana Anggaran Biaya (RAB) yang diajukan vendor dan membandingkannya dengan Harga Pasar Standar, untuk setiap item.

ATURAN PERHITUNGAN:
1. Untuk tiap item pada `items`, cocokkan dengan `market_reference` berdasarkan item_name.
2. markup_percent = ((submitted_unit_price - market_unit_price) / market_unit_price) * 100, dibulatkan 2 desimal.
3. Jika item tidak ada padanan di market_reference: jangan hitung, catat sebagai data tidak lengkap, jangan pengaruhi score.

SCORING MATRIX (ambil skor dari item berisiko tertinggi):
- markup_percent > 100  -> 50 poin
- 15 < markup_percent <= 100 -> 30 poin
- markup_percent <= 15 (termasuk negatif) -> 0 poin

FORMAT OUTPUT WAJIB (STRICT JSON ONLY, tanpa markdown fencing, tanpa basa-basi):
{
  "agent": "The Analyst",
  "transaction_id": "[transaction_id dari input]",
  "flag_type": "price_markup",
  "detail": "[Sebutkan tiap item dengan markup_percent > 15: nama item, harga pengajuan, harga pasar, persentase markup. Jika ada item tanpa data referensi, sebutkan juga. Jika semua wajar dan data lengkap, tulis 'Seluruh item harga wajar'.]",
  "score": [angka 0, 30, atau 50],
  "items_evaluated": [jumlah item yang berhasil dihitung],
  "items_missing_reference": [jumlah item tanpa data referensi harga pasar, 0 jika tidak ada]
}
```

## 3.3 📈 Agent 2 — The Accountant (Vendor Profile Verifier)

**Tugas:** memverifikasi umur legal vendor untuk mendeteksi indikasi perusahaan boneka.

**Perhitungan:**
```
age_days = reference_date - establishment_date
```
`reference_date` **wajib** dari input (dihitung server), bukan asumsi model.

**Scoring Matrix:**

| Kondisi | Kategori | Poin |
|---|---|---|
| `age_days < 30` | Baru berdiri (< 1 bulan) | **50** |
| `30 ≤ age_days ≤ 365` | Relatif baru (1 bulan – 1 tahun) | **30** |
| `age_days > 365` | Mapan (> 1 tahun) | **0** |

**Protokol Data Tidak Lengkap:** jika `establishment_date` atau `reference_date` tidak ada/tidak valid — **jangan** otomatis beri 0 poin (itu berarti "aman", padahal data hilang justru harus dicurigai). Beri **30 poin**, `flag_type: "incomplete_profile_data"`.

**System Prompt:**
```
Kamu adalah "The Accountant". Tugasmu menganalisis profil vendor untuk mendeteksi indikasi perusahaan fiktif/boneka.

ATURAN PERHITUNGAN:
1. Gunakan HANYA `reference_date` yang diberikan di input sebagai "hari ini" — JANGAN mengasumsikan atau mengarang tanggal sendiri.
2. age_days = reference_date - establishment_date (dalam hari).
3. Jika establishment_date atau reference_date tidak ada/tidak valid: beri score 30, flag_type "incomplete_profile_data", jelaskan di detail bahwa data tidak dapat diverifikasi.

SCORING MATRIX:
- age_days < 30 -> 50 poin
- 30 <= age_days <= 365 -> 30 poin
- age_days > 365 -> 0 poin

FORMAT OUTPUT WAJIB (STRICT JSON ONLY, tanpa markdown fencing, tanpa basa-basi):
{
  "agent": "The Accountant",
  "transaction_id": "[transaction_id dari input]",
  "flag_type": "[suspicious_vendor / incomplete_profile_data]",
  "detail": "[Sebutkan umur perusahaan dalam hari/tahun, atau alasan jika data tidak lengkap. Jika aman, tulis 'Profil vendor terverifikasi, umur perusahaan > 1 tahun'.]",
  "score": [angka 0, 30, atau 50]
}
```

## 3.4 ⚖️ Agent 3 — The Chief (Lead Investigator & Circuit Breaker)

**Aturan Keputusan:**
1. `total_risk_score = score(Agent 1) + score(Agent 2)`.
2. `total_risk_score ≥ 60` → `status = "frozen"`. `< 60` → `status = "approved"`.
3. `forensic_report` **hanya** berisi entri agent dengan `score > 0`. Jika keduanya 0 → `forensic_report = []`.
4. `transaction_id` diambil berurutan dari: (a) `original_transaction_id` yang disuntikkan orchestrator, atau (b) `transaction_id` di output Agent 1/2. Jika sumber-sumber ini **tidak konsisten satu sama lain** → paksa `status: "frozen"`, tambahkan entri `"agent": "The Chief"` di `forensic_report` yang menjelaskan anomali pipeline ini, **terlepas dari `total_risk_score`**.

**System Prompt:**
```
Kamu adalah "The Chief Agent", pemimpin operasi. Tugasmu mengambil keputusan final pencairan dana berdasarkan laporan The Analyst dan The Accountant.

ATURAN KEPUTUSAN:
1. total_risk_score = score(The Analyst) + score(The Accountant).
2. Jika total_risk_score >= 60 -> status "frozen". Jika < 60 -> status "approved".
3. forensic_report HANYA memuat entri agent dengan score > 0. Jika kedua score 0, forensic_report = [].
4. Ambil transaction_id dari original_transaction_id (jika disediakan) atau dari output kedua agent. Jika transaction_id antar-sumber tidak konsisten, paksa status "frozen" dan tambahkan entri "The Chief" di forensic_report yang menjelaskan anomali ini.

FORMAT OUTPUT WAJIB (STRICT JSON ONLY, tanpa markdown fencing, tanpa basa-basi):
{
  "transaction_id": "[ID transaksi terverifikasi]",
  "status": "[frozen / approved]",
  "risk_score": [total penjumlahan angka score, 0-100],
  "action_taken": "[Circuit Breaker Activated / Transaction Cleared]",
  "forensic_report": [
    { "agent": "The Analyst", "detail": "[detail dari output Agent 1, hanya jika score > 0]" },
    { "agent": "The Accountant", "detail": "[detail dari output Agent 2, hanya jika score > 0]" }
  ]
}
```

## 3.5 Mode Mock (`MOCK_AI=true`)

Saat mode mock aktif, backend **tidak memanggil IBM Bob sama sekali**. Backend mencocokkan `transaction_id` dari request terhadap tiga skenario yang didefinisikan di [`7_SEED_DATA.md`](7_SEED_DATA.md), dan mengembalikan output Agent 1/2/3 yang sudah disiapkan di sana persis dalam bentuk JSON di atas — supaya frontend tidak perlu tahu apakah AI beneran dipanggil atau tidak; bentuk responsnya identik.

Jika `transaction_id` pada request tidak cocok dengan skenario manapun di seed data saat `MOCK_AI=true`, backend membalas skenario "normal" sebagai default, bukan error — mode mock tidak boleh mem-block demo hanya karena ID yang diketik berbeda.

## 3.6 Fallback & Error Handling

### 3.6.1 Fallback Per-Agent

Jika Agent 1 atau Agent 2 gagal merespons / gagal menghasilkan JSON valid, orchestrator **tidak langsung** menjatuhkan seluruh transaksi ke fallback global:

* Perlakukan agent yang gagal sebagai **skor konservatif 30** (risiko menengah, bukan 0), `detail: "Agent gagal merespons format valid — dibutuhkan verifikasi manual untuk komponen ini."`
* Teruskan skor konservatif ini ke Agent 3 seperti biasa, supaya `total_risk_score` tetap terhitung dan keputusan tetap konsisten dengan Fail-Safe Principle (§3.1.8).

### 3.6.2 Fallback Global

Jika **seluruh pipeline** gagal (Agent 3 sendiri gagal parsing, atau error sistem di luar kendali agent), backend mengembalikan JSON statis berikut, bukan crash atau HTML error:

```json
{
  "transaction_id": "[transaction_id asli jika diketahui, kalau tidak: UNKNOWN]",
  "status": "frozen",
  "risk_score": 100,
  "action_taken": "System Error - Manual Audit Required",
  "forensic_report": [
    {
      "agent": "System Watchdog",
      "detail": "AI Agent gagal merespons format yang benar. Transaksi dibekukan sementara demi keamanan."
    }
  ]
}
```

## 3.7 Contoh End-to-End

**Input RAB + Harga Pasar (Agent 1):**
* Laptop: pengajuan 25.000.000, pasar 18.000.000 → markup 38,89% → 30 poin
* Printer: pengajuan 8.000.000, pasar 3.500.000 → markup 128,57% → 50 poin
* Skor Agent 1 final = **50** (item berisiko tertinggi), `detail` menyebut kedua item.

**Input Profil Vendor (Agent 2),** `reference_date = 2026-09-21`:
* `establishment_date = 2026-08-15` → age_days = 37 hari → **30** poin.

**Output Agent 3:**
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
`80 ≥ 60` → `status: "frozen"` — konsisten dengan §3.4.

## 3.8 Catatan Implementasi

* **Temperature:** `0` di semua panggilan.
* **Injeksi tanggal:** `reference_date` selalu dihitung di server, tidak pernah diminta ke model.
* **Passthrough `transaction_id`:** sertakan di payload ketiga agent, dan sebagai `original_transaction_id` terpisah di payload Agent 3 sebagai pengaman ganda.
* **Validasi sebelum parsing:** validasi tiap output agent dengan Pydantic sebelum diteruskan ke agent berikutnya; gagal validasi → jalankan §3.6.1.
* **Logging:** simpan seluruh input/output mentah tiap transaksi ke `audit_logs` (lihat `5_DATABASE_SCHEMA.md`) — jejak audit sistem anti-korupsi ini sendiri harus tidak bisa dimanipulasi.
