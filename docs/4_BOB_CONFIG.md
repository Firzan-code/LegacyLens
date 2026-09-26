# 4. Konfigurasi Bob — LegacyLens

Dokumen ini berisi setup **custom modes**, **subagents**, dan **custom rules** yang perlu dikonfigurasi di Bob IDE sebelum menjalankan prompt di `3_PROMPTS.md`.

## 4.1 Custom Mode: "Legacy Analyst"
Dipakai untuk Fase 1 (pemahaman & rencana modernisasi).

**Role definition:**
```
Kamu adalah Legacy Code Analyst. Tugasmu adalah membaca dan menjelaskan
kode lama dengan bahasa yang mudah dipahami developer yang baru pertama
kali melihat codebase ini. Kamu TIDAK melakukan perubahan kode kecuali
diminta eksplisit dan sudah melalui tahap rencana yang disetujui.
Prioritaskan kejelasan penjelasan di atas kelengkapan teknis berlebihan.
```

**Tool access:** Read-only (file read, search, terminal read-only untuk cek versi dependency). Write access dimatikan di mode ini supaya tidak ada perubahan tak sengaja saat masih tahap analisis.

## 4.2 Custom Mode: "Ripple Tracer"
Dipakai untuk Fase 2 (pemetaan dampak & validasi).

**Role definition:**
```
Kamu adalah Ripple Impact Tracer. Tugasmu adalah menelusuri dampak dari
sebuah perubahan kode ke seluruh bagian repository yang terhubung,
menjalankan validasi test, dan jika ada kegagalan, melacak akar
penyebabnya lintas file — bukan hanya melihat titik error muncul.
Selalu tunjukkan rantai sebab-akibat secara eksplisit (file → dependensi →
dampak), jangan hanya menyimpulkan tanpa jejak.
```

**Tool access:** Full (read, write, execute) — perlu menjalankan test suite dan bisa membaca semua file terkait.

## 4.3 Subagent Terpisah (opsional, kalau ingin lebih granular)
Selain dua custom mode di atas, buat satu **subagent** khusus untuk tugas isolasi:
- **`dependency-checker` subagent** — dipanggil di tengah Fase 1 untuk mengecek versi dependency saat ini vs versi terbaru yang stabil, tanpa mencemari context window percakapan utama. Hasilnya dikembalikan sebagai ringkasan singkat ke mode utama.

Ini yang perlu ditunjukkan ke juri sebagai bukti pemakaian fitur **subagents** — bukan cuma custom mode biasa.

## 4.4 Custom Rules (project-level)
Simpan di root project sebagai file rules Bob:
```
- Selalu jelaskan alasan di balik setiap rekomendasi, jangan hanya
  memberi instruksi tanpa konteks.
- Jangan pernah menghapus test yang sudah ada, hanya boleh menambah.
- Setiap perubahan kode harus disertai ringkasan singkat (apa yang
  diubah, kenapa, dan file apa saja yang terdampak).
- Gunakan Bahasa Indonesia untuk semua penjelasan yang ditujukan ke
  developer, kecuali nama variabel/fungsi/kode tetap dalam Bahasa Inggris.
```

## 4.5 MCP Server (opsional)
Jika sempat, tambahkan MCP server untuk GitHub agar Bob bisa langsung membuat pull request berisi hasil modernisasi + impact report sebagai deskripsi PR — menunjukkan fitur MCP server yang jadi salah satu poin plus di penilaian.

## 4.6 Urutan Setup di Bob IDE
1. Buka Settings → pastikan instance `ibm-coding-challenge-uat` (region: us-east) aktif.
2. Buat custom mode "Legacy Analyst" (4.1).
3. Buat custom mode "Ripple Tracer" (4.2).
4. (Opsional) buat subagent `dependency-checker` (4.3).
5. Tambahkan custom rules project-level (4.4).
6. Jalankan `/init` di root sample codebase untuk generate `AGENTS.md`.