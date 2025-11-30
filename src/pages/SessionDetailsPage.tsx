import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, MessageCircle, Stethoscope, AlertCircle, FileText, Pill, Activity, TrendingUp, Image, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/stores/appStore';
import type { Patient, Consultation } from '@/lib/types';
import { getPatientAvatar } from '@/lib/utils';

export function SessionDetailsPage() {
  const navigate = useNavigate();
  const { id: consultationId } = useParams<{ id: string }>();
  const { consultations, patients } = useAppStore();

  const [consultation, setConsultation] = useState<Consultation | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);

  useEffect(() => {
    if (!consultationId) return;

    const foundConsultation = consultations.find(c => c.id === consultationId);
    if (foundConsultation) {
      setConsultation(foundConsultation);
      const foundPatient = patients.find(p => p.id === foundConsultation.patientId);
      setPatient(foundPatient || null);
    }
  }, [consultationId, consultations, patients]);

  if (!consultation || !patient) {
    return (
      <AppLayout title="" description="">
        <div className="flex items-center justify-center h-96">
          <p className="text-gray-500">Carregando...</p>
        </div>
      </AppLayout>
    );
  }

  const formatDate = (date: string) => new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const daysSince = Math.floor((Date.now() - new Date(consultation.startedAt).getTime()) / (1000 * 60 * 60 * 24));
  const diagnosis = consultation.aiSuggestions?.diagnosesMostLikely?.[0] || 'Sem diagnóstico registrado';

  // Gerar perguntas inteligentes baseadas no contexto
  const generateQuestions = (): string[] => {
    const questions: string[] = [];

    questions.push(`Como você tem se sentido desde ${formatDate(consultation.startedAt)}?`);

    if (diagnosis !== 'Sem diagnóstico registrado') {
      questions.push(`Os sintomas de ${diagnosis.toLowerCase()} melhoraram, pioraram ou continuam iguais?`);
    }

    if (patient.medications && patient.medications.length > 0) {
      questions.push(`Está tomando ${patient.medications[0]} regularmente? Teve algum efeito colateral?`);
    } else {
      questions.push('Está usando alguma medicação por conta própria?');
    }

    questions.push('Apareceu algum sintoma novo desde a última consulta?');
    questions.push('Como está sua rotina? Consegue realizar as atividades do dia a dia normalmente?');

    return questions;
  };

  const suggestedQuestions = generateQuestions();
  const hasAttachments = patient.attachments && patient.attachments.length > 0;

  return (
    <AppLayout title="" description="">
      <div className="flex flex-col h-full max-w-[1900px] mx-auto">
        {/* Header Compacto */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 mb-4 border-b"
        >
          <Button variant="ghost" onClick={() => navigate('/patients')} className="gap-2 h-9">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <Badge className="bg-green-100 text-green-700 border-0 px-3 py-1 text-xs">
              <Calendar className="h-3 w-3 mr-1" />
              Há {daysSince} dia{daysSince !== 1 ? 's' : ''}
            </Badge>
            <Button
              onClick={() => navigate('/patients')}
              size="sm"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 text-white h-9 text-xs"
            >
              Iniciar Nova Consulta
            </Button>
          </div>
        </motion.div>

        {/* Layout Responsivo - 1 coluna mobile, 2 colunas desktop */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 overflow-auto">

          {/* COLUNA ESQUERDA - Perguntas + Info Paciente */}
          <div className="flex flex-col gap-4">

            {/* Patient Header Compacto */}
            <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
              <Card className="border-0 shadow-sm bg-gradient-to-r from-purple-600 to-blue-600">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={getPatientAvatar(patient.name)}
                      alt={patient.name}
                      className="h-12 w-12 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h1 className="text-base sm:text-lg font-bold text-white truncate">{patient.name}</h1>
                      <div className="flex items-center gap-2 text-xs text-purple-100">
                        <span>{patient.age} anos</span>
                        <span>•</span>
                        <span>{patient.gender === 'masculino' ? 'M' : 'F'}</span>
                        <span>•</span>
                        <span className="hidden sm:inline">{formatDate(consultation.startedAt)}</span>
                      </div>
                    </div>
                    {patient.mainConditions?.[0] && (
                      <Badge className="bg-white/20 text-white border-0 text-xs px-2 py-1 flex-shrink-0 hidden sm:inline-flex">
                        {patient.mainConditions[0]}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* PERGUNTAS SUGERIDAS */}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 }}
            >
              <Card className="border-2 border-blue-500 shadow-md bg-gradient-to-br from-blue-50 to-white">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3 pb-3 border-b border-blue-200">
                    <div className="h-9 w-9 rounded-lg bg-blue-500 flex items-center justify-center shadow-sm flex-shrink-0">
                      <MessageCircle className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-sm sm:text-base font-bold text-gray-900">Perguntar Hoje</h2>
                      <p className="text-xs text-blue-600">Verificar nesta consulta</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {suggestedQuestions.map((question, i) => (
                      <div
                        key={i}
                        className="flex gap-2 items-start bg-white rounded-lg p-3 border border-blue-200 hover:border-blue-400 transition-colors"
                      >
                        <div className="h-6 w-6 rounded-md bg-blue-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                          {i + 1}
                        </div>
                        <p className="text-xs sm:text-sm text-gray-800 leading-relaxed">{question}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Perguntas Sugeridas pela IA */}
            {consultation.aiSuggestions?.suggestedQuestions && consultation.aiSuggestions.suggestedQuestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="border-0 shadow-sm bg-indigo-50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Activity className="h-4 w-4 text-indigo-600" />
                      <h4 className="font-bold text-xs text-gray-900 uppercase">Sugestões da IA</h4>
                    </div>
                    <ul className="space-y-2">
                      {consultation.aiSuggestions.suggestedQuestions.slice(0, 3).map((q, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-gray-700 bg-white rounded-md p-2 border border-indigo-200">
                          <span className="text-indigo-600 font-bold mt-0.5">→</span>
                          <span>{q}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* COLUNA DIREITA - Resumo Detalhado */}
          <div className="flex flex-col gap-4">

            {/* Header Resumo */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-gray-600" />
                <h3 className="text-xs sm:text-sm font-bold text-gray-600 uppercase tracking-wide">
                  Resumo da Última Consulta
                </h3>
              </div>
            </motion.div>

            {/* Grid de Cards - Responsivo 1 ou 2 colunas */}
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-3"
            >
              {/* Diagnóstico Principal */}
              <Card className="border-0 shadow-sm">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Stethoscope className="h-3.5 w-3.5 text-purple-600" />
                    <h4 className="font-bold text-[10px] sm:text-xs text-gray-900 uppercase tracking-wide">Diagnóstico</h4>
                  </div>
                  <Badge className="bg-purple-100 text-purple-700 border-purple-200 text-xs px-2 py-1">
                    {diagnosis}
                  </Badge>
                  {consultation.aiSuggestions?.diagnosesPossible && consultation.aiSuggestions.diagnosesPossible.length > 0 && (
                    <div className="mt-2">
                      <p className="text-[10px] text-gray-500 mb-1">Possíveis:</p>
                      <div className="flex flex-wrap gap-1">
                        {consultation.aiSuggestions.diagnosesPossible.slice(0, 2).map((d, i) => (
                          <Badge key={i} className="bg-gray-100 text-gray-600 border-0 text-[10px] px-1.5 py-0.5">
                            {d}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Medicações */}
              <Card className="border-0 shadow-sm">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Pill className="h-3.5 w-3.5 text-green-600" />
                    <h4 className="font-bold text-[10px] sm:text-xs text-gray-900 uppercase tracking-wide">Medicações</h4>
                  </div>
                  {patient.medications && patient.medications.length > 0 ? (
                    <ul className="space-y-1">
                      {patient.medications.map((med, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-xs text-gray-700">
                          <span className="text-green-600 mt-0.5 text-[10px]">●</span>
                          <span className="text-[10px] sm:text-[11px]">{med}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-gray-500 italic">Sem prescrição</p>
                  )}
                </CardContent>
              </Card>

              {/* Alertas */}
              <Card className="border-0 shadow-sm bg-red-50">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="h-3.5 w-3.5 text-red-600" />
                    <h4 className="font-bold text-[10px] sm:text-xs text-gray-900 uppercase tracking-wide">Alertas</h4>
                  </div>
                  {patient.allergies && patient.allergies.length > 0 ? (
                    <div>
                      <p className="text-[10px] text-red-700 font-semibold mb-1">⚠️ Alergias:</p>
                      <p className="text-[10px] sm:text-[11px] text-gray-700">{patient.allergies.join(', ')}</p>
                    </div>
                  ) : (
                    <p className="text-[10px] sm:text-[11px] text-gray-600">Verificar adesão ao tratamento</p>
                  )}
                  {consultation.aiSuggestions?.diagnosesCantMiss && consultation.aiSuggestions.diagnosesCantMiss.length > 0 && (
                    <div className="mt-2">
                      <p className="text-[10px] text-red-700 font-semibold mb-1">🚨 Não Perder:</p>
                      {consultation.aiSuggestions.diagnosesCantMiss.map((d, i) => (
                        <Badge key={i} className="bg-red-100 text-red-700 border-0 text-[10px] px-1.5 py-0.5 mt-1 block w-fit">
                          {d}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Lembretes */}
              <Card className="border-0 shadow-sm bg-amber-50">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="h-3.5 w-3.5 text-amber-600" />
                    <h4 className="font-bold text-[10px] sm:text-xs text-gray-900 uppercase tracking-wide">Lembretes</h4>
                  </div>
                  {consultation.aiSuggestions?.reminders && consultation.aiSuggestions.reminders.length > 0 ? (
                    <ul className="space-y-1">
                      {consultation.aiSuggestions.reminders.slice(0, 3).map((reminder, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-[10px] sm:text-[11px] text-gray-700">
                          <span className="text-amber-600 mt-0.5">○</span>
                          <span>{reminder}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs text-gray-500 italic">Sem lembretes</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Exames / Anexos */}
            {hasAttachments && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Image className="h-4 w-4 text-blue-600" />
                      <h4 className="font-bold text-xs sm:text-sm text-gray-900">Exames e Imagens</h4>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {patient.attachments?.map((attachment, i) => (
                        <div key={i} className="relative group">
                          <div className="aspect-square rounded-lg border-2 border-gray-200 overflow-hidden bg-gray-50 hover:border-blue-500 transition-colors cursor-pointer">
                            {attachment.type?.startsWith('image/') ? (
                              <img
                                src={attachment.url}
                                alt={attachment.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <FileText className="h-8 w-8 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <p className="text-[10px] text-gray-600 mt-1 truncate">{attachment.name}</p>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="absolute top-1 right-1 h-6 w-6 p-0 bg-white/90 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => window.open(attachment.url, '_blank')}
                          >
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Notas Clínicas */}
            {consultation.doctorNotes && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 }}
              >
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="h-4 w-4 text-gray-600" />
                      <h4 className="font-bold text-xs sm:text-sm text-gray-900">Notas da Consulta</h4>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 max-h-40 overflow-y-auto">
                      <p className="text-[11px] sm:text-xs text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {consultation.doctorNotes}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Transcrição */}
            {consultation.transcript && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="border-0 shadow-sm bg-blue-50/30">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <MessageCircle className="h-4 w-4 text-blue-600" />
                      <h4 className="font-bold text-xs sm:text-sm text-gray-900">Transcrição da Consulta</h4>
                    </div>
                    <div className="bg-white rounded-lg p-3 max-h-40 overflow-y-auto">
                      <p className="text-[11px] sm:text-xs text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {consultation.transcript}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
