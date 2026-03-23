import { useProtocolsStore } from '../../store/protocolsStore';
import { NodeRenderer } from './nodes/NodeRenderer';
import { motion } from 'framer-motion';
import { Loader2, ArrowLeft, Home, RotateCcw, ChevronLeft } from 'lucide-react';
import { useMemo, useCallback, memo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AppLayout } from '@/components/AppLayout';


interface ProtocolPlayerProps {
  onExit: () => void;
}

export const ProtocolPlayer = memo(function ProtocolPlayer({ onExit }: ProtocolPlayerProps) {
  const activeProtocol = useProtocolsStore((state) => state.activeProtocol);
  const currentNode = useProtocolsStore((state) => state.currentNode);
  const currentEdges = useProtocolsStore((state) => state.currentEdges);
  const nodeHistory = useProtocolsStore((state) => state.nodeHistory);
  const isLoading = useProtocolsStore((state) => state.isLoading);
  const moveToNextNode = useProtocolsStore((state) => state.moveToNextNode);
  const goBack = useProtocolsStore((state) => state.goBack);
  const resetProtocol = useProtocolsStore((state) => state.resetProtocol);
  const startProtocol = useProtocolsStore((state) => state.startProtocol);

  // Progress: asymptotic growth toward 90% as steps accumulate, 100% at END.
  // Avoids dividing by allNodes.length (which includes unvisited branches).
  const progress = useMemo(() => {
    if (currentNode?.type === 'END') return 100;
    const steps = nodeHistory.length;
    return Math.min(90, Math.round((1 - 1 / (steps + 2)) * 90 + 5));
  }, [currentNode, nodeHistory.length]);

  const currentStep = nodeHistory.length + 1;

  const handleExit = useCallback(() => {
    resetProtocol();
    onExit();
  }, [resetProtocol, onExit]);

  // Reiniciar: restart the same protocol from the beginning (not exit)
  const handleReset = useCallback(() => {
    if (activeProtocol) {
      startProtocol(activeProtocol.id);
    }
  }, [activeProtocol, startProtocol]);

  if (!activeProtocol || !currentNode) {
    return null;
  }

  if (isLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center flex-1 h-full">
          <div className="text-center">
            <div className="w-16 h-16 rounded-3xl bg-[#512B81]/10 flex items-center justify-center mx-auto mb-6 shadow-sm border border-[#512B81]/20">
              <Loader2 className="h-8 w-8 animate-spin text-[#512B81]" />
            </div>
            <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Carregando protocolo</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  const triageBadgeColors: Record<string, string> = {
    RED: 'bg-red-500',
    ORANGE: 'bg-orange-400',
    YELLOW: 'bg-amber-400 text-gray-900',
    GREEN: 'bg-emerald-500',
    BLUE: 'bg-blue-500',
  };

  return (
    <AppLayout>
      <div className="flex-1 flex flex-col -mx-6 sm:-mx-8 lg:-mx-10 -my-6 bg-[#faf9f7] min-h-screen">

        {/* ── Barra de navegação mínima / discreta ── */}
        <div className="sticky top-0 z-40 bg-white border-b border-slate-100">
          {/* Linha principal: voltar | título truncado | sair */}
          <div className="flex items-center gap-2 px-4 h-12">
            <button
              onClick={handleExit}
              className="flex items-center gap-1.5 text-slate-400 hover:text-slate-700 transition-colors flex-shrink-0 text-sm font-medium"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Voltar</span>
            </button>

            <div className="flex-1 min-w-0 flex items-center gap-2 justify-center">
              <span className="text-sm font-semibold text-slate-700 truncate max-w-xs sm:max-w-md">
                {activeProtocol.title}
              </span>
              <Badge
                className={`${triageBadgeColors[activeProtocol.triageColor] || 'bg-gray-400'} text-white text-[9px] font-black uppercase tracking-wider flex-shrink-0 px-1.5 py-0 rounded border-none shadow-none h-4`}
              >
                {activeProtocol.triageColor}
              </Badge>
            </div>

            <button
              onClick={handleExit}
              className="flex items-center gap-1.5 text-slate-400 hover:text-slate-700 transition-colors flex-shrink-0 text-sm font-medium"
            >
              <Home className="h-3.5 w-3.5" />
              <span className="hidden sm:inline text-xs">Sair</span>
            </button>
          </div>

          {/* Barra de progresso fina */}
          <div className="px-4 pb-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-slate-400 font-medium">
                Etapa {currentStep}
              </span>
              <span className="text-[10px] font-bold text-[#512B81]">
                {Math.round(progress)}%
              </span>
            </div>
            <Progress value={progress} className="h-1 bg-slate-100 rounded-full" />
          </div>
        </div>

        {/* ── Área de conteúdo ── */}
        <div className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-8 lg:px-10 py-10 sm:py-14">
          <motion.div
            key={currentNode.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <NodeRenderer
              node={currentNode}
              edges={currentEdges}
              onSelectEdge={moveToNextNode}
              onFinish={handleExit}
            />
          </motion.div>
        </div>

        {/* ── Rodapé com voltar ── */}
        {nodeHistory.length > 0 && (
          <div className="sticky bottom-0 z-40 bg-white border-t border-slate-100 px-4 sm:px-8 lg:px-10 py-3 shadow-[0_-2px_12px_-6px_rgba(0,0,0,0.06)]">
            <div className="max-w-4xl mx-auto w-full flex items-center justify-between gap-4">
              <Button
                variant="outline"
                onClick={goBack}
                disabled={nodeHistory.length === 0}
                className="rounded-xl border-slate-200 hover:bg-slate-50 hover:text-[#1b1b1b] text-slate-600 disabled:opacity-30 disabled:hover:bg-transparent h-10 px-5 shadow-sm text-sm font-semibold"
              >
                <ArrowLeft className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Voltar Etapa</span>
              </Button>

              <Button
                variant="ghost"
                onClick={handleReset}
                className="rounded-xl text-sm font-semibold text-slate-400 hover:text-slate-700 hover:bg-slate-100 h-10 px-4"
              >
                <RotateCcw className="h-3.5 w-3.5 sm:mr-2" />
                <span className="hidden sm:inline">Reiniciar</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
});
