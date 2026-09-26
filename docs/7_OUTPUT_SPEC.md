# 7. Spesifikasi Output — Modernization Impact Report

Dokumen ini mendefinisikan struktur `impact_report.md` yang dihasilkan Bob di Prompt 2.4 (`3_PROMPTS.md`), supaya hasilnya konsisten dan gampang dirender ke dashboard (`6_UI_UX_SPEC.md`).

## 7.1 Struktur Wajib

```markdown
# Modernization Impact Report

## Ringkasan Eksekutif
- Jumlah file dianalisis: N
- Jumlah file diubah: N
- Jumlah file terdampak (ripple): N
- Status akhir: ✅ Aman / ⚠️ Perlu review / ❌ Ada bug belum terselesaikan

## 1. Perubahan yang Dilakukan
| File | Perubahan | Alasan |
|---|---|---|
| ... | ... | ... |

## 2. Impact Map
| File Terdampak | Terhubung via | Level Risiko |
|---|---|---|
| ... | ... | Tinggi/Sedang/Rendah |

## 3. Hasil Validasi Test
| Test | Status | Catatan |
|---|---|---|
| ... | Lolos/Gagal | ... |

## 4. Root Cause Trace (jika ada bug)
Rantai sebab-akibat: File A → File B → File C
Penjelasan naratif singkat.

## 5. Rekomendasi Lanjutan
- Bagian yang masih perlu direview manusia
- Langkah modernisasi berikutnya yang belum dikerjakan (kalau ada)
```

## 7.2 Level Risiko — Definisi
- **Tinggi** — file terdampak langsung memanggil fungsi/behavior yang berubah, tanpa lapisan abstraksi di antaranya.
- **Sedang** — file terdampak secara tidak langsung (lewat file perantara).
- **Rendah** — file terdampak hanya di level konfigurasi/tipe, tidak mempengaruhi logika eksekusi.

## 7.3 Penamaan File
- Report utama: `impact_report.md`, disimpan di root sample project.
- Jika ada beberapa iterasi (misal demo dijalankan beberapa kali untuk latihan), simpan versi dengan suffix timestamp: `impact_report_YYYYMMDD_HHMM.md`, tapi cukup satu yang final dipakai saat submission.