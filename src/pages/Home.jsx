import BannerHome from '../components/BannerHome';
import { Fetching } from '../services/tmdb';
import HorizontalScollCard from '../components/HorizontalScollCard';
import { Helmet } from 'react-helmet-async';

const Home = () => {
  
  const { data : topTrendingData } = Fetching('/trending/movie/day')
  const { data : nowPlayingData } = Fetching('/movie/now_playing')
  const { data : topRatedData } = Fetching('/movie/top_rated')
  const { data : topPopularData } = Fetching('/movie/popular')
  const { data : topUpcomingData } = Fetching('/movie/upcoming')

  return (
    <div className='min-w-[320px]'>
      <Helmet>
        <title>NextMovie - Découvrez les meilleurs films à voir</title>
        <meta name="description" content="Explorez les films à l'affiche, les plus populaires et les prochaines sorties sur NextMovie" />
        <meta property="og:title" content="NextMovie - Les meilleurs films à découvrir" />
        <meta property="og:description" content="Découvrez notre collection de films populaires, bien notés et à venir" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://my-cineapp.vercel.app/" />
        <link rel="canonical" href="https://my-cineapp.vercel.app/" />
      </Helmet>
      <BannerHome/>
      <HorizontalScollCard data={topTrendingData} heading={"Trending Movies"} click={true} link={"trending"}/>
      <HorizontalScollCard data={nowPlayingData} heading={"Now Playing Movies"} click={true} link={"now-playing"}/>
      <HorizontalScollCard data={topPopularData} heading={"Popular Movies"} click={true} link={"popular"}/>
      <HorizontalScollCard data={topRatedData} heading={"Top Rated Movies"} click={true} link={"top-rated"}/>
      <HorizontalScollCard data={topUpcomingData} heading={"Upcoming Movies"} click={true} link={"upcoming"} />
    </div>
  );
};

export default Home;