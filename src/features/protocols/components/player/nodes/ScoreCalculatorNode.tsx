import { Calculator, ChevronRight } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ProtocolNode, ProtocolEdge } from '../../../types';
import { motion } from 'framer-motion';
import { listContainer, listItem } from '@/lib/animations/protocol-animations';
import { useState, useMemo } from 'react';
import { toast } from 'sonner';

interface ScoreCalculatorNodeProps {
  node: ProtocolNode;
  edges: ProtocolEdge[];
  onSelectEdge: (edge: ProtocolEdge) => void;
}

export function ScoreCalculatorNode({ node, edges, onSelectEdge }: ScoreCalculatorNodeProps) {
  const content = node.content || {};
  const questions = content.questions || [];
  const [answers, setAnswers] = useState<Record<string, boolean>>({});

  const totalScore = useMemo(() => {
    return questions.reduce((sum: number, q: any, idx: number) => {
      return sum + (answers[q.id ?? String(idx)] ? (q.points || 0) : 0);
    }, 0);
  }, [answers, questions]);

  const handleToggle = (questionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: !prev[questionId],
    }));
  };

  const handleSubmit = () => {
    const matchingEdge = edges.find((edge) => {
      if (!edge.condition) return false;
      const { minScore, maxScore } = edge.condition;

      if (minScore !== undefined && maxScore !== undefined) {
        return totalScore >= minScore && totalScore <= maxScore;
      } else if (minScore !== undefined) {
        return totalScore >= minScore;
      } else if (maxScore !== undefined) {
        return totalScore <= maxScore;
      }
      return false;
    });

    if (matchingEdge) {
      onSelectEdge(matchingEdge);
    } else {
      // No edge matches this score — protocol misconfiguration, do not silently use edges[0]
      console.error('[ScoreCalc] No edge matches score:', totalScore, '| edges:', edges);
      toast.error(`Escore ${totalScore} não corresponde a nenhuma faixa configurada no protocolo.`);
    }
  };

  const getScoreInterpretation = () => {
    if (!content.interpretations) return null;

    const interpretation = content.interpretations.find((interp: any) => {
      if (interp.minScore !== undefined && interp.maxScore !== undefined) {
        return totalScore >= interp.minScore && totalScore <= interp.maxScore;
      } else if (interp.minScore !== undefined) {
        return totalScore >= interp.minScore;
      } else if (interp.maxScore !== undefined) {
        return totalScore <= interp.maxScore;
      }
      return false;
    });

    return interpretation;
  };

  const interpretation = getScoreInterpretation();

  return (
    <div className="max-w-3xl mx-auto w-full">
      <div className="flex flex-col items-center text-center mb-10">
        <div className="w-20 h-20 rounded-full bg-[#512B81]/8 flex items-center justify-center mb-6">
          <Calculator className="h-10 w-10 text-[#512B81]" strokeWidth={1.5} />
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-[#1b1b1b] tracking-tight leading-tight mb-4">
          {node.title || content.calculator || 'Calculadora de Escore'}
        </h2>
        {content.description && (
          <p className="text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto">
            {content.description}
          </p>
        )}
      </div>

      <div className="w-full space-y-6">
        <motion.div
          variants={listContainer}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          {questions.map((question: any, index: number) => (
            <motion.div key={question.id ?? index} variants={listItem}>
              <button
                onClick={() => handleToggle(question.id ?? String(index))}
                className={`w-full text-left p-6 rounded-3xl border transition-all duration-200 group ${answers[question.id ?? String(index)]
                  ? 'bg-[#512B81]/8 border-[#512B81]/20 shadow-sm'
                  : 'bg-white border-slate-100 hover:border-[#512B81]/20 hover:bg-slate-50 hover:shadow-sm'
                  }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`flex-shrink-0 w-6 h-6 rounded-md border flex items-center justify-center transition-colors ${answers[question.id ?? String(index)] ? 'bg-[#512B81] border-[#512B81]' : 'bg-white border-slate-300 group-hover:border-[#512B81]/40'
                    }`}>
                    {answers[question.id ?? String(index)] && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <span className="flex-1 text-base font-medium text-slate-700 leading-relaxed">{question.text}</span>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${answers[question.id ?? String(index)] ? 'bg-[#512B81] text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                    {question.points} {question.points === 1 ? 'ponto' : 'pontos'}
                  </div>
                </div>
              </button>
            </motion.div>
          ))}
        </motion.div>

        {/* Score Total */}
        <div className="bg-gradient-to-r from-[#512B81] to-[#67023D] rounded-3xl p-8 text-center text-white shadow-sm mt-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-white/5" />
          <div className="relative z-10">
            <p className="text-xs font-black uppercase tracking-wider text-white/70 mb-4 opacity-90">
              Escore Total
            </p>
            <motion.p
              key={totalScore}
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="text-6xl font-black tracking-tight"
            >
              {totalScore}
            </motion.p>
            {content.maxScore && (
              <p className="text-sm text-purple-100 mt-2 font-medium opacity-80">de {content.maxScore} pontos</p>
            )}
          </div>
        </div>

        {/* Interpretação */}
        {interpretation && (
          <Alert
            className={`rounded-2xl border-0 p-6 ${interpretation.severity === 'high'
              ? 'bg-red-50 text-red-900'
              : interpretation.severity === 'moderate'
                ? 'bg-amber-50 text-amber-900'
                : 'bg-emerald-50 text-emerald-900'
              }`}
          >
            <AlertDescription className="text-base text-center leading-relaxed">
              <strong className="font-black block text-sm uppercase tracking-wider mb-2 opacity-80">{interpretation.label}</strong>
              <span className="font-medium">{interpretation.description}</span>
            </AlertDescription>
          </Alert>
        )}

        {edges.length > 0 && (
          <button
            onClick={handleSubmit}
            className="w-full flex items-center justify-center gap-2 p-6 rounded-2xl bg-[#1b1b1b] hover:bg-[#2d2d2d] text-white font-bold transition-all mt-8 group"
          >
            Calcular e Continuar
            <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </div>
    </div>
  );
}
