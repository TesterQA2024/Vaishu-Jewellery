/**
 * VAISHU JEWELLERY - Comprehensive Seed Data & System Schema
 * Features authentic jewellery catalog, categories, collections, banners, coupons, reviews, and customers.
 */

export const INITIAL_PRODUCTS = [
  {
    id: 'VJ-NECK-001',
    sku: 'VJ-GLD-NC-001',
    name: 'Imperial Mayur Royal 22K Gold Choker Set',
    category: 'Necklaces',
    collectionId: 'col-heritage',
    metal: 'Gold',
    karat: '22K (916 BIS)',
    weightGrams: 48.5,
    grossWeight: '52.2g',
    netGoldWeight: '48.5g',
    makingChargePercent: 12.5,
    price: 384500,
    originalPrice: 410000,
    inStock: true,
    stockCount: 5,
    lowStockThreshold: 2,
    featured: true,
    trending: true,
    isBestseller: true,
    rating: 4.9,
    reviewsCount: 48,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=80'
    ],
    description: 'An ethereal heirloom choker handcrafted by master artisans in 22 Karat Hallmarked Yellow Gold, adorned with handcrafted peacock motifs, filigree drops, and fine uncut polki highlights.',
    purityCertificate: 'BIS Hallmarked 916 Gold with HUID',
    dimensions: 'Adjustable Dori with 4.5cm pendant drop',
    tags: ['Bridal', 'Heirloom', '22K Gold', 'Wedding', 'Choker'],
    createdAt: '2026-02-15T10:30:00.000Z'
  },
  {
    id: 'VJ-RING-002',
    sku: 'VJ-DIA-RG-002',
    name: 'Aura Eternity 18K Rose Gold Diamond Solitaire Ring',
    category: 'Rings',
    collectionId: 'col-solitaire',
    metal: 'Diamond',
    karat: '18K Rose Gold',
    weightGrams: 4.8,
    diamondCarat: '1.25 ct (VVS1 / E-Color)',
    makingChargePercent: 8.0,
    price: 145000,
    originalPrice: 160000,
    inStock: true,
    stockCount: 12,
    lowStockThreshold: 3,
    featured: true,
    trending: true,
    isBestseller: true,
    rating: 5.0,
    reviewsCount: 82,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=900&q=80'
    ],
    description: 'A dazzling 1.25ct IGI-certified natural solitaire diamond crowned on an intricate 18K rose gold pavé band, engineered with precision for supreme sparkle and everyday elegance.',
    purityCertificate: 'IGI Certified Diamond & BIS 750 Gold',
    dimensions: 'Available in US sizes 5 to 10',
    tags: ['Engagement', 'Diamond', 'Solitaire', 'Rose Gold', 'Proposal'],
    createdAt: '2026-02-20T14:15:00.000Z'
  },
  {
    id: 'VJ-BANG-003',
    sku: 'VJ-GLD-BG-003',
    name: 'Rajwada Antique 22K Gold Kada Bangle Pair',
    category: 'Bangles',
    collectionId: 'col-temple',
    metal: 'Gold',
    karat: '22K (916 BIS)',
    weightGrams: 58.0,
    grossWeight: '58.0g',
    netGoldWeight: '58.0g',
    makingChargePercent: 11.0,
    price: 452000,
    originalPrice: 475000,
    inStock: true,
    stockCount: 2,
    lowStockThreshold: 3,
    featured: true,
    trending: false,
    isBestseller: true,
    rating: 4.9,
    reviewsCount: 31,
    image: 'https://images.unsplash.com/photo-1611591475102-468ae3901b0f?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1611591475102-468ae3901b0f?auto=format&fit=crop&w=900&q=80'
    ],
    description: 'Imposing regal Kada pair featuring traditional nakshi carving with temple floral artwork, antique vintage patina finish, and secure screw clasp closure.',
    purityCertificate: 'BIS Hallmarked 916 Gold with Unique HUID',
    dimensions: 'Size 2.4, 2.6, 2.8 available',
    tags: ['Kada', 'Traditional', 'Antique Gold', 'Temple Jewellery'],
    createdAt: '2026-02-22T11:00:00.000Z'
  },
  {
    id: 'VJ-EAR-004',
    sku: 'VJ-GLD-ER-004',
    name: 'Chandramukhi Polki & Emerald Gold Jhumkas',
    category: 'Earrings',
    collectionId: 'col-heritage',
    metal: 'Gold',
    karat: '22K (916 BIS)',
    weightGrams: 26.4,
    grossWeight: '29.1g',
    netGoldWeight: '26.4g',
    makingChargePercent: 14.0,
    price: 215000,
    originalPrice: 232000,
    inStock: true,
    stockCount: 8,
    lowStockThreshold: 3,
    featured: false,
    trending: true,
    isBestseller: true,
    rating: 4.8,
    reviewsCount: 64,
    image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?auto=format&fit=crop&w=900&q=80'
    ],
    description: 'Opulent cascading jhumkas crowned with uncut polki stones, Zambian emerald teardrops, and fine gold beads that sway gracefully with every movement.',
    purityCertificate: 'BIS Hallmarked 916 Purity Guaranteed',
    dimensions: 'Length: 6.2cm, Width: 2.8cm',
    tags: ['Jhumkas', 'Earrings', 'Polki', 'Emerald', 'Festive'],
    createdAt: '2026-03-01T09:40:00.000Z'
  },
  {
    id: 'VJ-MANG-005',
    sku: 'VJ-DIA-MG-005',
    name: 'Sutra Sacred 18K Gold & Diamond Mangalsutra',
    category: 'Mangalsutra',
    collectionId: 'col-daily',
    metal: 'Diamond',
    karat: '18K Yellow Gold',
    weightGrams: 11.2,
    diamondCarat: '0.48 ct (VS-GH)',
    makingChargePercent: 9.5,
    price: 98000,
    originalPrice: 108000,
    inStock: true,
    stockCount: 15,
    lowStockThreshold: 4,
    featured: true,
    trending: true,
    isBestseller: false,
    rating: 4.9,
    reviewsCount: 52,
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=900&q=80'
    ],
    description: 'A harmonious fusion of tradition and contemporary luxury. Dual-strand auspicious black onyx beads coupled with a geometric diamond-encrusted central pendant.',
    purityCertificate: 'SGL Certified Diamonds & BIS 750 Hallmark',
    dimensions: '18 inches length with 2-inch extender',
    tags: ['Mangalsutra', 'Daily Wear', 'Diamond', 'Modern Bride'],
    createdAt: '2026-03-05T16:20:00.000Z'
  },
  {
    id: 'VJ-BRID-006',
    sku: 'VJ-GLD-BR-006',
    name: 'Maharani Grand Heritage Bridal Set (7 Pieces)',
    category: 'Bridal Sets',
    collectionId: 'col-bridal',
    metal: 'Gold',
    karat: '22K (916 BIS)',
    weightGrams: 184.0,
    grossWeight: '198.5g',
    netGoldWeight: '184.0g',
    makingChargePercent: 15.0,
    price: 1480000,
    originalPrice: 1560000,
    inStock: true,
    stockCount: 1,
    lowStockThreshold: 2,
    featured: true,
    trending: true,
    isBestseller: true,
    rating: 5.0,
    reviewsCount: 19,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80'
    ],
    description: 'The pinnacle of bridal opulence: Complete 7-piece royal bridal collection comprising Grand Haar, Choker, Mathapatti, Matching Jhumkas, Haathphool pair, Nath, and Waist Belt (Kamarbandh).',
    purityCertificate: 'Government Approved BIS 916 Hallmark with Digital HUID Card',
    dimensions: 'Complete Bridal Suite with velvet presentation chest',
    tags: ['Bridal Set', 'Royal', 'Wedding', 'Heirloom', 'Grand Haar'],
    createdAt: '2026-03-08T18:00:00.000Z'
  },
  {
    id: 'VJ-PLAT-007',
    sku: 'VJ-PLT-RG-007',
    name: 'Celestial Nova Platinum & Diamond Couple Bands',
    category: 'Rings',
    collectionId: 'col-solitaire',
    metal: 'Platinum',
    karat: 'Pt 950 Pure Platinum',
    weightGrams: 14.5,
    diamondCarat: '0.35 ct (VVS-E)',
    makingChargePercent: 10.0,
    price: 128000,
    originalPrice: 142000,
    inStock: true,
    stockCount: 9,
    lowStockThreshold: 3,
    featured: false,
    trending: true,
    isBestseller: false,
    rating: 4.9,
    reviewsCount: 27,
    image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=900&q=80'
    ],
    description: 'Rare 95% pure platinum matching couple bands with matte brushed center finish and precision micro-prong diamond accents that symbolize rare, unbreakable love.',
    purityCertificate: 'PGI (Platinum Guild International) Certified',
    dimensions: 'Custom laser engraving available',
    tags: ['Platinum', 'Couple Bands', 'Love', 'Anniversary'],
    createdAt: '2026-03-12T12:30:00.000Z'
  },
  {
    id: 'VJ-SILV-008',
    sku: 'VJ-BLN-CN-008',
    name: 'Shree Lakshmi 24K Pure Gold Coin (50 Grams)',
    category: 'Coins & Bullion',
    collectionId: 'col-festive',
    metal: 'Gold',
    karat: '24K (999 Pure Gold)',
    weightGrams: 50.0,
    grossWeight: '50.0g',
    netGoldWeight: '50.0g',
    makingChargePercent: 3.5,
    price: 398500,
    originalPrice: 405000,
    inStock: true,
    stockCount: 25,
    lowStockThreshold: 5,
    featured: false,
    trending: false,
    isBestseller: true,
    rating: 5.0,
    reviewsCount: 110,
    image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=900&q=80'
    ],
    description: 'Tamper-proof assay blister pack 24 Karat 999.0 purity Goddess Lakshmi minted gold bullion coin with zero weight tolerance and guaranteed buyback.',
    purityCertificate: 'NABL Accredited Assay Certificate 999 Fineness',
    dimensions: 'Diameter: 32mm in sealed card',
    tags: ['Investment', '24K Gold', 'Puja', 'Bullion', 'Lakshmi Coin'],
    createdAt: '2026-03-15T15:10:00.000Z'
  }
];

export const INITIAL_CATEGORIES = [
  { id: 'Necklaces', name: 'Necklaces & Chokers', slug: 'necklaces', icon: 'gem', description: 'Royal chokers, haar sets, and diamond collars', count: 1, active: true },
  { id: 'Bridal Sets', name: 'Royal Bridal Sets', slug: 'bridal-sets', icon: 'crown', description: 'Complete 7-piece wedding suites & mathapattis', count: 1, active: true },
  { id: 'Rings', name: 'Solitaire & Bands', slug: 'rings', icon: 'circle-dot', description: 'Engagement solitaires and platinum couple bands', count: 2, active: true },
  { id: 'Bangles', name: 'Kadas & Bangles', slug: 'bangles', icon: 'circle', description: 'Antique nakshi kadas, filigree bangles, and bracelets', count: 1, active: true },
  { id: 'Earrings', name: 'Jhumkas & Drops', slug: 'earrings', icon: 'sparkle', description: 'Cascading polki jhumkas, chandbalis, and studs', count: 1, active: true },
  { id: 'Mangalsutra', name: 'Sacred Mangalsutra', slug: 'mangalsutra', icon: 'heart', description: 'Contemporary diamond & traditional gold mangalsutras', count: 1, active: true },
  { id: 'Coins & Bullion', name: '24K Gold Coins', slug: 'coins-bullion', icon: 'coins', description: '999 pure minted gold bullion coins and silver bars', count: 1, active: true }
];

export const CATEGORIES = INITIAL_CATEGORIES;

export const INITIAL_COLLECTIONS = [
  {
    id: 'col-heritage',
    name: 'The Royal Heirloom Collection 2026',
    slug: 'heritage-2026',
    description: 'Masterpieces crafted in pure 22K hallmarked gold inspired by Rajputana and Tanjore royalty.',
    banner: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80',
    itemCount: 2,
    featured: true,
    active: true
  },
  {
    id: 'col-bridal',
    name: 'Maharani Grand Bridal Suite',
    slug: 'maharani-bridal',
    description: 'High-jewellery bridal couture suites handcrafted with syndicate polki, rubies, and emeralds.',
    banner: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80',
    itemCount: 1,
    featured: true,
    active: true
  },
  {
    id: 'col-solitaire',
    name: 'Celestial Solitaires & Platinum',
    slug: 'celestial-solitaires',
    description: 'IGI certified natural solitaire diamonds set in rare Pt 950 and 18K rose gold.',
    banner: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=1200&q=80',
    itemCount: 2,
    featured: true,
    active: true
  },
  {
    id: 'col-temple',
    name: 'Antique Nakshi Temple Gold',
    slug: 'temple-gold',
    description: 'Sacred deity carvings and vintage oxidized finish heirloom ornaments.',
    banner: 'https://images.unsplash.com/photo-1611591475102-468ae3901b0f?auto=format&fit=crop&w=1200&q=80',
    itemCount: 1,
    featured: false,
    active: true
  },
  {
    id: 'col-daily',
    name: 'Everyday Royalty & Modern Chic',
    slug: 'everyday-royalty',
    description: 'Lightweight diamond mangalsutras, sleek cuffs, and minimal pendants.',
    banner: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=80',
    itemCount: 1,
    featured: false,
    active: true
  },
  {
    id: 'col-festive',
    name: 'Akshaya Bullion & Sovereign Vault',
    slug: 'akshaya-bullion',
    description: 'Assay-certified 24K 999 fineness Lakshmi & Ganesha gold coins for prosperous investments.',
    banner: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1200&q=80',
    itemCount: 1,
    featured: false,
    active: true
  }
];

export const INITIAL_COUPONS = [
  {
    id: 'CPN-001',
    code: 'VAISHU10',
    type: 'percentage',
    discountPercent: 10,
    maxDiscount: 25000,
    minOrderValue: 50000,
    description: '10% Royal Welcome Discount on all gold & diamond jewellery',
    validUntil: '2026-12-31',
    usageCount: 42,
    usageLimit: 500,
    active: true
  },
  {
    id: 'CPN-002',
    code: 'GOLD2026',
    type: 'flat',
    flatDiscount: 5000,
    minOrderValue: 75000,
    description: 'Flat ₹5,000 Akshaya Gold Voucher',
    validUntil: '2026-11-30',
    usageCount: 88,
    usageLimit: 1000,
    active: true
  },
  {
    id: 'CPN-003',
    code: 'BRIDAL50K',
    type: 'flat',
    flatDiscount: 50000,
    minOrderValue: 500000,
    description: '₹50,000 Grand Wedding Suite Rebate on Complete Sets',
    validUntil: '2026-12-31',
    usageCount: 14,
    usageLimit: 100,
    active: true
  },
  {
    id: 'CPN-004',
    code: 'ROYALVIP',
    type: 'percentage',
    discountPercent: 15,
    maxDiscount: 75000,
    minOrderValue: 200000,
    description: '15% Privilege Club Rebate for Platinum Tier Patrons',
    validUntil: '2027-01-01',
    usageCount: 29,
    usageLimit: 200,
    active: true
  }
];

export const INITIAL_BANNERS = [
  {
    id: 'BAN-001',
    title: 'The Royal Heirloom Collection 2026',
    subtitle: 'Handcrafted in 22K Solid Gold & Certified Syndicate Polki',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1400&q=80',
    ctaText: 'Explore Grand Vault',
    ctaLink: '#shop',
    position: 'hero',
    order: 1,
    active: true
  },
  {
    id: 'BAN-002',
    title: 'Maharani Bespoke Bridal Suite',
    subtitle: '7-Piece Regal Wedding Sets with Lifetime Buyback & Insurance',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1400&q=80',
    ctaText: 'Book Private Stylist',
    ctaLink: '#bridal',
    position: 'hero',
    order: 2,
    active: true
  },
  {
    id: 'BAN-003',
    title: 'Akshaya Bullion Special: 0% Making on Gold Coins',
    subtitle: '24K 999 Pure Minted Gold with NABL Assay Certification',
    image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=1400&q=80',
    ctaText: 'Buy Pure Bullion',
    ctaLink: '#shop',
    position: 'promotional',
    order: 3,
    active: true
  }
];

export const INITIAL_REVIEWS = [
  {
    id: 'REV-001',
    productId: 'VJ-NECK-001',
    productName: 'Imperial Mayur Royal 22K Gold Choker Set',
    userName: 'Princess Gayatri Rao',
    userEmail: 'gayatri.rao@royalmail.com',
    rating: 5,
    verifiedPurchase: true,
    title: 'Breathtaking craftsmanship & authentic 916 purity',
    comment: 'Wore this choker for my reception in Udaipur. The nakshi peacock details and weight feel majestic. The HUID hallmark was verified instantly via BIS Care app!',
    status: 'approved',
    featured: true,
    createdAt: '2026-03-02T14:20:00.000Z'
  },
  {
    id: 'REV-002',
    productId: 'VJ-RING-002',
    productName: 'Aura Eternity 18K Rose Gold Diamond Solitaire Ring',
    userName: 'Vikramaditya Singhania',
    userEmail: 'vikram.singhania@apexcorp.in',
    rating: 5,
    verifiedPurchase: true,
    title: 'Perfect engagement ring with brilliant sparkle',
    comment: 'The 1.25ct solitaire came with a laser-inscribed IGI certificate. The rose gold shine is sublime. Delivered securely in an armoured pouch with OTP.',
    status: 'approved',
    featured: true,
    createdAt: '2026-03-10T11:45:00.000Z'
  },
  {
    id: 'REV-003',
    productId: 'VJ-BRID-006',
    productName: 'Maharani Grand Heritage Bridal Set (7 Pieces)',
    userName: 'Devika Mehra',
    userEmail: 'devika.mehra@gmail.com',
    rating: 5,
    verifiedPurchase: true,
    title: 'A true heirloom worth every rupee',
    comment: 'The 7-piece bridal suite arrived in a rich velvet presentation chest with individual assay report cards. Unmatched craftsmanship!',
    status: 'approved',
    featured: true,
    createdAt: '2026-03-14T09:15:00.000Z'
  }
];

export const INITIAL_CUSTOMERS = [
  {
    id: 'CUST-001',
    uid: 'demo_cust_101',
    displayName: 'Maharani Gayatri Rao',
    email: 'gayatri.rao@royalmail.com',
    phone: '+91 98200 11223',
    city: 'Mumbai',
    state: 'Maharashtra',
    tier: 'Platinum VIP',
    totalOrders: 3,
    totalSpend: 1964500,
    role: 'customer',
    status: 'active',
    createdAt: '2025-11-12T08:00:00.000Z'
  },
  {
    id: 'CUST-002',
    uid: 'demo_cust_102',
    displayName: 'Vikramaditya Singhania',
    email: 'vikram.singhania@apexcorp.in',
    phone: '+91 98111 22334',
    city: 'New Delhi',
    state: 'Delhi',
    tier: 'Gold Patron',
    totalOrders: 2,
    totalSpend: 543500,
    role: 'customer',
    status: 'active',
    createdAt: '2025-12-05T14:30:00.000Z'
  },
  {
    id: 'CUST-003',
    uid: 'demo_cust_103',
    displayName: 'Ananya Deshmukh',
    email: 'ananya.d@luxurymail.com',
    phone: '+91 97654 33221',
    city: 'Pune',
    state: 'Maharashtra',
    tier: 'Royal Patron',
    totalOrders: 1,
    totalSpend: 215000,
    role: 'customer',
    status: 'active',
    createdAt: '2026-01-18T10:15:00.000Z'
  },
  {
    id: 'CUST-004',
    uid: 'demo_cust_104',
    displayName: 'Devika Mehra',
    email: 'devika.mehra@gmail.com',
    phone: '+91 99887 76655',
    city: 'Bengaluru',
    state: 'Karnataka',
    tier: 'Platinum VIP',
    totalOrders: 1,
    totalSpend: 1480000,
    role: 'customer',
    status: 'active',
    createdAt: '2026-02-01T16:40:00.000Z'
  }
];

export const INITIAL_ORDERS = [
  {
    id: 'VJ-ORD-2026-881920',
    orderId: 'VJ-ORD-2026-881920',
    trackingNumber: 'VJ-SECURE-9A8B7C',
    userId: 'demo_cust_101',
    customerName: 'Maharani Gayatri Rao',
    customerEmail: 'gayatri.rao@royalmail.com',
    customerPhone: '+91 98200 11223',
    items: [
      {
        id: 'VJ-NECK-001',
        name: 'Imperial Mayur Royal 22K Gold Choker Set',
        price: 384500,
        quantity: 1,
        selectedSize: 'Standard',
        karat: '22K (916 BIS)',
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80'
      }
    ],
    shippingAddress: {
      fullName: 'Maharani Gayatri Rao',
      addressLine1: 'Palace Suite 402, Marine Drive',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400020',
      phone: '+91 98200 11223'
    },
    payment: {
      method: 'UPI',
      status: 'Paid & Secured in Escrow',
      transactionId: 'TXN_ROYAL_99812',
      subtotal: 384500,
      discount: 25000,
      gst: 10785,
      shipping: 0,
      grandTotal: 370285
    },
    status: 'Insured Transit',
    insurancePolicyNumber: 'NEW-INDIA-ASSUR-8839210',
    specialInstructions: 'Please deliver only after telephonic confirmation with security desk.',
    createdAt: '2026-03-20T10:00:00.000Z'
  },
  {
    id: 'VJ-ORD-2026-773419',
    orderId: 'VJ-ORD-2026-773419',
    trackingNumber: 'VJ-SECURE-4K2M1P',
    userId: 'demo_cust_102',
    customerName: 'Vikramaditya Singhania',
    customerEmail: 'vikram.singhania@apexcorp.in',
    customerPhone: '+91 98111 22334',
    items: [
      {
        id: 'VJ-RING-002',
        name: 'Aura Eternity 18K Rose Gold Diamond Solitaire Ring',
        price: 145000,
        quantity: 1,
        selectedSize: 'Size 2.6 / Ring US 7',
        karat: '18K Rose Gold',
        image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=80'
      },
      {
        id: 'VJ-SILV-008',
        name: 'Shree Lakshmi 24K Pure Gold Coin (50 Grams)',
        price: 398500,
        quantity: 1,
        selectedSize: 'Standard',
        karat: '24K (999 Pure Gold)',
        image: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?auto=format&fit=crop&w=900&q=80'
      }
    ],
    shippingAddress: {
      fullName: 'Vikramaditya Singhania',
      addressLine1: 'Singhania Tower, Golf Links',
      city: 'New Delhi',
      state: 'Delhi',
      pincode: '110003',
      phone: '+91 98111 22334'
    },
    payment: {
      method: 'Card',
      status: 'Paid & Secured in Escrow',
      transactionId: 'TXN_CARD_771822',
      subtotal: 543500,
      discount: 5000,
      gst: 16155,
      shipping: 0,
      grandTotal: 554655
    },
    status: 'Under Crafting & Hallmarking',
    insurancePolicyNumber: 'NEW-INDIA-ASSUR-7734192',
    specialInstructions: 'Laser engrave initials V & S inside ring.',
    createdAt: '2026-03-24T14:30:00.000Z'
  },
  {
    id: 'VJ-ORD-2026-662910',
    orderId: 'VJ-ORD-2026-662910',
    trackingNumber: 'VJ-SECURE-3D9F8E',
    userId: 'demo_cust_104',
    customerName: 'Devika Mehra',
    customerEmail: 'devika.mehra@gmail.com',
    customerPhone: '+91 99887 76655',
    items: [
      {
        id: 'VJ-BRID-006',
        name: 'Maharani Grand Heritage Bridal Set (7 Pieces)',
        price: 1480000,
        quantity: 1,
        selectedSize: 'Bridal Suite',
        karat: '22K (916 BIS)',
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80'
      }
    ],
    shippingAddress: {
      fullName: 'Devika Mehra',
      addressLine1: 'Lavelle Enclave, Villa 9',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560001',
      phone: '+91 99887 76655'
    },
    payment: {
      method: 'UPI',
      status: 'Paid & Secured in Escrow',
      transactionId: 'TXN_ROYAL_662910',
      subtotal: 1480000,
      discount: 50000,
      gst: 42900,
      shipping: 0,
      grandTotal: 1472900
    },
    status: 'Delivered',
    insurancePolicyNumber: 'NEW-INDIA-ASSUR-6629104',
    specialInstructions: 'Hand delivered in velvet presentation chest with insurance certificates.',
    createdAt: '2026-03-15T09:00:00.000Z'
  }
];

export const LIVE_RATES = {
  gold24k: 7850, // INR per gram
  gold22k: 7200, // INR per gram (91.6% pure)
  gold18k: 5890, // INR per gram (75% pure)
  silver: 94.5,  // INR per gram (99.9% pure)
  platinum: 3450, // INR per gram (Pt950)
  gstPercent: 3.0,
  lastUpdated: 'Live from MCX Bullion Market'
};

export const STORE_SETTINGS = {
  storeName: 'VAISHU JEWELLERY LIMITED',
  storeTagline: 'Royal Indian Heritage Jewellery & Bullion Merchants',
  supportEmail: 'vip@vaishujewellery.com',
  supportPhone: '+91 (022) 8900-VAISHU',
  storeAddress: 'Vaishu Tower, Heritage Boulevard, Mumbai 400001',
  currency: 'INR (₹)',
  gstPercent: 3.0,
  freeShippingThreshold: 10000,
  transitCarrier: 'Brink’s Armoured Vault Logistics',
  bisLicenseNumber: 'BIS/HM/916/MH/2026/0994',
  enableGuestCheckout: true,
  enableLiveRatesSync: true
};

export const DEFAULT_HOMEPAGE_CMS = {
  hero: {
    enabled: true,
    order: 1,
    badgeText: 'The Royal Heirloom Collection 2026',
    heading: 'Crafted in Pure 22K Gold & Solitaire Radiance',
    subheading: 'Experience the pinnacle of royal heritage craftsmanship. Handcrafted temple chokers, certified diamond solitaires, and BIS 916 hallmarked masterpieces designed for timeless royalty.',
    cta1Text: 'Explore Grand Vault',
    cta1Link: '#shop',
    cta2Text: 'Bridal Lounge',
    cta2Link: '#bridal',
    desktopImage: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80',
    mobileImage: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
    floatingCardTitle: 'Imperial Mayur Collection',
    floatingCardSubtitle: 'Handcrafted in 22K Solid Gold'
  },
  trustPillars: {
    enabled: true,
    order: 2,
    pillar1Title: 'BIS 916 Hallmark with HUID',
    pillar1Desc: 'Every gram of gold is certified and authenticated by Government of India testing assays.',
    pillar2Title: 'IGI & SGL Certified Diamonds',
    pillar2Desc: 'Conflict-free, laser-inscribed natural diamonds with supreme cut, clarity and color.',
    pillar3Title: '100% Insured Armoured Transit',
    pillar3Desc: 'Doorstep delivery in tamper-evident sealed security vaults with comprehensive transit insurance.',
    pillar4Title: 'Guaranteed Lifetime Buyback',
    pillar4Desc: 'Transparent exchange & buyback at prevailing bullion market rates anytime.'
  },
  categoriesSection: {
    enabled: true,
    order: 3,
    badgeText: 'Explore by Category',
    heading: 'Curated Royal Suites',
    viewAllLinkText: 'View All Categories →',
    featuredCategoryIds: ['Necklaces', 'Bridal Sets', 'Rings', 'Bangles', 'Earrings', 'Mangalsutra', 'Coins & Bullion']
  },
  bestsellersSection: {
    enabled: true,
    order: 4,
    badgeText: 'Timeless Icons',
    heading: 'Crown Jewels & Bestsellers',
    subheading: 'Our most coveted signature designs, cherished by royal patrons worldwide.',
    maxItems: 4,
    featuredProductIds: ['VJ-NECK-001', 'VJ-RING-002', 'VJ-BANG-003', 'VJ-EAR-004']
  },
  goldCalculatorSection: {
    enabled: true,
    order: 5,
    badgeText: 'TRANSPARENCY GUARANTEE',
    heading: 'Live Gold & Jewellery Price Estimator',
    subheading: 'Calculate exact price based on today\'s official bullion rate, gold weight & making charges with 0% hidden fees.'
  },
  bridalSpotlightSection: {
    enabled: true,
    order: 6,
    badgeText: 'Maharani Bridal Suite',
    heading: 'Bespoke Wedding Jewellery for the Royal Indian Bride',
    subheading: 'Crafted over 300 artisan hours with uncut syndicate polki, Burmese rubies, and Colombian emeralds set in solid 22K hallmarked gold.',
    ctaText: 'Book a Bridal Concierge Appointment',
    ctaLink: '#bridal',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=900&q=80'
  }
};
