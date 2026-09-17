// SoleSphere - Filtering, Search, and Catalog Display Engine
let currentFilters = {
  category: 'All',
  brand: 'All Brands',
  gender: 'All',
  sizes: [],
  maxPrice: 250,
  searchQuery: '',
  sortBy: 'featured'
};

function initFilters() {
  renderCategoryPills();
  renderBrandOptions();
  renderSizeOptions();
  setupFilterEventListeners();
  applyFilters();
}

function setupFilterEventListeners() {
  // Desktop & Mobile Search Inputs
  const searchInputs = document.querySelectorAll('.search-input');
  searchInputs.forEach(input => {
    input.addEventListener('input', (e) => {
      currentFilters.searchQuery = e.target.value.trim().toLowerCase();
      // Keep other search inputs in sync
      searchInputs.forEach(other => {
        if (other !== e.target) other.value = e.target.value;
      });
      applyFilters();
    });
  });

  // Price Range Sliders
  const priceSliders = document.querySelectorAll('.price-slider');
  const priceDisplays = document.querySelectorAll('.price-slider-val');
  priceSliders.forEach(slider => {
    slider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      currentFilters.maxPrice = val;
      priceDisplays.forEach(display => display.textContent = `$${val}`);
      priceSliders.forEach(other => {
        if (other !== e.target) other.value = val;
      });
      applyFilters();
    });
  });

  // Sort By Selectors
  const sortSelectors = document.querySelectorAll('.sort-select');
  sortSelectors.forEach(select => {
    select.addEventListener('change', (e) => {
      currentFilters.sortBy = e.target.value;
      sortSelectors.forEach(other => {
        if (other !== e.target) other.value = e.target.value;
      });
      applyFilters();
    });
  });

  // Gender Radio / Buttons
  const genderButtons = document.querySelectorAll('.gender-filter-btn');
  genderButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      genderButtons.forEach(b => b.classList.remove('bg-slate-900', 'text-white'));
      btn.classList.add('bg-slate-900', 'text-white');
      currentFilters.gender = btn.getAttribute('data-gender');
      applyFilters();
    });
  });
}

function renderCategoryPills() {
  const container = document.getElementById('category-pills');
  if (!container) return;

  container.innerHTML = CATEGORIES.map(cat => {
    const isActive = currentFilters.category === cat;
    return `
      <button 
        onclick="setCategoryFilter('${cat}')" 
        class="category-pill whitespace-nowrap px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all shrink-0 ${
          isActive 
            ? 'bg-slate-900 text-white shadow-md shadow-slate-900/20' 
            : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
        }"
      >
        ${cat}
      </button>
    `;
  }).join('');
}

function setCategoryFilter(category) {
  currentFilters.category = category;
  renderCategoryPills();
  applyFilters();
}

function renderBrandOptions() {
  const containers = document.querySelectorAll('.brand-filter-container');
  containers.forEach(container => {
    container.innerHTML = BRANDS.map(brand => `
      <label class="flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-slate-100 cursor-pointer text-sm text-slate-700 transition-colors">
        <span class="flex items-center gap-2.5">
          <input 
            type="radio" 
            name="brand-filter" 
            value="${brand}" 
            ${currentFilters.brand === brand ? 'checked' : ''} 
            onchange="setBrandFilter('${brand}')"
            class="w-4 h-4 text-slate-900 focus:ring-slate-800 accent-slate-900" 
          />
          <span>${brand}</span>
        </span>
        <span class="text-xs text-slate-400">
          ${brand === 'All Brands' ? PRODUCTS.length : PRODUCTS.filter(p => p.brand.toLowerCase() === brand.toLowerCase()).length}
        </span>
      </label>
    `).join('');
  });
}

function setBrandFilter(brand) {
  currentFilters.brand = brand;
  renderBrandOptions();
  applyFilters();
}

function renderSizeOptions() {
  const containers = document.querySelectorAll('.size-filter-container');
  containers.forEach(container => {
    container.innerHTML = ALL_SIZES.map(size => {
      const isSelected = currentFilters.sizes.includes(size);
      return `
        <button 
          onclick="toggleSizeFilter(${size})" 
          class="h-9 px-2 text-xs font-bold rounded-lg border transition-all ${
            isSelected 
              ? 'bg-slate-900 text-white border-slate-900 shadow-sm' 
              : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
          }"
        >
          US ${size}
        </button>
      `;
    }).join('');
  });
}

function toggleSizeFilter(size) {
  const index = currentFilters.sizes.indexOf(size);
  if (index > -1) {
    currentFilters.sizes.splice(index, 1);
  } else {
    currentFilters.sizes.push(size);
  }
  renderSizeOptions();
  applyFilters();
}

function resetAllFilters() {
  currentFilters = {
    category: 'All',
    brand: 'All Brands',
    gender: 'All',
    sizes: [],
    maxPrice: 250,
    searchQuery: '',
    sortBy: 'featured'
  };

  const searchInputs = document.querySelectorAll('.search-input');
  searchInputs.forEach(i => i.value = '');

  const priceSliders = document.querySelectorAll('.price-slider');
  const priceDisplays = document.querySelectorAll('.price-slider-val');
  priceSliders.forEach(s => s.value = 250);
  priceDisplays.forEach(d => d.textContent = '$250');

  const sortSelectors = document.querySelectorAll('.sort-select');
  sortSelectors.forEach(s => s.value = 'featured');

  const genderButtons = document.querySelectorAll('.gender-filter-btn');
  genderButtons.forEach(btn => {
    if (btn.getAttribute('data-gender') === 'All') {
      btn.classList.add('bg-slate-900', 'text-white');
    } else {
      btn.classList.remove('bg-slate-900', 'text-white');
    }
  });

  renderCategoryPills();
  renderBrandOptions();
  renderSizeOptions();
  applyFilters();
  showToast('Filters reset to default', 'info');
}

function applyFilters() {
  let filtered = [...PRODUCTS];

  // 1. Search filter
  if (currentFilters.searchQuery) {
    const q = currentFilters.searchQuery;
    filtered = filtered.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }

  // 2. Category filter
  if (currentFilters.category !== 'All') {
    filtered = filtered.filter(p => p.category.toLowerCase() === currentFilters.category.toLowerCase());
  }

  // 3. Brand filter
  if (currentFilters.brand !== 'All Brands') {
    filtered = filtered.filter(p => p.brand.toLowerCase() === currentFilters.brand.toLowerCase());
  }

  // 4. Gender filter
  if (currentFilters.gender !== 'All') {
    filtered = filtered.filter(p => p.gender === currentFilters.gender || p.gender === 'Unisex');
  }

  // 5. Size filter (must match at least one selected size)
  if (currentFilters.sizes.length > 0) {
    filtered = filtered.filter(p => 
      currentFilters.sizes.some(size => p.sizes.includes(size))
    );
  }

  // 6. Max Price filter
  filtered = filtered.filter(p => p.price <= currentFilters.maxPrice);

  // 7. Sort
  switch (currentFilters.sortBy) {
    case 'price-asc':
      filtered.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      filtered.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      filtered.sort((a, b) => b.rating - a.rating);
      break;
    case 'newest':
      filtered.sort((a, b) => (b.isNew === a.isNew ? 0 : b.isNew ? 1 : -1));
      break;
    case 'featured':
    default:
      // Default order
      break;
  }

  renderProductGrid(filtered);
  renderActiveFilterChips();
}

function renderActiveFilterChips() {
  const container = document.getElementById('active-filters-chips');
  if (!container) return;

  const chips = [];

  if (currentFilters.category !== 'All') {
    chips.push({
      label: `Category: ${currentFilters.category}`,
      onRemove: "setCategoryFilter('All')"
    });
  }

  if (currentFilters.brand !== 'All Brands') {
    chips.push({
      label: `Brand: ${currentFilters.brand}`,
      onRemove: "setBrandFilter('All Brands')"
    });
  }

  if (currentFilters.gender !== 'All') {
    chips.push({
      label: `Gender: ${currentFilters.gender}`,
      onRemove: "document.querySelector('.gender-filter-btn[data-gender=\"All\"]').click()"
    });
  }

  if (currentFilters.sizes.length > 0) {
    chips.push({
      label: `Sizes: ${currentFilters.sizes.join(', ')}`,
      onRemove: "currentFilters.sizes = []; renderSizeOptions(); applyFilters();"
    });
  }

  if (currentFilters.maxPrice < 250) {
    chips.push({
      label: `Under $${currentFilters.maxPrice}`,
      onRemove: "currentFilters.maxPrice = 250; document.querySelectorAll('.price-slider').forEach(s => s.value = 250); document.querySelectorAll('.price-slider-val').forEach(d => d.textContent = '$250'); applyFilters();"
    });
  }

  if (currentFilters.searchQuery) {
    chips.push({
      label: `Search: "${currentFilters.searchQuery}"`,
      onRemove: "currentFilters.searchQuery = ''; document.querySelectorAll('.search-input').forEach(i => i.value = ''); applyFilters();"
    });
  }

  if (chips.length === 0) {
    container.classList.add('hidden');
    container.innerHTML = '';
    return;
  }

  container.classList.remove('hidden');
  container.innerHTML = `
    <div class="flex items-center gap-2 flex-wrap text-xs">
      <span class="text-slate-500 font-medium">Active filters:</span>
      ${chips.map(chip => `
        <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-800 font-semibold rounded-full border border-slate-200">
          ${chip.label}
          <button onclick="${chip.onRemove}" class="text-slate-400 hover:text-slate-700 font-bold ml-0.5">×</button>
        </span>
      `).join('')}
      <button onclick="resetAllFilters()" class="text-red-500 hover:text-red-700 font-bold underline ml-1">
        Clear All
      </button>
    </div>
  `;
}

function renderProductGrid(products) {
  const grid = document.getElementById('products-grid');
  const countEl = document.getElementById('product-count-display');
  const emptyView = document.getElementById('no-products-view');

  if (countEl) {
    countEl.textContent = `${products.length} ${products.length === 1 ? 'Shoe' : 'Shoes'} Found`;
  }

  if (products.length === 0) {
    if (grid) grid.innerHTML = '';
    if (emptyView) emptyView.classList.remove('hidden');
    return;
  }

  if (emptyView) emptyView.classList.add('hidden');

  if (!grid) return;

  grid.innerHTML = products.map(product => {
    const isLiked = isWishlisted(product.id);
    return `
      <div class="product-card group relative bg-white rounded-3xl p-3.5 sm:p-4 border border-slate-200/80 hover:border-slate-300 hover:shadow-xl hover:shadow-slate-900/5 transition-all flex flex-col justify-between">
        <!-- Top Image & Badges Container -->
        <div class="relative w-full aspect-square rounded-2xl bg-gradient-to-b from-slate-50 to-slate-100 overflow-hidden flex items-center justify-center p-4">
          
          <!-- Badges -->
          <div class="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            ${product.badge ? `
              <span class="px-2.5 py-1 text-[10px] sm:text-xs font-extrabold uppercase tracking-wide rounded-lg shadow-sm ${product.badgeColor}">
                ${product.badge}
              </span>
            ` : ''}
            <span class="px-2 py-0.5 text-[10px] font-bold bg-white/90 backdrop-blur-md text-slate-700 rounded-md border border-slate-200 shadow-xs">
              ${product.gender}
            </span>
          </div>

          <!-- Wishlist Heart Button -->
          <button 
            data-wishlist-id="${product.id}"
            onclick="toggleWishlist('${product.id}')" 
            class="absolute top-3 right-3 z-10 w-9 h-9 rounded-full flex items-center justify-center backdrop-blur-md transition-transform active:scale-90 shadow-sm ${
              isLiked ? 'text-red-500 bg-red-50' : 'text-slate-400 bg-white/90 hover:text-red-500'
            }"
            title="Add to Wishlist"
          >
            <svg class="w-5 h-5 transition-transform group-hover:scale-110" fill="${isLiked ? 'currentColor' : 'none'}" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
          </button>

          <!-- Main Product Image -->
          <img 
            src="${product.image}" 
            alt="${product.name}" 
            loading="lazy" 
            class="product-card-img w-full h-full object-contain mix-blend-multiply transition-transform duration-500"
          />

          <!-- Quick View Hover Button -->
          <div class="absolute inset-x-3 bottom-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">
            <button 
              onclick="openQuickView('${product.id}')" 
              class="w-full py-2.5 bg-white/95 hover:bg-white text-slate-900 text-xs font-bold rounded-xl shadow-lg border border-slate-200/80 backdrop-blur-sm transition-all transform translate-y-2 group-hover:translate-y-0"
            >
              Quick View
            </button>
          </div>
        </div>

        <!-- Details Info -->
        <div class="mt-3.5 flex flex-col flex-1 justify-between">
          <div>
            <div class="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span class="font-bold uppercase tracking-wider text-slate-400">${product.brand}</span>
              <div class="flex items-center gap-1 font-semibold text-amber-500">
                <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                <span class="text-slate-800">${product.rating}</span>
                <span class="text-slate-400 text-[11px]">(${product.reviewCount})</span>
              </div>
            </div>

            <h3 class="font-bold text-slate-900 text-sm sm:text-base leading-snug hover:text-blue-600 transition-colors cursor-pointer" onclick="openQuickView('${product.id}')">
              ${product.name}
            </h3>

            <p class="text-xs text-slate-500 line-clamp-1 mt-1 font-medium">${product.category} • ${product.sizes.length} sizes available</p>
          </div>

          <!-- Price & Action Button -->
          <div class="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
            <div class="flex flex-col">
              <span class="text-base sm:text-lg font-extrabold text-slate-900">$${product.price.toFixed(2)}</span>
              ${product.originalPrice ? `
                <span class="text-xs text-slate-400 line-through font-medium">
                  $${product.originalPrice.toFixed(2)}
                </span>
              ` : ''}
            </div>

            <div class="flex items-center gap-1.5">
              <button 
                onclick="openQuickView('${product.id}')" 
                class="sm:hidden p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                title="View details"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
              </button>

              <button 
                onclick="addToCart('${product.id}')" 
                class="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow-md active:scale-95"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>
                <span class="hidden xs:inline">Add</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');

  // Sync wishlist hearts
  syncWishlistButtons();
}
