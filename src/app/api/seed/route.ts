import { NextResponse } from 'next/server';
import { seedFullFirebaseDatabase } from '@/utils/seedFirebase';
import { seedFirebaseAuthUsers } from '@/utils/seedAuthServer';

export async function GET() {
  try {
    let authResult = null;
    try {
      authResult = await seedFirebaseAuthUsers();
    } catch (e: any) {
      console.warn('⚠️ [Firebase Auth Admin Seed Warning]:', e.message);
    }

    const firestoreResult = await seedFullFirebaseDatabase();

    return NextResponse.json({
      success: true,
      message: 'Successfully seeded Firebase Auth Users Table and Firestore collections!',
      authResult,
      firestoreResult,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST() {
  return GET();
}
