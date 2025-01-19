import React from 'react';
import { SlidersHorizontal } from 'lucide-react';

export function FilterButton({ onClick, activeFiltersCount }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 rounded-3xl border shadow-sm bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-500"
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