import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

import { seedFirebaseAuthUsers } from '../src/utils/seedAuthServer.ts';

async function main() {
  try {
    const res = await seedFirebaseAuthUsers();
    console.log('SEED RESULT:', JSON.stringify(res, null, 2));
  } catch (err) {
    console.error('SEED ERROR:', err);
  }
}

main();
