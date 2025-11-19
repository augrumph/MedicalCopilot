import { MessageSquare, Check } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SuggestedQuestionsPanelProps {
  questions: string[];
}

export function SuggestedQuestionsPanel({ questions }: SuggestedQuestionsPanelProps) {
  const [askedQuestions, setAskedQuestions] = useState<Set<number>>(new Set());

  const toggleAsked = (index: number) => {
    setAskedQuestions((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  if (!questions || questions.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <MessageSquare className="h-5 w-5 text-primary" />
          Perguntas Sugeridas para Esta Consulta
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <AnimatePresence mode="popLayout">
          {questions.map((question, idx) => {
            const isAsked = askedQuestions.has(idx);
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card
                  className={`transition-all duration-300 ${
                    isAsked
                      ? 'bg-muted/50 border-muted'
                      : 'hover:border-primary/50 hover:shadow-md'
                  }`}
                >
                  <CardContent className="p-4 flex items-start justify-between gap-3">
                    <p className={`text-sm flex-1 ${isAsked ? 'line-through text-muted-foreground' : ''}`}>
                      {question}
                    </p>
                    <Button
                      variant={isAsked ? 'secondary' : 'ghost'}
                      size="sm"
                      onClick={() => toggleAsked(idx)}
                      className="shrink-0"
                    >
                      {isAsked ? (
                        <>
                          <Check className="h-4 w-4 mr-1" />
                          Feita
                        </>
                      ) : (
                        'Marcar como feita'
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
