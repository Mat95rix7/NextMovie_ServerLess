import { useState } from 'react';
import PropTypes from 'prop-types';

function GenreCheckbox({ genre, onGenreChange }) {
  const [isChecked, setIsChecked] = useState(false);

  const handleChange = () => {
    setIsChecked(isChecked =>!isChecked)
    onGenreChange(genre, isChecked); 
 
  };

  return (
    <label className="block mb-3">
      <input className='me-2'
        type="checkbox" 
        value={genre} 
        checked={isChecked} 
        onChange={handleChange} 
      />
      {genre}
    </label>
  );
}

GenreCheckbox.propTypes = {
    genre: PropTypes.string,
    onGenreChange: PropTypes.func
};

export default GenreCheckbox;