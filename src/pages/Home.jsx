import BannerHome from '../components/BannerHome';
import { Fetching } from '../services/tmdb';
import HorizontalScollCard from '../components/HorizontalScollCard';
const Home = () => {
  
  const { data : topTrendingData } = Fetching('/trending/movie/day')
  const { data : nowPlayingData } = Fetching('/movie/now_playing')
  const { data : topRatedData } = Fetching('/movie/top_rated')
  const { data : topPopularData } = Fetching('/movie/popular')
  const { data : topUpcomingData } = Fetching('/movie/upcoming')

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