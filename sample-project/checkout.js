/**
 * checkout.js
 *
 * Modul proses checkout — menghitung total tagihan setelah diskon
 * lalu "mengirimkannya" ke payment gateway (disimulasikan).
 *
 * MODERNIZED: Diubah dari callback pattern ke async/await,
 * sesuai signature baru calculateDiscount(price, rate) di utils/pricing.js.
 */

const { calculateDiscount } = require('./utils/pricing');

/**
 * Proses checkout untuk satu item.
 *
 * @param {Object} order              - Data pesanan
 * @param {number} order.price        - Harga satuan
 * @param {number} order.quantity     - Jumlah unit
 * @param {number} order.discountRate - Persentase diskon (0–100)
 * @returns {Promise<Object>} checkoutResult
 */
async function processCheckout(order) {
  const total = order.price * order.quantity;
  const result = await calculateDiscount(total, order.discountRate);

  return {
    orderId: 'ORD-' + Date.now(),
    subtotal: total,
    discountRate: result.rate,
    discountAmount: result.savedAmount,
    grandTotal: result.discounted,
    status: 'pending_payment',
    processedAt: result.calculatedAt
  };
}

module.exports = { processCheckout };
