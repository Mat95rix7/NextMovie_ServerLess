import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileSettings from '../components/profile/ProfileSettings';
import { Toaster } from 'react-hot-toast';
import UserStats from '../components/profile/UserStats';
import { useAuth2 } from '../context/userContext';

export function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user, setUser } = useAuth2(); 

  useEffect(() => {
    if (user) {
      const userRef = doc(db, 'users', user.uid);
      const unsubscribe = onSnapshot(userRef, (doc) => {
        const userProfile = doc.data();
        setProfile(userProfile);
        setDisplayName(userProfile?.displayName || '');
        setStats(userProfile?.stats || null);
        setLoading(false);
      }, (error) => {
        console.error("Erreur de récupération du profil:", error);
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, [user]);

  const handleProfileUpdate = (newDisplayName) => {
    setDisplayName(newDisplayName);
    setUser({ ...user, displayName: newDisplayName });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Connectez-vous pour accéder à votre profil</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Chargement du profil...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <ProfileHeader user={user} displayName={displayName} />
          <UserStats stats={stats} />  
          <div className="border-t border-gray-200">
            <ProfileSettings user={user} onUpdate={handleProfileUpdate} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;