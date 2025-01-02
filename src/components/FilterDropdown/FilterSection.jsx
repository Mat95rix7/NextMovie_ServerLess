import React from 'react';
import { ChevronDown } from 'lucide-react';

export function FilterSection({ title, children, isExpandable = false, isExpanded = false, onToggle }) {
  return (
    <div className="space-y-3">
      <button 
        className={`w-full flex items-center justify-between font-semibold text-gray-700 ${isExpandable ? 'cursor-pointer' : ''}`}
        onClick={isExpandable ? onToggle : undefined}
      >
        <span>{title}</span>
        {isExpandable && (
          <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'transform rotate-180' : ''}`} />
        )}
      </button>
      <div className={`${isExpandable && !isExpanded ? 'hidden' : ''}`}>
        {children}
      </div>
    </div>
  );
}