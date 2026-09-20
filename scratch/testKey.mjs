import crypto from 'node:crypto';

const rawKey = process.env.FIREBASE_PRIVATE_KEY;

function formatPrivateKey(key) {
  if (!key) return undefined;
  let formatted = key.trim();
  if ((formatted.startsWith('"') && formatted.endsWith('"')) || (formatted.startsWith("'") && formatted.endsWith("'"))) {
    try {
      formatted = JSON.parse(formatted);
    } catch {
      formatted = formatted.slice(1, -1);
    }
  }

  formatted = formatted.replace(/\\n/g, '\n');

  const lines = formatted.split('\n').map((line) => {
    if (line.includes('-----BEGIN') || line.includes('-----END')) {
      return line.trim();
    }
    return line.replace(/\\/g, '').trim();
  });

  return lines.join('\n');
}

const key = formatPrivateKey(rawKey);
console.log('FORMATTED KEY:\n', key);

try {
  const pk = crypto.createPrivateKey(key);
  console.log('✅ SUCCESS! Private Key Parsed Correctly by Node Crypto!');
} catch (e) {
  console.error('❌ FAILED TO PARSE:', e);
}
