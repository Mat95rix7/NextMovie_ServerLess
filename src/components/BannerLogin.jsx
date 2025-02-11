import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

const BannerLogin = ({ excludeIndex }) => {
    const bannerData = useSelector(state => state.movieData.bannerData);
    const imageURL = useSelector(state => state.movieData.imageURL);
    
    const getRandomIndex = () => {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * bannerData.length);
        } while (newIndex === excludeIndex); // Évite de choisir le même index que l'autre bannière
        return newIndex;
    };

    const [currentImage, setCurrentImage] = useState(getRandomIndex());

    const handleNext = () => {
        setCurrentImage(prev => (prev + 1) % bannerData.length);
    };

    useEffect(() => {
        const interval = setInterval(() => {
            handleNext();
        }, 5000);

        return () => clearInterval(interval);
    }, [bannerData, currentImage]);

    return (
        <section className='w-full h-full'>
            <div className='flex min-h-full max-h-[95vh] overflow-hidden'>
                {bannerData.map((data, index) => (
                    <div 
                        key={data.id + "bannerHome" + index} 
                        className='min-w-full min-h-[250px] lg:min-h-full overflow-hidden relative group transition-all' 
                        style={{ transform: `translateX(-${currentImage * 100}%)` }}
                    >
                        <div className='w-full h-full'>
                            <img
                                src={imageURL + data.backdrop_path}
                                className='h-full w-full object-cover rounded-2xl'
                                alt={data.title || data.name}
                            />
                        </div>
                        <div className='container mx-auto text-white'>
                            <div className='w-full absolute bottom-0 max-w-md px-3'>
                                <h2 className='font-bold text-2xl lg:text-4xl text-white drop-shadow-2xl'>
                                    <Link to={"/movie/" + data.id}>{data?.title || data?.name}</Link>
                                </h2>
                                <Link to={"/movie/" + data.id}>
                                    <button className='bg-white px-4 py-2 text-black font-bold rounded mt-4 hover:bg-gradient-to-l from-red-700 to-orange-500 shadow-md transition-all hover:scale-105 mb-5'>
                                        Voir Plus
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

BannerLogin.propTypes = {
    excludeIndex: PropTypes.number // Permet d'exclure un index pour éviter les répétitions
};

export default BannerLogin;
