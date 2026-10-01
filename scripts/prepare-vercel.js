const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const publicDir = path.join(root, 'public');
const pages = [
  'index.html',
  'products.html',
  'cart.html',
  'checkout.html',
  'orders.html',
  'login.html',
  'signup.html'
];

fs.mkdirSync(publicDir, { recursive: true });

for (const file of [...pages, 'script.js', 'styles.css']) {
  fs.copyFileSync(path.join(root, file), path.join(publicDir, file));
}

fs.cpSync(path.join(root, 'assets'), path.join(publicDir, 'assets'), { recursive: true });