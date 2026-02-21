import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mic, MicOff, ChevronLeft, Save,
  Brain, Pill, Activity,
  FileCheck, FileText,
  User, X,
  ChevronUp, Eye,
  Stethoscope,
  Sparkles,
  History, LayoutTemplate, ArrowRight,
  Send, FlaskConical, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Imports do Projeto
import { AppLayout } from '@/components/AppLayout';
import { useAppStore } from '@/stores/appStore';
import { getPatientInitials, cn } from '@/lib/utils';
import { useDeepgramNative as useDeepgram } from '@/hooks/useDeepgramNative';
import { useOpenAIAnalysis } from '@/hooks/useOpenAIAnalysis';
import { useSOAPGenerator } from '@/hooks/useSOAPGenerator';
import { useChatAI } from '@/hooks/useChatAI';
import { MemedPrescription } from '@/components/domain/prescription/MemedPrescription';
import { ExamRequestPanel } from '@/components/consultation/ExamRequestPanel';
import { AtestadoPanel } from '@/components/consultation/AtestadoPanel';

// UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';


// --- MOCK DATABASE: HISTÓRICO DO PACIENTE ---
const MOCK_HISTORY = [
  { id: 1, date: '15/10/2025', type: 'Retorno', cid: 'I10', diagnosis: 'Hipertensão Essencial', doctor: 'Dr. Silva', notes: 'PA controlada (120/80). Mantida medicação.' },
  { id: 2, date: '02/08/2025', type: 'Urgência', cid: 'J06.9', diagnosis: 'Infecção VAS', doctor: 'Dra. Ana', notes: 'Febre e coriza. Prescrito sintomáticos.' },
  { id: 3, date: '10/01/2025', type: 'Rotina', cid: 'Z00.0', diagnosis: 'Check-up Geral', doctor: 'Dr. Silva', notes: 'Exames normais. Orientado sobre dieta.' },
];

// --- MOCK DATABASE: TEMPLATES SOAP ---
const SOAP_TEMPLATES = [
  {
    id: 'ivas',
    name: 'IVAS / Gripe',
    category: 'Geral',
    content: {
      subjetivo: 'Paciente refere rinorreia hialina, obstrução nasal e tosse seca há 3 dias. Nega febre aferida. Nega dispneia.',
      objetivo: 'BEG, corado, hidratado, eupneico. Oroscopia: Hiperemia leve, sem exsudato. Otoscopia: Membranas íntegras e brilhantes. AR: MV+ s/ RA.',
      avaliacao: 'Infecção de Vias Aéreas Superiores (J06.9).',
      plano: 'Lavagem nasal com SF0.9%. Dipirona se dor/febre. Hidratação oral vigorosa. Sinais de alerta orientados.'
    }
  },
  {
    id: 'has',
    name: 'Hipertensão (Rotina)',
    category: 'Crônicos',
    content: {
      subjetivo: 'Paciente em seguimento de HAS. Nega cefaleia, tontura ou dor torácica. Refere boa adesão medicamentosa e dieta hipossódica.',
      objetivo: 'BEG. PA: 130/80 mmHg. FC: 72 bpm. Ritmo regular 2T sem sopros. Edema de MMII ausente.',
      avaliacao: 'Hipertensão Arterial Sistêmica controlada (I10).',
      plano: 'Manter Losartana 50mg 1x/dia. Solicitar exames de controle anual (Creatinina, Potássio, Glicemia). Retorno em 6 meses.'
    }
  },
  {
    id: 'lombalgia',
    name: 'Lombalgia Mecânica',
    category: 'Ortopedia',
    content: {
      subjetivo: 'Dor em região lombar baixa iniciada após esforço físico. Sem irradiação para MMII. Piora ao movimento.',
      objetivo: 'Dor à palpação de musculatura paravertebral lombar. Lasegue negativo bilateral. Reflexos preservados. Força motora preservada.',
      avaliacao: 'Lombalgia mecânica (M54.5).',
      plano: 'Analgesia escalonada. Repouso relativo por 2 dias. Calor local. Orientações posturais.'
    }
  }
];

// --- TIPOS ---
interface AICard {
  id: string;
  source: 'ai' | 'user';
  type?: 'alert' | 'suggestion' | 'diagnostic' | 'action' | 'interaction';
  title?: string;
  content: string;
  timestamp: string;
  actionLabel?: string;
  tags?: string[];
}

export function ConsultationPage() {
  const navigate = useNavigate();

  // Stores
  const selectedPatient = useAppStore(state => state.selectedPatient);
  const doctorName = useAppStore(state => state.doctorName);
  const updateTranscript = useAppStore(state => state.updateTranscript);
  const currentConsultation = useAppStore(state => state.currentConsultation);

  // Global States
  const [activeTab, setActiveTab] = useState('live');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [userQuery, setUserQuery] = useState('');
  const [feedCards, setFeedCards] = useState<AICard[]>([]);
  const [minimizedCards, setMinimizedCards] = useState<Set<string>>(new Set());

  // Deepgram Integration (Simplified - No diarization, focus on AI insights)
  const onTranscript = useCallback((transcript: string, isFinal: boolean, _speakerId?: number, confidence?: number) => {
    console.log('📝 Deepgram transcript:', { transcript, isFinal, confidence });

    // Simple append to transcript - no speaker detection
    if (isFinal && transcript.trim()) {
      const current = useAppStore.getState().currentConsultation?.transcript || '';
      const newTranscript = current ? current + ' ' + transcript : transcript;
      updateTranscript(newTranscript);
      console.log('✅ Transcript updated:', newTranscript);
    }
  }, [updateTranscript]);

  const { connect, disconnect, isListening, error: deepgramError } = useDeepgram({
    onTranscript
  });

  // AI Analysis (Real-time insights - faster and smarter)
  const { insights } = useOpenAIAnalysis({
    transcript: currentConsultation?.transcript || '',
    analysisInterval: 10000, // Analyze every 10 seconds for faster insights
    minTranscriptLength: 30, // Start analyzing with less text
    enabled: isListening, // Only analyze while recording
  });

  // SOAP Generator
  const { generateSOAP, isGenerating: isGeneratingSOAP } = useSOAPGenerator();

  // Chat AI (Assistente Contextual)
  const { askAI, isProcessing: isChatProcessing } = useChatAI({
    transcript: currentConsultation?.transcript || '',
    insights: insights,
    patientName: selectedPatient?.name,
    patientAge: selectedPatient?.age,
  });

  // UI Toggles (Modals/Drawers)
  const [showHistory, setShowHistory] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  // SOAP State
  const [doctorNotes, setDoctorNotes] = useState({
    subjetivo: '',
    objetivo: '',
    avaliacao: '',
    plano: ''
  });

  // Refs
  const feedEndRef = useRef<HTMLDivElement>(null);

  // --- EFEITOS ---
  useEffect(() => { setActiveTab('live'); }, []);

  // Exibir erro do Deepgram se houver
  useEffect(() => {
    if (deepgramError) {
      console.error('❌ Deepgram Error:', deepgramError);
      alert(`Erro Deepgram: ${deepgramError}`);
    }
  }, [deepgramError]);

  // Converter insights da IA para feedCards
  useEffect(() => {
    if (insights.length === 0) return;

    const newCards: AICard[] = insights.map(insight => ({
      id: insight.id,
      source: 'ai' as const,
      type: insight.type === 'alert' ? 'alert' :
        insight.type === 'suggestion' ? 'suggestion' :
          insight.type === 'diagnostic' ? 'diagnostic' : 'action',
      title: insight.title,
      content: insight.content,
      tags: insight.tags,
      timestamp: new Date(insight.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    }));

    setFeedCards(prev => {
      // Evitar duplicatas
      const existingIds = new Set(prev.map(c => c.id));
      const uniqueNew = newCards.filter(c => !existingIds.has(c.id));
      return [...prev, ...uniqueNew];
    });
  }, [insights]);

  useEffect(() => {
    let interval: number;
    if (isListening) interval = setInterval(() => setElapsedTime(prev => prev + 1), 1000) as unknown as number;
    return () => clearInterval(interval);
  }, [isListening]);

  const handleUserSubmit = async () => {
    if (!userQuery.trim() || isChatProcessing) return;

    const userMessage: AICard = {
      id: Date.now().toString(),
      source: 'user',
      content: userQuery,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    // Add user message to feed
    setFeedCards(prev => [...prev, userMessage]);

    const question = userQuery;
    setUserQuery(''); // Clear input immediately for better UX

    // Add loading indicator
    const loadingId = `loading-${Date.now()}`;
    const loadingCard: AICard = {
      id: loadingId,
      source: 'ai',
      type: 'suggestion',
      title: 'Pensando...',
      content: '🤔 Analisando sua pergunta com base no contexto da consulta...',
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    setFeedCards(prev => [...prev, loadingCard]);

    try {
      // Ask AI with full context
      const response = await askAI(question);

      // Remove loading indicator
      setFeedCards(prev => prev.filter(card => card.id !== loadingId));

      if (response) {
        // Add AI response
        const aiMessage: AICard = {
          id: Date.now().toString(),
          source: 'ai',
          type: 'suggestion',
          title: '💡 Assistente IA',
          content: response,
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        };

        setFeedCards(prev => [...prev, aiMessage]);

        // Auto-scroll to bottom
        setTimeout(() => {
          feedEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        // Error case
        setFeedCards(prev => [...prev, {
          id: Date.now().toString(),
          source: 'ai',
          type: 'alert',
          title: '⚠️ Erro',
          content: 'Não foi possível processar sua pergunta. Tente novamente.',
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        }]);
      }
    } catch (err) {
      // Remove loading and show error
      setFeedCards(prev => prev.filter(card => card.id !== loadingId));
      console.error('Erro ao processar pergunta:', err);
    }
  };

  const toggleCardMinimize = (id: string) => {
    setMinimizedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Função para Aplicar Template SOAP
  const applyTemplate = (templateId: string) => {
    const template = SOAP_TEMPLATES.find(t => t.id === templateId);
    if (template) {
      setDoctorNotes(template.content);
      setShowTemplates(false);
      // Feedback visual simples ou toast poderia ser adicionado aqui
    }
  };

  // Função para Gerar SOAP com IA
  const handleGenerateSOAP = async () => {
    const transcript = currentConsultation?.transcript;

    if (!transcript || transcript.length < 50) {
      alert('❌ Transcrição muito curta. Continue a consulta antes de gerar o SOAP.');
      return;
    }

    try {
      const soapContent = await generateSOAP({
        transcript,
        patientName: selectedPatient?.name || 'Paciente',
        patientAge: selectedPatient?.age,
      });

      if (soapContent) {
        setDoctorNotes(soapContent);
        alert('✅ SOAP gerado com sucesso! Revise e edite conforme necessário.');
      }
    } catch (error) {
      console.error('Erro ao gerar SOAP:', error);
      alert('❌ Erro ao gerar SOAP. Verifique o console para mais detalhes.');
    }
  };

  const getCardStyles = (type?: AICard['type']) => {
    switch (type) {
      case 'alert':
        return {
          border: 'border-red-200',
          bg: 'bg-red-50',
          iconBg: 'bg-red-100',
          iconColor: 'text-red-700',
          icon: Activity,
          titleColor: 'text-red-700',
        };
      case 'suggestion':
        return {
          border: 'border-blue-200',
          bg: 'bg-blue-50',
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-700',
          icon: Sparkles,
          titleColor: 'text-blue-700',
        };
      case 'diagnostic':
        return {
          border: 'border-purple-200',
          bg: 'bg-purple-50',
          iconBg: 'bg-purple-100',
          iconColor: 'text-purple-700',
          icon: Stethoscope,
          titleColor: 'text-purple-700',
        };
      case 'action':
        return {
          border: 'border-green-200',
          bg: 'bg-green-50',
          iconBg: 'bg-green-100',
          iconColor: 'text-green-700',
          icon: Pill,
          titleColor: 'text-green-700',
        };
      default:
        return {
          border: 'border-gray-200',
          bg: 'bg-white',
          iconBg: 'bg-gray-100',
          iconColor: 'text-gray-600',
          icon: Activity,
          titleColor: 'text-gray-700',
        };
    }
  };

  // Redirecionar para worklist se não houver paciente selecionado
  useEffect(() => {
    if (!selectedPatient) {
      navigate('/worklist');
    }
  }, [selectedPatient, navigate]);

  if (!selectedPatient) return null;
  const initials = getPatientInitials(selectedPatient.name);

  return (
    <AppLayout>
      {/* CSS GLOBAL PRINT */}
      <style>{`
        @media print {
          @page { margin: 0; size: A4 portrait; }
          body * { visibility: hidden; }
          .printable-area, .printable-area * { visibility: visible; }
          .printable-area { position: fixed; left: 0; top: 0; width: 210mm; min-height: 297mm; background: white; z-index: 9999; padding: 20mm; margin: 0; }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="min-h-full flex flex-col font-sans space-y-4 md:space-y-6 pb-4 md:pb-0 print:block">

        {/* --- DRAWER/MODAL DE HISTÓRICO --- */}
        <AnimatePresence>
          {showHistory && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} onClick={() => setShowHistory(false)} className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm print:hidden" />
              <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="fixed right-0 top-0 bottom-0 w-[400px] bg-white shadow-2xl z-50 border-l border-gray-200 flex flex-col print:hidden">
                <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                  <h2 className="font-bold text-lg flex items-center gap-2"><History className="w-5 h-5 text-gray-600" /> Histórico Clínico</h2>
                  <Button variant="ghost" size="icon" onClick={() => setShowHistory(false)}><X className="w-5 h-5" /></Button>
                </div>
                <ScrollArea className="flex-1 p-5">
                  <div className="relative border-l-2 border-gray-200 ml-3 space-y-8">
                    {MOCK_HISTORY.map((visit) => (
                      <div key={visit.id} className="relative pl-6">
                        <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white bg-blue-500 shadow-sm"></div>
                        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="text-sm font-bold text-gray-900">{visit.date}</p>
                              <p className="text-xs text-gray-500 font-medium">{visit.type} &bull; {visit.doctor}</p>
                            </div>
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-100">{visit.cid}</Badge>
                          </div>
                          <p className="text-xs font-bold text-gray-700 mb-1">{visit.diagnosis}</p>
                          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{visit.notes}</p>
                          <Button variant="link" className="h-auto p-0 text-[10px] mt-2 text-blue-600 flex items-center gap-1">Ver Detalhes <ArrowRight className="w-3 h-3" /></Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* --- DRAWER/MODAL DE MODELOS (TEMPLATES) --- */}
        <AnimatePresence>
          {showTemplates && (
            <>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} onClick={() => setShowTemplates(false)} className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm print:hidden" />
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none print:hidden">
                <div className="bg-white rounded-2xl shadow-2xl w-[600px] max-h-[80vh] flex flex-col pointer-events-auto border border-gray-200">
                  <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-purple-50 to-white">
                    <div>
                      <h2 className="font-bold text-lg flex items-center gap-2 text-purple-900"><LayoutTemplate className="w-5 h-5 text-purple-600" /> Modelos de Prontuário</h2>
                      <p className="text-xs text-gray-500">Selecione um modelo para preencher o SOAP automaticamente.</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setShowTemplates(false)}><X className="w-5 h-5" /></Button>
                  </div>
                  <ScrollArea className="flex-1 p-5">
                    <div className="grid grid-cols-1 gap-3">
                      {SOAP_TEMPLATES.map((template) => (
                        <button key={template.id} onClick={() => applyTemplate(template.id)} className="flex items-start gap-4 p-4 rounded-xl border border-gray-200 hover:border-purple-400 hover:bg-purple-50/50 transition-all text-left group">
                          <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 font-bold">
                            {template.name.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between items-center">
                              <h3 className="font-bold text-gray-800 group-hover:text-purple-700">{template.name}</h3>
                              <Badge variant="secondary" className="text-[10px]">{template.category}</Badge>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                              S: {template.content.subjetivo.substring(0, 50)}...
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* --- HEADER PRINCIPAL --- */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex flex-col flex-1 space-y-4 print:space-y-0">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden font-sans print:hidden">
            <div className="bg-gradient-to-r from-[#450693] to-[#8C00FF] px-4 py-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Button variant="ghost" size="icon" onClick={() => navigate('/')} className="h-8 w-8 rounded-lg hover:bg-white/10 text-white/90"><ChevronLeft className="h-5 w-5" /></Button>
                  <Avatar className="h-9 w-9 border-2 border-white/40 shrink-0"><AvatarFallback className="bg-white/20 text-white font-bold text-sm backdrop-blur-sm">{initials}</AvatarFallback></Avatar>
                  <div className="flex-1 min-w-0"><h1 className="text-white font-bold text-base leading-tight truncate">{selectedPatient.name}</h1><p className="text-white/70 text-xs font-medium">{selectedPatient.age} anos</p></div>
                </div>
                <div className="flex items-center gap-3 self-end md:self-auto">
                  <div className={cn("flex items-center gap-2.5 px-4 py-2 rounded-xl transition-all", isListening ? "bg-white shadow-lg" : "bg-white/10 border border-white/20")}>
                    {isListening && <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span></span>}
                    <span className={cn("font-mono font-bold text-base tabular-nums tracking-wider", isListening ? "text-[#8C00FF]" : "text-white/80")}>{new Date(elapsedTime * 1000).toISOString().substr(14, 5)}</span>
                  </div>
                  <Button onClick={() => isListening ? disconnect() : connect()} className={cn("h-10 px-6 rounded-xl font-bold shadow-lg transition-all active:scale-[0.98]", isListening ? "bg-white text-[#8C00FF]" : "bg-white text-[#8C00FF]")}>{isListening ? <><MicOff className="w-4 h-4 mr-2" /><span className="hidden sm:inline">Pausar</span></> : <><Mic className="w-4 h-4 mr-2" /><span className="hidden sm:inline">Iniciar</span></>}</Button>
                </div>
              </div>
            </div>
            <div className="p-4 space-y-3">
              <ScrollArea className="w-full whitespace-nowrap pb-2 md:pb-0">
                <TabsList className="bg-gray-100 p-1.5 h-11 inline-flex w-auto md:w-full md:grid md:grid-cols-5 gap-1.5 rounded-xl">
                  {[
                    { id: 'live', icon: Activity, label: 'Consulta ao Vivo' },
                    { id: 'soap', icon: FileText, label: 'Prontuário SOAP' },
                    { id: 'atestado', icon: FileCheck, label: 'Atestado' },
                    { id: 'exames', icon: FlaskConical, label: 'Exames' },
                    { id: 'receita', icon: Pill, label: 'Receita' }
                  ].map(tab => (
                    <TabsTrigger key={tab.id} value={tab.id} className="data-[state=active]:bg-white data-[state=active]:text-[#8C00FF] data-[state=active]:shadow-sm text-gray-600 font-bold px-4 md:px-0">
                      <tab.icon className="h-4 w-4 mr-1.5 md:mr-2" /><span>{tab.label}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </ScrollArea>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex-1">
            <AnimatePresence>

              {/* --- TAB LIVE --- */}
              <TabsContent key="live" value="live" className="flex-1 m-0 outline-none data-[state=inactive]:hidden print:hidden">
                <div className="flex flex-col h-full gap-4">
                  {/* Stats Bar - Mobile Optimized */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 shadow-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                          <Brain className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-white/80 text-xs font-medium">Insights</p>
                          <p className="text-white text-2xl font-bold">{feedCards.filter(c => c.source === 'ai').length}</p>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 }}
                      className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 shadow-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                          <Activity className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-white/80 text-xs font-medium">Status</p>
                          <p className="text-white text-sm font-bold">{isListening ? 'Gravando' : 'Pausado'}</p>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-4 shadow-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                          <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-white/80 text-xs font-medium">IA</p>
                          <p className="text-white text-sm font-bold">Gemini 3</p>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-4 shadow-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-white/80 text-xs font-medium">Transcrição</p>
                          <p className="text-white text-sm font-bold">{currentConsultation?.transcript ? `${currentConsultation.transcript.length} chars` : '0 chars'}</p>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Main Hub - Enhanced Design */}
                  <Card className="flex-1 border-0 shadow-xl bg-gradient-to-br from-gray-50 via-white to-gray-50 rounded-2xl relative overflow-hidden flex flex-col">
                    {/* Decorative Background */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-purple-100/30 to-pink-100/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                    <CardHeader className="pb-4 px-4 md:px-6 pt-4 md:pt-6 border-b border-gray-100 bg-white/50 backdrop-blur-sm relative z-10">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                            <Brain className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                              Hub de Insights Médicos
                            </CardTitle>
                            <CardDescription className="text-xs mt-0.5 flex items-center gap-2">
                              {isListening ? (
                                <>
                                  <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                  </span>
                                  <span className="text-green-600 font-semibold">Analisando em tempo real</span>
                                </>
                              ) : (
                                <>
                                  <span className="h-2 w-2 rounded-full bg-gray-400"></span>
                                  <span className="text-gray-500">Aguardando início da consulta</span>
                                </>
                              )}
                            </CardDescription>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {feedCards.length > 0 && (
                            <>
                              <Badge className="bg-purple-100 text-purple-700 border-0 px-3 py-1.5 font-bold">
                                {feedCards.filter(c => c.source === 'ai').length} insights
                              </Badge>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setMinimizedCards(new Set(feedCards.map(c => c.id)))}
                                className="text-xs h-8 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                              >
                                <ChevronUp className="w-4 h-4 mr-1" />
                                Minimizar
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="flex-1 px-4 md:px-6 pb-24 md:pb-28 relative overflow-hidden">
                      <ScrollArea className="h-full">
                        <div className="py-4">
                          {feedCards.length === 0 && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="flex flex-col items-center justify-center h-[400px]"
                            >
                              <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                                <div className="relative w-24 h-24 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center shadow-lg">
                                  <Brain className="w-12 h-12 text-purple-500" />
                                </div>
                              </div>
                              <p className="font-bold text-xl text-gray-800 mb-2 mt-6">Aguardando Consulta</p>
                              <p className="text-sm text-gray-500 text-center max-w-md leading-relaxed">
                                Clique em <span className="font-bold text-purple-600">Iniciar</span> para começar a gravar.
                                A IA gerará insights, alertas críticos e sugestões em tempo real durante a consulta.
                              </p>
                              <div className="flex items-center gap-2 mt-6">
                                <div className="flex -space-x-2">
                                  <div className="w-8 h-8 rounded-full bg-red-100 border-2 border-white flex items-center justify-center">
                                    <Activity className="w-4 h-4 text-red-600" />
                                  </div>
                                  <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center">
                                    <Sparkles className="w-4 h-4 text-blue-600" />
                                  </div>
                                  <div className="w-8 h-8 rounded-full bg-purple-100 border-2 border-white flex items-center justify-center">
                                    <Stethoscope className="w-4 h-4 text-purple-600" />
                                  </div>
                                  <div className="w-8 h-8 rounded-full bg-green-100 border-2 border-white flex items-center justify-center">
                                    <Pill className="w-4 h-4 text-green-600" />
                                  </div>
                                </div>
                                <p className="text-xs text-gray-400">4 tipos de insights</p>
                              </div>
                            </motion.div>
                          )}

                          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                            <AnimatePresence mode="popLayout">
                              {feedCards.map((card) => {
                                const style = getCardStyles(card.type);
                                const isMinimized = minimizedCards.has(card.id);

                                if (card.source === 'user') {
                                  return (
                                    <motion.div
                                      key={card.id}
                                      layout
                                      initial={{ opacity: 0, y: 20 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, scale: 0.95 }}
                                      className="lg:col-span-2 xl:col-span-3"
                                    >
                                      <div className="flex justify-end gap-3 group">
                                        <div className="bg-gradient-to-r from-[#450693] to-[#6B00B8] text-white rounded-2xl rounded-tr-sm py-3 px-5 shadow-lg hover:shadow-xl transition-shadow max-w-[85%] md:max-w-[70%]">
                                          <p className="text-sm font-medium leading-relaxed">{card.content}</p>
                                          <p className="text-xs text-white/60 mt-2">{card.timestamp}</p>
                                        </div>
                                        <Avatar className="h-10 w-10 mt-1 border-2 border-white shadow-md ring-2 ring-purple-100">
                                          <AvatarFallback className="bg-gradient-to-br from-purple-100 to-pink-100 text-purple-700">
                                            <User className="w-5 h-5" />
                                          </AvatarFallback>
                                        </Avatar>
                                      </div>
                                    </motion.div>
                                  );
                                }

                                return (
                                  <motion.div
                                    key={card.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    whileHover={{ scale: isMinimized ? 1 : 1.02 }}
                                    className={cn(
                                      "transition-all",
                                      isMinimized && "lg:col-span-2 xl:col-span-3"
                                    )}
                                  >
                                    <Card className={cn(
                                      "border-2 relative overflow-hidden transition-all duration-300 hover:shadow-xl",
                                      style.border,
                                      style.bg,
                                      isMinimized ? "shadow-sm border-dashed bg-gray-50/50" : "shadow-lg"
                                    )}>
                                      <CardContent className={cn("p-4 relative", isMinimized && "py-3")}>
                                        {/* Icon indicator bar */}
                                        <div className={cn(
                                          "absolute top-0 left-0 right-0 h-1",
                                          card.type === 'alert' ? 'bg-gradient-to-r from-red-400 to-red-600' :
                                          card.type === 'suggestion' ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
                                          card.type === 'diagnostic' ? 'bg-gradient-to-r from-purple-400 to-purple-600' :
                                          'bg-gradient-to-r from-green-400 to-green-600'
                                        )} />

                                        <div className="flex items-start gap-3 mt-1">
                                          <div className={cn(
                                            "p-2.5 rounded-xl shadow-md shrink-0 transition-all",
                                            style.iconBg,
                                            isMinimized && "p-2 shadow-sm"
                                          )}>
                                            <style.icon className={cn(
                                              "transition-all",
                                              style.iconColor,
                                              isMinimized ? "w-4 h-4" : "w-5 h-5"
                                            )} />
                                          </div>

                                          <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2 mb-2">
                                              <div className="flex-1">
                                                <h4 className={cn(
                                                  "font-bold text-sm leading-tight",
                                                  style.titleColor
                                                )}>
                                                  {card.title || 'Insight Médico'}
                                                </h4>
                                                {!isMinimized && (
                                                  <p className="text-[10px] text-gray-400 mt-0.5 font-medium">
                                                    {card.timestamp}
                                                  </p>
                                                )}
                                              </div>
                                              <button
                                                onClick={() => toggleCardMinimize(card.id)}
                                                className="hover:bg-black/5 rounded-lg p-1.5 transition-colors text-gray-400 hover:text-gray-700 shrink-0"
                                              >
                                                {isMinimized ? (
                                                  <Eye className="w-4 h-4" />
                                                ) : (
                                                  <ChevronUp className="w-4 h-4" />
                                                )}
                                              </button>
                                            </div>

                                            <AnimatePresence>
                                              {!isMinimized && (
                                                <motion.div
                                                  initial={{ height: 0, opacity: 0 }}
                                                  animate={{ height: 'auto', opacity: 1 }}
                                                  exit={{ height: 0, opacity: 0 }}
                                                  transition={{ duration: 0.2 }}
                                                >
                                                  <p className="text-sm text-gray-700 font-medium leading-relaxed mb-3">
                                                    {card.content}
                                                  </p>
                                                  {card.tags && card.tags.length > 0 && (
                                                    <div className="flex flex-wrap gap-1.5">
                                                      {card.tags.map(tag => (
                                                        <Badge
                                                          key={tag}
                                                          variant="outline"
                                                          className={cn(
                                                            "border-2 font-semibold text-[10px] px-2 py-0.5",
                                                            style.iconColor
                                                          )}
                                                        >
                                                          {tag}
                                                        </Badge>
                                                      ))}
                                                    </div>
                                                  )}
                                                </motion.div>
                                              )}
                                              {isMinimized && (
                                                <p className="text-xs text-gray-400 italic truncate">
                                                  Clique para expandir
                                                </p>
                                              )}
                                            </AnimatePresence>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </motion.div>
                                );
                              })}
                            </AnimatePresence>
                            <div ref={feedEndRef} className="lg:col-span-2 xl:col-span-3" />
                          </div>
                        </div>
                      </ScrollArea>

                      {/* Chat Input - Sticky Bottom */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-white via-white to-transparent backdrop-blur-sm border-t border-gray-100">
                        <div className="max-w-4xl mx-auto">
                          <div className="relative flex items-center gap-2 bg-white rounded-2xl shadow-xl border-2 border-gray-100 p-1.5">
                            <Input
                              value={userQuery}
                              onChange={(e) => setUserQuery(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleUserSubmit()}
                              placeholder="Pergunte ao Copiloto sobre a consulta..."
                              className="flex-1 border-0 focus-visible:ring-0 h-11 text-sm bg-transparent px-4"
                            />
                            <Button
                              size="icon"
                              onClick={handleUserSubmit}
                              disabled={!userQuery.trim() || isChatProcessing}
                              className="h-11 w-11 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                            >
                              {isChatProcessing ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Send className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                          <p className="text-[10px] text-center text-gray-400 mt-2">
                            Powered by <span className="font-semibold text-purple-600">Gemini 3 Flash</span>
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Debug Info - Development Only */}
                  {process.env.NODE_ENV === 'development' && currentConsultation?.transcript && (
                    <Card className="border-2 border-dashed border-amber-200 bg-amber-50/50">
                      <CardContent className="p-3">
                        <p className="text-xs font-mono text-amber-800">
                          <span className="font-bold">Debug Transcript:</span> {currentConsultation.transcript.substring(0, 150)}
                          {currentConsultation.transcript.length > 150 && '...'}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              {/* --- TAB SOAP (PROFESSIONAL CLEAN DESIGN) --- */}
              <TabsContent key="soap" value="soap" className="flex-1 m-0 data-[state=inactive]:hidden print:hidden">
                <div className="flex flex-col h-full space-y-4">
                  {/* Clean Toolbar with Actions */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white px-4 py-3 rounded-xl border border-gray-200 shadow-sm sticky top-0 z-20">
                    <div className="flex items-center gap-4 w-full sm:w-auto overflow-x-auto">
                      <Badge variant="secondary" className="bg-purple-50 text-purple-700 hover:bg-purple-100 cursor-pointer border-purple-100"><Sparkles className="w-3 h-3 mr-1" /> IA Ativa</Badge>
                      <Separator orientation="vertical" className="h-6" />
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setShowHistory(true)} className="text-gray-600 text-xs h-7 hover:bg-blue-50 hover:text-blue-700 gap-1"><History className="w-3 h-3" /> Histórico</Button>
                        <Button variant="ghost" size="sm" onClick={() => setShowTemplates(true)} className="text-gray-600 text-xs h-7 hover:bg-purple-50 hover:text-purple-700 gap-1"><LayoutTemplate className="w-3 h-3" /> Modelos</Button>
                      </div>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Button
                        onClick={handleGenerateSOAP}
                        disabled={isGeneratingSOAP || !currentConsultation?.transcript}
                        variant="outline"
                        className="flex-1 sm:flex-none h-9 border-[#8C00FF] text-[#8C00FF] hover:bg-[#8C00FF] hover:text-white font-medium text-xs shadow-sm transition-all active:scale-95"
                      >
                        <Sparkles className="w-3.5 h-3.5 mr-2" />
                        {isGeneratingSOAP ? 'Gerando...' : 'Gerar SOAP com IA'}
                      </Button>
                      <Button className="flex-1 sm:flex-none h-9 bg-[#8C00FF] hover:bg-[#7a00df] text-white font-medium text-xs shadow-md transition-all active:scale-95">
                        <Save className="w-3.5 h-3.5 mr-2" /> Salvar Prontuário
                      </Button>
                    </div>
                  </div>

                  {/* Editor Area */}
                  <ScrollArea className="flex-1 h-[calc(100vh-280px)] pr-2">
                    <div className="space-y-5 pb-10 max-w-5xl mx-auto">
                      {[
                        { id: 'subjetivo', label: 'Subjetivo (Anamnese)', icon: User, macros: ['Nega Alergias', 'Dor Localizada', 'Sem febre'] },
                        { id: 'objetivo', label: 'Objetivo (Exame Físico)', icon: Stethoscope, macros: ['BEG', 'Corado', 'Hidratado', 'Ausculta Limpa'] },
                        { id: 'avaliacao', label: 'Avaliação (Diagnóstico)', icon: Activity, macros: [] },
                        { id: 'plano', label: 'Plano (Conduta)', icon: FileCheck, macros: ['Retorno SN', 'Sintomáticos', 'Repouso'] }
                      ].map((section) => (
                        <div key={section.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden group focus-within:ring-2 focus-within:ring-[#8C00FF]/20 transition-all">
                          <div className="px-4 py-2 bg-gray-50/50 border-b border-gray-100 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="p-1 bg-white border border-gray-200 rounded-md shadow-sm"><section.icon className="w-3.5 h-3.5 text-gray-500" /></div>
                              <span className="font-bold text-sm text-gray-700">{section.label}</span>
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              {section.macros.map(m => (
                                <button key={m} onClick={() => setDoctorNotes(prev => ({ ...prev, [section.id]: (prev as any)[section.id] + (prev as any)[section.id] ? `. ${m}` : m }))} className="text-[10px] bg-white border border-gray-200 px-2 py-1 rounded-full hover:border-[#8C00FF] hover:text-[#8C00FF] transition-colors font-medium shadow-sm">
                                  + {m}
                                </button>
                              ))}
                            </div>
                          </div>
                          <Textarea
                            className="w-full min-h-[100px] border-0 focus-visible:ring-0 resize-none p-4 text-sm leading-relaxed text-gray-800 bg-white placeholder:text-gray-300 font-medium"
                            placeholder={`Descreva o ${section.label.toLowerCase()}...`}
                            value={(doctorNotes as any)?.[section.id] || ''}
                            onChange={(e) => setDoctorNotes({ ...doctorNotes, [section.id]: e.target.value })}
                          />
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </TabsContent>

              {/* --- TAB ATESTADO --- */}
              <TabsContent key="atestado" value="atestado" className="flex-1 m-0 data-[state=inactive]:hidden print:block h-[calc(100vh-220px)] overflow-hidden">
                <AtestadoPanel
                  patientName={selectedPatient?.name}
                  doctorName={doctorName}
                  onAtestadoCreated={(data) => {
                    console.log('Atestado criado:', data);
                  }}
                />
              </TabsContent>

              {/* --- TAB EXAMES --- */}
              <TabsContent key="exames" value="exames" className="flex-1 m-0 data-[state=inactive]:hidden h-[calc(100vh-220px)] overflow-hidden">
                <ExamRequestPanel
                  patientName={selectedPatient?.name}
                  doctorName={doctorName}
                  onExamRequested={(examIds) => {
                    console.log('Exames solicitados:', examIds);
                  }}
                />
              </TabsContent>

              {/* --- TAB RECEITA --- */}
              <TabsContent key="receita" value="receita" className="flex-1 m-0 data-[state=inactive]:hidden h-[calc(100vh-220px)] overflow-hidden">
                <MemedPrescription />
              </TabsContent>

            </AnimatePresence>
          </motion.div>
        </Tabs>
      </div>
    </AppLayout>
  );
}