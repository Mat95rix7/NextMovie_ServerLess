// api/user/profile.js - Route pour récupérer le profil utilisateur
import { adminDb } from '../_utils/firebase.js';
import { verifyAuthToken } from '../_utils/middleware.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Vérifier l'authentification
  const auth = await verifyAuthToken(req, res);
  if (auth.error) {
    return res.status(auth.status).json({ error: auth.error });
  }

  try {
    // Récupérer les données de l'utilisateur
    const userDoc = await adminDb.collection('users').doc(auth.uid).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const userData = userDoc.data();
    
    return res.status(200).json({
      uid: auth.uid,
      ...userData
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch profile', 
      message: error.message 
    });
  }
}
