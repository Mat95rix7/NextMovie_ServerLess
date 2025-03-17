import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

if (!global.firebaseAdmin) {
  global.firebaseAdmin = initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password } = req.body;

    const auth = getAuth();
    const userRecord = await auth.createUser({
      email,
      password,
    });

    const token = await auth.createCustomToken(userRecord.uid);

    return res.status(200).json({ 
      user: userRecord,
      token 
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return res.status(500).json({ 
      error: error.message 
    });
  }
}