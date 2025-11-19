import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  FileText,
  Send,
  User,
  Stethoscope,
  Mic,
  MicOff,
  Play,
  Pause,
  Brain,
  Lightbulb,
  MessageSquare,
  Bell,
  Pill,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileCheck,
  Printer,
  Download,
  CheckCircle,
  AlertCircle,
  Target,
  Heart,
  Clock
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import PrescriptionQRCode from '@/components/PrescriptionQRCode';
import MedicationCard from '@/components/MedicationCard';
import ControlledMedicationCard from '@/components/ControlledMedicationCard';
import PrescriptionMedicationCard from '@/components/PrescriptionMedicationCard';
import { AppLayout } from '@/components/AppLayout';
import { PatientInfoPanel } from '@/components/consultation/PatientInfoPanel';
import { AIChatPanel } from '@/components/consultation/AIChatPanel';
import { SuggestedQuestionsPanel } from '@/components/consultation/SuggestedQuestionsPanel';
import { RemindersPanel } from '@/components/consultation/RemindersPanel';
import { ImprovedDiagnosisPanel } from '@/components/consultation/ImprovedDiagnosisPanel';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/stores/appStore';
import { generateClinicalNote, generatePatientSummary } from '@/lib/mockApi';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { getContextConfig } from '@/lib/contextConfig';
import { PsychologyClinicalHypothesis } from '@/components/psychology/PsychologyClinicalHypothesis';
import { TherapeuticInterventions } from '@/components/psychology/TherapeuticInterventions';
import { SessionThemesAndGoals } from '@/components/psychology/SessionThemesAndGoals';
import { PsychologySessionSummary } from '@/components/psychology/PsychologySessionSummary';
import { PsychologyPatientInfo } from '@/components/psychology/PsychologyPatientInfo';

export function ConsultationPage() {
  const navigate = useNavigate();
  const {
    currentConsultation,
    selectedPatient,
    updateTranscript,
    setDoctorNotes,
    setPatientSummary,
    finishConsultation,
    doctorName,
    doctorSpecialty,
    appContext,
  } = useAppStore();
  const config = getContextConfig(appContext);

  const [isListening, setIsListening] = useState(false);
  const [isGeneratingNote, setIsGeneratingNote] = useState(false);
  const [noteGenerated, setNoteGenerated] = useState(false);
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [showNoteSection, setShowNoteSection] = useState(false);
  const [editableNote, setEditableNote] = useState('');
  const [activeTab, setActiveTab] = useState<'ai' | 'diagnosis' | 'medication' | 'prescription' | 'themes' | 'interventions'>('ai');
  const [prescriptionGenerated, setPrescriptionGenerated] = useState(false);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [signatureModalType, setSignatureModalType] = useState<'normal' | 'controlled'>('normal');
  const [prescriptionType, setPrescriptionType] = useState<'both' | 'normal' | 'controlled'>('both');
  // Medicamentos personalizados da receita
  const [prescriptionMedications, setPrescriptionMedications] = useState<any[]>([]);
  const [crm, setCRM] = useState('123456');
  const [uf, setUF] = useState('SP');
  const [signatureType, setSignatureType] = useState<'icp-brasil-mock' | 'icp-brasil-a3' | 'icp-brasil-a1'>('icp-brasil-mock');
  const [signingInProgress, setSigningInProgress] = useState(false);

  // Simulação de transcrição em tempo real (usada apenas para alimentar a IA)
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
  }, [isListening]);

  const handleToggleListen = () => {
    setIsListening(!isListening);
  };

  const handleGenerateNote = async () => {
    if (!currentConsultation) return;

    setIsGeneratingNote(true);
    setNoteGenerated(false);
    try {
      const note = await generateClinicalNote(currentConsultation.id);
      setEditableNote(note);
      setDoctorNotes(note);
      setShowNoteSection(true);
      setNoteGenerated(true);

      // Reset success state after 3 seconds
      setTimeout(() => {
        setNoteGenerated(false);
      }, 3000);
    } catch (error) {
      console.error('Erro ao gerar nota:', error);
    } finally {
      setIsGeneratingNote(false);
    }
  };

  const handleGeneratePatientSummary = async () => {
    if (!currentConsultation) return;

    setIsGeneratingSummary(true);
    try {
      const summary = await generatePatientSummary(currentConsultation.id);
      setPatientSummary(summary);
    } catch (error) {
      console.error('Erro ao gerar resumo:', error);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const handleFinishConsultation = () => {
    if (editableNote) {
      finishConsultation(editableNote);
    }
    navigate('/dashboard');
  };

  // Se não houver consulta ativa, mostra tela vazia
  if (!currentConsultation || !selectedPatient) {
    return (
      <AppLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6 max-w-md"
          >
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#8C00FF] to-[#450693] rounded-full blur-2xl opacity-20 animate-pulse"></div>
                <div className="relative h-24 w-24 rounded-full bg-gradient-to-br from-[#8C00FF] to-[#450693] flex items-center justify-center shadow-xl">
                  <Stethoscope className="h-12 w-12 text-white" />
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-[#450693] to-[#8C00FF] bg-clip-text text-transparent">
                {appContext === 'psychology' ? 'Nenhuma Sessão Ativa' : 'Nenhuma Consulta Ativa'}
              </h2>
              <p className="text-gray-600 text-lg">
                Para iniciar {appContext === 'psychology' ? 'uma sessão' : 'uma consulta'}, selecione um {config.patientLabel.toLowerCase()} na lista de {config.patientLabelPlural.toLowerCase()}.
              </p>
            </div>
            <Button
              onClick={() => navigate('/patients')}
              size="lg"
              className="bg-gradient-to-r from-[#8C00FF] to-[#450693] text-white hover:opacity-90 shadow-lg hover:shadow-xl transition-all"
            >
              <User className="mr-2 h-5 w-5" />
              Ver {config.patientLabelPlural}
            </Button>
          </motion.div>
        </div>
      </AppLayout>
    );
  }

  const patientSummary = currentConsultation.patientSummary;

  // Medicações sugeridas
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
      type: 'primary',
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
      type: 'alternative',
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
      type: 'alternative',
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
      type: 'optional',
      isControlled: false,
      controlledType: null
    },
    // Exemplo de medicamento controlado
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
      type: 'controlled',
      isControlled: true,
      controlledType: 'benzodiazepínico'
    }
  ];

  const reminders = [
    'Avaliar sinais de alarme',
    'Verificar histórico de alergias',
    'Considerar gravidade do quadro',
    'Avaliar necessidade de antibiótico',
    'Recomendar repouso e hidratação',
    'Agendar retorno se necessário'
  ];

  const diagnosisData = {
    mostLikely: [
      {
        condition: 'Faringite viral aguda',
        explanation: 'Inflamação da faringe causada por vírus, sendo o quadro clínico consistente com sintomas virais como dor de garganta, febre baixa e ausência de sinais bacterianos.',
        scientificBasis: [
          'Dor de garganta + febre baixa + quadro viral típico, sem sinais bacterianos marcantes',
          'Score de Centor ≤2, com presença de tosse e ausência de linfonodos cervicais significativos',
          'Evolução autolimitada comuns em infecções virais respiratórias'
        ],
        references: [
          'UpToDate: Pharyngitis (Sore Throat) - Approach to the adult patient',
          'Medscape: Viral Pharyngitis Clinical Presentation',
          'Whitebook: Faringite Aguda - Diagnóstico e Tratamento'
        ],
        confirmatoryTests: [
          'Exame físico de orofaringe',
          'Swab rápido Streptococcus (se disponível)'
        ],
        exclusionCriteria: [
          'Ausência de exsudato tonsilar purulento',
          'Sem linfadenopatia cervical anterior palpável'
        ],
        probability: 'alta',
        severity: 'baixa',
        keyIndicators: ['Viral', 'Agudo', 'Não grave']
      },
      {
        condition: 'Amigdalite viral',
        explanation: 'Inflamação das amígdalas por vírus, com apresentação clínica similar à faringite viral, mas com envolvimento mais pronunciado das amígdalas.',
        scientificBasis: [
          'É a causa mais comum de faringoamigdalite (70-80%)',
          'Dor de garganta com início súbito e febre são achados comuns',
          'Sinais vírus são mais frequentes que bacterianos'
        ],
        confirmatoryTests: [
          'Exame físico: amígdalas hiperemiadas e edemaciadas sem exsudato',
          'Exclusão de achados bacterianos (ausência de placas)'
        ],
        exclusionCriteria: [
          'Ausência de placas exsudativas',
          'Ausência de linfadenopatia cervical significativa'
        ],
        probability: 'moderada',
        severity: 'baixa',
        keyIndicators: ['Viral', 'Amígdalas', 'Não grave']
      }
    ],
    possible: [
      {
        condition: 'Faringite bacteriana (Streptococcus pyogenes)',
        explanation: 'Infecção bacteriana causada pelo Streptococcus pyogenes (grupo A), que pode apresentar sintomas semelhantes aos virais, mas com maior gravidade.',
        scientificBasis: [
          'Responsável por 5-15% das faringoamigdalites em adultos',
          'Pode evoluir com complicações se não tratada adequadamente',
          'Score de Centor moderado (3-4) sugere possibilidade bacteriana'
        ],
        references: [
          'UpToDate: Group A streptococcal tonsillopharyngitis in adults',
          'Diretrizes SBP: Faringoamigdalite Estreptocócica',
          'Medscape: Streptococcal Pharyngitis Treatment & Management'
        ],
        confirmatoryTests: [
          'Teste rápido para Streptococcus A positivo',
          'Cultura de orofaringe positiva para Streptococcus A',
          'Exame físico com exsudato tonsilar'
        ],
        exclusionCriteria: [
          'Teste rápido negativo para Streptococcus A',
          'Ausência de linfadenopatia cervical anterior',
          'Presença de tosse e coriza'
        ],
        probability: 'baixa',
        severity: 'media',
        keyIndicators: ['Bacteriana', 'Tratamento', 'Febre']
      },
      {
        condition: 'Mononucleose infecciosa',
        explanation: 'Infecção viral sistêmica causada pelo vírus Epstein-Barr, podendo apresentar quadro clínico similar à faringite viral com sintomas sistêmicos mais proeminentes.',
        scientificBasis: [
          'Mais comum em adultos jovens e adolescentes',
          'Pode apresentar linfadenopatia generalizada',
          'Frequente associação com fadiga e mal-estar'
        ],
        confirmatoryTests: [
          'Teste heterófilo (Monoteste) positivo',
          'Sorologia para EBV positiva',
          'Hemograma: linfocitose atípica'
        ],
        exclusionCriteria: [
          'Ausência de linfadenopatia generalizada',
          'Ausência de esplenomegalia',
          'Quadro clínico não sistêmico'
        ],
        probability: 'baixa',
        severity: 'media',
        keyIndicators: ['Viral', 'Sistêmico', 'Fadiga']
      }
    ],
    cantMiss: [
      {
        condition: 'Epiglotite (raro)',
        explanation: 'Emergência médica rara caracterizada pela inflamação da epiglote, podendo causar obstrução de via aérea.',
        scientificBasis: [
          'Mais comum em idades pediátricas devido à vacinação contra H. influenzae tipo b',
          'Apresenta-se com febre alta, disfagia severa e voz abafada',
          'Exige abordagem de via aérea emergencial'
        ],
        references: [
          'UpToDate: Acute epiglottitis (supraglottitis) in adults',
          'Whitebook: Epiglotite Aguda - Emergência',
          'ATLS Guidelines: Airway Management in Epiglottitis'
        ],
        confirmatoryTests: [
          'Laringoscopia: epiglote inflamada (nunca tentar visualizar em ambiente não operatório)',
          'RX de pescoço: sinal do "dedo indicador"'
        ],
        exclusionCriteria: [
          'Ausência de disfagia severa',
          'Ausência de estridor respiratório',
          'Presença de tosse produtiva'
        ],
        probability: 'baixa',
        severity: 'alta',
        keyIndicators: ['Emergência', 'Obstrução', 'Via aérea']
      },
      {
        condition: 'Abscesso periamigdalino',
        explanation: 'Coleção purulenta entre a amígdala e sua cápsula, podendo causar desvio da úvula e dificuldade de deglutição.',
        scientificBasis: [
          'Complicação de amigdalite bacteriana não tratada',
          'Mais comum em adultos jovens',
          'Apresenta-se com dor unilateral intensa e febre'
        ],
        confirmatoryTests: [
          'Exame físico: desvio da úvula para o lado oposto',
          'Tumefação unilateral da parede faríngea',
          'Aspiração com agulha pode confirmar presença de pus'
        ],
        exclusionCriteria: [
          'Ausência de desvio da úvula',
          'Dor bilateral na garganta',
          'Ausência de trismo (dificuldade de abrir a boca)'
        ],
        probability: 'baixa',
        severity: 'alta',
        keyIndicators: ['Abscesso', 'Unilateral', 'Emergência']
      }
    ]
  };

  return (
    <AppLayout>
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        {/* Header com informações do paciente e botão de gravação integrados */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full border-b border-gray-300 bg-gradient-to-r from-gray-50 to-white py-4 px-4 shadow-sm"
        >
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/patients')}
                className="h-10 w-10 hover:bg-gray-100 text-gray-700"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>

              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#8C00FF] to-[#450693] flex items-center justify-center shadow-lg">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">{selectedPatient?.name}</h1>
                  <p className="text-sm text-gray-600">
                    {selectedPatient?.age ? `${selectedPatient.age} anos` : ''}
                    {selectedPatient?.gender ? ` • ${selectedPatient.gender}` : ''}
                  </p>
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
                      "h-10 text-white hover:opacity-90 shadow-md transition-all",
                      noteGenerated
                        ? 'bg-gradient-to-r from-green-500 to-green-600'
                        : 'bg-gradient-to-r from-[#FFC400] to-[#FF9500]'
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
                        Gerando...
                      </>
                    ) : noteGenerated ? (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Nota Gerada!
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
                className={`h-10 shadow-md transition-all text-white ${
                  isListening
                    ? 'bg-gradient-to-r from-red-500 to-red-600 hover:opacity-90'
                    : 'bg-gradient-to-r from-[#8C00FF] to-[#450693] hover:opacity-90'
                }`}
              >
                {isListening ? (
                  <>
                    <MicOff className="mr-2 h-4 w-4" />
                    Parar Gravação
                  </>
                ) : (
                  <>
                    <Mic className="mr-2 h-4 w-4" />
                    Escutar Consulta
                  </>
                )}
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Tabs para navegação entre IA, perguntas, diagnóstico */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-7xl mx-auto w-full px-4 py-4"
        >
          <div className="flex flex-wrap gap-2 bg-gray-100 rounded-xl p-1.5 shadow-sm border border-gray-200">
            {[
              { id: 'ai', label: 'Copilot', icon: Brain },
              ...(appContext === 'psychology' ? [
                { id: 'summary', label: 'Resumo da Sessão', icon: Clock },
              ] : []),
              { id: 'diagnosis', label: appContext === 'psychology' ? 'Hipóteses Clínicas' : 'Hipóteses Diagnósticas', icon: Lightbulb },
              ...(appContext === 'medical' ? [
                { id: 'medication', label: 'Medicação Sugerida', icon: Pill },
                { id: 'prescription', label: 'Receita Médica', icon: FileCheck },
              ] : []),
              ...(appContext === 'psychology' ? [
                { id: 'themes', label: 'Temas e Metas', icon: Target },
                { id: 'interventions', label: 'Intervenções', icon: Heart },
              ] : []),
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "flex-1 min-w-[120px] h-10 transition-all font-medium",
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-[#8C00FF] to-[#450693] text-white shadow-md hover:opacity-90'
                      : 'text-gray-700 hover:bg-gray-200'
                  )}
                  onClick={() => setActiveTab(tab.id as any)}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  <span>{tab.label}</span>
                </Button>
              );
            })}
          </div>
        </motion.div>

        {/* Conteúdo principal */}
        <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full px-4 pb-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex-1"
          >
            <Card className="flex-1 border-0 shadow-lg h-full">
              <CardContent className="p-6 h-full">
                <ScrollArea className="h-full">
                  {activeTab === 'ai' && (
                    <AIChatPanel
                      transcript={currentConsultation.transcript || ''}
                      patientData={selectedPatient}
                      isActive={isListening}
                    />
                  )}

                  {activeTab === 'summary' && appContext === 'psychology' && (
                    <PsychologySessionSummary
                      patientName={selectedPatient?.name || ''}
                      lastSessionDate={currentConsultation?.startedAt}
                      daysSinceLastSession={currentConsultation?.startedAt ? Math.floor((Date.now() - new Date(currentConsultation.startedAt).getTime()) / (1000 * 60 * 60 * 24)) : undefined}
                    />
                  )}

                  {activeTab === 'medication' && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#FF3F7F] to-[#FF1654] flex items-center justify-center">
                          <Pill className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">Medicação Sugerida</h3>
                          <p className="text-sm text-gray-600">Prescrições baseadas no diagnóstico</p>
                        </div>
                      </div>

                      <div className="space-y-3">
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

                        <Card className="border-0 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-md mt-6">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="h-8 w-8 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
                                <AlertTriangle className="h-4 w-4 text-white" />
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-900 mb-2">Orientações Importantes</h4>
                                <ul className="space-y-1 text-sm text-gray-700">
                                  <li className="flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                    <span>Verificar alergias medicamentosas antes de prescrever</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                    <span>Orientar sobre hidratação adequada (2-3L/dia)</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                    <span>Repouso relativo durante o tratamento</span>
                                  </li>
                                  <li className="flex items-start gap-2">
                                    <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                                    <span>Retornar se sintomas piorarem ou não melhorarem em 3-5 dias</span>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  )}

                  {activeTab === 'diagnosis' && appContext === 'medical' && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#FFC400] to-[#FF9500] flex items-center justify-center">
                          <Lightbulb className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">Hipóteses Diagnósticas</h3>
                          <p className="text-sm text-gray-600">Análise baseada em evidências clínicas</p>
                        </div>
                      </div>

                      {/* Hipóteses Mais Prováveis */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 mb-3">
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                          <h4 className="font-bold text-gray-900">Mais Prováveis</h4>
                        </div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <Card className="border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 shadow-md">
                            <CardContent className="p-5">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                                    <CheckCircle2 className="h-6 w-6 text-white" />
                                  </div>
                                  <div>
                                    <h5 className="font-bold text-lg text-gray-900">Faringite Viral Aguda</h5>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Badge className="bg-green-500 text-white text-xs">Alta Probabilidade</Badge>
                                      <Badge className="bg-blue-500 text-white text-xs">Baixa Gravidade</Badge>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-3 mt-4">
                                <div className="bg-white rounded-lg p-4 border border-green-200">
                                  <h6 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                    <Brain className="h-4 w-4 text-green-600" />
                                    Explicação
                                  </h6>
                                  <p className="text-sm text-gray-700">
                                    Inflamação da faringe causada por vírus, sendo o quadro clínico consistente com sintomas virais como dor de garganta, febre baixa e ausência de sinais bacterianos.
                                  </p>
                                </div>

                                <div className="bg-white rounded-lg p-4 border border-green-200">
                                  <h6 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                    <FileText className="h-4 w-4 text-green-600" />
                                    Base Científica
                                  </h6>
                                  <ul className="space-y-2">
                                    <li className="text-sm text-gray-700 flex items-start gap-2">
                                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                      <span>Dor de garganta + febre baixa + quadro viral típico</span>
                                    </li>
                                    <li className="text-sm text-gray-700 flex items-start gap-2">
                                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                      <span>Score de Centor ≤2, sem sinais bacterianos marcantes</span>
                                    </li>
                                    <li className="text-sm text-gray-700 flex items-start gap-2">
                                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                      <span>Evolução autolimitada comum em infecções virais</span>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <Card className="border border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-md">
                            <CardContent className="p-5">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                                    <Lightbulb className="h-6 w-6 text-white" />
                                  </div>
                                  <div>
                                    <h5 className="font-bold text-lg text-gray-900">Amigdalite Viral</h5>
                                    <div className="flex items-center gap-2 mt-1">
                                      <Badge className="bg-blue-500 text-white text-xs">Probabilidade Moderada</Badge>
                                      <Badge className="bg-green-500 text-white text-xs">Baixa Gravidade</Badge>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="bg-white rounded-lg p-4 border border-blue-200">
                                <p className="text-sm text-gray-700">
                                  Inflamação das amígdalas por vírus, com apresentação clínica similar à faringite viral, mas com envolvimento mais pronunciado das amígdalas. É a causa mais comum de faringoamigdalite (70-80%).
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </div>

                      {/* Diagnósticos Possíveis */}
                      <div className="space-y-3 mt-8">
                        <div className="flex items-center gap-2 mb-3">
                          <AlertTriangle className="h-5 w-5 text-yellow-600" />
                          <h4 className="font-bold text-gray-900">Diagnósticos Possíveis</h4>
                        </div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <Card className="border border-yellow-200 bg-gradient-to-br from-yellow-50 to-amber-50 shadow-md">
                            <CardContent className="p-5">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center">
                                    <AlertTriangle className="h-5 w-5 text-white" />
                                  </div>
                                  <div>
                                    <h5 className="font-bold text-gray-900">Faringite Bacteriana (Streptococcus)</h5>
                                    <Badge className="bg-yellow-500 text-gray-900 text-xs mt-1">Baixa Probabilidade - Gravidade Média</Badge>
                                  </div>
                                </div>
                              </div>

                              <div className="bg-white rounded-lg p-4 border border-yellow-200">
                                <p className="text-sm text-gray-700 mb-3">
                                  Infecção bacteriana que pode apresentar sintomas semelhantes, mas com maior gravidade. Responsável por 5-15% das faringoamigdalites em adultos.
                                </p>
                                <div className="flex items-center gap-2 text-xs text-gray-600">
                                  <FileText className="h-3 w-3" />
                                  <span>Teste rápido para Streptococcus A recomendado</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </div>

                      {/* Não Pode Perder */}
                      <div className="space-y-3 mt-8">
                        <div className="flex items-center gap-2 mb-3">
                          <XCircle className="h-5 w-5 text-red-600" />
                          <h4 className="font-bold text-gray-900">Não Pode Perder (Red Flags)</h4>
                        </div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                        >
                          <Card className="border border-red-200 bg-gradient-to-br from-red-50 to-rose-50 shadow-md">
                            <CardContent className="p-5">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center">
                                    <AlertTriangle className="h-5 w-5 text-white" />
                                  </div>
                                  <div>
                                    <h5 className="font-bold text-gray-900">Epiglotite / Abscesso Periamigdalino</h5>
                                    <Badge className="bg-red-500 text-white text-xs mt-1">EMERGÊNCIA - Alta Gravidade</Badge>
                                  </div>
                                </div>
                              </div>

                              <div className="bg-white rounded-lg p-4 border border-red-200">
                                <h6 className="font-semibold text-red-900 mb-2">Sinais de Alarme:</h6>
                                <ul className="space-y-2">
                                  <li className="text-sm text-gray-700 flex items-start gap-2">
                                    <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                                    <span>Disfagia severa ou estridor respiratório</span>
                                  </li>
                                  <li className="text-sm text-gray-700 flex items-start gap-2">
                                    <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                                    <span>Desvio da úvula ou tumefação unilateral</span>
                                  </li>
                                  <li className="text-sm text-gray-700 flex items-start gap-2">
                                    <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                                    <span>Trismo (dificuldade de abrir a boca)</span>
                                  </li>
                                </ul>
                              </div>

                              <div className="mt-3 p-3 bg-red-100 rounded-lg border border-red-300">
                                <p className="text-sm font-semibold text-red-900 flex items-center gap-2">
                                  <AlertTriangle className="h-4 w-4" />
                                  Se presente: encaminhar IMEDIATAMENTE para emergência
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'prescription' && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#8C00FF] to-[#450693] flex items-center justify-center">
                            <FileCheck className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-gray-900">Receita Médica</h3>
                            <p className="text-sm text-gray-600">Prescrição profissional para o paciente</p>
                          </div>
                        </div>

                        {!prescriptionGenerated && (
                          <Button
                            onClick={() => setPrescriptionGenerated(true)}
                            className="bg-gradient-to-r from-[#8C00FF] to-[#450693] text-white hover:opacity-90 shadow-md"
                          >
                            <FileCheck className="mr-2 h-4 w-4" />
                            Gerar Receita
                          </Button>
                        )}
                      </div>

                      {!prescriptionGenerated ? (
                        <Card className="border-0 bg-gradient-to-br from-gray-50 to-gray-100 shadow-md">
                          <CardContent className="p-12 text-center">
                            <div className="relative mb-6">
                              <div className="absolute inset-0 bg-gradient-to-br from-[#8C00FF] to-[#450693] rounded-full blur-2xl opacity-20 animate-pulse"></div>
                              <div className="relative h-24 w-24 rounded-full bg-gradient-to-br from-[#8C00FF] to-[#450693] flex items-center justify-center mx-auto shadow-xl">
                                <FileCheck className="h-12 w-12 text-white" />
                              </div>
                            </div>
                            <h4 className="text-xl font-bold text-gray-900 mb-2">Receita Médica</h4>
                            <p className="text-gray-600 mb-6">
                              Clique no botão acima para gerar automaticamente uma receita médica profissional baseada nas medicações sugeridas.
                            </p>
                            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                              <span>Geração automática com base nas medicações selecionadas</span>
                            </div>
                          </CardContent>
                        </Card>
                      ) : (
                        <div className="space-y-4">
                          {/* Verificar se há medicamentos controlados para mostrar alerta */}
                          {suggestedMedications.some(med => med.isControlled) && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                              <div className="flex items-start gap-3">
                                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="font-medium text-yellow-800">Aviso Importante</p>
                                  <p className="text-sm text-yellow-700 mt-1">
                                    Esta consulta contém medicamentos controlados. Serão geradas receitas separadas:
                                    uma para medicamentos comuns e outra para medicamentos sujeitos a controle especial.
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Receita Médica Comum */}
                          {suggestedMedications.filter(med => !med.isControlled).length > 0 && (
                            <Card className="border-0 shadow-lg bg-white">
                              <CardContent className="p-8">
                                {/* Header da Receita */}
                                <div className="border-b-2 border-[#8C00FF] pb-6 mb-6">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <h2 className="text-2xl font-bold text-gray-900 mb-2">Dr. {doctorName}</h2>
                                      <p className="text-sm text-gray-700 font-medium">{doctorSpecialty}</p>
                                      <p className="text-sm text-gray-700">CRM-{uf} {crm}</p>
                                      <p className="text-sm text-gray-600">RQE 00000 – Clínica Médica</p>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-sm font-semibold text-gray-900">RECEITA MÉDICA</p>
                                      <p className="text-sm text-gray-600 mt-2">Data: {new Date().toLocaleDateString('pt-BR')}</p>
                                      <p className="text-sm text-gray-600">Hora: {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                  </div>
                                </div>

                                {/* Dados do Paciente */}
                                <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
                                  <h3 className="font-bold text-gray-900 mb-3">Dados do Paciente</h3>
                                  <div className="grid grid-cols-2 gap-3">
                                    <div className="col-span-2">
                                      <p className="text-xs text-gray-600">Nome Completo</p>
                                      <p className="text-sm font-semibold text-gray-900">{selectedPatient?.name}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-600">CPF</p>
                                      <p className="text-sm font-semibold text-gray-900">***.***.***-**</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-600">Endereço</p>
                                      <p className="text-sm font-semibold text-gray-900">{selectedPatient?.address || 'Rua Exemplo, 123 - Bairro, Cidade/UF 00000-000'}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-600">Data de Nascimento</p>
                                      <p className="text-sm font-semibold text-gray-900">{new Date(new Date().getFullYear() - (selectedPatient?.age || 0), 0, 1).toLocaleDateString('pt-BR')}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-600">Idade</p>
                                      <p className="text-sm font-semibold text-gray-900">{selectedPatient?.age} anos</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-600">Sexo</p>
                                      <p className="text-sm font-semibold text-gray-900">{selectedPatient?.gender}</p>
                                    </div>
                                    <div className="col-span-2">
                                      <p className="text-xs text-gray-600">Data da Consulta</p>
                                      <p className="text-sm font-semibold text-gray-900">{new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                    </div>
                                  </div>
                                </div>

                                {/* Prescrição */}
                                <div className="mb-6">
                                  <div className="flex items-center justify-between gap-2 mb-4">
                                    <div className="flex items-center gap-2">
                                      <Pill className="h-5 w-5 text-[#8C00FF]" />
                                      <h3 className="font-bold text-lg text-gray-900">Prescrição</h3>
                                    </div>
                                    {/* Botão para adicionar medicamento */}
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="border-[#8C00FF] text-[#8C00FF] hover:bg-[#8C00FF]/10"
                                      onClick={() => {
                                        // Adiciona um medicamento padrão para edição
                                        const newMed = {
                                          id: Date.now(),
                                          name: '',
                                          concentration: '',
                                          form: 'comprimidos',
                                          via: 'VO (via oral)',
                                          dosage: '',
                                          duration: '',
                                          quantity: '',
                                          quantityText: '',
                                          indication: '',
                                          isControlled: false
                                        };
                                        setPrescriptionMedications(prev => [...prev, newMed]);
                                      }}
                                    >
                                      + Adicionar Medicamento
                                    </Button>
                                  </div>

                                  <div className="space-y-4">
                                    {prescriptionMedications.map((med, idx) => (
                                      <PrescriptionMedicationCard
                                        key={med.id}
                                        med={med}
                                        idx={idx}
                                        isControlled={med.isControlled}
                                        onEdit={(updatedMed) => {
                                          setPrescriptionMedications(prev =>
                                            prev.map((m, i) => i === idx ? {...m, ...updatedMed} : m)
                                          );
                                        }}
                                        onDelete={() => {
                                          setPrescriptionMedications(prev =>
                                            prev.filter((m, i) => i !== idx)
                                          );
                                        }}
                                      />
                                    ))}
                                  </div>

                                  {prescriptionMedications.length === 0 && (
                                    <div className="text-center py-8 text-gray-500">
                                      Nenhum medicamento adicionado. Clique em "Adicionar Medicamento" para começar.
                                    </div>
                                  )}
                                </div>

                                {/* Orientações */}
                                <div className="bg-blue-50 rounded-lg p-4 mb-6 border border-blue-200">
                                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5 text-blue-600" />
                                    Orientações ao Paciente
                                  </h3>
                                  <ul className="space-y-2">
                                    <li className="text-sm text-gray-700 flex items-start gap-2">
                                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                      <span>Tomar os medicamentos nos horários indicados acima</span>
                                    </li>
                                    <li className="text-sm text-gray-700 flex items-start gap-2">
                                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                      <span>Beber bastante água durante o dia (2 a 3 litros)</span>
                                    </li>
                                    <li className="text-sm text-gray-700 flex items-start gap-2">
                                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                      <span>Fazer repouso relativo enquanto durar o tratamento</span>
                                    </li>
                                    <li className="text-sm text-gray-700 flex items-start gap-2">
                                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                      <span>Evitar alimentos muito quentes ou gelados</span>
                                    </li>
                                    <li className="text-sm text-gray-700 flex items-start gap-2">
                                      <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                                      <span className="font-semibold">Retornar imediatamente se sentir: falta de ar, febre persistente acima de 39°C, dificuldade para engolir, ou se os sintomas não melhorarem em 3 a 5 dias</span>
                                    </li>
                                  </ul>
                                </div>

                                {/* Assinatura */}
                                <div className="border-t-2 border-gray-200 pt-6 space-y-6">
                                  <div className="flex justify-between items-end">
                                    <div>
                                      <p className="text-sm font-semibold text-gray-900">
                                        {suggestedMedications.some(med => med.isControlled) ? 'Validade: 10 dias a partir da data de emissão' : 'Validade: 30 dias a partir da data de emissão'}
                                      </p>
                                      <p className="text-xs text-gray-600 mt-1">Emitida em: {new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                    </div>
                                    <div className="text-center">
                                      <div className="mb-12"></div>
                                      <div className="border-t-2 border-gray-900 w-72 mb-2"></div>
                                      <p className="font-bold text-gray-900 text-sm">{doctorName}</p>
                                      <p className="text-sm text-gray-700">CRM-{uf} {crm}</p>
                                    </div>
                                  </div>

                                  {/* Bloco de Assinatura Digital */}
                                  <div className="border-t border-gray-300 pt-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <div className="space-y-2">
                                      <p className="text-xs text-gray-600 leading-relaxed">
                                        <span className="font-semibold text-gray-900">Médico:</span>
                                        <span className="ml-1">{doctorName}</span>
                                      </p>
                                      <p className="text-xs text-gray-600 leading-relaxed">
                                        <span className="font-semibold text-gray-900">CRM:</span>
                                        <span className="ml-1">CRM-{uf} {crm}</span>
                                      </p>
                                      <p className="text-xs text-gray-600 leading-relaxed">
                                        <span className="font-semibold text-gray-900">Data e hora da assinatura:</span>
                                        <span className="ml-1">{new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })} às {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                                      </p>
                                      <p className="text-xs text-gray-600 leading-relaxed">
                                        <span className="font-semibold text-gray-900">Tipo de certificado:</span>
                                        <span className="ml-1">ICP-Brasil {signatureType.toUpperCase().replace('ICP-BRASIL-', '')}</span>
                                      </p>
                                      <p className="text-xs text-gray-600 leading-relaxed">
                                        <span className="font-semibold text-gray-900">Código de verificação:</span>
                                        <span className="ml-1 font-mono">{currentConsultation?.prescription?.verificationCode || 'ABCD-1234-EFGH-5678'}</span>
                                      </p>
                                    </div>

                                    <div className="text-right text-xs text-gray-500 mt-3">
                                      <p>Para verificar a autenticidade deste documento, acesse:</p>
                                      <p className="text-blue-600 underline">https://minha-plataforma.com/verificar</p>
                                    </div>
                                  </div>

                                  {/* Código de Verificação / QR Code */}
                                  <div className="flex justify-between items-start pt-4">
                                    <div>
                                      <p className="text-xs font-semibold text-gray-700">ID da receita:</p>
                                      <p className="text-sm font-mono text-gray-900">{currentConsultation?.prescription?.id || 'RX-2025-00001234'}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                      <div className="w-20 h-20 bg-white p-2 border border-gray-300 rounded">
                                        <PrescriptionQRCode
                                          prescriptionId={currentConsultation?.prescription?.id || 'RX-2025-00001234'}
                                        />
                                      </div>
                                    </div>
                                  </div>

                                  {/* Indicação de documento eletrônico */}
                                  <div className="border-t border-gray-300 pt-4 text-center">
                                    <p className="text-xs text-gray-600 italic">
                                      Documento eletrônico produzido e assinado digitalmente.
                                      Dispensa carimbo e assinatura manuscrita, conforme legislação vigente.
                                    </p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )}

                          {/* Receita de Controle Especial */}
                          {suggestedMedications.some(med => med.isControlled) && (
                            <Card className="border-0 shadow-lg bg-white border-2 border-red-600">
                              <CardContent className="p-8">
                                {/* Header da Receita de Controle Especial */}
                                <div className="border-b-2 border-red-600 pb-6 mb-6">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <h2 className="text-2xl font-bold text-gray-900 mb-2">{doctorName}</h2>
                                      <p className="text-sm text-gray-700 font-medium">{doctorSpecialty}</p>
                                      <p className="text-sm text-gray-700">CRM-{uf} {crm}</p>
                                      <p className="text-sm text-gray-600">RQE 00000 – Clínica Médica</p>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-lg font-bold text-red-600">NOTIFICAÇÃO DE RECEITA</p>
                                      <p className="text-sm text-red-600 font-medium mt-1">Psicotrópicos</p>
                                      <p className="text-xs text-gray-600 mt-2">Nº da Notificação: CT-{new Date().getFullYear()}-{String(Math.floor(100000 + Math.random() * 900000)).slice(-6)}</p>
                                      <p className="text-sm text-gray-600 mt-2">Data: {new Date().toLocaleDateString('pt-BR')}</p>
                                      <p className="text-sm text-gray-600">Hora: {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                  </div>
                                </div>

                                {/* Subtítulo */}
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                                  <h3 className="font-bold text-red-800 text-center">Uso exclusivo para medicamentos sujeitos a controle especial</h3>
                                </div>

                                {/* Dados do Paciente */}
                                <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
                                  <h3 className="font-bold text-gray-900 mb-3">Dados do Paciente</h3>
                                  <div className="grid grid-cols-2 gap-3">
                                    <div className="col-span-2">
                                      <p className="text-xs text-gray-600">Nome Completo</p>
                                      <p className="text-sm font-semibold text-gray-900">{selectedPatient?.name}</p>
                                    </div>
                                    <div className="col-span-2">
                                      <p className="text-xs text-gray-600">CPF</p>
                                      <p className="text-sm font-semibold text-gray-900">***.***.***-**</p>
                                    </div>
                                    <div className="col-span-2">
                                      <p className="text-xs text-gray-600">Endereço Completo</p>
                                      <p className="text-sm font-semibold text-gray-900">{selectedPatient?.address || 'Rua Exemplo, 123 - Bairro, Cidade/UF 00000-000'}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-600">Data de Nascimento</p>
                                      <p className="text-sm font-semibold text-gray-900">{new Date(new Date().getFullYear() - (selectedPatient?.age || 0), 0, 1).toLocaleDateString('pt-BR')}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-600">Idade</p>
                                      <p className="text-sm font-semibold text-gray-900">{selectedPatient?.age} anos</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-600">Sexo</p>
                                      <p className="text-sm font-semibold text-gray-900">{selectedPatient?.gender}</p>
                                    </div>
                                    <div className="col-span-2">
                                      <p className="text-xs text-gray-600">Data da Consulta</p>
                                      <p className="text-sm font-semibold text-gray-900">{new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                    </div>
                                  </div>
                                </div>

                                {/* Prescrição de Medicamentos Controlados */}
                                <div className="mb-6">
                                  <div className="flex items-center gap-2 mb-4">
                                    <div className="h-5 w-5 bg-red-600 rounded flex items-center justify-center">
                                      <Pill className="h-3 w-3 text-white" />
                                    </div>
                                    <h3 className="font-bold text-lg text-red-700">Prescrição de Medicamento Controlado</h3>
                                  </div>

                                  <div className="space-y-4">
                                    {suggestedMedications
                                      .filter(med => med.isControlled)
                                      .map((med, idx) => (
                                        <ControlledMedicationCard key={idx} med={med} idx={idx} />
                                      ))}
                                  </div>
                                </div>

                                {/* Orientações */}
                                <div className="bg-yellow-50 rounded-lg p-4 mb-6 border border-yellow-200">
                                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5 text-yellow-600" />
                                    Informações Importantes
                                  </h3>
                                  <ul className="space-y-2 text-sm">
                                    <li className="text-gray-700 flex items-start gap-2">
                                      <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                                      <span>Este medicamento está sujeito a controle especial e seu uso deve seguir rigorosamente a prescrição médica</span>
                                    </li>
                                    <li className="text-gray-700 flex items-start gap-2">
                                      <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                                      <span>Esta receita é válida para uma única dispensação</span>
                                    </li>
                                    <li className="text-gray-700 flex items-start gap-2">
                                      <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                                      <span>Para repetição do medicamento, será necessária nova avaliação médica</span>
                                    </li>
                                    <li className="text-gray-700 flex items-start gap-2">
                                      <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                                      <span>Não compartilhe este medicamento com outras pessoas</span>
                                    </li>
                                    <li className="text-gray-700 flex items-start gap-2">
                                      <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                                      <span>Em caso de efeitos colaterais, procure imediatamente seu médico</span>
                                    </li>
                                  </ul>
                                </div>

                                {/* Bloco "Preenchimento Exclusivo da Farmácia" */}
                                <div className="border-t-2 border-red-200 pt-6 mb-6">
                                  <h3 className="font-bold text-gray-900 mb-3">Preenchimento exclusivo da farmácia</h3>
                                  <div className="grid grid-cols-2 gap-4 border border-gray-300 rounded-lg p-4 bg-gray-50">
                                    <div>
                                      <p className="text-xs text-gray-600">Nome do comprador</p>
                                      <p className="text-sm font-semibold text-gray-900 border-b border-gray-300 py-1">______________</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-600">Documento (RG/CPF)</p>
                                      <p className="text-sm font-semibold text-gray-900 border-b border-gray-300 py-1">______________</p>
                                    </div>
                                    <div className="col-span-2">
                                      <p className="text-xs text-gray-600">Endereço completo</p>
                                      <p className="text-sm font-semibold text-gray-900 border-b border-gray-300 py-1">______________</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-600">Telefone</p>
                                      <p className="text-sm font-semibold text-gray-900 border-b border-gray-300 py-1">______________</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-600">Data da avaliação médica</p>
                                      <p className="text-sm font-semibold text-gray-900 border-b border-gray-300 py-1">______________</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-600">Data da dispensação</p>
                                      <p className="text-sm font-semibold text-gray-900 border-b border-gray-300 py-1">______________</p>
                                    </div>
                                    <div className="col-span-2">
                                      <p className="text-xs text-gray-600">Assinatura do comprador</p>
                                      <p className="text-sm font-semibold text-gray-900 border-b border-gray-300 py-1">______________</p>
                                    </div>
                                    <div className="col-span-2">
                                      <p className="text-xs text-gray-600">Assinatura / Carimbo do farmacêutico</p>
                                      <p className="text-sm font-semibold text-gray-900 border-b border-gray-300 py-4">______________</p>
                                    </div>
                                  </div>
                                </div>

                                {/* Assinatura */}
                                <div className="border-t-2 border-gray-200 pt-6 space-y-6">
                                  <div className="flex justify-between items-end">
                                    <div>
                                      <p className="text-sm font-semibold text-gray-900">Validade desta receita: <span id="validadeReceitaControlada">30 dias</span> a partir da data de emissão, conforme legislação vigente</p>
                                      <p className="text-xs text-gray-600 mt-1">Emitida em: {new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                    </div>
                                    <div className="text-center">
                                      <div className="mb-12"></div>
                                      <div className="border-t-2 border-gray-900 w-72 mb-2"></div>
                                      <p className="font-bold text-gray-900 text-sm">{doctorName}</p>
                                      <p className="text-sm text-gray-700">CRM-{uf} {crm}</p>
                                    </div>
                                  </div>

                                  {/* Bloco de Assinatura Digital */}
                                  <div className="border-t border-gray-300 pt-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
                                    <div className="space-y-2">
                                      <p className="text-xs text-gray-600 leading-relaxed">
                                        <span className="font-semibold text-gray-900">Médico:</span>
                                        <span className="ml-1">{doctorName}</span>
                                      </p>
                                      <p className="text-xs text-gray-600 leading-relaxed">
                                        <span className="font-semibold text-gray-900">CRM:</span>
                                        <span className="ml-1">CRM-{uf} {crm}</span>
                                      </p>
                                      <p className="text-xs text-gray-600 leading-relaxed">
                                        <span className="font-semibold text-gray-900">Data e hora da assinatura:</span>
                                        <span className="ml-1">{new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })} às {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                                      </p>
                                      <p className="text-xs text-gray-600 leading-relaxed">
                                        <span className="font-semibold text-gray-900">Tipo de certificado:</span>
                                        <span className="ml-1">ICP-Brasil {signatureType.toUpperCase().replace('ICP-BRASIL-', '')}</span>
                                      </p>
                                      <p className="text-xs text-gray-600 leading-relaxed">
                                        <span className="font-semibold text-gray-900">Código de verificação:</span>
                                        <span className="ml-1 font-mono">{currentConsultation?.prescription?.verificationCode || 'ABCD-1234-EFGH-5678'}</span>
                                      </p>
                                    </div>

                                    <div className="text-right text-xs text-gray-500 mt-3">
                                      <p>Para verificar a autenticidade deste documento, acesse:</p>
                                      <p className="text-blue-600 underline">https://minha-plataforma.com/verificar</p>
                                    </div>
                                  </div>

                                  {/* Código de Verificação / QR Code */}
                                  <div className="flex justify-between items-start pt-4">
                                    <div>
                                      <p className="text-xs font-semibold text-gray-700">ID da receita:</p>
                                      <p className="text-sm font-mono text-gray-900">CT-{new Date().getFullYear()}-{String(Math.floor(100000 + Math.random() * 900000)).slice(-6)}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                      <div className="w-20 h-20 bg-white p-2 border border-gray-300 rounded">
                                        <PrescriptionQRCode
                                          prescriptionId={String(Math.floor(100000 + Math.random() * 900000)).slice(-6)}
                                          type="controlled"
                                        />
                                      </div>
                                    </div>
                                  </div>

                                  {/* Avisos Legais */}
                                  <div className="border-t border-red-200 pt-4 text-center">
                                    <p className="text-xs font-semibold text-red-700">
                                      Receita de controle especial emitida em conformidade com a legislação de substâncias sujeitas a controle especial.
                                    </p>
                                    <p className="text-xs text-gray-600 mt-2">
                                      Documento eletrônico válido somente com assinatura digital ICP-Brasil e código de verificação.
                                    </p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )}

                          {/* Seletor de tipo de receita */}
                          <div className="space-y-3">
                            <label className="text-sm font-medium text-gray-700 block">Tipo de Receita</label>
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                variant={prescriptionType === 'normal' ? 'default' : 'outline'}
                                className={`flex-1 ${prescriptionType === 'normal' ? 'bg-[#8C00FF] hover:bg-[#7a00e6]' : 'border-gray-300'}`}
                                onClick={() => setPrescriptionType('normal')}
                              >
                                Comum
                              </Button>
                              <Button
                                type="button"
                                variant={prescriptionType === 'controlled' ? 'default' : 'outline'}
                                className={`flex-1 ${prescriptionType === 'controlled' ? 'bg-red-600 hover:bg-red-700' : 'border-gray-300'}`}
                                onClick={() => setPrescriptionType('controlled')}
                              >
                                Controlada
                              </Button>
                              <Button
                                type="button"
                                variant={prescriptionType === 'both' ? 'default' : 'outline'}
                                className={`flex-1 ${prescriptionType === 'both' ? 'bg-gray-600 hover:bg-gray-700' : 'border-gray-300'}`}
                                onClick={() => setPrescriptionType('both')}
                              >
                                Ambas
                              </Button>
                            </div>
                          </div>

                          {/* Botões de Ação */}
                          <div className="flex gap-3">
                            {currentConsultation?.prescription?.status !== 'signed' ? (
                              <>
                                {/* Botão para assinar receita normal */}
                                {(prescriptionType === 'normal' || prescriptionType === 'both') && prescriptionMedications.some(med => !med.isControlled) && (
                                  <Button
                                    className="flex-1 bg-gradient-to-r from-[#8C00FF] to-[#450693] text-white hover:opacity-90 shadow-md"
                                    onClick={() => {
                                      if (!currentConsultation?.prescription) {
                                        // Create the prescription if it doesn't exist
                                        useAppStore.getState().createPrescription(currentConsultation.id);
                                      }
                                      setSignatureModalType('normal');
                                      setShowSignatureModal(true);
                                    }}
                                  >
                                    <FileCheck className="mr-2 h-4 w-4" />
                                    Assinar Receita Comum
                                  </Button>
                                )}

                                {/* Botão para assinar receita controlada */}
                                {(prescriptionType === 'controlled' || prescriptionType === 'both') && prescriptionMedications.some(med => med.isControlled) && (
                                  <Button
                                    className="flex-1 bg-gradient-to-r from-red-600 to-red-700 text-white hover:opacity-90 shadow-md"
                                    onClick={() => {
                                      if (!currentConsultation?.prescription) {
                                        // Create the prescription if it doesn't exist
                                        useAppStore.getState().createPrescription(currentConsultation.id);
                                      }
                                      setSignatureModalType('controlled');
                                      setShowSignatureModal(true);
                                    }}
                                  >
                                    <FileCheck className="mr-2 h-4 w-4" />
                                    Assinar Receita Controlada
                                  </Button>
                                )}

                                <Button
                                  variant="outline"
                                  className="border-gray-300"
                                  onClick={() => setPrescriptionGenerated(false)}
                                >
                                  Editar
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  className="flex-1 bg-gradient-to-r from-[#8C00FF] to-[#450693] text-white hover:opacity-90 shadow-md"
                                  onClick={() => window.print()}
                                >
                                  <Printer className="mr-2 h-4 w-4" />
                                  Imprimir Receitas
                                </Button>
                                <Button
                                  className="flex-1 bg-gradient-to-r from-[#FF3F7F] to-[#FF1654] text-white hover:opacity-90 shadow-md"
                                >
                                  <Download className="mr-2 h-4 w-4" />
                                  Baixar PDF
                                </Button>
                                <Button
                                  variant="outline"
                                  className="border-gray-300 flex-1"
                                  onClick={() => {
                                    // Simulate sending email/SMS/WhatsApp
                                    alert('Função de envio por email/SMS/WhatsApp ainda não implementada');
                                  }}
                                >
                                  Enviar ao paciente
                                </Button>
                              </>
                            )}
                          </div>

                          {/* Status da Receita Após Assinatura */}
                          {currentConsultation?.prescription?.status === 'signed' && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                              <div>
                                <p className="font-medium text-green-800">Receita assinada digitalmente</p>
                                <p className="text-sm text-green-700">
                                  Assinada em {new Date(currentConsultation.prescription.signedAt || '').toLocaleString('pt-BR', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })} - ID: {currentConsultation.prescription.id}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'themes' && (
                    <SessionThemesAndGoals patientName={selectedPatient?.name || ''} />
                  )}

                  {activeTab === 'interventions' && (
                    <TherapeuticInterventions patientName={selectedPatient?.name || ''} />
                  )}

                  {activeTab === 'diagnosis' && appContext === 'psychology' && (
                    <PsychologyClinicalHypothesis patientName={selectedPatient?.name || ''} />
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Modal de Assinatura */}
        {showSignatureModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={() => !signingInProgress && setShowSignatureModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg max-h-[90vh] overflow-auto bg-white rounded-xl shadow-2xl"
            >
              <Card className="border-0 shadow-none">
                <CardHeader className={`bg-gradient-to-r ${signatureModalType === 'controlled' ? 'from-red-600 to-red-700' : 'from-[#8C00FF] to-[#450693]'} text-white rounded-t-xl`}>
                  <CardTitle className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-white/20 flex items-center justify-center">
                      <FileCheck className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-lg font-bold">{signatureModalType === 'controlled' ? 'Assinatura Digital - Receita Controlada' : 'Assinatura Digital'}</div>
                      <div className="text-sm font-normal text-white/80">Revise atentamente antes de assinar</div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 p-6">
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-amber-800">{signatureModalType === 'controlled' ? 'Revise atentamente as informações da receita controlada.' : 'Revise atentamente as informações da receita.'}</p>
                        <p className="text-sm text-amber-700 mt-1">
                          Ao clicar em 'Assinar e finalizar receita', esta prescrição será registrada em seu nome e ficará disponível para verificação por código ou QR code.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Nome Completo do Médico</label>
                      <Input
                        value={doctorName}
                        onChange={(e) => useAppStore.getState().setDoctorName(e.target.value)}
                        className="bg-gray-50 border-gray-300 focus-visible:border-[#8C00FF]"
                        placeholder="Digite seu nome completo"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">CRM</label>
                      <Input
                        value={crm}
                        onChange={(e) => setCRM(e.target.value)}
                        className="bg-gray-50 border-gray-300 focus-visible:border-[#8C00FF]"
                        placeholder="Digite seu CRM"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">UF</label>
                      <Input
                        value={uf}
                        onChange={(e) => setUF(e.target.value)}
                        className="bg-gray-50 border-gray-300 focus-visible:border-[#8C00FF]"
                        placeholder="Digite sua UF (ex: SP)"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-1 block">Tipo de Certificado</label>
                      <select
                        value={signatureType}
                        onChange={(e) => setSignatureType(e.target.value as any)}
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8C00FF] focus:border-transparent"
                      >
                        <option value="icp-brasil-mock">ICP-Brasil (Simulado)</option>
                        <option value="icp-brasil-a3">ICP-Brasil A3</option>
                        <option value="icp-brasil-a1">ICP-Brasil A1</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button
                      className={`flex-1 ${signatureModalType === 'controlled' ? 'bg-gradient-to-r from-red-600 to-red-700 hover:opacity-90' : 'bg-gradient-to-r from-[#8C00FF] to-[#450693] hover:opacity-90'} text-white shadow-md`}
                      onClick={async () => {
                        setSigningInProgress(true);
                        try {
                          if (currentConsultation) {
                            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate signing process
                            useAppStore.getState().signPrescription(currentConsultation.id, crm, uf, signatureType);
                            setShowSignatureModal(false);
                          }
                        } finally {
                          setSigningInProgress(false);
                        }
                      }}
                      disabled={signingInProgress || !crm || !uf}
                    >
                      {signingInProgress ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                          Assinando...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Assinar e finalizar {signatureModalType} receita
                        </>
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      className="border-gray-300"
                      onClick={() => !signingInProgress && setShowSignatureModal(false)}
                      disabled={signingInProgress}
                    >
                      Cancelar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}

        {/* Modal de Nota Clínica */}
        <AnimatePresence>
          {showNoteSection && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowNoteSection(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 40 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 40 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-5xl max-h-[95vh] flex flex-col"
              >
                <Card className="border-0 shadow-2xl flex flex-col max-h-full overflow-hidden">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-[#8C00FF] via-[#7000D9] to-[#450693] p-6 text-white">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                          <FileText className="h-7 w-7 text-white" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold mb-1">Nota Clínica</h2>
                          <p className="text-white/90 text-sm flex items-center gap-2">
                            <User className="h-4 w-4" />
                            {selectedPatient?.name}
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={() => setShowNoteSection(false)}
                        variant="ghost"
                        size="icon"
                        className="text-white hover:bg-white/20 rounded-lg"
                      >
                        <XCircle className="h-5 w-5" />
                      </Button>
                    </div>

                    <div className="flex items-center gap-2 bg-white/10 px-3 py-2 rounded-lg w-fit">
                      <CheckCircle className="h-4 w-4 text-green-300" />
                      <span className="text-xs font-medium">Salvamento Automático Ativo</span>
                    </div>
                  </div>

                  {/* Content */}
                  <ScrollArea className="flex-1 overflow-auto">
                    <CardContent className="p-6 space-y-6">
                      {/* Nota Clínica Editor */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <Stethoscope className="h-4 w-4 text-[#8C00FF]" />
                            Registro da Consulta
                          </label>
                          <Badge variant="outline" className="text-xs">
                            {editableNote.length} caracteres
                          </Badge>
                        </div>
                        <Textarea
                          value={editableNote}
                          onChange={(e) => {
                            setEditableNote(e.target.value);
                            setDoctorNotes(e.target.value);
                          }}
                          className="min-h-[350px] font-mono text-sm bg-white border-2 border-gray-200 focus-visible:border-[#8C00FF] focus-visible:ring-2 focus-visible:ring-[#8C00FF]/20 rounded-xl p-4 resize-none"
                          placeholder="Digite ou edite a nota clínica aqui...&#x0a;&#x0a;Exemplo:&#x0a;- Queixa Principal&#x0a;- História da Doença Atual&#x0a;- Exame Físico&#x0a;- Hipóteses Diagnósticas&#x0a;- Conduta"
                        />
                      </div>

                      <Separator className="bg-gray-200" />

                      {/* Resumo para o Paciente */}
                      {!patientSummary ? (
                        <div className="space-y-3">
                          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-[#FF3F7F]" />
                            Resumo para o Paciente
                          </label>
                          <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                            <div className="max-w-md mx-auto space-y-4">
                              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-[#FF3F7F] to-[#FF1654] flex items-center justify-center mx-auto shadow-lg">
                                <Send className="h-8 w-8 text-white" />
                              </div>
                              <div>
                                <h3 className="font-bold text-gray-900 mb-2">Gerar Resumo Educativo</h3>
                                <p className="text-sm text-gray-600">
                                  Crie um resumo em linguagem simples para o paciente entender sua condição e orientações
                                </p>
                              </div>
                              <Button
                                onClick={handleGeneratePatientSummary}
                                disabled={isGeneratingSummary}
                                className="bg-gradient-to-r from-[#FF3F7F] to-[#FF1654] text-white hover:opacity-90 shadow-lg h-11"
                              >
                                {isGeneratingSummary ? (
                                  <>
                                    <motion.div
                                      animate={{ rotate: 360 }}
                                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                      className="mr-2"
                                    >
                                      <Send className="h-4 w-4" />
                                    </motion.div>
                                    Gerando Resumo...
                                  </>
                                ) : (
                                  <>
                                    <Send className="mr-2 h-4 w-4" />
                                    Gerar Resumo para Paciente
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="space-y-3"
                        >
                          <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-green-600" />
                            Resumo para o Paciente
                          </label>
                          <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 shadow-md overflow-hidden">
                            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4 text-white">
                              <div className="flex items-center gap-3">
                                <CheckCircle className="h-6 w-6" />
                                <div>
                                  <h3 className="font-bold text-lg">Resumo Gerado com Sucesso</h3>
                                  <p className="text-sm text-white/90">Orientações claras para o paciente</p>
                                </div>
                              </div>
                            </div>
                            <CardContent className="p-6 space-y-4">
                              <div className="bg-white rounded-xl p-5 border border-green-200 shadow-sm">
                                <div className="flex items-center gap-3 mb-3">
                                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#8C00FF] to-[#450693] flex items-center justify-center shrink-0">
                                    <span className="text-white text-sm font-bold">1</span>
                                  </div>
                                  <h4 className="font-bold text-gray-900">O que você tem:</h4>
                                </div>
                                <p className="text-sm text-gray-700 ml-11 leading-relaxed">
                                  {patientSummary.explanation}
                                </p>
                              </div>

                              <div className="bg-white rounded-xl p-5 border border-green-200 shadow-sm">
                                <div className="flex items-center gap-3 mb-3">
                                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#FF3F7F] to-[#FF1654] flex items-center justify-center shrink-0">
                                    <span className="text-white text-sm font-bold">2</span>
                                  </div>
                                  <h4 className="font-bold text-gray-900">O que fazer:</h4>
                                </div>
                                <ul className="space-y-2 ml-11">
                                  {patientSummary.whatToDo.map((item, idx) => (
                                    <li key={idx} className="text-sm flex items-start gap-2">
                                      <CheckCircle2 className="h-4 w-4 text-[#FF3F7F] mt-0.5 shrink-0" />
                                      <span className="text-gray-700">{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div className="bg-white rounded-xl p-5 border border-green-200 shadow-sm">
                                <div className="flex items-center gap-3 mb-3">
                                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#FFC400] to-[#FF9500] flex items-center justify-center shrink-0">
                                    <span className="text-white text-sm font-bold">3</span>
                                  </div>
                                  <h4 className="font-bold text-gray-900">Quando retornar:</h4>
                                </div>
                                <ul className="space-y-2 ml-11">
                                  {patientSummary.whenToReturn.map((item, idx) => (
                                    <li key={idx} className="text-sm flex items-start gap-2">
                                      <AlertCircle className="h-4 w-4 text-[#FFC400] mt-0.5 shrink-0" />
                                      <span className="text-gray-700">{item}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      )}
                    </CardContent>
                  </ScrollArea>

                  {/* Footer */}
                  <div className="border-t border-gray-200 bg-gray-50 p-6">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <AlertCircle className="h-4 w-4" />
                        <span>As alterações são salvas automaticamente</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Button
                          onClick={() => setShowNoteSection(false)}
                          variant="outline"
                          className="border-gray-300 hover:bg-gray-100"
                        >
                          Continuar Editando
                        </Button>
                        {patientSummary && (
                          <Button
                            onClick={handleFinishConsultation}
                            className="bg-gradient-to-r from-[#8C00FF] to-[#450693] text-white hover:opacity-90 shadow-lg h-11 px-8"
                          >
                            <CheckCircle className="mr-2 h-5 w-5" />
                            {config.finishConsultationAction}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}