import { useState, useRef } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getAuth, updateProfile } from "firebase/auth";
import { useAuth2 } from "../../context/userContext";
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
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <div className="relative">
          {user.photoURL ? (
            <img 
              src={user.photoURL} 
              alt="Photo de profil" 
              className="w-24 h-24 rounded-full object-cover border-2 border-amber-400"
            />
          ) : (
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
              <Camera className="w-12 h-12 text-gray-500" />
            </div>
          )}
        </div>
        
        <div className="flex space-x-2">
          <button 
            onClick={() => fileInputRef.current.click()} 
            disabled={isUploading}
            className="bg-amber-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-amber-600 disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Téléchargement...
              </>
            ) : (
              <>
                <Camera className="w-4 h-4 mr-2" />
                {user.photoURL ? "Modifier" : "Ajouter"}
              </>
            )}
          </button>

          {user.photoURL && (
            <button 
              onClick={handleRemovePhoto}
              className="bg-red-100 text-red-600 px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-red-200"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Supprimer
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
      <p className="text-sm text-gray-600">
        Formats : JPEG, PNG, GIF (max 5 Mo)
      </p>
    </div>
  );
};

export default ProfilePhotoSection;