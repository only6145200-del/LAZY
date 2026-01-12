
import React from 'react';
import { TravelTag } from '../types';

interface DNASelectorProps {
  selectedTags: TravelTag[];
  onToggleTag: (tag: TravelTag) => void;
}

const DNASelector: React.FC<DNASelectorProps> = ({ selectedTags, onToggleTag }) => {
  const allTags = Object.values(TravelTag);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {allTags.map((tag) => {
        const isSelected = selectedTags.includes(tag);
        return (
          <button
            key={tag}
            onClick={() => onToggleTag(tag)}
            className={`px-4 py-4 rounded-[1.5rem] text-[11px] font-black tracking-widest transition-all duration-300 border ${
              isSelected
                ? 'bg-[#A67C52] border-[#A67C52] text-white shadow-lg shadow-[#A67C52]/20 scale-[1.03]'
                : 'bg-white border-[#F0EBE4] text-[#8D8173] hover:border-[#A67C52]'
            }`}
          >
            {tag}
          </button>
        );
      })}
    </div>
  );
};

export default DNASelector;
