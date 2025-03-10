import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import MovieDetails from "../components/MovieDetails";
import RegisterPage from '../pages/RegisterPage'
import LoginPage from '../pages/LoginPage'
import SearchPage from "../pages/SearchPage";
import ProfilePage  from "../pages/ProfilePage";
import ContactForm from "../pages/Contact";
import About from "../pages/About";
import AdminDashboard from "../pages/AdminDashboard";
import NotFound from "../pages/NotFound";
import ProtectedAdminRoute from "../components/ProtectedAdminRoute";
import CategoryPage from "../pages/Category";
import GenrePage from "../pages/Genres";

const router = createBrowserRouter([
    {
        path : "/",
        element : <App/>,
        children : [
            {
                path : "",
                element : <Home/>
            },
            {
                path : "/about",
                element : <About/>
            },
            {
                path : "/contact",
                element : <ContactForm/>
            },
            {
                path : "/register",
                element : <RegisterPage/>
            },
            {
                path : "/login",
                element : <LoginPage/>
            },
            {
                path : "/profile",
                element : <ProfilePage/>
            },
            {
                path: 'admin',
                element: <ProtectedAdminRoute />,
                children: [
                    {
                        path: '',
                        element: <AdminDashboard />
                    }
                ]
            },
            {
                path : "search",
                element : <SearchPage />
            },
            {
                path : "movie/:id",
                element : <MovieDetails />
            },
            {
                path :"/movies/:category",
                element: <CategoryPage/>
            },
            {
                path :"/genre/:genreId",
                element: <GenrePage/>
            },
            {
                path : "*",
                element : <NotFound />
            }
        ]
    }
])

export default router