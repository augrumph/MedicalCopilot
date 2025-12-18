import { useState, useEffect} from'react';
import { Bot} from'lucide-react';
import { Badge} from'@/components/ui/badge';
import { MessageList} from'@/components/ai/MessageList';
import type { Message} from'@/components/ai/StreamingMessage';

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

export function AIChatPanel({ transcript, patientData, isActive}: AIChatPanelProps) {
 const [messages, setMessages] = useState<Message[]>([]);
 const [isThinking, setIsThinking] = useState(false);

 // Simular análise de IA quando a transcrição muda
 useEffect(() => {
 if (!isActive || !transcript) return;

 // Análise contínua - a cada nova fala
 const lines = transcript.split('\n');
 const lastLine = lines[lines.length - 1]?.toLowerCase() ||'';

 if (!lastLine) return;

 const timer = setTimeout(() => {
 analyzeAndRespond(lastLine, lines.length);
}, 1500); // Responde rápido após cada fala

 return () => clearTimeout(timer);
}, [transcript]);

 const analyzeAndRespond = (lastLine: string, lineCount: number) => {
 setIsThinking(true);

 setTimeout(() => {
 const newMessages: Message[] = [];

 // Primeira interação - boas-vindas
 if (lineCount === 1 && lastLine.includes('dor')) {
 newMessages.push({
 id: Date.now().toString(),
 role:'assistant',
 type:'analysis',
 content:'👋 Identifico que o paciente menciona dor. Vou acompanhar a consulta e dar sugestões em tempo real.',
 timestamp: new Date(),
 priority:'low'
});
}

 // Detectar"dor de garganta"
 if (lastLine.includes('dor de garganta') || (lastLine.includes('dor') && lastLine.includes('garganta'))) {
 newMessages.push({
 id: (Date.now() + 1).toString(),
 role:'assistant',
 type:'question',
 content:'❓ PERGUNTAS ESSENCIAIS:\n• Há quanto tempo começou?\n• Piora ao engolir?\n• Tem febre associada?',
 timestamp: new Date(),
 priority:'high'
});

 newMessages.push({
 id: (Date.now() + 2).toString(),
 role:'assistant',
 type:'reminder',
 content:'🔍 EXAME FÍSICO:\n• Inspecionar orofaringe\n• Verificar placas/exsudato\n• Palpar linfonodos cervicais\n• Medir temperatura',
 timestamp: new Date(),
 priority:'high'
});
}

 // Quando o médico pergunta sobre a dor
 if (lastLine.includes('médico') && (lastLine.includes('constante') || lastLine.includes('piora'))) {
 newMessages.push({
 id: (Date.now() + 3).toString(),
 role:'assistant',
 type:'recommendation',
 content:'👍 Ótima pergunta! Caracterizar a dor ajuda no diagnóstico diferencial.',
 timestamp: new Date(),
 priority:'low'
});
}

 // Paciente menciona que piora ao engolir
 if (lastLine.includes('piora') && lastLine.includes('engul')) {
 newMessages.push({
 id: (Date.now() + 4).toString(),
 role:'assistant',
 type:'diagnosis',
 content:'💡 HIPÓTESES PRINCIPAIS:\n1️⃣ Faringite viral (60-70%)\n2️⃣ Faringite bacteriana (Strepto)\n3️⃣ Amigdalite aguda',
 timestamp: new Date(),
 priority:'medium'
});

 newMessages.push({
 id: (Date.now() + 5).toString(),
 role:'assistant',
 type:'question',
 content:'❓ PRÓXIMAS PERGUNTAS:\n• Tem tosse ou coriza?\n• Houve contato com pessoas doentes?\n• Está com rouquidão?',
 timestamp: new Date(),
 priority:'medium'
});
}

 // Médico pergunta sobre febre
 if (lastLine.includes('médico') && lastLine.includes('febre')) {
 newMessages.push({
 id: (Date.now() + 6).toString(),
 role:'assistant',
 type:'recommendation',
 content:'👍 Pergunta crucial! Febre sugere processo infeccioso.',
 timestamp: new Date(),
 priority:'low'
});
}

 // Paciente confirma febre
 if (lastLine.includes('febre') && lastLine.includes('38')) {
 newMessages.push({
 id: (Date.now() + 7).toString(),
 role:'assistant',
 type:'analysis',
 content:'🌡️ FEBRE 38°C detectada\n\n⚠️ Febre + odinofagia → Aumenta probabilidade de faringite bacteriana (Strepto pyogenes)',
 timestamp: new Date(),
 priority:'high'
});

 newMessages.push({
 id: (Date.now() + 8).toString(),
 role:'assistant',
 type:'reminder',
 content:'📋 CONSIDERAR:\n• Critérios de Centor (score para Strepto)\n• Teste rápido para Strepto se disponível\n• Cultura de orofaringe se indicado',
 timestamp: new Date(),
 priority:'medium'
});
}

 // Paciente nega tosse
 if (lastLine.includes('tosse não') || (lastLine.includes('tosse') && lastLine.includes('não'))) {
 newMessages.push({
 id: (Date.now() + 9).toString(),
 role:'assistant',
 type:'analysis',
 content:'✅ AUSÊNCIA DE TOSSE\n\nIsso REDUZ a probabilidade de:\n• Gripe\n• COVID-19\n• Infecção respiratória viral comum',
 timestamp: new Date(),
 priority:'medium'
});
}

 // Médico examina garganta
 if (lastLine.includes('examinar') || lastLine.includes('garganta agora')) {
 newMessages.push({
 id: (Date.now() + 10).toString(),
 role:'assistant',
 type:'recommendation',
 content:'👁️ Durante o exame, observe:\n• Grau de hiperemia\n• Presença de exsudato/placas\n• Tamanho das amígdalas\n• Úvula (edema/desvio)\n• Petéquias no palato',
 timestamp: new Date(),
 priority:'high'
});
}

 // Médico descreve achados
 if (lastLine.includes('hiperemia') && lastLine.includes('edema')) {
 newMessages.push({
 id: (Date.now() + 11).toString(),
 role:'assistant',
 type:'analysis',
 content:'🔬 ACHADOS DO EXAME:\n✓ Hiperemia\n✓ Edema\n✗ Sem placas\n\n💭 Sugere mais VIRAL que bacteriano',
 timestamp: new Date(),
 priority:'high'
});

 newMessages.push({
 id: (Date.now() + 12).toString(),
 role:'assistant',
 type:'diagnosis',
 content:'🎯 DIAGNÓSTICO MAIS PROVÁVEL:\n\n**Faringite Viral Aguda**\n\nScore de Centor baixo:\n• Sem exsudato\n• Febre presente (+1)\n• Sem tosse (+1)\n= 2 pontos → Probabilidade viral',
 timestamp: new Date(),
 priority:'high'
});

 newMessages.push({
 id: (Date.now() + 13).toString(),
 role:'assistant',
 type:'recommendation',
 content:'💊 CONDUTA SUGERIDA:\n\n✅ Tratamento sintomático:\n• Analgésicos/antitérmicos\n• Hidratação\n• Repouso\n\n⚠️ Antibiótico: NÃO indicado\n\n📅 Retorno: Se piora ou sem melhora em 3-5 dias',
 timestamp: new Date(),
 priority:'high'
});
}

 // Análise de dados do paciente
 if (patientData?.mainConditions && patientData.mainConditions.length > 0 && messages.length < 2) {
 newMessages.push({
 id: (Date.now() + 14).toString(),
 role:'assistant',
 type:'reminder',
 content: `⚕️ HISTÓRICO DO PACIENTE:\n• ${patientData.mainConditions.join('\n•')}\n\n⚠️ Considere interações medicamentosas!`,
 timestamp: new Date(),
 priority:'medium'
});
}

 if (patientData?.medications && patientData.medications.length > 0 && lineCount > 3 && messages.length < 5) {
 newMessages.push({
 id: (Date.now() + 15).toString(),
 role:'assistant',
 type:'reminder',
 content: `💊 MEDICAÇÕES EM USO:\n• ${patientData.medications.join('\n•')}\n\nVerifique interações antes de prescrever!`,
 timestamp: new Date(),
 priority:'high'
});
}

 if (patientData?.allergies && patientData.allergies.length > 0 && lineCount > 2 && messages.length < 3) {
 newMessages.push({
 id: (Date.now() + 16).toString(),
 role:'assistant',
 type:'reminder',
 content: `🚨 ALERGIAS REGISTRADAS:\n• ${patientData.allergies.join('\n•')}\n\n❌ NÃO prescrever estes medicamentos!`,
 timestamp: new Date(),
 priority:'high'
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

 <MessageList
 messages={messages}
 isThinking={isThinking}
 thinkingMessage="Processando contexto clínico..."
 emptyStateTitle={isActive ? 'Ouvindo a consulta...' : 'Pronto para ajudar'}
 emptyStateDescription={
 isActive
 ? 'Estou analisando o diálogo em tempo real para fornecer insights clínicos relevantes.'
 : 'Inicie a gravação para ativar o assistente de inteligência artificial.'
 }
 />
 </div>
 );
}
