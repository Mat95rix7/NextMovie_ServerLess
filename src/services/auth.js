import { getAuth, signInWithCustomToken, signOut } from "firebase/auth"; 

export async function getFirebaseToken() {
  const auth = getAuth();
  const user = auth.currentUser;
  if (user) {
    return await user.getIdToken();
  }
  throw new Error("Utilisateur non authentifié");
}

  export async function login(email, password) {
    const auth = getAuth();
    try {
      
      const res = await fetch("/api/auth/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "login",
          email,
          password
        }),
        credentials: "include", // Inclure le cookie dans la requête
      });
  
      const data = await res.json();

      if (!res.ok) {
        console.error("Erreur de connexion :", data.error);
        return { success: false, error: data.error };
      }

      const token = data.customToken;

      await signInWithCustomToken(auth, token);

      console.log("Connexion réussie !");
      return { success: true }; 
    } catch (error) {
      console.error("Erreur réseau lors de la connexion :", error);
      return { success: false, error: "Erreur de connexion au serveur" };
    }
  
    
  }
  
  export async function signup(email, password, displayName) {
    const auth = getAuth();
    try {
      const res = await fetch("/api/auth/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "signup",
          email,
          password,
          displayName
        }),
        credentials: "include",
      });
    
      const data = await res.json();

      const token = data.customToken;

      await signInWithCustomToken(auth, token);
    
      if (res.ok) {
        // onAuthStateChanged sera déclenché automatiquement
        console.log("Inscription réussie !");
        return { success: true };
      } else {
        console.error("Erreur d'inscription :", data.error);
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error("Erreur réseau lors de l'inscription :", error);
      return { success: false, error: "Erreur de connexion au serveur" };
    }
  }
  

  export async function logout() {
    const auth = getAuth();
    try {
      const res = await fetch("/api/auth/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "logout"
        }),
        credentials: "include",
      });
    
      const data = await res.json();

      if (res.ok) {
        // onAuthStateChanged détectera automatiquement la déconnexion
        console.log("Déconnexion réussie !");
        signOut(auth)
        return { success: true };
      } else {
        console.error("Erreur de déconnexion :", data.error);
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error("Erreur réseau lors de la déconnexion :", error);
      return { success: false, error: "Erreur de connexion au serveur" };
    }
  }


  
  