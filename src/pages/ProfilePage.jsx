import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import  { getUserProfile }  from '../hooks/userProfile';
import  ProfileHeader   from '../components/profile/ProfileHeader';
import  ProfileSettings  from '../components/profile/ProfileSettings';
import { Toaster } from 'react-hot-toast';
import  UserStats  from '../components/profile/UserStats';

export function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState();
  const [displayName, setDisplayName] = useState('');
  const [stats, setstats] = useState('');

  const loadProfile = useCallback(async () => {
    if (user) {
      const userProfile = await getUserProfile(user.uid);
      setProfile(userProfile);
      setDisplayName(userProfile?.displayName || '');
      setstats(userProfile?.stats || '');
    }
  }, [user]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);  

  // useEffect(() => {
  //     const updateProfile = async () => {
  //       if (user) {
  //           const userProfile = await getUserProfile(user.uid);
  //           localStorage.setItem('profile', JSON.stringify(userProfile));
  //           return userProfile;
  //       };
  //     };
  //     updateProfile()
  // },[user])


  // useEffect(() => {
  //       const savedProfile = localStorage.getItem('profile');
  //       if (savedProfile) {
  //         setProfile(JSON.parse(savedProfile));
  //       }
  // }, [user]);
  

  const handleProfileUpdate = (newdisplayName) => {
    setDisplayName(newdisplayName);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Veuillez vous connecter pour accéder à votre profil</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen  pt-20">
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

export default ProfilePage