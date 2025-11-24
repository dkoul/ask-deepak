import React, { useState, FormEvent } from 'react';
import { MysticInput } from './components/MysticInput';
import { AnswerDisplay } from './components/AnswerDisplay';
import { getDeepakRefusal } from './services/geminiService';
import { PrankState, GameState } from './types';

const INITIAL_STATE: PrankState = {
  petition: '',
  question: '',
  secretAnswer: '',
  isRecordingSecret: false,
};

const App: React.FC = () => {
  const [state, setState] = useState<PrankState>(INITIAL_STATE);
  const [gameState, setGameState] = useState<GameState>(GameState.IDLE);
  const [answerText, setAnswerText] = useState<string>('');

  const handlePetitionChange = (display: string, secret: string, recording: boolean) => {
    setState(prev => ({
      ...prev,
      petition: display,
      secretAnswer: secret,
      isRecordingSecret: recording
    }));
  };

  const handleQuestionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState(prev => ({ ...prev, question: e.target.value }));
  };

  const handleQuestionKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Quick Answer Shortcuts (The "Lazy" Trick)
    // These keys inject a secret answer without typing it in the petition.
    
    // '[' = YES
    if (e.key === '[') {
      e.preventDefault();
      setState(prev => ({ ...prev, secretAnswer: "The answer is YES." }));
    }
    // ']' = NO
    if (e.key === ']') {
      e.preventDefault();
      setState(prev => ({ ...prev, secretAnswer: "The answer is NO." }));
    }
    // '\' = MAYBE
    if (e.key === '\\') {
      e.preventDefault();
      setState(prev => ({ ...prev, secretAnswer: "It is uncertain." }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Dismiss virtual keyboard on mobile
    (document.activeElement as HTMLElement)?.blur();
    
    if (!state.question.trim()) return;

    setGameState(GameState.ANSWERING);

    // Prank Logic:
    // If we have a secret answer captured, use it.
    // Otherwise, fetch a refusal/fallback.
    
    if (state.secretAnswer.trim().length > 0) {
      // Add a slight artificial delay for realism
      setTimeout(() => {
        setAnswerText(state.secretAnswer);
      }, 1500);
    } else {
      const refusal = await getDeepakRefusal(state.question);
      setAnswerText(refusal);
    }
  };

  const resetGame = () => {
    setState(INITIAL_STATE);
    setGameState(GameState.IDLE);
    setAnswerText('');
  };

  return (
    <div className="min-h-[100dvh] bg-deepak-black text-white selection:bg-deepak-accent selection:text-black overflow-x-hidden relative flex flex-col">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_50%_50%,_rgba(0,255,157,0.1),_transparent_70%)]" />
      <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-deepak-accent to-transparent opacity-50" />

      <main className="relative z-10 w-full max-w-lg mx-auto px-6 py-8 flex-grow flex flex-col items-center justify-center">
        
        {/* Mystic Avatar */}
        <div className="mb-6 relative group animate-fade-in">
          <div className="absolute inset-0 bg-deepak-accent rounded-full blur-[20px] opacity-20 group-hover:opacity-40 transition-opacity duration-700"></div>
          <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full p-[2px] bg-gradient-to-b from-deepak-accent to-transparent">
             <div className="w-full h-full rounded-full overflow-hidden bg-black">
                <img 
                  src="deepak.jpg" 
                  alt="Deepak the Mystic" 
                  className="w-full h-full object-cover object-top hover:scale-110 transition-transform duration-700 ease-in-out opacity-90 hover:opacity-100"
                  onError={(e) => {
                    // Fallback if user hasn't uploaded deepak.jpg yet
                    e.currentTarget.src = "https://ui-avatars.com/api/?name=D&background=050505&color=00ff9d&size=256&font-size=0.5";
                  }}
                />
             </div>
          </div>
        </div>

        {/* Header */}
        <header className="mb-8 md:mb-12 text-center space-y-2 md:space-y-4">
          <h1 className="text-4xl md:text-7xl font-mystic text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-600 drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            DEEPAK
          </h1>
          <p className="text-gray-500 font-mono text-xs md:text-sm tracking-[0.3em] md:tracking-[0.5em] uppercase">
            Knows All • Sees All
          </p>
        </header>

        {/* Main Form */}
        <div className="w-full space-y-8 md:space-y-12 pb-10">
          
          <form onSubmit={handleSubmit} className="space-y-8 md:space-y-10">
            
            <MysticInput
              label="Mantra"
              value={state.petition}
              secretValue={state.secretAnswer}
              isRecording={state.isRecordingSecret}
              onChange={handlePetitionChange}
              placeholder="Trim Cri Klim Hrun Phat Swaha"
              autoFocus
            />

            <div className="relative flex flex-col gap-2">
              <label className="text-deepak-accent text-xs font-mono uppercase tracking-widest opacity-80">
                The Question
              </label>
              <input
                type="text"
                value={state.question}
                onChange={handleQuestionChange}
                onKeyDown={handleQuestionKeyDown}
                className="
                  w-full bg-transparent border-b-2 border-gray-800 
                  text-white font-mono text-lg py-2 px-1
                  focus:outline-none focus:border-deepak-accent
                  transition-all duration-300
                  placeholder-gray-700
                "
                placeholder="What is the meaning of life?"
                disabled={gameState === GameState.ANSWERING}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck="false"
              />
            </div>

            <div className="pt-4 md:pt-8 flex justify-center">
              <button
                type="submit"
                disabled={!state.petition || !state.question || gameState === GameState.ANSWERING}
                className={`
                  group relative px-10 py-4 bg-transparent overflow-hidden w-full md:w-auto
                  transition-all duration-300
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                {/* Button Borders */}
                <span className="absolute inset-0 w-full h-full border border-gray-700 group-hover:border-deepak-accent transition-colors duration-300"></span>
                <span className="absolute top-0 left-0 w-1 h-full bg-deepak-accent transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                <span className="absolute top-0 right-0 w-1 h-full bg-deepak-accent transform translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
                
                {/* Button Text */}
                <span className="relative font-mystic text-lg md:text-xl tracking-widest uppercase group-hover:text-deepak-accent transition-colors duration-300">
                  {gameState === GameState.ANSWERING ? 'Consulting...' : 'Ask Deepak'}
                </span>
              </button>
            </div>

          </form>

          {/* Instructions / Flavor Text */}
          <div className="text-center">
            <p className="text-gray-600 text-[10px] md:text-xs font-mono max-w-xs mx-auto leading-relaxed opacity-70">
              Deepak requires a formal mantra. Enter the mantra exactly as requested, or the spirits may be displeased.
            </p>
          </div>

        </div>

      </main>

      {/* Answer Modal Overlay */}
      {gameState === GameState.ANSWERING && answerText && (
        <AnswerDisplay 
          text={answerText} 
          onReset={resetGame} 
        />
      )}
      
      {gameState === GameState.ANSWERING && !answerText && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
           <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 border-4 border-deepak-accent border-t-transparent rounded-full animate-spin"></div>
              <p className="text-deepak-accent font-mono animate-pulse text-sm">Contacting the Ether...</p>
           </div>
        </div>
      )}

    </div>
  );
};

export default App;