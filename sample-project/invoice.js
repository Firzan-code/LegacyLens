/**
 * invoice.js
 *
 * Modul pembuatan invoice — menghasilkan ringkasan tagihan resmi
 * yang dikirimkan ke pelanggan.
 *
 * Memanggil calculateDiscount() dari utils/pricing.js.
 *
 * ⚠️  BUG TERSEMBUNYI (sengaja untuk demo LegacyLens):
 * Fungsi ini BELUM sepenuhnya dimigrasi ke signature baru.
 * calculateDiscount() kini mengembalikan Promise (async), tapi baris
 * pemanggilan di bawah LUPA memakai 'await' — sehingga 'result' berisi
 * objek Promise, bukan data hasil kalkulasi.
 *
 * Akibatnya:
 *   - result.discounted === undefined  → totalDue: undefined
 *   - result.original   === undefined  → lineItems amount: undefined
 *   - invoice terlihat dibuat tanpa error/exception, tapi semua nilai
 *     rupiah adalah undefined — bug silent yang tidak melempar exception.
 *
 * Test yang ada (checkout.test.js) TIDAK mengetes modul ini,
 * sehingga bug ini tidak terdeteksi oleh CI.
 */

const { calculateDiscount } = require('./utils/pricing');

/**
 * Buat invoice untuk satu transaksi.
 *
 * @param {Object} transaction                - Data transaksi
 * @param {string} transaction.customerId     - ID pelanggan
 * @param {string} transaction.customerName   - Nama pelanggan
 * @param {number} transaction.amount         - Nilai transaksi (sebelum diskon)
 * @param {number} transaction.discountRate   - Persentase diskon
 * @returns {Promise<Object>} invoice
 */
async function createInvoice(transaction) {
  // BUG: 'await' hilang — calculateDiscount() mengembalikan Promise,
  // tapi hasil Promise tidak pernah di-resolve di sini.
  // 'result' adalah objek Promise, bukan { original, discounted, ... }.
  const result = calculateDiscount(transaction.amount, transaction.discountRate); // ← MISSING await

  const invoice = {
    invoiceId: 'INV-' + transaction.customerId + '-' + Date.now(),
    customerName: transaction.customerName,
    lineItems: [
      {
        description: 'Subtotal',
        amount: result.original           // undefined — Promise tidak punya .original
      },
      {
        description: 'Diskon (' + result.rate + '%)',
        amount: -result.savedAmount       // NaN — undefined diabaikan operator minus
      }
    ],
    totalDue: result.discounted,          // undefined — bug silent
    issuedAt: result.calculatedAt,        // undefined
    dueDate: '30 hari dari tanggal penerbitan'
  };

  return invoice;
}

module.exports = { createInvoice };
