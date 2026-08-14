import React from 'react';
import { ChatMessage } from '../types';

interface ChatMessageBubbleProps {
  message: ChatMessage;
}

export const ChatMessageBubble: React.FC<ChatMessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
      <div
        className={`max-w-[88%] px-4 py-2.5 text-sm leading-relaxed rounded-2xl ${
          isUser
            ? 'bg-violet-600 text-white font-medium'
            : 'bg-white/[0.05] border border-white/[0.06] text-zinc-300'
        }`}
      >
        {message.content.split('\n').map((line, i) => (
          <React.Fragment key={i}>
            {line}
            {i < message.content.split('\n').length - 1 && <br />}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
