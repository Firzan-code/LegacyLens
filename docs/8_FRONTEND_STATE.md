# 8. Frontend State

## 8.1 State Machine

```
        ┌───────┐  submit form / pilih skenario   ┌──────────┐
        │ IDLE  │ ───────────────────────────────► │ LOADING  │
        └───────┘                                  └────┬─────┘
            ▲                                            │
            │                                 response 200│
            │                          ┌────────────────┬─┴─────────────┐
            │                          ▼                 ▼              ▼
      reset/baru   ┌────────────┐  ┌────────────┐  ┌────────────┐
            │       │ APPROVED   │  │ FROZEN     │  │ ERROR      │
            └───────┤ (hijau)    │  │ (merah)    │  │ (422/500/  │
                     └────────────┘  └────────────┘  │ network)   │
                                                       └────────────┘
```

Direpresentasikan sebagai satu `type ResultState` di frontend, bukan beberapa boolean lepas (`isLoading`, `isError`, dst.) — supaya tidak ada kombinasi state yang seharusnya mustahil (mis. `isLoading=true` dan `isError=true` bersamaan).

```ts
type ResultState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "approved"; data: AnalyzeResponse }
  | { status: "frozen"; data: AnalyzeResponse }
  | { status: "error"; kind: "validation" | "server" | "network"; message: string };
```

## 8.2 Pemetaan State → UI

| State | `TransactionForm` | `CircuitBreakerPanel` | `ForensicReport` |
|---|---|---|---|
| `idle` | Aktif, tombol submit enabled | Netral (abu-abu), belum ada skor | Tersembunyi |
| `loading` | Tombol submit disabled + spinner, seluruh field readonly | Menampilkan indikator "Menganalisis..." | Tersembunyi |
| `approved` | Aktif kembali | Hijau, `action_taken` & `risk_score` tampil | Tampil (bisa kosong dengan pesan "Tidak ada temuan risiko") |
| `frozen` | Aktif kembali | Merah, `action_taken` & `risk_score` tampil, sedikit animasi masuk | Tampil, terurut sesuai array `forensic_report` |
| `error` (validation) | Aktif, pesan merah di field terkait dari `detail[].loc` | Tidak berubah dari state sebelumnya | Tidak berubah |
| `error` (server/network) | Aktif | Tetap merah dengan pesan generik "Sistem gagal memproses — coba lagi" **jika** body error mengikuti skema fallback (`action_taken: "System Error..."`); tampilkan itu apa adanya, jangan disamarkan | Tampil bila body error menyertakan `forensic_report` (lihat `4_API_SPEC.md` §Fallback Global) |

## 8.3 Transisi yang Perlu Ditangani Eksplisit

* **Submit ganda.** Tombol submit **wajib** disabled selama `loading` — tanpa ini, klik ganda saat demo (grogi di depan juri) bisa mengirim dua request untuk `transaction_id` yang sama.
* **Ganti skenario saat hasil sebelumnya masih tampil.** Memilih skenario lain dari dropdown mereset state ke `idle` dan mengosongkan `CircuitBreakerPanel`/`ForensicReport` — jangan biarkan hasil lama nyangkut di layar saat form sudah berubah, itu paling sering bikin juri bingung "ini hasil yang mana."
* **Baris di `TransactionTable` diklik.** Memuat ulang `ForensicReport` dari data yang sudah ada di state (bukan submit ulang ke backend) — masuk ke state `approved`/`frozen` sesuai data baris tersebut.
* **Response sukses tapi bentuknya tidak sesuai skema** (mis. field hilang karena bug backend). Frontend memvalidasi bentuk response minimal (`status`, `risk_score` ada) sebelum render; jika tidak sesuai, masuk ke `error` state dengan pesan "Format respons tidak dikenali" — jangan biarkan halaman crash blank karena `undefined.map()`.

## 8.4 Pesan Toast/Notifikasi

| Kejadian | Pesan |
|---|---|
| Network error (tidak ada koneksi ke backend) | "Tidak bisa terhubung ke server. Periksa koneksi dan coba lagi." |
| Timeout | "Analisis memakan waktu lebih lama dari biasanya. Mencoba lagi..." |
| `422` | Tidak pakai toast — tampilkan inline di field terkait |
| Berhasil (`approved` atau `frozen`) | Tidak pakai toast — hasil sudah cukup jelas dari `CircuitBreakerPanel`, toast tambahan hanya bikin ramai |

## 8.5 Mode Mock di Frontend

Frontend tidak tahu dan tidak perlu tahu apakah backend sedang mock atau live — bentuk response identik (lihat `4_API_SPEC.md` §4.3). Satu-satunya indikator visual adalah `MockModeBadge` di header yang membaca `GET /health`, murni untuk kepentingan tim sendiri saat gladi bersih, bukan bagian dari alur state di atas.
