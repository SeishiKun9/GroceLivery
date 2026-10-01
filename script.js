const STORAGE_KEYS = {
  users: 'groceliver_users',
  session: 'groceliver_session',
  cart: 'groceliver_cart',
  orders: 'groceliver_orders'
};

const products = [
  {
    id: 1,
    name: 'Organic Banana Bundle',
    brand: 'Farm Fresh',
    category: 'Fruits',
    price: 129,
    score: 'A',
    description: 'Naturally ripened bananas packed for daily snacking.'
  },
  {
    id: 2,
    name: 'Brown Rice 5kg',
    brand: 'Healthy Grain',
    category: 'Pantry',
    price: 260,
    score: 'B',
    description: 'Nutritious whole grain rice for family meals and meal prep.'
  },
  {
    id: 3,
    name: 'Free Range Eggs',
    brand: 'Country Hen',
    category: 'Dairy',
    price: 165,
    score: 'A',
    description: 'Fresh eggs from free-range hens with dependable quality.'
  },
  {
    id: 4,
    name: 'Coconut Water',
    brand: 'Pure Sip',
    category: 'Beverages',
    price: 110,
    score: 'A',
    description: 'Refreshing hydration with a clean, natural coconut taste.'
  },
  {
    id: 5,
    name: 'Tomato Salsa Mix',
    brand: 'Garden Blend',
    category: 'Cooking',
    price: 148,
    score: 'B',
    description: 'A versatile salsa mix for quick home cooking and meal prep.'
  },
  {
    id: 6,
    name: 'Almond Milk',
    brand: 'Plant Good',
    category: 'Beverages',
    price: 135,
    score: 'A',
    description: 'Creamy, dairy-free milk perfect for smoothies and cereals.'
  },
  {
    id: 7,
    name: 'Fresh Spinach',
    brand: 'Leafy Harvest',
    category: 'Vegetables',
    price: 95,
    score: 'A',
    description: 'Tender greens rich in nutrients and ready for salads or cooking.'
  },
  {
    id: 8,
    name: 'Whole Wheat Bread',
    brand: 'Morning Loaf',
    category: 'Bakery',
    price: 120,
    score: 'A',
    description: 'Soft whole wheat bread baked fresh for daily breakfasts.'
  }
];

const productImages = {
  1: 'assets/images/banana.jpg',
  2: 'assets/images/pantry-rice.jpg',
  3: 'assets/images/dairy-eggs.jpg',
  4: 'assets/images/coconut-water.jpg',
  5: 'assets/images/produce.jpg',
  6: 'assets/images/almond-milk.jpg',
  7: 'assets/images/spinach.jpg',
  8: 'assets/images/bakery.jpg'
};

const features = [
  {
    icon: '🔐',
    title: 'Secure login',
    text: 'Validated account registration, protected passwords, and signed-in access to storefront screens.'
  },
  {
    icon: '🛒',
    title: 'Product browsing',
    text: 'Customers can search and filter grocery items while scanning clear pricing and product details.'
  },
  {
    icon: '💳',
    title: 'PayMongo checkout',
    text: 'The app includes a realistic payment experience in test mode and order status updates.'
  },
  {
    icon: '⚠️',
    title: 'Clear feedback',
    text: 'Errors and loading states are handled with simple messaging to keep the user informed.'
  }
];

function getUsers() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.users) || '[]');
}

function saveUsers(users) {
  localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(users));
}

function getSession() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.session) || 'null');
}

function setSession(user) {
  localStorage.setItem(STORAGE_KEYS.session, JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem(STORAGE_KEYS.session);
}

function getCart() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.cart) || '[]');
}

function saveCart(cart) {
  localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cart));
}

function getOrders() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.orders) || '[]');
}

function saveOrders(orders) {
  localStorage.setItem(STORAGE_KEYS.orders, JSON.stringify(orders));
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-PH', {
    style: 'currency',
    currency: 'PHP',
    maximumFractionDigits: 0
  }).format(value);
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

function validatePhone(phone) {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 15;
}

function validatePassword(password) {
  return password.length >= 6;
}

function setFormMessage(element, message, variant = 'error') {
  if (!element) return;
  element.textContent = message;
  element.className = `form-message ${variant}`;
}

function clearFormMessage(element) {
  if (!element) return;
  element.textContent = '';
  element.className = 'form-message';
}

function getCurrentUserName() {
  const user = getSession();
  return user ? user.name.split(' ')[0] : 'Guest';
}

function ensureAuth() {
  if (!getSession()) {
    window.location.href = 'login.html';
  }
}

function updateHeaderState() {
  const loginLink = document.getElementById('login-link');
  const session = getSession();

  if (loginLink) {
    if (session) {
      loginLink.textContent = `Hi, ${getCurrentUserName()}`;
      loginLink.href = 'orders.html';
    } else {
      loginLink.textContent = 'Login';
      loginLink.href = 'login.html';
    }
  }
}

function renderFeatureCards() {
  const target = document.getElementById('feature-grid');
  if (!target) return;

  target.innerHTML = features
    .map(
      (feature) => `
        <article class="feature-card">
          <div class="feature-icon" aria-hidden="true">${feature.icon}</div>
          <h3>${feature.title}</h3>
          <p>${feature.text}</p>
        </article>
      `
    )
    .join('');
}

function renderHomeProducts() {
  const target = document.getElementById('home-products');
  if (!target) return;

  target.innerHTML = products.slice(0, 4).map((product) => `
    <article class="home-product">
      <a class="home-product-image" href="products.html" aria-label="Shop ${product.name}">
        <img src="${productImages[product.id]}" alt="${product.name}" loading="lazy" />
      </a>
      <div class="home-product-details">
        <p class="home-product-category">${product.category}</p>
        <h3><a href="products.html">${product.name}</a></h3>
        <div class="home-product-bottom">
          <strong>${formatCurrency(product.price)}</strong>
          <button class="home-add-button" type="button" data-product-id="${product.id}" aria-label="Add ${product.name} to cart">Add <span aria-hidden="true">+</span></button>
        </div>
      </div>
    </article>
  `).join('');

  target.querySelectorAll('[data-product-id]').forEach((button) => {
    button.addEventListener('click', () => addToCart(Number(button.dataset.productId)));
  });
}

function addToCart(productId) {
  const cart = getCart();
  const existing = cart.find((item) => item.id === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }

  saveCart(cart);
  updateCartCounter();
  showToast('Added to cart');
}

function updateCartCounter() {
  const counter = document.getElementById('cart-count');
  const cart = getCart();
  const total = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (counter) {
    counter.textContent = total;
  }
}

function renderProductCatalog() {
  const catalogRoot = document.getElementById('product-grid');
  const searchInput = document.getElementById('product-search');
  const categorySelect = document.getElementById('category-filter');

  if (!catalogRoot) return;

  let filtered = [...products];

  if (searchInput) {
    const searchTerm = searchInput.value.trim().toLowerCase();
    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm) ||
          product.brand.toLowerCase().includes(searchTerm)
      );
    }
  }

  if (categorySelect && categorySelect.value !== 'all') {
    filtered = filtered.filter((product) => product.category === categorySelect.value);
  }

  if (!filtered.length) {
    catalogRoot.innerHTML = `
      <div class="cart-empty" style="grid-column: 1 / -1;">
        <h3>No products found</h3>
        <p>Try another search or category to see more items.</p>
      </div>
    `;
    return;
  }

  catalogRoot.innerHTML = filtered
    .map(
      (product) => `
        <article class="product-card">
          <img class="product-card-image" src="${productImages[product.id]}" alt="${product.name}" loading="lazy" />
          <div>
            <div class="product-meta">
              <span>${product.category}</span>
              <span>Nutri-Score ${product.score}</span>
            </div>
            <h3>${product.name}</h3>
            <p>${product.description}</p>
          </div>
          <div class="product-meta">
            <span class="product-price">${formatCurrency(product.price)}</span>
            <span>${product.brand}</span>
          </div>
          <button class="product-btn" data-product-id="${product.id}">Add to cart</button>
        </article>
      `
    )
    .join('');

  catalogRoot.querySelectorAll('[data-product-id]').forEach((button) => {
    button.addEventListener('click', () => addToCart(Number(button.dataset.productId)));
  });
}

function renderCartPage() {
  const cartRoot = document.getElementById('cart-items');
  const cartSummary = document.getElementById('cart-summary');
  const cart = getCart();

  if (!cartRoot || !cartSummary) return;

  if (!cart.length) {
    cartRoot.innerHTML = `
      <div class="cart-empty">
        <h3>Your cart is empty</h3>
        <p>Add grocery items from the store to begin checkout.</p>
        <a class="button button-primary" href="products.html">Browse products</a>
      </div>
    `;
    cartSummary.innerHTML = `
      <div class="summary-card">
        <h3>Order summary</h3>
        <div class="summary-row"><span>Subtotal</span><strong>${formatCurrency(0)}</strong></div>
        <div class="summary-row"><span>Delivery</span><strong>${formatCurrency(0)}</strong></div>
        <div class="summary-row total-row"><span>Total</span><strong>${formatCurrency(0)}</strong></div>
      </div>
    `;
    return;
  }

  const items = cart
    .map((item) => {
      const product = products.find((p) => p.id === item.id);
      return { ...product, quantity: item.quantity };
    })
    .filter(Boolean);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = subtotal > 0 ? 45 : 0;
  const total = subtotal + delivery;

  cartRoot.innerHTML = `
    <table class="cart-table">
      <thead>
        <tr>
          <th>Item</th>
          <th>Price</th>
          <th>Qty</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        ${items
          .map(
            (item) => `
              <tr>
                <td>
                  <div class="cart-item-details">
                    <img class="cart-item-image" src="${productImages[item.id]}" alt="" loading="lazy" />
                    <div><strong>${item.name}</strong><br /><span class="muted-text">${item.brand}</span></div>
                  </div>
                </td>
                <td>${formatCurrency(item.price)}</td>
                <td>
                  <div class="quantity-box">
                    <button class="qty-btn" data-action="decrease" data-product-id="${item.id}">−</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" data-action="increase" data-product-id="${item.id}">+</button>
                  </div>
                </td>
                <td>${formatCurrency(item.price * item.quantity)}</td>
              </tr>
            `
          )
          .join('')}
      </tbody>
    </table>
  `;

  cartSummary.innerHTML = `
    <div class="summary-card">
      <h3>Order summary</h3>
      <div class="summary-row"><span>Subtotal</span><strong>${formatCurrency(subtotal)}</strong></div>
      <div class="summary-row"><span>Delivery</span><strong>${formatCurrency(delivery)}</strong></div>
      <div class="summary-row total-row"><span>Total</span><strong>${formatCurrency(total)}</strong></div>
      <div class="form-actions" style="margin-top: 1rem; justify-content: flex-start;">
        <a class="button button-primary" href="checkout.html">Proceed to checkout</a>
      </div>
    </div>
  `;

  cartRoot.querySelectorAll('[data-action]').forEach((button) => {
    button.addEventListener('click', () => {
      const productId = Number(button.dataset.productId);
      const action = button.dataset.action;
      updateCartQuantity(productId, action === 'increase' ? 1 : -1);
    });
  });
}

function updateCartQuantity(productId, change) {
  const cart = getCart();
  const index = cart.findIndex((item) => item.id === productId);

  if (index === -1) return;

  cart[index].quantity += change;

  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }

  saveCart(cart);
  updateCartCounter();
  renderCartPage();
}

function renderCheckoutPage() {
  const form = document.getElementById('checkout-form');
  const summary = document.getElementById('checkout-summary');
  const cart = getCart();
  const user = getSession();
  const nameInput = document.getElementById('checkout-name');
  const emailInput = document.getElementById('checkout-email');
  const phoneInput = document.getElementById('checkout-phone');
  const addressInput = document.getElementById('checkout-address');
  const messageNode = document.getElementById('checkout-message');

  if (!form || !summary) return;

  if (user) {
    if (nameInput) nameInput.value = user.name || '';
    if (emailInput) emailInput.value = user.email || '';
    if (phoneInput) phoneInput.value = user.phone || '';
    if (addressInput) addressInput.value = user.address || '';
  }

  if (!cart.length) {
    summary.innerHTML = `
      <div class="summary-card">
        <h3>Checkout summary</h3>
        <p>Your cart is empty. Add items before checking out.</p>
      </div>
    `;
    return;
  }

  const items = cart
    .map((item) => {
      const product = products.find((p) => p.id === item.id);
      return { ...product, quantity: item.quantity };
    })
    .filter(Boolean);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const delivery = 45;
  const total = subtotal + delivery;

  summary.innerHTML = `
    <div class="summary-card">
      <h3>Checkout summary</h3>
      ${items
        .map(
          (item) => `
            <div class="summary-row">
              <span>${item.name} × ${item.quantity}</span>
              <strong>${formatCurrency(item.price * item.quantity)}</strong>
            </div>
          `
        )
        .join('')}
      <div class="summary-row"><span>Delivery</span><strong>${formatCurrency(delivery)}</strong></div>
      <div class="summary-row total-row"><span>Total</span><strong>${formatCurrency(total)}</strong></div>
    </div>
  `;

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    if (!nameInput || !emailInput || !phoneInput || !addressInput) return;

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const phone = phoneInput.value.trim();
    const address = addressInput.value.trim();

    if (!name || !email || !phone || !address) {
      setFormMessage(messageNode, 'Please complete all checkout fields.', 'error');
      showToast('Please complete all checkout fields.');
      return;
    }

    if (!validateEmail(email)) {
      setFormMessage(messageNode, 'Please use a valid email address for your order.', 'error');
      showToast('Please use a valid email address for your order.');
      return;
    }

    if (!validatePhone(phone)) {
      setFormMessage(messageNode, 'Please enter a valid contact number.', 'error');
      showToast('Please enter a valid contact number.');
      return;
    }

    if (address.length < 8) {
      setFormMessage(messageNode, 'Your delivery address should be at least 8 characters long.', 'error');
      showToast('Your delivery address should be at least 8 characters long.');
      return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Processing...';
    }

    clearFormMessage(messageNode);

    fetch('/api/payments/create-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: Math.round(total * 100),
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price
        })),
        name,
        email,
        phone,
        address
      })
    })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.message || 'Payment could not be processed.');
        }

        const order = {
          id: `GL-${Date.now()}`,
          customer: name,
          email,
          total,
          status: 'Paid',
          createdAt: new Date().toISOString(),
          paymentId: data.paymentId || `demo_${Date.now()}`,
          paymentMethod: 'PayMongo Test',
          items: items.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price
          }))
        };

        const orders = getOrders();
        orders.unshift(order);
        saveOrders(orders);
        saveCart([]);
        updateCartCounter();

        setFormMessage(messageNode, data.message || 'Payment complete.', 'success');
        showToast(data.message || 'Payment complete.');
        window.location.href = 'orders.html';
      })
      .catch((error) => {
        if (submitButton) {
          submitButton.disabled = false;
          submitButton.textContent = 'Pay now';
        }
        setFormMessage(messageNode, error.message || 'Payment could not be processed.', 'error');
        showToast(error.message || 'Payment could not be processed.');
      });
  });
}

function renderOrdersPage() {
  const ordersRoot = document.getElementById('orders-list');
  if (!ordersRoot) return;

  const orders = getOrders();

  if (!orders.length) {
    ordersRoot.innerHTML = `
      <div class="orders-empty">
        <h3>No orders yet</h3>
        <p>Your paid grocery orders will appear here after checkout.</p>
      </div>
    `;
    return;
  }

  ordersRoot.innerHTML = orders
    .map(
      (order) => `
        <article class="order-card">
          <div>
            <strong>${order.id}</strong>
            <div class="order-meta">${new Date(order.createdAt).toLocaleString()}</div>
            <div class="order-meta">${order.items.map((item) => `${item.name} × ${item.quantity}`).join(', ')}</div>
          </div>
          <div>
            <span class="status-badge ${order.status === 'Paid' ? 'status-paid' : 'status-pending'}">${order.status}</span>
            <div class="order-meta" style="margin-top: 0.5rem; text-align: right;">${formatCurrency(order.total)}</div>
          </div>
        </article>
      `
    )
    .join('');
}

function handleAuthForms() {
  const registerForm = document.getElementById('register-form');
  const loginForm = document.getElementById('login-form');
  const logoutButton = document.getElementById('logout-button');

  if (registerForm) {
    registerForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(registerForm);
      const name = String(formData.get('name') || '').trim();
      const email = String(formData.get('email') || '').trim();
      const password = String(formData.get('password') || '');
      const phone = String(formData.get('phone') || '').trim();
      const address = String(formData.get('address') || '').trim();
      const messageNode = document.getElementById('register-message');

      if (!name || !email || !password || !phone || !address) {
        setFormMessage(messageNode, 'Please complete all required fields.', 'error');
        showToast('Please complete all fields.');
        return;
      }

      if (!validateEmail(email)) {
        setFormMessage(messageNode, 'Please enter a valid email address.', 'error');
        showToast('Please enter a valid email address.');
        return;
      }

      if (!validatePassword(password)) {
        setFormMessage(messageNode, 'Password must be at least 6 characters long.', 'error');
        showToast('Password must be at least 6 characters long.');
        return;
      }

      if (!validatePhone(phone)) {
        setFormMessage(messageNode, 'Please enter a valid phone number.', 'error');
        showToast('Please enter a valid phone number.');
        return;
      }

      if (address.length < 8) {
        setFormMessage(messageNode, 'Address should be at least 8 characters long.', 'error');
        showToast('Address should be at least 8 characters long.');
        return;
      }

      const users = getUsers();
      if (users.some((user) => user.email.toLowerCase() === email.toLowerCase())) {
        setFormMessage(messageNode, 'An account with this email already exists.', 'error');
        showToast('An account with this email already exists.');
        return;
      }

      const newUser = { name, email, password, phone, address };
      users.push(newUser);
      saveUsers(users);
      setSession({ name, email, phone, address });
      setFormMessage(messageNode, 'Account created successfully.', 'success');
      showToast('Account created successfully.');
      window.location.href = 'products.html';
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const formData = new FormData(loginForm);
      const email = String(formData.get('email') || '').trim();
      const password = String(formData.get('password') || '');
      const messageNode = document.getElementById('login-message');

      if (!email || !password) {
        setFormMessage(messageNode, 'Email and password are required.', 'error');
        showToast('Email and password are required.');
        return;
      }

      if (!validateEmail(email)) {
        setFormMessage(messageNode, 'Please enter a valid email address.', 'error');
        showToast('Please enter a valid email address.');
        return;
      }

      const user = getUsers().find(
        (item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password
      );

      if (!user) {
        setFormMessage(messageNode, 'Invalid email or password.', 'error');
        showToast('Invalid email or password.');
        return;
      }

      setSession({ name: user.name, email: user.email, phone: user.phone, address: user.address });
      setFormMessage(messageNode, 'Login successful.', 'success');
      showToast('Login successful');
      window.location.href = 'products.html';
    });
  }

  if (logoutButton) {
    logoutButton.addEventListener('click', () => {
      clearSession();
      showToast('You have been logged out.');
      window.location.href = 'login.html';
    });
  }
}

function initCatalogInteractions() {
  const searchInput = document.getElementById('product-search');
  const categorySelect = document.getElementById('category-filter');

  if (searchInput) {
    searchInput.addEventListener('input', renderProductCatalog);
  }

  if (categorySelect) {
    categorySelect.addEventListener('change', renderProductCatalog);
  }
}

function init() {
  updateHeaderState();
  renderFeatureCards();
  renderHomeProducts();

  const path = window.location.pathname.split('/').pop();

  if (path === 'products.html') {
    ensureAuth();
    initCatalogInteractions();
    renderProductCatalog();
  }

  if (path === 'cart.html') {
    ensureAuth();
    renderCartPage();
  }

  if (path === 'checkout.html') {
    ensureAuth();
    renderCheckoutPage();
  }

  if (path === 'orders.html') {
    ensureAuth();
    renderOrdersPage();
  }

  if (path === 'login.html' || path === 'index.html' || path === '') {
    handleAuthForms();
  }

  const year = document.getElementById('year');
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  updateCartCounter();
}

document.addEventListener('DOMContentLoaded', init);
