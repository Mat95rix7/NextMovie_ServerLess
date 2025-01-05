export function ProfileStats({ stats }) {
  return (
    <div className="grid grid-cols-3 gap-4 p-6 bg-white shadow-sm">
      <div className="text-center">
        <p className="text-2xl font-bold text-amber-400">{stats?.watchlist || 0}</p>
        <p className="text-gray-600">Watchlist</p>
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold text-amber-400">{stats?.favorites || 0}</p>
        <p className="text-gray-600">Favoris</p>
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold text-amber-400">{stats?.reviews || 0}</p>
        <p className="text-gray-600">Avis</p>
      </div>
    </div>
  );
}

export default ProfileStats