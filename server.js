require('dotenv').config();

const express = require('express');
const path = require('path');
const { randomUUID } = require('crypto');

const app = express();
const port = Number(process.env.PORT || 3000);
const deliveryFee = 45;
const products = new Map([
  [1, { name: 'Organic Banana Bundle', category: 'Fruits', price: 129 }],
  [2, { name: 'Brown Rice 5kg', category: 'Pantry', price: 260 }],
  [3, { name: 'Free Range Eggs', category: 'Dairy', price: 165 }],
  [4, { name: 'Coconut Water', category: 'Beverages', price: 110 }],
  [5, { name: 'Tomato Salsa Mix', category: 'Cooking', price: 148 }],
  [6, { name: 'Almond Milk', category: 'Beverages', price: 135 }],
  [7, { name: 'Fresh Spinach', category: 'Vegetables', price: 95 }],
  [8, { name: 'Whole Wheat Bread', category: 'Bakery', price: 120 }]
]);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, provider: 'xendit', mode: process.env.XENDIT_SECRET_KEY ? 'live' : 'demo' });
});

app.get('/api/config', (_req, res) => {
  res.json({
    xenditEnabled: Boolean(process.env.XENDIT_SECRET_KEY),
    mode: process.env.XENDIT_SECRET_KEY ? 'live' : 'demo'
  });
});

app.post('/api/payments/create-session', async (req, res) => {
  const { items, email, name, phone, address } = req.body || {};

  if (!name || !email || !phone || !address || !Array.isArray(items) || !items.length) {
    return res.status(400).json({ message: 'Full name, email, phone, and address are required.' });
  }

  const normalizedEmail = String(email).trim();
  const normalizedName = String(name).trim();
  const normalizedPhone = String(phone).trim();
  const normalizedAddress = String(address).trim();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(normalizedEmail)) {
    return res.status(400).json({ message: 'A valid email address is required.' });
  }

  if (normalizedName.length > 120 || normalizedAddress.length < 8 || normalizedAddress.length > 300) {
    return res.status(400).json({ message: 'Please check the name and delivery address.' });
  }

  const phoneDigits = normalizedPhone.replace(/\D/g, '');
  if (phoneDigits.length < 10 || phoneDigits.length > 15) {
    return res.status(400).json({ message: 'A valid contact number is required.' });
  }

  if (items.length > 50) {
    return res.status(400).json({ message: 'Too many items in this order.' });
  }

  const validatedItems = [];
  for (const item of items) {
    const product = products.get(Number(item?.id));
    const quantity = Number(item?.quantity);

    if (!product || !Number.isSafeInteger(quantity) || quantity < 1 || quantity > 99) {
      return res.status(400).json({ message: 'The cart contains an invalid product or quantity.' });
    }

    validatedItems.push({ ...product, id: Number(item.id), quantity });
  }

  const subtotal = validatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const amount = subtotal + deliveryFee;
  const referenceId = `GL${Date.now().toString(36)}${randomUUID().replace(/-/g, '').slice(0, 12)}`;

  if (!process.env.XENDIT_SECRET_KEY) {
    return res.json({
      success: true,
      mode: 'demo',
      referenceId,
      amount,
      status: 'DEMO',
      message: 'Demo order created. Add XENDIT_SECRET_KEY to enable hosted Xendit checkout.'
    });
  }

  let returnUrl = null;
  try {
    const origin = req.get('origin');
    const appOrigin = new URL(origin || '');
    const localHttpOrigin = appOrigin.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(appOrigin.hostname);

    if ((!localHttpOrigin && appOrigin.protocol !== 'https:') || appOrigin.origin !== origin || appOrigin.host.toLowerCase() !== req.get('host')?.toLowerCase()) {
      return res.status(503).json({ message: 'Open checkout from localhost or the public HTTPS storefront to use Xendit.' });
    }

    if (appOrigin.protocol === 'https:') {
      returnUrl = new URL('/orders.html', appOrigin.origin);
      returnUrl.searchParams.set('reference_id', referenceId);
    }
  } catch {
    return res.status(503).json({ message: 'Open checkout from localhost or the public HTTPS storefront to use Xendit.' });
  }

  try {
    const sessionRequest = {
      reference_id: referenceId,
      session_type: 'PAY',
      mode: 'PAYMENT_LINK',
      amount,
      currency: 'PHP',
      country: 'PH',
      capture_method: 'AUTOMATIC',
      locale: 'en',
      description: `GroceLiver order for ${normalizedName}`,
      items: validatedItems.map((item) => ({
        reference_id: String(item.id),
        type: 'PHYSICAL_PRODUCT',
        name: item.name,
        category: item.category,
        net_unit_amount: item.price,
        quantity: item.quantity,
        currency: 'PHP'
      })),
      metadata: { order_reference: referenceId }
    };

    if (returnUrl) {
      sessionRequest.success_return_url = `${returnUrl.toString()}&payment=success`;
      sessionRequest.cancel_return_url = `${returnUrl.toString()}&payment=cancel`;
    }

    const response = await fetch('https://api.xendit.co/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${process.env.XENDIT_SECRET_KEY}:`).toString('base64')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(sessionRequest)
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMessage = payload?.message || payload?.errors?.[0]?.message || 'Xendit could not create a checkout session.';
      return res.status(502).json({ message: errorMessage });
    }

    if (!payload.payment_session_id || !payload.payment_link_url) {
      return res.status(502).json({ message: 'Xendit returned an incomplete checkout session.' });
    }

    return res.json({
      success: true,
      mode: 'live',
      referenceId,
      paymentSessionId: payload.payment_session_id,
      checkoutUrl: payload.payment_link_url,
      amount,
      status: payload.status || 'ACTIVE'
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || 'Unable to connect to Xendit at the moment.'
    });
  }
});

app.post('/api/payments/verify-session', async (req, res) => {
  const { paymentSessionId, referenceId } = req.body || {};

  if (!process.env.XENDIT_SECRET_KEY) {
    return res.status(503).json({ message: 'Xendit verification is unavailable in demo mode.' });
  }

  if (!/^ps-[a-zA-Z0-9-]{10,}$/.test(String(paymentSessionId || '')) || !referenceId) {
    return res.status(400).json({ message: 'A valid Xendit payment session and order reference are required.' });
  }

  try {
    const response = await fetch(`https://api.xendit.co/sessions/${encodeURIComponent(paymentSessionId)}`, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${process.env.XENDIT_SECRET_KEY}:`).toString('base64')}`
      }
    });
    const session = await response.json().catch(() => ({}));

    if (!response.ok) {
      return res.status(response.status === 404 ? 404 : 502).json({
        message: session?.message || 'Unable to verify the Xendit payment session.'
      });
    }

    if (session.reference_id !== referenceId) {
      return res.status(400).json({ message: 'The payment session does not match this order.' });
    }

    const paid = session.status === 'COMPLETED' && Boolean(session.payment_id || session.payment_request_id);
    return res.json({
      success: true,
      paid,
      status: paid ? 'Paid' : session.status,
      paymentId: session.payment_id || session.payment_request_id || null
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || 'Unable to verify the Xendit payment session.'
    });
  }
});

app.use(express.static(path.join(__dirname)));

app.get('*', (req, res) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ message: 'API route not found.' });
  }
  return res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`GroceLiver app running at http://localhost:${port}`);
});
