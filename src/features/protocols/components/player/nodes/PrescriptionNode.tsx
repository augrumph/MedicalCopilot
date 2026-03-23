import { Pill, ChevronRight, AlertTriangle, Copy, Check } from 'lucide-react';
import { ProtocolNode, ProtocolEdge } from '../../../types';
import { useState, memo } from 'react';
import { toast } from 'sonner';

interface PrescriptionNodeProps {
  node: ProtocolNode;
  edges: ProtocolEdge[];
  onSelectEdge: (edge: ProtocolEdge) => void;
}

export const PrescriptionNode = memo(function PrescriptionNode({ node, edges, onSelectEdge }: PrescriptionNodeProps) {
  const content = node.content || {};
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const text = `${content.drug_name}\nDose: ${content.dose}\nVia: ${content.route}\nFrequência: ${content.frequency}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Prescrição copiada!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-3xl mx-auto w-full">
      <div className="flex flex-col items-center text-center mb-10">
        <div className="w-20 h-20 rounded-full bg-pink-50 flex items-center justify-center mb-6">
          <Pill className="h-10 w-10 text-pink-500" strokeWidth={1.5} />
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-[#1b1b1b] tracking-tight leading-tight mb-2">
          {node.title || 'Prescrição'}
        </h2>
        <p className="text-lg text-slate-500 leading-relaxed max-w-2xl">
          Medicamento recomendado
        </p>
      </div>

      {/* Prescription Card */}
      <div className="mb-10 w-full p-8 rounded-3xl bg-white border border-slate-100 shadow-sm relative overflow-hidden">
        {/* Top Right Copy Button */}
        <div className="absolute top-6 right-6 z-10">
          <button
            onClick={handleCopy}
            className="w-10 h-10 rounded-full bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center transition-all shadow-sm"
            title="Copiar Prescrição"
          >
            {copied ? (
              <Check className="h-4 w-4 text-emerald-600" />
            ) : (
              <Copy className="h-4 w-4 text-slate-500" />
            )}
          </button>
        </div>

        <h3 className="text-3xl font-black text-pink-600 mb-8 pr-12">
          {content.drug_name || 'Medicamento'}
        </h3>

        <div className="grid grid-cols-2 gap-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Dose
            </p>
            <p className="text-xl font-bold text-[#1b1b1b]">{content.dose || 'N/A'}</p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Via
            </p>
            <p className="text-xl font-bold text-[#1b1b1b]">{content.route || 'N/A'}</p>
          </div>

          <div className="col-span-2">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Frequência
            </p>
            <p className="text-xl font-bold text-[#1b1b1b]">{content.frequency || 'N/A'}</p>
          </div>
        </div>

        {content.duration && (
          <div className="mt-8 pt-8 border-t border-slate-100">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Duração do Tratamento
            </p>
            <p className="text-xl font-bold text-[#1b1b1b]">{content.duration}</p>
          </div>
        )}

        {content.notes && (
          <div className="mt-8 pt-8 border-t border-slate-100">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Observações
            </p>
            <p className="text-base text-slate-600 leading-relaxed font-medium">{content.notes}</p>
          </div>
        )}
      </div>

      {content.warnings && Array.isArray(content.warnings) && content.warnings.length > 0 && (
        <div className="mb-8 p-6 rounded-2xl bg-amber-50 border border-amber-100 flex items-start gap-4">
          <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-black text-amber-900 uppercase tracking-wider mb-2">
              Contraindicações
            </p>
            <ul className="space-y-2">
              {content.warnings.map((warning: string, index: number) => (
                <li key={index} className="text-sm font-medium text-amber-800 leading-relaxed flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">•</span>
                  <span>{warning}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

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
