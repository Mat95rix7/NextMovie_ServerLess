import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import  { getUserProfile }  from '../services/userService';
import  ProfileHeader   from '../components/profile/ProfileHeader';
import { getDoc, doc } from 'firebase/firestore';
import  ProfileSettings  from '../components/profile/ProfileSettings';
import { Toaster } from 'react-hot-toast';
import  UserStats  from '../components/profile/UserStats';
import { db } from '../config/firebase';


export function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [username, setUsername] = useState('');

  useEffect(() => {
    const loadProfile = async () => {
      if (user) {
        const userProfile = await getUserProfile(user.uid);
        setProfile(userProfile);
        // setUsername(userProfile?.username || '');
      }
    };
    loadProfile();
  }, [profile]);

  useEffect(() => {
      const updateProfile = async () => {
        if (user) {
            const userProfile = await getUserProfile(user.uid);
            localStorage.setItem('profile', JSON.stringify(userProfile));
            return userProfile;
        };
      };
      updateProfile()
  },[user])


  useEffect(() => {
        const savedProfile = localStorage.getItem('profile');
        if (savedProfile) {
          setProfile(JSON.parse(savedProfile));
        }
  }, [user]);
  

  const handleProfileUpdate = (newUsername) => {
    setUsername(newUsername);
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
          <ProfileHeader user={user} username={username} />
          <UserStats stats={profile?.stats} />  
          <div className="border-t border-gray-200">
            <ProfileSettings user={user} onUpdate={handleProfileUpdate} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage