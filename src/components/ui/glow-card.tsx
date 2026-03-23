import { useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  glowSize?: number;
}

export function GlowCard({
  children,
  className,
  glowColor = 'rgba(104,43,215,0.15)',
  glowSize = 300,
}: GlowCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: -9999, y: -9999 });
  const [hovered, setHovered] = useState(false);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn('relative overflow-hidden transition-all duration-300', className)}
    >
      {/* Glow layer */}
      <div
        className="pointer-events-none absolute transition-opacity duration-300"
        style={{
          left: pos.x - glowSize / 2,
          top: pos.y - glowSize / 2,
          width: glowSize,
          height: glowSize,
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
          borderRadius: '50%',
          opacity: hovered ? 1 : 0,
        }}
      />
      {children}
    </div>
  );
}
