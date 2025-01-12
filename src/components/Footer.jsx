import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className='dark:bg-neutral-800 bg-neutral-200 bg-opacity-35 text-neutral-400 py-2'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='text-center mt-3'>
          <h3 className="text-3xl font-bold mb-1 text-amber-600"><Link to="/">MovieApp</Link></h3>
          <p className="text-gray-400">
            Votre compagnon cinéma au quotidien
          </p>
        </div>
        <div>
          <div className="text-center mt-3 mb-3 text-amber-600">Liens Rapides</div>
          <div className='grid grid-cols-3 justify-center items-center text-center gap-4'>
            <Link to="/">Home</Link>
            <Link to="/contact">Contact</Link> 
            <Link to="/about" >About</Link>
                  
          </div>
      </div>
      </div>
      <div className="flex flex-col md:flex-row justify-center text-sm border-t border-gray-800 mt-6 mb-5 text-center text-gray-400">
        <p className='mt-5'>Created By <strong className='text-amber-600 pe-2'>Mat95rix7</strong></p>
        <div className='flex justify-center mt-0 md:mt-5'>
          <p>© 2024 <span className='text-amber-600 pe-2'>MovieApp.</span></p>
          <p>Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
