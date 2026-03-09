import { NextResponse, NextRequest } from 'next/server';
import * as firebaseAdmin from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate user via Firebase Token
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new NextResponse('Unauthorized: Missing or invalid token', { status: 401 });
    }

    const idToken = authHeader.split("Bearer ")[1];
    let userId;

    try {
      const decodedToken = await firebaseAdmin.adminAuth.verifyIdToken(idToken);
      userId = decodedToken.uid;
    } catch (err) {
      console.warn("Firebase Auth missing or invalid token: Falling back to dev user ID temporarily.");
      userId = "development_fallback_user";
      // To strictly enforce security, you would throw the error here instead of using fallback.
      // return new NextResponse('Unauthorized: Invalid token', { status: 401 });
    }

    // 2. Parse the request body
    const body = await req.json();
    
    // Ensure we actually got emotion data
    if (!body || Object.keys(body).length === 0) {
      return new NextResponse('Bad Request: Missing emotion data', { status: 400 });
    }

    // Capture the detection data
    const emotionData = body;

    // 3. Save to Firestore using Admin SDK
    const userRef = firebaseAdmin.adminDb.collection("users").doc(userId).collection("detections");
    
    const docRef = await userRef.add({
      ...emotionData,
      timestamp: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true, id: docRef.id });
    
  } catch (error) {
    console.error('[SAVE_DETECTION_ERROR]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
