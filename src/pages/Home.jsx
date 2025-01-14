import BannerHome from '../components/BannerHome';
import { Fetching } from '../services/tmdb';
import HorizontalScollCard from '../components/HorizontalScollCard';

const Home = () => {
  const { data : nowPlayingData } = Fetching('/movie/now_playing')
  const { data : topRatedData } = Fetching('/movie/top_rated')
  const { data : topPopularData } = Fetching('/movie/popular')
  const { data : topUpcomingdData } = Fetching('/movie/upcoming')


   
  return (
    <div>
      <BannerHome/>
      <HorizontalScollCard data={nowPlayingData} heading={"Now Playing Movies"} />
      <HorizontalScollCard data={topPopularData} heading={"Popular Movies"} />
      <HorizontalScollCard data={topRatedData} heading={"Top Rated Movies"} />
      <HorizontalScollCard data={topUpcomingdData} heading={"Upcoming Movies"} />
    </div>
  );
};

export default Home;



