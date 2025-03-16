import axios from 'axios';
import { useEffect, useState } from 'react';

export async function fetchMovies(query, page = 1) {
  // const searchResponse = await axios.get(`/search/movie?&query=${query}&page=${page}`)
  const searchResponse = await axios.get('/api/movies/search', {
    params: { query, page }
});
console.log(searchResponse);
  const searchData = searchResponse.data;
  
  let movies = await Promise.all(
    searchData.results.map(async (movie) => {
      const detailsResponse = await axios.get(`/api/movies/${movie.id}`)
      const details = detailsResponse.data;
      return { ...movie, runtime: details.runtime };
    })
  );

  return {
    movies,
    totalPages: searchData.total_pages,
    totalResults: searchData.total_results,
    page: searchData.page
  };
}

export async function fetchGenres() {
  const response = await axios.get('/api/movies/genres/list')
  const data = response.data;
  return data.genres;
}

export const Fetching = (endpoint)=>{
  const [data,setData] = useState()
  const [loading,setLoading] = useState(false)
  const [error,setError] = useState(false)

  const fetchData = async()=>{
      try {
          setLoading(true)
          const response = await axios.get(endpoint)
          setLoading(false)
          setData(response.data.results)
      } catch (error) {
          console.log('error',error)
          setError(error)
     }
  }

  useEffect(()=>{
      fetchData()
  },[endpoint])

  return { data, loading, error}
}

export const FetchDetails = (endpoint)=>{
    const [data,setData] = useState()
    const [loading,setLoading] = useState(false)
    const [error,setError] = useState(false)

    const fetchData = async()=>{
        try {
            setLoading(true)
            const response = await axios.get(endpoint)
            setLoading(false)
            setData(response.data)
        } catch (error) {
            console.log('error',error)
            setError(error)
       }
    }
    useEffect(()=>{
        fetchData()
    },[endpoint])

    return { data, loading, error}
}
