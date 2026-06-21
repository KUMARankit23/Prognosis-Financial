import React from 'react';

interface Props {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
  disabled?: boolean;
}

const QuickReplies: React.FC<Props> = ({ suggestions, onSelect, disabled }) => {
  if (!suggestions.length) return null;

  return (
    <div className="px-4 pb-2 flex flex-wrap gap-2">
      {suggestions.map((s) => (
        <button
          key={s}
          onClick={() => onSelect(s)}
          disabled={disabled}
          className="text-xs px-3 py-1.5 rounded-full border border-navy-300 text-navy-600 hover:bg-navy-50 hover:border-navy-500 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {s}
        </button>
      ))}
    </div>
  );
};

export default QuickReplies;
