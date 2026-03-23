import { cn } from '@/lib/utils';

interface BgGridProps {
  className?: string;
  dotColor?: string;
  dotSize?: number;
  gap?: number;
  opacity?: number;
  variant?: 'dots' | 'lines';
}

export function BgGrid({
  className,
  dotColor = '#918983',
  dotSize = 1,
  gap = 22,
  opacity = 0.1,
  variant = 'dots',
}: BgGridProps) {
  const backgroundImage =
    variant === 'dots'
      ? `radial-gradient(${dotColor} ${dotSize}px, transparent ${dotSize}px)`
      : `linear-gradient(${dotColor} 1px, transparent 1px), linear-gradient(90deg, ${dotColor} 1px, transparent 1px)`;

  return (
    <div
      className={cn('pointer-events-none absolute inset-0', className)}
      style={{
        backgroundImage,
        backgroundSize: `${gap}px ${gap}px`,
        opacity,
      }}
    />
  );
}
