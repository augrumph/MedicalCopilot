import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  FileText,
  User,
  Mic,
  MicOff,
  Brain,
  Lightbulb,
  Pill,
  AlertTriangle,
  CheckCircle2,
  FileCheck,
  CheckCircle,
  Target,
  Heart,
  Clock,
  XCircle,
  Stethoscope,
  Activity,
  Calendar
} from 'lucide-react';
import MedicationCard from '@/components/MedicationCard';
import { AppLayout } from '@/components/AppLayout';
import { AIChatPanel } from '@/components/consultation/AIChatPanel';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/stores/appStore';
import { generateClinicalNote } from '@/lib/mockApi';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, getPatientAvatar } from '@/lib/utils';
import { getContextConfig } from '@/lib/contextConfig';
import { PsychologyClinicalHypothesis } from '@/components/psychology/PsychologyClinicalHypothesis';
import { TherapeuticInterventions } from '@/components/psychology/TherapeuticInterventions';
import { SessionThemesAndGoals } from '@/components/psychology/SessionThemesAndGoals';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function ConsultationPage() {
  const navigate = useNavigate();
  const currentConsultation = useAppStore(state => state.currentConsultation);
  const selectedPatient = useAppStore(state => state.selectedPatient);
  const updateTranscript = useAppStore(state => state.updateTranscript);
  const setDoctorNotes = useAppStore(state => state.setDoctorNotes);
  const appContext = useAppStore(state => state.appContext);
  const config = getContextConfig(appContext);

  const [isListening, setIsListening] = useState(false);
  const [isGeneratingNote, setIsGeneratingNote] = useState(false);
  const [noteGenerated, setNoteGenerated] = useState(false);
  const [showNoteSection, setShowNoteSection] = useState(false);
  const [activeTab, setActiveTab] = useState<'ai' | 'diagnosis' | 'medication' | 'prescription' | 'themes' | 'interventions'>('ai');
  const [prescriptionGenerated, setPrescriptionGenerated] = useState(false);

  useEffect(() => {
    if (!isListening) return;

    const mockTranscriptParts = [
      'Paciente: Doutor, estou com dor de garganta há 3 dias.',
      'Médico: Entendi. A dor é constante ou piora em algum momento?',
      'Paciente: Piora quando engulo, principalmente pela manhã.',
      'Médico: Tem febre? Tosse?',
      'Paciente: Tive febre ontem à noite, 38 graus. Tosse não.',
      'Médico: Vou examinar sua garganta agora...',
      'Médico: Observo hiperemia e edema nas amígdalas. Sem placas visíveis.',
      'Paciente: É grave, doutor?',
      'Médico: Parece ser uma faringite. Vou prescrever um tratamento.',
    ];

    let partIndex = 0;
    const interval = setInterval(() => {
      if (partIndex < mockTranscriptParts.length) {
        const currentText = currentConsultation?.transcript || '';
        const newText = currentText
          ? `${currentText}\n${mockTranscriptParts[partIndex]}`
          : mockTranscriptParts[partIndex];
        updateTranscript(newText);
        partIndex++;
      } else {
        setIsListening(false);
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [isListening, currentConsultation?.transcript, updateTranscript]);

  const handleToggleListen = () => {
    setIsListening(!isListening);
  };

  const handleGenerateNote = async () => {
    if (!currentConsultation) return;

    setIsGeneratingNote(true);
    setNoteGenerated(false);
    try {
      const note = await generateClinicalNote();
      setDoctorNotes(note);
      setShowNoteSection(true);
      setNoteGenerated(true);

      setTimeout(() => {
        setNoteGenerated(false);
      }, 3000);
    } catch (error) {
      console.error('Erro ao gerar nota:', error);
    } finally {
      setIsGeneratingNote(false);
    }
  };


  if (!currentConsultation || !selectedPatient) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-8 max-w-md w-full"
          >
            <div className="flex justify-center">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-purple-600/30 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                <div className="relative h-32 w-32 rounded-full bg-gradient-to-br from-white to-gray-50 border-4 border-white shadow-2xl flex items-center justify-center transform group-hover:scale-105 transition-transform duration-300">
                  <User className="h-12 w-12 text-primary/80" />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-4xl font-bold tracking-tight text-gray-900">
                {appContext === 'psychology' ? 'Nenhuma Sessão Ativa' : 'Nenhuma Consulta Ativa'}
              </h2>
              <p className="text-gray-500 text-lg leading-relaxed">
                Para iniciar {appContext === 'psychology' ? 'uma sessão' : 'uma consulta'}, selecione um {config.patientLabel.toLowerCase()} na lista de {config.patientLabelPlural.toLowerCase()}.
              </p>
            </div>
            <Button
              onClick={() => navigate('/patients')}
              size="lg"
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-full px-8 h-12 text-base font-medium"
            >
              <User className="mr-2 h-5 w-5" />
              Ver {config.patientLabelPlural}
            </Button>
          </motion.div>
        </div>
      </AppLayout>
    );
  }

  const suggestedMedications = [
    {
      name: 'Paracetamol',
      concentration: '500 mg',
      form: 'comprimidos',
      via: 'VO (via oral)',
      dosage: '1 comprimido a cada 6 horas',
      duration: '5 dias',
      quantity: '20 comprimidos',
      quantityText: '20 (vinte) comprimidos',
      indication: 'Para dor e febre',
      type: 'primary' as const,
      isControlled: false,
      controlledType: null
    },
    {
      name: 'Ibuprofeno',
      concentration: '400 mg',
      form: 'comprimidos',
      via: 'VO (via oral)',
      dosage: '1 comprimido a cada 8 horas',
      duration: '3 a 5 dias',
      quantity: '15 comprimidos',
      quantityText: '15 (quinze) comprimidos',
      indication: 'Para dor e inflamação',
      type: 'alternative' as const,
      isControlled: false,
      controlledType: null
    },
    {
      name: 'Dipirona',
      concentration: '500 mg',
      form: 'comprimidos',
      via: 'VO (via oral)',
      dosage: '1 comprimido a cada 6 horas, se necessário',
      duration: 'Conforme necessário',
      quantity: '10 comprimidos',
      quantityText: '10 (dez) comprimidos',
      indication: 'Para alívio da dor',
      type: 'alternative' as const,
      isControlled: false,
      controlledType: null
    },
    {
      name: 'Loratadina',
      concentration: '10 mg',
      form: 'comprimidos',
      via: 'VO (via oral)',
      dosage: '1 comprimido por dia',
      duration: '5 dias',
      quantity: '5 comprimidos',
      quantityText: '5 (cinco) comprimidos',
      indication: 'Para sintomas alérgicos',
      type: 'optional' as const,
      isControlled: false,
      controlledType: null
    },
    {
      name: 'Diazepam',
      concentration: '5 mg',
      form: 'comprimidos',
      via: 'VO (via oral)',
      dosage: '1 comprimido a noite, conforme necessidade',
      duration: '7 dias',
      quantity: '10 comprimidos',
      quantityText: '10 (dez) comprimidos',
      indication: 'Ansiedade e espasmos musculares',
      type: 'controlled' as const,
      isControlled: true,
      controlledType: 'benzodiazepínico'
    }
  ];

  return (
    <AppLayout>
      <div className="flex flex-col h-full bg-gray-50/50">
        {/* Header Fixo com Glassmorphism Refinado */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-none z-20 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 shadow-sm"
        >
          <div className="w-full py-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate('/patients')}
                  className="h-10 w-10 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>

                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar className="h-12 w-12 border-2 border-white shadow-md">
                      <AvatarImage src={getPatientAvatar(selectedPatient?.name || '')} alt={selectedPatient?.name} className="object-cover" />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {selectedPatient?.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-green-500 border-2 border-white shadow-sm"></div>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-900 leading-tight tracking-tight">{selectedPatient?.name}</h1>
                    <div className="flex items-center gap-3 text-sm text-gray-500 mt-0.5">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        {selectedPatient?.age ? `${selectedPatient.age} anos` : ''}
                      </span>
                      <Separator orientation="vertical" className="h-3 bg-gray-300" />
                      <span>{selectedPatient?.gender || ''}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {!isListening && currentConsultation.transcript && !showNoteSection && (
                  <motion.div
                    initial={{ scale: 1 }}
                    animate={noteGenerated ? { scale: [1, 1.05, 1] } : { scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Button
                      onClick={handleGenerateNote}
                      disabled={isGeneratingNote}
                      size="sm"
                      className={cn(
                        "h-10 px-5 text-white shadow-md transition-all font-medium rounded-full",
                        noteGenerated
                          ? 'bg-green-600 hover:bg-green-700 ring-2 ring-green-200'
                          : 'bg-amber-500 hover:bg-amber-600 text-white ring-2 ring-amber-200'
                      )}
                    >
                      {isGeneratingNote ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="mr-2"
                          >
                            <FileText className="h-4 w-4" />
                          </motion.div>
                          Gerando Nota...
                        </>
                      ) : noteGenerated ? (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Nota Gerada
                        </>
                      ) : (
                        <>
                          <FileText className="mr-2 h-4 w-4" />
                          Gerar Nota Clínica
                        </>
                      )}
                    </Button>
                  </motion.div>
                )}

                <Button
                  onClick={handleToggleListen}
                  size="sm"
                  className={cn(
                    "h-10 px-6 shadow-md transition-all font-medium rounded-full",
                    isListening
                      ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse ring-4 ring-red-100'
                      : 'bg-primary hover:bg-primary/90 text-white ring-4 ring-primary/10'
                  )}
                >
                  {isListening ? (
                    <>
                      <MicOff className="mr-2 h-4 w-4" />
                      Parar Gravação
                    </>
                  ) : (
                    <>
                      <Mic className="mr-2 h-4 w-4" />
                      Iniciar Consulta
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Conteúdo Principal com Tabs Modernas */}
        <div className="flex-1 overflow-y-auto">
          <div className="h-full w-full py-6">
            <Tabs
              defaultValue="ai"
              value={activeTab}
              onValueChange={(val) => setActiveTab(val as any)}
              className="h-full flex flex-col gap-6"
            >
              <div className="flex-none">
                <TabsList className="w-full justify-start h-14 p-1.5 bg-white/50 backdrop-blur-sm border border-gray-200/60 rounded-2xl shadow-sm overflow-x-auto">
                  {[
                    { id: 'ai', label: 'Copilot IA', icon: Brain, description: 'Assistente em tempo real' },
                    ...(appContext === 'psychology' ? [
                      { id: 'summary', label: 'Resumo', icon: Clock, description: 'Pontos chave' },
                    ] : []),
                    { id: 'diagnosis', label: appContext === 'psychology' ? 'Hipóteses' : 'Diagnóstico', icon: Lightbulb, description: 'Análise clínica' },
                    ...(appContext === 'medical' ? [
                      { id: 'medication', label: 'Medicação', icon: Pill, description: 'Sugestões' },
                      { id: 'prescription', label: 'Receita', icon: FileCheck, description: 'Documentos' },
                    ] : []),
                    ...(appContext === 'psychology' ? [
                      { id: 'themes', label: 'Temas', icon: Target, description: 'Focos terapêuticos' },
                      { id: 'interventions', label: 'Intervenções', icon: Heart, description: 'Plano de ação' },
                    ] : []),
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <TabsTrigger
                        key={tab.id}
                        value={tab.id}
                        className={cn(
                          "flex-1 min-w-[140px] h-full rounded-xl transition-all duration-300 data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-md border border-transparent data-[state=active]:border-gray-100",
                          !isActive && "hover:bg-white/40 hover:text-gray-700"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "p-2 rounded-lg transition-colors",
                            isActive ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-500"
                          )}>
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="text-left">
                            <div className="font-semibold leading-none mb-1">{tab.label}</div>
                            <div className="text-[10px] text-gray-400 font-normal hidden sm:block">{tab.description}</div>
                          </div>
                        </div>
                      </TabsTrigger>
                    );
                  })}
                </TabsList>
              </div>

              <div className="flex-1 overflow-hidden relative rounded-3xl border border-gray-200 bg-white shadow-xl shadow-gray-100/50">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className="h-full"
                  >
                    <TabsContent value="ai" className="h-full m-0 p-0 border-0">
                      <AIChatPanel
                        transcript={currentConsultation.transcript || ''}
                        patientData={selectedPatient}
                        isActive={isListening}
                      />
                    </TabsContent>

                    <TabsContent value="medication" className="h-full m-0 overflow-auto">
                      <ScrollArea className="h-full">
                        <div className="p-6 sm:p-8">
                          <div className="flex items-center gap-4 mb-8">
                            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg shadow-pink-500/20 ring-4 ring-pink-50">
                              <Pill className="h-7 w-7 text-white" />
                            </div>
                            <div>
                              <h3 className="font-bold text-2xl text-gray-900">Medicação Sugerida</h3>
                              <p className="text-gray-500">Prescrições baseadas nas hipóteses diagnósticas e diretrizes atuais.</p>
                            </div>
                          </div>

                          <div className="grid gap-4">
                            {suggestedMedications.map((med, idx) => (
                              <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                              >
                                <MedicationCard med={med} idx={idx} />
                              </motion.div>
                            ))}

                            <Card className="border-0 bg-gradient-to-br from-blue-50 to-indigo-50/50 shadow-sm mt-6 overflow-hidden">
                              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                              <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                  <div className="h-10 w-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                                    <AlertTriangle className="h-5 w-5" />
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-gray-900 mb-3 text-lg">Orientações Importantes</h4>
                                    <ul className="grid sm:grid-cols-2 gap-3">
                                      <li className="flex items-center gap-2 text-sm text-gray-700 bg-white/60 p-2 rounded-lg">
                                        <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                                        <span>Verificar alergias medicamentosas</span>
                                      </li>
                                      <li className="flex items-center gap-2 text-sm text-gray-700 bg-white/60 p-2 rounded-lg">
                                        <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                                        <span>Orientar hidratação (2-3L/dia)</span>
                                      </li>
                                      <li className="flex items-center gap-2 text-sm text-gray-700 bg-white/60 p-2 rounded-lg">
                                        <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                                        <span>Repouso relativo</span>
                                      </li>
                                      <li className="flex items-center gap-2 text-sm text-gray-700 bg-white/60 p-2 rounded-lg">
                                        <XCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                                        <span>Retornar se piora em 3-5 dias</span>
                                      </li>
                                    </ul>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      </ScrollArea>
                    </TabsContent>

                    <TabsContent value="diagnosis" className="h-full m-0 overflow-auto">
                      <ScrollArea className="h-full">
                        <div className="p-6 sm:p-8">
                          {appContext === 'medical' ? (
                            <>
                              <div className="flex items-center gap-4 mb-8">
                                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20 ring-4 ring-amber-50">
                                  <Lightbulb className="h-7 w-7 text-white" />
                                </div>
                                <div>
                                  <h3 className="font-bold text-2xl text-gray-900">Hipóteses Diagnósticas</h3>
                                  <p className="text-gray-500">Análise diferencial baseada em evidências clínicas.</p>
                                </div>
                              </div>

                              <div className="space-y-6">
                                <div className="flex items-center gap-2 mb-4">
                                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 px-3 py-1">
                                    <Target className="h-3 w-3 mr-1" />
                                    Diagnóstico Principal
                                  </Badge>
                                </div>

                                <Card className="border-0 ring-1 ring-green-100 bg-gradient-to-br from-green-50/50 to-emerald-50/30 shadow-lg hover:shadow-xl transition-all duration-300">
                                  <CardContent className="p-6">
                                    <div className="flex items-start justify-between mb-6">
                                      <div className="flex items-center gap-4">
                                        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/20 text-white">
                                          <Stethoscope className="h-8 w-8" />
                                        </div>
                                        <div>
                                          <h5 className="font-bold text-2xl text-gray-900">Faringite Viral Aguda</h5>
                                          <div className="flex items-center gap-2 mt-2">
                                            <Badge className="bg-green-500 hover:bg-green-600 text-white border-0 shadow-sm">Alta Probabilidade</Badge>
                                            <Badge variant="outline" className="text-blue-700 border-blue-200 bg-blue-50">Baixa Gravidade</Badge>
                                          </div>
                                        </div>
                                      </div>
                                      <div className="text-right">
                                        <div className="text-3xl font-bold text-green-600">92%</div>
                                        <div className="text-xs text-gray-500 font-medium uppercase tracking-wide">Confiança</div>
                                      </div>
                                    </div>

                                    <Separator className="my-6 bg-green-100" />

                                    <div className="grid md:grid-cols-2 gap-6">
                                      <div className="bg-white rounded-xl p-5 border border-green-100 shadow-sm">
                                        <h6 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                          <Activity className="h-4 w-4 text-green-600" />
                                          Evidências Clínicas
                                        </h6>
                                        <ul className="space-y-2">
                                          <li className="flex items-center gap-2 text-sm text-gray-600">
                                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                                            <span>Hiperemia e edema faríngeo</span>
                                          </li>
                                          <li className="flex items-center gap-2 text-sm text-gray-600">
                                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                                            <span>Ausência de exsudato purulento</span>
                                          </li>
                                          <li className="flex items-center gap-2 text-sm text-gray-600">
                                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                                            <span>Febre baixa associada</span>
                                          </li>
                                        </ul>
                                      </div>

                                      <div className="bg-white rounded-xl p-5 border border-green-100 shadow-sm">
                                        <h6 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                          <Brain className="h-4 w-4 text-green-600" />
                                          Raciocínio Clínico
                                        </h6>
                                        <p className="text-sm text-gray-600 leading-relaxed">
                                          O quadro clínico é consistente com etiologia viral. A ausência de placas e a presença de sintomas sistêmicos leves afastam a hipótese bacteriana primária.
                                        </p>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>
                            </>
                          ) : (
                            <PsychologyClinicalHypothesis patientName={selectedPatient?.name || ''} />
                          )}
                        </div>
                      </ScrollArea>
                    </TabsContent>

                    <TabsContent value="prescription" className="h-full m-0 overflow-auto">
                      <ScrollArea className="h-full">
                        <div className="p-6 sm:p-8">
                          <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-4">
                              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-700 flex items-center justify-center shadow-lg shadow-violet-600/20 ring-4 ring-violet-50">
                                <FileCheck className="h-7 w-7 text-white" />
                              </div>
                              <div>
                                <h3 className="font-bold text-2xl text-gray-900">Receita Médica</h3>
                                <p className="text-gray-500">Geração, assinatura digital e envio.</p>
                              </div>
                            </div>
                            {!prescriptionGenerated && (
                              <Button
                                onClick={() => setPrescriptionGenerated(true)}
                                className="bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-600/20 rounded-full px-6 h-11"
                              >
                                <FileCheck className="mr-2 h-4 w-4" />
                                Gerar Receita Digital
                              </Button>
                            )}
                          </div>

                          {!prescriptionGenerated ? (
                            <Card className="border-2 border-dashed border-gray-200 bg-gray-50/50">
                              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="h-20 w-20 rounded-full bg-white shadow-sm flex items-center justify-center mb-6 ring-8 ring-gray-100">
                                  <FileCheck className="h-10 w-10 text-gray-300" />
                                </div>
                                <h4 className="text-xl font-semibold text-gray-900 mb-2">Nenhuma receita gerada</h4>
                                <p className="text-gray-500 max-w-md mb-8 leading-relaxed">
                                  O sistema pode gerar uma receita automaticamente com base nas medicações sugeridas e aprovadas por você.
                                </p>
                                <Button
                                  variant="outline"
                                  onClick={() => setPrescriptionGenerated(true)}
                                  className="border-violet-200 text-violet-700 hover:bg-violet-50 hover:border-violet-300"
                                >
                                  Gerar Agora
                                </Button>
                              </CardContent>
                            </Card>
                          ) : (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3 }}
                            >
                              <Card className="border-0 shadow-2xl bg-white overflow-hidden max-w-3xl mx-auto ring-1 ring-gray-200">
                                <div className="h-3 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600"></div>
                                <CardContent className="p-12">
                                  <div className="text-center py-12">
                                    <div className="h-16 w-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                      <CheckCircle2 className="h-8 w-8" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Receita Gerada com Sucesso</h3>
                                    <p className="text-gray-500 mb-8">A receita foi assinada digitalmente e está pronta para envio.</p>

                                    <div className="flex justify-center gap-4">
                                      <Button variant="outline" className="w-40">Visualizar PDF</Button>
                                      <Button className="w-40 bg-violet-600 hover:bg-violet-700">Enviar por SMS</Button>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </motion.div>
                          )}
                        </div>
                      </ScrollArea>
                    </TabsContent>

                    {appContext === 'psychology' && (
                      <>
                        <TabsContent value="summary" className="h-full m-0 overflow-auto">
                          <ScrollArea className="h-full"><div className="p-8">Resumo da Sessão...</div></ScrollArea>
                        </TabsContent>
                        <TabsContent value="themes" className="h-full m-0 overflow-auto">
                          <ScrollArea className="h-full"><div className="p-8"><SessionThemesAndGoals patientName={selectedPatient?.name || ''} /></div></ScrollArea>
                        </TabsContent>
                        <TabsContent value="interventions" className="h-full m-0 overflow-auto">
                          <ScrollArea className="h-full"><div className="p-8"><TherapeuticInterventions patientName={selectedPatient?.name || ''} /></div></ScrollArea>
                        </TabsContent>
                      </>
                    )}

                  </motion.div>
                </AnimatePresence>
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

