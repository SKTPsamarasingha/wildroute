import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES } from '@/services/productService';
import { INITIAL_TOURS } from '@/services/tourService';
import { INITIAL_SEEDED_USERS } from '@/services/userService';

export interface SeedResult {
  success: boolean;
  message: string;
  counts: {
    products: number;
    tours: number;
    categories: number;
    users: number;
  };
}

export const seedFullFirebaseDatabase = async (): Promise<SeedResult> => {
  try {
    // 1. Seed Categories
    for (const cat of INITIAL_CATEGORIES) {
      await setDoc(doc(db, 'categories', cat.id), cat, { merge: true });
    }

    // 2. Seed Products
    for (const prod of INITIAL_PRODUCTS) {
      await setDoc(doc(db, 'products', prod.id), prod, { merge: true });
    }

    // 3. Seed Tours Expeditions
    for (const tour of INITIAL_TOURS) {
      await setDoc(doc(db, 'tours', tour.id), tour, { merge: true });
    }

    // 4. Seed Users & RBAC Permissions
    for (const u of INITIAL_SEEDED_USERS) {
      await setDoc(doc(db, 'users', u.uid), u, { merge: true });
    }

    return {
      success: true,
      message: 'Successfully populated Firebase Firestore collections (products, tours, categories, users).',
      counts: {
        categories: INITIAL_CATEGORIES.length,
        products: INITIAL_PRODUCTS.length,
        tours: INITIAL_TOURS.length,
        users: INITIAL_SEEDED_USERS.length,
      },
    };
  } catch (error: any) {
    console.error('❌ [Firebase Firestore Seeding Error]:', error);
    return {
      success: false,
      message: error.message || 'Failed to write seed data to Firestore.',
      counts: { products: 0, tours: 0, categories: 0, users: 0 },
    };
  }
};
