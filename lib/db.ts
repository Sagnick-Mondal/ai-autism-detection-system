// We no longer need the direct client Firebase SDK imports since we are using a secure API route
// import { db } from "./firebase";
// import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function saveDetectionResult(userId: string, emotionData: any) {
  try {
    // Send data to our secure Next.js API route, which verifies Clerk Auth
    // and writes to Firestore using the Firebase Admin SDK.
    const response = await fetch('/api/save-detection', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emotionData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to save detection result: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    return data.id; // Return the generated document ID
    
  } catch (error) {
    console.error("Error saving detection result: ", error);
    throw error;
  }
}
