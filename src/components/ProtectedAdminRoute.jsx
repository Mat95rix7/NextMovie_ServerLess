// import { Navigate, Outlet } from 'react-router-dom'
// import { useAuth2 } from '../context/userContext'

// const ProtectedAdminRoute = () => {
//     const { isAdmin, isAuthenticated, user } = useAuth2()

//     if (!isAuthenticated || !isAdmin) {
//         console.log('Accès refusé:', { isAuthenticated, role: user?.role })
//         return <Navigate to="/NotFoundPage" replace />
//     }

//     return <Outlet />
// }

// export default ProtectedAdminRoute
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth2 } from '../context/userContext';

const ProtectedAdminRoute = () => {
  const { isAdmin, isAuthenticated, user } = useAuth2();

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
