import { auth } from "../firebaseAdmin.js";
import { getFirestore } from "firebase-admin/firestore";

const db = getFirestore();

export default async function handler(req, res) {
  const { method } = req;

  if (method !== "GET") {
    return res.status(405).json({ error: "Méthode non autorisée" });
  }

  try {
    // Vérifier l'authentification
    const decodedToken = await getDecodedToken(req);
    
    // Récupérer les données de l'utilisateur depuis Firestore
    const userDoc = await db.collection("users").doc(decodedToken.uid).get();
    
    if (!userDoc.exists) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }
    
    return res.status(200).json({ user: { ...userDoc.data(), uid: decodedToken.uid } });
  } catch (error) {
    console.error("Erreur lors de la récupération du profil:", error);
    return res.status(401).json({ error: "Non autorisé" });
  }
}

async function getDecodedToken(req) {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new Error("Token Firebase manquant ou invalide");
  }

  const idToken = authorization.split("Bearer ")[1];
  return await auth.verifyIdToken(idToken);
}
// import { auth } from "../firebaseAdmin.js";
// import { getFirestore } from "firebase-admin/firestore";

// const db = getFirestore();

// export default async function handler(req, res) {
//   if (req.method !== "GET") {
//     return res.status(405).json({ error: "Méthode non autorisée" });
//   }

//   try {
//     const { authorization } = req.headers;

//     if (!authorization || !authorization.startsWith("Bearer ")) {
//       return res.status(401).json({ error: "Token manquant ou invalide" });
//     }

//     const idToken = authorization.split("Bearer ")[1]; 
//     const decodedToken = await auth.verifyIdToken(idToken); 

//     const uid = decodedToken.uid;
//     const userAuth = await auth.getUser(uid); // Obtenir l'utilisateur Firebase Auth

//     const userDoc = await db.collection("users").doc(uid).get(); // Obtenir les infos Firestore
//     const userData = userDoc.exists ? userDoc.data() : {};

//     return res.status(200).json({
//       uid: userAuth.uid,
//       email: userAuth.email,
//       emailVerified: userAuth.emailVerified,
//       displayName: userData?.displayName || userAuth.displayName,
//       role: userData?.role || "user",
//       photoURL: userData?.photoURL !== undefined ? userData.photoURL : userAuth.photoURL,
//     });
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// }
