import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChevronLeft,
  Activity,
  FileText,
  User, X,
  Stethoscope,
  Sparkles,
  Loader2,
  Zap,
  ClipboardCheck,
  ChevronRight,
  AlertTriangle,
  Clock,
  Search,
  LayoutGrid,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { AppLayout } from '@/components/AppLayout';
import { useAppStore } from '@/stores/appStore';
import { cn } from '@/lib/utils';
import { useDeepgramNative as useDeepgram } from '@/hooks/useDeepgramNative';
import { useSOAPGenerator } from '@/hooks/useSOAPGenerator';
import { ProtocolPlayer } from '@/components/consultation/ProtocolPlayer';
import { useProtocolsStore } from '@/stores/protocolsStore';
import { DiscoveryPanel } from '@/components/consultation/DiscoveryPanel';
import { SupportPanel } from '@/components/consultation/SupportPanel';
import { useProtocolDiscovery } from '@/hooks/useProtocolDiscovery';
import { useTriageAnalysis } from '@/hooks/useTriageAnalysis';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';

type MobileTab = 'discovery' | 'support' | 'soap';

export function ConsultationPage() {
  const navigate = useNavigate();

  const selectedPatient  = useAppStore(state => state.selectedPatient);
  const currentConsultation = useAppStore(state => state.currentConsultation);

  const [elapsedTime, setElapsedTime] = useState(0);
  const [mobileTab, setMobileTab]     = useState<MobileTab>('discovery');

  const { connect, disconnect, isListening, error: deepgramError } = useDeepgram({
    onTranscript: (_transcript, _isFinal) => {},
  });

  const { generateSOAP, isGenerating: isGeneratingSOAP } = useSOAPGenerator();
  const { fetchProtocols, startProtocol, activeProtocol, resetProtocol } = useProtocolsStore();
  const [isProtocolPlayerOpen, setIsProtocolPlayerOpen] = useState(false);

  const {
    stage: discoveryStage,
    ranking,
    isProcessing: isDiscoveryProcessing,
    showAll,
    setShowAll,
    error: discoveryError,
    updateInitialRanking,
    setStage,
  } = useProtocolDiscovery();

  const { analysis: triageAnalysis, isProcessing: isTriageProcessing } = useTriageAnalysis();

  useEffect(() => {
    if (triageAnalysis) {
      updateInitialRanking(
        currentConsultation?.transcript || triageAnalysis.chiefComplaint || '',
        {
          age: triageAnalysis.patientAge,
          gender: triageAnalysis.patientSex === 'M' || triageAnalysis.patientSex === 'Masculino' ? 'M'
                : triageAnalysis.patientSex === 'F' || triageAnalysis.patientSex === 'Feminino' ? 'F'
                : '',
          vitalSigns: {
            pa:   triageAnalysis.vitalSigns?.pressaoArterial    ?? '',
            fc:   triageAnalysis.vitalSigns?.frequenciaCardiaca ?? '',
            sat:  triageAnalysis.vitalSigns?.saturacao          ?? '',
            temp: triageAnalysis.vitalSigns?.temperatura        ?? '',
          },
        }
      );
    }
  }, [triageAnalysis, currentConsultation?.transcript, updateInitialRanking]);

  const [doctorNotes, setDoctorNotes] = useState({
    subjetivo: '', objetivo: '', avaliacao: '', plano: '',
  });

  useEffect(() => { fetchProtocols(); }, [fetchProtocols]);
  useEffect(() => { if (activeProtocol) setIsProtocolPlayerOpen(true); }, [activeProtocol]);
  useEffect(() => { if (deepgramError) console.error('Deepgram:', deepgramError); }, [deepgramError]);

  useEffect(() => {
    let interval: number;
    if (isListening)
      interval = setInterval(() => setElapsedTime(p => p + 1), 1000) as unknown as number;
    return () => clearInterval(interval);
  }, [isListening]);

  useEffect(() => {
    if (!selectedPatient) {
      const t = setTimeout(() => {
        if (!useAppStore.getState().selectedPatient) navigate('/worklist');
      }, 1000);
      return () => clearTimeout(t);
    }
  }, [selectedPatient, navigate]);

  const handleGenerateSOAP = async () => {
    const transcript = currentConsultation?.transcript;
    if (!transcript && !doctorNotes.subjetivo) { alert('Transcrição ou notas necessárias.'); return; }
    try {
      const soap = await generateSOAP({
        transcript: transcript || '',
        patientName: selectedPatient?.name || 'Paciente',
        patientAge: selectedPatient?.age,
        activeProtocolTitle: activeProtocol?.title,
      });
      if (soap) setDoctorNotes(soap);
    } catch (e) { console.error(e); }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(
      `SUBJETIVO: ${doctorNotes.subjetivo}\nOBJETIVO: ${doctorNotes.objetivo}\nAVALIAÇÃO: ${doctorNotes.avaliacao}\nPLANO: ${doctorNotes.plano}`.trim()
    );
    alert('Prontuário copiado!');
  };

  if (!selectedPatient) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-[#512B81] mb-4" />
          <p className="text-slate-500 font-medium text-sm">Carregando consulta...</p>
        </div>
      </AppLayout>
    );
  }

  const mins = Math.floor(elapsedTime / 60).toString().padStart(2, '0');
  const secs = (elapsedTime % 60).toString().padStart(2, '0');
  const consultationTime  = `${mins}:${secs}`;
  const isConsultationActive = isListening;
  const handleToggleConsultation = () => (isListening ? disconnect() : connect());

  const steps = [
    { id: 'queixa',    label: 'Queixa',    active: discoveryStage === 'INITIAL' },
    { id: 'protocolo', label: 'Protocolo', active: discoveryStage === 'IDENTIFIED' || !!activeProtocol },
    { id: 'soap',      label: 'SOAP',      active: doctorNotes.subjetivo.length > 0 },
  ];

  const SOAP_SECTIONS = [
    { id: 'subjetivo', label: 'S', icon: User,        hint: 'Queixa principal e história do paciente' },
    { id: 'objetivo',  label: 'O', icon: Stethoscope, hint: 'Exame físico e dados objetivos'          },
    { id: 'avaliacao', label: 'A', icon: Activity,    hint: 'Hipótese diagnóstica e avaliação'        },
    { id: 'plano',     label: 'P', icon: FileText,     hint: 'Conduta, prescrições e orientações'     },
  ];

  const mobileTabs = [
    { id: 'discovery' as MobileTab, label: 'Queixa',    icon: Search      },
    { id: 'support'   as MobileTab, label: 'Protocolo', icon: LayoutGrid  },
    { id: 'soap'      as MobileTab, label: 'SOAP',      icon: FileText    },
  ];

  /* ─── Shared JSX ───────────────────────────────────────────────────── */

  const startProtocolHandler = (id: string) => {
    startProtocol(id);
    setIsProtocolPlayerOpen(true);
  };

  const discoveryPanelJSX = (
    <DiscoveryPanel
      stage={discoveryStage}
      ranking={ranking}
      isProcessing={isDiscoveryProcessing || isTriageProcessing}
      showAll={showAll}
      setShowAll={setShowAll}
      error={discoveryError}
      onStartProtocol={startProtocolHandler}
      updateInitialRanking={updateInitialRanking}
      setStage={setStage}
    />
  );

  const supportPanelJSX = (
    <SupportPanel ranking={ranking} onStartProtocol={startProtocolHandler} />
  );

  const soapContentJSX = (isMobile = false) => (
    <div className={cn('space-y-3', isMobile && 'pb-4')}>
      {/* SOAP header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#512B81]/5 border border-[#512B81]/10 flex items-center justify-center shrink-0">
            <FileText className="w-4 h-4 text-[#512B81]" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-[#1b1b1b] uppercase tracking-widest leading-none">Registro SOAP</h3>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter mt-0.5">Sincronização em tempo real</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleGenerateSOAP}
            disabled={isGeneratingSOAP}
            className="h-7 border-[#512B81]/30 text-[#512B81] hover:bg-[#512B81] hover:text-white px-3 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all"
          >
            {isGeneratingSOAP
              ? <Loader2 className="w-3 h-3 animate-spin mr-1" />
              : <Sparkles className="w-3 h-3 mr-1" />}
            Gerar com IA
          </Button>
          <Button
            size="sm"
            onClick={handleCopyToClipboard}
            className="h-7 bg-[#1b1b1b] text-white hover:bg-black px-3 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-lg shadow-[#1b1b1b]/10"
          >
            <ClipboardCheck className="w-3 h-3 mr-1" /> Copiar
          </Button>
        </div>
      </div>

      {/* SOAP grid */}
      <div className={cn(
        'grid gap-3',
        isMobile ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-2 xl:grid-cols-4',
      )}>
        {SOAP_SECTIONS.map(section => (
          <div key={section.id} className="relative group/soap">
            <div className="absolute left-3 top-2 flex items-center gap-1.5 px-1.5 py-0.5 rounded bg-slate-50 border border-slate-100 group-focus-within/soap:bg-[#512B81] group-focus-within/soap:border-[#512B81] transition-colors z-20">
              <section.icon className="w-2.5 h-2.5 text-slate-400 group-focus-within/soap:text-white transition-colors" />
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter group-focus-within/soap:text-white transition-colors">
                {section.label}
              </span>
            </div>
            <Textarea
              className={cn(
                'w-full rounded-xl border-slate-100 focus:border-[#512B81] bg-slate-50/30 pt-9 px-3 pb-3 text-[11px] leading-relaxed text-[#1b1b1b] focus:bg-white transition-all resize-none shadow-sm focus:ring-4 focus:ring-[#512B81]/5 group-hover/soap:border-slate-200 placeholder:text-slate-300 relative z-10',
                isMobile ? 'min-h-[120px]' : 'min-h-[88px]',
              )}
              placeholder={section.hint}
              value={(doctorNotes as any)[section.id] || ''}
              onChange={e => setDoctorNotes({ ...doctorNotes, [section.id]: e.target.value })}
            />
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="flex items-center justify-center gap-2 opacity-25 select-none">
        <AlertTriangle className="w-2.5 h-2.5 text-slate-400 shrink-0" />
        <p className="text-[8px] font-bold text-slate-400 uppercase tracking-[0.1em]">
          Apoio ao raciocínio clínico. A decisão final é de responsabilidade exclusiva do médico assistente.
        </p>
      </div>
    </div>
  );

  /* ─── Render ────────────────────────────────────────────────────────── */

  return (
    <AppLayout variant="fullscreen">
      <div className="flex flex-col h-full bg-white overflow-hidden font-sans selection:bg-[#512B81]/20">

        {/* ── HEADER ── */}
        <header className="shrink-0 bg-white border-b border-slate-100 px-3 sm:px-5 md:px-8 py-2.5 flex items-center justify-between gap-3 shadow-sm z-40">
          {/* Left: back + patient + progress */}
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/worklist')}
              className="h-8 w-8 shrink-0 rounded-full text-slate-400 hover:text-[#512B81] hover:bg-slate-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <div className="flex items-center gap-2 min-w-0">
              <h1 className="text-base sm:text-lg font-bold text-[#1b1b1b] tracking-tight truncate">
                Paciente #{selectedPatient.id.slice(-4).toUpperCase()}
              </h1>
              <Badge
                variant="outline"
                className="h-5 px-2 text-[9px] font-black border-slate-200 uppercase tracking-widest bg-slate-50 text-slate-500 shadow-sm shrink-0 hidden sm:flex"
              >
                {selectedPatient.gender} · {selectedPatient.age}a
              </Badge>
            </div>

            {/* Progress steps — hidden on small mobile */}
            <nav className="hidden md:flex items-center gap-1 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100 shrink-0">
              {steps.map((step, idx) => (
                <div key={step.id} className="flex items-center gap-1">
                  <span className={cn(
                    'text-[9px] font-black uppercase tracking-wider transition-all px-2 py-1 rounded-md',
                    step.active
                      ? 'text-white bg-[#512B81] shadow-lg shadow-[#512B81]/30'
                      : 'text-slate-400',
                  )}>
                    {step.label}
                  </span>
                  {idx < steps.length - 1 && (
                    <ChevronRight className="w-2.5 h-2.5 text-slate-200" />
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* Right: timer + CTA */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-slate-50 border border-slate-100">
              <Clock className={cn('w-3.5 h-3.5 text-[#512B81]', isListening && 'animate-pulse')} />
              <span className="text-[11px] font-bold text-[#1b1b1b] tabular-nums tracking-widest">
                {consultationTime}
              </span>
            </div>

            <Button
              onClick={handleToggleConsultation}
              size="sm"
              variant={isConsultationActive ? 'outline' : 'default'}
              className={cn(
                'h-9 px-3 sm:px-5 rounded-lg font-black transition-all active:scale-[0.98] text-[10px] uppercase tracking-widest',
                isConsultationActive
                  ? 'border-red-100 text-[#C60C31] bg-red-50 hover:bg-red-100'
                  : 'bg-[#1b1b1b] hover:bg-black text-white shadow-lg shadow-[#1b1b1b]/10 border-none',
              )}
            >
              {isConsultationActive ? 'Encerrar' : (
                <span className="hidden sm:inline">Iniciar Atendimento</span>
              )}
              {!isConsultationActive && (
                <span className="sm:hidden">Iniciar</span>
              )}
            </Button>
          </div>
        </header>

        {/* ── CONTENT ── */}
        <div className="flex-1 min-h-0 overflow-hidden flex flex-col">

          {/* Desktop layout (md+): side-by-side */}
          <div className="hidden md:flex flex-1 min-h-0 gap-4 lg:gap-5 px-4 md:px-6 lg:px-8 py-4 bg-slate-50/40">

            {/* Discovery panel — scrollable card */}
            <div className="flex-1 min-h-0 bg-white border border-slate-100 rounded-3xl shadow-lg shadow-purple-900/5 overflow-y-auto">
              <div className="w-full max-w-2xl mx-auto p-5 lg:p-7">
                {discoveryPanelJSX}
              </div>
            </div>

            {/* Support panel — scrollable column */}
            <div className="w-72 lg:w-80 xl:w-[340px] shrink-0 overflow-y-auto pb-2 space-y-0">
              {supportPanelJSX}
            </div>
          </div>

          {/* Mobile layout (< md): single tab */}
          <div className="md:hidden flex-1 min-h-0 overflow-y-auto bg-slate-50/40 px-3 py-3">
            <AnimatePresence mode="wait">
              {mobileTab === 'discovery' && (
                <motion.div
                  key="discovery"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                  className="bg-white border border-slate-100 rounded-3xl shadow-md p-5"
                >
                  {discoveryPanelJSX}
                </motion.div>
              )}
              {mobileTab === 'support' && (
                <motion.div
                  key="support"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                >
                  {supportPanelJSX}
                </motion.div>
              )}
              {mobileTab === 'soap' && (
                <motion.div
                  key="soap"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                  className="bg-white border border-slate-100 rounded-3xl shadow-md p-5"
                >
                  {soapContentJSX(true)}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── SOAP FOOTER — desktop only ── */}
        <footer className="hidden md:block shrink-0 bg-white border-t border-slate-100 px-4 md:px-6 lg:px-8 py-3 shadow-[0_-4px_24px_rgba(0,0,0,0.04)] z-40">
          <div className="max-w-[1400px] mx-auto">
            {soapContentJSX(false)}
          </div>
        </footer>

        {/* ── MOBILE BOTTOM TAB BAR ── */}
        <nav className="md:hidden shrink-0 bg-white border-t border-slate-100 flex z-40 shadow-[0_-2px_12px_rgba(0,0,0,0.06)]">
          {mobileTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setMobileTab(tab.id)}
              className={cn(
                'flex-1 flex flex-col items-center justify-center gap-1 py-2.5 text-[10px] font-black uppercase tracking-wider transition-all',
                mobileTab === tab.id
                  ? 'text-[#512B81] bg-purple-50/60'
                  : 'text-slate-400 hover:text-slate-600',
              )}
            >
              <tab.icon className={cn('h-5 w-5 transition-transform', mobileTab === tab.id && 'scale-110')} />
              {tab.label}
              {mobileTab === tab.id && (
                <div className="w-4 h-0.5 rounded-full bg-[#512B81] mt-0.5" />
              )}
            </button>
          ))}
        </nav>

        {/* ── PROTOCOL PLAYER DRAWER ── */}
        <AnimatePresence>
          {isProtocolPlayerOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsProtocolPlayerOpen(false)}
                className="fixed inset-0 bg-black/25 z-[60] backdrop-blur-[2px]"
              />

              {/* Drawer */}
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 28, stiffness: 200 }}
                className="fixed right-0 top-0 bottom-0 w-full sm:w-[520px] lg:w-[580px] bg-white shadow-2xl z-[70] flex flex-col border-l border-slate-200"
              >
                {/* Drawer header */}
                <div className="shrink-0 px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-white">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-[#512B81] flex items-center justify-center shadow-md shadow-[#512B81]/20">
                      <Zap className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Protocolo Ativo</p>
                      <h2 className="text-sm font-bold text-[#1b1b1b] leading-tight">
                        {activeProtocol?.title ?? 'Protocolo Clínico'}
                      </h2>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => { resetProtocol(); setIsProtocolPlayerOpen(false); }}
                    className="h-9 w-9 rounded-full text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Drawer content */}
                <ScrollArea className="flex-1">
                  <div className="p-5 lg:p-6">
                    <ProtocolPlayer />
                  </div>
                </ScrollArea>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}
