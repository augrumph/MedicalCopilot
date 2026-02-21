/**
 * useOpenAIAnalysis Hook
 * Analisa transcrições médicas em tempo real usando OpenAI
 * 
 * Features:
 * - Análise periódica automática da transcrição
 * - Geração de insights médicos (alertas, sugestões, diagnósticos)
 * - Detecção de condições médicas e exames relevantes
 * - Debounce automático para evitar análises excessivas
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import type { AIInsight, AIAnalysisResponse } from '@/types/transcription.types';

import { callGemini } from '../services/gemini';

interface UseOpenAIAnalysisProps {
    transcript: string;
    analysisInterval?: number; // ms between automatic analyses (default: 20000)
    minTranscriptLength?: number; // minimum chars before analyzing (default: 100)
    enabled?: boolean; // enable/disable auto-analysis
}

const ANALYSIS_SYSTEM_PROMPT = `Você é um Médico Especialista Digital atuando como Sistema de Suporte à Decisão Clínica (CDSS) de alto nível.
Sua missão é fornecer insights diagnósticos e de segurança em tempo real durante uma consulta médica, seguindo padrões internacionais de medicina baseada em evidências.

### DIRETRIZES DE ANÁLISE:
1. **Diferenciação Crítica**: Distinga entre o que o "Médico:" afirma e o que o "Paciente:" relata. Valorize sintomas sugeridos pelo paciente e condutas citadas pelo médico.
2. **Raciocínio Clínico**: Identifique padrões que sugiram diagnósticos diferenciais importantes ou emergências médicas.
3. **Segurança**: Priorize alertas de "Red Flags" (sinais de alarme) e contraindicações.

### CATEGORIAS DE INSIGHTS (type):
- **alert**: Sinais de perigo, emergências (ex: infarto, sepse), alergias graves ou erros potenciais de conduta.
- **diagnostic**: Sugestão de diagnósticos diferenciais baseados nos sintomas relatados (mencione CID-10 se possível).
- **suggestion**: Próximas perguntas críticas a fazer ao paciente ou manobras de exame físico recomendadas para esclarecer o quadro.
- **exam**: Exames complementares de "padrão ouro" para a suspeita diagnóstica identificada.
- **medication**: Alertas sobre doses, interações ou necessidade de ajuste (ex: renal/hepático) de fármacos citados.

### REGRAS DE OUTPUT:
- **Assertividade**: Seja direto. Use terminologia médica internacional (padrão UpToDate/Medscape).
- **Quantização**: Máximo de 3 insights por ciclo. Prioridade: Vida > Diagnóstico > Conduta.
- **JSON Estrito**: Retorne apenas o objeto JSON solicitado, sem explicações.

\`\`\`json
{
    "insights": [
        {
            "type": "alert" | "suggestion" | "diagnostic" | "exam" | "medication",
            "title": "Título conciso e técnico",
            "content": "Explicação clínica assertiva com base científica (máx 200 caracteres)",
            "tags": ["Tag Técnica 1", "Tag 2"]
        }
    ]
}
\`\`\`

Se não houver insights REALMENTE relevantes, retorne: {"insights": []}`;

function parseAIResponse(responseText: string): AIAnalysisResponse | null {
    try {
        // Remove markdown code blocks if present
        let cleaned = responseText.trim();
        if (cleaned.startsWith('```json')) {
            cleaned = cleaned.slice(7);
        }
        if (cleaned.startsWith('```')) {
            cleaned = cleaned.slice(3);
        }
        if (cleaned.endsWith('```')) {
            cleaned = cleaned.slice(0, -3);
        }

        const parsed = JSON.parse(cleaned.trim());

        // Validate structure
        if (!parsed.insights || !Array.isArray(parsed.insights)) {
            console.warn('Invalid AI response structure:', parsed);
            return null;
        }

        return parsed as AIAnalysisResponse;
    } catch (error) {
        console.error('Failed to parse AI response:', error, responseText);
        return null;
    }
}

export function useOpenAIAnalysis({
    transcript,
    analysisInterval = 10000, // 10 seconds - faster insights
    minTranscriptLength = 50, // Start analyzing earlier
    enabled = true,
}: UseOpenAIAnalysisProps) {
    const [insights, setInsights] = useState<AIInsight[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const lastAnalyzedTranscript = useRef<string>('');
    const analysisTimerRef = useRef<NodeJS.Timeout | null>(null);
    const insightIdCounter = useRef(0);

    /**
     * Trigger manual analysis
     */
    const triggerAnalysis = useCallback(async () => {
        // Skip if transcript too short
        if (!transcript || transcript.length < minTranscriptLength) {
            console.log('⏭️ Transcript too short, skipping analysis');
            return;
        }

        // Skip if already analyzed this exact transcript
        if (transcript === lastAnalyzedTranscript.current) {
            console.log('⏭️ Already analyzed this transcript');
            return;
        }

        // Skip if already analyzing
        if (isAnalyzing) {
            console.log('⏭️ Analysis already in progress');
            return;
        }

        setIsAnalyzing(true);
        setError(null);

        try {
            console.log(`🔍 Analyzing transcript (${transcript.length} chars)...`);

            const userPrompt = `TRANSCRIÇÃO DA CONSULTA:\n\n${transcript}\n\nAnalise e gere insights médicos relevantes em JSON.`;

            const aiResponse = await callGemini(
                [{ role: 'user', content: userPrompt }],
                {
                    systemPrompt: ANALYSIS_SYSTEM_PROMPT,
                    temperature: 0.2, // Lower temperature for more consistent medical analysis
                    maxTokens: 800,
                    jsonMode: true
                }
            );

            if (!aiResponse) {
                throw new Error('Empty response from Gemini');
            }

            const parsed = parseAIResponse(aiResponse);

            if (!parsed || parsed.insights.length === 0) {
                console.log('ℹ️ No new insights generated');
                lastAnalyzedTranscript.current = transcript;
                return;
            }

            // Convert to AIInsight format with IDs and timestamps
            const newInsights: AIInsight[] = parsed.insights.map(insight => ({
                id: `ai-${Date.now()}-${++insightIdCounter.current}`,
                type: insight.type,
                title: insight.title,
                content: insight.content,
                tags: insight.tags,
                timestamp: Date.now(),
            }));

            console.log(`✅ Generated ${newInsights.length} insights:`, newInsights.map(i => i.title));
            setInsights(prev => [...prev, ...newInsights]);
            lastAnalyzedTranscript.current = transcript;

        } catch (err: any) {
            console.error('❌ AI Analysis failed:', err);
            setError(err.message);
        } finally {
            setIsAnalyzing(false);
        }
    }, [transcript, minTranscriptLength, isAnalyzing]);

    /**
     * Auto-analysis effect
     */
    useEffect(() => {
        if (!enabled || !transcript) {
            return;
        }

        // Clear existing timer
        if (analysisTimerRef.current) {
            clearTimeout(analysisTimerRef.current);
        }

        // Schedule new analysis
        analysisTimerRef.current = setTimeout(() => {
            triggerAnalysis();
        }, analysisInterval);

        return () => {
            if (analysisTimerRef.current) {
                clearTimeout(analysisTimerRef.current);
            }
        };
    }, [transcript, enabled, analysisInterval, triggerAnalysis]);

    /**
     * Clear insights
     */
    const clearInsights = useCallback(() => {
        setInsights([]);
        lastAnalyzedTranscript.current = '';
        insightIdCounter.current = 0;
    }, []);

    return {
        insights,
        isAnalyzing,
        error,
        triggerAnalysis,
        clearInsights,
    };
}
