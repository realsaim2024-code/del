// SoleSphere - Main Application Orchestrator & UI Controller
let quickViewActiveProduct = null;
let quickViewSelectedSize = null;
let quickViewQuantity = 1;

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

function initApp() {
  initFilters();
  updateCartBadge();
  updateWishlistBadges();
  setupEventListeners();
  renderCartDrawer();
  lucide.createIcons();
}

function setupEventListeners() {
  // Sticky Nav Scroll Shadow
  const navbar = document.getElementById('main-navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 15) {
      navbar.classList.add('shadow-md');
    } else {
      navbar.classList.remove('shadow-md');
    }
  });

  // Newsletter Submit
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('newsletter-email').value;
      if (email) {
        showToast('🎉 Thank you for subscribing! Your 15% voucher code is: WELCOME15', 'success');
        newsletterForm.reset();
      }
    });
  }

  // Close modals on Escape key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeCartDrawer();
      closeWishlistModal();
      closeQuickView();
      closeCheckoutModal();
      closeMobileMenu();
      closeMobileFilter();
    }
  });
}

// Mobile Menu Drawer
function openMobileMenu() {
  const drawer = document.getElementById('mobile-menu-drawer');
  const panel = document.getElementById('mobile-menu-panel');
  const backdrop = document.getElementById('mobile-menu-backdrop');
  if (!drawer) return;

  drawer.classList.remove('pointer-events-none');
  backdrop.classList.remove('opacity-0');
  backdrop.classList.add('opacity-100');
  panel.classList.remove('-translate-x-full');
  panel.classList.add('translate-x-0');
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
  const drawer = document.getElementById('mobile-menu-drawer');
  const panel = document.getElementById('mobile-menu-panel');
  const backdrop = document.getElementById('mobile-menu-backdrop');
  if (!drawer) return;

  backdrop.classList.remove('opacity-100');
  backdrop.classList.add('opacity-0');
  panel.classList.remove('translate-x-0');
  panel.classList.add('-translate-x-full');

  setTimeout(() => {
    drawer.classList.add('pointer-events-none');
    document.body.style.overflow = '';
  }, 250);
}

// Mobile Filter Drawer (Slide up / slide from left)
function openMobileFilter() {
  const drawer = document.getElementById('mobile-filter-drawer');
  const panel = document.getElementById('mobile-filter-panel');
  const backdrop = document.getElementById('mobile-filter-backdrop');
  if (!drawer) return;

  drawer.classList.remove('pointer-events-none');
  backdrop.classList.remove('opacity-0');
  backdrop.classList.add('opacity-100');
  panel.classList.remove('translate-y-full');
  panel.classList.add('translate-y-0');
  document.body.style.overflow = 'hidden';
}

function closeMobileFilter() {
  const drawer = document.getElementById('mobile-filter-drawer');
  const panel = document.getElementById('mobile-filter-panel');
  const backdrop = document.getElementById('mobile-filter-backdrop');
  if (!drawer) return;

  backdrop.classList.remove('opacity-100');
  backdrop.classList.add('opacity-0');
  panel.classList.remove('translate-y-0');
  panel.classList.add('translate-y-full');

  setTimeout(() => {
    drawer.classList.add('pointer-events-none');
    document.body.style.overflow = '';
  }, 250);
}

// Quick View Modal
function openQuickView(productId) {
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  quickViewActiveProduct = product;
  quickViewSelectedSize = product.sizes[0];
  quickViewQuantity = 1;

  // Set Modal Details
  document.getElementById('qv-image').src = product.image;
  document.getElementById('qv-brand').textContent = product.brand;
  document.getElementById('qv-name').textContent = product.name;
  document.getElementById('qv-price').textContent = `$${product.price.toFixed(2)}`;
  
  const origPriceEl = document.getElementById('qv-original-price');
  if (product.originalPrice) {
    origPriceEl.textContent = `$${product.originalPrice.toFixed(2)}`;
    origPriceEl.classList.remove('hidden');
  } else {
    origPriceEl.classList.add('hidden');
  }

  document.getElementById('qv-rating').textContent = `${product.rating} ★ (${product.reviewCount} reviews)`;
  document.getElementById('qv-description').textContent = product.description;

  // Features list
  const featuresEl = document.getElementById('qv-features');
  if (featuresEl) {
    featuresEl.innerHTML = product.features.map(f => `
      <li class="flex items-center gap-2 text-xs text-slate-600">
        <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        ${f}
      </li>
    `).join('');
  }

  // Thumbnails
  const thumbsContainer = document.getElementById('qv-thumbnails');
  if (thumbsContainer) {
    const images = product.additionalImages || [product.image];
    thumbsContainer.innerHTML = images.map((img, idx) => `
      <button 
        onclick="setQuickViewMainImage('${img}')" 
        class="w-16 h-16 rounded-xl border border-slate-200 p-1 hover:border-slate-800 transition-all bg-slate-50"
      >
        <img src="${img}" class="w-full h-full object-cover rounded-lg" />
      </button>
    `).join('');
  }

  // Sizes
  renderQuickViewSizes();

  // Reset Quantity Display
  document.getElementById('qv-quantity').textContent = '1';

  // Open Modal UI
  const modal = document.getElementById('quickview-modal');
  const backdrop = document.getElementById('quickview-backdrop');
  const panel = document.getElementById('quickview-panel');

  modal.classList.remove('pointer-events-none');
  backdrop.classList.remove('opacity-0');
  backdrop.classList.add('opacity-100');
  panel.classList.remove('scale-95', 'opacity-0');
  panel.classList.add('scale-100', 'opacity-100');
  document.body.style.overflow = 'hidden';
}

function setQuickViewMainImage(src) {
  const mainImg = document.getElementById('qv-image');
  if (mainImg) {
    mainImg.style.opacity = '0';
    setTimeout(() => {
      mainImg.src = src;
      mainImg.style.opacity = '1';
    }, 150);
  }
}

function renderQuickViewSizes() {
  const container = document.getElementById('qv-sizes');
  if (!container || !quickViewActiveProduct) return;

  container.innerHTML = quickViewActiveProduct.sizes.map(size => {
    const isSelected = quickViewSelectedSize === size;
    return `
      <button 
        onclick="selectQuickViewSize(${size})" 
        class="h-10 text-xs font-bold rounded-xl border transition-all ${
          isSelected 
            ? 'bg-slate-900 text-white border-slate-900 shadow-sm' 
            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-900'
        }"
      >
        US ${size}
      </button>
    `;
  }).join('');
}

function selectQuickViewSize(size) {
  quickViewSelectedSize = size;
  renderQuickViewSizes();
}

function adjustQuickViewQty(delta) {
  quickViewQuantity = Math.max(1, quickViewQuantity + delta);
  const qtyEl = document.getElementById('qv-quantity');
  if (qtyEl) qtyEl.textContent = quickViewQuantity;
}

function addQuickViewToCart() {
  if (!quickViewActiveProduct) return;
  addToCart(quickViewActiveProduct.id, quickViewSelectedSize, quickViewQuantity);
  closeQuickView();
}

function closeQuickView() {
  const modal = document.getElementById('quickview-modal');
  const backdrop = document.getElementById('quickview-backdrop');
  const panel = document.getElementById('quickview-panel');
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

// Toast Notifications
function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  const icons = {
    success: '✓',
    error: '✕',
    info: 'ℹ'
  };

  const bgStyles = {
    success: 'bg-slate-900 text-white border-slate-800',
    error: 'bg-red-600 text-white border-red-700',
    info: 'bg-white text-slate-900 border-slate-200 shadow-xl'
  };

  toast.className = `toast-item flex items-center gap-3 px-4 py-3 rounded-2xl border shadow-xl text-sm font-semibold transform translate-y-4 opacity-0 transition-all duration-300 max-w-sm ${bgStyles[type] || bgStyles.info}`;
  
  toast.innerHTML = `
    <span class="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
      type === 'info' ? 'bg-slate-100 text-slate-800' : 'bg-white/20 text-white'
    }">
      ${icons[type] || 'ℹ'}
    </span>
    <span class="flex-1 leading-tight text-xs sm:text-sm">${message}</span>
  `;

  container.appendChild(toast);

  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.remove('translate-y-4', 'opacity-0');
    toast.classList.add('translate-y-0', 'opacity-100');
  });

  // Remove after 3.5s
  setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-4', 'opacity-0');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
