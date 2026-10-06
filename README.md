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

To enable Xendit hosted checkout locally:

1. In the Xendit Dashboard, copy a **development/test secret key** from the API keys section. Do not use a publishable key.
2. Copy `.env.example` to `.env` in the project folder.
3. Replace the example value in `.env` with your secret key:

   ```env
   XENDIT_SECRET_KEY=your_development_secret_key
   ```

4. Start (or restart) the server:

   ```bash
   npm start
   ```

5. Open `http://localhost:3000`, add an item to your cart, and continue through checkout. The server creates a hosted Xendit checkout session and redirects the browser to the `payment_link_url` returned by Xendit.

You can confirm the server loaded the key by opening `http://localhost:3000/api/config`; it should report `"mode":"live"` and `"xenditEnabled":true`. This endpoint does not reveal the key.

Keep `.env` private; it is ignored by Git. Never commit or share the secret key. Development keys create test payments and do not charge real money. For production, configure the production secret key as a server environment variable on your public HTTPS host (do not put it in browser code); checkout must be opened from that same HTTPS storefront so payment returns work. Without `XENDIT_SECRET_KEY`, checkout creates clearly labeled demo orders and does not take payment. Live orders remain pending until the server verifies the Xendit session.

## Files

- `index.html` - storefront landing page
- `login.html` - customer login
- `signup.html` - customer registration
- `products.html` - grocery catalog and filters
- `cart.html` - cart summary and quantity controls
- `checkout.html` - customer checkout and Xendit hosted payment flow
- `orders.html` - order history and delivery tracking preview
- `styles.css` - minimal grocery storefront styling
- `script.js` - app logic, validation, cart, checkout, and order management
- `server.js` - static site server and Xendit payment session/verification API

## Notes

The app is built around the proposal's core customer journey: secure sign-up, grocery browsing, cart updates, order history, and Xendit hosted checkout. Product and category photos are stored locally in `assets/images`; image credits and licenses are listed in `assets/images/ATTRIBUTION.md`.

Confirmed and demo orders show a delivery preview with the assigned driver, Ace Arcamo, and a Yadea G5 electric motorcycle. The map is illustrative only; live GPS tracking and delivery status updates are not connected.
