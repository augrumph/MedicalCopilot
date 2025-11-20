import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft,  AlertTriangle, CheckCircle2, TrendingUp, MessageCircle, Target, Lightbulb, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/stores/appStore';
import { psychologyPatients, psychologySessions } from '@/lib/psychologyMockData';
import type { Patient, Consultation } from '@/lib/types';

export function SessionDetailsPage() {
  const navigate = useNavigate();
  const { id: sessionId } = useParams<{ id: string }>();
  const { appContext, consultations: medicalConsultations, patients: medicalPatients } = useAppStore();
  // const config = getContextConfig(appContext);

  const [session, setSession] = useState<Consultation | null>(null);
  const [patient, setPatient] = useState<Patient | null>(null);

  useEffect(() => {
    if (!sessionId) return;

    const consultations = appContext === 'psychology' ? psychologySessions : medicalConsultations;
    const patients = appContext === 'psychology' ? psychologyPatients : medicalPatients;

    const foundSession = consultations.find(c => c.id === sessionId);
    if (foundSession) {
      setSession(foundSession);
      const foundPatient = patients.find(p => p.id === foundSession.patientId);
      setPatient(foundPatient || null);
    }
  }, [sessionId, appContext, medicalConsultations, medicalPatients]);

  if (!session || !patient) {
    return <AppLayout title="" description=""><div className="flex items-center justify-center h-96"><p className="text-gray-500">Carregando...</p></div></AppLayout>;
  }

  const formatDate = (date: string) => new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
  const daysSince = session.startedAt ? Math.floor((Date.now() - new Date(session.startedAt).getTime()) / (1000 * 60 * 60 * 24)) : 0;

  return (
    <AppLayout title="" description="">
      <div className="space-y-5 max-w-5xl mx-auto">

        {/* 1. QUEM É? - Header Compacto */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between pb-2">
          <Button variant="ghost" onClick={() => navigate('/history')} className="gap-2 hover:bg-gray-100">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <Badge className="bg-green-100 text-green-700 border-0 px-3 py-1">
            Há {daysSince}d
          </Badge>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-0 shadow-sm bg-gradient-to-r from-purple-600 to-blue-600">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-white/20 flex items-center justify-center text-white font-bold text-xl">
                    {patient.name.charAt(0)}
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-white">{patient.name}</h1>
                    <div className="flex items-center gap-2 text-xs text-purple-100">
                      <span>{patient.age} anos</span>
                      <span>•</span>
                      <span>{formatDate(session.startedAt)}</span>
                    </div>
                  </div>
                </div>
                {patient.mainConditions?.[0] && (
                  <Badge className="bg-white/20 text-white border-0 text-xs px-2 py-1">
                    {patient.mainConditions[0]}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 2. O QUE PERGUNTAR? - PRIORIDADE MÁXIMA */}
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
          <Card className="border-2 border-blue-500 shadow-2xl bg-gradient-to-br from-blue-50 via-white to-blue-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-5 pb-4 border-b-2 border-blue-200">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                  <MessageCircle className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Perguntar Hoje</h2>
                  <p className="text-sm text-blue-600">O que verificar nesta sessão</p>
                </div>
              </div>
              <div className="grid gap-3">
                {[
                  'Como foi o registro de pensamentos? Identificou padrões?',
                  'Praticou respiração diafragmática? Notou melhora na ansiedade?',
                  'Conseguiu fazer a exposição (conversa com colega)? Como foi?',
                  'Houve algum pico de ansiedade esta semana? Como lidou?'
                ].map((q, i) => (
                  <div key={i} className="flex gap-3 items-start bg-white rounded-xl p-4 border border-blue-200 hover:border-blue-400 transition-colors">
                    <div className="h-7 w-7 rounded-lg bg-blue-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {i + 1}
                    </div>
                    <p className="text-sm text-gray-800 leading-relaxed pt-0.5">{q}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 3. O QUE ACONTECEU? - Resumo da Última Sessão em 3 Cards */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3 px-1">Última Sessão</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Demanda */}
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <MessageCircle className="h-4 w-4 text-purple-600" />
                  <h4 className="font-bold text-xs text-gray-900 uppercase">Demanda</h4>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed">
                  Ansiedade social no trabalho. Evitação de reuniões e apresentações.
                </p>
              </CardContent>
            </Card>

            {/* Intervenções */}
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Activity className="h-4 w-4 text-green-600" />
                  <h4 className="font-bold text-xs text-gray-900 uppercase">Intervenções</h4>
                </div>
                <ul className="space-y-1">
                  {['Reestruturação cognitiva', 'Respiração diafragmática', 'Psicoeducação TAS'].map((item, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs text-gray-700">
                      <CheckCircle2 className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Tarefas */}
            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow bg-amber-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="h-4 w-4 text-amber-600" />
                  <h4 className="font-bold text-xs text-gray-900 uppercase">Tarefas</h4>
                </div>
                <ul className="space-y-1">
                  {['Registrar pensamentos 3x/dia', 'Respiração 2x/dia', 'Conversa breve c/ colega'].map((item, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-xs text-gray-700">
                      <span className="text-amber-600 flex-shrink-0">○</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

          </div>
        </motion.div>

        {/* 4. CUIDADO! - Alertas e Progresso lado a lado */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Alertas */}
            <Card className="border-0 shadow-md bg-red-50 border-l-4 border-l-red-500">
              <CardContent className="p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 mb-2">⚠️ Pontos de Atenção</h4>
                    <ul className="space-y-1 text-xs text-gray-700">
                      <li>• Pico de ansiedade esta semana</li>
                      <li>• Dificuldade em exposições</li>
                      <li>• Considerar avaliação psiquiátrica</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Progresso */}
            <Card className="border-0 shadow-md bg-green-50 border-l-4 border-l-green-500">
              <CardContent className="p-4">
                <div className="flex items-start gap-2">
                  <TrendingUp className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-bold text-sm text-gray-900 mb-2">📈 Evolução</h4>
                    <ul className="space-y-1 text-xs text-gray-700">
                      <li>• Consciência sobre pensamentos +</li>
                      <li>• Evitação social -40%</li>
                      <li>• Qualidade do sono melhorou</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </motion.div>

        {/* 5. PARA ONDE? - Focos para Esta Sessão */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="border-0 shadow-md bg-gradient-to-r from-purple-50 to-blue-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-8 w-8 rounded-lg bg-purple-600 flex items-center justify-center">
                  <Target className="h-4 w-4 text-white" />
                </div>
                <h4 className="font-bold text-sm text-gray-900">🎯 Focos para Esta Sessão</h4>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  'Revisar registro de pensamentos',
                  'Avançar na hierarquia de exposições',
                  'Trabalhar assertividade e limites'
                ].map((focus, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-gray-700 bg-white rounded-lg p-3">
                    <span className="text-purple-600 font-bold flex-shrink-0">→</span>
                    <span>{focus}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* 6. DIAGNÓSTICO - Hipóteses no final */}
        {session.aiSuggestions && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="h-4 w-4 text-amber-600" />
                  <h4 className="font-bold text-xs text-gray-900 uppercase">Hipóteses</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {session.aiSuggestions.diagnosesMostLikely?.map((d, i) => (
                    <Badge key={i} className="bg-green-100 text-green-800 border-green-300 text-xs px-2 py-1">{d}</Badge>
                  ))}
                  {session.aiSuggestions.diagnosesToConsider?.map((d, i) => (
                    <Badge key={i} className="bg-yellow-100 text-yellow-800 border-yellow-300 text-xs px-2 py-1">{d}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

      </div>
    </AppLayout>
  );
}
