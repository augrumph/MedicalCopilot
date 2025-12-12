import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Mic, MicOff, ChevronLeft, Save,
  Brain, Pill, Activity,
  Plus,
  Send, FileCheck, FileText,
  User, X,
  ChevronUp, Eye,
  QrCode, ShieldCheck, FileSignature,
  Search, AlertTriangle, Printer,
  Edit3, Trash2, Stethoscope, 
  Sparkles, Lock, Clock, Baby,
  History, LayoutTemplate, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Imports do Projeto
import { AppLayout } from '@/components/AppLayout';
import { useAppStore } from '@/stores/appStore';
import { getPatientInitials, cn } from '@/lib/utils';

// UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

// --- MOCK DATABASE: MEDICAMENTOS ---
const MOCK_DRUG_DB = [
  { name: 'Dipirona Monohidratada 500mg', lab: 'Medley', type: 'Comprimido', group: 'Analgésico', alert: true, msg: 'Paciente alérgico a Dipirona' },
  { name: 'Paracetamol 750mg', lab: 'Tylenol', type: 'Comprimido', group: 'Analgésico', alert: false },
  { name: 'Amoxicilina 500mg', lab: 'Eurofarma', type: 'Cápsula', group: 'Antibiótico', alert: false },
  { name: 'Prednisolona 20mg', lab: 'Medley', type: 'Comprimido', group: 'Corticóide', alert: false },
  { name: 'Loratadina 10mg', lab: 'Cimed', type: 'Comprimido', group: 'Antialérgico', alert: false },
  { name: 'Losartana 50mg', lab: 'EMS', type: 'Comprimido', group: 'Anti-hipertensivo', alert: false },
];

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
  const [isListening, setIsListening] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [userQuery, setUserQuery] = useState('');
  const [feedCards, setFeedCards] = useState<AICard[]>([]);
  const [minimizedCards, setMinimizedCards] = useState<Set<string>>(new Set());

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

  // Atestado State
  const [atestadoData, setAtestadoData] = useState({
    dias: '3',
    cid: 'J03.0',
    exibirCid: false,
    tipo: 'afastamento' as 'afastamento' | 'comparecimento' | 'acompanhamento',
    local: 'São Paulo',
    data: new Date().toLocaleDateString('pt-BR'),
    textoLivre: '',
    periodo: 'Manhã' as 'Manhã' | 'Tarde' | 'Integral'
  });

  // Receita State
  const [memedSearch, setMemedSearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [prescricaoMemed, setPrescricaoMemed] = useState<any[]>([]);

  // Refs
  const feedEndRef = useRef<HTMLDivElement>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);

  // --- EFEITOS ---
  useEffect(() => { setActiveTab('live'); }, []);

  useEffect(() => {
    let interval: number;
    if (isListening) interval = setInterval(() => setElapsedTime(prev => prev + 1), 1000) as unknown as number;
    return () => clearInterval(interval);
  }, [isListening]);

  // Atestado Logic
  useEffect(() => {
    const nome = selectedPatient?.name?.toUpperCase() || 'PACIENTE';
    const doc = "RG: 00.000.000-0";
    let texto = "";

    if (atestadoData.tipo === 'afastamento') {
      const diasTexto = atestadoData.dias === '1' ? '01 (um) dia' : `0${atestadoData.dias} dias`;
      texto = `Atesto para os devidos fins, a pedido do interessado e sob minha responsabilidade médica, que o(a) Sr(a). ${nome}, portador(a) do ${doc}, foi atendido(a) nesta data e necessita de ${diasTexto} de afastamento de suas atividades laborais e escolares, a partir de hoje, por motivo de saúde${atestadoData.exibirCid ? ` (CID-10 ${atestadoData.cid})` : ''}.`;
    } else if (atestadoData.tipo === 'comparecimento') {
      texto = `Declaro para fins de justificativa de horas que o(a) Sr(a). ${nome}, portador(a) do ${doc}, compareceu a este serviço médico nesta data, no período da ${atestadoData.periodo}, para realização de consulta e exames.`;
    } else {
      texto = `Atesto que o(a) Sr(a). RESPONSÁVEL LEGAL, portador(a) do CPF 000.000.000-00, compareceu a esta unidade na qualidade de acompanhante do paciente ${nome}, durante o período da ${atestadoData.periodo}.`;
    }
    setAtestadoData(prev => ({ ...prev, textoLivre: texto }));
  }, [atestadoData.dias, atestadoData.tipo, atestadoData.exibirCid, atestadoData.cid, atestadoData.periodo, selectedPatient]);

  // Simulação IA
  useEffect(() => {
    if (!isListening) return;
    const steps = [
      { time: 2000, transcript: "Médico: Bom dia. Me conte o que está sentindo.", card: null },
      { time: 5000, transcript: "Paciente: Estou com muita dor de garganta e febre.", card: { id: '1', source: 'ai', type: 'diagnostic', title: 'Hipótese Diagnóstica', content: 'Sintomas sugerem Amigdalite.', tags: ['CID-10 J03'], timestamp: '10:00' } as AICard },
      { time: 9000, transcript: "Médico: Alguma alergia?", card: null },
      { time: 12000, transcript: "Paciente: Alergia a Dipirona.", card: { id: '2', source: 'ai', type: 'alert', title: 'Alerta Crítico', content: 'Alergia a DIPIRONA detectada.', timestamp: '10:01' } as AICard }
    ];

    let timeouts: number[] = [];
    steps.forEach(step => {
      const t = setTimeout(() => {
        const current = useAppStore.getState().currentConsultation?.transcript || '';
        updateTranscript(current + '\n' + step.transcript);
        if (step.card) setFeedCards(prev => [...prev, step.card!]);
      }, step.time);
      timeouts.push(t);
    });
    return () => timeouts.forEach(clearTimeout);
  }, [isListening, updateTranscript]);

  const handleUserSubmit = () => {
    if (!userQuery.trim()) return;
    setFeedCards(prev => [...prev, { id: Date.now().toString(), source: 'user', content: userQuery, timestamp: '10:04' }]);
    setUserQuery('');
  };

  const handlePrint = () => window.print();

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

  const getCardStyles = () => { /* Mantido */ return { border: 'border-gray-200', bg: 'bg-white', iconBg: 'bg-gray-100', iconColor: 'text-gray-600', icon: Activity }; };

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
                  <Button onClick={() => setIsListening(!isListening)} className={cn("h-10 px-6 rounded-xl font-bold shadow-lg transition-all active:scale-[0.98]", isListening ? "bg-white text-[#8C00FF]" : "bg-white text-[#8C00FF]")}>{isListening ? <><MicOff className="w-4 h-4 mr-2" /><span className="hidden sm:inline">Pausar</span></> : <><Mic className="w-4 h-4 mr-2" /><span className="hidden sm:inline">Iniciar</span></>}</Button>
                </div>
              </div>
            </div>
            <div className="p-4 space-y-3">
              <ScrollArea className="w-full whitespace-nowrap pb-2 md:pb-0">
                <TabsList className="bg-gray-100 p-1.5 h-11 inline-flex w-auto md:w-full md:grid md:grid-cols-4 gap-1.5 rounded-xl">
                  {[{ id: 'live', icon: Activity, label: 'Consulta ao Vivo' }, { id: 'soap', icon: FileText, label: 'Prontuário SOAP' }, { id: 'atestado', icon: FileCheck, label: 'Atestado' }, { id: 'receita', icon: Pill, label: 'Receita' }].map(tab => (
                    <TabsTrigger key={tab.id} value={tab.id} className="data-[state=active]:bg-white data-[state=active]:text-[#8C00FF] data-[state=active]:shadow-sm text-gray-600 font-bold px-4 md:px-0">
                      <tab.icon className="h-4 w-4 mr-1.5 md:mr-2" /><span>{tab.label}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>
              </ScrollArea>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex-1">
            <AnimatePresence mode="wait">

              {/* --- TAB LIVE --- */}
              <TabsContent key="live" value="live" className="flex-1 m-0 outline-none data-[state=inactive]:hidden print:hidden">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 h-full">
                  <div className="lg:col-span-8 flex flex-col h-[500px] lg:h-full">
                    <Card className="flex-1 border-0 shadow-lg bg-white rounded-xl md:rounded-2xl relative overflow-hidden flex flex-col">
                      <CardHeader className="pb-3 md:pb-4 px-3 sm:px-4 md:px-6 pt-3 md:pt-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 md:gap-3"><div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center flex-shrink-0"><Brain className="h-4 w-4 text-purple-600" /></div><div><CardTitle className="text-base md:text-lg">Copiloto IA</CardTitle><CardDescription className="text-[11px] md:text-xs">Insights em tempo real</CardDescription></div></div>
                          {feedCards.length > 0 && <div className="flex gap-2"><Button size="sm" variant="ghost" onClick={() => setMinimizedCards(new Set(feedCards.map(c => c.id)))} className="text-xs h-7">Minimizar Tudo</Button></div>}
                        </div>
                      </CardHeader>
                      <CardContent className="flex-1 px-3 sm:px-4 md:px-6 pb-3 md:pb-6 relative"><ScrollArea className="h-full"><div className="pb-20">{feedCards.length === 0 && <div className="flex flex-col items-center justify-center h-[300px] text-gray-400 opacity-70"><Brain className="w-8 h-8 text-purple-600 mb-4" /><p className="font-semibold text-gray-600">Aguardando Conversa</p></div>}<div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4"><AnimatePresence mode="popLayout">{feedCards.map((card) => { const style = getCardStyles(); const isMinimized = minimizedCards.has(card.id); if (card.source === 'user') return (<motion.div key={card.id} layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="md:col-span-2"><div className="flex justify-end gap-3 group"><div className="bg-[#450693] text-white rounded-2xl rounded-tr-sm py-3 px-5 shadow-lg max-w-[80%]"><p className="text-sm font-medium">{card.content}</p></div><Avatar className="h-9 w-9 mt-1 border-2 border-white shadow-sm"><AvatarFallback className="bg-gray-200 text-gray-600"><User className="w-5 h-5" /></AvatarFallback></Avatar></div></motion.div>); return (<motion.div key={card.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className={cn("transition-all", isMinimized ? "md:col-span-2" : "")}><Card className={cn("border shadow-sm relative overflow-hidden transition-all duration-300", style.border, style.bg, isMinimized ? "shadow-none border-dashed bg-white/50" : "shadow-md")}><CardContent className={cn("p-3 relative", isMinimized ? "py-2" : "md:p-4")}><div className="flex items-start gap-3"><div className={cn("p-2 rounded-lg shadow-sm shrink-0 transition-all", style.iconBg, isMinimized ? "p-1.5 bg-transparent shadow-none" : "")}><style.icon className={cn("transition-all", style.iconColor, isMinimized ? "w-4 h-4" : "w-4 h-4")} /></div><div className="flex-1 min-w-0"><div className="flex items-center justify-between gap-2"><div className="flex items-center gap-2"><h4 className={cn("font-bold text-xs uppercase tracking-wide leading-tight", style.iconColor)}>{card.title || 'Insight'}</h4>{isMinimized && <span className="text-[10px] text-gray-400 italic font-medium truncate max-w-[200px]">Oculto</span>}</div><button onClick={() => toggleCardMinimize(card.id)} className="hover:bg-black/5 rounded p-1 transition-colors text-gray-400 hover:text-gray-600">{isMinimized ? <Eye className="w-3 h-3" /> : <ChevronUp className="w-4 h-4" />}</button></div><AnimatePresence>{!isMinimized && (<motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden"><p className="text-xs text-gray-800 font-medium leading-relaxed mb-2 mt-2">{card.content}</p>{card.tags && <div className="flex flex-wrap gap-1.5 mb-2">{card.tags.map(tag => <Badge key={tag} variant="outline" className={cn("bg-white border-0 shadow-sm text-[9px] px-1.5 py-0.5", style.iconColor)}>{tag}</Badge>)}</div>}</motion.div>)}</AnimatePresence></div></div></CardContent></Card></motion.div>); })}</AnimatePresence><div ref={feedEndRef} className="md:col-span-2" /></div></div></ScrollArea><div className="p-3 md:p-4 bg-white border-t border-gray-100 absolute bottom-0 left-0 right-0 z-10"><div className="relative flex items-center gap-2"><Input value={userQuery} onChange={(e) => setUserQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleUserSubmit()} placeholder="Pergunte ao Copiloto..." className="pl-4 h-11 rounded-xl shadow-sm bg-white" /><Button size="icon" onClick={handleUserSubmit} disabled={!userQuery.trim()} className="h-11 w-11 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 shadow-md text-white shrink-0"><Send className="w-4 h-4" /></Button></div></div></CardContent></Card>
                  </div>
                  <div className="lg:col-span-4 h-[300px] lg:h-full">
                    <Card className="h-full border-0 shadow-lg overflow-hidden flex flex-col bg-white rounded-xl md:rounded-2xl"><CardHeader className="pb-3 md:pb-4 px-3 sm:px-4 md:px-6 pt-3 md:pt-6"><div className="flex items-center justify-between"><div className="flex items-center gap-2 md:gap-3"><div className="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0"><Activity className="h-4 w-4 text-gray-600" /></div><CardTitle className="text-base md:text-lg">Transcrição</CardTitle></div><Badge variant="secondary" className="bg-green-100 text-green-700">Ao Vivo</Badge></div></CardHeader><CardContent className="flex-1 px-3 sm:px-4 md:px-6 pb-3 md:pb-6"><ScrollArea className="h-full"><div className="space-y-4">{currentConsultation?.transcript ? (currentConsultation.transcript.split('\n').map((line, idx) => { const isDoctor = line.startsWith('Médico:'); return (<div key={idx} className="relative pl-4 border-l-2 border-gray-200 pb-1"><div className={cn("absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white", isDoctor ? "bg-[#8C00FF]" : "bg-gray-400")} /><p className={cn("text-[10px] font-bold uppercase mb-0.5", isDoctor ? "text-[#8C00FF]" : "text-gray-500")}>{line.split(':')[0]}</p><p className="text-sm text-gray-700 leading-snug">{line.split(':').slice(1).join(':').trim()}</p></div>) })) : (<div className="flex flex-col items-center justify-center h-[200px] text-gray-300"><Activity className="w-8 h-8 mb-2 opacity-20" /><p className="text-xs">Aguardando áudio...</p></div>)}<div ref={transcriptEndRef} /></div></ScrollArea></CardContent></Card>
                  </div>
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
                    <Button className="w-full sm:w-auto h-9 bg-[#8C00FF] hover:bg-[#7a00df] text-white font-medium text-xs shadow-md transition-all active:scale-95">
                      <Save className="w-3.5 h-3.5 mr-2" /> Salvar Prontuário
                    </Button>
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
                <div className="flex h-full gap-6 p-2 relative">

                  {/* PAINEL CONFIG */}
                  <Card className="w-80 h-full border-gray-200 shadow-xl bg-white flex flex-col print:hidden">
                    <CardHeader className="pb-3 bg-gradient-to-r from-emerald-50 to-white border-b border-emerald-100">
                      <CardTitle className="text-sm font-bold flex items-center gap-2 text-emerald-900">
                        <FileSignature className="w-4 h-4 text-emerald-600" /> Configuração
                      </CardTitle>
                      <CardDescription className="text-[10px]">Em conformidade com CFM 1.658/02</CardDescription>
                    </CardHeader>

                    <ScrollArea className="flex-1">
                      <CardContent className="space-y-6 pt-6">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">Tipo de Documento</Label>
                          <div className="flex flex-col gap-2">
                            {[{ id: 'afastamento', label: 'Atestado Médico', sub: 'Abona faltas (Doença)', icon: Activity }, { id: 'comparecimento', label: 'Declaração', sub: 'Justifica horas (Exames)', icon: Clock }, { id: 'acompanhamento', label: 'Acompanhante', sub: 'Lei 13.257/16 (Filhos)', icon: Baby }].map(t => (
                              <button key={t.id} onClick={() => setAtestadoData({ ...atestadoData, tipo: t.id as any })} className={cn("flex items-start gap-3 p-3 rounded-xl border text-left transition-all hover:shadow-md", atestadoData.tipo === t.id ? "bg-emerald-50 border-emerald-500 ring-1 ring-emerald-500" : "bg-white border-gray-200 hover:border-emerald-300")}>
                                <div className={cn("mt-0.5 p-1.5 rounded-full", atestadoData.tipo === t.id ? "bg-emerald-200 text-emerald-800" : "bg-gray-100 text-gray-500")}><t.icon className="w-4 h-4" /></div>
                                <div><p className={cn("text-xs font-bold", atestadoData.tipo === t.id ? "text-emerald-900" : "text-gray-700")}>{t.label}</p><p className="text-[10px] text-gray-500 leading-tight">{t.sub}</p></div>
                              </button>
                            ))}
                          </div>
                        </div>

                        <Separator />

                        <AnimatePresence mode="wait">
                          {atestadoData.tipo === 'afastamento' && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-4 overflow-hidden">
                              <div className="space-y-2">
                                <Label className="text-[10px] font-bold text-gray-500 uppercase">Qtd. Dias</Label>
                                <div className="grid grid-cols-5 gap-1.5">
                                  {['1', '2', '3', '5', '7', '10', '14', '15', '21', '30'].map(d => (
                                    <button key={d} onClick={() => setAtestadoData({ ...atestadoData, dias: d })} className={cn("h-8 text-xs font-bold rounded border transition-all", atestadoData.dias === d ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-gray-600 hover:border-emerald-500")}>{d}</button>
                                  ))}
                                </div>
                              </div>
                              <div className="bg-amber-50 p-3 rounded-lg border border-amber-100 flex flex-col gap-2">
                                <div className="flex items-center justify-between"><span className="text-xs font-bold text-amber-900 flex items-center gap-1"><Lock className="w-3 h-3" /> Sigilo CID</span><Switch checked={atestadoData.exibirCid} onCheckedChange={(c) => setAtestadoData({ ...atestadoData, exibirCid: c })} className="data-[state=checked]:bg-amber-600" /></div>
                                {atestadoData.exibirCid && (<Input value={atestadoData.cid} onChange={(e) => setAtestadoData({ ...atestadoData, cid: e.target.value })} className="h-7 text-xs bg-white border-amber-200" />)}
                              </div>
                            </motion.div>
                          )}
                          {(atestadoData.tipo === 'comparecimento' || atestadoData.tipo === 'acompanhamento') && (
                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-4 overflow-hidden">
                              <div className="space-y-2">
                                <Label className="text-[10px] font-bold text-gray-500 uppercase">Período</Label>
                                <div className="flex bg-gray-100 p-1 rounded-lg">
                                  {['Manhã', 'Tarde', 'Integral'].map(p => (
                                    <button key={p} onClick={() => setAtestadoData({ ...atestadoData, periodo: p as any })} className={cn("flex-1 py-1.5 text-xs font-bold rounded-md transition-all", atestadoData.periodo === p ? "bg-white text-emerald-700 shadow-sm" : "text-gray-500")}>{p}</button>
                                  ))}
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </CardContent>
                    </ScrollArea>
                    <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-xl space-y-2">
                      <Button onClick={handlePrint} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200/50 rounded-lg h-11 font-bold text-xs flex items-center justify-center gap-2"><Printer className="w-4 h-4" /> Imprimir Documento</Button>
                      <div className="flex items-center justify-center gap-1.5 opacity-60"><ShieldCheck className="w-3 h-3 text-emerald-700" /><span className="text-[9px] font-bold text-gray-500">Assinatura Digital ICP-Brasil</span></div>
                    </div>
                  </Card>

                  {/* VISUALIZAÇÃO A4 */}
                  <div className="flex-1 bg-gray-200/50 rounded-r-xl border-l border-gray-300 flex justify-center overflow-y-auto p-8 print:p-0 print:absolute print:top-0 print:left-0 print:w-full print:bg-white print:border-none">
                    <div className="printable-area w-[210mm] min-h-[297mm] bg-white shadow-2xl relative flex flex-col p-[20mm] text-gray-900 transition-all print:shadow-none print:m-0">
                      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.03] z-0"><div className="w-[150mm] h-[150mm] border-[20px] border-gray-900 rounded-full flex items-center justify-center"><Activity className="w-64 h-64 text-gray-900" /></div></div>

                      <header className="border-b-4 border-gray-800 pb-6 mb-10 z-10 flex justify-between items-start">
                        <div><h2 className="font-serif text-3xl font-bold text-gray-900 tracking-tight">Dr. {doctorName || 'Médico Exemplo'}</h2><div className="flex gap-3 mt-2"><div className="bg-gray-100 px-2 py-0.5 rounded border border-gray-200 text-[10px] font-bold uppercase tracking-wide text-gray-600">CRM-SP 123.456</div><div className="bg-gray-100 px-2 py-0.5 rounded border border-gray-200 text-[10px] font-bold uppercase tracking-wide text-gray-600">RQE 45.092</div></div></div>
                        <div className="text-right"><h2 className="text-sm font-bold uppercase tracking-widest text-emerald-900">Medicina de Família</h2><p className="text-[10px] text-gray-500 mt-1">Rua da Saúde, 1000 - Sala 42<br />São Paulo - SP</p></div>
                      </header>

                      <div className="text-center mb-12 z-10">
                        <h2 className="text-4xl font-black uppercase tracking-[0.2em] text-gray-900 inline-block border-b-2 border-emerald-500 pb-2">{atestadoData.tipo === 'afastamento' ? 'Atestado Médico' : atestadoData.tipo === 'comparecimento' ? 'Declaração' : 'Atestado'}</h2>
                        <p className="text-[10px] text-gray-400 mt-2 font-mono uppercase tracking-widest">Documento Médico Legal</p>
                      </div>

                      <div className="flex-1 z-10 px-4 group relative">
                        <div className="absolute -left-8 top-0 opacity-0 group-hover:opacity-100 transition-opacity print:hidden"><div className="bg-emerald-50 text-emerald-700 p-2 rounded-lg shadow-sm"><Edit3 className="w-4 h-4" /></div></div>
                        <Textarea className="w-full h-full min-h-[400px] border-0 focus-visible:ring-0 p-0 text-xl leading-[2.5] text-justify font-serif resize-none bg-transparent selection:bg-emerald-100 text-gray-800" value={atestadoData.textoLivre} onChange={(e) => setAtestadoData({ ...atestadoData, textoLivre: e.target.value })} />
                        {atestadoData.exibirCid && atestadoData.tipo === 'afastamento' && (<div className="mt-8 flex justify-center"><div className="border-2 border-gray-900 px-8 py-3 bg-gray-50 print:bg-white relative"><span className="absolute -top-2.5 left-4 bg-white px-2 text-[10px] font-bold uppercase">Diagnóstico</span><p className="font-mono text-xl font-bold">CID-10: {atestadoData.cid}</p></div></div>)}
                      </div>

                      <footer className="mt-auto pt-10 border-t border-gray-300 z-10 flex items-end justify-between">
                        <div className="text-center"><div className="border border-gray-900 p-1 bg-white inline-block mb-2"><QrCode className="w-24 h-24 text-gray-900" /></div><p className="text-[8px] font-mono text-gray-500 uppercase">Autenticidade Verificável em:<br /><span className="font-bold">VALIDADOR.ITI.GOV.BR</span></p></div>
                        <div className="text-right"><div className="relative inline-block px-8 pb-2"><div className="absolute -top-10 -right-4 w-32 h-32 border-4 border-emerald-900/10 rounded-full flex items-center justify-center rotate-[-15deg] pointer-events-none"><span className="text-[10px] font-bold text-emerald-900/20 uppercase text-center leading-tight">Assinado<br />Digitalmente<br />ICP-Brasil</span></div><p className="font-script text-5xl text-blue-900 mb-2 rotate-[-2deg]">Dr. Medico Exemplo</p><div className="h-0.5 w-full bg-gray-900 mb-1"></div><p className="text-xs font-bold uppercase tracking-widest text-gray-900">Assinado Eletronicamente</p><p className="text-[10px] text-gray-500 mt-0.5">{atestadoData.local}, {new Date().toLocaleDateString()}</p></div></div>
                      </footer>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* --- TAB RECEITA --- */}
              <TabsContent key="receita" value="receita" className="flex-1 m-0 data-[state=inactive]:hidden print:block h-[calc(100vh-220px)] overflow-hidden">
                <div className="max-w-6xl mx-auto h-full flex flex-col bg-white rounded-t-xl shadow-2xl border border-gray-200 overflow-hidden relative print:shadow-none print:border-0 print:h-auto print:overflow-visible">
                  <div className="bg-[#00BFA5] h-14 px-6 flex items-center justify-between shrink-0 z-20 shadow-md print:hidden">
                    <div className="flex items-center gap-3"><div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center font-bold text-white text-lg">M</div><span className="font-bold text-white tracking-wide">Memed Prescrição</span></div>
                    <div className="flex items-center gap-4"><Badge variant="outline" className="text-white border-white/30 bg-white/10 text-xs hidden sm:flex gap-1"><ShieldCheck className="w-3 h-3" /> Ambiente Seguro</Badge><Button onClick={handlePrint} size="sm" className="h-8 bg-white text-[#00BFA5] hover:bg-teal-50 font-bold text-xs gap-2 shadow-sm border-0"><Printer className="w-3.5 h-3.5" /> Imprimir</Button></div>
                  </div>
                  <div className="flex-1 overflow-y-auto bg-gray-50 p-4 sm:p-8 relative printable-area print:bg-white print:p-0 print:overflow-visible">
                    <div className="relative z-10 mb-8 max-w-3xl mx-auto print:hidden">
                      <div className="relative group shadow-lg rounded-xl">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Search className="h-5 w-5 text-gray-400 group-focus-within:text-[#00BFA5] transition-colors" /></div>
                        <input type="text" placeholder="Buscar medicamento (ex: Dipirona, Amoxicilina)..." className="block w-full h-14 pl-12 pr-12 rounded-xl border-0 ring-1 ring-gray-200 focus:ring-2 focus:ring-[#00BFA5] bg-white text-gray-900 placeholder:text-gray-400 font-medium text-base shadow-sm transition-all" value={memedSearch} onChange={(e) => { setMemedSearch(e.target.value); setShowSuggestions(e.target.value.length > 0); }} />
                        {memedSearch && <button onClick={() => { setMemedSearch(''); setShowSuggestions(false); }} className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>}
                      </div>
                      <AnimatePresence>{showSuggestions && (<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-30 max-h-[400px] overflow-y-auto"><div className="px-4 py-2 bg-gray-50/50 border-b border-gray-100 text-[10px] font-bold text-gray-400 uppercase tracking-wider sticky top-0 backdrop-blur-sm">Medicamentos Encontrados</div>{MOCK_DRUG_DB.filter(d => d.name.toLowerCase().includes(memedSearch.toLowerCase())).map((drug, idx) => (<button key={idx} onClick={() => { setPrescricaoMemed([...prescricaoMemed, { id: Date.now(), ...drug, posologia: 'Uso conforme orientação médica.', quantidade: '1 cx' }]); setMemedSearch(''); setShowSuggestions(false); }} className="w-full text-left px-4 py-3.5 hover:bg-teal-50 flex items-center justify-between group border-b border-gray-50 last:border-0 transition-colors"><div><div className="flex items-center gap-2"><p className="font-bold text-gray-800 group-hover:text-[#00BFA5] text-sm">{drug.name}</p>{drug.alert && <Badge variant="destructive" className="h-4 text-[9px] px-1">Alergia</Badge>}</div><p className="text-xs text-gray-400 mt-0.5 flex gap-2"><span>{drug.lab}</span><span className="w-1 h-1 rounded-full bg-gray-300 self-center" /><span>{drug.group}</span></p></div><Plus className="w-5 h-5 text-gray-300 group-hover:text-[#00BFA5] transition-colors" /></button>))}</motion.div>)}</AnimatePresence>
                    </div>
                    <div className="hidden print:block border-b-2 border-gray-900 pb-6 mb-8"><div className="flex justify-between items-end"><div><h1 className="text-3xl font-bold uppercase tracking-wide text-gray-900">Receituário Médico</h1><p className="text-sm mt-2 text-gray-600">Dr. {doctorName || 'Médico Exemplo'} - CRM 12345</p></div><div className="text-right text-xs text-gray-500"><p>Emissão: {new Date().toLocaleDateString()}</p><p>Controle Especial</p></div></div></div>
                    <div className="space-y-4 max-w-4xl mx-auto print:max-w-none print:space-y-8">{prescricaoMemed.length === 0 ? (<div className="text-center py-20 border-2 border-dashed border-gray-200 rounded-2xl print:hidden bg-white/50"><div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4"><Pill className="w-10 h-10 text-gray-300" /></div><h3 className="text-gray-900 font-bold text-base">Sua prescrição está vazia</h3><p className="text-gray-500 text-sm mt-1">Utilize a busca acima para adicionar medicamentos.</p></div>) : (<AnimatePresence>{prescricaoMemed.map((item, idx) => (<motion.div layout key={item.id} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, height: 0 }} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 group hover:border-[#00BFA5] transition-all print:shadow-none print:border-0 print:border-b-2 print:border-gray-100 print:rounded-none print:p-0 print:pb-6 print:break-inside-avoid"><div className="flex items-start justify-between mb-4"><div className="flex items-center gap-4"><span className="w-8 h-8 rounded-lg bg-[#00BFA5]/10 text-[#00BFA5] flex items-center justify-center text-sm font-bold print:bg-gray-900 print:text-white print:rounded-full print:w-6 print:h-6 print:text-xs">{idx + 1}</span><div><h4 className="font-bold text-gray-900 text-xl tracking-tight">{item.name}</h4><p className="text-xs text-gray-400 font-medium mt-0.5 print:hidden">{item.lab} &bull; {item.type}</p></div></div><button onClick={() => setPrescricaoMemed(prescricaoMemed.filter(i => i.id !== item.id))} className="text-gray-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all print:hidden"><Trash2 className="w-5 h-5" /></button></div>{item.alert && (<div className="mb-4 bg-red-50 border border-red-100 rounded-lg p-3 flex items-start gap-3 print:border-black print:bg-white print:border-dashed"><AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" /><div><p className="text-sm font-bold text-red-800">Alerta de Segurança</p><p className="text-xs text-red-700">{item.msg || 'Interação medicamentosa detectada.'}</p></div></div>)}<div className="pl-12 grid grid-cols-1 md:grid-cols-12 gap-6 print:pl-10"><div className="md:col-span-8"><label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block print:hidden">Posologia / Instruções</label><textarea rows={2} value={item.posologia} onChange={(e) => { const l = [...prescricaoMemed]; l.find(i => i.id === item.id).posologia = e.target.value; setPrescricaoMemed(l); }} className="w-full text-base border border-gray-200 rounded-lg p-3 focus:border-[#00BFA5] focus:ring-1 focus:ring-[#00BFA5] focus:outline-none text-gray-700 bg-gray-50/50 print:border-none print:p-0 print:bg-transparent print:resize-none print:font-medium" /></div><div className="md:col-span-4"><label className="text-[10px] font-bold text-gray-400 uppercase mb-1 block print:hidden">Quantidade Total</label><input type="text" value={item.quantidade} onChange={(e) => { const l = [...prescricaoMemed]; l.find(i => i.id === item.id).quantidade = e.target.value; setPrescricaoMemed(l); }} className="w-full text-base border border-gray-200 rounded-lg p-3 focus:border-[#00BFA5] focus:ring-1 focus:ring-[#00BFA5] focus:outline-none text-gray-700 bg-gray-50/50 print:border-none print:p-0 print:bg-transparent print:text-right print:font-bold" /></div></div></motion.div>))}</AnimatePresence>)}</div>
                    <div className="hidden print:flex mt-20 pt-8 border-t border-gray-300 justify-between items-end"><div className="text-xs text-gray-500"><p>Paciente: {selectedPatient.name}</p><p>Prescrição Eletrônica</p></div><div className="text-center"><div className="h-0.5 w-64 bg-gray-900 mb-2"></div><p className="font-bold uppercase text-sm">Assinatura e Carimbo</p></div></div>
                  </div>
                </div>
              </TabsContent>

            </AnimatePresence>
          </motion.div>
        </Tabs>
      </div>
    </AppLayout>
  );
}