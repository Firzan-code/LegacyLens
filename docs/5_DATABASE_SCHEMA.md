# 5. Database Schema — Supabase (PostgreSQL)

Diakses **hanya dari backend** memakai *service role key*. Tidak ada tabel yang diekspos ke *anon key* / frontend.

## 5.1 ERD (ringkas)

```
vendors 1───* transactions 1───* rab_items
                    │
                    └────1───* audit_logs
```

## 5.2 `vendors`

| Kolom | Tipe | Constraint | Catatan |
|---|---|---|---|
| `id` | `uuid` | PK, `default gen_random_uuid()` | |
| `vendor_name` | `text` | not null | |
| `npwp` | `text` | nullable | Belum divalidasi formatnya di PoC |
| `establishment_date` | `date` | nullable | Nullable **disengaja** — hilangnya data ini adalah sinyal risiko, bukan galat input |
| `created_at` | `timestamptz` | `default now()` | |

## 5.3 `transactions`

| Kolom | Tipe | Constraint | Catatan |
|---|---|---|---|
| `id` | `uuid` | PK, `default gen_random_uuid()` | |
| `transaction_id` | `text` | unique, not null | ID bisnis dari request, bukan PK internal |
| `vendor_id` | `uuid` | FK → `vendors.id` | |
| `status` | `text` | not null, `check (status in ('approved','frozen'))` | |
| `risk_score` | `int` | not null, `check (risk_score between 0 and 100)` | |
| `action_taken` | `text` | not null | |
| `analyst_score` | `int` | nullable | Disimpan terpisah untuk keperluan analitik/dashboard rekap |
| `accountant_score` | `int` | nullable | |
| `mock_mode` | `boolean` | `default false` | Menandai apakah hasil ini dari mode mock — penting supaya data demo tidak tercampur data "asli" saat rekap |
| `created_at` | `timestamptz` | `default now()` | |

## 5.4 `rab_items`

| Kolom | Tipe | Constraint | Catatan |
|---|---|---|---|
| `id` | `uuid` | PK, `default gen_random_uuid()` | |
| `transaction_id` | `uuid` | FK → `transactions.id` | |
| `item_name` | `text` | not null | |
| `quantity` | `int` | not null | |
| `submitted_unit_price` | `numeric` | not null | |
| `market_unit_price` | `numeric` | nullable | Null jika tidak ditemukan di `market_reference` saat request |
| `markup_percent` | `numeric` | nullable | Null jika `market_unit_price` null — **jangan** default ke 0, itu menyembunyikan bahwa item ini tidak terverifikasi |

## 5.5 `audit_logs`

| Kolom | Tipe | Constraint | Catatan |
|---|---|---|---|
| `id` | `uuid` | PK, `default gen_random_uuid()` | |
| `transaction_id` | `uuid` | FK → `transactions.id` | |
| `agent` | `text` | not null | `The Analyst` / `The Accountant` / `The Chief` / `System Watchdog` |
| `raw_request` | `jsonb` | not null | Payload persis yang dikirim ke agent |
| `raw_response` | `jsonb` | not null | Balasan mentah agent — **sebelum** divalidasi Pydantic, untuk debug jika parsing gagal |
| `is_fallback` | `boolean` | `default false` | `true` jika ini hasil fallback (§3.6 di `3_PROMPTS.md`), bukan balasan asli agent |
| `created_at` | `timestamptz` | `default now()` | |

**`audit_logs` bersifat append-only** — tidak ada `UPDATE` atau `DELETE` yang diizinkan lewat aplikasi. Ini konsisten dengan klaim di README bahwa jejak audit sistem anti-korupsi ini sendiri tidak boleh bisa dimanipulasi.

## 5.6 Row Level Security (RLS)

RLS **aktif** di semua tabel. Karena akses hanya lewat backend dengan *service role key* (yang melewati RLS), kebijakan di bawah ini adalah jaring pengaman kedua bila suatu saat ada key lain yang bocor atau ditambahkan:

```sql
alter table vendors enable row level security;
alter table transactions enable row level security;
alter table rab_items enable row level security;
alter table audit_logs enable row level security;

-- Tidak ada policy SELECT/INSERT/UPDATE/DELETE untuk role `anon` atau `authenticated`.
-- Default Postgres: tanpa policy = akses ditolak untuk role selain service_role.
```

Jika roadmap menambah autentikasi pengguna (lihat `README.md` §Roadmap), tambahkan policy `SELECT` khusus role `authenticated` dengan filter kepemilikan/peran — jangan buka akses penuh.

## 5.7 Index yang Disarankan

```sql
create index idx_transactions_transaction_id on transactions (transaction_id);
create index idx_transactions_status on transactions (status);
create index idx_rab_items_transaction_id on rab_items (transaction_id);
create index idx_audit_logs_transaction_id on audit_logs (transaction_id);
```

Untuk skala PoC (puluhan-ratusan transaksi demo) index ini tidak kritikal, tapi mencegah *full table scan* jadi kebiasaan buruk sejak awal — murah untuk ditambahkan sekarang, mahal untuk diingat nanti.

## 5.8 Migrasi

Simpan SQL di `backend/migrations/`, dijalankan manual lewat Supabase SQL Editor untuk PoC (tidak perlu tooling migrasi seperti Alembic untuk 48 jam). Urutan file: `001_vendors.sql`, `002_transactions.sql`, `003_rab_items.sql`, `004_audit_logs.sql`, `005_rls.sql`, `006_indexes.sql`.
