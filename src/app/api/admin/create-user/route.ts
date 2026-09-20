import { NextResponse } from 'next/server';
import { getAdminAuth, getAdminDb } from '@/lib/firebaseAdmin';
import { ALL_PERMISSIONS } from '@/services/userService';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, displayName, role, permissions } = body;

    if (!email || !password || password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Email and password (minimum 6 characters) are required.' },
        { status: 400 }
      );
    }

    const authAdmin = getAdminAuth();
    const dbAdmin = getAdminDb();

    if (!authAdmin || !dbAdmin) {
      return NextResponse.json(
        { success: false, error: 'Server Firebase Admin SDK is not initialized properly.' },
        { status: 500 }
      );
    }

    let userUid = '';
    let isNewUser = false;

    try {
      const existingUser = await authAdmin.getUserByEmail(email);
      userUid = existingUser.uid;

      // Update password & display name if provided
      await authAdmin.updateUser(userUid, {
        password: password,
        displayName: displayName || existingUser.displayName,
      });
    } catch (err: any) {
      if (err.code === 'auth/user-not-found') {
        const createdUser = await authAdmin.createUser({
          email,
          password,
          displayName: displayName || email.split('@')[0],
          emailVerified: true,
        });
        userUid = createdUser.uid;
        isNewUser = true;
      } else {
        throw err;
      }
    }

    const userRole = role || 'customer';
    const finalPermissions = userRole === 'superadmin' ? ALL_PERMISSIONS : (permissions || ['buy_products', 'book_tours']);

    // Set Custom Claims in Firebase Auth
    await authAdmin.setCustomUserClaims(userUid, {
      role: userRole,
      superadmin: userRole === 'superadmin',
      admin: userRole === 'admin' || userRole === 'superadmin',
      staff: userRole === 'staff',
    });

    // Save/Merge into Firestore `users/{uid}` collection
    const userDocRef = dbAdmin.collection('users').doc(userUid);
    await userDocRef.set(
      {
        uid: userUid,
        email: email.toLowerCase(),
        displayName: displayName || email.split('@')[0],
        role: userRole,
        permissions: finalPermissions,
        updatedAt: new Date().toISOString(),
        ...(isNewUser ? { createdAt: new Date().toISOString() } : {}),
      },
      { merge: true }
    );

    return NextResponse.json({
      success: true,
      message: `Successfully ${isNewUser ? 'created' : 'updated'} user ${email} in Firebase Auth and Firestore.`,
      user: {
        uid: userUid,
        email,
        displayName: displayName || email.split('@')[0],
        role: userRole,
        permissions: finalPermissions,
      },
    });
  } catch (error: any) {
    console.error('❌ [API Create Admin User Error]:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create user in Firebase Auth.' },
      { status: 500 }
    );
  }
}
