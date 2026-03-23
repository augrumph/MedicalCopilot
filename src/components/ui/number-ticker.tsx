import { useEffect, useRef } from 'react';
import { useInView, animate } from 'framer-motion';
import { cn } from '@/lib/utils';

interface NumberTickerProps {
  value: number;
  className?: string;
  decimalPlaces?: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}

export function NumberTicker({
  value,
  className,
  decimalPlaces = 0,
  duration = 1.4,
  suffix = '',
  prefix = '',
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-20px' });

  useEffect(() => {
    if (!inView || !ref.current) return;
    const controls = animate(0, value, {
      duration,
      ease: [0.25, 0.1, 0.25, 1],
      onUpdate: (v) => {
        if (ref.current) {
          ref.current.textContent = `${prefix}${v.toFixed(decimalPlaces)}${suffix}`;
        }
      },
    });
    return controls.stop;
  }, [inView, value, decimalPlaces, duration, suffix, prefix]);

  return (
    <span ref={ref} className={cn('tabular-nums', className)}>
      {prefix}0{suffix}
    </span>
  );
}
