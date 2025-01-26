import { useState } from 'react';
import PropTypes from 'prop-types';
import { X } from 'lucide-react';
import { FilterSection } from './FilterSection';

export function FilterOverlay({
  isOpen,
  onClose,
  genres,
  selectedGenres,
  // minRuntime,
  maxRuntime,
  minRating,
  isRecent,
  onGenreChange,
  onRuntimeChange,
  onRatingChange,
  onRecentChange,
  onReset,
}) {
  const [isGenresExpanded, setIsGenresExpanded] = useState(false);
  const [value, setValue] = useState(0);

  if (!isOpen) return null;

  const marks = [0, 1, 2, 3, 4];


   const handleRuntimeChange = (value) => {
    setValue(value);
    const minutes = value * 60;
    onRuntimeChange(minutes);
  };

  return (
    <div className="fixed top-0 right-5  z-50 flex items-start justify-center pt-20">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-gray-200 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg text-black font-semibold">Filtres</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
          <FilterSection 
            title="Genres" 
            isExpandable 
            isExpanded={isGenresExpanded}
            onToggle={() => setIsGenresExpanded(!isGenresExpanded)}
          >
            <div className="grid grid-cols-2 gap-2">
              {genres.map((genre) => (
                <button
                  key={genre.id}
                  onClick={() => {
                    if (selectedGenres.includes(genre.id)) {
                      onGenreChange(selectedGenres.filter((id) => id !== genre.id));
                    } else {
                      onGenreChange([...selectedGenres, genre.id]);
                    }
                  }}
                  className={`px-3 py-2 rounded-lg text-sm ${
                    selectedGenres.includes(genre.id)
                      ? 'bg-amber-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {genre.name}
                </button>
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Date de sortie">
            <div className="flex gap-2">
              <button
                onClick={() => onRecentChange(true)}
                className={`flex-1 px-3 py-2 rounded-lg text-sm ${
                  isRecent
                    ? 'bg-amber-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Récent
              </button>
              <button
                onClick={() => onRecentChange(false)}
                className={`flex-1 px-3 py-2 rounded-lg text-sm ${
                  !isRecent
                    ? 'bg-amber-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Tous
              </button>
            </div>
          </FilterSection>

          <FilterSection title="Durée">
            <div>
              <input
                type="range"
                min="0"
                max="4"
                step="0.5"
                value={maxRuntime/60}
                onChange={(e) => handleRuntimeChange(e.target.value)}
                className="w-full accent-amber-500"
              />

              <div className="relative w-full flex justify-between">
                {marks.map((mark) => (
                  <div key={mark} className="flex flex-col items-center text-sm text-gray-600">
                    <div className={`w-1 h-1 rounded-full mb-2 ${value >= mark ? 'bg-amber-600' : 'bg-gray-300'}`} /> 
                      {mark}h
                </div>
              ))}
              </div>
            </div>
          </FilterSection>

          <FilterSection title="Note minimum">
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={minRating}
                onChange={(e) => onRatingChange(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
              <div className="text-center text-sm text-gray-600">{minRating} / 10</div>
            </div>
          </FilterSection>
        </div>

        <div className="p-4 border-t flex justify-between">
          <button
            onClick={onReset}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            Réinitialiser
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-700"
          >
            Appliquer
          </button>
        </div>
      </div>
    </div>
  );
}

FilterOverlay.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  genres: PropTypes.array.isRequired,
  selectedGenres: PropTypes.array.isRequired,
  // minRuntime: PropTypes.number.isRequired,
  maxRuntime: PropTypes.number.isRequired,
  minRating: PropTypes.number.isRequired,
  isRecent: PropTypes.bool.isRequired,
  onGenreChange: PropTypes.func.isRequired,
  onRuntimeChange: PropTypes.func.isRequired,
  onRatingChange: PropTypes.func.isRequired,
  onRecentChange: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
};