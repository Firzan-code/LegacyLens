# 3. Daftar Prompt untuk Bob IDE — LegacyLens

Jalankan prompt-prompt ini **berurutan** di Bob IDE, satu per satu (jangan digabung jadi satu prompt raksasa — hasilnya lebih akurat kalau Bob fokus satu tugas per giliran).

---

## Langkah 0 — Inisialisasi konteks proyek
```
/init
```
Ini akan membuat `AGENTS.md` otomatis berisi ringkasan struktur & konteks proyek, supaya Bob "ingat" konteks ini di semua percakapan/mode berikutnya.

---

## Fase 1 — Understand & Modernize
*(Mode: Legacy Analyst — lihat setup di `4_BOB_CONFIG.md`)*

**Prompt 1.1 — Pemahaman kode**
```
Analisis seluruh codebase ini. Jelaskan dalam bahasa yang mudah dipahami:
1. Apa fungsi utama aplikasi ini
2. Bagaimana alur data antar modul/file utama
3. Bagian kode mana yang paling berisiko tinggi (kompleks, jarang disentuh,
   atau bergantung pada dependency versi lama)
Jangan ubah kode apa pun dulu di langkah ini, cukup analisis dan jelaskan.
```

**Prompt 1.2 — Rencana modernisasi**
```
Berdasarkan analisis sebelumnya, buatkan rencana modernisasi bertahap:
- Dependency mana yang versinya usang dan perlu di-upgrade (sebutkan versi target)
- Pattern kode usang mana yang sebaiknya di-refactor ke best practice saat ini
- Urutkan berdasarkan prioritas risiko (mana yang paling penting diperbaiki duluan)
Sajikan sebagai checklist bernomor, jangan eksekusi dulu.
```

**Prompt 1.3 — Eksekusi (setelah developer approve)**
```
Eksekusi item nomor [X] dari rencana modernisasi di atas. Lakukan perubahan
minimal yang diperlukan, jangan ubah bagian lain yang tidak relevan.
Setelah selesai, ringkas apa saja yang diubah dan di file mana.
```
*(Ulangi prompt 1.3 untuk tiap item checklist, satu per satu.)*

---

## Fase 2 — Predict & Catch Cascading Bugs
*(Mode: Ripple Tracer — subagent terpisah)*

**Prompt 2.1 — Pemetaan dampak**
```
File [nama file] baru saja diubah pada langkah modernisasi sebelumnya.
Gunakan konteks seluruh repository untuk menelusuri: file, fungsi, atau modul
apa saja yang memanggil atau bergantung pada kode yang diubah di file ini.
Buat daftar "impact map" lengkap dengan alasan kenapa tiap file itu berisiko
terdampak (misal: memanggil fungsi yang signature-nya berubah).
```

**Prompt 2.2 — Validasi otomatis**
```
Jalankan seluruh test suite yang tersedia di project ini. Jika ada test yang
gagal, jangan langsung perbaiki dulu — laporkan dulu test mana yang gagal
dan pesan errornya.
```

**Prompt 2.3 — Trace root cause lintas file (kalau ada bug)**
```
Test [nama test] gagal dengan error berikut: [tempel pesan error].
Telusuri root cause-nya menggunakan konteks seluruh repository — jangan
cuma lihat file tempat error muncul, tapi telusuri balik ke file mana yang
menyebabkan perubahan behavior ini. Jelaskan rantai sebab-akibatnya
(file A mengubah X → dipakai file B → menyebabkan Y di file C).
```

**Prompt 2.4 — Generate laporan akhir**
```
Buatkan "Modernization Impact Report" dalam format Markdown, mencakup:
1. Ringkasan perubahan yang dilakukan (dari Fase 1)
2. Impact map lengkap (dari prompt 2.1)
3. Hasil validasi test — mana yang lolos, mana yang sempat gagal dan sudah
   diperbaiki, beserta root cause-nya
4. Rekomendasi langkah selanjutnya (misal: bagian mana yang masih perlu
   direview manual oleh manusia)
Simpan sebagai file impact_report.md di root project.
```

---

## Tips Efisiensi Bobcoin
- Jalankan Prompt 1.1 dan 1.2 dalam mode **Ask** dulu (bukan Agent) — supaya tidak boros Bobcoin sebelum rencana disetujui.
- Baru pindah ke **Agent mode** di Prompt 1.3 dan seterusnya, setelah rencana fix.
- Screenshot task session summary setelah tiap fase selesai (bukan tiap prompt) untuk `bob_sessions/`, biar tidak kebanyakan file tapi tetap representatif.