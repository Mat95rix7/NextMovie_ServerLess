import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import MovieDetails from "../components/MovieDetails";
import RegisterPage from '../pages/RegisterPage'
import LoginPage from '../pages/LoginPage'
import SearchPage from "../pages/SearchPage";
import ProfilePage  from "../pages/ProfilePage";
import ContactForm from "../pages/ContactForm";
import About from "../pages/About";

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