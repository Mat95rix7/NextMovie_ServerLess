// api/_utils/middleware.js - Middleware pour vérifier l'authentification
import { adminAuth } from './firebase.js';

// Middleware pour vérifier le token d'authentification
const verifyAuthToken = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { error: 'Unauthorized', status: 401 };
    }
    
    const token = authHeader.split(' ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    
    if (!decodedToken || !decodedToken.uid) {
      return { error: 'Unauthorized', status: 401 };
    }
    
    return { uid: decodedToken.uid };
  } catch (error) {
    console.error('Auth middleware error:', error);
    return { error: 'Internal server error', status: 500 };
  }
};

export { verifyAuthToken };
