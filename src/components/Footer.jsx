// import { Link } from 'react-router-dom'

// const Footer = () => {
//   return (
//     <footer className='w-full min-w-[320px] bg-gray-300 bg-opacity-50 dark:bg-black dark:bg-opacity-50 text-neutral-400 mt-10 py-1'>
//       <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
//         <div className='text-center mt-3'>
//           <h3 className="text-3xl font-bold mb-1 text-amber-600"><Link to="/">NextMovie</Link></h3>
//           <p className="text-gray-600 dark:text-gray-400">
//             Votre compagnon cinéma au quotidien
//           </p>
//         </div>
//         <div>
//           <div className="text-center mt-3 mb-3 text-amber-600">Liens Rapides</div>
//           <div className='grid grid-cols-3 justify-center items-center text-center gap-4 text-gray-600 dark:text-gray-400'>
//             <Link to="/">Home</Link>
//             <Link to="/contact">Contact</Link> 
//             <Link to="/about" >About</Link>
                  
//           </div>
//       </div>
//       </div>
//       <div className="flex flex-col md:flex-row justify-center text-sm border-t border-gray-800 mt-1 mb-1 text-center text-gray-600 dark:text-gray-400">
//         <p className='mt-5'>Created By <strong className='text-amber-600 pe-2'>Mat95rix7</strong></p>
//         <div className='flex justify-center mt-0 md:mt-5'>
//           <p>© 2025 <span className='text-amber-600 pe-2'>NextMovie.</span></p>
//           <p>Tous droits réservés.</p>
//         </div>
//       </div>
//     </footer>
//   )
// }

// export default Footer
import { Link } from 'react-router-dom'
import { FaFacebook, FaInstagram } from 'react-icons/fa'
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className='w-full min-w-[320px] bg-gray-300 bg-opacity-50 dark:bg-black dark:bg-opacity-50 text-neutral-400 mt-10 py-1'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='text-center mt-3'>
          <h3 className="text-3xl font-bold mb-1 text-amber-600"><Link to="/">NextMovie</Link></h3>
          <p className="text-gray-600 dark:text-gray-400">
            Votre compagnon cinéma au quotidien
          </p>
        </div>
        <div>
          <div className="text-center mt-3 mb-3 text-amber-600">Réseaux Sociaux</div>
          <div className='grid grid-cols-3 justify-center items-center text-center gap-4 text-gray-600 dark:text-gray-400'>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FaFacebook className="inline mr-1 text-amber-600" /> Facebook
            </a>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer">
              <FaXTwitter className="inline mr-1 text-amber-600" /> Twitter
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <FaInstagram className="inline mr-1 text-amber-600" /> Instagram
            </a>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row justify-center text-sm border-t border-gray-800 mt-1 mb-1 text-center text-gray-600 dark:text-gray-400">
        <p className='mt-5'>Created By <strong className='text-amber-600 pe-2'>Mat95rix7</strong></p>
        <div className='flex justify-center mt-0 md:mt-5'>
          <p>© 2025 <span className='text-amber-600 pe-2'>NextMovie.</span></p>
          <p>Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer