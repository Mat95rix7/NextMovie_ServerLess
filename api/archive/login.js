// src/api/auth/login.js
import { initFirebaseAdmin } from '../utils/firebase.js';


export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Méthode non autorisée' });
  }

  try {
    const { token } = req.body;
    const { auth, db } = initFirebaseAdmin();
    
    // Vérifier le token
    const decodedToken = await auth.verifyIdToken(token);
    const uid = decodedToken.uid;
    
    // Récupérer les données utilisateur complètes de Firestore
    const userDoc = await db.collection('users').doc(uid).get();
    let userData = null;
    
    if (userDoc.exists) {
      userData = userDoc.data();
    } else {
      // L'utilisateur existe dans Firebase Auth mais pas encore dans Firestore
      // Créer un profil minimal
      const { email, displayName } = decodedToken;
      userData = {
        email,
        displayName,
        role: 'user',
        createdAt: new Date().toISOString(),
      };
      
      await db.collection('users').doc(uid).set(userData);
    }
    
    // Mettre à jour la dernière connexion
    await db.collection('users').doc(uid).update({
      lastLogin: new Date().toISOString()
    });
    
    return res.status(200).json({
      message: 'Connexion réussie',
      user: userData
    });
  } catch (error) {
    console.error('Erreur de connexion:', error);
    return res.status(401).json({ message: 'Authentification échouée' });
  }
}
