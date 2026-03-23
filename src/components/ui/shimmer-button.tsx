/**
 * ShimmerButton — botão com efeito shimmer (inspirado MagicUI)
 */

import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ShimmerButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  shimmerColor?: string;
  background?: string;
  className?: string;
}

export function ShimmerButton({
  children,
  shimmerColor = 'rgba(255,255,255,0.25)',
  background = '#512B81',
  className = '',
  disabled,
  ...props
}: ShimmerButtonProps) {
  return (
    <button
      className={cn(
        'relative overflow-hidden rounded-2xl font-black text-white transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none',
        className,
      )}
      style={{ background }}
      disabled={disabled}
      {...props}
    >
      {/* shimmer sweep */}
      {!disabled && (
        <span
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(105deg, transparent 40%, ${shimmerColor} 50%, transparent 60%)`,
            backgroundSize: '200% 100%',
            animation: 'shimmer-sweep 2.5s linear infinite',
          }}
        />
      )}
      <style>{`
        @keyframes shimmer-sweep {
          0%   { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
      `}</style>
      <span className="relative z-10 flex items-center justify-center">{children}</span>
    </button>
  );
}
