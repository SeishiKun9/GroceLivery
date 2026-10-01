require('dotenv').config();

const express = require('express');
const path = require('path');

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, mode: process.env.PAYMONGO_SECRET_KEY ? 'live' : 'demo' });
});

app.get('/api/config', (_req, res) => {
  res.json({
    paymongoEnabled: Boolean(process.env.PAYMONGO_SECRET_KEY),
    mode: process.env.PAYMONGO_SECRET_KEY ? 'live' : 'demo'
  });
});

app.post('/api/webhook', (req, res) => {
  res.json({ received: true, payload: req.body || {} });
});

app.post('/api/payments/create-intent', async (req, res) => {
  const { amount, items = [], email, name, phone, address } = req.body || {};

  if (!amount || Number(amount) <= 0) {
    return res.status(400).json({ message: 'A valid payment amount is required.' });
  }

  if (!name || !email || !phone || !address) {
    return res.status(400).json({ message: 'Full name, email, phone, and address are required.' });
  }

  const normalizedAmount = Math.round(Number(amount));

  if (!process.env.PAYMONGO_SECRET_KEY) {
    return res.json({
      success: true,
      mode: 'demo',
      paymentId: `demo_${Date.now()}`,
      amount: normalizedAmount,
      status: 'Paid',
      redirectUrl: '/orders.html',
      message: 'Demo mode active. Add PAYMONGO_SECRET_KEY to use the live PayMongo test API.'
    });
  }

  try {
    const response = await fetch('https://api.paymongo.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${process.env.PAYMONGO_SECRET_KEY}:`).toString('base64')}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        data: {
          attributes: {
            amount: normalizedAmount,
            currency: 'PHP',
            payment_method_allowed: ['card'],
            capture_type: 'manual',
            description: `GroceLiver order for ${name}`,
            statement_descriptor: 'GroceLiver',
            metadata: {
              customerName: name,
              email,
              phone,
              address,
              items: JSON.stringify(items)
            }
          }
        }
      })
    });

    const payload = await response.json();

    if (!response.ok) {
      const errorMessage = payload?.errors?.[0]?.detail || 'PayMongo payment request failed.';
      return res.status(400).json({ message: errorMessage });
    }

    const paymentIntent = payload.data;

    return res.json({
      success: true,
      mode: 'live',
      paymentId: paymentIntent.id,
      amount: normalizedAmount,
      status: paymentIntent.attributes?.status || 'pending',
      redirectUrl: '/orders.html',
      message: 'Payment intent created successfully.'
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || 'Unable to connect to PayMongo at the moment.'
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
