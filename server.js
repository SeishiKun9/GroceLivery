require('dotenv').config();

const express = require('express');
const path = require('path');
const xendit = require('./lib/xendit');

const app = express();
const port = Number(process.env.PORT || 3000);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', xendit.health);
app.get('/api/config', xendit.config);
app.post('/api/payments/create-session', xendit.createSession);
app.post('/api/payments/verify-session', xendit.verifySession);

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
