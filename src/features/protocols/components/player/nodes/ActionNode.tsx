import { Activity, Clock, ChevronRight, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ProtocolNode, ProtocolEdge } from '../../../types';
import { motion } from 'framer-motion';
import { memo } from 'react';

interface ActionNodeProps {
  node: ProtocolNode;
  edges: ProtocolEdge[];
  onSelectEdge: (edge: ProtocolEdge) => void;
}

export const ActionNode = memo(function ActionNode({ node, edges, onSelectEdge }: ActionNodeProps) {
  const content = node.content || {};

  // Ensure instructions is always an array
  let instructions = [];
  if (content.instructions) {
    instructions = Array.isArray(content.instructions) ? content.instructions : [content.instructions];
  } else if (content.instruction) {
    instructions = [content.instruction];
  }

  const timeTarget = content.time_target_minutes;
  const isCritical = node.critical || content.critical;

  return (
    <div className="max-w-3xl mx-auto w-full">
      <div className="flex flex-col items-center text-center mb-10">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${isCritical ? 'bg-red-50' : 'bg-[#512B81]/8'
          }`}>
          <Activity className={`h-10 w-10 ${isCritical ? 'text-red-500' : 'text-[#512B81]'}`} strokeWidth={1.5} />
        </div>

        <div className="flex flex-col items-center gap-3 mb-4">
          <h2 className="text-3xl sm:text-4xl font-black text-[#1b1b1b] tracking-tight leading-tight">
            {node.title || 'Ação Requerida'}
          </h2>
          {timeTarget && (
            <Badge variant="outline" className="border-slate-200 text-slate-600 font-bold px-3 py-1">
              <Clock className="h-3.5 w-3.5 mr-1.5" />
              Alvo: {timeTarget} min
            </Badge>
          )}
        </div>

        {content.description && (
          <p className="text-lg text-slate-500 leading-relaxed max-w-2xl">
            {content.description}
          </p>
        )}
      </div>

      {isCritical && (
        <div className="mb-8 p-5 rounded-2xl bg-red-50 border border-red-100 flex items-start gap-4">
          <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-black text-red-900 uppercase tracking-wider mb-1">
              Ação Crítica
            </p>
            <p className="text-sm text-red-800">Execute imediatamente</p>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mb-10 w-full">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-6 text-center">
          Instruções do Procedimento
        </h3>
        <div className="space-y-4">
          {instructions.map((instruction: string, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-slate-100"
            >
              <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                <span className="text-sm font-black text-[#1b1b1b]">{index + 1}</span>
              </div>
              <p className="text-base text-slate-700 leading-relaxed flex-1 pt-1 font-medium">{instruction}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {content.warnings && Array.isArray(content.warnings) && content.warnings.length > 0 && (
        <div className="mb-8 p-5 rounded-2xl bg-amber-50 border border-amber-100 flex items-start gap-4">
          <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-black text-amber-900 uppercase tracking-wider mb-1">
              Atenção
            </p>
            <ul className="list-disc list-inside text-sm text-amber-800 space-y-1">
              {content.warnings.map((warn: string, i: number) => (
                <li key={i}>{warn}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {edges.length > 0 && (
        <button
          onClick={() => onSelectEdge(edges[0])}
          className={`w-full flex items-center justify-center gap-2 p-6 rounded-2xl text-white font-bold transition-all mt-8 group ${isCritical
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-[#512B81] hover:bg-[#6435a1]'
            }`}
        >
          <CheckCircle2 className="h-5 w-5" />
          Ação Concluída
          <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </button>
      )}
    </div>
  );
});
