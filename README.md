# GroceLivery

Responsive grocery delivery storefront based on the GroceLiver project proposal.

## Run locally

From the project folder:

```bash
npm install
npm start
```

Then open:

```text
http://localhost:3000
```

To enable live PayMongo requests, copy `.env.example` to `.env` and add your secret key:

```bash
copy .env.example .env
```

Then update:

```env
PAYMONGO_SECRET_KEY=your_secret_key_here
```

## Files

- `index.html` - storefront landing page
- `login.html` - sign up and login screens
- `products.html` - grocery catalog and filters
- `cart.html` - cart summary and quantity controls
- `checkout.html` - customer checkout and PayMongo test flow
- `orders.html` - order history
- `styles.css` - minimal grocery storefront styling
- `script.js` - app logic, validation, cart, checkout, and order management
- `server.js` - static site server and PayMongo-ready API endpoint

## Notes

The app is built around the proposal's core customer journey: secure sign-up, grocery browsing, cart updates, order history, and checkout with a PayMongo-ready payment intent flow in demo mode by default. Product and category photos are stored locally in `assets/images`; image credits and licenses are listed in `assets/images/ATTRIBUTION.md`.
