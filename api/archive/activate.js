// api/user/activate.js - API pour activer/désactiver un compte
const { adminDb } = require('../_utils/firebase');
const { verifyAuthToken } = require('../_utils/middleware');

export default async function handler(req, res) {
  if (req.method !== 'PUT' && req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Vérifier l'authentification (nécessite des droits d'administrateur)
  const auth = await verifyAuthToken(req, res);
  if (auth.error) {
    return res.status(auth.status).json({ error: auth.error });
  }

  try {
    const { userId, isActive } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ error: 'isActive must be a boolean' });
    }
    
    // Mise à jour du statut d'activité dans Firestore
    await adminDb.collection('users').doc(userId).update({
      isActive: isActive,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    return res.status(200).json({ 
      message: `User account ${isActive ? 'activated' : 'deactivated'} successfully` 
    });
  } catch (error) {
    console.error('Account status update error:', error);
    return res.status(500).json({ 
      error: 'Failed to update account status', 
      message: error.message 
    });
  }
}

// Modification de api/auth/register.js pour inclure le champ isActive
const { adminAuth, adminDb } = require('../_utils/firebase');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, password, displayName } = req.body;
    
    // Création de l'utilisateur dans Firebase Auth
    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName
    });
    
    // Création du document utilisateur dans Firestore avec isActive
    await adminDb.collection('users').doc(userRecord.uid).set({
      email,
      displayName,
      isActive: true, // Compte actif par défaut
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    return res.status(201).json({ 
      message: 'User created successfully',
      uid: userRecord.uid 
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ 
      error: 'Registration failed', 
      message: error.message 
    });
  }
}