import { useState, useRef } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth, updateProfile } from "firebase/auth";
import { useAuth2 } from "../../context/auth/authContext";
import { Camera, Loader2, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { doc, updateDoc } from 'firebase/firestore';
import { db } from "../../config/firebase";

const ProfilePhotoSection = () => {
  const { user, setUser } = useAuth2();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const auth = getAuth();

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      toast.error("Type de fichier non supporté.");
      return;
    }

    if (file.size > maxSize) {
      toast.error("Taille maximale de 5 Mo dépassée.");
      return;
    }

    try {
      setIsUploading(true);
      const storage = getStorage();
      const storageRef = ref(storage, `profilePhotos/${user.uid}`);

      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);

      // Mettre à jour le profil dans Auth
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { photoURL: downloadURL });
      }

      // Mettre à jour Firestore
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        photoURL: downloadURL
      });

      // Mettre à jour le contexte
      setUser(prev => ({ ...prev, photoURL: downloadURL }));
      toast.success("Photo de profil mise à jour.");
    } catch (error) {
      console.error("Erreur lors de l'upload:", error);
      toast.error("Échec du téléchargement.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = async () => {
    try {
      // Mettre à jour le profil dans Auth
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { photoURL: null });
      }

      // Mettre à jour Firestore
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        photoURL: null
      });

      // Mettre à jour le contexte
      setUser(prev => ({ ...prev, photoURL: null }));
      toast.success("Photo de profil supprimée.");
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast.error("Échec de la suppression.");
    }
  };

  return (
<div className="w-full space-y-6 p-4">
  <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
    {/* Section Photo */}
    <div className="relative flex-shrink-0">
      {user.photoURL ? (
        <img 
          src={user.photoURL} 
          alt="Photo de profil" 
          className="w-32 h-32 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-amber-400"
        />
      ) : (
        <div className="w-32 h-32 sm:w-24 sm:h-24 bg-gray-200 rounded-full flex items-center justify-center">
          <Camera className="w-16 h-16 sm:w-12 sm:h-12 text-gray-500" />
        </div>
      )}
    </div>
    
    {/* Section Boutons */}
    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
      <button 
        onClick={() => fileInputRef.current.click()} 
        disabled={isUploading}
        className="w-full sm:w-auto bg-amber-500 text-white px-6 py-3 sm:px-4 sm:py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-amber-600 disabled:opacity-50 transition-colors"
      >
        {isUploading ? (
          <>
            <Loader2 className="w-5 h-5 sm:w-4 sm:h-4 animate-spin mr-2" />
            <span className="text-sm sm:text-base">Téléchargement...</span>
          </>
        ) : (
          <>
            <Camera className="w-5 h-5 sm:w-4 sm:h-4 mr-2" />
            <span className="text-sm sm:text-base">{user.photoURL ? "Modifier" : "Ajouter"}</span>
          </>
        )}
      </button>

      {user.photoURL && (
        <button 
          onClick={handleRemovePhoto}
          className="w-full sm:w-auto bg-red-100 text-red-600 px-6 py-3 sm:px-4 sm:py-2 rounded-lg flex items-center justify-center space-x-2 hover:bg-red-200 transition-colors"
        >
          <Trash2 className="w-5 h-5 sm:w-4 sm:h-4 mr-2" />
          <span className="text-sm sm:text-base">Supprimer</span>
        </button>
      )}

      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/jpeg,image/png,image/gif"
        className="hidden"
      />
    </div>
  </div>

  <p className="text-sm text-gray-600 text-center sm:text-left">
    Formats : JPEG, PNG, GIF (max 5 Mo)
  </p>
</div>  );
};

export default ProfilePhotoSection;