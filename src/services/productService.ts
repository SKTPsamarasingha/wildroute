import { Product, Category } from '@/types/ecommerce';
import { collection, getDocs, doc, getDoc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const INITIAL_CATEGORIES: Category[] = [
  {
    id: 'apparel-outerwear',
    name: 'Apparel & Outerwear',
    slug: 'apparel-outerwear',
    description: 'Weatherproof jackets, thermal base layers, and durable trekking trousers.',
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'camping-gear',
    name: 'Camping Equipment',
    slug: 'camping-gear',
    description: '4-season tents, sub-zero sleeping bags, and portable expedition stoves.',
    image: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'backpacks-bags',
    name: 'Backpacks & Luggage',
    slug: 'backpacks-bags',
    description: 'Ergonomic expedition rucksacks, waterproof dry bags, and daypacks.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'trekking-accessories',
    name: 'Trekking & Accessories',
    slug: 'trekking-accessories',
    description: 'Carbon fiber trekking poles, tactical headlamps, and hydration reservoirs.',
    image: 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80',
  },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-01',
    title: 'WildRoute PeakPro Alpine Shell Jacket',
    description: '3-layer GORE-TEX waterproof jacket built for extreme mountain downpours and high-altitude winds. Sealed seams with pit zips for heat management.',
    price: 34500,
    originalPrice: 38900,
    category: 'apparel-outerwear',
    images: [
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=900&q=80',
    ],
    stock: 18,
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Forest Pine', 'Ember Terracotta', 'Obsidian Black'],
    weight: '450g',
    featured: true,
    rating: 4.9,
    reviewCount: 34,
  },
  {
    id: 'prod-02',
    title: 'TerraDome 3-Person Expedition Tent',
    description: 'Ultralight double-wall geodesic tent designed to endure gale winds and heavy monsoon rainfall. Easy color-coded aluminum pole set.',
    price: 48900,
    originalPrice: 54000,
    category: 'camping-gear',
    images: [
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=900&q=80',
    ],
    stock: 8,
    weight: '2.4kg',
    featured: true,
    rating: 4.8,
    reviewCount: 29,
  },
  {
    id: 'prod-03',
    title: 'Expedition 65L Ergonomic Rucksack',
    description: 'Heavy-duty nylon trail backpack with anti-gravity ventilation harness, integrated rain cover, and hydration sleeve port.',
    price: 29800,
    originalPrice: 33000,
    category: 'backpacks-bags',
    images: [
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=900&q=80',
    ],
    stock: 14,
    colors: ['Sage Green', 'Earth Olive', 'Midnight Slate'],
    weight: '1.8kg',
    featured: true,
    rating: 5.0,
    reviewCount: 42,
  },
  {
    id: 'prod-04',
    title: 'Carbon Trek Pro Locking Poles (Pair)',
    description: 'Ultra-stiff 100% carbon fiber trekking poles with ergonomic cork grips and quick twist-lock mechanism. Dampens wrist shock on steep descents.',
    price: 14200,
    category: 'trekking-accessories',
    images: [
      'https://images.unsplash.com/photo-1508873696983-2df515122519?auto=format&fit=crop&w=900&q=80',
    ],
    stock: 25,
    weight: '380g',
    featured: false,
    rating: 4.7,
    reviewCount: 19,
  },
];

export const getProducts = async (): Promise<Product[]> => {
  try {
    const colRef = collection(db, 'products');
    const snap = await getDocs(colRef);
    if (!snap.empty) {
      return snap.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Product));
    }
  } catch (err) {
    console.error('⚠️ [Firestore Product Fetch Error]:', err);
  }
  return INITIAL_PRODUCTS;
};

export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const docRef = doc(db, 'products', id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() } as Product;
    }
  } catch (err) {
    console.error('⚠️ [Firestore Product Lookup Error]:', err);
  }
  return INITIAL_PRODUCTS.find((p) => p.id === id) || null;
};

export const saveProduct = async (productData: Partial<Product>): Promise<Product> => {
  const newId = productData.id || `prod-${Date.now()}`;
  const fullProduct: Product = {
    id: newId,
    title: productData.title || 'New Product',
    description: productData.description || '',
    price: productData.price || 0,
    originalPrice: productData.originalPrice,
    category: productData.category || 'apparel-outerwear',
    images: productData.images || ['https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=900&q=80'],
    stock: productData.stock ?? 10,
    sizes: productData.sizes || ['M', 'L'],
    colors: productData.colors || ['Forest Pine'],
    weight: productData.weight || '500g',
    featured: productData.featured || false,
    rating: productData.rating || 5.0,
    reviewCount: productData.reviewCount || 1,
    createdAt: new Date().toISOString(),
  };

  try {
    const docRef = doc(db, 'products', newId);
    const cleanedProduct = Object.fromEntries(
      Object.entries(fullProduct).filter(([_, v]) => v !== undefined)
    );
    await setDoc(docRef, cleanedProduct, { merge: true });
  } catch (err) {
    console.error('❌ [Firestore Product Save Error]:', err);
    throw err;
  }

  return fullProduct;
};

export const deleteProduct = async (id: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'products', id));
  } catch (err) {
    console.error('❌ [Firestore Product Delete Error]:', err);
    throw err;
  }
};
