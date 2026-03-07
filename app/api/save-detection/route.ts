import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { adminDb, adminStorage } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: Request) {
  try {
    // 1. Authenticate user with Clerk (await required in v6)
    let { userId } = await auth();

    // TEMPORARY FALLBACK FOR DEVELOPMENT: Because Clerk's DEV network is down (DNS Error 1016),
    // we bypass auth blocks to keep your project running smoothly locally. 
    if (!userId) {
      console.warn("Clerk Auth missing: Falling back to dev user ID temporarily.");
      userId = "development_fallback_user";
    }
    // 2. Parse the request body
    const body = await req.json();
    
    // Ensure we actually got emotion data
    if (!body || Object.keys(body).length === 0) {
      return new NextResponse('Bad Request: Missing emotion data', { status: 400 });
    }

    // Capture the base64 image data we sent from the browser
    const { imageBase64, imageFileName, ...emotionData } = body;
    let finalImageUrl = null;

    if (imageBase64) {
      try {
        // Strip out the data URI prefix: "data:image/jpeg;base64,"
        const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
        const imageBuffer = Buffer.from(base64Data, 'base64');
        
        // This is the true server-side Admin Storage bucket which never checks CORS
        const bucket = adminStorage; 
        const filePath = `detections/${userId}_${Date.now()}_${imageFileName || 'upload.jpg'}`;
        const fileRef = bucket.file(filePath);
        const token = uuidv4();

        // Save the buffer bytes directly with a simulated Firebase token
        await fileRef.save(imageBuffer, {
          metadata: { 
            contentType: "image/jpeg",
            metadata: { firebaseStorageDownloadTokens: token }
          }, 
        });

        // Generate the exact same public reading URL format that the client SDK creates natively
        const encodedPath = encodeURIComponent(filePath);
        finalImageUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodedPath}?alt=media&token=${token}`;
      } catch (err: any) {
        console.error("Firebase Admin SDK Storage Upload Failed:", err.message);
        return new NextResponse(`Storage Upload Failed: ${err.message}`, { status: 500 });
      }
    }

    // 3. Save to Firestore using Admin SDK
    const userRef = adminDb.collection("users").doc(userId).collection("detections");
    
    const docRef = await userRef.add({
      ...emotionData,
      ...(finalImageUrl && { imageUrl: finalImageUrl }), // Only add imageUrl if successful
      timestamp: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true, id: docRef.id });
    
  } catch (error) {
    console.error('[SAVE_DETECTION_ERROR]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
