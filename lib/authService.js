import admin from 'firebase-admin';
import { cert, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';


// Use the default export to call the initializeApp function
if (!getApps().length) {
  admin.initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
}


const auth = getAuth();
const db = getFirestore();

// Middleware de vérification de token
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Accès non autorisé: Token manquant' });
    }

    const token = authHeader.split(' ')[1];
    
    try {
      const decodedToken = await auth.verifyIdToken(token);
      req.user = decodedToken;
      next();
    } catch (error) {
      console.error('Erreur de vérification du token:', error);
      return res.status(403).json({ error: 'Token invalide ou expiré' });
    }
  } catch (error) {
    console.error('Erreur dans le middleware d\'authentification:', error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Login avec email et mot de passe
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    // Utilisation de l'API d'authentification Firebase admin
    // Note: Firebase Admin SDK ne peut pas faire de connexion directe avec email/password
    // On utilise généralement une API Firebase côté client ou une fonction personnalisée
    
    // Option 1: Utiliser une API tierce pour la connexion directe
    // Cette partie nécessite une implémentation personnalisée ou un package supplémentaire
    
    // Option 2: Vérifier l'utilisateur existe et générer un token personnalisé
    try {
      const userRecord = await auth.getUserByEmail(email);
      // Ici vous devriez avoir une méthode sécurisée pour vérifier le mot de passe
      // car Firebase Admin ne fournit pas cette fonctionnalité
      
      const customToken = await auth.createCustomToken(userRecord.uid);
      
      // Mise à jour de la dernière connexion
      await db.collection('users').doc(userRecord.uid).set({
        lastLogin: new Date().toISOString()
      }, { merge: true });
      
      return res.status(200).json({
        token: customToken,
        user: {
          uid: userRecord.uid,
          email: userRecord.email,
          displayName: userRecord.displayName
        }
      });
    } catch (error) {
      console.error('Erreur de connexion:', error);
      return res.status(401).json({ error: 'Identifiants invalides' });
    }
  } catch (error) {
    console.error('Erreur de connexion:', error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Inscription d'un nouvel utilisateur
const signup = async (req, res) => {
  try {
    const { email, password, displayName } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis' });
    }

    try {
      // Créer l'utilisateur avec Firebase Admin
      const userRecord = await auth.createUser({
        email,
        password,
        displayName: displayName || email.split('@')[0]
      });
      
      // Initialiser le profil utilisateur dans Firestore
      await db.collection('users').doc(userRecord.uid).set({
        displayName: displayName || email.split('@')[0],
        email,
        role: "user",
        isActive: true,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        stats: {
          watchlist: [],
          favorites: [],
          reviews: []
        }
      });
      
      // Créer un token personnalisé pour l'authentification
      const customToken = await auth.createCustomToken(userRecord.uid);
      
      return res.status(201).json({
        token: customToken,
        user: {
          uid: userRecord.uid,
          email: userRecord.email,
          displayName: userRecord.displayName
        }
      });
    } catch (error) {
      if (error.code === 'auth/email-already-exists') {
        return res.status(409).json({ error: 'Cet email est déjà utilisé' });
      }
      throw error;
    }
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

// Déconnexion (côté serveur, on invalide simplement le token)
const logout = async (req, res) => {
  try {
    // Avec un système de jetons, la déconnexion se fait côté client 
    // en supprimant le token, mais on peut aussi révoquer les sessions
    if (req.user && req.user.uid) {
      try {
        await auth.revokeRefreshTokens(req.user.uid);
        return res.status(200).json({ message: 'Déconnexion réussie' });
      } catch (error) {
        console.error('Erreur lors de la révocation des tokens:', error);
      }
    }
    return res.status(200).json({ message: 'Déconnexion réussie' });
  } catch (error) {
    console.error('Erreur de déconnexion:', error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
};

export {
  auth,
  db,
  verifyToken,
  login,
  signup,
  logout
};