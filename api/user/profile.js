// import { auth } from "../firebaseAdmin.js";
// import { getFirestore } from "firebase-admin/firestore";

// const db = getFirestore();

// async function getDecodedToken(req) {
//   const idToken = req.headers.authorization?.split("Bearer ")[1];
//   if (!idToken) throw new Error("Token non fourni");
//   return await auth.verifyIdToken(idToken);
// }


// export default async function handler(req, res) {
//   // Vérifier la méthode HTTP
//   const { method } = req;

//   switch (method) {
//     case "GET":
//       return getUserProfile(req, res);
//     case "PUT":
//       return updateUserProfile(req, res);
//     case "DELETE":
//       return deleteUserProfile(req, res);
//     default:
//       return res.status(405).json({ error: "Méthode non autorisée" });
//   }
// }

// // 📌 1️⃣ Fonction pour récupérer les infos de l'utilisateur
// async function getUserProfile(req, res) {
//   try {
    
//     const decodedToken = await getDecodedToken(req);
  
//     const userDoc = await db.collection("users").doc(decodedToken.uid).get();
//     console.log(userDoc.data());

//     if (!userDoc.exists) {
//       return res.status(404).json({ error: "Utilisateur non trouvé" });
//     }

//     return res.status(200).json({ user: userDoc.data() });

//   } catch (error) {
//     return res.status(400).json({ error: error.message });
//   }
// }

// // 📌 2️⃣ Fonction pour mettre à jour le profil de l'utilisateur
// async function updateUserProfile(req, res) {
//   try {
//     const { displayName, photoURL } = req.body;

//     const decodedToken = await getDecodedToken(req);

//     // Mettre à jour le profil de l'utilisateur
//     const updatedUser = await auth.updateUser(decodedToken.uid, {
//       displayName,
//       photoURL,
//     });

//     // Mettre à jour les données personnelles de l'utilisateur dans Firestore
//     await db.collection("users").doc(decodedToken.uid).update({
//       displayName,
//       photoURL,
//     });

//     return res.status(200).json({ message: "Profil mis à jour", user: updatedUser });
//   } catch (error) {
//     return res.status(400).json({ error: error.message });
//   }
// }

// // 📌 3️⃣ Fonction pour supprimer l'utilisateur
// async function deleteUserProfile(req, res) {
//   try {
    
//     const decodedToken = await getDecodedToken(req);
//     // Supprimer l'utilisateur
//     await auth.deleteUser(decodedToken.uid); 

//     // Supprimer les données personnelles de l'utilisateur dans Firestore
//     await db.collection("users").doc(decodedToken.uid).delete();

//     return res.status(200).json({ message: "Compte utilisateur supprimé" });
//   } catch (error) {
//     return res.status(400).json({ error: error.message });
//   }
// }

import Joi from "joi"; // Importation de Joi pour la validation
import { auth } from "../firebaseAdmin.js"; // Import Firebase Admin pour gérer l'authentification
import { getFirestore } from "firebase-admin/firestore"; // Firestore pour la gestion des données utilisateur

const db = getFirestore();

export default async function handler(req, res) {
  // Détecter la méthode HTTP et exécuter l'action correspondante
  const { method } = req;

  switch (method) {
    case "GET":
      return getUserProfile(req, res);
    case "PUT":
      return updateUserProfile(req, res);
    case "DELETE":
      return deleteUserProfile(req, res);
    default:
      return res.status(405).json({ error: "Méthode non autorisée" });
  }
}

// 🌟 Fonction réutilisable pour vérifier et décoder un token
async function getDecodedToken(req) {
  const idToken = req.headers.authorization?.split("Bearer ")[1];
  if (!idToken) throw new Error("Token non fourni");
  return await auth.verifyIdToken(idToken);
}

// 🌟 Fonction réutilisable pour valider les données
function validateInput(schema, data) {
  const { error, value } = schema.validate(data);
  if (error) throw new Error(error.details[0].message);
  return value;
}

// 🌟 Schéma de validation pour la mise à jour du profil utilisateur
const updateUserSchema = Joi.object({
  displayName: Joi.string().min(3).optional(),
  photoURL: Joi.string().uri().optional(),
});

// 📌 1️⃣ Fonction pour récupérer les informations utilisateur
async function getUserProfile(req, res) {
  try {
    const decodedToken = await getDecodedToken(req);
    const userDoc = await db.collection("users").doc(decodedToken.uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    return res.status(200).json({ user: { ...userDoc.data(), uid: decodedToken.uid } });
  } catch (error) {
    const status = error.message.includes("Token") ? 401 : 400;
    return res.status(status).json({ error: error.message });
  }
}

// 📌 2️⃣ Fonction pour mettre à jour le profil utilisateur
async function updateUserProfile(req, res) {
  try {
    const decodedToken = await getDecodedToken(req);

    // Valider les données d'entrée avec Joi
    const { displayName, photoURL } = validateInput(updateUserSchema, req.body);

    // Mettre à jour Firebase Authentication
    const updatedUser = await auth.updateUser(decodedToken.uid, {
      displayName,
      photoURL,
    });

    // Mettre à jour Firestore
    await db.collection("users").doc(decodedToken.uid).update({
      displayName,
      photoURL,
    });

    return res.status(200).json({ message: "Profil mis à jour", user: updatedUser });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}

// 📌 3️⃣ Fonction pour supprimer l'utilisateur
async function deleteUserProfile(req, res) {
  try {
    const decodedToken = await getDecodedToken(req);

    // Révoquer les tokens actifs de l'utilisateur
    await auth.revokeRefreshTokens(decodedToken.uid);

    // Supprimer l'utilisateur dans Firebase Authentication
    await auth.deleteUser(decodedToken.uid);

    // Supprimer les données personnelles dans Firestore
    await db.collection("users").doc(decodedToken.uid).delete();

    return res.status(200).json({ message: "Compte utilisateur supprimé" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}
