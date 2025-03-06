import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import MovieCard from "../components/MovieCard";
import { Fetching } from "../services/tmdb";

function CategoryPage() {
    // Mémoriser le tableau validCategories
    const validCategories = useMemo(() => ["trending", "now-playing", "upcoming", "top-rated", "popular"], []);
    
    const location = useLocation();
    const navigate = useNavigate();
    const { category } = useParams();
    
    // État pour gérer les données et le rendu
    const [stateData, setStateData] = useState([]);
    const [stateHeading, setStateHeading] = useState("");
    const [useStateData, setUseStateData] = useState(false);
    
    // Vérifier la validité de la catégorie - toujours au niveau supérieur
    const isValidCategory = validCategories.includes(category);
    
    // Redirection si catégorie invalide
    useEffect(() => {
        if (!isValidCategory) {
            navigate("/", { replace: true });
        }
    }, [category, navigate, isValidCategory]);
    
    // Gérer les données de location.state
    useEffect(() => {
        if (location.state?.data && location.state?.data.length > 0) {
            setStateData(location.state.data);
            setStateHeading(location.state.heading || "Unknown");
            setUseStateData(true);
        } else {
            setUseStateData(false);
        }
    }, [location.state]);
    
    // Déterminer l'endpoint et le titre en fonction de la catégorie
    const { endpoint, categoryHeading } = useMemo(() => {
        if (!isValidCategory) {
            return { endpoint: "", categoryHeading: "" };
        }
        
        let endpoint = "";
        let categoryHeading = "";
        
        switch (category) {
            case "trending": {
                endpoint = '/trending/movie/day';
                categoryHeading = "Trending Movies";
                break;
            }
            case "now-playing": {
                endpoint = '/movie/now_playing';
                categoryHeading = "Now Playing Movies";
                break;
            }
            case "upcoming": {
                endpoint = '/movie/upcoming';
                categoryHeading = "Upcoming Movies";
                break;
            }
            case "top-rated": {
                endpoint = '/movie/top_rated';
                categoryHeading = "Top Rated Movies";
                break;
            }
            case "popular": {
                endpoint = '/movie/popular';
                categoryHeading = "Popular Movies";
                break;
            }
            default: {
                endpoint = "";
                categoryHeading = "Unknown";
            }
        }
        
        return { endpoint, categoryHeading };
    }, [category, isValidCategory]);
    
    // Utiliser le hook Fetching pour récupérer les données
    const { data: fetchedData, loading } = Fetching(endpoint);
    
    // Déterminer les données et le titre à afficher
    const displayData = useStateData ? stateData : fetchedData;
    const displayHeading = useStateData ? stateHeading : categoryHeading;
    
    // Rendu conditionnel - pas de return précoce avant les hooks
    if (!isValidCategory) {
        return null;
    }
    
    return (
        <>
            <h1 className="text-2xl font-bold ms-28 mt-28">{displayHeading}</h1>
            <div className="grid grid-cols-[repeat(auto-fit,250px)] gap-14 justify-center w-[80%] mx-auto">
                {loading ? (
                    <p className="col-span-full text-center p-10">Chargement des films...</p>
                ) : displayData && displayData.length > 0 ? (
                    displayData.map((movie) => (
                        <MovieCard key={`${movie.id}-${movie.title}`} data={movie} />
                    ))
                ) : (
                    <p className="col-span-full text-center p-10">Aucun film trouvé</p>
                )}
            </div>
        </>
    );
}

export default CategoryPage;