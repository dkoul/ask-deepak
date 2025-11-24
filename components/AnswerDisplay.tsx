import React, { useEffect, useState } from 'react';

interface AnswerDisplayProps {
  text: string;
  onReset: () => void;
}

export const AnswerDisplay: React.FC<AnswerDisplayProps> = ({ text, onReset }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let index = 0;
    const speed = 40; // typing speed ms
    
    const intervalId = setInterval(() => {
      setDisplayedText((prev) => {
        if (index >= text.length) {
          clearInterval(intervalId);
          setIsComplete(true);
          return text;
        }
        const nextChar = text.charAt(index);
        index++;
        return text.slice(0, index);
      });
    }, speed);

    return () => clearInterval(intervalId);
  }, [text]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-fade-in">
      <div className="max-w-2xl w-full flex flex-col items-center text-center space-y-6 md:space-y-8">
        
        {/* Mystic Symbol/Icon */}
        <div className="text-deepak-accent text-5xl md:text-6xl animate-pulse-slow">
            👁️
        </div>

        <div className="min-h-[100px] relative w-full flex items-center justify-center">
           <p className="text-xl md:text-4xl font-mystic text-white leading-relaxed tracking-wide drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
            {displayedText}
            <span className="animate-pulse inline-block w-1 h-6 md:h-8 ml-1 bg-deepak-accent align-middle"></span>
          </p>
        </div>

        <button
          onClick={onReset}
          className={`
            mt-8 md:mt-12 px-8 py-3 
            border border-deepak-accent text-deepak-accent 
            font-mono uppercase tracking-widest text-xs md:text-sm
            hover:bg-deepak-accent hover:text-black
            transition-all duration-500
            transform hover:scale-105 active:scale-95
            opacity-0 ${isComplete ? 'opacity-100 translate-y-0' : 'translate-y-4'}
          `}
          style={{ transitionDelay: '500ms' }}
        >
          Ask Another Question
        </button>
      </div>
    </div>
  );
};