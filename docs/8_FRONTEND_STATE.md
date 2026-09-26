# 8. Frontend State — Dashboard LegacyLens (Opsional)

Bagian ini hanya relevan **jika** kalian memutuskan membangun dashboard ringan (lihat `6_UI_UX_SPEC.md`). Kalau tidak, file ini boleh diabaikan.

## 8.1 Prinsip
Dashboard bersifat **statis dan read-only** — tidak ada backend, tidak ada database, tidak ada API call ke Bob. Semua data berasal dari **satu file** `impact_report.md` yang di-generate Bob, di-parse di sisi client.

## 8.2 State Utama (kalau pakai React/Next.js)
```ts
type ImpactRow = {
  file: string;
  changeType: string;
  reason: string;
};

type RippleRow = {
  file: string;
  connectedVia: string;
  riskLevel: "Tinggi" | "Sedang" | "Rendah";
};

type TestResult = {
  testName: string;
  status: "Lolos" | "Gagal";
  note: string;
};

type ReportState = {
  summary: {
    filesAnalyzed: number;
    filesChanged: number;
    filesImpacted: number;
    finalStatus: "Aman" | "Perlu review" | "Ada bug";
  };
  changes: ImpactRow[];
  rippleMap: RippleRow[];
  testResults: TestResult[];
  rootCauseTrace: string | null;
  recommendations: string[];
};
```

## 8.3 Alur Load Data
1. File `impact_report.md` diimpor secara statis saat build (bukan fetch runtime — tidak ada backend).
2. Di-parse jadi struktur `ReportState` di atas (parsing sederhana berbasis heading markdown, karena struktur `impact_report.md` sudah konsisten sesuai `7_OUTPUT_SPEC.md`).
3. State ini dipakai untuk render 3 halaman (overview, impact map, full report) sesuai `6_UI_UX_SPEC.md`.

## 8.4 Komponen React (kalau dipakai)
- `<SummaryCards state={summary} />`
- `<ImpactGraph rows={rippleMap} />`
- `<TestResultTable rows={testResults} />`
- `<MarkdownRenderer content={rawReportMarkdown} />`

## 8.5 Catatan
Jangan habiskan waktu berlebihan di bagian ini — dashboard hanya nilai tambah presentasi. Prioritas utama tetap di kualitas prompt dan hasil analisis Bob (`3_PROMPTS.md`, `4_BOB_CONFIG.md`).