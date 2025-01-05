const API_KEY = import.meta.env.VITE_API_TOKEN;
const BASE_URL = 'https://api.themoviedb.org/3';

const options = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  },
};
export async function fetchMovies(query, page = 1, filters) {
  const searchResponse = await fetch(
    `${BASE_URL}/search/movie?&query=${query}&language=fr-FR&page=${page}`, options
  );
  const searchData = await searchResponse.json();
  
  let movies = await Promise.all(
    searchData.results.map(async (movie) => {
      const detailsResponse = await fetch(
        `${BASE_URL}/movie/${movie.id}?&language=fr-FR`, options
      );
      const details = await detailsResponse.json();
      return { ...movie, runtime: details.runtime };
    })
  );

  // if (filters.selectedGenres.length > 0) {
  //   movies = movies.filter((movie) =>
  //     movie.genre_ids.some((id) => filters.selectedGenres.includes(id))
  //   );
  // }

  // if (filters.minRuntime) {
  //   movies = movies.filter(
  //     (movie) => movie.runtime >= filters.minRuntime
  //   );
  // }

  // if (filters.maxRuntime) {
  //   movies = movies.filter(
  //     (movie) => movie.runtime <= filters.maxRuntime
  //   );
  // }

  // if (filters.minRating) {
  //   movies = movies.filter(
  //     (movie) => movie.vote_average >= filters.minRating
  //   );
  // }

  return {
    movies,
    totalPages: searchData.total_pages,
    totalResults: searchData.total_results,
    page: searchData.page
  };
}

export async function fetchGenres() {
  const response = await fetch(
    `${BASE_URL}/genre/movie/list?&language=fr-FR`, options
  );
  const data = await response.json();
  return data.genres;
}