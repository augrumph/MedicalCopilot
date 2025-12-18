import { memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { Bot, User, Sparkles, AlertCircle, Lightbulb, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import 'highlight.js/styles/github-dark.css';

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  type?: 'recommendation' | 'question' | 'diagnosis' | 'reminder' | 'analysis';
  timestamp?: Date;
  priority?: 'low' | 'medium' | 'high';
  isStreaming?: boolean;
}

interface StreamingMessageProps {
  message: Message;
  className?: string;
}

const getMessageIcon = (type?: Message['type']) => {
  switch (type) {
    case 'question':
      return <MessageSquare className="h-4 w-4" />;
    case 'diagnosis':
      return <Lightbulb className="h-4 w-4" />;
    case 'reminder':
      return <AlertCircle className="h-4 w-4" />;
    case 'recommendation':
      return <Sparkles className="h-4 w-4" />;
    case 'analysis':
      return <Bot className="h-4 w-4" />;
    default:
      return <Bot className="h-4 w-4" />;
  }
};

const getMessageStyles = (type?: Message['type']) => {
  switch (type) {
    case 'question':
      return {
        bg: 'bg-violet-50 dark:bg-violet-950/30',
        border: 'border-violet-100 dark:border-violet-900',
        text: 'text-violet-900 dark:text-violet-100',
        iconBg: 'bg-violet-100 dark:bg-violet-900',
        iconColor: 'text-violet-600 dark:text-violet-400'
      };
    case 'diagnosis':
      return {
        bg: 'bg-amber-50 dark:bg-amber-950/30',
        border: 'border-amber-100 dark:border-amber-900',
        text: 'text-amber-900 dark:text-amber-100',
        iconBg: 'bg-amber-100 dark:bg-amber-900',
        iconColor: 'text-amber-600 dark:text-amber-400'
      };
    case 'reminder':
      return {
        bg: 'bg-rose-50 dark:bg-rose-950/30',
        border: 'border-rose-100 dark:border-rose-900',
        text: 'text-rose-900 dark:text-rose-100',
        iconBg: 'bg-rose-100 dark:bg-rose-900',
        iconColor: 'text-rose-600 dark:text-rose-400'
      };
    case 'recommendation':
      return {
        bg: 'bg-emerald-50 dark:bg-emerald-950/30',
        border: 'border-emerald-100 dark:border-emerald-900',
        text: 'text-emerald-900 dark:text-emerald-100',
        iconBg: 'bg-emerald-100 dark:bg-emerald-900',
        iconColor: 'text-emerald-600 dark:text-emerald-400'
      };
    case 'analysis':
    default:
      return {
        bg: 'bg-blue-50 dark:bg-blue-950/30',
        border: 'border-blue-100 dark:border-blue-900',
        text: 'text-blue-900 dark:text-blue-100',
        iconBg: 'bg-blue-100 dark:bg-blue-900',
        iconColor: 'text-blue-600 dark:text-blue-400'
      };
  }
};

const getTypeBadge = (type?: Message['type']) => {
  const labels = {
    question: 'Pergunta Sugerida',
    diagnosis: 'Hipótese Diagnóstica',
    reminder: 'Alerta Clínico',
    recommendation: 'Recomendação',
    analysis: 'Análise em Tempo Real'
  };
  return type ? labels[type] : 'Mensagem';
};

export const StreamingMessage = memo(({ message, className }: StreamingMessageProps) => {
  const styles = getMessageStyles(message.type);
  const isAssistant = message.role === 'assistant' || message.role === 'system';

  if (!isAssistant) {
    // User message - simple style
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className={cn("flex justify-end", className)}
      >
        <div className="max-w-[85%] rounded-2xl bg-primary text-primary-foreground px-4 py-3 shadow-sm">
          <div className="flex items-center gap-2 mb-1">
            <User className="h-3 w-3" />
            <span className="text-xs font-medium opacity-80">Você</span>
          </div>
          <p className="text-sm leading-relaxed">{message.content}</p>
          {message.timestamp && (
            <span className="text-[10px] opacity-60 mt-1 block">
              {message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>
      </motion.div>
    );
  }

  // Assistant message - rich style with markdown
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className={cn("flex justify-start", className)}
    >
      <div className={cn(
        "max-w-[90%] group relative rounded-2xl border p-4 shadow-sm transition-all",
        styles.bg,
        styles.border,
        className
      )}>
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div className={cn(
            "h-9 w-9 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ring-2 ring-white dark:ring-gray-800",
            styles.iconBg,
            styles.iconColor
          )}>
            {getMessageIcon(message.type)}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <span className={cn("text-xs font-bold uppercase tracking-wider", styles.text)}>
                {getTypeBadge(message.type)}
              </span>
              {message.timestamp && (
                <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">
                  {message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </div>

            {/* Message Content with Markdown */}
            <div className="prose prose-sm max-w-none dark:prose-invert prose-headings:mt-3 prose-headings:mb-2 prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeHighlight, rehypeRaw]}
                components={{
                  // Custom code block styling
                  code({ node, className, children, ...props }: any) {
                    const inline = !className?.includes('language-');
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline ? (
                      <div className="relative group/code">
                        <pre className={cn(
                          "overflow-x-auto rounded-lg p-3 text-xs",
                          "bg-gray-900 dark:bg-gray-950 text-gray-100",
                          className
                        )}>
                          <code className={className} {...props}>
                            {children}
                          </code>
                        </pre>
                        {match && (
                          <span className="absolute top-2 right-2 text-[10px] text-gray-400 uppercase font-mono">
                            {match[1]}
                          </span>
                        )}
                      </div>
                    ) : (
                      <code className="bg-gray-200 dark:bg-gray-800 px-1.5 py-0.5 rounded text-xs font-mono" {...props}>
                        {children}
                      </code>
                    );
                  },
                  // Custom link styling
                  a({ children, href, ...props }) {
                    return (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline font-medium"
                        {...props}
                      >
                        {children}
                      </a>
                    );
                  },
                  // Blockquote styling
                  blockquote({ children, ...props }) {
                    return (
                      <blockquote
                        className="border-l-4 border-primary/30 pl-3 italic text-gray-700 dark:text-gray-300"
                        {...props}
                      >
                        {children}
                      </blockquote>
                    );
                  }
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>

            {/* Streaming indicator */}
            {message.isStreaming && (
              <div className="flex items-center gap-1.5 mt-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            )}
          </div>
        </div>

        {/* Priority indicator */}
        {message.priority === 'high' && (
          <div className="absolute -top-2 -right-2">
            <span className="inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white dark:border-gray-800 animate-pulse"></span>
          </div>
        )}
      </div>
    </motion.div>
  );
});

StreamingMessage.displayName = 'StreamingMessage';
