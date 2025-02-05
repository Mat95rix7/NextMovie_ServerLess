import { User } from 'lucide-react';
import PropTypes from 'prop-types';

export function ProfileHeader({ user, displayName }) {


  return (
    <div className="bg-amber-400 p-8 rounded-lg text-white mx-3">
      <div className="flex items-center gap-4">
        <div className="p-4 bg-white rounded-full">
          <User className="w-12 h-12 text-amber-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{displayName || user?.email?.split('@')[0]}</h1>
          <p className="text-amber-100">{user?.email}</p>
        </div>
      </div>
    </div>
  );
}

ProfileHeader.propTypes = {
  user: PropTypes.object,
  displayName: PropTypes.string,
  onUpdate: PropTypes.func
};

export default ProfileHeader