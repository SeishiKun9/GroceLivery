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

To enable Xendit hosted checkout, copy `.env.example` to `.env` and add your Xendit secret key:

```bash
copy .env.example .env
```

Then update:

```env
XENDIT_SECRET_KEY=your_xendit_secret_key_here
APP_BASE_URL=https://your-public-https-domain.example
```

`APP_BASE_URL` must be a public HTTPS URL for Xendit's checkout return links. Without `XENDIT_SECRET_KEY`, checkout creates clearly labeled demo orders and does not take payment. Live orders remain pending until the server verifies the Xendit session.

## Files

- `index.html` - storefront landing page
- `login.html` - sign up and login screens
- `products.html` - grocery catalog and filters
- `cart.html` - cart summary and quantity controls
- `checkout.html` - customer checkout and Xendit hosted payment flow
- `orders.html` - order history
- `styles.css` - minimal grocery storefront styling
- `script.js` - app logic, validation, cart, checkout, and order management
- `server.js` - static site server and Xendit payment session/verification API

## Notes

The app is built around the proposal's core customer journey: secure sign-up, grocery browsing, cart updates, order history, and Xendit hosted checkout. Product and category photos are stored locally in `assets/images`; image credits and licenses are listed in `assets/images/ATTRIBUTION.md`.
