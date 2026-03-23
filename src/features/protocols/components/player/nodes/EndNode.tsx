import { CheckCircle2, Home } from 'lucide-react';
import { ProtocolNode } from '../../../types';
import { motion } from 'framer-motion';
import { memo } from 'react';

interface EndNodeProps {
  node: ProtocolNode;
  onFinish?: () => void;
}

export const EndNode = memo(function EndNode({ node, onFinish }: EndNodeProps) {
  const content = node.content || {};

  return (
    <div className="max-w-3xl mx-auto w-full">
      <div className="flex flex-col items-center text-center mb-10">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
          className="w-24 h-24 rounded-full bg-emerald-50 flex items-center justify-center mb-6"
        >
          <CheckCircle2 className="h-12 w-12 text-emerald-500" strokeWidth={1.5} />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl sm:text-4xl font-black text-[#1b1b1b] tracking-tight leading-tight mb-4"
        >
          {node.title || 'Protocolo Concluído'}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto"
        >
          {content.text || 'Você completou todas as etapas do protocolo com sucesso.'}
        </motion.p>
      </div>

      <div className="w-full space-y-6">
        {content.summary && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-8 rounded-3xl bg-white border border-slate-100 shadow-sm"
          >
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-4">
              Resumo
            </h3>
            <p className="text-base text-slate-700 leading-relaxed font-medium">{content.summary}</p>
          </motion.div>
        )}

        {content.nextSteps && Array.isArray(content.nextSteps) && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-8 rounded-3xl bg-emerald-50 border border-emerald-100 shadow-sm"
          >
            <h3 className="text-xs font-black uppercase tracking-wider text-emerald-700 mb-6">
              Próximos Passos
            </h3>
            <div className="space-y-4">
              {content.nextSteps.map((step: string, index: number) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-emerald-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700" />
                  </div>
                  <p className="text-base font-medium text-emerald-900 leading-relaxed">{step}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          onClick={onFinish}
          className="w-full flex items-center justify-center gap-2 p-6 rounded-2xl bg-[#1b1b1b] hover:bg-[#2d2d2d] text-white font-bold transition-all mt-8 group"
        >
          <Home className="h-5 w-5" />
          Voltar aos Protocolos
        </motion.button>
      </div>
    </div>
  );
});
