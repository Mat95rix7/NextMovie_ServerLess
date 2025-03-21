// src/api/auth/register.js
import { initFirebaseAdmin } from '../firebase';
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  try {
    const { token, displayName, email, uid } = req.body;
    const { auth, db } = initFirebaseAdmin();
    
    // Vérifier le token
    const decodedToken = await auth.verifyIdToken(token);
    
    // Vérifier que l'UID correspond
    if (decodedToken.uid !== uid) {
      return res.status(403).json({ message: 'Non autorisé' });
    }
    
    // Créer le profil utilisateur dans Firestore
    const userData = {
      uid,
      email,
      displayName,
      role: 'user',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };
    
    await db.collection('users').doc(uid).set(userData);
    
    return res.status(201).json({
      message: 'Inscription réussie',
      user: userData
    });
  } catch (error) {
    console.error('Erreur d\'inscription:', error);
    return res.status(500).json({ message: 'Erreur lors de l\'inscription' });
  }
}