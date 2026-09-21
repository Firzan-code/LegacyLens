# 2. Architecture

## 2.1 Alur End-to-End

```
1. User (PPK/Auditor) mengisi form di dashboard Next.js
   atau menekan tombol "Load Skenario 1/2/3" (lihat 6_UI_UX_SPEC.md)
                    │
                    ▼
2. Frontend → POST /api/analyze-transaction  (satu-satunya panggilan ke backend)
                    │
                    ▼
3. FastAPI menerima payload, validasi Pydantic
   ├─ Gagal validasi → 422, tidak lanjut ke AI
   └─ Lolos → lanjut ke langkah 4
                    │
                    ▼
4. Orchestrator (kode Python, BUKAN LLM) menyiapkan:
   - payload Agent 1: items + market_reference + transaction_id
   - payload Agent 2: vendor profile + reference_date (dihitung server, WIB)
     + transaction_id
                    │
        ┌───────────┴───────────┐
        ▼                       ▼
5a. Agent 1 (The Analyst)   5b. Agent 2 (The Accountant)
    dipanggil PARALEL           dipanggil PARALEL
    (asyncio.gather)             (asyncio.gather)
        │                       │
        └───────────┬───────────┘
                     ▼
6. Validasi JSON tiap balasan agent
   ├─ Valid       → teruskan skor & detail apa adanya
   └─ Invalid/gagal → skor konservatif 30 (lihat 3_PROMPTS.md §Fallback)
                     │
                     ▼
7. Agent 3 (The Chief) menerima kedua hasil + original_transaction_id
   → total_risk_score, status, forensic_report
                     │
                     ▼
8. Simpan ke Supabase:
   - transactions  (header + skor + status)
   - rab_items     (item + markup per item)
   - audit_logs    (input & output mentah tiap agent, append-only)
                     │
                     ▼
9. Backend balas JSON ke frontend
                     │
                     ▼
10. Frontend render: badge status, panel Circuit Breaker, forensic report
```

## 2.2 Komponen

| Komponen | Tanggung jawab | Tidak boleh |
|---|---|---|
| **Frontend (Next.js)** | Form input, render hasil, tombol skenario demo | Memanggil IBM Bob / Supabase langsung, menghitung skor |
| **Backend (FastAPI)** | Validasi, orkestrasi agent, hitung total skor final, persistensi | Mengirim HTML, meloloskan data tidak lengkap sebagai "aman" |
| **IBM Bob 2.0** | Menjalankan 3 agent (prompt di `3_PROMPTS.md`) | — |
| **Supabase** | Simpan transaksi & audit log | Diakses dari luar backend |

## 2.3 Mengapa Agent 1 & 2 Paralel, Agent 3 Berurutan

Agent 1 dan Agent 2 tidak saling bergantung — keduanya bisa dipanggil bersamaan dengan `asyncio.gather` untuk memangkas latensi hampir setengahnya. Agent 3 **wajib** menunggu keduanya selesai karena keputusannya adalah fungsi dari kedua skor tersebut.

```python
analyst_result, accountant_result = await asyncio.gather(
    call_analyst(payload_1),
    call_accountant(payload_2),
)
chief_result = await call_chief(analyst_result, accountant_result, transaction_id)
```

## 2.4 Non-Functional Requirements

| Aspek | Target | Catatan |
|---|---|---|
| Timeout per panggilan agent | 8 detik | Lewat batas → diperlakukan sebagai kegagalan, masuk fallback §3_PROMPTS.md |
| Retry | 1× per agent, tanpa backoff panjang | Demo tidak boleh menggantung lama |
| Konsistensi | `temperature = 0` di semua panggilan | Input sama harus hasil sama, termasuk saat direplay untuk juri |
| Availability saat demo | Mode mock sebagai jalur cadangan | Lihat `MOCK_AI=true` di `AGENT.md` §4 |
| Audit trail | Setiap request tersimpan, tidak bisa diubah/dihapus | `audit_logs` append-only, lihat `5_DATABASE_SCHEMA.md` |

## 2.5 Kontrak "Siapa Boleh Melakukan Apa"

Diambil dari `AGENT.md` §3 — diulang di sini karena ini keputusan arsitektural, bukan sekadar preferensi gaya kode:

1. Frontend tidak pernah menyimpan atau mengirim API key IBM Bob / Supabase.
2. Frontend tidak menghitung `risk_score` — hanya menampilkan angka dari backend.
3. Backend adalah satu-satunya pihak yang menyuntikkan `reference_date` — agent tidak pernah menebak tanggal hari ini.
4. Kegagalan di titik manapun berujung ke status yang **lebih aman** (`frozen`), tidak pernah diam-diam menjadi `approved`.
