import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, User, Clock, CheckCircle2, AlertTriangle, Lightbulb, MessageSquare, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAppStore } from '@/stores/appStore';

export function ConsultationDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { consultations, patients, setSelectedConsultation } = useAppStore();

  const consultation = consultations.find(c => c.id === id);
  const patient = consultation ? patients.find(p => p.id === consultation.patientId) : null;

  useEffect(() => {
    if (consultation) {
      setSelectedConsultation(consultation);
    }
  }, [consultation, setSelectedConsultation]);

  if (!consultation || !patient) {
    return (
      <AppLayout title="Consulta não encontrada" description="Detalhes da consulta">
        <div className="flex flex-col items-center justify-center h-full py-20">
          <div className="h-24 w-24 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center mb-6">
            <AlertTriangle className="h-12 w-12 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Consulta não encontrada</h2>
          <p className="text-gray-600 mb-6">A consulta solicitada não existe ou foi removida.</p>
          <Button onClick={() => navigate('/dashboard')} className="bg-gradient-to-r from-[#8C00FF] to-[#450693]">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar ao Dashboard
          </Button>
        </div>
      </AppLayout>
    );
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatShortDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Extrair KPIs da consulta
  /*
    NOTA PARA IMPLEMENTAÇÃO COM IA:

    KPIs devem ser métricas objetivas e acionáveis, como:

    ✅ Exemplos de KPIs úteis:
    - Dias desde última consulta
    - Número de consultas nos últimos 3 meses
    - Número de medicações prescritas
    - Número de exames solicitados/pendentes
    - Alertas críticos (diagnósticos que não pode perder)
    - Taxa de aderência ao tratamento (se disponível)
    - Próximo retorno previsto (em X dias)
    - Sintomas principais (ex: "3 sintomas")

    A IA pode extrair da transcrição:
    - Escalas de dor (ex: "Dor 7/10")
    - Número de episódios (ex: "5 crises/semana")
    - Duração de sintomas (ex: "Há 15 dias")
    - Frequência (ex: "3x ao dia")
  */
  const extractKPIs = () => {
    const kpis: { label: string; value: string; color: string }[] = [];

    // Número de dias desde última consulta
    const daysSince = Math.floor((Date.now() - new Date(consultation.startedAt).getTime()) / (1000 * 60 * 60 * 24));
    kpis.push({
      label: 'Última consulta',
      value: daysSince === 0 ? 'Hoje' : `${daysSince}d atrás`,
      color: 'blue'
    });

    // Diagnóstico principal (texto curto)
    if (consultation.aiSuggestions?.diagnosesMostLikely && consultation.aiSuggestions.diagnosesMostLikely.length > 0) {
      const mainDiagnosis = consultation.aiSuggestions.diagnosesMostLikely[0];
      // Pegar apenas as primeiras 2-3 palavras
      const shortDiagnosis = mainDiagnosis.split(' ').slice(0, 3).join(' ');
      kpis.push({
        label: 'Diagnóstico',
        value: shortDiagnosis,
        color: 'green'
      });
    }

    // Número de medicações/orientações
    if (consultation.patientSummary?.whatToDo) {
      kpis.push({
        label: 'Orientações',
        value: `${consultation.patientSummary.whatToDo.length} itens`,
        color: 'purple'
      });
    }

    // Alertas críticos
    if (consultation.aiSuggestions?.diagnosesCantMiss && consultation.aiSuggestions.diagnosesCantMiss.length > 0) {
      kpis.push({
        label: '⚠️ Alertas',
        value: `${consultation.aiSuggestions.diagnosesCantMiss.length} críticos`,
        color: 'red'
      });
    }

    return kpis;
  };

  // Gerar perguntas CONTEXTUALIZADAS baseadas na consulta anterior
  // NOTA: Em produção, isso seria gerado pela IA com base na transcrição e queixas reais
  const generateContextualQuestions = () => {
    const questions: string[] = [];

    // Usar os lembretes da IA (que são específicos)
    if (consultation.aiSuggestions?.reminders && consultation.aiSuggestions.reminders.length > 0) {
      consultation.aiSuggestions.reminders.slice(0, 3).forEach(reminder => {
        questions.push(reminder);
      });
    }

    // Se não houver lembretes, criar perguntas baseadas em dados reais
    if (questions.length === 0) {
      // Exemplo de como a IA deve gerar (usando dados mockados como exemplo)
      // Em produção, a IA analisaria a transcrição para criar perguntas específicas

      if (consultation.aiSuggestions?.diagnosesMostLikely && consultation.aiSuggestions.diagnosesMostLikely.length > 0) {
        const diagnosis = consultation.aiSuggestions.diagnosesMostLikely[0];
        // Pergunta contextualizada com o diagnóstico específico
        questions.push(`[IA] Os sintomas de ${diagnosis} melhoraram, pioraram ou estão iguais?`);
      }

      if (consultation.patientSummary?.whatToDo && consultation.patientSummary.whatToDo.length > 0) {
        const firstOrientation = consultation.patientSummary.whatToDo[0];
        // Pergunta sobre aderência específica
        questions.push(`[IA] Conseguiu seguir: "${firstOrientation}"?`);
      }

      // Adicionar nota explicativa se não houver perguntas específicas
      if (questions.length === 0) {
        questions.push(
          "[IA gerará] Pergunta específica sobre a queixa principal",
          "[IA gerará] Pergunta sobre efeitos colaterais da medicação",
          "[IA gerará] Pergunta sobre evolução do sintoma mais importante"
        );
      }
    }

    return questions.slice(0, 3);
  };

  const kpis = extractKPIs();
  const suggestedQuestions = generateContextualQuestions();

  return (
    <AppLayout title="Consulta Anterior" description={patient.name}>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Button
            onClick={() => navigate(-1)}
            variant="ghost"
            size="sm"
            className="mb-4 -ml-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>

          <Card className="bg-gradient-to-r from-[#8C00FF] to-[#450693] text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold mb-1">{patient.name}</h1>
                  <div className="flex items-center gap-3 text-sm text-white/80">
                    <span>{patient.age} anos</span>
                    <span>•</span>
                    <span>{formatShortDate(consultation.startedAt)}</span>
                  </div>
                </div>
                <Badge className="bg-white/20 text-white border-0">
                  Última consulta
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* KPIs em destaque */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {kpis.map((kpi, idx) => (
              <Card key={idx} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    {kpi.label}
                  </div>
                  <div className={`text-2xl font-bold ${
                    kpi.color === 'blue' ? 'text-blue-600' :
                    kpi.color === 'green' ? 'text-green-600' :
                    kpi.color === 'purple' ? 'text-[#8C00FF]' :
                    'text-red-600'
                  }`}>
                    {kpi.value}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Coluna Esquerda - O que aconteceu */}
          <div className="space-y-6">
            {/* Resumo da Consulta Anterior */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardContent className="p-5">
                  <h3 className="font-bold text-base text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-[#8C00FF]" />
                    Resumo da Última Consulta
                  </h3>

                  <div className="space-y-4">
                    {/* Diagnóstico */}
                    {consultation.aiSuggestions?.diagnosesMostLikely && consultation.aiSuggestions.diagnosesMostLikely.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Diagnóstico</h4>
                        <ul className="space-y-1.5">
                          {consultation.aiSuggestions.diagnosesMostLikely.slice(0, 3).map((diagnosis, idx) => (
                            <li key={idx} className="text-sm text-gray-900 flex items-start gap-2">
                              <span className="text-green-600 font-bold">•</span>
                              <span>{diagnosis}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <Separator />

                    {/* Conduta */}
                    {consultation.patientSummary?.whatToDo && consultation.patientSummary.whatToDo.length > 0 && (
                      <div>
                        <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Conduta Anterior</h4>
                        <ul className="space-y-1.5">
                          {consultation.patientSummary.whatToDo.map((item, idx) => (
                            <li key={idx} className="text-sm text-gray-900 flex items-start gap-2">
                              <span className="text-[#8C00FF] font-bold">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Nota Clínica Resumida */}
                    {consultation.doctorNotes && (
                      <>
                        <Separator />
                        <div>
                          <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Observações</h4>
                          <p className="text-sm text-gray-700 line-clamp-4 leading-relaxed">
                            {consultation.doctorNotes}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Alertas Importantes */}
            {consultation.aiSuggestions?.diagnosesCantMiss && consultation.aiSuggestions.diagnosesCantMiss.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="border-l-4 border-l-red-500 bg-red-50/50">
                  <CardContent className="p-5">
                    <h3 className="font-bold text-base text-red-900 mb-3 flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      Diagnósticos que Não Pode Perder
                    </h3>
                    <ul className="space-y-2">
                      {consultation.aiSuggestions.diagnosesCantMiss.map((diagnosis, idx) => (
                        <li key={idx} className="text-sm text-red-900 flex items-start gap-2">
                          <span className="text-red-600 font-bold">!</span>
                          <span>{diagnosis}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Coluna Direita - O que fazer agora */}
          <div className="space-y-6">
            {/* Perguntas Sugeridas - DESTAQUE */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-2 border-[#FFC400] bg-gradient-to-br from-amber-50 to-yellow-50">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="h-10 w-10 rounded-lg bg-[#FFC400] flex items-center justify-center flex-shrink-0">
                      <MessageSquare className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-base text-gray-900">Perguntar ao Paciente</h3>
                      <p className="text-xs text-gray-600">Baseado na consulta anterior</p>
                    </div>
                  </div>

                  {/*
                    NOTA PARA IMPLEMENTAÇÃO COM IA:
                    Estas perguntas devem ser geradas pela IA analisando:
                    1. Queixas principais mencionadas pelo paciente
                    2. Sintomas específicos (intensidade, localização, características)
                    3. Medicações prescritas (dose, horário, via)
                    4. Exames solicitados
                    5. Orientações não farmacológicas

                    Exemplos de perguntas CONTEXTUALIZADAS (NÃO genéricas):
                    ✅ "A dor de cabeça que estava pulsátil e 8/10 melhorou?"
                    ✅ "Conseguiu tomar o Paracetamol 500mg de 8/8h conforme orientado?"
                    ✅ "Fez o exame de sangue que pedi? Trouxe o resultado?"
                    ✅ "A tontura ao levantar que tinha pela manhã ainda persiste?"

                    ❌ EVITAR perguntas genéricas:
                    ❌ "Como está se sentindo?"
                    ❌ "Melhorou?"
                    ❌ "Está tomando os remédios?"
                  */}

                  <div className="space-y-3">
                    {suggestedQuestions.map((question, idx) => (
                      <div key={idx} className="bg-white rounded-lg p-4 border border-amber-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-3">
                          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-[#FFC400] to-[#FF9500] flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
                            <span className="text-white text-sm font-bold">{idx + 1}</span>
                          </div>
                          <p className="text-sm font-medium text-gray-900 leading-relaxed flex-1">
                            {question}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 p-3 bg-amber-100/50 rounded-lg border border-amber-200">
                    <p className="text-xs text-amber-900 flex items-start gap-2">
                      <Lightbulb className="h-4 w-4 flex-shrink-0 mt-0.5" />
                      <span>
                        <strong>Dica:</strong> Estas perguntas são geradas pela IA com base nas queixas específicas da última consulta
                      </span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quando Retornar */}
            {consultation.patientSummary?.whenToReturn && consultation.patientSummary.whenToReturn.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="border-l-4 border-l-blue-500">
                  <CardContent className="p-5">
                    <h3 className="font-bold text-base text-gray-900 mb-3 flex items-center gap-2">
                      <Clock className="h-5 w-5 text-blue-600" />
                      Orientações de Retorno
                    </h3>
                    <ul className="space-y-2">
                      {consultation.patientSummary.whenToReturn.map((item, idx) => (
                        <li key={idx} className="text-sm text-gray-900 flex items-start gap-2">
                          <span className="text-blue-600 font-bold">→</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Explicação ao Paciente */}
            {consultation.patientSummary?.explanation && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card>
                  <CardContent className="p-5">
                    <h3 className="font-bold text-base text-gray-900 mb-3 flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-[#8C00FF]" />
                      Como Foi Explicado ao Paciente
                    </h3>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {consultation.patientSummary.explanation}
                    </p>
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
