// SoleSphere - Wishlist Management Module
const WISHLIST_STORAGE_KEY = 'solesphere_wishlist_v1';
let wishlist = JSON.parse(localStorage.getItem(WISHLIST_STORAGE_KEY)) || [];

function saveWishlist() {
  localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
  updateWishlistBadges();
  syncWishlistButtons();
}

function isWishlisted(productId) {
  return wishlist.includes(productId);
}

function toggleWishlist(productId) {
  const index = wishlist.indexOf(productId);
  const product = PRODUCTS.find(p => p.id === productId);
  const name = product ? product.name : 'Shoe';

  if (index > -1) {
    wishlist.splice(index, 1);
    showToast(`Removed "${name}" from your wishlist`, 'info');
  } else {
    wishlist.push(productId);
    showToast(`Saved "${name}" to your wishlist ❤️`, 'success');
  }

  saveWishlist();
  renderWishlistModal();
}

function updateWishlistBadges() {
  const count = wishlist.length;
  const badges = document.querySelectorAll('.wishlist-badge');
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

function syncWishlistButtons() {
  const buttons = document.querySelectorAll('[data-wishlist-id]');
  buttons.forEach(btn => {
    const id = btn.getAttribute('data-wishlist-id');
    const heartSvg = btn.querySelector('svg');
    if (isWishlisted(id)) {
      btn.classList.add('text-red-500', 'bg-red-50');
      btn.classList.remove('text-slate-400', 'bg-white/90');
      if (heartSvg) {
        heartSvg.setAttribute('fill', 'currentColor');
      }
    } else {
      btn.classList.remove('text-red-500', 'bg-red-50');
      btn.classList.add('text-slate-400', 'bg-white/90');
      if (heartSvg) {
        heartSvg.setAttribute('fill', 'none');
      }
    }
  });
}

function renderWishlistModal() {
  const container = document.getElementById('wishlist-items-container');
  const emptyState = document.getElementById('wishlist-empty-state');
  if (!container) return;

  const items = PRODUCTS.filter(p => wishlist.includes(p.id));

  if (items.length === 0) {
    container.innerHTML = '';
    if (emptyState) emptyState.classList.remove('hidden');
    return;
  }

  if (emptyState) emptyState.classList.add('hidden');

  container.innerHTML = items.map(product => `
    <div class="flex items-center gap-4 p-3 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-200 transition-all">
      <img src="${product.image}" alt="${product.name}" class="w-20 h-20 object-cover rounded-xl bg-white border border-slate-200 shrink-0" />
      <div class="flex-1 min-w-0">
        <span class="text-xs font-bold text-slate-500 uppercase">${product.brand}</span>
        <h4 class="text-sm font-bold text-slate-900 truncate">${product.name}</h4>
        <div class="flex items-center gap-2 mt-1">
          <span class="text-sm font-extrabold text-slate-900">$${product.price.toFixed(2)}</span>
          ${product.originalPrice ? `<span class="text-xs text-slate-400 line-through">$${product.originalPrice.toFixed(2)}</span>` : ''}
        </div>
      </div>
      <div class="flex flex-col gap-2 shrink-0">
        <button onclick="addToCart('${product.id}'); closeWishlistModal();" class="px-3.5 py-1.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all shadow-sm">
          Move to Cart
        </button>
        <button onclick="toggleWishlist('${product.id}')" class="text-xs text-slate-400 hover:text-red-600 font-medium text-center transition-colors">
          Remove
        </button>
      </div>
    </div>
  `).join('');
}

function openWishlistModal() {
  const modal = document.getElementById('wishlist-modal');
  const backdrop = document.getElementById('wishlist-backdrop');
  const panel = document.getElementById('wishlist-panel');
  if (!modal) return;

  renderWishlistModal();
  modal.classList.remove('pointer-events-none');
  backdrop.classList.remove('opacity-0');
  backdrop.classList.add('opacity-100');
  panel.classList.remove('scale-95', 'opacity-0');
  panel.classList.add('scale-100', 'opacity-100');
  document.body.style.overflow = 'hidden';
}

function closeWishlistModal() {
  const modal = document.getElementById('wishlist-modal');
  const backdrop = document.getElementById('wishlist-backdrop');
  const panel = document.getElementById('wishlist-panel');
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
