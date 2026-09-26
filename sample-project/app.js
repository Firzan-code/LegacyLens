/**
 * app.js
 *
 * Entry point — Express server sederhana yang meng-expose endpoint
 * untuk checkout, invoice, dan report.
 *
 * MODERNIZED: Route handler diubah ke async/await sesuai modul yang
 * kini semuanya mengembalikan Promise.
 */

const express = require('express');
const { processCheckout } = require('./checkout');
const { createInvoice } = require('./invoice');
const { generateDiscountReport } = require('./report');

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// --- Endpoint Checkout ---
// POST /checkout
// Body: { price, quantity, discountRate }
app.post('/checkout', async (req, res) => {
  try {
    const result = await processCheckout(req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- Endpoint Invoice ---
// POST /invoice
// Body: { customerId, customerName, amount, discountRate }
app.post('/invoice', async (req, res) => {
  try {
    const invoice = await createInvoice(req.body);
    res.json(invoice);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// --- Endpoint Report ---
// POST /report
// Body: { transactions: [{ amount, rate }, ...] }
app.post('/report', async (req, res) => {
  try {
    const summary = await generateDiscountReport(req.body.transactions);
    res.json(summary);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(PORT, function () {
  console.log('Server berjalan di http://localhost:' + PORT);
});

module.exports = app;
