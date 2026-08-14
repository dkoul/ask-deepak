import React from 'react';

type BentoVariant = 'default' | 'muted' | 'accent' | 'gradient' | 'chat';

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: BentoVariant;
  label?: string;
  noPadding?: boolean;
}

const variantStyles: Record<BentoVariant, string> = {
  default:
    'bg-bento-card border border-white/[0.06] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)]',
  muted: 'bg-bento-muted border border-white/[0.04]',
  accent:
    'bg-gradient-to-br from-violet-600/20 via-bento-card to-indigo-600/10 border border-violet-500/20',
  gradient:
    'bg-gradient-to-br from-orange-500/15 via-bento-card to-rose-500/10 border border-orange-400/15',
  chat: 'bg-bento-card border border-white/[0.08] shadow-[0_0_60px_-12px_rgba(139,92,246,0.15)]',
};

export const BentoCard: React.FC<BentoCardProps> = ({
  children,
  className = '',
  variant = 'default',
  label,
  noPadding = false,
}) => {
  return (
    <div
      className={`
        relative rounded-[28px] overflow-hidden
        transition-all duration-300 ease-out
        hover:border-white/[0.12]
        ${variantStyles[variant]}
        ${noPadding ? '' : 'p-5 md:p-6'}
        ${className}
      `}
    >
      {label && (
        <span className="absolute top-5 left-5 md:top-6 md:left-6 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
          {label}
        </span>
      )}
      {children}
    </div>
  );
};
