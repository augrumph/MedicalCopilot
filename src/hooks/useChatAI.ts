/**
 * useChatAI - Contextual AI Chat for Medical Consultations
 * Allows doctors to ask questions with full consultation context
 */

import { useState, useCallback } from 'react';
import { callGemini } from '../services/gemini';
import type { AIInsight } from '@/types/transcription.types';
import type { Protocol, ProtocolNode } from '@/stores/protocolsStore';

interface UseChatAIProps {
    transcript: string;
    insights: AIInsight[];
    patientName?: string;
    patientAge?: number;
    activeProtocol?: Protocol | null;
    protocolNodes?: ProtocolNode[];
}

interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
}

export function useChatAI({
    transcript,
    insights,
    patientName,
    patientAge,
    activeProtocol,
    protocolNodes
}: UseChatAIProps) {
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [conversationHistory, setConversationHistory] = useState<ChatMessage[]>([]);

    const askAI = useCallback(async (question: string): Promise<string | null> => {


        if (!question.trim()) {
            return null;
        }

        setIsProcessing(true);
        setError(null);

        try {
            // console.log('🤖 Enviando pergunta para IA:', question);

            // Build comprehensive context
            const contextParts: string[] = [];

            // Patient info
            if (patientName || patientAge) {
                contextParts.push(`**PACIENTE:**`);
                if (patientName) contextParts.push(`Nome: ${patientName}`);
                if (patientAge) contextParts.push(`Idade: ${patientAge} anos`);
                contextParts.push('');
            }

            // Transcript
            if (transcript && transcript.trim()) {
                contextParts.push(`**TRANSCRIÇÃO DA CONSULTA:**`);
                contextParts.push(transcript);
                contextParts.push('');
            }

            // Active Protocol Context (Knowledge Base)
            if (activeProtocol && protocolNodes && protocolNodes.length > 0) {
                contextParts.push(`**PROTOCOLO CLÍNICO ATIVO (CONHECIMENTO ESPECIALIZADO):**`);
                contextParts.push(`Título: ${activeProtocol.title}`);
                contextParts.push(`Especialidade: ${activeProtocol.specialty}`);
                contextParts.push(`Estrutura do Protocolo (JSON):`);
                contextParts.push(JSON.stringify(protocolNodes, null, 2));
                contextParts.push('');
            }

            // Previous insights
            if (insights && insights.length > 0) {
                contextParts.push(`**INSIGHTS GERADOS ANTERIORMENTE:**`);
                insights.forEach(insight => {
                    contextParts.push(`- [${insight.type}] ${insight.content}`);
                });
                contextParts.push('');
            }

            // Conversation history
            if (conversationHistory.length > 0) {
                contextParts.push(`**HISTÓRICO DA CONVERSA:**`);
                conversationHistory.slice(-4).forEach(msg => { // Last 4 messages
                    const role = msg.role === 'user' ? 'Médico' : 'IA';
                    contextParts.push(`${role}: ${msg.content}`);
                });
                contextParts.push('');
            }

            /*
             * Task Progress:
             * - [x] Refine `useOpenAIAnalysis.ts` prompts (Real-time Insights) <!-- id: 1 -->
             * - [/] Refine `useChatAI.ts` prompts (Medical Assistant) <!-- id: 2 -->
             * - [ ] Refine `useSOAPGenerator.ts` prompts (Clinical Documentation) <!-- id: 3 -->
             */

            const contextStr = contextParts.join('\n');

            // System prompt for medical assistant
            const systemPrompt = `Você é um Consultor Clínico Sênior, agindo como um Sistema de Suporte à Decisão Clínica (CDSS) de excelência.
Sua função é apoiar o médico com informações baseadas em evidências (Evidence-Based Medicine - EBM), diagnósticos diferenciais assertivos e protocolos internacionais (UpToDate, NICE, Cochrane).

### DIRETRIZES DE RESPOSTA:
1. **Raciocínio Clínico**: Use o método de exclusão e probabilidade pré-teste para sugerir diagnósticos.
2. **Contextualização**: Utilize os dados da transcrição e insights gerados para personalizar as respostas ao caso atual.
3. **Segurança do Paciente**: Identifique proativamente sinais de alerta (Red Flags) e contraindicações de condutas sugeridas.
4. **Precisão Farmacológica**: Ao citar medicamentos, foque em doses padrão, vias de administração e ajustes fundamentais.

### FORMATO E ESTILO:
- **Conciso e Direto**: O médico está em atendimento. Evite introduções longas ou rodeios.
- **Técnico-Científico**: Use terminologia médica internacional avançada.
- **Estruturado**: Use listas numeradas ou bullet points para organizar diagnósticos, condutas ou exames.
- **Linguagem**: Português brasileiro formal, mantendo os termos técnicos internacionais quando apropriado.

### RESTRIÇÕES:
- Não faça diagnósticos definitivos (use "Considere:", "Sugestão de diferencial:", "Hipótese compatível:").
- Se o contexto for insuficiente para uma resposta segura, solicite os dados faltantes de forma técnica.`;

            const text = await callGemini(
                [{ role: 'user', content: `CONTEXTO DA CONSULTA:\n${contextStr}\n\nPERGUNTA DO MÉDICO:\n${question}` }],
                {
                    systemPrompt: systemPrompt,
                    temperature: 0.3, // Mais baixo para consistência clínica
                    maxTokens: 1000
                }
            );

            // console.log('✅ Resposta da IA recebida:', text.substring(0, 100) + '...');

            // Add to conversation history
            setConversationHistory(prev => [
                ...prev,
                { role: 'user', content: question, timestamp: Date.now() },
                { role: 'assistant', content: text, timestamp: Date.now() },
            ]);

            setIsProcessing(false);
            return text;

        } catch (err: any) {
            console.error('❌ Erro ao processar pergunta:', err);
            setError(err.message || 'Erro ao processar pergunta');
            setIsProcessing(false);
            return null;
        }
    }, [transcript, insights, patientName, patientAge, conversationHistory]);

    const clearHistory = useCallback(() => {
        setConversationHistory([]);
        // console.log('🗑️ Histórico de conversa limpo');
    }, []);

    return {
        askAI,
        isProcessing,
        error,
        conversationHistory,
        clearHistory,
    };
}
