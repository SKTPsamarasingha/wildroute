import { getAdminAuth, getAdminDb } from '@/lib/firebaseAdmin';

export const SEEDED_AUTH_USERS = [
  {
    email: 'superadmin@wildroute.lk',
    password: 'SuperAdmin@123456',
    displayName: 'Platform Super Admin',
    role: 'superadmin',
    permissions: ['all', 'manage_users', 'manage_products', 'manage_tours', 'manage_orders', 'view_analytics', 'seed_database'],
  },
  {
    email: 'admin@wildroute.lk',
    password: 'Admin@123456',
    displayName: 'Thiruna Samarasinghe (Owner Admin)',
    role: 'admin',
    permissions: ['manage_products', 'manage_tours', 'manage_orders', 'manage_staff', 'view_analytics'],
  },
  {
    email: 'staff@wildroute.lk',
    password: 'Staff@123456',
    displayName: 'Kamal Perera (Fulfillment Staff)',
    role: 'staff',
    permissions: ['manage_orders', 'view_tours', 'update_stock'],
  },
  {
    email: 'customer@gmail.com',
    password: 'Customer@123456',
    displayName: 'Kasun Samarasinghe',
    role: 'customer',
    permissions: ['buy_products', 'book_tours', 'view_own_orders'],
  },
];

export async function seedFirebaseAuthUsers() {
  const results = [];

  const authAdmin = getAdminAuth();
  const dbAdmin = getAdminDb();

  if (!authAdmin || !dbAdmin) {
    throw new Error('Firebase Admin SDK is not properly configured. Check your server env variables.');
  }

  for (const userRecord of SEEDED_AUTH_USERS) {
    let userUid = '';
    let status = '';

    try {
      // Check if user already exists in Firebase Auth
      const existingUser = await authAdmin.getUserByEmail(userRecord.email);
      userUid = existingUser.uid;
      status = 'Already Exists in Firebase Auth';
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        // Create user in Firebase Authentication Users Table
        const createdUser = await authAdmin.createUser({
          email: userRecord.email,
          password: userRecord.password,
          displayName: userRecord.displayName,
          emailVerified: true,
        });
        userUid = createdUser.uid;
        status = 'Created New Firebase Auth User';
      } else {
        throw err;
      }
    }

    // Set custom user claims for Firebase Auth RBAC
    await authAdmin.setCustomUserClaims(userUid, {
      role: userRecord.role,
      superadmin: userRecord.role === 'superadmin',
      admin: userRecord.role === 'admin' || userRecord.role === 'superadmin',
      staff: userRecord.role === 'staff',
    });

    // Sync Firestore `users/{uid}` document
    const userDocRef = dbAdmin.collection('users').doc(userUid);
    await userDocRef.set(
      {
        uid: userUid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        role: userRecord.role,
        permissions: userRecord.permissions,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    results.push({
      email: userRecord.email,
      uid: userUid,
      role: userRecord.role,
      status,
    });
  }

  return {
    success: true,
    message: 'Populated Firebase Authentication Users Table & Firestore RBAC profiles.',
    users: results,
  };
}
