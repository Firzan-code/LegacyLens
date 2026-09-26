/**
 * tests/checkout.test.js
 *
 * Test suite untuk modul checkout.js SAJA.
 *
 * SENGAJA TIDAK MENGETES invoice.js dan report.js.
 * Ini adalah celah yang disiapkan untuk demo LegacyLens:
 * ketika calculateDiscount() di utils/pricing.js diubah signature-nya,
 * test ini akan tetap hijau, tapi invoice.js akan diam-diam rusak
 * — tidak ada yang menangkap efek sampingnya.
 *
 * MODERNIZED: Diubah dari done-callback pattern ke async/await,
 * sesuai signature baru processCheckout() yang kini mengembalikan Promise.
 */

const { processCheckout } = require('../checkout');

describe('processCheckout', () => {
  test('menghitung grand total dengan diskon 10%', async () => {
    const order = { price: 100000, quantity: 2, discountRate: 10 };
    const result = await processCheckout(order);

    // subtotal = 100000 * 2 = 200000
    // diskon 10% = 20000
    // grandTotal = 180000
    expect(result.subtotal).toBe(200000);
    expect(result.discountAmount).toBe(20000);
    expect(result.grandTotal).toBe(180000);
    expect(result.status).toBe('pending_payment');
  });

  test('menghitung grand total tanpa diskon (rate 0)', async () => {
    const order = { price: 50000, quantity: 1, discountRate: 0 };
    const result = await processCheckout(order);

    expect(result.grandTotal).toBe(50000);
    expect(result.discountAmount).toBe(0);
  });

  test('menghitung grand total dengan diskon 100%', async () => {
    const order = { price: 75000, quantity: 4, discountRate: 100 };
    const result = await processCheckout(order);

    expect(result.grandTotal).toBe(0);
  });

  test('melempar error jika harga negatif', async () => {
    const order = { price: -10000, quantity: 1, discountRate: 10 };

    await expect(processCheckout(order)).rejects.toThrow('Harga tidak valid');
  });

  test('melempar error jika rate melebihi 100', async () => {
    const order = { price: 50000, quantity: 1, discountRate: 150 };

    await expect(processCheckout(order)).rejects.toThrow('Rate diskon tidak valid');
  });
});

/*
 * TIDAK ADA test untuk invoice.js dan report.js di sini.
 *
 * Ini adalah blind spot yang disengaja:
 * - createInvoice()          → tidak ditest
 * - generateDiscountReport() → tidak ditest
 *
 * invoice.js mengandung bug 'missing await' yang membuat semua nilai
 * rupiah di invoice menjadi undefined — tidak ada test yang menangkap ini.
 */
