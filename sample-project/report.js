/**
 * report.js
 *
 * Modul laporan penjualan — mengagregasi data transaksi dan menghitung
 * total diskon yang diberikan dalam satu periode.
 *
 * Memanggil calculateDiscount() dari utils/pricing.js.
 *
 * MODERNIZED: Callback hell (rekursi processNext) diganti dengan
 * Promise.all + async/await, sesuai signature baru calculateDiscount().
 */

const { calculateDiscount } = require('./utils/pricing');

/**
 * Hitung ringkasan diskon dari array transaksi.
 *
 * @param {Array}    transactions           - Array data transaksi
 * @param {number}   transactions[].amount  - Nilai transaksi
 * @param {number}   transactions[].rate    - Rate diskon
 * @returns {Promise<{totalOriginal, totalDiscounted, totalSaved, count}>}
 */
async function generateDiscountReport(transactions) {
  if (!transactions || transactions.length === 0) {
    return { totalOriginal: 0, totalDiscounted: 0, totalSaved: 0, count: 0 };
  }

  // Semua kalkulasi dijalankan paralel, bukan serial satu per satu
  const results = await Promise.all(
    transactions.map(tx => calculateDiscount(tx.amount, tx.rate))
  );

  const summary = results.reduce(
    (acc, r) => {
      acc.totalOriginal += r.original;
      acc.totalDiscounted += r.discounted;
      acc.totalSaved += r.savedAmount;
      return acc;
    },
    { totalOriginal: 0, totalDiscounted: 0, totalSaved: 0, count: results.length }
  );

  return summary;
}

module.exports = { generateDiscountReport };
