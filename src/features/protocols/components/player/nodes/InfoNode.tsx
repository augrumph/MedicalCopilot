import { Info, ChevronRight } from 'lucide-react';
import { ProtocolNode, ProtocolEdge } from '../../../types';
import { memo } from 'react';

interface InfoNodeProps {
  node: ProtocolNode;
  edges: ProtocolEdge[];
  onSelectEdge: (edge: ProtocolEdge) => void;
}

export const InfoNode = memo(function InfoNode({ node, edges, onSelectEdge }: InfoNodeProps) {
  const content = node.content || {};

  return (
    <div className="max-w-3xl mx-auto w-full">
      <div className="flex flex-col items-center text-center mb-10">
        <div className="w-20 h-20 rounded-full bg-[#512B81]/8 flex items-center justify-center mb-6">
          <Info className="h-10 w-10 text-[#512B81]" strokeWidth={1.5} />
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-[#1b1b1b] tracking-tight leading-tight mb-6">
          {node.title || 'Informação'}
        </h2>

        <div className="w-full p-8 rounded-3xl bg-white border border-slate-100 shadow-sm relative overflow-hidden">
          <p className="text-lg text-slate-700 leading-relaxed font-medium">
            {content.text || 'Informação adicional sobre o protocolo.'}
          </p>
        </div>
      </div>

      {edges.length > 0 && (
        <button
          onClick={() => onSelectEdge(edges[0])}
          className="w-full flex items-center justify-center gap-2 p-6 rounded-2xl bg-[#512B81] hover:bg-[#6435a1] text-white font-bold transition-all mt-8 group"
        >
          Continuar
          <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </button>
      )}
    </div>
  );
});
