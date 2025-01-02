import React, { useState } from 'react';
import { X } from 'lucide-react';
import { FilterSection } from './FilterSection';

export function FilterOverlay({
  isOpen,
  onClose,
  genres,
  selectedGenres,
  minRuntime,
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

  if (!isOpen) return null;

  const handleRuntimeChange = (value) => {
    const minutes = Math.round((value / 100) * 240);
    onRuntimeChange(0, minutes);
  };

  const getRuntimeLabel = (maxMinutes) => {
    if (maxMinutes >= 240) return "Tous";
    if (maxMinutes >= 180) return "3h et moins";
    if (maxMinutes >= 120) return "2h et moins";
    return "1h30 et moins";
  };

  const sliderValue = (maxRuntime / 240) * 100;

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
                Ancien
              </button>
            </div>
          </FilterSection>

          <FilterSection title="Durée">
            <div className="space-y-4 ">
              <input
                type="range"
                min="0"
                max="100"
                value={sliderValue}
                onChange={(e) => handleRuntimeChange(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
              <div className="text-center text-sm text-gray-600">
                {getRuntimeLabel(maxRuntime)}
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
              <div className="text-center">{minRating} / 10</div>
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