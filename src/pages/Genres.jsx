// // components/GenrePage.jsx
// import { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import MovieCard from '../components/MovieCard';
// import axios from 'axios';
// import { Helmet } from 'react-helmet-async';
// import  { useGenres } from '../hooks/useGenres';

// function GenrePage() {
//   const { genreId } = useParams();
//   const [movies, setMovies] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [page, setPage] = useState(1);
//   const [currentGenre, setCurrentGenre] = useState(null);

//   const { genres } = useGenres();

//   useEffect(() => {
//     // Réinitialiser l'état quand le genre change
//     setMovies([]);
//     setPage(1);
    
//     // Chercher le genre correspondant à l'ID
//     const numericGenreId = parseInt(genreId, 10);
//     const foundGenre = genres.find(g => g.id === numericGenreId);
//     console.log(foundGenre);
//     setCurrentGenre(foundGenre || null);
//   }, [genreId, genres]);

  

  
//   useEffect(() => {
//     const fetchMovies = async () => {
//       setLoading(true);
//       try {
        
//         if (!currentGenre) {
//           throw new Error('Genre non reconnu');
//         }

//         const response = await axios.get(
//           `/discover/movie?with_genres=${currentGenre.id}&page=${page}&language=fr-FR`
//         );
        
//         if (response.status !== 200) {
//           throw new Error('Erreur lors de la récupération des données');
//         }
        
//         const data = await response.data
//         console.log(data);
        
//         if (page === 1) {
//           // Remplacer les films si c'est la première page
//           setMovies(data.results);
//         } else {
//           // Ajouter les nouveaux films aux existants si c'est une page suivante
//           setMovies(prevMovies => [...prevMovies, ...data.results]);
//         }
        
//         setError(null);
//       } catch (err) {
//         setError(err.message);
//         if (page === 1) {
//           setMovies([]);
//         }
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     fetchMovies();
//   }, [genreId, page, currentGenre]);
  
//   const loadMoreMovies = () => {
//     setPage(prevPage => prevPage + 1);
//   };
    
//   if (loading && movies.length === 0) {
//     return <div className="flex flex-col items-center justify-center h-screen text-amber-600">Chargement des films...</div>;
//   }

//   if (!currentGenre) {
//     return (
//       <div className="flex flex-col items-center justify-center h-screen text-amber-600">
//         <h2>Genre non trouvé</h2>
//         <p>Le genre avec l&apos;ID {genreId} n&apos;existe pas ou n&apos;est pas disponible.</p>
//       </div>
//     );
//   }
  
//   if (error && movies.length === 0) {
//     return <div className="error">Erreur: {error}</div>;
//   }
  
//   return (
//     <div>
//         <Helmet>
//             <title>{currentGenre.name} - NextMovie</title>
//             <meta name="description" content={`Explorez les meilleurs films de la catégorie ${currentGenre.name} sur NextMovie.`} />
//             <meta name="keywords" content={`films, catégorie ${currentGenre.name}, cinéma, NextMovie, films ${currentGenre.name}`} />
//             <meta property="og:title" content={`Films ${currentGenre.name} - NextMovie`} />
//             <meta property="og:description" content={`Découvrez les films ${currentGenre.name} les plus populaires et à venir sur NextMovie.`} />
//             <meta property="og:type" content="website" />
//             <meta property="og:url" content={`https://nextmoviez.vercel.app/genre/${currentGenre.id}`} />
//             <meta property="og:image" content="https://nextmoviez.vercel.app/assets/Logo-T_7X-Wo7.jpg" />
//             <link rel="canonical" href={`https://nextmoviez.vercel.app/genre/${currentGenre.id}`} />
//         </Helmet>
//         <h1 className="text-2xl font-bold ms-28 mt-28">Catégorie :  <span className="text-amber-600"> {currentGenre.name}</span></h1>
        
//         {movies.length === 0 ? (
//             <p className="flex flex-col items-center justify-center h-screen text-amber-600">Aucun film trouvé pour ce genre.</p>
//         ) : (
//             <>
//             <div className="grid grid-cols-[repeat(auto-fit,250px)] gap-14 justify-center w-[80%] mx-auto">
//                 {movies.map(movie => (
//                 <MovieCard key={movie.id} data={movie} />
//                 ))}
//             </div>
            
//             <button className="w-full text-center mt-8 py-2 px-4 text-amber-600" onClick={loadMoreMovies} disabled={loading}>
//                 {loading ? 'Chargement...' : 'Charger plus de films'}
//             </button>
//             </>
//         )}
//     </div>
//   );
// }

// export default GenrePage;
import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import axios from 'axios';
import { Helmet } from 'react-helmet-async';
import { useGenres } from '../hooks/useGenres';

function GenrePage() {
  const { genreId } = useParams();
  const location = useLocation();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [currentGenre, setCurrentGenre] = useState(null);

  const { genres } = useGenres();

  const dataFromState = location.state?.data; 
  const headingFromState = location.state?.heading;

  useEffect(() => {
    // Si les données sont présentes dans state, on les utilise directement
    if (dataFromState) {
      setMovies(dataFromState); // Utiliser les films passés via state
      const foundGenre = genres.find(g => g.name === headingFromState); // Trouver le genre avec le titre reçu
      setCurrentGenre(foundGenre || null);
      setLoading(false);
    } else {
      // Si pas de données dans state, faire la requête API comme d'habitude
      setMovies([]);
      setPage(1);
      const numericGenreId = parseInt(genreId, 10);
      const foundGenre = genres.find(g => g.id === numericGenreId);
      setCurrentGenre(foundGenre || null);
    }
  }, [genreId, genres, dataFromState, headingFromState]);

  useEffect(() => {
    if (!dataFromState && currentGenre) {
      const fetchMovies = async () => {
        setLoading(true);
        try {
          const response = await axios.get(
            `/discover/movie?with_genres=${currentGenre.id}&page=${page}&language=fr-FR`
          );

          if (response.status !== 200) {
            throw new Error('Erreur lors de la récupération des données');
          }

          const data = await response.data;

          if (page === 1) {
            setMovies(data.results);
          } else {
            setMovies(prevMovies => [...prevMovies, ...data.results]);
          }

          setError(null);
        } catch (err) {
          setError(err.message);
          if (page === 1) {
            setMovies([]);
          }
        } finally {
          setLoading(false);
        }
      };

      fetchMovies();
    }
  }, [currentGenre, page, dataFromState]);

  const loadMoreMovies = () => {
    setPage(prevPage => prevPage + 1);
  };

  if (loading && movies.length === 0) {
    return <div className="flex flex-col items-center justify-center h-screen text-amber-600">Chargement des films...</div>;
  }

  if (!currentGenre) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-amber-600">
        <h2>Genre non trouvé</h2>
        <p>Le genre avec l&apos;ID {genreId} n&apos;existe pas ou n&apos;est pas disponible.</p>
      </div>
    );
  }

  if (error && movies.length === 0) {
    return <div className="error">Erreur: {error}</div>;
  }

  return (
    <div>
      <Helmet>
        <title>{currentGenre.name} - NextMovie</title>
        <meta name="description" content={`Explorez les meilleurs films de la catégorie ${currentGenre.name} sur NextMovie.`} />
        <meta name="keywords" content={`films, catégorie ${currentGenre.name}, cinéma, NextMovie, films ${currentGenre.name}`} />
        <meta property="og:title" content={`Films ${currentGenre.name} - NextMovie`} />
        <meta property="og:description" content={`Découvrez les films ${currentGenre.name} les plus populaires et à venir sur NextMovie.`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://nextmoviez.vercel.app/genre/${currentGenre.id}`} />
        <meta property="og:image" content="https://nextmoviez.vercel.app/assets/Logo-T_7X-Wo7.jpg" />
        <link rel="canonical" href={`https://nextmoviez.vercel.app/genre/${currentGenre.id}`} />
      </Helmet>

      <h1 className="text-2xl font-bold ms-28 mt-28">
        Catégorie : <span className="text-amber-600"> {currentGenre.name}</span>
      </h1>

      {movies.length === 0 ? (
        <p className="flex flex-col items-center justify-center h-screen text-amber-600">Aucun film trouvé pour ce genre.</p>
      ) : (
        <>
          <div className="grid grid-cols-[repeat(auto-fit,250px)] gap-14 justify-center w-[80%] mx-auto">
            {movies.map(movie => (
              <MovieCard key={movie.id} data={movie} />
            ))}
          </div>

          <button className="w-full text-center mt-8 py-2 px-4 text-amber-600" onClick={loadMoreMovies} disabled={loading}>
            {loading ? 'Chargement...' : 'Charger plus de films'}
          </button>
        </>
      )}
    </div>
  );
}

export default GenrePage;
