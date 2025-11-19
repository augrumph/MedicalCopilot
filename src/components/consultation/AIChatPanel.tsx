import { useState, useEffect, useRef } from 'react';
import { Bot, Sparkles, AlertCircle, Lightbulb, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

interface AIMessage {
  id: string;
  type: 'recommendation' | 'question' | 'diagnosis' | 'reminder' | 'analysis';
  content: string;
  timestamp: Date;
  priority?: 'low' | 'medium' | 'high';
}

interface AIChatPanelProps {
  transcript: string;
  patientData?: any;
  isActive: boolean;
}

export function AIChatPanel({ transcript, patientData, isActive }: AIChatPanelProps) {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll automático para última mensagem
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Simular análise de IA quando a transcrição muda
  useEffect(() => {
    if (!isActive || !transcript) return;

    // Análise contínua - a cada nova fala
    const lines = transcript.split('\n');
    const lastLine = lines[lines.length - 1]?.toLowerCase() || '';

    if (!lastLine) return;

    const timer = setTimeout(() => {
      analyzeAndRespond(lastLine, lines.length);
    }, 1500); // Responde rápido após cada fala

    return () => clearTimeout(timer);
  }, [transcript]);

  const analyzeAndRespond = (lastLine: string, lineCount: number) => {
    setIsThinking(true);

    setTimeout(() => {
      const newMessages: AIMessage[] = [];

      // Primeira interação - boas-vindas
      if (lineCount === 1 && lastLine.includes('dor')) {
        newMessages.push({
          id: Date.now().toString(),
          type: 'analysis',
          content: '👋 Identifico que o paciente menciona dor. Vou acompanhar a consulta e dar sugestões em tempo real.',
          timestamp: new Date(),
          priority: 'low'
        });
      }

      // Detectar "dor de garganta"
      if (lastLine.includes('dor de garganta') || (lastLine.includes('dor') && lastLine.includes('garganta'))) {
        newMessages.push({
          id: (Date.now() + 1).toString(),
          type: 'question',
          content: '❓ PERGUNTAS ESSENCIAIS:\n• Há quanto tempo começou?\n• Piora ao engolir?\n• Tem febre associada?',
          timestamp: new Date(),
          priority: 'high'
        });

        newMessages.push({
          id: (Date.now() + 2).toString(),
          type: 'reminder',
          content: '🔍 EXAME FÍSICO:\n• Inspecionar orofaringe\n• Verificar placas/exsudato\n• Palpar linfonodos cervicais\n• Medir temperatura',
          timestamp: new Date(),
          priority: 'high'
        });
      }

      // Quando o médico pergunta sobre a dor
      if (lastLine.includes('médico') && (lastLine.includes('constante') || lastLine.includes('piora'))) {
        newMessages.push({
          id: (Date.now() + 3).toString(),
          type: 'recommendation',
          content: '👍 Ótima pergunta! Caracterizar a dor ajuda no diagnóstico diferencial.',
          timestamp: new Date(),
          priority: 'low'
        });
      }

      // Paciente menciona que piora ao engolir
      if (lastLine.includes('piora') && lastLine.includes('engul')) {
        newMessages.push({
          id: (Date.now() + 4).toString(),
          type: 'diagnosis',
          content: '💡 HIPÓTESES PRINCIPAIS:\n1️⃣ Faringite viral (60-70%)\n2️⃣ Faringite bacteriana (Strepto)\n3️⃣ Amigdalite aguda',
          timestamp: new Date(),
          priority: 'medium'
        });

        newMessages.push({
          id: (Date.now() + 5).toString(),
          type: 'question',
          content: '❓ PRÓXIMAS PERGUNTAS:\n• Tem tosse ou coriza?\n• Houve contato com pessoas doentes?\n• Está com rouquidão?',
          timestamp: new Date(),
          priority: 'medium'
        });
      }

      // Médico pergunta sobre febre
      if (lastLine.includes('médico') && lastLine.includes('febre')) {
        newMessages.push({
          id: (Date.now() + 6).toString(),
          type: 'recommendation',
          content: '👍 Pergunta crucial! Febre sugere processo infeccioso.',
          timestamp: new Date(),
          priority: 'low'
        });
      }

      // Paciente confirma febre
      if (lastLine.includes('febre') && lastLine.includes('38')) {
        newMessages.push({
          id: (Date.now() + 7).toString(),
          type: 'analysis',
          content: '🌡️ FEBRE 38°C detectada\n\n⚠️ Febre + odinofagia → Aumenta probabilidade de faringite bacteriana (Strepto pyogenes)',
          timestamp: new Date(),
          priority: 'high'
        });

        newMessages.push({
          id: (Date.now() + 8).toString(),
          type: 'reminder',
          content: '📋 CONSIDERAR:\n• Critérios de Centor (score para Strepto)\n• Teste rápido para Strepto se disponível\n• Cultura de orofaringe se indicado',
          timestamp: new Date(),
          priority: 'medium'
        });
      }

      // Paciente nega tosse
      if (lastLine.includes('tosse não') || (lastLine.includes('tosse') && lastLine.includes('não'))) {
        newMessages.push({
          id: (Date.now() + 9).toString(),
          type: 'analysis',
          content: '✅ AUSÊNCIA DE TOSSE\n\nIsso REDUZ a probabilidade de:\n• Gripe\n• COVID-19\n• Infecção respiratória viral comum',
          timestamp: new Date(),
          priority: 'medium'
        });
      }

      // Médico examina garganta
      if (lastLine.includes('examinar') || lastLine.includes('garganta agora')) {
        newMessages.push({
          id: (Date.now() + 10).toString(),
          type: 'recommendation',
          content: '👁️ Durante o exame, observe:\n• Grau de hiperemia\n• Presença de exsudato/placas\n• Tamanho das amígdalas\n• Úvula (edema/desvio)\n• Petéquias no palato',
          timestamp: new Date(),
          priority: 'high'
        });
      }

      // Médico descreve achados
      if (lastLine.includes('hiperemia') && lastLine.includes('edema')) {
        newMessages.push({
          id: (Date.now() + 11).toString(),
          type: 'analysis',
          content: '🔬 ACHADOS DO EXAME:\n✓ Hiperemia\n✓ Edema\n✗ Sem placas\n\n💭 Sugere mais VIRAL que bacteriano',
          timestamp: new Date(),
          priority: 'high'
        });

        newMessages.push({
          id: (Date.now() + 12).toString(),
          type: 'diagnosis',
          content: '🎯 DIAGNÓSTICO MAIS PROVÁVEL:\n\n**Faringite Viral Aguda**\n\nScore de Centor baixo:\n• Sem exsudato\n• Febre presente (+1)\n• Sem tosse (+1)\n= 2 pontos → Probabilidade viral',
          timestamp: new Date(),
          priority: 'high'
        });

        newMessages.push({
          id: (Date.now() + 13).toString(),
          type: 'recommendation',
          content: '💊 CONDUTA SUGERIDA:\n\n✅ Tratamento sintomático:\n• Analgésicos/antitérmicos\n• Hidratação\n• Repouso\n\n⚠️ Antibiótico: NÃO indicado\n\n📅 Retorno: Se piora ou sem melhora em 3-5 dias',
          timestamp: new Date(),
          priority: 'high'
        });
      }

      // Análise de dados do paciente
      if (patientData?.mainConditions?.length > 0 && messages.length < 2) {
        newMessages.push({
          id: (Date.now() + 14).toString(),
          type: 'reminder',
          content: `⚕️ HISTÓRICO DO PACIENTE:\n• ${patientData.mainConditions.join('\n• ')}\n\n⚠️ Considere interações medicamentosas!`,
          timestamp: new Date(),
          priority: 'medium'
        });
      }

      if (patientData?.medications?.length > 0 && lineCount > 3 && messages.length < 5) {
        newMessages.push({
          id: (Date.now() + 15).toString(),
          type: 'reminder',
          content: `💊 MEDICAÇÕES EM USO:\n• ${patientData.medications.join('\n• ')}\n\nVerifique interações antes de prescrever!`,
          timestamp: new Date(),
          priority: 'high'
        });
      }

      if (patientData?.allergies?.length > 0 && lineCount > 2 && messages.length < 3) {
        newMessages.push({
          id: (Date.now() + 16).toString(),
          type: 'reminder',
          content: `🚨 ALERGIAS REGISTRADAS:\n• ${patientData.allergies.join('\n• ')}\n\n❌ NÃO prescrever estes medicamentos!`,
          timestamp: new Date(),
          priority: 'high'
        });
      }

      // Filtrar mensagens duplicadas
      const uniqueMessages = newMessages.filter(msg =>
        !messages.some(existing => existing.content === msg.content)
      );

      if (uniqueMessages.length > 0) {
        setMessages(prev => [...prev, ...uniqueMessages]);
      }

      setIsThinking(false);
    }, 800);
  };

  const getMessageIcon = (type: AIMessage['type']) => {
    switch (type) {
      case 'question':
        return <MessageSquare className="h-4 w-4" />;
      case 'diagnosis':
        return <Lightbulb className="h-4 w-4" />;
      case 'reminder':
        return <AlertCircle className="h-4 w-4" />;
      case 'recommendation':
        return <Sparkles className="h-4 w-4" />;
      case 'analysis':
        return <Bot className="h-4 w-4" />;
    }
  };

  const getMessageColor = (type: AIMessage['type']) => {
    switch (type) {
      case 'question':
        return 'bg-gradient-to-br from-[#8C00FF]/10 to-[#450693]/5 border border-[#8C00FF]/30';
      case 'diagnosis':
        return 'bg-gradient-to-br from-[#FFC400]/10 to-[#FF9500]/5 border border-[#FFC400]/30';
      case 'reminder':
        return 'bg-gradient-to-br from-red-50 to-rose-50 border border-red-200';
      case 'recommendation':
        return 'bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200';
      case 'analysis':
        return 'bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200';
    }
  };

  const getTypeBadge = (type: AIMessage['type']) => {
    const labels = {
      question: 'Pergunta',
      diagnosis: 'Hipótese',
      reminder: 'Lembrete',
      recommendation: 'Recomendação',
      analysis: 'Análise'
    };
    return labels[type];
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#8C00FF] to-[#450693] flex items-center justify-center">
          <Bot className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-lg text-gray-900">Assistente IA</h3>
          <p className="text-sm text-gray-600">Análise em tempo real da consulta</p>
        </div>
        {isActive && (
          <Badge className="bg-green-500 text-white shadow-md">
            <div className="h-2 w-2 rounded-full bg-white mr-2 animate-pulse" />
            Ativo
          </Badge>
        )}
      </div>

      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full pr-4">
          {messages.length === 0 && !isThinking && (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#8C00FF] to-[#450693] rounded-full blur-2xl opacity-20 animate-pulse"></div>
                <div className="relative h-20 w-20 rounded-full bg-gradient-to-br from-[#8C00FF] to-[#450693] flex items-center justify-center mb-4 shadow-xl">
                  <Bot className="h-10 w-10 text-white" />
                </div>
              </div>
              <p className="text-sm text-gray-600">
                {isActive
                  ? 'Ouvindo a consulta... Vou ajudar em tempo real.'
                  : 'Inicie a gravação para ativar o assistente'}
              </p>
            </div>
          )}

          <div className="space-y-3">
            <AnimatePresence>
              {messages.map((message, idx) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className={`${getMessageColor(message.type)} shadow-md`}>
                    <CardContent className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getMessageIcon(message.type)}
                          <Badge className="text-xs font-semibold bg-gray-900 text-white">
                            {getTypeBadge(message.type)}
                          </Badge>
                        </div>
                        {message.priority === 'high' && (
                          <Badge className="text-xs font-semibold bg-red-500 text-white">
                            Urgente
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm leading-relaxed text-gray-900 whitespace-pre-line">{message.content}</p>
                      <p className="text-xs text-gray-500">
                        {message.timestamp.toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>

            {isThinking && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-3 text-sm text-gray-600 p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="flex gap-1">
                  <div className="h-2 w-2 rounded-full bg-[#8C00FF] animate-bounce" />
                  <div className="h-2 w-2 rounded-full bg-[#8C00FF] animate-bounce delay-100" />
                  <div className="h-2 w-2 rounded-full bg-[#8C00FF] animate-bounce delay-200" />
                </div>
                <span className="font-medium">Analisando consulta...</span>
              </motion.div>
            )}

            <div ref={scrollRef} />
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
