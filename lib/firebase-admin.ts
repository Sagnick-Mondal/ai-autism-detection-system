import * as admin from 'firebase-admin';

// Initialize the Firebase Admin App only once, even with hot-reloading
if (!admin.apps.length) {
  try {
    // Some env vars include the .app or .com suffix, but Admin SDK sometimes needs just the bucket name
    let bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '';
    if (bucketName.endsWith('.app') || bucketName.endsWith('.com')) {
      // It's usually fine as-is, but if we're getting 'bucket not found', 
      // ensuring it's strictly the naked bucket string helps.
      // Wait, let's just make sure it doesn't have gs:// prefix
      bucketName = bucketName.replace(/^gs:\/\//, '');
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // Handle newline characters in the environment variable correctly
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
      storageBucket: bucketName,
    });
    console.log('Firebase Admin initialized successfully');
  } catch (error) {
    console.error('Firebase Admin initialization error', error);
  }
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
export const adminStorage = admin.storage().bucket();
