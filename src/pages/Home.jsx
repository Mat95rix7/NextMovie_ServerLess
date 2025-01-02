import useFetch from '../hooks/useFetch';
import BannerHome from '../components/BannerHome';
import MovieCard from '../components/MovieCard';

const Home = () => {

  const URL = import.meta.env.VITE_NP_API_URL

  const { data : data } = useFetch(URL)
  
  return (
    <div>
      <BannerHome/>
      <main className="grid grid-cols-[repeat(auto-fit,300px)] gap-24 justify-center w-10/12 mx-auto m-10">
        {data.map((nowPlayingData) => (
            <MovieCard key={nowPlayingData.id} data = {nowPlayingData}/>
        ))}
      </main>
    </div>
  );
};

export default Home;



