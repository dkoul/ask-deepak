import React, { useRef, useState } from 'react';

interface MysticInputProps {
  value: string;
  onChange: (displayValue: string, secretValue: string, isRecording: boolean) => void;
  secretValue: string;
  isRecording: boolean;
  placeholder?: string;
  label: string;
  className?: string;
  autoFocus?: boolean;
}

const PETITION_PHRASE = "Trim Cri Klim Hrun Phat Swaha";
// Trigger keys to toggle recording mode. 
const TRIGGER_KEYS = ['.', ';', '-']; 

export const MysticInput: React.FC<MysticInputProps> = ({
  value,
  onChange,
  secretValue,
  isRecording,
  placeholder,
  label,
  className,
  autoFocus
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle the magic toggle keys
    // NOTE: On some mobile keyboards, this event may not fire for special chars
    if (TRIGGER_KEYS.includes(e.key)) {
      e.preventDefault();
      onChange(value, secretValue, !isRecording);
      return;
    }

    if (e.key === 'Backspace') {
      if (secretValue.length > 0) {
        const newSecret = secretValue.slice(0, -1);
        onChange(value.slice(0, -1), newSecret, isRecording);
        e.preventDefault(); 
      }
      return;
    }

    if (isRecording && e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      
      const newSecretChar = e.key;
      const nextDisplayChar = PETITION_PHRASE[value.length % PETITION_PHRASE.length] || " ";

      onChange(value + nextDisplayChar, secretValue + newSecretChar, isRecording);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    // Mobile Fallback: 
    // If handleKeyDown failed to catch the trigger key (common on Android),
    // we check if the last typed character was a trigger key.
    const lastChar = inputValue.slice(-1);
    const wasTriggerKey = TRIGGER_KEYS.includes(lastChar) && inputValue.length > value.length;

    if (wasTriggerKey) {
      // Remove the trigger key from the display and toggle recording
      const cleanDisplay = inputValue.slice(0, -1);
      onChange(cleanDisplay, secretValue, !isRecording);
      return;
    }

    // Mobile Fallback for Recording:
    // If we are recording and handleKeyDown didn't preventDefault (mobile),
    // the input now contains the "secret" char the user typed at the end.
    if (isRecording) {
      // Detect added character
      if (inputValue.length > value.length) {
        // The new char typed by user
        const newSecretChar = inputValue.slice(value.length);
        
        // The char we WANT to show (next letter of Petition)
        const nextDisplayChar = PETITION_PHRASE[value.length % PETITION_PHRASE.length] || " ";
        
        // Immediately replace what they typed with the petition char
        onChange(value + nextDisplayChar, secretValue + newSecretChar, isRecording);
      } 
      // Detect backspace on mobile
      else if (inputValue.length < value.length) {
        const charsDeleted = value.length - inputValue.length;
        const newSecret = secretValue.slice(0, -charsDeleted);
        onChange(inputValue, newSecret, isRecording);
      }
    } else {
      // Normal behavior when not recording
      onChange(inputValue, secretValue, isRecording);
    }
  };

  return (
    <div className={`relative flex flex-col gap-2 ${className}`}>
      <label className="text-deepak-accent text-xs font-mono uppercase tracking-widest opacity-80">
        {label}
      </label>
      <div className="relative group">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          autoFocus={autoFocus}
          className={`
            w-full bg-transparent border-b-2 border-gray-800 
            text-white font-mono text-lg py-2 px-1
            focus:outline-none focus:border-deepak-accent
            transition-all duration-300
            placeholder-gray-700
          `}
          placeholder={placeholder}
          // Critical attributes for mobile prank functionality
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="none"
          spellCheck="false"
        />
        {/* Animated Glow Line */}
        <div 
          className={`
            absolute bottom-0 left-0 h-[2px] bg-deepak-accent shadow-[0_0_10px_#00ff9d]
            transition-all duration-500 ease-out
            ${isFocused ? 'w-full opacity-100' : 'w-0 opacity-0'}
          `}
        />
        {/* Mystic Status Dot */}
        <div 
            className={`
                absolute right-2 top-3 w-1.5 h-1.5 rounded-full 
                transition-all duration-300
                ${isRecording ? 'bg-deepak-accent shadow-[0_0_5px_#00ff9d] opacity-40' : 'bg-transparent opacity-0'} 
            `}
        />
      </div>
    </div>
  );
};