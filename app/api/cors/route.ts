import { NextResponse } from 'next/server';
import { adminStorage } from '@/lib/firebase-admin';

export async function GET() {
  try {
    await adminStorage.setCorsConfiguration([
      {
        origin: ['*'], // Allows all domains, including http://localhost:3000
        method: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        maxAgeSeconds: 3600,
        responseHeader: ['Content-Type', 'Authorization', 'Content-Length', 'User-Agent', 'x-goog-resumable'],
      },
    ]);
    return NextResponse.json({ success: true, message: "Firebase Storage CORS Configured successfully for all origins! You can now safely delete this file." });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
