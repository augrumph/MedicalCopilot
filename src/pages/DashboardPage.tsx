import { useNavigate } from 'react-router-dom';
import { useMemo, useEffect, useState } from 'react';
import {
  ArrowRight,
  Zap,
  Stethoscope,
  History,
  Plus,
  Search,
  Calculator,
  Pill,
  Baby,
  Hash,
  Copy,
  ExternalLink,
  Clock
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card } from '@/components/ui/card';

import { useAppStore } from '@/stores/appStore';
import { useFinanceStore } from '@/stores/financeStore';
import { cn } from '@/lib/utils';
import { BuyAccessModal } from '@/components/BuyAccessModal';

const PROTOCOLS = [
  { name: 'Dor Torácica',       icon: Zap,         accent: '#512B81' },
  { name: 'Sepse',              icon: Zap,         accent: '#F61115' },
  { name: 'AVC Isquêmico',      icon: Zap,         accent: '#512B81' },
  { name: 'Manchester',         icon: Stethoscope, accent: '#1B1B1B' },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  const {
    startEmergencyConsultation,
    consultations,
    shiftStatus,
    activeShiftId,
    startShift,
    endShift,
  } = useAppStore();

  const { shifts, fetchData } = useFinanceStore();
  const currentActiveShift = shifts.find((s) => s.id === activeShiftId);

  const [isShiftModalOpen, setIsShiftModalOpen] = useState(false);
  const [isBuyOpen, setIsBuyOpen] = useState(false);
  const [isShiftLoading, setIsShiftLoading] = useState(false);

  useEffect(() => { fetchData(); }, [fetchData]);

  const todayStr = useMemo(() => new Date().toLocaleDateString('en-CA'), []);

  const todayConsultations = useMemo(
    () =>
      consultations
        .filter((c) => new Date(c.startedAt).toLocaleDateString('en-CA') === todayStr && c.status === 'finished')
        .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()),
    [consultations, todayStr]
  );



  const handleStartEmergency = () => {
    if (shiftStatus !== 'active') {
      toast.warning('Inicie o plantão primeiro!');
      return;
    }
    startEmergencyConsultation();
    navigate('/consultation');
  };

  const handleToggleShift = () => {
    if (isShiftLoading) return;
    if (shiftStatus === 'active') {
      endShift();
      toast.info('Plantão finalizado.');
    } else {
      setIsShiftModalOpen(true);
    }
  };

  const confirmStartShift = async (shiftId: string) => {
    if (isShiftLoading) return;
    setIsShiftModalOpen(false);
    setIsShiftLoading(true);
    const t = toast.loading('Iniciando plantão...');
    try {
      await startShift(shiftId);
      toast.success('Plantão iniciado!', { id: t });
    } catch (err) {
      const msg = (err as Error).message;
      if (msg === 'NO_ACCESS' || msg === 'NO_ACCESS_AVAILABLE') {
        toast.error('Sem créditos de plantão. Adquira um para continuar.', { id: t });
        setIsBuyOpen(true);
      } else {
        toast.error('Erro de conexão, iniciando em modo local.', { id: t });
      }
    } finally {
      setIsShiftLoading(false);
    }
  };

  const isActive = shiftStatus === 'active';

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto pb-12">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-black tracking-tight text-[#1b1b1b] mb-2 uppercase">
              Atendimento
            </h1>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest flex items-center gap-2">
              <span
                className={cn('w-2 h-2 rounded-full', isActive ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-200')}
              />
              {isActive && currentActiveShift
                ? `Plantão Ativo · ${currentActiveShift.location}`
                : 'Offline · Inicie seu plantão'}
            </p>
          </div>

          <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-100 shadow-sm">
            {[
              { id: 'shift', label: 'Plantão', active: isActive },
              { id: 'offline', label: 'Pausa', active: !isActive },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={handleToggleShift}
                disabled={isShiftLoading}
                className={cn(
                  "px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed",
                  tab.active
                    ? "bg-white text-[#512B81] border border-slate-100 shadow-sm"
                    : "text-slate-400 hover:text-slate-600 border border-transparent"
                )}
              >
                {tab.active && tab.id === 'shift' && (
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse" />
                )}
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        <div className="flex flex-col gap-6">

          {/* ── HERO CTA ── */}
            <div className="relative overflow-hidden rounded-[32px] group border-0 shadow-2xl bg-[#1b1b1b] p-8 md:p-12 transition-all">
              {/* Complex background for depth - using new Primary Light opacities */}
              <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-[#512B81]/15 to-transparent opacity-60" />
              <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#9A64B5]/5 rounded-full blur-[100px]" />
              
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="flex items-center gap-10">
                  <div className="w-20 h-20 rounded-[24px] flex items-center justify-center bg-white/5 border border-white/10 shadow-2xl flex-shrink-0 backdrop-blur-xl relative group-hover:scale-105 transition-transform duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#512B81] to-[#67023D] opacity-20 rounded-[24px]" />
                    <Stethoscope className="w-10 h-10 text-white relative z-10" strokeWidth={1.5} />
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-3 mb-3">
                        <span className="px-3 py-1 rounded-full bg-[#512B81]/20 border border-[#512B81]/30 text-[10px] font-black text-white uppercase tracking-[0.2em]">
                            Copiloto Ativo
                        </span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight mb-3">
                      Iniciar Novo <br/><span className="text-[#a876c4]">Atendimento</span>
                    </h2>
                    <p className="text-slate-400 font-medium max-w-sm text-base leading-relaxed opacity-80">
                      Sua IA treinada com os protocolos mais recentes para agilizar diagnósticos e condutas clínicas.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <Button 
                    onClick={handleStartEmergency}
                    className="bg-[#512B81] hover:bg-[#6435a1] text-white rounded-3xl px-12 h-16 text-lg font-bold transition-all hover:shadow-[0_20px_40px_-10px_rgba(81,43,129,0.4)] hover:-translate-y-1 active:scale-[0.98] border border-white/10"
                  >
                    <Plus className="mr-3 h-6 w-6" strokeWidth={3} />
                    Novo Atendimento
                  </Button>
                  <button 
                    className="text-slate-500 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest text-center"
                    onClick={() => navigate('/worklist')}
                  >
                    ou acessar worklist completa
                  </button>
                </div>
              </div>
            </div>

          {/* ── CLINICAL SEARCH (SPOTLIGHT) ── */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative"
          >
            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <Input 
              type="text"
              placeholder="Dúvida clínica rápida? (Ex: Dose pediátrica de Dipirona, Interação entre X e Y...)"
              className="w-full h-16 pl-14 pr-6 bg-white border-slate-200 rounded-[22px] shadow-xl shadow-purple-900/5 text-base font-medium placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-[#512B81]/20 focus-visible:border-[#512B81]/40 transition-all border-2"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:block">
               <span className="px-2 py-1 rounded-md bg-slate-100 text-[10px] font-bold text-slate-400 border border-slate-200">ENTER</span>
            </div>
          </motion.div>

          {/* ── POCKET TOOLS GRID ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { id: 'calc', label: 'Calculadoras', icon: Calculator, desc: 'Scores & Fórmulas' },
              { id: 'rx', label: 'Checagem Rx', icon: Pill, desc: 'Interações Graves' },
              { id: 'ped', label: 'Guia Pediátrico', icon: Baby, desc: 'Dose por Peso' },
              { id: 'cid', label: 'CID-10 Smart', icon: Hash, desc: 'Busca Preditiva' },
            ].map((tool, i) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.05 }}
              >
                <Card 
                  className="p-5 bg-white border-slate-100 shadow-sm rounded-[24px] flex flex-col items-center text-center gap-3 cursor-pointer hover:shadow-md hover:border-slate-200 transition-all group active:scale-[0.98]"
                  onClick={() => toast.info(`${tool.label} em breve.`)}
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#512B81]/5 flex items-center justify-center border border-[#512B81]/10 group-hover:bg-[#512B81] group-hover:text-white transition-all duration-300">
                    <tool.icon className="w-6 h-6 text-[#512B81] group-hover:text-white transition-all" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#1b1b1b] mb-0.5">{tool.label}</h3>
                    <p className="text-[10px] font-medium text-slate-400">{tool.desc}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* ── Bottom grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

            {/* Clipboard history (3/5) */}
            <div className="lg:col-span-3 space-y-3">
              <h3 className="text-[11px] font-black text-[#1b1b1b] uppercase tracking-widest flex items-center gap-2 px-1">
                <History className="w-3.5 h-3.5 text-slate-400" />
                Área de Transferência
              </h3>
              <Card className="rounded-3xl overflow-hidden border-slate-200 shadow-sm bg-white">
                  {todayConsultations.length === 0 ? (
                    <div className="p-16 text-center">
                      <div
                        className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 bg-slate-50 border border-slate-100"
                      >
                        <History className="w-6 h-6 text-slate-300" />
                      </div>
                      <p className="text-sm font-bold text-[#1b1b1b]">Nenhum histórico recente</p>
                      <p className="text-[11px] text-slate-400 mt-1">Seus atendimentos aparecerão aqui</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {todayConsultations.slice(0, 4).map((c) => (
                        <div
                          key={c.id}
                          className="group p-4 hover:bg-slate-50 transition-all flex items-center justify-between"
                        >
                          <div className="flex items-center gap-4 flex-1">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
                               {new Date(c.startedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                            <div className="min-w-0">
                               <p className="text-sm font-bold text-[#1b1b1b] truncate">
                                 Suspeita de {c.doctorNotes?.substring(0, 20) || 'Dengue'}...
                               </p>
                               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                                 SOAP Gerado com Sucesso
                               </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                             <Button 
                               variant="outline" 
                               size="sm"
                               className="h-8 rounded-full border-slate-200 text-[#512B81] hover:bg-[#512B81] hover:text-white transition-all text-[10px] font-black uppercase px-4 ring-offset-background"
                               onClick={() => {
                                 navigator.clipboard.writeText(c.doctorNotes || '');
                                 toast.success('SOAP copiado!');
                               }}
                             >
                                <Copy className="w-3 h-3 mr-1.5" />
                                Copiar
                             </Button>
                             <div 
                               className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center cursor-pointer hover:bg-slate-900 group/icon transition-all"
                               onClick={() => navigate(`/consultation/${c.id}`)}
                             >
                               <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover/icon:text-white" />
                             </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
              </Card>
            </div>

            {/* Quick protocols (2/5) */}
            <div className="lg:col-span-2 space-y-3">
              <h3 className="text-[11px] font-black text-[#1b1b1b] uppercase tracking-widest flex items-center gap-2 px-1">
                <span className="w-3.5 h-3.5 rounded-full bg-[#512B81]/10 flex items-center justify-center">
                   <div className="w-1.5 h-1.5 rounded-full bg-[#512B81]" />
                </span>
                Protocolos de Emergência
              </h3>

              <div className="grid grid-cols-1 gap-2">
                {PROTOCOLS.map((p, i) => (
                  <motion.button
                    key={p.name}
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + i * 0.07 }}
                    whileHover={{ x: 4 }}
                    onClick={() => toast.info(`Protocolo ${p.name} acessado.`)}
                    className="flex items-center justify-between p-3.5 bg-white rounded-2xl border border-slate-100 shadow-sm text-left group transition-all hover:shadow-md"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center bg-slate-50 border border-slate-100 group-hover:bg-white transition-colors"
                      >
                        <p.icon className="w-4 h-4" style={{ color: p.accent }} strokeWidth={2.5} />
                      </div>
                      <span className="font-bold text-sm text-[#1b1b1b]">{p.name}</span>
                    </div>
                    <ArrowRight
                      className="w-4 h-4 text-slate-300 group-hover:text-[#512B81] group-hover:translate-x-0.5 transition-all"
                    />
                  </motion.button>
                ))}
              </div>

              <div
                  className="relative p-[1px] rounded-2xl overflow-hidden cursor-pointer group border border-slate-200 bg-white"
                  onClick={() => navigate('/protocols')}
                >
                  <div className="p-6">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                      Biblioteca Clínica
                    </p>
                    <h4 className="text-lg font-semibold text-slate-900 mb-4 leading-tight">
                      Todos os protocolos
                    </h4>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full px-5 border-slate-200 text-slate-900 hover:bg-slate-900 hover:text-white transition-all text-xs h-9"
                    >
                      Acessar Bases
                      <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal — Selecionar Plantão */}
      <Dialog open={isShiftModalOpen} onOpenChange={setIsShiftModalOpen}>
        <DialogContent className="sm:max-w-[400px] bg-white rounded-3xl border-0 shadow-2xl p-0 overflow-hidden">
          {/* Header stripe */}
          <div
            className="h-1.5"
            style={{ background: 'linear-gradient(90deg, #682bd7, #bd2e95)' }}
          />
          <div className="p-6">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-xl font-semibold text-slate-900">Iniciar Plantão</DialogTitle>
              <DialogDescription className="text-slate-500 text-sm">
                Selecione o plantão que você está começando agora:
              </DialogDescription>
            </DialogHeader>

            <div className="max-h-[280px] overflow-y-auto space-y-2 pr-1">
              {shifts.length === 0 ? (
                <div className="text-center p-8 text-[#918983] bg-[#faf9f7] rounded-2xl border border-[#e6ddd6]">
                  <Clock className="w-8 h-8 mx-auto mb-3 text-[#ddd6d0]" />
                  Nenhum plantão cadastrado.
                  <br />
                  <span className="text-[11px]">Adicione um no menu Financeiro.</span>
                </div>
              ) : (
                shifts.map((shift) => (
                    <div
                      key={shift.id}
                      onClick={() => confirmStartShift(shift.id)}
                      className="p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-900 group cursor-pointer transition-all flex justify-between items-center"
                    >
                      <div>
                        <p className="font-semibold text-slate-900 group-hover:text-slate-900 transition-colors">
                          {shift.location}
                        </p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          {new Date(shift.date).toLocaleDateString('pt-BR')} · {shift.status.toUpperCase()}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-900 transition-colors" />
                    </div>
                ))
              )}
            </div>

            <div className="mt-5 pt-4 border-t border-[#e6ddd6] flex justify-between">
              <Button variant="ghost" onClick={() => setIsShiftModalOpen(false)} className="text-[#918983]">
                Cancelar
              </Button>
              <Button
                variant="outline"
                onClick={() => { setIsShiftModalOpen(false); navigate('/plantoes'); }}
                className="border-[#ddd6d0] text-[#5b3629] hover:bg-[#faf9f7]"
              >
                Novo Plantão
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <BuyAccessModal open={isBuyOpen} onClose={() => setIsBuyOpen(false)} />
    </AppLayout>
  );
}
