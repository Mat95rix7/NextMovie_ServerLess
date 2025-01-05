import { User } from 'lucide-react';

export function ProfileHeader({ user, username }) {
  return (
    <div className="bg-amber-400 p-8 rounded-t-lg text-white">
      <div className="flex items-center gap-4">
        <div className="p-4 bg-white rounded-full">
          <User className="w-12 h-12 text-amber-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{username || user?.email?.split('@')[0]}</h1>
          <p className="text-amber-100">{user?.email}</p>
        </div>
      </div>
    </div>
  );
}

export default ProfileHeader