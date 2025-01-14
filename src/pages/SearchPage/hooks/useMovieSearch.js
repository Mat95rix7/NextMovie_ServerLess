import { useState, useEffect, useCallback } from 'react';
import { fetchMovies } from '../../../services/tmdb';
import { useInfiniteScroll } from '../../../hooks/useInfiniteScroll'

export function useMovieSearch(searchQuery) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 0
  });

  const fetchMoviesData = useCallback(async (query, page = 1) => {
    if (!query) return;
    
    setLoading(true);
    try {
      const { movies: newMovies, totalPages, page: currentPage } = await fetchMovies(query, page);
      setMovies(prev => page === 1 ? newMovies : [...prev, ...newMovies]);
      setPagination({ currentPage, totalPages });
      console.log(pagination.totalPages);
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMore = useCallback(() => {
    if (pagination.currentPage < pagination.totalPages && !loading) {
      fetchMoviesData(searchQuery, pagination.currentPage + 1);
    }
  }, [searchQuery, pagination.currentPage, pagination.totalPages, loading, fetchMoviesData]);

  useInfiniteScroll(loadMore, pagination.currentPage < pagination.totalPages);

  useEffect(() => {
    fetchMoviesData(searchQuery, 1);
  }, [searchQuery, fetchMoviesData]);

  return { movies, loading, pagination };
}

// import axios from 'axios'
// import { useEffect, useState } from 'react'
// import Card from '../components/Card'

// export const useMovieSearch = (searchQuery) => {

//   const [pageNo,setPageNo] = useState(1)
//   const [data,setData] = useState([])
//   const [totalPageNo,setTotalPageNo] = useState(0)

//   const fetchData = async()=>{
//     try {
//       const { movies: newMovies, totalPages, totalResults, page: currentPage } = fetchMovies(searchQuery, page)

//         setData((preve)=>{
//           return[
//               ...preve,
//               ...newMovies
//           ]
//         })
//         setTotalPageNo(totalPages)
//     } catch (error) {
//         console.log('error',error)
//     }
//   }

//   const handleScroll = ()=>{
//     if((window.innerHeight + window.scrollY ) >= document.body.offsetHeight){
//       setPageNo(preve => preve + 1)
//     }
//   }

//   useEffect(()=>{
//     fetchData()
//   },[pageNo])

//   useEffect(()=>{
//       setPageNo(1)
//       setData([])
//       fetchData()
//   },[searchQuery])

//   useEffect(()=>{
//       window.addEventListener('scroll',handleScroll)
//   },[])

//   return { data, loading:false, pagination };

// }