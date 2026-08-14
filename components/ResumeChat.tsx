import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { ChatMessage, ChatStatus } from '../types';
import {
  askAboutDeepak,
  ChatApiError,
  getSuggestedIntents,
  type ChatIntent,
} from '../services/chatService';
import { useRecaptcha } from '../hooks/useRecaptcha';

const WELCOME: ChatMessage = {
  id: 'welcome',
  role: 'assistant',
  content:
    "I'm Bubbly — Deepak's assistant for career questions, hiring fit, mentorship, and speaking invites.",
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

export function ResumeChat({
  className = '',
  focused = false,
  onBack,
}: {
  className?: string;
  focused?: boolean;
  onBack?: () => void;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [draft, setDraft] = useState('');
  const [status, setStatus] = useState<ChatStatus>(ChatStatus.IDLE);
  const [captchaError, setCaptchaError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const intents = getSuggestedIntents();
  const { config, isReady, loadError, containerRef, getToken, reset, isRequired } =
    useRecaptcha();

  const isEmpty = messages.length <= 1;
  const busy = status === ChatStatus.LOADING || (isRequired && !isReady);
  const canSend = draft.trim().length > 0 && status !== ChatStatus.LOADING;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, status]);

  useEffect(() => {
    if (focused) inputRef.current?.focus();
  }, [focused]);

  const sendText = async (raw: string) => {
    const question = raw.trim();
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
    if (inputRef.current) inputRef.current.style.height = 'auto';

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

  const send = async (e?: FormEvent) => {
    e?.preventDefault();
    await sendText(draft);
  };

  const sendIntent = (intent: ChatIntent) => {
    void sendText(intent.prompt);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      void send();
    }
  };

  const resizeComposer = () => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  };

  const clearChat = () => {
    setMessages([{ ...WELCOME, timestamp: Date.now() }]);
    setDraft('');
    setCaptchaError(null);
    setStatus(ChatStatus.IDLE);
    inputRef.current?.focus();
  };

  const showV2 = isRequired && config?.version === 'v2';

  return (
    <div className={`flex flex-col bg-surface ${className}`}>
      <div className="flex shrink-0 items-center justify-between gap-2 px-4 py-3">
        <div className="flex min-w-0 items-center gap-2.5">
          {focused && onBack && (
            <button
              type="button"
              onClick={onBack}
              className="mr-0.5 flex size-7 items-center justify-center rounded-full text-ink-3 transition-colors hover:bg-hover hover:text-ink lg:hidden"
              aria-label="Back to profile"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          )}
          <span className="relative flex size-2">
            <span
              className={`absolute inset-0 rounded-full ${
                status === ChatStatus.LOADING ? 'animate-ping bg-accent/40' : ''
              }`}
            />
            <span
              className={`relative size-2 rounded-full ${
                status === ChatStatus.LOADING ? 'bg-accent' : 'bg-green'
              }`}
            />
          </span>
          <div className="min-w-0">
            <p className="text-[13px] font-medium tracking-[-0.01em] text-ink">Bubbly</p>
            <p className="text-[11px] text-ink-3">
              {status === ChatStatus.LOADING ? 'Thinking' : 'Online'}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={clearChat}
          className="text-[11px] text-ink-3 transition-colors hover:text-ink"
        >
          Reset
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 pb-2">
        {messages.map((msg) =>
          msg.role === 'user' ? (
            <div key={msg.id} className="flex justify-end animate-fade-in">
              <div className="max-w-[88%] rounded-[14px] rounded-br-[6px] bg-field px-3.5 py-2 text-[13px] leading-[1.5] tracking-[-0.01em] text-ink whitespace-pre-wrap">
                {msg.content}
              </div>
            </div>
          ) : (
            <div key={msg.id} className="animate-fade-in">
              <p className="max-w-[95%] text-[13px] leading-[1.55] tracking-[-0.01em] text-ink-2 whitespace-pre-wrap">
                {msg.content}
              </p>
            </div>
          )
        )}

        {status === ChatStatus.LOADING && (
          <div className="flex items-center gap-1.5 py-1 text-ink-3 animate-fade-in">
            <span className="size-1 rounded-full bg-ink-3 animate-bounce" />
            <span
              className="size-1 rounded-full bg-ink-3 animate-bounce"
              style={{ animationDelay: '120ms' }}
            />
            <span
              className="size-1 rounded-full bg-ink-3 animate-bounce"
              style={{ animationDelay: '240ms' }}
            />
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {isEmpty && (
        <div className="shrink-0 px-3 pb-2">
          <div className="flex flex-col gap-0.5">
            {intents.map((intent) => (
              <button
                key={intent.id}
                type="button"
                disabled={busy}
                onClick={() => sendIntent(intent)}
                className="group flex items-center justify-between gap-3 rounded-[8px] px-2.5 py-2 text-left transition-colors hover:bg-hover disabled:opacity-50"
              >
                <span className="min-w-0">
                  <span className="block text-[13px] font-medium tracking-[-0.01em] text-ink">
                    {intent.label}
                  </span>
                  <span className="block text-[11.5px] text-ink-3">{intent.description}</span>
                </span>
                <span className="text-ink-3 opacity-0 transition-opacity group-hover:opacity-100">
                  →
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-auto shrink-0 space-y-1.5 p-3 pt-1">
        {showV2 && (
          <div
            ref={containerRef}
            className="flex justify-center overflow-hidden rounded-control bg-inset py-1"
          />
        )}
        {loadError && <p className="px-1 text-[11px] text-orange">{loadError}</p>}
        {captchaError && <p className="px-1 text-[11px] text-red">{captchaError}</p>}

        <form
          onSubmit={send}
          onClick={() => inputRef.current?.focus()}
          className="flex items-end gap-2 rounded-[10px] bg-field px-3 py-2 transition-[box-shadow] focus-within:shadow-[inset_0_0_0_1px_var(--line-strong)]"
        >
          <textarea
            ref={inputRef}
            value={draft}
            rows={1}
            onChange={(e) => {
              setDraft(e.target.value);
              resizeComposer();
            }}
            onKeyDown={onKeyDown}
            placeholder="Ask about Deepak…"
            disabled={busy}
            className="max-h-[120px] min-h-[24px] flex-1 resize-none bg-transparent py-1 text-[13px] leading-[1.45] text-ink outline-none placeholder:text-ink-3 disabled:opacity-50"
          />
          <button
            type="submit"
            aria-label="Send"
            disabled={!canSend || (isRequired && !isReady)}
            className="mb-0.5 flex size-7 shrink-0 items-center justify-center rounded-full transition-[background-color,color,transform,opacity] duration-150 enabled:active:scale-[0.96] disabled:opacity-35"
            style={{
              background: canSend ? 'var(--ink)' : 'transparent',
              color: canSend ? 'var(--surface)' : 'var(--ink-3)',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
}
