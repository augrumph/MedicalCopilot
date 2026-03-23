import { PlayCircle, ChevronRight, Check } from 'lucide-react';
import { ProtocolNode, ProtocolEdge } from '../../../types';
import { motion } from 'framer-motion';
import { memo } from 'react';

interface StartNodeProps {
  node: ProtocolNode;
  edges: ProtocolEdge[];
  onSelectEdge: (edge: ProtocolEdge) => void;
}

export const StartNode = memo(function StartNode({ node, edges, onSelectEdge }: StartNodeProps) {
  const content = node.content || {};

  return (
    <div className="max-w-3xl mx-auto w-full">
      <div className="flex flex-col items-center text-center mb-10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="w-24 h-24 rounded-full bg-[#512B81]/8 flex items-center justify-center mb-6 text-[#512B81]"
        >
          <PlayCircle className="h-12 w-12" strokeWidth={1.5} />
        </motion.div>

        <h2 className="text-3xl sm:text-4xl font-black text-[#1b1b1b] tracking-tight leading-tight mb-4">
          {node.title || 'Início do Protocolo'}
        </h2>

        {content.text && (
          <p className="text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto">
            {content.text}
          </p>
        )}
      </div>

      <div className="w-full space-y-6">
        {content.keyPoints && Array.isArray(content.keyPoints) && (
          <div className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-6 text-center">
              Pontos Chave
            </h3>
            <div className="space-y-4">
              {content.keyPoints.map((point: string, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-[#512B81]/10 flex items-center justify-center flex-shrink-0 mt-0.5 text-[#512B81]">
                    <Check className="h-4 w-4" />
                  </div>
                  <p className="text-base text-slate-700 leading-relaxed font-medium">{point}</p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {edges.length > 0 && (
          <button
            onClick={() => onSelectEdge(edges[0])}
            className="w-full flex items-center justify-center gap-2 p-6 rounded-2xl bg-[#512B81] hover:bg-[#6435a1] text-white font-bold transition-all mt-8 group"
          >
            Iniciar Protocolo
            <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </div>
    </div>
  );
});
