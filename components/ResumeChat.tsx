import { FormEvent, useEffect, useRef, useState } from 'react';
import { ChatMessage, ChatStatus } from '../types';
import { askAboutDeepak, ChatApiError, getSuggestedQuestions } from '../services/chatService';
import { useRecaptcha } from '../hooks/useRecaptcha';

const WELCOME: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    "Hi! I'm Deepak's resume assistant. Ask about his experience at Red Hat, skills, achievements, or how to get in touch.",
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

export function ResumeChat({ className = '' }: { className?: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [draft, setDraft] = useState('');
  const [status, setStatus] = useState<ChatStatus>(ChatStatus.IDLE);
  const [captchaError, setCaptchaError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggested = getSuggestedQuestions();
  const { config, isReady, loadError, containerRef, getToken, reset, isRequired } =
    useRecaptcha();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, status]);

  const canSend = draft.trim().length > 0 && status !== ChatStatus.LOADING;

  const send = async (e?: FormEvent) => {
    e?.preventDefault();
    const question = draft.trim();
    if (!question || status === ChatStatus.LOADING) return;

    if (isRequired && !isReady) {
      setCaptchaError('Captcha is still loading. Please wait.');
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

    setMessages((prev) => [...prev, createMessage('user', question)]);
    setDraft('');
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
      if (err instanceof ChatApiError && err.status === 403) setCaptchaError(message);
      setMessages((prev) => [...prev, createMessage('assistant', message)]);
      setStatus(ChatStatus.ERROR);
      setTimeout(() => setStatus(ChatStatus.IDLE), 2000);
    }
  };

  const showV2 = isRequired && config?.version === 'v2';

  return (
    <div
      className={`flex h-full min-h-[420px] flex-col overflow-hidden rounded-[14px] bg-surface shadow-card ${className}`}
    >
      <div className="flex shrink-0 items-center justify-between border-b border-line p-1.5">
        <div className="flex items-center gap-2 px-1">
          <span className="flex size-2 rounded-full bg-accent animate-pulse" />
          <span className="text-[13px] font-medium text-ink">Ask About Deepak</span>
        </div>
        <span className="text-[11px] text-ink-3">AI assistant</span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-y-auto px-3 pt-2.5 pb-1">
        {messages.map((msg) =>
          msg.role === 'user' ? (
            <div key={msg.id} className="flex justify-end pl-10">
              <div className="rounded-xl bg-field px-3 py-1.5 text-[13px] leading-[1.4] text-ink">
                {msg.content}
              </div>
            </div>
          ) : (
            <div key={msg.id} className="flex w-full flex-col gap-1.5 animate-fade-in">
              <div className="flex items-center gap-1 text-[12px] leading-[1.3]">
                <span className="font-medium text-ink">Resume assistant</span>
              </div>
              <p className="text-[13px] leading-normal text-ink whitespace-pre-wrap">
                {msg.content}
              </p>
            </div>
          )
        )}
        {status === ChatStatus.LOADING && (
          <div className="flex items-center gap-1 text-[12px] text-ink-3">
            <span className="animate-bounce">·</span>
            <span className="animate-bounce" style={{ animationDelay: '150ms' }}>·</span>
            <span className="animate-bounce" style={{ animationDelay: '300ms' }}>·</span>
            <span className="ml-1">Thinking</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {messages.length <= 1 && (
        <div className="flex flex-wrap gap-1.5 px-3 pb-2">
          {suggested.map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => {
                setDraft(q);
                inputRef.current?.focus();
              }}
              className="rounded-full border border-line bg-inset px-2.5 py-1 text-[11px] text-ink-2 transition-colors hover:bg-hover hover:text-ink"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      <div className="mt-auto shrink-0 p-1.5 space-y-2">
        {showV2 && (
          <div ref={containerRef} className="flex justify-center overflow-hidden rounded-control bg-inset py-1" />
        )}
        {loadError && <p className="text-[11px] text-orange px-1">{loadError}</p>}
        {captchaError && <p className="text-[11px] text-red px-1">{captchaError}</p>}

        <div
          role="presentation"
          onClick={() => inputRef.current?.focus()}
          className="flex cursor-text flex-col gap-2 rounded-control border border-line bg-field p-2.5 shadow-[0_1px_2px_rgba(0,0,0,0.035)] transition-[border-color,box-shadow] duration-150 focus-within:border-line-strong"
        >
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) send();
            }}
            placeholder="Ask about experience, skills, achievements…"
            disabled={status === ChatStatus.LOADING || (isRequired && !isReady)}
            className="min-h-4.5 bg-transparent text-[13px] leading-[1.4] text-ink outline-none placeholder:text-ink-3"
          />
          <div className="flex items-center justify-end">
            <button
              type="button"
              aria-label="Send"
              disabled={!canSend || (isRequired && !isReady)}
              onClick={() => send()}
              className="flex size-7 items-center justify-center rounded-[8px] transition-[background-color,color,transform] duration-200 enabled:active:scale-[0.96]"
              style={{
                background: canSend ? 'var(--ink)' : 'var(--line-strong)',
                color: canSend ? 'var(--surface)' : 'var(--ink-2)',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 19V5M5 12l7-7 7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
