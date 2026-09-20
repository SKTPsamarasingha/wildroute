import { UserProfile, UserRole } from '@/types/auth';
import { collection, getDocs, doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { seedFullFirebaseDatabase } from '@/utils/seedFirebase';

export const SUPERADMIN_EMAIL = 'superadmin@wildroute.lk';
export const ALL_PERMISSIONS = [
  'all',
  'manage_products',
  'manage_tours',
  'manage_orders',
  'manage_users',
  'view_analytics',
  'manage_inventory',
];

export const INITIAL_SEEDED_USERS: UserProfile[] = [
  {
    uid: 'usr-superadmin-01',
    email: 'superadmin@wildroute.lk',
    displayName: 'Platform Super Admin (Full Control)',
    role: 'superadmin',
    permissions: ALL_PERMISSIONS,
    createdAt: '2026-08-01T08:00:00Z',
  },
  {
    uid: 'usr-admin-01',
    email: 'admin@wildroute.lk',
    displayName: 'Thiruna Samarasinghe (Owner Admin)',
    role: 'admin',
    permissions: ['manage_products', 'manage_tours', 'manage_orders', 'manage_inventory', 'view_analytics'],
    createdAt: '2026-08-01T10:00:00Z',
  },
  {
    uid: 'usr-staff-01',
    email: 'staff@wildroute.lk',
    displayName: 'Kamal Perera (Fulfillment Staff)',
    role: 'staff',
    permissions: ['manage_orders', 'manage_inventory'],
    createdAt: '2026-08-15T14:30:00Z',
  },
  {
    uid: 'usr-cust-01',
    email: 'customer@gmail.com',
    displayName: 'Kasun Samarasinghe',
    role: 'customer',
    permissions: ['buy_products', 'book_tours', 'view_own_orders'],
    createdAt: '2026-09-01T09:15:00Z',
  },
];

export const getUsers = async (): Promise<UserProfile[]> => {
  try {
    const snap = await getDocs(collection(db, 'users'));
    if (!snap.empty) {
      const userList = snap.docs.map((doc) => ({ uid: doc.id, ...doc.data() } as UserProfile));
      const uniqueMap = new Map<string, UserProfile>();
      userList.forEach((u) => {
        const key = u.email ? u.email.toLowerCase() : u.uid;
        if (!uniqueMap.has(key)) {
          uniqueMap.set(key, u);
        }
      });
      return Array.from(uniqueMap.values());
    }
  } catch (err) {
    console.warn('⚠️ [Firestore Users Fetch Warning]: Returning empty user list from DB.', err);
  }

  const uniqueMap = new Map<string, UserProfile>();
  INITIAL_SEEDED_USERS.forEach((u) => {
    uniqueMap.set(u.email.toLowerCase(), u);
  });
  return Array.from(uniqueMap.values());
};

export const seedDatabaseUsers = async () => {
  return await seedFullFirebaseDatabase();
};

export const updateUserRoleAndPermissions = async (
  uid: string,
  newRole: UserRole,
  newPermissions: string[]
): Promise<void> => {
  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);

    if (snap.exists()) {
      const existing = snap.data() as UserProfile;
      if (existing.email === SUPERADMIN_EMAIL || existing.role === 'superadmin') {
        throw new Error('PROTECTION RULE: SuperAdmin credentials cannot be updated, demoted, or altered.');
      }
    }

    const finalPermissions = newRole === 'superadmin' ? ALL_PERMISSIONS : newPermissions;

    await updateDoc(userRef, {
      role: newRole,
      permissions: finalPermissions,
      updatedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('❌ [Role Update Error]:', err.message);
    throw err;
  }
};
