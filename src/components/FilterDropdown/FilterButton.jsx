import { SlidersHorizontal } from 'lucide-react';
import PropTypes from 'prop-types';

export function FilterButton({ onClick, activeFiltersCount }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-amber-400 shadow-sm bg-gray-100  text-gray-900  hover:bg-amber-400"
    >
      <SlidersHorizontal className="w-4 h-4" />
      <span className='hidden sm:block'>Filtres</span>
      {activeFiltersCount > 0 && (
        <span className="bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full">
          {activeFiltersCount}
        </span>
      )}
    </button>
  );
}

FilterButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  activeFiltersCount: PropTypes.number.isRequired,
};