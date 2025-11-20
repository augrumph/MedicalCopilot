import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  FileText,
  User,
  Stethoscope,
  Mic,
  MicOff,
  Brain,
  Lightbulb,
  Pill,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileCheck,
  Printer,
  Download,
  CheckCircle,
  Target,
  Heart,
  Clock
} from 'lucide-react';
import PrescriptionQRCode from '@/components/PrescriptionQRCode';
import MedicationCard from '@/components/MedicationCard';
import ControlledMedicationCard from '@/components/ControlledMedicationCard';
import PrescriptionMedicationCard from '@/components/PrescriptionMedicationCard';
import { AppLayout } from '@/components/AppLayout';
import { AIChatPanel } from '@/components/consultation/AIChatPanel';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/stores/appStore';
import { generateClinicalNote } from '@/lib/mockApi';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { getContextConfig } from '@/lib/contextConfig';
import { PsychologyClinicalHypothesis } from '@/components/psychology/PsychologyClinicalHypothesis';
import { TherapeuticInterventions } from '@/components/psychology/TherapeuticInterventions';
import { SessionThemesAndGoals } from '@/components/psychology/SessionThemesAndGoals';

export function ConsultationPage() {
  const navigate = useNavigate();
  const {
    currentConsultation,
    selectedPatient,
    updateTranscript,
    setDoctorNotes,
    doctorName,
    doctorSpecialty,
    appContext,
  } = useAppStore();
  const config = getContextConfig(appContext);

  const [isListening, setIsListening] = useState(false);
  const [isGeneratingNote, setIsGeneratingNote] = useState(false);
  const [noteGenerated, setNoteGenerated] = useState(false);
  const [showNoteSection, setShowNoteSection] = useState(false);
  const [activeTab, setActiveTab] = useState<'ai' | 'diagnosis' | 'medication' | 'prescription' | 'themes' | 'interventions'>('ai');
  const [prescriptionGenerated, setPrescriptionGenerated] = useState(false);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [prescriptionMedications, setPrescriptionMedications] = useState<any[]>([]);
  const [crm] = useState('123456');
  const [uf] = useState('SP');
  const [signatureType] = useState<'icp-brasil-mock' | 'icp-brasil-a3' | 'icp-brasil-a1'>('icp-brasil-mock');

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

  const suggestedMedications: Array<{
    name: string;
    concentration: string;
    form: string;
    via: string;
    dosage: string;
    duration: string;
    quantity: string;
    quantityText: string;
    indication: string;
    type: 'primary' | 'alternative' | 'optional' | 'controlled';
    isControlled: boolean;
    controlledType: string | null;
  }> = [
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

  return (
    <AppLayout>
      <div className="flex flex-col h-[calc(100vh-4rem)]">
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
                className={`h-10 shadow-md transition-all text-white ${isListening
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

                          {suggestedMedications.filter(med => !med.isControlled).length > 0 && (
                            <Card className="border-0 shadow-lg bg-white">
                              <CardContent className="p-8">
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
                                      <p className="text-xs text-gray-600">Idade</p>
                                      <p className="text-sm font-semibold text-gray-900">{selectedPatient?.age} anos</p>
                                    </div>
                                  </div>
                                </div>

                                <div className="mb-6">
                                  <div className="flex items-center justify-between gap-2 mb-4">
                                    <div className="flex items-center gap-2">
                                      <Pill className="h-5 w-5 text-[#8C00FF]" />
                                      <h3 className="font-bold text-lg text-gray-900">Prescrição</h3>
                                    </div>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="border-[#8C00FF] text-[#8C00FF] hover:bg-[#8C00FF]/10"
                                      onClick={() => {
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
                                        onEdit={(updatedMed) => {
                                          setPrescriptionMedications(prev =>
                                            prev.map((m, i) => i === idx ? { ...m, ...updatedMed } : m)
                                          );
                                        }}
                                        onDelete={() => {
                                          setPrescriptionMedications(prev =>
                                            prev.filter((_m, i) => i !== idx)
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

                                <div className="border-t-2 border-gray-200 pt-6 space-y-6">
                                  <div className="flex justify-between items-end">
                                    <div>
                                      <p className="text-sm font-semibold text-gray-900">
                                        Validade: 30 dias a partir da data de emissão
                                      </p>
                                    </div>
                                    <div className="text-center">
                                      <div className="mb-12"></div>
                                      <div className="border-t-2 border-gray-900 w-72 mb-2"></div>
                                      <p className="font-bold text-gray-900 text-sm">{doctorName}</p>
                                      <p className="text-sm text-gray-700">CRM-{uf} {crm}</p>
                                    </div>
                                  </div>

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
                                        <span className="ml-1">{new Date().toLocaleDateString('pt-BR')} às {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                                      </p>
                                      <p className="text-xs text-gray-600 leading-relaxed">
                                        <span className="font-semibold text-gray-900">Tipo de certificado:</span>
                                        <span className="ml-1">ICP-Brasil {signatureType.toUpperCase().replace('ICP-BRASIL-', '')}</span>
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex justify-between items-start pt-4">
                                    <div>
                                      <p className="text-xs font-semibold text-gray-700">ID da receita:</p>
                                      <p className="text-sm font-mono text-gray-900">RX-2025-00001234</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                      <div className="w-20 h-20 bg-white p-2 border border-gray-300 rounded">
                                        <PrescriptionQRCode prescriptionId="RX-2025-00001234" />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )}

                          {suggestedMedications.some(med => med.isControlled) && (
                            <Card className="border-0 shadow-lg bg-white border-2 border-red-600">
                              <CardContent className="p-8">
                                <div className="border-b-2 border-red-600 pb-6 mb-6">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <h2 className="text-2xl font-bold text-gray-900 mb-2">{doctorName}</h2>
                                      <p className="text-sm text-gray-700 font-medium">{doctorSpecialty}</p>
                                      <p className="text-sm text-gray-700">CRM-{uf} {crm}</p>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-lg font-bold text-red-600">NOTIFICAÇÃO DE RECEITA</p>
                                      <p className="text-sm text-red-600 font-medium mt-1">Psicotrópicos</p>
                                      <p className="text-sm text-gray-600 mt-2">Data: {new Date().toLocaleDateString('pt-BR')}</p>
                                    </div>
                                  </div>
                                </div>

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
                              </CardContent>
                            </Card>
                          )}

                          <div className="flex gap-3">
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
                          </div>
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

        {showSignatureModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
            <div className="bg-white p-4 rounded">
              Signature Modal Debug
              <button onClick={() => setShowSignatureModal(false)}>Close</button>
            </div>
          </div>
        )}

        <AnimatePresence>
          {showNoteSection && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowNoteSection(false)}
            >
              <div className="bg-white p-4 rounded">Debug</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
}
