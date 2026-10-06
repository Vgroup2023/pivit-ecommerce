/**
 * PIVIT Fishing Product Catalog
 * Premium fishing jigs, lures, and tackle
 */

export interface PIVITProduct {
  id: string;
  name: string;
  sku: string;
  category: 'jigs' | 'lures' | 'hooks' | 'tackle' | 'apparel';
  price: number;
  stock: number;
  description: string;
  features: string[];
  images: string[];
  weight?: string;
  colors?: string[];
  size?: string;
  createdAt: string;
}

export const pivitProducts: PIVITProduct[] = [
  {
    id: 'prod-001',
    name: 'Premium Precision Jig Head - 1/4 oz',
    sku: 'JH-PPC-025',
    category: 'jigs',
    price: 12.99,
    stock: 150,
    description: 'Engineered precision jig heads with premium construction. Perfect for finesse fishing in freshwater and saltwater applications.',
    features: [
      'Precision-molded for consistency',
      'Sharp, durable hooks',
      'Streamlined design for better casting',
      'Suitable for soft plastics and live bait',
    ],
    images: ['https://via.placeholder.com/300?text=Precision+Jig+1/4oz'],
    weight: '1/4 oz',
    colors: ['Chartreuse', 'White', 'Black'],
    size: 'Standard',
    createdAt: '2024-01-15',
  },
  {
    id: 'prod-002',
    name: 'Heavy-Duty Bucktail Jig - 3/8 oz',
    sku: 'JH-BKT-038',
    category: 'jigs',
    price: 14.99,
    stock: 120,
    description: 'Durable bucktail jigs designed for aggressive saltwater fishing. Features premium deer hair and reinforced construction.',
    features: [
      'Real bucktail construction',
      'UV-enhanced colors',
      'Reinforced eyelet design',
      'Great for striped bass and bluefish',
    ],
    images: ['https://via.placeholder.com/300?text=Bucktail+Jig+3/8oz'],
    weight: '3/8 oz',
    colors: ['Red/White', 'Black/Yellow', 'Natural'],
    size: 'Standard',
    createdAt: '2024-01-15',
  },
  {
    id: 'prod-003',
    name: 'Crappie Master Mini Jigs - Pack of 10',
    sku: 'JH-CRM-PACK',
    category: 'jigs',
    price: 9.99,
    stock: 200,
    description: 'Ultra-small jigs perfect for panfish and crappie fishing. Professional-grade construction in a convenient 10-pack.',
    features: [
      'Ideal crappie size',
      'Precision head design',
      '10-pack convenience',
      'Cost-effective bulk option',
    ],
    images: ['https://via.placeholder.com/300?text=Crappie+Mini+Jigs'],
    weight: '1/16 oz',
    colors: ['Mixed colors'],
    size: 'Mini',
    createdAt: '2024-01-15',
  },
  {
    id: 'prod-004',
    name: 'Realistic Crawfish Lure - Sinking',
    sku: 'LR-CWF-SINK',
    category: 'lures',
    price: 16.99,
    stock: 85,
    description: 'Hyper-realistic crawfish lure with detailed segmentation and natural coloring. Sinking design for bottom fishing.',
    features: [
      'Hyper-realistic paint detail',
      'Natural movement in water',
      'Sinking design for depth control',
      'Professional 3D eye design',
    ],
    images: ['https://via.placeholder.com/300?text=Crawfish+Lure+Sinking'],
    weight: '3/4 oz',
    colors: ['Brown', 'Orange', 'Green'],
    size: '3.5 inches',
    createdAt: '2024-01-20',
  },
  {
    id: 'prod-005',
    name: 'Vibrating Blade Spoon - 1/2 oz',
    sku: 'LR-VBS-050',
    category: 'lures',
    price: 13.99,
    stock: 110,
    description: 'High-vibration spoon lure that attracts predatory fish from great distances. Excellent for pike and musky.',
    features: [
      'High-frequency vibration',
      'Sharp treble hooks',
      'Polished finish for flash',
      'Versatile shallow to deep water',
    ],
    images: ['https://via.placeholder.com/300?text=Vibrating+Blade+Spoon'],
    weight: '1/2 oz',
    colors: ['Silver', 'Copper', 'Gold'],
    size: 'Standard',
    createdAt: '2024-01-20',
  },
  {
    id: 'prod-006',
    name: 'Topwater Popper - Floating',
    sku: 'LR-TOP-FLOAT',
    category: 'lures',
    price: 11.99,
    stock: 95,
    description: 'Classic topwater popper for explosive surface strikes. Perfect for bass and pike in shallow water.',
    features: [
      'Realistic topwater action',
      'High-floating design',
      'Built-in rattles for attraction',
      'Premium paint scheme',
    ],
    images: ['https://via.placeholder.com/300?text=Topwater+Popper'],
    weight: '1/2 oz',
    colors: ['Frog', 'Chartreuse', 'White'],
    size: '2.5 inches',
    createdAt: '2024-01-20',
  },
  {
    id: 'prod-007',
    name: 'Titanium Fishing Hooks - Pack of 50',
    sku: 'HK-TI-050',
    category: 'hooks',
    price: 8.99,
    stock: 300,
    description: 'Premium titanium fishing hooks with superior strength-to-weight ratio. Ideal for all freshwater and saltwater applications.',
    features: [
      'Titanium alloy construction',
      'Extra sharp points',
      'Rust-resistant',
      '50-pack bulk option',
    ],
    images: ['https://via.placeholder.com/300?text=Titanium+Hooks'],
    weight: 'Varies by size',
    colors: ['Silver'],
    size: 'Mixed sizes (1/0 to 4/0)',
    createdAt: '2024-01-25',
  },
  {
    id: 'prod-008',
    name: 'Circle Hooks - Circle Point Design',
    sku: 'HK-CIRC-100',
    category: 'hooks',
    price: 9.99,
    stock: 250,
    description: 'Professional circle hooks with advanced point design for improved hooksets. 100-pack for maximum value.',
    features: [
      'Circle point design hooks fish lip',
      'Reduced gut-hooking',
      'Perfect for live bait',
      '100-pack economy option',
    ],
    images: ['https://via.placeholder.com/300?text=Circle+Hooks'],
    weight: 'Lightweight',
    colors: ['Silver', 'Black'],
    size: 'Various (3/0 to 8/0)',
    createdAt: '2024-01-25',
  },
  {
    id: 'prod-009',
    name: 'Premium Braided Fishing Line - 50lb',
    sku: 'TKL-BRAID-50',
    category: 'tackle',
    price: 19.99,
    stock: 60,
    description: 'High-quality braided fishing line with zero-stretch construction. 300-yard spool of premium 50lb test.',
    features: [
      'Zero-stretch construction',
      'Superior sensitivity',
      '300-yard spool',
      'Thin diameter for less resistance',
    ],
    images: ['https://via.placeholder.com/300?text=Braided+Line+50lb'],
    weight: 'Lightweight spool',
    colors: ['Moss Green', 'Gray'],
    size: '50lb test, 300 yards',
    createdAt: '2024-02-01',
  },
  {
    id: 'prod-010',
    name: 'Professional Tackle Box Organizer',
    sku: 'TKL-BOX-ORG',
    category: 'tackle',
    price: 34.99,
    stock: 45,
    description: 'Waterproof tackle box with customizable compartments. Ideal for organizing jigs, lures, and small tackle.',
    features: [
      'Waterproof construction',
      'Adjustable compartments',
      'Heavy-duty latches',
      'Comfortable carrying handle',
    ],
    images: ['https://via.placeholder.com/300?text=Tackle+Box+Organizer'],
    weight: '2.5 lbs',
    colors: ['Black', 'Camo'],
    size: '16x10x4 inches',
    createdAt: '2024-02-01',
  },
  {
    id: 'prod-011',
    name: 'PIVIT Logo Performance Fishing Shirt',
    sku: 'AP-SHIRT-PERF',
    category: 'apparel',
    price: 39.99,
    stock: 80,
    description: 'Moisture-wicking performance shirt with PIVIT logo. Perfect for all-day fishing comfort.',
    features: [
      'Moisture-wicking fabric',
      'UV protection (UPF 50+)',
      'Quick-dry technology',
      'Breathable mesh panels',
    ],
    images: ['https://via.placeholder.com/300?text=PIVIT+Performance+Shirt'],
    weight: 'Lightweight',
    colors: ['Navy', 'Charcoal', 'Camo'],
    size: 'XS, S, M, L, XL, XXL',
    createdAt: '2024-02-05',
  },
  {
    id: 'prod-012',
    name: 'PIVIT Premium Fishing Hat - Adjustable',
    sku: 'AP-HAT-ADJ',
    category: 'apparel',
    price: 24.99,
    stock: 120,
    description: 'Premium adjustable fishing hat with curved bill and PIVIT embroidery. 100% cotton construction.',
    features: [
      '100% cotton construction',
      'Curved bill design',
      'PIVIT embroidery',
      'Adjustable back strap',
    ],
    images: ['https://via.placeholder.com/300?text=PIVIT+Hat+Adjustable'],
    weight: 'Lightweight',
    colors: ['Navy', 'Khaki', 'Black'],
    size: 'One size fits most',
    createdAt: '2024-02-05',
  },
  {
    id: 'prod-013',
    name: 'Hybrid Fishing Gloves - Neoprene/Mesh',
    sku: 'AP-GLOVE-HYB',
    category: 'apparel',
    price: 29.99,
    stock: 70,
    description: 'Hybrid neoprene and mesh gloves for superior grip and comfort. Perfect for warm and cool weather fishing.',
    features: [
      'Hybrid neoprene/mesh construction',
      'Anti-slip palm grip',
      'Breathable design',
      'Durable reinforced stitching',
    ],
    images: ['https://via.placeholder.com/300?text=Hybrid+Gloves'],
    weight: 'Lightweight',
    colors: ['Black', 'Gray/Black'],
    size: 'S, M, L, XL',
    createdAt: '2024-02-05',
  },
];

/**
 * Get all products
 */
export function getAllProducts(): PIVITProduct[] {
  return pivitProducts;
}

/**
 * Get products by category
 */
export function getProductsByCategory(category: PIVITProduct['category']): PIVITProduct[] {
  return pivitProducts.filter((p) => p.category === category);
}

/**
 * Get single product by ID
 */
export function getProductById(id: string): PIVITProduct | undefined {
  return pivitProducts.find((p) => p.id === id);
}

/**
 * Get product statistics
 */
export function getProductStats() {
  return {
    totalProducts: pivitProducts.length,
    totalInventory: pivitProducts.reduce((sum, p) => sum + p.stock, 0),
    totalValue: pivitProducts.reduce((sum, p) => sum + p.price * p.stock, 0),
    byCategory: pivitProducts.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    lowStockItems: pivitProducts.filter((p) => p.stock < 50),
  };
}
