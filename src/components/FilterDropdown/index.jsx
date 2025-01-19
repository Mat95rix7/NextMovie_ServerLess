import { useState } from 'react';
import PropTypes from 'prop-types';
import { FilterButton } from './FilterButton';
import { FilterOverlay } from './FilterOverlay';

export function FilterDropdown(props) {
  const [isOpen, setIsOpen] = useState(false);

  const activeFiltersCount = 
    (props.selectedGenres.length > 0 ? 1 : 0) +
    (props.maxRuntime < 240 ? 1 : 0) +
    (props.minRating > 0 ? 1 : 0) +
    (props.isRecent ? 1 : 0);

  const handleReset = () => {
    props.onGenreChange([]);
    props.onRuntimeChange(240);
    props.onRatingChange(0);
    props.onRecentChange(false);
  };

  return (
    <>
      <FilterButton 
        onClick={() => setIsOpen(true)} 
        activeFiltersCount={activeFiltersCount}
      />
      <FilterOverlay
        {...props}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onReset={handleReset}
      />
    </>
  );
}

FilterDropdown.propTypes = {
  genres: PropTypes.array.isRequired,
  selectedGenres: PropTypes.arrayOf(PropTypes.string).isRequired,
  minRuntime: PropTypes.number.isRequired,
  maxRuntime: PropTypes.number.isRequired,
  minRating: PropTypes.number.isRequired,
  isRecent: PropTypes.bool.isRequired,
  onGenreChange: PropTypes.func.isRequired,
  onRuntimeChange: PropTypes.func.isRequired,
  onRatingChange: PropTypes.func.isRequired,
  onRecentChange: PropTypes.func.isRequired,
}