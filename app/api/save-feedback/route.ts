import { NextResponse, NextRequest } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body || !body.age || !body.details || !body.contact || !body.name) {
      return new NextResponse('Bad Request: Missing required feedback fields', { status: 400 });
    }

    const feedbackData = {
      name: body.name,
      contact: body.contact,
      age: body.age,
      details: body.details,
      timestamp: FieldValue.serverTimestamp(),
    };

    const docRef = await adminDb.collection("feedbacks").add(feedbackData);

    return NextResponse.json({ success: true, id: docRef.id });

  } catch (error) {
    console.error('[SAVE_FEEDBACK_ERROR]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
