import { useRef } from 'react';
import PropTypes from 'prop-types';
import MovieCard from './MovieCard';
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';

const HorizontalScrollCard = ({ data = [], heading, renderItem, click = false, link }) => {
    const containerRef = useRef();
    const navigate = useNavigate();

    const handleNext = () => {
        containerRef.current.scrollLeft += 265;
    };

    const handlePrevious = () => {
        containerRef.current.scrollLeft -= 265;
    };

    const defaultRenderItem = (item, index) => (
        <MovieCard key={`${item.id}-scroll-${index}`} data={item} index={index + 1} />
    );

    const handleClick = () => {
        if (click) {
            navigate(`/movies/${link}`, {
                state: { data, heading }
            });
        }
    };

    const itemRenderer = renderItem || defaultRenderItem;

    return (
        <div className='container mx-auto px-3 my-10'>
            <h2
                className={`heading text-xl lg:text-2xl font-bold mb-3 capitalize ${click ? "cursor-pointer text-amber-500" : ""}`}
                onClick={handleClick}
            >
                {heading}
            </h2>

            <div className='relative'>
                <div 
                    ref={containerRef} 
                    className='grid grid-cols-[repeat(auto-fit,230px)] grid-flow-col gap-10 overflow-hidden overflow-x-scroll relative z-10 scroll-smooth transition-all scrolbar-none'
                >
                    {data.map((item, index) => itemRenderer(item, index))}
                </div>

                <div className='absolute top-0 flex justify-between w-full h-full items-center'>
                    <button 
                        onClick={handlePrevious} 
                        className='bg-white p-1 text-black rounded-full -ml-2 z-10 hover:bg-gray-100 transition-colors'
                    >
                        <FaAngleLeft />
                    </button>
                    <button 
                        onClick={handleNext} 
                        className='bg-white p-1 text-black rounded-full -mr-2 z-10 hover:bg-gray-100 transition-colors'
                    >
                        <FaAngleRight />
                    </button>
                </div>
            </div>
        </div>
    );
};

HorizontalScrollCard.propTypes = {
    data: PropTypes.array.isRequired,
    heading: PropTypes.string.isRequired,
    renderItem: PropTypes.func
};

export default HorizontalScrollCard;