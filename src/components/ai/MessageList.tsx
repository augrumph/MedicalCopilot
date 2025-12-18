import { useRef, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ScrollArea } from '@/components/ui/scroll-area';
import { StreamingMessage, type Message } from './StreamingMessage';
import { ThinkingIndicator } from './ThinkingIndicator';
import { Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MessageListProps {
  messages: Message[];
  isThinking?: boolean;
  thinkingMessage?: string;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  className?: string;
  autoScroll?: boolean;
}

export function MessageList({
  messages,
  isThinking = false,
  thinkingMessage = 'Processando...',
  emptyStateTitle = 'Pronto para ajudar',
  emptyStateDescription = 'Inicie a gravação para ativar o assistente de inteligência artificial.',
  className,
  autoScroll = true
}: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages.length, isThinking, autoScroll]);

  return (
    <div className={cn("flex-1 overflow-hidden relative", className)}>
      <ScrollArea className="h-full px-4 py-6">
        <div ref={containerRef} className="max-w-4xl mx-auto space-y-4">
          {/* Empty State */}
          {messages.length === 0 && !isThinking && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="relative mb-6">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-purple-600 rounded-full blur-3xl opacity-10 animate-pulse"></div>

                {/* Icon container */}
                <div className="relative h-24 w-24 rounded-2xl bg-white dark:bg-gray-900 shadow-xl flex items-center justify-center ring-1 ring-gray-100 dark:ring-gray-800">
                  <Bot className="h-12 w-12 text-primary/80" />
                </div>
              </div>

              <h4 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                {emptyStateTitle}
              </h4>

              <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto leading-relaxed">
                {emptyStateDescription}
              </p>
            </div>
          )}

          {/* Messages */}
          <AnimatePresence mode="popLayout">
            {messages.map((message) => (
              <StreamingMessage
                key={message.id}
                message={message}
              />
            ))}
          </AnimatePresence>

          {/* Thinking Indicator */}
          {isThinking && (
            <ThinkingIndicator
              message={thinkingMessage}
              variant="default"
            />
          )}

          {/* Scroll anchor */}
          <div ref={scrollRef} className="h-4" />
        </div>
      </ScrollArea>
    </div>
  );
}
