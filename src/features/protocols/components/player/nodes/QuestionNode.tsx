import { HelpCircle, ChevronRight } from 'lucide-react';
import { ProtocolNode, ProtocolEdge } from '../../../types';
import { motion } from 'framer-motion';
import { useState, memo } from 'react';
import { toast } from 'sonner';

interface QuestionNodeProps {
  node: ProtocolNode;
  edges: ProtocolEdge[];
  onSelectEdge: (edge: ProtocolEdge) => void;
}

// Removes accents/diacritics: "Não" → "NAO", "Leve a Moderada" → "LEVEAMODER"
function slugValue(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // strip diacritics
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')       // only alphanumeric
    .slice(0, 10);
}

// Normalize options: supports both string[] and {label, value, color}[]
function normalizeOptions(raw: any[]): { label: string; value: string; color?: string }[] {
  return raw.map((opt) => {
    if (typeof opt === 'string') {
      return { label: opt, value: slugValue(opt) };
    }
    return { label: opt.label || opt.text || String(opt), value: opt.value || slugValue(opt.label || String(opt)), color: opt.color };
  });
}

export const QuestionNode = memo(function QuestionNode({ node, edges, onSelectEdge }: QuestionNodeProps) {
  const content = node.content || {};
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const rawOptions = content.options || [];
  const options = normalizeOptions(rawOptions);

  const handleSelectOption = (value: string) => {
    setSelectedOption(value);
    // Try matching by condition.answer or condition.value
    const matchingEdge =
      edges.find((edge) => edge.condition?.answer === value || edge.condition?.value === value) ||
      edges.find((edge) => {
        // Loose prefix match — only when edge has a non-empty condition value
        const cv = (edge.condition?.value || '').toLowerCase();
        if (!cv) return false;
        const ov = value.toLowerCase().replace(/\s+/g, '').slice(0, 10);
        return cv.startsWith(ov) || ov.startsWith(cv);
      });

    if (matchingEdge) {
      setTimeout(() => onSelectEdge(matchingEdge), 200);
    } else {
      // No matching edge — warn and reset so the doctor can try again
      console.error('[QuestionNode] No matching edge for answer:', value, '| Available edges:', edges);
      toast.error('Rota não encontrada para esta resposta. Verifique a configuração do protocolo.');
      setSelectedOption(null);
    }
  };

  const colorClasses = {
    danger: {
      bg: 'bg-red-50 hover:bg-red-100 border border-red-100',
      active: 'bg-red-500 border-red-500 shadow-md shadow-red-200',
      text: 'text-red-700',
    },
    warning: {
      bg: 'bg-amber-50 hover:bg-amber-100 border border-amber-100',
      active: 'bg-amber-400 border-amber-400 shadow-md shadow-amber-200',
      text: 'text-amber-800',
    },
    success: {
      bg: 'bg-emerald-50 hover:bg-emerald-100 border border-emerald-100',
      active: 'bg-emerald-500 border-emerald-500 shadow-md shadow-emerald-200',
      text: 'text-emerald-700',
    },
    info: {
      bg: 'bg-blue-50 hover:bg-blue-100 border border-blue-100',
      active: 'bg-blue-500 border-blue-500 shadow-md shadow-blue-200',
      text: 'text-blue-700',
    },
    default: {
      bg: 'bg-white hover:bg-slate-50 border border-slate-100',
      active: 'bg-[#512B81] border-[#512B81] shadow-md shadow-[#512B81]/30',
      text: 'text-slate-700',
    },
  };

  return (
    <div className="max-w-3xl mx-auto w-full">
      <div className="flex flex-col items-center text-center mb-10">
        <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center mb-6">
          <HelpCircle className="h-10 w-10 text-amber-500" strokeWidth={1.5} />
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-[#1b1b1b] mb-4 tracking-tight leading-tight">
          {node.title || content.text || 'Pergunta'}
        </h2>
        {content.description && (
          <p className="text-lg text-slate-500 leading-relaxed max-w-2xl">
            {content.description}
          </p>
        )}
        {/* Show the question text if different from title */}
        {content.text && content.text !== node.title && (
          <p className="text-base text-slate-600 leading-relaxed max-w-2xl mt-2">
            {content.text}
          </p>
        )}
      </div>

      {content.helpText && (
        <div className="mb-8 p-4 rounded-2xl bg-blue-50 border border-blue-100 text-center max-w-2xl mx-auto">
          <p className="text-sm font-medium text-blue-800">{content.helpText}</p>
        </div>
      )}

      <motion.div className="space-y-3">
        {options.map((option, index) => {
          const isSelected = selectedOption === option.value;
          const colorKey = (option.color as keyof typeof colorClasses) || 'default';
          const colorScheme = colorClasses[colorKey] || colorClasses.default;

          return (
            <motion.button
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleSelectOption(option.value)}
              disabled={selectedOption !== null}
              className={`
                w-full flex items-center justify-between p-6 rounded-2xl transition-all duration-200
                disabled:cursor-not-allowed group text-left
                ${isSelected ? `${colorScheme.active} text-white scale-[1.02]` : colorScheme.bg}
              `}
            >
              <span className={`text-base font-semibold ${isSelected ? 'text-white' : colorScheme.text}`}>
                {option.label}
              </span>
              <ChevronRight
                className={`h-5 w-5 flex-shrink-0 transition-transform ${isSelected
                  ? 'text-white translate-x-1'
                  : `${colorScheme.text} group-hover:translate-x-1 opacity-50 group-hover:opacity-100`
                  }`}
              />
            </motion.button>
          );
        })}
      </motion.div>

      {options.length === 0 && edges.length > 0 && (
        <button
          onClick={() => onSelectEdge(edges[0])}
          className="w-full flex items-center justify-center gap-2 p-6 rounded-2xl bg-[#1b1b1b] hover:bg-[#2d2d2d] text-white font-bold transition-all mt-8"
        >
          Continuar
          <ChevronRight className="h-5 w-5" />
        </button>
      )}
    </div>
  );
});
