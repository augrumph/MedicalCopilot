import { useState, useEffect, useRef } from 'react';
import { Bot, Sparkles, AlertCircle, Lightbulb, MessageSquare } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AIMessage {
  id: string;
  type: 'recommendation' | 'question' | 'diagnosis' | 'reminder' | 'analysis';
  content: string;
  timestamp: Date;
  priority?: 'low' | 'medium' | 'high';
}

interface PatientData {
  mainConditions?: string[];
  medications?: string[];
  allergies?: string[];
}

interface AIChatPanelProps {
  transcript: string;
  patientData?: PatientData;
  isActive: boolean;
}

const MAX_MESSAGES = 20; // Limitar mensagens para performance

export function AIChatPanel({ transcript, patientData, isActive }: AIChatPanelProps) {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll automático para última mensagem
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'auto' }); // Changed to 'auto' for performance
    }
  }, [messages.length, isThinking]); // Only depend on length, not full array

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
      if (patientData?.mainConditions && patientData.mainConditions.length > 0 && messages.length < 2) {
        newMessages.push({
          id: (Date.now() + 14).toString(),
          type: 'reminder',
          content: `⚕️ HISTÓRICO DO PACIENTE:\n• ${patientData.mainConditions.join('\n• ')}\n\n⚠️ Considere interações medicamentosas!`,
          timestamp: new Date(),
          priority: 'medium'
        });
      }

      if (patientData?.medications && patientData.medications.length > 0 && lineCount > 3 && messages.length < 5) {
        newMessages.push({
          id: (Date.now() + 15).toString(),
          type: 'reminder',
          content: `💊 MEDICAÇÕES EM USO:\n• ${patientData.medications.join('\n• ')}\n\nVerifique interações antes de prescrever!`,
          timestamp: new Date(),
          priority: 'high'
        });
      }

      if (patientData?.allergies && patientData.allergies.length > 0 && lineCount > 2 && messages.length < 3) {
        newMessages.push({
          id: (Date.now() + 16).toString(),
          type: 'reminder',
          content: `🚨 ALERGIAS REGISTRADAS:\n• ${patientData.allergies.join('\n• ')}\n\n❌ NÃO prescrever estes medicamentos!`,
          timestamp: new Date(),
          priority: 'high'
        });
      }

      // Filtrar mensagens duplicadas usando Set para melhor performance
      const existingContents = new Set(messages.map(m => m.content));
      const uniqueMessages = newMessages.filter(msg => !existingContents.has(msg.content));

      if (uniqueMessages.length > 0) {
        setMessages(prev => {
          const updated = [...prev, ...uniqueMessages];
          // Limitar a MAX_MESSAGES mensagens mais recentes
          return updated.length > MAX_MESSAGES ? updated.slice(-MAX_MESSAGES) : updated;
        });
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

  const getMessageStyles = (type: AIMessage['type']) => {
    switch (type) {
      case 'question':
        return {
          bg: 'bg-violet-50',
          border: 'border-violet-100',
          text: 'text-violet-900',
          iconBg: 'bg-violet-100',
          iconColor: 'text-violet-600'
        };
      case 'diagnosis':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-100',
          text: 'text-amber-900',
          iconBg: 'bg-amber-100',
          iconColor: 'text-amber-600'
        };
      case 'reminder':
        return {
          bg: 'bg-rose-50',
          border: 'border-rose-100',
          text: 'text-rose-900',
          iconBg: 'bg-rose-100',
          iconColor: 'text-rose-600'
        };
      case 'recommendation':
        return {
          bg: 'bg-emerald-50',
          border: 'border-emerald-100',
          text: 'text-emerald-900',
          iconBg: 'bg-emerald-100',
          iconColor: 'text-emerald-600'
        };
      case 'analysis':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-100',
          text: 'text-blue-900',
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600'
        };
    }
  };

  const getTypeBadge = (type: AIMessage['type']) => {
    const labels = {
      question: 'Pergunta Sugerida',
      diagnosis: 'Hipótese Diagnóstica',
      reminder: 'Alerta Clínico',
      recommendation: 'Recomendação',
      analysis: 'Análise em Tempo Real'
    };
    return labels[type];
  };

  return (
    <div className="h-full flex flex-col bg-gray-50/30">
      <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center shadow-lg shadow-primary/20">
              <Bot className="h-6 w-6 text-white" />
            </div>
            {isActive && (
              <span className="absolute -bottom-1 -right-1 inline-flex rounded-full h-3 w-3 bg-green-500 border-2 border-white"></span>
            )}
          </div>
          <div>
            <h3 className="font-bold text-gray-900 leading-tight">Copilot Médico</h3>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              {isActive ? (
                <span className="text-green-600 font-medium">Monitorando consulta...</span>
              ) : (
                <span>Aguardando início...</span>
              )}
            </p>
          </div>
        </div>
        <Badge variant="outline" className="bg-white/50">
          v2.0
        </Badge>
      </div>

      <div className="flex-1 overflow-hidden relative">
        <ScrollArea className="h-full px-4 py-6">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.length === 0 && !isThinking && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-purple-600 rounded-full blur-3xl opacity-10 animate-pulse"></div>
                  <div className="relative h-24 w-24 rounded-2xl bg-white shadow-xl flex items-center justify-center ring-1 ring-gray-100">
                    <Bot className="h-12 w-12 text-primary/80" />
                  </div>
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  {isActive ? 'Ouvindo a consulta...' : 'Pronto para ajudar'}
                </h4>
                <p className="text-gray-500 max-w-sm mx-auto leading-relaxed">
                  {isActive
                    ? 'Estou analisando o diálogo em tempo real para fornecer insights clínicos relevantes.'
                    : 'Inicie a gravação para ativar o assistente de inteligência artificial.'}
                </p>
              </div>
            )}

            <AnimatePresence mode="popLayout">
              {messages.map((message) => {
                const styles = getMessageStyles(message.type);
                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className={cn(
                      "group relative rounded-2xl border p-5 shadow-sm transition-all hover:shadow-md",
                      styles.bg,
                      styles.border
                    )}>
                      <div className="flex items-start gap-4">
                        <div className={cn(
                          "h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ring-2 ring-white",
                          styles.iconBg,
                          styles.iconColor
                        )}>
                          {getMessageIcon(message.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <span className={cn("text-xs font-bold uppercase tracking-wider", styles.text)}>
                              {getTypeBadge(message.type)}
                            </span>
                            <span className="text-[10px] text-gray-400 font-medium">
                              {message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <div className="prose prose-sm max-w-none">
                            <p className="text-gray-800 leading-relaxed whitespace-pre-line font-medium">
                              {message.content}
                            </p>
                          </div>
                        </div>
                      </div>
                      {message.priority === 'high' && (
                        <div className="absolute -top-2 -right-2">
                          <span className="inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-white"></span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {isThinking && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center gap-3 text-sm text-gray-500 p-4 bg-white/50 rounded-xl border border-gray-100 shadow-sm w-fit mx-auto"
              >
                <div className="flex gap-1.5">
                  <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="h-2 w-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="font-medium">Processando contexto clínico...</span>
              </motion.div>
            )}

            <div ref={scrollRef} className="h-4" />
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
