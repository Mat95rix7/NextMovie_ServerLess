import { useRef } from 'react'
import PropTypes from 'prop-types';
import MovieCard from './MovieCard'
import { FaAngleRight, FaAngleLeft } from "react-icons/fa6";

const HorizontalScollCard = ({data = [], heading}) => {
    const contaierRef = useRef()

    const handleNext = ()=>{
        contaierRef.current.scrollLeft += 300
    }
    const handlePrevious = ()=>{
        contaierRef.current.scrollLeft -= 300
    }
  return (
    <div className='container mx-auto px-3 my-10'>
          <h2 className='text-xl lg:text-2xl font-bold mb-3 capitalize'>{heading}</h2>

          <div className=' relative'>
                <div  ref={contaierRef} className='grid grid-cols-[repeat(auto-fit,230px)] grid-flow-col gap-6 overflow-hidden overflow-x-scroll relative z-10 scroll-smooth transition-all scrolbar-none'>
                    {
                        data.map((data,index)=>{
                        return (
                            <MovieCard key={data.id+"heading"+index} data={data} index={index+1} />
                        )
                        })
                    }
                </div>

                <div className='absolute top-0 flex justify-between w-full h-full items-center'>
                    <button onClick={handlePrevious} className='bg-white p-1 text-black rounded-full -ml-2 z-10'>
                        <FaAngleLeft/>
                    </button>
                    <button onClick={handleNext} className='bg-white p-1 text-black rounded-full -mr-2 z-10'>
                        <FaAngleRight/>
                    </button>
                </div>
          </div>
          
        </div>
  )
}

HorizontalScollCard.propTypes = {
    data: PropTypes.array.isRequired,
    heading: PropTypes.string.isRequired
}

export default HorizontalScollCard
