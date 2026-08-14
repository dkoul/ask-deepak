import React, { useState, useRef, useEffect, FormEvent } from 'react';
import { ChatMessage, ChatStatus } from '../types';
import { askAboutDeepak, ChatApiError, getSuggestedQuestions } from '../services/chatService';
import { ChatMessageBubble } from './ChatMessageBubble';
import { useRecaptcha } from '../hooks/useRecaptcha';

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    "Hi! Ask me anything about Deepak's experience, skills, achievements, or how to get in touch.",
  timestamp: Date.now(),
};

function createMessage(role: 'user' | 'assistant', content: string): ChatMessage {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    role,
    content,
    timestamp: Date.now(),
  };
}

interface ChatInterfaceProps {
  embedded?: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ embedded = false }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<ChatStatus>(ChatStatus.IDLE);
  const [captchaError, setCaptchaError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestedQuestions = getSuggestedQuestions();
  const { config, isReady, loadError, containerRef, getToken, reset, isRequired } =
    useRecaptcha();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, status]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const question = input.trim();
    if (!question || status === ChatStatus.LOADING) return;

    if (isRequired && !isReady) {
      setCaptchaError('Captcha is still loading. Please wait a moment.');
      return;
    }

    setCaptchaError(null);

    let captchaToken: string | null = null;
    if (isRequired) {
      try {
        captchaToken = await getToken();
      } catch {
        setCaptchaError('Captcha failed. Please try again.');
        return;
      }

      if (!captchaToken) {
        setCaptchaError('Please complete the captcha before sending.');
        return;
      }
    }

    const userMessage = createMessage('user', question);
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setStatus(ChatStatus.LOADING);

    const history = messages
      .filter((m) => m.id !== 'welcome')
      .map((m) => ({ role: m.role, content: m.content }));

    try {
      const answer = await askAboutDeepak(question, history, captchaToken);
      setMessages((prev) => [...prev, createMessage('assistant', answer)]);
      setStatus(ChatStatus.IDLE);
      reset();
    } catch (err) {
      reset();

      const message =
        err instanceof ChatApiError
          ? err.message
          : "Sorry, I couldn't process that. Try again or reach out via LinkedIn.";

      if (err instanceof ChatApiError && err.status === 403) {
        setCaptchaError(message);
      }

      setMessages((prev) => [...prev, createMessage('assistant', message)]);
      setStatus(ChatStatus.ERROR);
      setTimeout(() => setStatus(ChatStatus.IDLE), 2000);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
    inputRef.current?.focus();
  };

  const wrapperClass = embedded
    ? 'flex flex-col h-full min-h-[460px]'
    : 'flex flex-col h-full min-h-[420px] md:min-h-[480px] bg-bento-card border border-white/[0.06] rounded-[28px]';

  const showV2Widget = isRequired && config?.version === 'v2';

  return (
    <section className={wrapperClass}>
      <header className="px-5 py-4 flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20">
          <div className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
          <span className="text-[10px] font-semibold uppercase tracking-widest text-violet-300">
            AI Assistant
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-white font-bold text-base truncate">Ask About Deepak</h2>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 chat-scroll min-h-0">
        {messages.map((message) => (
          <ChatMessageBubble key={message.id} message={message} />
        ))}
        {status === ChatStatus.LOADING && (
          <div className="flex justify-start animate-fade-in">
            <div className="px-4 py-2.5 rounded-2xl bg-white/[0.05] text-zinc-500 text-sm">
              <span className="inline-flex gap-1">
                <span className="animate-bounce" style={{ animationDelay: '0ms' }}>·</span>
                <span className="animate-bounce" style={{ animationDelay: '150ms' }}>·</span>
                <span className="animate-bounce" style={{ animationDelay: '300ms' }}>·</span>
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {messages.length <= 1 && (
        <div className="px-4 pb-2 flex flex-wrap gap-2 shrink-0">
          {suggestedQuestions.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => handleSuggestedQuestion(q)}
              className="text-[10px] font-medium px-3 py-1.5 rounded-full bg-white/[0.05] text-zinc-400 border border-white/[0.06] hover:border-violet-500/30 hover:text-white transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      <div className="px-4 py-4 shrink-0 border-t border-white/[0.04] space-y-3">
        {showV2Widget && (
          <div
            ref={containerRef}
            className="flex justify-center overflow-hidden rounded-xl bg-white/[0.02]"
          />
        )}

        {loadError && (
          <p className="text-xs text-amber-400/90">{loadError}</p>
        )}

        {captchaError && (
          <p className="text-xs text-rose-400">{captchaError}</p>
        )}

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about experience, skills, achievements..."
            disabled={status === ChatStatus.LOADING || (isRequired && !isReady)}
            className="flex-1 bg-white/[0.04] border border-white/[0.06] rounded-2xl text-white text-sm py-2.5 px-4 focus:outline-none focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/20 placeholder-zinc-600 disabled:opacity-50 transition-all"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
          <button
            type="submit"
            disabled={
              !input.trim() ||
              status === ChatStatus.LOADING ||
              (isRequired && !isReady)
            }
            className="px-5 py-2.5 text-sm font-semibold rounded-2xl bg-violet-600 text-white hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0"
          >
            Send
          </button>
        </form>

        {isRequired && config?.version === 'v3' && (
          <p className="text-[10px] text-zinc-600 text-center">
            Protected by reCAPTCHA
          </p>
        )}
      </div>
    </section>
  );
};
