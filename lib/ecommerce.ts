import AsyncStorage from "@react-native-async-storage/async-storage";

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: "supplements" | "apparel" | "equipment";
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  description: string;
  affiliateUrl: string;
  commission: number; // Percentage
  rating: number;
  reviews: number;
  tags: string[];
  inStock: boolean;
}

export interface Purchase {
  id: string;
  productId: string;
  userId: string;
  amount: number;
  commission: number;
  date: Date;
  status: "pending" | "confirmed" | "cancelled";
}

export interface UserPoints {
  total: number;
  earned: number;
  spent: number;
  tier: "bronze" | "silver" | "gold" | "platinum";
}

// Mock product database - In production, this would come from API
export const PRODUCTS: Product[] = [
  // SUPLEMENTOS
  {
    id: "sup-001",
    name: "Whey Protein Isolado 900g",
    brand: "Max Titanium",
    category: "supplements",
    price: 149.90,
    originalPrice: 189.90,
    discount: 21,
    image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400",
    description: "Proteína isolada de alta qualidade com 90% de pureza. Ideal para ganho de massa muscular.",
    affiliateUrl: "https://maxti.com.br/whey-isolado?ref=healthfit",
    commission: 12,
    rating: 4.8,
    reviews: 1247,
    tags: ["proteína", "massa muscular", "pós-treino"],
    inStock: true,
  },
  {
    id: "sup-002",
    name: "Creatina Monohidratada 300g",
    brand: "Growth Supplements",
    category: "supplements",
    price: 89.90,
    image: "https://images.unsplash.com/photo-1579722820308-d74e571900a9?w=400",
    description: "Creatina pura 100% monohidratada. Aumenta força e performance.",
    affiliateUrl: "https://www.gsuplementos.com.br/creatina?ref=healthfit",
    commission: 15,
    rating: 4.9,
    reviews: 2103,
    tags: ["creatina", "força", "performance"],
    inStock: true,
  },
  {
    id: "sup-003",
    name: "BCAA 2:1:1 - 120 Cápsulas",
    brand: "Integralmedica",
    category: "supplements",
    price: 79.90,
    originalPrice: 99.90,
    discount: 20,
    image: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=400",
    description: "Aminoácidos essenciais para recuperação muscular e anti-catabolismo.",
    affiliateUrl: "https://www.integralmedica.com.br/bcaa?ref=healthfit",
    commission: 10,
    rating: 4.7,
    reviews: 856,
    tags: ["bcaa", "recuperação", "aminoácidos"],
    inStock: true,
  },
  {
    id: "sup-004",
    name: "Multivitamínico Premium",
    brand: "Vitafor",
    category: "supplements",
    price: 119.90,
    image: "https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=400",
    description: "Complexo vitamínico completo com 27 nutrientes essenciais.",
    affiliateUrl: "https://www.vitafor.com.br/multi?ref=healthfit",
    commission: 12,
    rating: 4.6,
    reviews: 634,
    tags: ["vitaminas", "saúde", "imunidade"],
    inStock: true,
  },
  {
    id: "sup-005",
    name: "Colágeno Hidrolisado 250g",
    brand: "Sanavita",
    category: "supplements",
    price: 69.90,
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400",
    description: "Colágeno tipo 1 para pele, cabelos e articulações.",
    affiliateUrl: "https://www.sanavita.com.br/colageno?ref=healthfit",
    commission: 14,
    rating: 4.8,
    reviews: 1521,
    tags: ["colágeno", "pele", "articulações"],
    inStock: true,
  },

  // VESTUÁRIO
  {
    id: "app-001",
    name: "Legging High-Waist Seamless",
    brand: "Alo Yoga",
    category: "apparel",
    price: 389.90,
    image: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=400",
    description: "Legging sem costura de alta compressão. Tecnologia anti-suor e modelagem perfeita.",
    affiliateUrl: "https://www.aloyoga.com/legging-seamless?ref=healthfit",
    commission: 8,
    rating: 4.9,
    reviews: 3421,
    tags: ["legging", "yoga", "treino"],
    inStock: true,
  },
  {
    id: "app-002",
    name: "Top Esportivo Energy Bra",
    brand: "Lululemon",
    category: "apparel",
    price: 289.90,
    originalPrice: 349.90,
    discount: 17,
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400",
    description: "Sutiã esportivo de alta sustentação. Ideal para treinos intensos.",
    affiliateUrl: "https://shop.lululemon.com/energy-bra?ref=healthfit",
    commission: 10,
    rating: 4.8,
    reviews: 2876,
    tags: ["top", "sutiã esportivo", "sustentação"],
    inStock: true,
  },
  {
    id: "app-003",
    name: "Tênis de Corrida Cloudstratus",
    brand: "On Running",
    category: "apparel",
    price: 1099.90,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
    description: "Tênis premium com dupla camada de CloudTec para máximo amortecimento.",
    affiliateUrl: "https://www.on-running.com/cloudstratus?ref=healthfit",
    commission: 7,
    rating: 4.9,
    reviews: 1654,
    tags: ["tênis", "corrida", "amortecimento"],
    inStock: true,
  },
  {
    id: "app-004",
    name: "Jaqueta Corta-Vento Define",
    brand: "Lululemon",
    category: "apparel",
    price: 699.90,
    image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=400",
    description: "Jaqueta leve e respirável com proteção UV. Perfeita para corridas ao ar livre.",
    affiliateUrl: "https://shop.lululemon.com/define-jacket?ref=healthfit",
    commission: 10,
    rating: 4.7,
    reviews: 987,
    tags: ["jaqueta", "corrida", "outdoor"],
    inStock: true,
  },
  {
    id: "app-005",
    name: "Short de Compressão Pro",
    brand: "Nike",
    category: "apparel",
    price: 189.90,
    image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400",
    description: "Short de compressão Dri-FIT para máxima performance.",
    affiliateUrl: "https://www.nike.com.br/short-pro?ref=healthfit",
    commission: 6,
    rating: 4.6,
    reviews: 1234,
    tags: ["short", "compressão", "treino"],
    inStock: true,
  },

  // EQUIPAMENTOS
  {
    id: "equ-001",
    name: "Apple Watch Series 9 GPS",
    brand: "Apple",
    category: "equipment",
    price: 4299.00,
    image: "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=400",
    description: "Smartwatch com monitoramento avançado de saúde e fitness.",
    affiliateUrl: "https://www.apple.com/br/watch?ref=healthfit",
    commission: 3,
    rating: 4.9,
    reviews: 8765,
    tags: ["smartwatch", "monitoramento", "saúde"],
    inStock: true,
  },
  {
    id: "equ-002",
    name: "Theragun Elite Massageador",
    brand: "Therabody",
    category: "equipment",
    price: 2499.00,
    originalPrice: 2999.00,
    discount: 17,
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400",
    description: "Massageador de percussão profissional para recuperação muscular.",
    affiliateUrl: "https://www.therabody.com/theragun-elite?ref=healthfit",
    commission: 12,
    rating: 4.8,
    reviews: 3421,
    tags: ["massageador", "recuperação", "theragun"],
    inStock: true,
  },
  {
    id: "equ-003",
    name: "Tapete de Yoga Premium 5mm",
    brand: "Manduka",
    category: "equipment",
    price: 549.90,
    image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400",
    description: "Tapete ecológico de alta aderência. Garantia vitalícia.",
    affiliateUrl: "https://www.manduka.com/pro-mat?ref=healthfit",
    commission: 15,
    rating: 4.9,
    reviews: 2103,
    tags: ["yoga", "tapete", "ecológico"],
    inStock: true,
  },
  {
    id: "equ-004",
    name: "Halteres Ajustáveis 24kg",
    brand: "Bowflex",
    category: "equipment",
    price: 3299.00,
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400",
    description: "Sistema de halteres ajustáveis de 2.5kg a 24kg. Economiza espaço.",
    affiliateUrl: "https://www.bowflex.com/adjustable-dumbbells?ref=healthfit",
    commission: 10,
    rating: 4.7,
    reviews: 1876,
    tags: ["halteres", "musculação", "home gym"],
    inStock: true,
  },
  {
    id: "equ-005",
    name: "Rolo de Liberação Miofascial",
    brand: "Hyperice",
    category: "equipment",
    price: 449.90,
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400",
    description: "Rolo vibratório com 3 velocidades para recuperação muscular.",
    affiliateUrl: "https://hyperice.com/vyper-roller?ref=healthfit",
    commission: 14,
    rating: 4.8,
    reviews: 1543,
    tags: ["rolo", "liberação", "recuperação"],
    inStock: true,
  },
];

// E-commerce functions
export const ecommerceService = {
  // Get all products
  getAllProducts: async (): Promise<Product[]> => {
    return PRODUCTS;
  },

  // Get products by category
  getProductsByCategory: async (category: Product["category"]): Promise<Product[]> => {
    return PRODUCTS.filter((p) => p.category === category);
  },

  // Get featured products (best sellers)
  getFeaturedProducts: async (limit: number = 6): Promise<Product[]> => {
    return PRODUCTS.sort((a, b) => b.reviews - a.reviews).slice(0, limit);
  },

  // Get personalized recommendations based on user data
  getPersonalizedRecommendations: async (userGoals: string[], limit: number = 4): Promise<Product[]> => {
    // Simple recommendation logic - in production, use ML
    const recommendations = PRODUCTS.filter((product) => {
      return product.tags.some((tag) => 
        userGoals.some((goal) => goal.toLowerCase().includes(tag.toLowerCase()))
      );
    });
    return recommendations.slice(0, limit);
  },

  // Track purchase
  trackPurchase: async (productId: string, userId: string): Promise<void> => {
    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product) return;

    const purchase: Purchase = {
      id: `pur-${Date.now()}`,
      productId,
      userId,
      amount: product.price,
      commission: (product.price * product.commission) / 100,
      date: new Date(),
      status: "pending",
    };

    // Save purchase
    const purchases = await AsyncStorage.getItem("purchases");
    const purchaseList: Purchase[] = purchases ? JSON.parse(purchases) : [];
    purchaseList.push(purchase);
    await AsyncStorage.setItem("purchases", JSON.stringify(purchaseList));

    // Award points (1 point per R$ 10)
    const points = Math.floor(product.price / 10);
    await ecommerceService.addPoints(userId, points);
  },

  // Points system
  getUserPoints: async (userId: string): Promise<UserPoints> => {
    const pointsData = await AsyncStorage.getItem(`points-${userId}`);
    if (!pointsData) {
      return { total: 0, earned: 0, spent: 0, tier: "bronze" };
    }
    return JSON.parse(pointsData);
  },

  addPoints: async (userId: string, points: number): Promise<void> => {
    const currentPoints = await ecommerceService.getUserPoints(userId);
    const newPoints: UserPoints = {
      total: currentPoints.total + points,
      earned: currentPoints.earned + points,
      spent: currentPoints.spent,
      tier: ecommerceService.calculateTier(currentPoints.total + points),
    };
    await AsyncStorage.setItem(`points-${userId}`, JSON.stringify(newPoints));
  },

  redeemPoints: async (userId: string, points: number): Promise<boolean> => {
    const currentPoints = await ecommerceService.getUserPoints(userId);
    if (currentPoints.total < points) return false;

    const newPoints: UserPoints = {
      total: currentPoints.total - points,
      earned: currentPoints.earned,
      spent: currentPoints.spent + points,
      tier: ecommerceService.calculateTier(currentPoints.total - points),
    };
    await AsyncStorage.setItem(`points-${userId}`, JSON.stringify(newPoints));
    return true;
  },

  calculateTier: (points: number): UserPoints["tier"] => {
    if (points >= 10000) return "platinum";
    if (points >= 5000) return "gold";
    if (points >= 2000) return "silver";
    return "bronze";
  },

  // Get cashback percentage based on tier
  getCashbackRate: (tier: UserPoints["tier"]): number => {
    const rates = {
      bronze: 2,
      silver: 3,
      gold: 5,
      platinum: 8,
    };
    return rates[tier];
  },

  // Analytics
  getTotalRevenue: async (): Promise<number> => {
    const purchases = await AsyncStorage.getItem("purchases");
    if (!purchases) return 0;
    const purchaseList: Purchase[] = JSON.parse(purchases);
    return purchaseList.reduce((sum, p) => sum + p.amount, 0);
  },

  getTotalCommission: async (): Promise<number> => {
    const purchases = await AsyncStorage.getItem("purchases");
    if (!purchases) return 0;
    const purchaseList: Purchase[] = JSON.parse(purchases);
    return purchaseList.reduce((sum, p) => sum + p.commission, 0);
  },

  getConversionRate: async (): Promise<number> => {
    // Mock - in production, track views and purchases
    return 5.2; // 5.2%
  },
};
