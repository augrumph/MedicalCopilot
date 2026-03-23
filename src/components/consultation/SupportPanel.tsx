import { 
  ArrowRight,
  Zap,
  Info,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProtocolRank } from '@/hooks/useProtocolDiscovery';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

interface SupportPanelProps {
  ranking: ProtocolRank[];
  onStartProtocol: (id: string) => void;
}

export const SupportPanel: React.FC<SupportPanelProps> = ({ ranking, onStartProtocol }) => {
  const topProtocol = ranking[0];
  const secondaryProtocols = ranking.slice(1, 4);
  const hasHighConfidence = topProtocol && topProtocol.probability > 0.6;

  return (
    <div className="h-full flex flex-col gap-5">
      <div className="flex items-center gap-2 px-1">
        <Zap className="w-3.5 h-3.5 text-[#F59E0B]" />
        <h3 className="text-[9px] font-black text-[#010101] uppercase tracking-widest">Suporte Clínico</h3>
      </div>

      {/* PROTOCOLO PRIORITÁRIO */}
      {topProtocol ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "rounded-3xl border-2 p-4 lg:p-6 space-y-4 shadow-xl transition-all",
            hasHighConfidence 
              ? "bg-red-50 border-red-200 ring-4 ring-red-500/5 shadow-red-100" 
              : "bg-white border-[#682bd7]/20 shadow-[#010101]/5"
          )}
        >
          <div className="flex justify-between items-start">
            <span className={cn(
              "text-[9px] font-black uppercase tracking-widest",
              hasHighConfidence ? "text-red-600 animate-pulse" : "text-[#682bd7]"
            )}>
              {hasHighConfidence ? "🚨 Alerta Crítico" : "💡 Hipótese Principal"}
            </span>
            {hasHighConfidence && (
              <Badge className="bg-red-500 text-[8px] border-none font-black px-2 h-4 shadow-lg shadow-red-500/10">RED FLAG</Badge>
            )}
          </div>

          <h4 className="text-lg lg:text-xl font-black text-[#010101] leading-tight tracking-tight">
            {topProtocol.title}
          </h4>

          <div className="space-y-3">
              <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-2">
                   <p className={cn(
                     "text-[9px] font-black uppercase tracking-widest",
                     hasHighConfidence ? "text-red-500" : "text-[#682bd7]"
                   )}>
                    Evidências Clínicas
                   </p>
                  <span className="text-[8px] font-bold text-slate-300 uppercase">IA Core</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {topProtocol.reason.split('.').filter(r => r.trim()).map((reason, i) => (
                    <div key={i} className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-md border border-slate-100">
                      <div className={cn(
                        "w-1 h-1 rounded-full",
                        hasHighConfidence ? "bg-red-500" : "bg-[#682bd7]"
                      )} />
                      <span className="text-[10px] font-medium text-slate-500">
                        {reason.trim()}
                      </span>
                    </div>
                  ))}
                </div>
             </div>

             {hasHighConfidence && (
               <div className="bg-[#EF4444]/10 rounded-xl p-3 border border-[#EF4444]/20">
                  <p className="text-[9px] font-black text-[#EF4444] uppercase mb-1 tracking-widest">Conduta Imediata</p>
                  <p className="text-xs font-bold text-slate-700 leading-tight">
                    ECG e monitorização imediata.
                  </p>
               </div>
             )}
          </div>

          <Button 
            onClick={() => onStartProtocol(topProtocol.protocolId)}
            className={cn(
              "w-full h-12 rounded-2xl text-[10px] uppercase tracking-widest font-black transition-all active:scale-[0.98] border-none shadow-xl",
              hasHighConfidence 
                ? "bg-red-500 hover:bg-red-600 text-white shadow-red-500/10" 
                : "bg-[#010101] hover:bg-black text-white shadow-[#010101]/10"
            )}
          >
            Abrir Protocolo Clínico
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-100 rounded-[2rem] bg-slate-50/20">
           <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm mb-4">
             <Info className="w-5 h-5 text-slate-300" />
           </div>
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center px-4">
             Aguardando dados clínicos para gerar suporte
           </p>
        </div>
      )}

      {/* DIFERENCIAIS */}
      {secondaryProtocols.length > 0 && (
        <div className="space-y-3">
           <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Hipóteses Diferenciais</h5>
           <div className="space-y-2">
              {secondaryProtocols.map((rank) => (
                <div 
                  key={rank.protocolId}
                  onClick={() => onStartProtocol(rank.protocolId)}
                  className="p-4 bg-white border border-[#ddd6d0] rounded-2xl hover:border-[#682bd7]/30 hover:shadow-xl hover:shadow-[#010101]/5 transition-all cursor-pointer group flex items-center justify-between active:scale-[0.98]"
                >
                  <div className="space-y-2 flex-1 mr-4 overflow-hidden">
                    <div className="flex items-center justify-between gap-2">
                      <h6 className="text-[12px] font-black text-[#010101] group-hover:text-[#682bd7] transition-colors truncate">
                        {rank.title}
                      </h6>
                      <span className="text-[10px] font-bold text-slate-400 tabular-nums">
                        {Math.round(rank.probability * 100)}%
                      </span>
                    </div>
                    
                    <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                       <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${rank.probability * 100}%` }}
                        className={cn(
                          "h-full rounded-full transition-colors",
                          rank.probability > 0.4 ? "bg-[#682bd7]" : "bg-slate-200 group-hover:bg-[#682bd7]/40"
                        )} 
                       />
                    </div>
                  </div>
                  <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-white transition-colors flex-shrink-0 border border-slate-100">
                    <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-[#682bd7] transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              ))}
           </div>
        </div>
      )}
    </div>
  );
};
