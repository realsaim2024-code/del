// SoleSphere - Interactive Checkout Flow & Order Simulator
let currentCheckoutStep = 1;
let checkoutFormData = {
  fullName: '',
  email: '',
  address: '',
  city: '',
  zip: '',
  phone: '',
  shippingMethod: 'standard',
  paymentMethod: 'card'
};

function openCheckoutModal() {
  if (cart.length === 0) {
    showToast('Your cart is empty! Add shoes before checking out.', 'error');
    return;
  }

  // Close cart drawer if open
  closeCartDrawer();

  const modal = document.getElementById('checkout-modal');
  const backdrop = document.getElementById('checkout-backdrop');
  const panel = document.getElementById('checkout-panel');
  if (!modal) return;

  currentCheckoutStep = 1;
  updateCheckoutStepUI();
  updateCheckoutOrderSummary();

  modal.classList.remove('pointer-events-none');
  backdrop.classList.remove('opacity-0');
  backdrop.classList.add('opacity-100');
  panel.classList.remove('scale-95', 'opacity-0');
  panel.classList.add('scale-100', 'opacity-100');
  document.body.style.overflow = 'hidden';
}

function closeCheckoutModal() {
  const modal = document.getElementById('checkout-modal');
  const backdrop = document.getElementById('checkout-backdrop');
  const panel = document.getElementById('checkout-panel');
  if (!modal) return;

  backdrop.classList.remove('opacity-100');
  backdrop.classList.add('opacity-0');
  panel.classList.remove('scale-100', 'opacity-100');
  panel.classList.add('scale-95', 'opacity-0');

  setTimeout(() => {
    modal.classList.add('pointer-events-none');
    document.body.style.overflow = '';
  }, 250);
}

function updateCheckoutOrderSummary() {
  const totals = calculateCartTotals();
  const listEl = document.getElementById('checkout-items-preview');
  const subtotalEl = document.getElementById('checkout-summary-subtotal');
  const shippingEl = document.getElementById('checkout-summary-shipping');
  const discountRow = document.getElementById('checkout-summary-discount-row');
  const discountEl = document.getElementById('checkout-summary-discount');
  const totalEl = document.getElementById('checkout-summary-total');

  if (listEl) {
    listEl.innerHTML = cart.map(item => `
      <div class="flex items-center justify-between text-xs py-1.5 border-b border-slate-100">
        <div class="flex items-center gap-2 truncate">
          <img src="${item.image}" class="w-8 h-8 object-cover rounded-lg border shrink-0" />
          <span class="truncate font-medium text-slate-700">${item.name} (${item.quantity}x)</span>
        </div>
        <span class="font-bold text-slate-900 shrink-0">$${(item.price * item.quantity).toFixed(2)}</span>
      </div>
    `).join('');
  }

  if (subtotalEl) subtotalEl.textContent = `$${totals.subtotal.toFixed(2)}`;

  let finalShipping = totals.shippingCost;
  if (checkoutFormData.shippingMethod === 'express') {
    finalShipping = 12.00;
  }

  if (shippingEl) {
    shippingEl.textContent = finalShipping === 0 ? 'FREE' : `$${finalShipping.toFixed(2)}`;
  }

  if (discountRow) {
    if (totals.discountAmount > 0) {
      discountRow.classList.remove('hidden');
      if (discountEl) discountEl.textContent = `-$${totals.discountAmount.toFixed(2)}`;
    } else {
      discountRow.classList.add('hidden');
    }
  }

  const finalGrandTotal = totals.subtotal - totals.discountAmount + finalShipping + totals.tax;
  if (totalEl) totalEl.textContent = `$${finalGrandTotal.toFixed(2)}`;
}

function nextCheckoutStep() {
  if (currentCheckoutStep === 1) {
    // Validate Step 1 Inputs
    const nameInput = document.getElementById('checkout-name');
    const emailInput = document.getElementById('checkout-email');
    const addrInput = document.getElementById('checkout-address');
    const cityInput = document.getElementById('checkout-city');
    const zipInput = document.getElementById('checkout-zip');

    if (!nameInput.value.trim() || !emailInput.value.trim() || !addrInput.value.trim()) {
      showToast('Please fill in required shipping details', 'error');
      return;
    }

    checkoutFormData.fullName = nameInput.value.trim();
    checkoutFormData.email = emailInput.value.trim();
    checkoutFormData.address = addrInput.value.trim();
    checkoutFormData.city = cityInput.value.trim();
    checkoutFormData.zip = zipInput.value.trim();
    currentCheckoutStep = 2;
  } else if (currentCheckoutStep === 2) {
    // Select shipping option
    const selectedShipping = document.querySelector('input[name="shipping_option"]:checked');
    if (selectedShipping) {
      checkoutFormData.shippingMethod = selectedShipping.value;
    }
    updateCheckoutOrderSummary();
    currentCheckoutStep = 3;
  } else if (currentCheckoutStep === 3) {
    // Process order simulation
    completeOrder();
    return;
  }

  updateCheckoutStepUI();
}

function prevCheckoutStep() {
  if (currentCheckoutStep > 1) {
    currentCheckoutStep--;
    updateCheckoutStepUI();
  }
}

function updateCheckoutStepUI() {
  const step1 = document.getElementById('checkout-step-1');
  const step2 = document.getElementById('checkout-step-2');
  const step3 = document.getElementById('checkout-step-3');
  const successStep = document.getElementById('checkout-step-success');

  const backBtn = document.getElementById('checkout-back-btn');
  const nextBtn = document.getElementById('checkout-next-btn');

  const indicator1 = document.getElementById('step-indicator-1');
  const indicator2 = document.getElementById('step-indicator-2');
  const indicator3 = document.getElementById('step-indicator-3');

  // Hide all step sections
  [step1, step2, step3, successStep].forEach(el => el && el.classList.add('hidden'));

  // Update indicators
  if (indicator1) indicator1.className = currentCheckoutStep >= 1 ? 'w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold' : 'w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-bold';
  if (indicator2) indicator2.className = currentCheckoutStep >= 2 ? 'w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold' : 'w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-bold';
  if (indicator3) indicator3.className = currentCheckoutStep >= 3 ? 'w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold' : 'w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-bold';

  if (currentCheckoutStep === 1) {
    if (step1) step1.classList.remove('hidden');
    if (backBtn) backBtn.classList.add('hidden');
    if (nextBtn) {
      nextBtn.classList.remove('hidden');
      nextBtn.textContent = 'Continue to Shipping →';
    }
  } else if (currentCheckoutStep === 2) {
    if (step2) step2.classList.remove('hidden');
    if (backBtn) backBtn.classList.remove('hidden');
    if (nextBtn) {
      nextBtn.classList.remove('hidden');
      nextBtn.textContent = 'Continue to Payment →';
    }
  } else if (currentCheckoutStep === 3) {
    if (step3) step3.classList.remove('hidden');
    if (backBtn) backBtn.classList.remove('hidden');
    if (nextBtn) {
      nextBtn.classList.remove('hidden');
      nextBtn.textContent = 'Place Order Now 🔒';
    }
  }
}

function completeOrder() {
  const step3 = document.getElementById('checkout-step-3');
  const successStep = document.getElementById('checkout-step-success');
  const backBtn = document.getElementById('checkout-back-btn');
  const nextBtn = document.getElementById('checkout-next-btn');
  const footerActions = document.getElementById('checkout-modal-actions');
  const indicatorBar = document.getElementById('checkout-steps-bar');

  if (step3) step3.classList.add('hidden');
  if (footerActions) footerActions.classList.add('hidden');
  if (indicatorBar) indicatorBar.classList.add('hidden');
  if (successStep) successStep.classList.remove('hidden');

  const randomOrderId = 'SS-' + Math.floor(100000 + Math.random() * 900000);
  const orderIdDisplay = document.getElementById('success-order-id');
  const orderEmailDisplay = document.getElementById('success-order-email');

  if (orderIdDisplay) orderIdDisplay.textContent = randomOrderId;
  if (orderEmailDisplay) orderEmailDisplay.textContent = checkoutFormData.email || 'your email';

  // Trigger celebratory confetti effect
  triggerCelebration();

  // Clear cart
  clearCart();
}

function triggerCelebration() {
  const container = document.getElementById('confetti-canvas');
  if (!container) return;

  container.innerHTML = '';
  const colors = ['#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

  for (let i = 0; i < 40; i++) {
    const confetti = document.createElement('div');
    const color = colors[Math.floor(Math.random() * colors.length)];
    const left = Math.random() * 100;
    const animDuration = 1.5 + Math.random() * 2;
    const size = 6 + Math.random() * 8;

    confetti.className = 'absolute rounded-sm pointer-events-none';
    confetti.style.backgroundColor = color;
    confetti.style.width = `${size}px`;
    confetti.style.height = `${size}px`;
    confetti.style.left = `${left}%`;
    confetti.style.top = '-20px';
    confetti.style.opacity = '1';
    confetti.style.transition = `transform ${animDuration}s cubic-bezier(0.25, 1, 0.5, 1), opacity ${animDuration}s ease`;

    container.appendChild(confetti);

    setTimeout(() => {
      confetti.style.transform = `translateY(${300 + Math.random() * 200}px) rotate(${Math.random() * 720}deg)`;
      confetti.style.opacity = '0';
    }, 50);
  }
}
