import { seedFirebaseAuthUsers } from '../src/utils/seedAuthServer.ts';

async function run() {
  console.log('Environment Loaded:');
  console.log('Project ID:', process.env.FIREBASE_PROJECT_ID);
  console.log('Client Email:', process.env.FIREBASE_CLIENT_EMAIL);
  console.log('Private Key Present:', !!process.env.FIREBASE_PRIVATE_KEY);

  try {
    const res = await seedFirebaseAuthUsers();
    console.log('✅ SEED AUTH RESULT:', JSON.stringify(res, null, 2));
  } catch (e) {
    console.error('❌ SEED AUTH ERROR:', e);
  }
}

run();
