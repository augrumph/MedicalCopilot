import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
    label?: string;
  };
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
  className?: string;
}

const variantStyles = {
  default: {
    card: 'border-gray-200 bg-white hover:border-gray-300',
    icon: 'bg-gray-100 text-gray-600',
    iconRing: 'ring-gray-200',
  },
  primary: {
    card: 'border-primary/20 bg-gradient-to-br from-primary/5 to-purple-500/5 hover:border-primary/30',
    icon: 'bg-gradient-to-br from-primary to-purple-600 text-white',
    iconRing: 'ring-primary/20',
  },
  success: {
    card: 'border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 hover:border-emerald-300',
    icon: 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white',
    iconRing: 'ring-emerald-200',
  },
  warning: {
    card: 'border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 hover:border-amber-300',
    icon: 'bg-gradient-to-br from-amber-500 to-orange-600 text-white',
    iconRing: 'ring-amber-200',
  },
  danger: {
    card: 'border-rose-200 bg-gradient-to-br from-rose-50 to-pink-50 hover:border-rose-300',
    icon: 'bg-gradient-to-br from-rose-500 to-pink-600 text-white',
    iconRing: 'ring-rose-200',
  },
};

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  variant = 'default',
  className,
}: StatCardProps) {
  const styles = variantStyles[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Card
        className={cn(
          'relative overflow-hidden border-2 transition-all duration-300 shadow-lg hover:shadow-xl',
          styles.card,
          className
        )}
      >
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            {/* Content */}
            <div className="flex-1 space-y-2">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {title}
              </p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                  {value}
                </h3>
                {trend && (
                  <span
                    className={cn(
                      'text-xs font-semibold flex items-center gap-1 px-2 py-1 rounded-full',
                      trend.isPositive
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                    )}
                  >
                    <span>{trend.isPositive ? '↑' : '↓'}</span>
                    {trend.value}%
                  </span>
                )}
              </div>
              {description && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {description}
                </p>
              )}
              {trend?.label && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {trend.label}
                </p>
              )}
            </div>

            {/* Icon */}
            <div className="relative">
              <div
                className={cn(
                  'h-14 w-14 rounded-2xl flex items-center justify-center shadow-lg ring-4',
                  styles.icon,
                  styles.iconRing
                )}
              >
                <Icon className="h-7 w-7" strokeWidth={2.5} />
              </div>

              {/* Glow effect for primary variant */}
              {variant === 'primary' && (
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-primary/20 blur-xl"
                  animate={{
                    opacity: [0.3, 0.6, 0.3],
                    scale: [0.9, 1.1, 0.9],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              )}
            </div>
          </div>
        </CardContent>

        {/* Bottom accent line */}
        <div
          className={cn(
            'absolute bottom-0 left-0 right-0 h-1',
            variant === 'primary' && 'bg-gradient-to-r from-primary to-purple-600',
            variant === 'success' && 'bg-gradient-to-r from-emerald-500 to-teal-600',
            variant === 'warning' && 'bg-gradient-to-r from-amber-500 to-orange-600',
            variant === 'danger' && 'bg-gradient-to-r from-rose-500 to-pink-600',
            variant === 'default' && 'bg-gradient-to-r from-gray-300 to-gray-400'
          )}
        />
      </Card>
    </motion.div>
  );
}
