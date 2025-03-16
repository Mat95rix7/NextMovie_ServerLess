import BannerHome from '../components/BannerHome';
import { Fetching } from '../services/tmdb';
import HorizontalScollCard from '../components/HorizontalScollCard';
const Home = () => {
  
  const { data : topTrendingData } = Fetching('/api/movies/trending/day')
  const { data : nowPlayingData } = Fetching('/movie/now_playing')
  const { data : topRatedData } = Fetching('/api/movies/top-rated')
  const { data : topPopularData } = Fetching('/api/movies/popular')
  const { data : topUpcomingData } = Fetching('/api/movies/upcoming')

  return (
    <div className='min-w-[320px]'>
      <BannerHome/>
      <HorizontalScollCard data={topTrendingData} heading={"Trending Movies"} click={true} link={"/movies/trending"}/>
      <HorizontalScollCard data={nowPlayingData} heading={"Now Playing Movies"} click={true} link={"/movies/now-playing"}/>
      <HorizontalScollCard data={topPopularData} heading={"Popular Movies"} click={true} link={"/movies/popular"}/>
      <HorizontalScollCard data={topRatedData} heading={"Top Rated Movies"} click={true} link={"/movies/top-rated"}/>
      <HorizontalScollCard data={topUpcomingData} heading={"Upcoming Movies"} click={true} link={"/movies/upcoming"} />
    </div>
  );
};

export default Home;