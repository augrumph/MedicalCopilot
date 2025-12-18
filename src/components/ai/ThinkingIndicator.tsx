import { motion } from 'framer-motion';
import { Brain, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ThinkingIndicatorProps {
  message?: string;
  variant?: 'default' | 'minimal' | 'detailed';
  className?: string;
}

export function ThinkingIndicator({
  message = 'Processando contexto clínico...',
  variant = 'default',
  className
}: ThinkingIndicatorProps) {

  if (variant === 'minimal') {
    return (
      <div className={cn("flex items-center gap-2 text-sm text-muted-foreground", className)}>
        <div className="flex gap-1">
          <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={cn(
          "flex items-start gap-4 p-5 bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-2xl border border-primary/10 shadow-sm w-fit max-w-md",
          className
        )}
      >
        {/* Animated Icon */}
        <div className="relative">
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{
              rotate: { duration: 3, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
            className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg"
          >
            <Brain className="h-5 w-5 text-white" />
          </motion.div>
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full bg-primary/20 blur-md"
          />
        </div>

        <div className="flex-1 space-y-2">
          {/* Message */}
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {message}
          </p>

          {/* Progress bars */}
          <div className="space-y-1.5">
            <motion.div
              className="h-1 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-purple-600"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
            <motion.div
              className="h-1 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-purple-600 to-primary"
                initial={{ width: "0%" }}
                animate={{ width: "70%" }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          </div>

          {/* Sub-message */}
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Sparkles className="h-3 w-3" />
            Analisando sintomas e histórico médico
          </p>
        </div>
      </motion.div>
    );
  }

  // Default variant
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={cn(
        "flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 p-4 bg-white/50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm w-fit",
        className
      )}
    >
      <div className="flex gap-1.5">
        <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
      <span className="font-medium">{message}</span>
    </motion.div>
  );
}
