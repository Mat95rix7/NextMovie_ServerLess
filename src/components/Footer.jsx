import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className='text-center bg-neutral-600 bg-opacity-35 text-neutral-400 py-2'>
        <div className='flex items-center justify-center gap-4'>
          <Link to="/about" >About</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <p className='text-sm'>Created By <strong className='text-amber-600 text-xl'>Mat95rix7</strong></p>
    </footer>
  )
}

export default Footer
