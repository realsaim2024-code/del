// SoleSphere - Shopping Cart Module
const CART_STORAGE_KEY = 'solesphere_cart_v1';
const PROMO_STORAGE_KEY = 'solesphere_promo_v1';

let cart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
let appliedPromo = JSON.parse(localStorage.getItem(PROMO_STORAGE_KEY)) || null;

const VALID_PROMOS = {
  'KICKS20': { discount: 0.20, label: '20% OFF' },
  'FIRST10': { discount: 0.10, label: '10% OFF' },
  'FREESHIP': { discount: 0.0, freeShipping: true, label: 'Free Shipping' }
};

function saveCart() {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  if (appliedPromo) {
    localStorage.setItem(PROMO_STORAGE_KEY, JSON.stringify(appliedPromo));
  } else {
    localStorage.removeItem(PROMO_STORAGE_KEY);
  }
  updateCartBadge();
}

function updateCartBadge() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const badges = document.querySelectorAll('.cart-badge');
  badges.forEach(badge => {
    badge.textContent = count;
    if (count > 0) {
      badge.classList.remove('hidden');
      badge.classList.add('flex');
    } else {
      badge.classList.add('hidden');
      badge.classList.remove('flex');
    }
  });
}

function addToCart(productId, size, quantity = 1, colorName = null) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const chosenSize = size || (product.sizes && product.sizes.length ? product.sizes[0] : 9);
  const chosenColor = colorName || (product.colors && product.colors.length ? product.colors[0].name : 'Standard');

  // Check if item already exists with the same size and color
  const existingIndex = cart.findIndex(
    item => item.id === productId && item.size === chosenSize && item.color === chosenColor
  );

  if (existingIndex > -1) {
    cart[existingIndex].quantity += quantity;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      image: product.image,
      size: chosenSize,
      color: chosenColor,
      quantity: quantity
    });
  }

  saveCart();
  renderCartDrawer();
  openCartDrawer();
  showToast(`Added "${product.name}" (Size US ${chosenSize}) to cart!`, 'success');
}

function updateCartQuantity(index, delta) {
  if (index >= 0 && index < cart.length) {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
      const removedName = cart[index].name;
      cart.splice(index, 1);
      showToast(`Removed "${removedName}" from cart`, 'info');
    }
    saveCart();
    renderCartDrawer();
  }
}

function removeFromCart(index) {
  if (index >= 0 && index < cart.length) {
    const removedName = cart[index].name;
    cart.splice(index, 1);
    saveCart();
    renderCartDrawer();
    showToast(`Removed "${removedName}" from cart`, 'info');
  }
}

function clearCart() {
  cart = [];
  appliedPromo = null;
  saveCart();
  renderCartDrawer();
}

function calculateCartTotals() {
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const freeShippingThreshold = 100.00;
  
  let shippingCost = subtotal > 0 && subtotal < freeShippingThreshold ? 12.00 : 0.00;
  if (appliedPromo && appliedPromo.freeShipping) {
    shippingCost = 0.00;
  }

  let discountAmount = 0.00;
  if (appliedPromo && appliedPromo.discount) {
    discountAmount = subtotal * appliedPromo.discount;
  }

  const tax = (subtotal - discountAmount > 0) ? (subtotal - discountAmount) * 0.08 : 0.00;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingCost + tax);

  return {
    subtotal,
    shippingCost,
    freeShippingThreshold,
    discountAmount,
    tax,
    grandTotal,
    itemCount: cart.reduce((sum, item) => sum + item.quantity, 0)
  };
}

function applyPromoCode(inputCode) {
  const code = (inputCode || '').trim().toUpperCase();
  if (!code) {
    showToast('Please enter a coupon code', 'error');
    return;
  }

  if (VALID_PROMOS[code]) {
    appliedPromo = { code, ...VALID_PROMOS[code] };
    saveCart();
    renderCartDrawer();
    showToast(`Promo code "${code}" applied successfully!`, 'success');
  } else {
    showToast(`Invalid promo code "${code}". Try "KICKS20" for 20% off!`, 'error');
  }
}

function removePromoCode() {
  appliedPromo = null;
  saveCart();
  renderCartDrawer();
  showToast('Promo code removed', 'info');
}

function renderCartDrawer() {
  const container = document.getElementById('cart-items-container');
  const emptyState = document.getElementById('cart-empty-state');
  const summaryContainer = document.getElementById('cart-summary-section');
  const freeShipBar = document.getElementById('free-shipping-progress');
  const freeShipText = document.getElementById('free-shipping-text');

  if (!container) return;

  const totals = calculateCartTotals();

  // Update Free Shipping Progress Bar
  if (totals.subtotal >= totals.freeShippingThreshold) {
    if (freeShipBar) freeShipBar.style.width = '100%';
    if (freeShipText) freeShipText.innerHTML = '🎉 You unlocked <strong class="text-emerald-600">FREE Express Delivery!</strong>';
  } else {
    const needed = (totals.freeShippingThreshold - totals.subtotal).toFixed(2);
    const percent = Math.min(100, (totals.subtotal / totals.freeShippingThreshold) * 100);
    if (freeShipBar) freeShipBar.style.width = `${percent}%`;
    if (freeShipText) freeShipText.innerHTML = `Add <strong>$${needed}</strong> more to unlock <strong>FREE Delivery</strong>`;
  }

  if (cart.length === 0) {
    container.innerHTML = '';
    if (emptyState) emptyState.classList.remove('hidden');
    if (summaryContainer) summaryContainer.classList.add('hidden');
    return;
  }

  if (emptyState) emptyState.classList.add('hidden');
  if (summaryContainer) summaryContainer.classList.remove('hidden');

  container.innerHTML = cart.map((item, idx) => `
    <div class="flex gap-4 p-3.5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-200 transition-all">
      <img src="${item.image}" alt="${item.name}" class="w-20 h-20 object-cover rounded-xl bg-white border border-slate-200 shrink-0" />
      <div class="flex-1 flex flex-col justify-between min-w-0">
        <div class="flex justify-between items-start gap-2">
          <div>
            <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">${item.brand}</span>
            <h4 class="text-sm font-bold text-slate-900 truncate leading-tight">${item.name}</h4>
            <div class="flex items-center gap-2 mt-1 text-xs text-slate-600">
              <span class="bg-white px-2 py-0.5 rounded-md border border-slate-200 font-medium">US ${item.size}</span>
              <span class="truncate">${item.color}</span>
            </div>
          </div>
          <button onclick="removeFromCart(${idx})" class="text-slate-400 hover:text-red-500 transition-colors p-1" title="Remove item">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          </button>
        </div>
        
        <div class="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60">
          <div class="flex items-center bg-white rounded-lg border border-slate-200 shadow-sm">
            <button onclick="updateCartQuantity(${idx}, -1)" class="w-7 h-7 flex items-center justify-center text-slate-600 hover:text-slate-900 font-bold transition-colors">
              -
            </button>
            <span class="w-7 text-center text-xs font-bold text-slate-900">${item.quantity}</span>
            <button onclick="updateCartQuantity(${idx}, 1)" class="w-7 h-7 flex items-center justify-center text-slate-600 hover:text-slate-900 font-bold transition-colors">
              +
            </button>
          </div>
          <div class="text-right">
            <span class="text-xs text-slate-400 block">$${item.price.toFixed(2)} each</span>
            <span class="text-sm font-extrabold text-slate-900">$${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  `).join('');

  // Update Summary Pricing
  const subtotalEl = document.getElementById('cart-subtotal');
  const discountRow = document.getElementById('cart-discount-row');
  const discountEl = document.getElementById('cart-discount');
  const shippingEl = document.getElementById('cart-shipping');
  const taxEl = document.getElementById('cart-tax');
  const totalEl = document.getElementById('cart-grand-total');

  if (subtotalEl) subtotalEl.textContent = `$${totals.subtotal.toFixed(2)}`;
  
  if (discountRow) {
    if (totals.discountAmount > 0 || (appliedPromo && appliedPromo.freeShipping)) {
      discountRow.classList.remove('hidden');
      discountRow.classList.add('flex');
      if (discountEl) {
        discountEl.textContent = `-$${totals.discountAmount.toFixed(2)} (${appliedPromo.label})`;
      }
    } else {
      discountRow.classList.add('hidden');
      discountRow.classList.remove('flex');
    }
  }

  if (shippingEl) {
    shippingEl.textContent = totals.shippingCost === 0 ? 'FREE' : `$${totals.shippingCost.toFixed(2)}`;
    if (totals.shippingCost === 0) {
      shippingEl.classList.add('text-emerald-600', 'font-bold');
    } else {
      shippingEl.classList.remove('text-emerald-600', 'font-bold');
    }
  }

  if (taxEl) taxEl.textContent = `$${totals.tax.toFixed(2)}`;
  if (totalEl) totalEl.textContent = `$${totals.grandTotal.toFixed(2)}`;

  // Update Promo Code Display
  const promoInput = document.getElementById('promo-input');
  const promoContainer = document.getElementById('applied-promo-tag');
  if (promoContainer) {
    if (appliedPromo) {
      promoContainer.classList.remove('hidden');
      promoContainer.classList.add('flex');
      promoContainer.innerHTML = `
        <span class="text-xs font-semibold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-full flex items-center gap-1.5">
          <span>🏷️ ${appliedPromo.code} (${appliedPromo.label})</span>
          <button onclick="removePromoCode()" class="text-emerald-700 hover:text-emerald-950 ml-1 font-bold">×</button>
        </span>
      `;
      if (promoInput) promoInput.value = '';
    } else {
      promoContainer.classList.add('hidden');
      promoContainer.classList.remove('flex');
      promoContainer.innerHTML = '';
    }
  }
}

function openCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  const panel = document.getElementById('cart-drawer-panel');
  const backdrop = document.getElementById('cart-backdrop');
  if (!drawer || !panel) return;

  drawer.classList.remove('pointer-events-none');
  backdrop.classList.remove('opacity-0');
  backdrop.classList.add('opacity-100');
  panel.classList.remove('translate-x-full');
  panel.classList.add('translate-x-0');
  document.body.style.overflow = 'hidden';
}

function closeCartDrawer() {
  const drawer = document.getElementById('cart-drawer');
  const panel = document.getElementById('cart-drawer-panel');
  const backdrop = document.getElementById('cart-backdrop');
  if (!drawer || !panel) return;

  backdrop.classList.remove('opacity-100');
  backdrop.classList.add('opacity-0');
  panel.classList.remove('translate-x-0');
  panel.classList.add('translate-x-full');
  
  setTimeout(() => {
    drawer.classList.add('pointer-events-none');
    document.body.style.overflow = '';
  }, 300);
}
