import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

const ProtectedAdminRoute = () => {
  const { isAdmin, isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Vérification des droits...</div>
  }

  if (!isAuthenticated) {
    console.log('User not authenticated');
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    console.log('Access denied:', { isAuthenticated, role: user?.role });
    return <Navigate to="/notfound" replace />;
  }

  return <Outlet />;
};

export default ProtectedAdminRoute;
