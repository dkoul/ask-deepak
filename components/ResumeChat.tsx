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
    <div className={`chat-shell ${className}`}>
      <div className="chat-head">
        <div>
          {onBack && (
            <button className="back-link" type="button" onClick={onBack}>
              ← Overview
            </button>
          )}
          <div className="chat-kicker">{status === ChatStatus.LOADING ? 'Thinking' : 'Live · Bubbly'}</div>
          <h1 className="chat-title">Ask Bubbly.</h1>
        </div>
        <button type="button" className="chat-reset" onClick={clearChat}>
          Reset
        </button>
      </div>

      <div className="chat-log">
        {messages.map((msg) =>
          msg.role === 'user' ? (
            <div key={msg.id} className="chat-msg-user">
              {msg.content}
            </div>
          ) : (
            <p key={msg.id} className="chat-msg-bot">
              {msg.content}
            </p>
          )
        )}
        {status === ChatStatus.LOADING && <div className="typing-row">Thinking…</div>}
        <div ref={messagesEndRef} />
      </div>

      {isEmpty && (
        <div className="chat-intents">
          {intents.map((intent) => (
            <button
              key={intent.id}
              type="button"
              disabled={busy}
              onClick={() => sendIntent(intent)}
              className="chat-intent"
            >
              <span>
                <span className="chat-intent-label">{intent.label}</span>
                <span className="chat-intent-desc">{intent.description}</span>
              </span>
              <span>→</span>
            </button>
          ))}
        </div>
      )}

      <div style={{ marginTop: 16 }}>
        {showV2 && <div ref={containerRef} className="chat-captcha" />}
        {loadError && <p className="chat-error">{loadError}</p>}
        {captchaError && <p className="chat-error">{captchaError}</p>}
        <form className="chat-composer" onSubmit={send} onClick={() => inputRef.current?.focus()}>
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
          />
          <button type="submit" className="chat-send" disabled={!canSend || (isRequired && !isReady)}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
