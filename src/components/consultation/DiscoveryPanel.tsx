import { memo, useState, useEffect, useRef } from 'react';
import {
  Target,
  Sparkles,
  ArrowRight,
  Loader2,
  ChevronDown,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { DiscoveryStage, PatientContext, ProtocolRank } from '@/hooks/useProtocolDiscovery';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const TRIAGE_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  RED:    { bg: 'bg-red-100',    text: 'text-red-700',    label: 'Imediato'    },
  ORANGE: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Muito Urgente' },
  YELLOW: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Urgente'     },
  GREEN:  { bg: 'bg-emerald-100',text: 'text-emerald-700',label: 'Pouco Urgente'},
  BLUE:   { bg: 'bg-blue-100',   text: 'text-blue-700',   label: 'Observação'  },
};

interface DiscoveryPanelProps {
  stage: DiscoveryStage;
  ranking: ProtocolRank[];
  isProcessing: boolean;
  showAll: boolean;
  setShowAll: (v: boolean) => void;
  error?: string | null;
  onStartProtocol: (protocolId: string) => void;
  updateInitialRanking: (transcript: string, ctx: PatientContext) => Promise<void>;
  setStage: (stage: DiscoveryStage) => void;
}

export const DiscoveryPanel = memo(({
  stage,
  ranking,
  isProcessing,
  showAll,
  setShowAll,
  error,
  onStartProtocol,
  updateInitialRanking,
  setStage,
}: DiscoveryPanelProps) => {
  const [queixa,  setQueixa]  = useState('');
  const [vitals,  setVitals]  = useState({ pa: '', fc: '', sat: '', temp: '' });
  const [idade,   setIdade]   = useState('');
  const [genero,  setGenero]  = useState<'M' | 'F' | ''>('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const visible = showAll ? ranking : ranking.slice(0, 5);
  const hiddenCount = Math.max(0, ranking.length - 5);

  const handleStart = () => {
    if (!queixa.trim() || isProcessing) return;
    updateInitialRanking(queixa, { age: idade, gender: genero, vitalSigns: vitals });
  };

  useEffect(() => {
    if (stage === 'INITIAL' && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [stage]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleStart();
    }
  };

  const handleReset = () => {
    setStage('INITIAL');
    setShowAll(false);
    setQueixa('');
    setVitals({ pa: '', fc: '', sat: '', temp: '' });
    setIdade('');
    setGenero('');
  };

  return (
    <div className="w-full h-full flex flex-col justify-center">
      <AnimatePresence mode="wait">

        {/* ── INITIAL ── */}
        {stage === 'INITIAL' && (
          <motion.div
            key="initial"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            className="w-full max-w-2xl mx-auto space-y-6"
          >
            <div className="flex flex-col gap-6">
              {/* Queixa */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Label className="text-[10px] font-black text-[#010101] uppercase tracking-widest">Queixa / Dúvida</Label>
                  <span className="text-[8px] font-bold text-[#682bd7] bg-[#682bd7]/5 px-1.5 py-0.5 rounded border border-[#682bd7]/10 uppercase tracking-tighter">Campo Obrigatório</span>
                </div>
                <div className="relative group/queixa">
                  <textarea
                    ref={textareaRef}
                    onKeyDown={handleKeyDown}
                    className="w-full h-24 rounded-2xl bg-slate-50/50 border-2 border-[#ddd6d0] p-4 text-base font-bold text-[#010101] focus:border-[#682bd7]/30 focus:bg-white transition-all outline-none resize-none shadow-sm placeholder:text-slate-300 focus:ring-4 focus:ring-[#682bd7]/5"
                    placeholder="Ex: Suspeita de Dengue, Cefaleia + Febre..."
                    value={queixa}
                    onChange={(e) => setQueixa(e.target.value)}
                  />
                  <div className={cn(
                    'absolute bottom-3 right-4 flex items-center gap-1.5 transition-all duration-300',
                    queixa.trim() ? 'opacity-100' : 'opacity-0 pointer-events-none',
                  )}>
                    <span className="text-[9px] font-black text-[#682bd7] uppercase tracking-widest">ENTER PARA INICIAR</span>
                    <kbd className="inline-flex h-5 select-none items-center rounded border border-[#ddd6d0] bg-white px-1.5 font-mono text-[10px] font-black text-[#682bd7] shadow-sm">↵</kbd>
                  </div>
                </div>
              </div>

              {/* Idade + Gênero */}
              <div className="flex gap-3">
                <div className="space-y-2 flex-1">
                  <Label className="text-[10px] font-black text-[#010101] uppercase tracking-widest px-1">Idade</Label>
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50/50 border border-[#ddd6d0] hover:border-[#682bd7]/30 hover:bg-white transition-all shadow-sm">
                    <input
                      type="number" min="0" max="120" placeholder="—"
                      className="w-full bg-transparent text-sm font-black text-[#010101] outline-none placeholder:text-slate-200"
                      value={idade}
                      onChange={(e) => setIdade(e.target.value)}
                    />
                    <span className="text-[9px] font-bold text-slate-400 shrink-0">anos</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black text-[#010101] uppercase tracking-widest px-1">Gênero</Label>
                  <div className="flex gap-1.5">
                    {(['M', 'F'] as const).map(g => (
                      <button
                        key={g} type="button"
                        onClick={() => setGenero(prev => prev === g ? '' : g)}
                        className={cn(
                          'h-10 w-12 rounded-xl text-xs font-black border-2 transition-all shadow-sm',
                          genero === g
                            ? 'bg-[#682bd7] border-[#682bd7] text-white'
                            : 'bg-slate-50/50 border-[#ddd6d0] text-slate-400 hover:border-[#682bd7]/40 hover:text-[#682bd7]',
                        )}
                      >
                        {g === 'M' ? '♂ M' : '♀ F'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sinais Vitais */}
              <div className="space-y-2">
                <Label className="text-[10px] font-black text-[#010101] uppercase tracking-widest px-1">Sinais Vitais</Label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'pa',   label: 'PA',  placeholder: '120/80', unit: 'mmHg' },
                    { id: 'fc',   label: 'FC',  placeholder: '80',     unit: 'bpm'  },
                    { id: 'sat',  label: 'Sat', placeholder: '98',     unit: '%'    },
                    { id: 'temp', label: 'T',   placeholder: '36.5',   unit: '°C'   },
                  ].map(v => (
                    <div key={v.id} className="group flex flex-col items-center gap-1.5 p-3 rounded-xl bg-slate-50/50 border border-[#ddd6d0] hover:border-[#682bd7]/30 hover:bg-white transition-all shadow-sm">
                      <input
                        type="text" placeholder={v.placeholder}
                        className="w-full bg-transparent text-sm font-black text-[#010101] outline-none text-center placeholder:text-slate-200"
                        value={vitals[v.id as keyof typeof vitals]}
                        onChange={(e) => setVitals({ ...vitals, [v.id]: e.target.value })}
                      />
                      <div className="flex items-center gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
                        <span className="text-[8px] font-black text-[#682bd7] uppercase tracking-tighter">{v.label}</span>
                        <span className="text-[7px] font-bold text-slate-400">{v.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <Button
                  className="w-full h-12 rounded-xl bg-[#010101] hover:bg-black text-white font-black shadow-lg shadow-[#010101]/10 transition-all active:scale-[0.98] uppercase tracking-widest text-[10px] border-none"
                  onClick={handleStart}
                  disabled={!queixa.trim() || isProcessing}
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="animate-pulse">Analisando Protocolos...</span>
                    </div>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      Iniciar Investigação
                    </>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── IDENTIFIED — ranked list ── */}
        {stage === 'IDENTIFIED' && (
          <motion.div
            key="identified"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-2xl mx-auto space-y-4"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#682bd7] flex items-center justify-center shadow-md shadow-[#682bd7]/20">
                  <Target className="w-3.5 h-3.5 text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-[#682bd7] uppercase tracking-widest">Protocolos Sugeridos</p>
                  <p className="text-[9px] font-bold text-slate-400">{ranking.length} encontrados · mostrando {visible.length}</p>
                </div>
              </div>
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 text-[9px] font-black text-slate-400 hover:text-[#682bd7] transition-colors uppercase tracking-widest"
              >
                <RotateCcw className="w-3 h-3" />
                Nova busca
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-100">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
                <p className="text-xs font-bold text-red-600">{error}</p>
              </div>
            )}

            {/* Protocol list */}
            <div className="space-y-2">
              <AnimatePresence>
                {visible.map((p, idx) => {
                  const triage = TRIAGE_COLORS[p.triageColor] ?? TRIAGE_COLORS.GREEN;
                  return (
                    <motion.div
                      key={p.protocolId}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      className="group flex items-center gap-3 p-3.5 rounded-2xl bg-white border border-[#ddd6d0] hover:border-[#682bd7]/30 hover:shadow-md transition-all cursor-pointer"
                      onClick={() => onStartProtocol(p.protocolId)}
                    >
                      {/* Rank number */}
                      <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-black text-slate-500">{idx + 1}</span>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-sm font-black text-[#010101] truncate">{p.title}</p>
                          <Badge className={cn('shrink-0 text-[8px] font-black border-none px-1.5 py-0', triage.bg, triage.text)}>
                            {triage.label}
                          </Badge>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 truncate">{p.specialty}</p>
                        {p.reason && (
                          <p className="text-[10px] font-bold text-slate-500 mt-0.5 line-clamp-1">{p.reason}</p>
                        )}
                      </div>

                      {/* Probability bar + open button */}
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="hidden sm:flex flex-col items-end gap-1">
                          <span className="text-[9px] font-black text-[#682bd7]">{Math.round(p.probability * 100)}%</span>
                          <div className="w-16 h-1 rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-[#682bd7]/60"
                              style={{ width: `${Math.round(p.probability * 100)}%` }}
                            />
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#682bd7] transition-colors" />
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Ver mais / Ver menos */}
            {ranking.length > 5 && (
              <button
                onClick={() => setShowAll(!showAll)}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-[#ddd6d0] text-[10px] font-black text-slate-400 hover:text-[#682bd7] hover:border-[#682bd7]/30 transition-all uppercase tracking-widest"
              >
                <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', showAll && 'rotate-180')} />
                {showAll ? 'Ver menos' : `Ver mais ${hiddenCount} protocolo${hiddenCount !== 1 ? 's' : ''}`}
              </button>
            )}
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
});
DiscoveryPanel.displayName = 'DiscoveryPanel';
