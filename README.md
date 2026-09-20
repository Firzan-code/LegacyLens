# sdg16-sentinel
Hackathon Duo

# 🛡️ SDG-16 Sentinel
> **Autonomous Public & Enterprise Integrity Engine** 
> *A 48-Hour Hackathon Proof of Concept for [Nama Hackathon]*

![SDG 16](https://img.shields.io/badge/SDG-16%20Peace%2C%20Justice%20%26%20Strong%20Institutions-00689D?style=for-the-badge)
![AI Framework](https://img.shields.io/badge/AI%20Framework-IBM%20Bob%202.0-blue?style=for-the-badge)

## 📌 Executive Summary
**SDG-16 Sentinel** adalah inisiatif mesin kecerdasan buatan berbasis *Multi-Agent Framework* (IBM Bob 2.0) yang berfungsi sebagai penjaga transparansi dan risiko otomatis (*Autonomous Transparency & Risk Guardian*). 

Proyek ini menargetkan **SDG 16 (Target 16.5 & 16.6)** untuk mengurangi korupsi, penyuapan, dan membangun lembaga yang transparan. Sistem ini mengubah paradigma pengawasan dari "audit pasca-kejadian" menjadi "pencegahan real-time" dengan mendeteksi, mengaudit, dan membekukan indikasi korupsi atau manipulasi data sebelum dana dicairkan.

## ✨ Key Features
- **Real-Time Automated Audit:** Membaca dan menganalisis Rencana Anggaran Biaya (RAB) serta profil vendor dalam hitungan detik.
- **Smart Red Flag Detection:** Mendeteksi *markup* harga tidak wajar, proyek fiktif, dan *splitting project*.
- **Autonomous Circuit Breaker:** Membekukan transaksi/pencairan dana secara otomatis jika *Risk Score* melampaui batas aman.
- **Immutable Forensic Report:** Menghasilkan laporan audit digital berbasis bukti dari hasil analisis AI.

## 🤖 The Watchdog Network (IBM Bob 2.0 Architecture)
Sistem ini ditenagai oleh jaringan agen independen yang saling berkomunikasi:

1. **🕵️ The Analyst (Procurement & Document Auditor)**
   Menemukan anomali pada dokumen penawaran, *markup* harga, dan menganalisis rekam jejak vendor.
2. **📈 The Accountant (Financial Flow & Pattern Monitor)**
   Memantau alur dana secara real-time dan mendeteksi anomali transfer (seperti *smurfing* atau ketidaksesuaian nominal RAB).
3. **💻 The Cyber Forensic (System & Code Integrity Watchdog) - *Roadmap***
   Memantau log dan basis data dari upaya manipulasi data atau injeksi *backdoor* oleh pihak internal.
4. **⚖️ The Chief Agent (Lead Investigator & Circuit Breaker)**
   Mengumpulkan temuan agen lain, mengkalkulasi *Risk Score*, dan mengeksekusi pembekuan pencairan dana secara otonom.

## 🛠️ Tech Stack
- **AI & Logic:** IBM Bob 2.0 Framework, Python / Node.js
- **Frontend / Dashboard:** Next.js, Tailwind CSS
- **Database / Backend:** Supabase / MongoDB (MERN Stack)
- **Integration:** REST API

## 🚀 How to Run (Local Development)

### Prerequisites
- Node.js & npm/yarn
- Python 3.x
- Kunci API IBM Bob 2.0 (dan/atau OpenAI/LLM yang digunakan)

### Setup Instructions
1. **Clone the repository**
   ```bash
   git clone [https://github.com/username/sdg-16-sentinel.git](https://github.com/username/sdg-16-sentinel.git)
   cd sdg-16-sentinel
