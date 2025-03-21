import Joi from 'joi';
import { auth } from "../firebaseAdmin.js";
import { getFirestore } from "firebase-admin/firestore";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { clientAuth } from '../firebaseClient.js';



const db = getFirestore();

// Schéma de validation Joi unique avec conditions
const schemas = {
  // Schéma pour les actions d'authentification
  auth: Joi.object({
    action: Joi.string().valid('signup', 'login', 'logout').required().messages({
      'any.required': 'L\'action est requise',
      'any.only': 'Action invalide. Les actions autorisées sont: signup, login, logout'
    }),
    email: Joi.string().email().when('action', {
      is: Joi.string().valid('signup', 'login'),
      then: Joi.required(),
      otherwise: Joi.optional()
    }).messages({
      'string.email': 'Format d\'email invalide',
      'any.required': 'L\'email est requis'
    }),
    password: Joi.string().when('action', {
      is: 'signup',
      then: Joi.string().min(8).required(),
      otherwise: Joi.when('action', {
        is: 'login',
        then: Joi.string().required(),
        otherwise: Joi.optional()
      })
    }).messages({
      'string.min': 'Le mot de passe doit contenir au moins 8 caractères',
      'any.required': 'Le mot de passe est requis'
    }),
    displayName: Joi.string().min(3).max(20).when('action', {
      is: 'signup',
      then: Joi.optional().allow(''),
      otherwise: Joi.optional()
    }).messages({
      'string.min': 'Le nom d\'affichage doit contenir au moins 3 caractères',
      'string.max': 'Le nom d\'affichage ne peut pas dépasser 20 caractères'
    })
  })
};

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case "POST":
      return handleAuthActions(req, res);
    default:
      return res.status(405).json({ error: "Méthode non autorisée" });
  }
}

async function handleAuthActions(req, res) {
  try {
    // Validation de l'ensemble des données
    const { error, value } = schemas.auth.validate(req.body, { abortEarly: false });
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { action, email, password, displayName } = value;

    switch (action) {
      case "signup":
        return await signupUser(email, password, displayName, res);
      case "login":
        return await loginUser(res, email, password);
      case "logout":
        return logoutUser(req, res);
      default:
        return res.status(400).json({ error: "Action invalide" });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

// 🚀 Inscription (Signup)
async function signupUser(email, password, displayName, res) {
  try {
      // Création de l'utilisateur dans Firebase Auth
      const userRecord = await auth.createUser({
          email,
          password,
        });

      await auth.updateUser(userRecord.uid, { displayName });

      // Préparer les données utilisateur pour Firestore
      const userData = {
          uid: userRecord.uid,
          displayName: displayName || "",
          email,
          role: "user",
          isActive: true,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          stats: {
              watchlist: [],
              favorites: [],
              reviews: [],
          },
      };

          // Sauvegarde dans Firestore et authentification simultanées
      const [_, userCredential] = await Promise.all([
        db.collection("users").doc(userRecord.uid).set(userData),
        signInWithEmailAndPassword(clientAuth, email, password)
      ]);

      // Génération des tokens
      const idToken = await userCredential.user.getIdToken();
      const [customToken, sessionCookie] = await Promise.all([
        auth.createCustomToken(userRecord.uid),
        createSessionCookie(idToken),
      ]);

      // // Sauvegarde dans Firestore
      // await db.collection("users").doc(userRecord.uid).set(userData);
      // const userCredential = await signInWithEmailAndPassword(clientAuth, email, password);

      // // Connexion utilisateur et génération des tokens
      // const [customToken, sessionCookie] = await Promise.all([
      //     auth.createCustomToken(userRecord.uid),
      //     createSessionCookie(await userCredential.user.getIdToken()),
      // ]);

      // Ajout du cookie de session
      res.setHeader(
          "Set-Cookie",
          `session=${sessionCookie}; HttpOnly; Secure; Path=/; SameSite=Strict`
      );

      // Réponse au frontend
      return res.status(200).json({
          message: "Utilisateur créé avec succès",
          user: userData,
          customToken,
      });
  } catch (error) {
      console.error("Erreur lors de l'inscription :", error.message);
      return res.status(400).json({ error: "Erreur lors de la création du compte." });
  }
}

// 🚀 Connexion (Login)

async function loginUser(res, email, password) {
  try {
      // Authentification via Firebase REST API
      const response = await fetch(
          `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${process.env.FIREBASE_API_KEY}`,
          {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email, password, returnSecureToken: true }),
          }
      );

      const data = await response.json();
      if (!response.ok) {
          throw new Error(data.error?.message || "Erreur lors de la connexion.");
      }

      // Référence utilisateur Firestore
      const userDocRef = db.collection("users").doc(data.localId);

          // Mise à jour et récupération des données utilisateur en parallèle
      const [_, userDocSnapshot] = await Promise.all([
        userDocRef.update({ lastLogin: new Date().toISOString() }),
        userDocRef.get()
      ]);

      // // Appels parallèles pour Firestore et vérification de tokens
      // await userDocRef.update({ lastLogin: new Date().toISOString() });
      // const userDocSnapshot = await userDocRef.get();

      // Vérifications des données utilisateur
      if (!userDocSnapshot.exists) throw new Error("Utilisateur non trouvé.");
      const userData = { ...userDocSnapshot.data(), uid: data.localId };

      if (!userData.isActive) {
          throw new Error(
              "Votre compte est inactif. Veuillez contacter l'administrateur."
          );
      }

      // Création du customToken
      const [customToken, sessionCookie] = await Promise.all([
        auth.createCustomToken(data.localId),
        auth.createSessionCookie(data.idToken, {
          expiresIn: 60 * 60 * 24 * 5 * 1000, // 5 jours
        })
      ]);

      // Ajout du cookie à la réponse
      res.setHeader(
          "Set-Cookie",
          `session=${sessionCookie}; HttpOnly; Secure; Path=/; SameSite=Strict`
      );

      // Réponse finale
      return res.status(200).json({
          message: "Connexion réussie",
          user: userData,
          customToken,
      });
  } catch (error) {
      console.error("Erreur lors de la connexion :", error);
      return res.status(400).json({ error: error.message });
  }
}

// 🚀 Déconnexion (Logout)

async function logoutUser(req, res) {
  try {
      const sessionCookie = req.cookies.session || "";  

      // Vérification du cookie
      if (!sessionCookie || typeof sessionCookie !== "string") {
          return res.status(400).json({ error: "Cookie de session invalide." });
      }

      // Révocation des tokens si un cookie de session existe
      try {
          const decodedClaims = await auth.verifySessionCookie(sessionCookie);
          await auth.revokeRefreshTokens(decodedClaims.sub);
      } catch (error) {
          console.log("Erreur lors de la révocation des tokens :", error.message);
      }

      // Suppression du cookie de session
      res.setHeader(
          "Set-Cookie",
          "session=; Max-Age=0; HttpOnly; Path=/; Secure; SameSite=Strict"
      );

      return res.status(200).json({ message: "Déconnexion réussie" });
  } catch (error) {
      console.error("Erreur logout :", error.message);
      return res.status(400).json({ error: "Erreur lors de la déconnexion. Veuillez réessayer." });
  }
}


// const verifyIdToken = async (idToken) => {
//   try {
//     const decodedToken = await auth().verifyIdToken(idToken);
//     console.log("Utilisateur validé :", decodedToken.uid);
//     return decodedToken;
//   } catch (error) {
//     console.error("Erreur de validation du token :", error);
//     throw error;
//   }
// };

// const createCustomToken = async (uid) => {
//   try {
//     const customToken = await auth().createCustomToken(uid);
//     console.log("Custom Token généré :", customToken);
//     return customToken;
//   } catch (error) {
//     console.error("Erreur lors de la génération du Custom Token :", error);
//     throw error;
//   }
// };



// Fonction pour créer un cookie de session
async function createSessionCookie(idToken) {
  // Création d'un cookie de session avec Firebase Admin
  return await auth.createSessionCookie(idToken, {
    expiresIn: 60 * 60 * 24 * 5 * 1000, // 5 jours
  });
}