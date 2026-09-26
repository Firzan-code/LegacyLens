# 9. Skrip Demo — LegacyLens

Target durasi: **4–5 menit**. Asumsi juri belum tahu apa-apa soal project ini.

## 9.1 Opening (30 detik)
> "Setiap developer pernah ngerasain ini: buka codebase lama, nggak ngerti apa-apa, terus takut ubah apa pun karena nggak tau efek sampingnya ke bagian lain. Akhirnya technical debt numpuk terus — filosofinya 'kalau masih jalan, jangan disentuh'. LegacyLens dibangun buat mutusin masalah itu, pakai IBM Bob 2.0 sebagai otaknya."

## 9.2 Problem → Solution (30 detik)
> "LegacyLens kerja dalam dua fase. Fase pertama, Bob baca kode lama dan jelasin dalam bahasa manusia, plus nyusun rencana modernisasi. Fase kedua — ini bagian intinya — begitu perubahan diterapkan, Bob nelusurin SELURUH file yang terhubung ke kode yang berubah, prediksi dampaknya, dan kalau ada bug, dia lacak akar penyebabnya lintas file. Bukan cuma nunjukin di mana errornya muncul."

## 9.3 Live Demo (2.5–3 menit)
1. **Tunjukkan sample codebase** (`5_SAMPLE_CODEBASE.md`) sekilas — "ini project kecil yang sengaja punya fungsi yang dipanggil dari 3 tempat berbeda."
2. **Jalankan Fase 1 di Bob IDE** (custom mode Legacy Analyst) — tunjukkan hasil penjelasan kode + rencana modernisasi (bisa pre-run sebelumnya kalau khawatir waktu, tinggal tunjukkan hasilnya).
3. **Approve satu item modernisasi**, tunjukkan Bob eksekusi perubahan.
4. **Switch ke mode Ripple Tracer** — tunjukkan Bob memetakan file-file yang terdampak, termasuk 2 file yang "diam-diam" ikut terpengaruh.
5. **Tunjukkan hasil akhir**: `impact_report.md` (atau dashboard kalau sempat dibangun) — highlight bagian root cause trace.

## 9.4 Impact Statement (30 detik)
> "Tanpa LegacyLens, dua bug ini baru ketahuan setelah masuk production atau setelah user melapor. Dengan LegacyLens, ketahuan dalam hitungan menit, lengkap sama penjelasan kenapa itu terjadi — bukan cuma 'test gagal', tapi 'file A ubah X, dipakai file B, nyebabin Y di file C'."

## 9.5 Closing — Kenapa Ini "Core Bob" (30 detik)
> "Semua yang barusan kalian lihat — pemahaman kode, keputusan modernisasi, pemetaan dampak, sampai trace root cause — itu semua Bob, bukan sistem terpisah yang cuma manggil Bob dari luar. Kita manfaatin custom mode, subagent terpisah buat tracing, sama full repository context yang jadi kekuatan utama Bob 2.0."

## 9.6 Antisipasi Pertanyaan Juri
| Kemungkinan pertanyaan | Jawaban singkat |
|---|---|
| "Ini scalable ke codebase besar nggak?" | Konsepnya scalable karena Bob sendiri yang handle context lintas file; untuk codebase sangat besar, bisa dipecah per modul dengan subagent tambahan. |
| "Bedanya sama code review tool biasa?" | Code review tool biasa cuma nge-flag isu di file yang diubah; LegacyLens nelusurin dampak ke file LAIN yang bahkan nggak disentuh langsung. |
| "Kenapa nggak otomatis fix bug-nya juga?" | Sengaja tetap ada human-in-the-loop di keputusan modernisasi — biar developer tetap paham dan approve, bukan blind trust ke AI. |