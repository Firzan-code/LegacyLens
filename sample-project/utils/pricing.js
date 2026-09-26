/**
 * utils/pricing.js
 *
 * Utility fungsi kalkulasi harga — dipakai oleh checkout.js, invoice.js,
 * dan report.js.
 *
 * MODERNIZED: Diubah dari callback pattern ke async/await.
 * Signature lama : calculateDiscount(price, rate, callback)
 * Signature baru : async calculateDiscount(price, rate)  → returns result object
 */

const moment = require('moment');

/**
 * Hitung harga setelah diskon.
 *
 * @param {number} price - Harga asli (satuan Rupiah)
 * @param {number} rate  - Persentase diskon (0–100)
 * @returns {Promise<{original, rate, discounted, savedAmount, calculatedAt}>}
 * @throws {Error} jika price atau rate tidak valid
 */
async function calculateDiscount(price, rate) {
  if (typeof price !== 'number' || price < 0) {
    throw new Error('Harga tidak valid: ' + price);
  }
  if (typeof rate !== 'number' || rate < 0 || rate > 100) {
    throw new Error('Rate diskon tidak valid: ' + rate);
  }

  const discounted = price - (price * rate) / 100;
  const calculatedAt = moment().format('DD/MM/YYYY HH:mm:ss');

  return {
    original: price,
    rate: rate,
    discounted: discounted,
    savedAmount: price - discounted,
    calculatedAt: calculatedAt
  };
}

module.exports = { calculateDiscount };
