'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db, googleProvider, facebookProvider } from '@/lib/firebase';
import { AuthContextType, UserProfile, UserRole } from '@/types/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SUPERADMIN_EMAIL = 'superadmin@wildroute.lk';
const ALL_PERMISSIONS = [
  'all',
  'manage_products',
  'manage_tours',
  'manage_orders',
  'manage_users',
  'view_analytics',
  'manage_inventory',
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync user state with Firestore `users/{uid}`
  const syncUserProfile = async (firebaseUser: any) => {
    if (!firebaseUser) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      const emailLower = (firebaseUser.email || '').toLowerCase();
      const isSuperAdminEmail = emailLower === SUPERADMIN_EMAIL || emailLower.includes('superadmin@wildroute');

      if (userSnap.exists()) {
        const data = userSnap.data() as UserProfile;
        // Protect SuperAdmin: Always enforce superadmin role and all permissions
        if (isSuperAdminEmail || data.role === 'superadmin') {
          const superAdminProfile: UserProfile = {
            ...data,
            role: 'superadmin',
            permissions: ALL_PERMISSIONS,
          };
          setUser(superAdminProfile);
        } else {
          setUser(data);
        }
      } else {
        // Auto assign initial role based on email address
        let initialRole: UserRole = 'customer';
        let initialPermissions: string[] = ['buy_products', 'book_tours', 'view_own_orders'];

        if (isSuperAdminEmail) {
          initialRole = 'superadmin';
          initialPermissions = ALL_PERMISSIONS;
        } else if (emailLower.includes('admin@wildroute')) {
          initialRole = 'admin';
          initialPermissions = ['manage_products', 'manage_tours', 'manage_orders', 'manage_inventory', 'view_analytics'];
        } else if (emailLower.includes('staff@wildroute')) {
          initialRole = 'staff';
          initialPermissions = ['manage_orders', 'manage_inventory'];
        }

        const newUserProfile: UserProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Adventurer',
          photoURL: firebaseUser.photoURL || '',
          role: initialRole,
          permissions: initialPermissions,
          createdAt: new Date().toISOString(),
        };

        await setDoc(userRef, newUserProfile);
        setUser(newUserProfile);
      }
    } catch (err) {
      console.warn('⚠️ [Firestore Auth Sync Warning]: Using fallback profile.', err);
      const emailLower = (firebaseUser.email || '').toLowerCase();
      let initialRole: UserRole = 'customer';
      if (emailLower === SUPERADMIN_EMAIL || emailLower.includes('superadmin@wildroute')) initialRole = 'superadmin';
      else if (emailLower.includes('admin@wildroute')) initialRole = 'admin';
      else if (emailLower.includes('staff@wildroute')) initialRole = 'staff';

      setUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || 'Adventurer',
        photoURL: firebaseUser.photoURL || '',
        role: initialRole,
        permissions: initialRole === 'superadmin' ? ALL_PERMISSIONS : ['buy_products', 'book_tours'],
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      syncUserProfile(firebaseUser);
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      await syncUserProfile(cred.user);
    } catch (err: any) {
      if (
        err.code === 'auth/user-not-found' ||
        err.code === 'auth/invalid-credential' ||
        err.code === 'auth/invalid-email'
      ) {
        try {
          const displayName = email.split('@')[0];
          const cred = await createUserWithEmailAndPassword(auth, email, pass);
          if (cred.user) {
            await updateProfile(cred.user, { displayName });
          }
          await syncUserProfile(cred.user);
          return;
        } catch (createErr: any) {
          throw createErr;
        }
      }
      throw err;
    }
  };

  const registerWithEmail = async (email: string, pass: string, name: string) => {
    setLoading(true);
    const cred = await createUserWithEmailAndPassword(auth, email, pass);
    if (cred.user) {
      await updateProfile(cred.user, { displayName: name });
    }
    await syncUserProfile(cred.user);
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    const cred = await signInWithPopup(auth, googleProvider);
    await syncUserProfile(cred.user);
  };

  const loginWithFacebook = async () => {
    setLoading(true);
    const cred = await signInWithPopup(auth, facebookProvider);
    await syncUserProfile(cred.user);
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  const updateRoleAndPermissions = async (uid: string, role: UserRole, permissions: string[]) => {
    // Protection rule: SuperAdmin cannot be demoted or have permissions altered
    const targetUserRef = doc(db, 'users', uid);
    const targetSnap = await getDoc(targetUserRef);

    if (targetSnap.exists()) {
      const targetData = targetSnap.data() as UserProfile;
      if (targetData.email === SUPERADMIN_EMAIL || targetData.role === 'superadmin') {
        throw new Error('PROTECTION RULE: SuperAdmin credentials cannot be updated, demoted, or deleted.');
      }
    }

    await updateDoc(targetUserRef, {
      role,
      permissions,
      updatedAt: new Date().toISOString(),
    });

    if (user && user.uid === uid) {
      setUser({ ...user, role, permissions });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        loginWithFacebook,
        logout,
        updateRoleAndPermissions,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
