import { User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../config/firebase';
import PropTypes from 'prop-types';

export function ProfileHeader({ user, displayName }) {
  const [currentUser, setCurrentUser] = useState(user);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (updatedUser) => {
      if (updatedUser) {
        setCurrentUser(updatedUser);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="bg-amber-400 p-8 rounded-b-lg text-white mx-3">
      <div className="flex items-center gap-4">
        <div className="p-1 bg-white rounded-full">
          {currentUser?.photoURL ? (
            <img 
              src={currentUser.photoURL} 
              alt="Photo de profil" 
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <User className="w-12 h-12 text-amber-400" />
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold">
            {displayName || currentUser?.email?.split('@')[0]}
          </h1>
          <p className="text-amber-100">{currentUser?.email}</p>
        </div>
      </div>
    </div>
  );
}

ProfileHeader.propTypes = {
  user: PropTypes.object,
  displayName: PropTypes.string
};

export default ProfileHeader;