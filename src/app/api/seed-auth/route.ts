import { NextResponse } from 'next/server';
import { seedFirebaseAuthUsers } from '@/utils/seedAuthServer';

export async function GET() {
  try {
    const projectId = process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (!projectId || !clientEmail || !privateKey) {
      return NextResponse.json({
        success: false,
        error: 'Missing Firebase Admin environment variables on server.',
        diagnostics: {
          hasProjectId: !!projectId,
          hasClientEmail: !!clientEmail,
          hasPrivateKey: !!privateKey,
        },
      }, { status: 500 });
    }

    const result = await seedFirebaseAuthUsers();
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to seed Firebase Auth Users Table',
        stack: error.stack,
      },
      { status: 500 }
    );
  }
}

export async function POST() {
  return GET();
}
