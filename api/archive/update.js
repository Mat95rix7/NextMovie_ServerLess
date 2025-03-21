// api/user/update.js - Route pour mettre à jour le profil utilisateur
import { adminAuth, adminDb } from '../_utils/firebase.js';
import { verifyAuthToken } from '../_utils/middleware.js';
import admin from 'firebase-admin';

export default async function handler(req, res) {
  if (req.method !== 'PUT' && req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Vérifier l'authentification
  const auth = await verifyAuthToken(req, res);
  if (auth.error) {
    return res.status(auth.status).json({ error: auth.error });
  }

  try {
    const { displayName, photoURL, ...additionalData } = req.body;
    
    // Mise à jour dans Firebase Auth
    const authUpdateData = {};
    if (displayName) authUpdateData.displayName = displayName;
    if (photoURL) authUpdateData.photoURL = photoURL;
    
    if (Object.keys(authUpdateData).length > 0) {
      await adminAuth.updateUser(auth.uid, authUpdateData);
    }
    
    // Mise à jour dans Firestore
    const firestoreData = {
      ...additionalData,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    };
    
    if (displayName) firestoreData.displayName = displayName;
    if (photoURL) firestoreData.photoURL = photoURL;
    
    await adminDb.collection('users').doc(auth.uid).update(firestoreData);
    
    return res.status(200).json({ 
      message: 'Profile updated successfully' 
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ 
      error: 'Failed to update profile', 
      message: error.message 
    });
  }
}
