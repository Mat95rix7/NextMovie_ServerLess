import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import MovieDetails from "../components/MovieDetails";
import RegisterPage from '../pages/RegisterPage'
import LoginPage from '../pages/LoginPage'
import SearchPage from "../pages/SearchPage";
import { ProfilePage } from "../pages/ProfilePage";

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
                path : "search",
                element : <SearchPage />
            },
            {
                path : "movie/:id",
                element : <MovieDetails />
            }
        ]
    }
])

export default router