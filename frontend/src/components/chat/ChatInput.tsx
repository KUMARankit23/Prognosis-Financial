import React, { useState, useRef, KeyboardEvent } from 'react';
import { Send, Mic } from 'lucide-react';
import { sanitizeInput } from '../../utils/helpers';

interface Props {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const ChatInput: React.FC<Props> = ({ onSend, disabled, placeholder = 'Ask about SIPs, Mutual Funds, Insurance...' }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const clean = sanitizeInput(input);
    if (!clean || disabled) return;
    onSend(clean);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Auto-resize textarea
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = 'auto';
      ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
    }
  };

  const canSend = input.trim().length > 0 && !disabled;

  return (
    <div className="flex items-end gap-2 p-3 bg-white border-t border-gray-100">
      <div className="flex-1 bg-gray-50 rounded-2xl border border-gray-200 focus-within:border-navy-400 focus-within:ring-2 focus-within:ring-navy-100 transition-all duration-200 px-4 py-2.5">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          maxLength={2000}
          className="w-full bg-transparent resize-none text-sm text-gray-800 placeholder-gray-400 outline-none leading-relaxed disabled:opacity-50"
          style={{ maxHeight: '120px' }}
          aria-label="Chat message input"
        />
      </div>

      <button
        onClick={handleSend}
        disabled={!canSend}
        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 shadow-sm ${
          canSend
            ? 'bg-navy-500 hover:bg-navy-700 text-white hover:shadow-md active:scale-95'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        }`}
        aria-label="Send message"
      >
        <Send className="w-4 h-4" />
      </button>
    </div>
  );
};

export default ChatInput;
