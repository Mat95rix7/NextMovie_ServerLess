import axios from 'axios';
import { useEffect, useState } from 'react';

export async function fetchMovies(query, page = 1) {
  const searchResponse = await axios.get(`/search/movie?&query=${query}&language=fr-FR&page=${page}`)
  const searchData = searchResponse.data;
  
  let movies = await Promise.all(
    searchData.results.map(async (movie) => {
      const detailsResponse = await axios.get(`/movie/${movie.id}?&language=fr-FR`)
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
  const response = await axios.get(`/genre/movie/list?&language=fr-FR`)
  const data = response.data;
  // const data = await response.json();
  return data.genres;
}

export const FetchNowPlaying = (endpoint)=>{
  const [data,setData] = useState([])
  const [loading,setLoading] = useState(false)

  const fetchData = async()=>{
      try {
          setLoading(true)
          const response = await axios.get(endpoint)
          setLoading(false)
          setData(response.data.results)
      } catch (error) {
          console.log('error',error)
     }
  }

  useEffect(()=>{
      fetchData()
  },[endpoint])

  return { data , loading}
}

