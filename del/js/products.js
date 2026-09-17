// SoleSphere - Comprehensive Footwear Catalog
const PRODUCTS = [
  {
    id: 'shoe-1',
    name: 'Air VaporMax Flyknit Pulse',
    brand: 'Nike',
    category: 'Running',
    gender: 'Men',
    price: 185.00,
    originalPrice: 220.00,
    rating: 4.9,
    reviewCount: 328,
    badge: 'Best Seller',
    badgeColor: 'bg-emerald-500 text-white',
    isNew: true,
    colors: [
      { name: 'University Red', hex: '#E53E3E' },
      { name: 'Obsidian Black', hex: '#1A202C' },
      { name: 'Pure White', hex: '#FFFFFF' }
    ],
    sizes: [7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12],
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=900&q=80'
    ],
    description: 'Engineered for high energy return, the Air VaporMax Pulse features precision Flyknit upper weave and full-length revolutionary cushioning that responds to every stride.',
    features: [
      'Seamless breathable Flyknit woven construction',
      'Targeted full-length Air pod cushioning',
      'Reinforced heel clip for lateral stability',
      'Sustainable recycled composite rubber outsole'
    ],
    inStock: true
  },
  {
    id: 'shoe-2',
    name: 'Ultraboost Light Speed',
    brand: 'Adidas',
    category: 'Running',
    gender: 'Unisex',
    price: 190.00,
    originalPrice: null,
    rating: 4.8,
    reviewCount: 245,
    badge: 'Popular',
    badgeColor: 'bg-indigo-600 text-white',
    isNew: false,
    colors: [
      { name: 'Triple White', hex: '#F7FAFC' },
      { name: 'Core Black', hex: '#2D3748' },
      { name: 'Solar Lime', hex: '#A0AEC0' }
    ],
    sizes: [7, 8, 8.5, 9, 9.5, 10, 11],
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=900&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=900&q=80'
    ],
    description: 'Experience epic energy return with our lightest BOOST foam yet. Delivers ultimate comfort for training runs and all-day city walks.',
    features: [
      '30% lighter Light BOOST midsole technology',
      'Primeknit+ textile upper hugs your foot',
      'Linear Energy Push torsion system',
      'Continental™ Better Rubber traction'
    ],
    inStock: true
  },
  {
    id: 'shoe-3',
    name: 'Air Jordan 1 High OG Heritage',
    brand: 'Jordan',
    category: 'Basketball',
    gender: 'Men',
    price: 180.00,
    originalPrice: 210.00,
    rating: 5.0,
    reviewCount: 412,
    badge: 'Limited Drop',
    badgeColor: 'bg-red-600 text-white',
    isNew: true,
    colors: [
      { name: 'Chicago Red/White', hex: '#C53030' },
      { name: 'Shadow Grey', hex: '#4A5568' }
    ],
    sizes: [8, 8.5, 9, 9.5, 10, 10.5, 11, 12, 13],
    image: 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=900&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1605348532760-6753d2c43329?auto=format&fit=crop&w=900&q=80'
    ],
    description: 'An undisputed cultural icon. Premium full-grain leather, heritage ankle support, and timeless Wings logo make this the crown jewel of any sneaker collection.',
    features: [
      'Genuine full-grain leather overlays',
      'Encapsulated Nike Air-Sole unit in the heel',
      'Padded high-cut collar for ankle security',
      'Deep pivot-circle rubber basketball tread'
    ],
    inStock: true
  },
  {
    id: 'shoe-4',
    name: '990v6 Made in USA Core',
    brand: 'New Balance',
    category: 'Lifestyle',
    gender: 'Unisex',
    price: 219.00,
    originalPrice: null,
    rating: 4.9,
    reviewCount: 189,
    badge: 'Iconic',
    badgeColor: 'bg-zinc-800 text-white',
    isNew: false,
    colors: [
      { name: 'Castlerock Grey', hex: '#718096' },
      { name: 'Navy Blue', hex: '#2B6CB0' }
    ],
    sizes: [7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11],
    image: 'https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?auto=format&fit=crop&w=900&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1582588678413-dbf45f4823e9?auto=format&fit=crop&w=900&q=80'
    ],
    description: 'Handcrafted excellence that defies trend cycles. Featuring FuelCell foam cushioning with an ENCAP midsole support bridge for unprecedented daily comfort.',
    features: [
      'Premium pigskin suede and mesh upper',
      'FuelCell foam drives you forward with springy propulsion',
      'ENCAP midsole cushioning merges lightweight foam with polyurethane rim',
      'Reflective accents for 360-degree night visibility'
    ],
    inStock: true
  },
  {
    id: 'shoe-5',
    name: 'RS-X Efekt Glitch Sneaker',
    brand: 'Puma',
    category: 'Lifestyle',
    gender: 'Men',
    price: 110.00,
    originalPrice: 135.00,
    rating: 4.6,
    reviewCount: 154,
    badge: '18% OFF',
    badgeColor: 'bg-amber-500 text-white',
    isNew: false,
    colors: [
      { name: 'Marshmallow White', hex: '#EDF2F7' },
      { name: 'Cyber Yellow', hex: '#ECC94B' }
    ],
    sizes: [8, 8.5, 9, 9.5, 10, 10.5, 11],
    image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=900&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=900&q=80'
    ],
    description: 'Futuristic chunky aesthetic combined with 80s Running System cushioning technology. Bold lines, layered textures, and high impact presence.',
    features: [
      'PU midsole assists a smooth foot stride',
      'Multi-layered textile and nubuck overlays',
      'High-traction rubber outsole with flex grooves',
      'Pull tab on heel and tongue for effortless on/off'
    ],
    inStock: true
  },
  {
    id: 'shoe-6',
    name: 'ZoomX Invincible Run 3',
    brand: 'Nike',
    category: 'Running',
    gender: 'Women',
    price: 179.99,
    originalPrice: null,
    rating: 4.8,
    reviewCount: 210,
    badge: 'Top Pick',
    badgeColor: 'bg-teal-600 text-white',
    isNew: true,
    colors: [
      { name: 'Teal Lagoon', hex: '#319795' },
      { name: 'Peach Glow', hex: '#ED8936' },
      { name: 'Pure White', hex: '#FFFFFF' }
    ],
    sizes: [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5],
    image: 'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&w=900&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1575537302964-96cd47c06b1b?auto=format&fit=crop&w=900&q=80'
    ],
    description: 'Designed to help keep you on the run with our highest level of ultra-responsive ZoomX foam cushion stack for peak impact protection.',
    features: [
      'Thick stack of springy ZoomX foam cushioning',
      'Advanced Flyknit breathable collar structure',
      'Wider midsole geometry for inherent stability',
      'Waffle-inspired durable rubber pattern'
    ],
    inStock: true
  },
  {
    id: 'shoe-7',
    name: 'Air Max 90 Terrascape Nature',
    brand: 'Nike',
    category: 'Casual',
    gender: 'Unisex',
    price: 145.00,
    originalPrice: 160.00,
    rating: 4.7,
    reviewCount: 168,
    badge: 'Eco Friendly',
    badgeColor: 'bg-emerald-600 text-white',
    isNew: false,
    colors: [
      { name: 'Phantom Sail', hex: '#E2E8F0' },
      { name: 'Vivid Green', hex: '#48BB78' }
    ],
    sizes: [7, 7.5, 8, 8.5, 9, 9.5, 10, 11, 12],
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=900&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&w=900&q=80'
    ],
    description: 'Reimagined outdoor streetwear built with at least 20% recycled materials by weight. Features translucent cupsole wrapping around Crater foam.',
    features: [
      'Durable ripstop upper with synthetic leather accents',
      'Crater Foam brings stability and a unique speckled style',
      'Max Air unit in the heel cushions every step',
      'Nike Grind rubber outsole adds rugged grip'
    ],
    inStock: true
  },
  {
    id: 'shoe-8',
    name: 'GEL-Kayano 30 Stability Pro',
    brand: 'Asics',
    category: 'Running',
    gender: 'Men',
    price: 165.00,
    originalPrice: null,
    rating: 4.9,
    reviewCount: 384,
    badge: 'Doctor Recommended',
    badgeColor: 'bg-blue-600 text-white',
    isNew: true,
    colors: [
      { name: 'Midnight Navy', hex: '#1A365D' },
      { name: 'Hazard Lime', hex: '#ECC94B' }
    ],
    sizes: [8, 8.5, 9, 9.5, 10, 10.5, 11, 12],
    image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=900&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=900&q=80'
    ],
    description: 'The benchmark for adaptive stability. 4D GUIDANCE SYSTEM provides tailored support that guides your foot naturally through each transition.',
    features: [
      'PureGEL technology under heel for plush shock absorption',
      'FF BLAST PLUS ECO cushioning with bio-based content',
      '4D GUIDANCE SYSTEM for customized gait stabilization',
      'AHARPLUS rubber heel plug for 3x durability'
    ],
    inStock: true
  },
  {
    id: 'shoe-9',
    name: 'Luka 2 Neo Turquoise Court',
    brand: 'Jordan',
    category: 'Basketball',
    gender: 'Unisex',
    price: 130.00,
    originalPrice: 150.00,
    rating: 4.7,
    reviewCount: 119,
    badge: '13% OFF',
    badgeColor: 'bg-rose-500 text-white',
    isNew: false,
    colors: [
      { name: 'Turquoise / Mint', hex: '#38B2AC' },
      { name: 'Laser Orange', hex: '#DD6B20' }
    ],
    sizes: [7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5],
    image: 'https://images.unsplash.com/photo-1605348532760-6753d2c43329?auto=format&fit=crop&w=900&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1605348532760-6753d2c43329?auto=format&fit=crop&w=900&q=80'
    ],
    description: 'Engineered for quick step-backs, deceleration, and laser-sharp cuts. Features a sturdy cage wrapping around the foot for locked-down 360 court support.',
    features: [
      'Formula 23 foam midsole for responsive lateral containment',
      'Firm IsoPlate frame on the lateral sidewall',
      'Reinforced mesh wraps around upper for containment',
      'Herringbone traction pattern designed for indoor courts'
    ],
    inStock: true
  },
  {
    id: 'shoe-10',
    name: 'Forum Low Classic Retro',
    brand: 'Adidas',
    category: 'Casual',
    gender: 'Unisex',
    price: 105.00,
    originalPrice: null,
    rating: 4.7,
    reviewCount: 290,
    badge: 'Classic',
    badgeColor: 'bg-slate-700 text-white',
    isNew: false,
    colors: [
      { name: 'Cloud White/Royal', hex: '#3182CE' },
      { name: 'Core White', hex: '#FFFFFF' }
    ],
    sizes: [6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11],
    image: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&q=80'
    ],
    description: 'Born on the hardwood in 1984, the Forum Low is now the ultimate streetwear staple featuring signature X-strap ankle detail and coated leather.',
    features: [
      'Premium coated leather and suede upper',
      'Signature removable hook-and-loop ankle strap',
      'Terry lining provides plush next-to-skin comfort',
      'Rubber cupsole with vintage heritage finish'
    ],
    inStock: true
  },
  {
    id: 'shoe-11',
    name: 'Metcon 9 Workout Master',
    brand: 'Nike',
    category: 'Training',
    gender: 'Men',
    price: 150.00,
    originalPrice: 170.00,
    rating: 4.8,
    reviewCount: 205,
    badge: 'Heavy Duty',
    badgeColor: 'bg-orange-600 text-white',
    isNew: true,
    colors: [
      { name: 'Anthracite Black', hex: '#2D3748' },
      { name: 'Volt Orange', hex: '#ED8936' }
    ],
    sizes: [8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12],
    image: 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?auto=format&fit=crop&w=900&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?auto=format&fit=crop&w=900&q=80'
    ],
    description: 'Whatever your reason for working out, the Metcon 9 makes it all worth it. An upgraded larger Hyperlift plate and extended rope wrap ensure peak stability.',
    features: [
      'Hyperlift plate in the heel provides elite balance for heavy lifts',
      'Lace lock system securely fastens shoelaces to tongue',
      'Extended rubber wrap on the side for rope climbs',
      'Dual-density foam cushioning offers responsive cardio comfort'
    ],
    inStock: true
  },
  {
    id: 'shoe-12',
    name: 'Speedcross 6 Trail Outdoor',
    brand: 'Outdoor',
    category: 'Outdoor',
    gender: 'Unisex',
    price: 145.00,
    originalPrice: 165.00,
    rating: 4.9,
    reviewCount: 310,
    badge: 'Trail Proof',
    badgeColor: 'bg-green-700 text-white',
    isNew: false,
    colors: [
      { name: 'Earth Slate', hex: '#4A5568' },
      { name: 'Burnt Ochre', hex: '#C05621' }
    ],
    sizes: [7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 12],
    image: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=900&q=80',
    additionalImages: [
      'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=900&q=80'
    ],
    description: 'True to its legendary roots, the Speedcross 6 grips tighter and sheds mud faster than ever before. Waterproof mesh shields against the elements.',
    features: [
      'Aggressive deep Chevron chevron lug tread',
      'Quicklace minimalistic strong one-pull tightening',
      'SensiFit cradle construction hugs foot securely',
      'Anti-debris protective mesh upper'
    ],
    inStock: true
  }
];

// Helper to retrieve all categories
const CATEGORIES = ['All', 'Running', 'Basketball', 'Lifestyle', 'Training', 'Casual', 'Outdoor'];

// Helper to retrieve all brands
const BRANDS = ['All Brands', 'Nike', 'Adidas', 'Jordan', 'New Balance', 'Puma', 'Asics', 'Outdoor'];

// Available sizes for filter
const ALL_SIZES = [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 13];
