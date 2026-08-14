import React, { useState, useRef, useEffect, FormEvent } from 'react';
import { ChatMessage, ChatStatus } from '../types';
import { askAboutDeepak, getSuggestedQuestions } from '../services/chatService';
import { ChatMessageBubble } from './ChatMessageBubble';

const WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    "Hi! I'm Deepak's resume assistant. Ask me anything about his experience, skills, community work, or how to get in touch.",
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

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<ChatStatus>(ChatStatus.IDLE);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestedQuestions = getSuggestedQuestions();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, status]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const question = input.trim();
    if (!question || status === ChatStatus.LOADING) return;

    const userMessage = createMessage('user', question);
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setStatus(ChatStatus.LOADING);

    const history = messages
      .filter((m) => m.id !== 'welcome')
      .map((m) => ({ role: m.role, content: m.content }));

    try {
      const answer = await askAboutDeepak(question, history);
      setMessages((prev) => [...prev, createMessage('assistant', answer)]);
      setStatus(ChatStatus.IDLE);
    } catch {
      setMessages((prev) => [
        ...prev,
        createMessage(
          'assistant',
          "Sorry, I couldn't process that request. Please try again or reach out to Deepak directly via LinkedIn."
        ),
      ]);
      setStatus(ChatStatus.ERROR);
      setTimeout(() => setStatus(ChatStatus.IDLE), 2000);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
    inputRef.current?.focus();
  };

  return (
    <section className="flex flex-col h-full min-h-[420px] md:min-h-[480px] bg-surface-elevated border border-slate-800">
      <header className="px-5 py-4 border-b border-slate-800 flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
        <div>
          <h2 className="text-white font-display text-lg">Ask About Deepak</h2>
          <p className="text-slate-500 text-xs font-mono">AI-powered resume assistant</p>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 chat-scroll">
        {messages.map((message) => (
          <ChatMessageBubble key={message.id} message={message} />
        ))}
        {status === ChatStatus.LOADING && (
          <div className="flex justify-start animate-fade-in">
            <div className="px-4 py-3 bg-surface-elevated border border-slate-800 text-slate-400 text-sm font-mono">
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
        <div className="px-4 pb-3 flex flex-wrap gap-2">
          {suggestedQuestions.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => handleSuggestedQuestion(q)}
              className="text-xs font-mono px-3 py-1.5 border border-slate-700 text-slate-400 hover:border-accent hover:text-accent transition-colors duration-300"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="px-4 py-4 border-t border-slate-800 flex gap-3">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about skills, experience, or contact info..."
          disabled={status === ChatStatus.LOADING}
          className="flex-1 bg-transparent border-b-2 border-slate-700 text-white font-mono text-sm py-2 px-1 focus:outline-none focus:border-accent transition-colors duration-300 placeholder-slate-600 disabled:opacity-50"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
        />
        <button
          type="submit"
          disabled={!input.trim() || status === ChatStatus.LOADING}
          className="px-5 py-2 text-sm font-mono uppercase tracking-wider bg-accent text-surface font-semibold hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300"
        >
          Send
        </button>
      </form>
    </section>
  );
};
