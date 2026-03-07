const fs = require('fs');

const dotenv = fs.readFileSync('.env', 'utf8');

dotenv.split('\n').forEach(line => {
  const [key, ...values] = line.split('=');
  if (key && values && key.trim()) {
    let val = values.join('=').replace(/^["'](.*)["']$/, '$1').trim();
    if(val) process.env[key.trim()] = val;
  }
});

const admin = require('firebase-admin');

// Handle escaped newlines properly
const rawKey = process.env.FIREBASE_PRIVATE_KEY || '';
const privateKey = rawKey.replace(/\\n/g, '\n').replace(/"/g, '');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  });
}

const bucket = admin.storage().bucket();

bucket.setCorsConfiguration([
  {
    origin: ['*'],
    method: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    maxAgeSeconds: 3600,
    responseHeader: ['*']
  }
]).then(() => {
  console.log('Firebase Storage CORS allowed successfully!');
  process.exit(0);
}).catch(err => {
  console.error("CORS Error:", err);
  process.exit(1);
});
