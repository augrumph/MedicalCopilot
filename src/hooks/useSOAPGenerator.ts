/**
 * useSOAPGenerator Hook
 * Gera prontuário SOAP automaticamente usando OpenAI
 * 
 * Features:
 * - Processamento de transcrição completa
 * - Geração dos 4 campos SOAP estruturados
 * - Suporte a informações contextuais do paciente
 * - Validação e formatação automática
 */

import { useState, useCallback } from 'react';
import type { SOAPContent, SOAPGenerationRequest } from '@/types/transcription.types';

import { callGemini } from '../services/gemini';

const SOAP_SYSTEM_PROMPT = `Você é um Médico Especialista em Auditoria e Documentação Clínica de alto padrão.
Sua missão é converter a transcrição de uma consulta médica em um prontuário estruturado no formato SOAP (Subjetivo, Objetivo, Avaliação, Plano), seguindo rigorosamente os padrões internacionais de qualidade (Joint Commission/HIMSS) e a semiologia médica clássica.

### DIRETRIZES PARA CADA CAMPO:
1. **Subjetivo (S)**: 
   - Queixa Principal (QP) e História da Moléstia Atual (HMA).
   - Registre a narrativa do paciente, sintomas relatados, início, duração, fatores de melhora/piora.
   - Use: "Paciente relata...", "Refere...", "Nega...".

2. **Objetivo (O)**:
   - APENAS o que o médico observou ou mediu.
   - Sinais vitais (se citados), achados do exame físico (inspeção, palpação, percussão, ausculta).
   - Se o médico disser "Exame normal", descreva como "Ao exame físico: sem alterações significativas em aparelhos...".

3. **Avaliação (A)**:
   - Raciocínio clínico do médico e hipóteses diagnósticas.
   - Liste diagnósticos diferenciais se houver incerteza.
   - Utilize CID-10 para os diagnósticos principais.

4. **Plano (P)**:
   - Condutas terapêuticas, prescrições (dose, via, frequência), exames solicitados e orientações de alta/retorno.

### REGRAS CRÍTICAS:
- **Terminologia Médica**: Use termos técnicos precisos (ex: "disúria" em vez de "dor ao urinar").
- **Fidelidade**: NÃO invente dados. Se algo não foi mencionado, use "Não informado" ou "Sem particularidades".
- **Diferenciação**: Não confunda o relato do paciente (S) com a observação do médico (O).
- **Concisão**: Seja técnico, direto e evite adjetivos desnecessários.

### FORMATO DE SAÍDA:
Retorne APENAS o objeto JSON abaixo:

\`\`\`json
{
  "subjetivo": "Texto técnico estruturado",
  "objetivo": "Achados do exame físico e sinais vitais",
  "avaliacao": "Hipóteses diagnósticas e CID-10",
  "plano": "Condutas e prescrições detalhadas"
}
\`\`\``;

function parseSOAPResponse(responseText: string): SOAPContent | null {
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

        // Validate all required fields are present
        const requiredFields = ['subjetivo', 'objetivo', 'avaliacao', 'plano'];
        for (const field of requiredFields) {
            if (!parsed[field] || typeof parsed[field] !== 'string') {
                console.error(`Missing or invalid field: ${field}`);
                return null;
            }
        }

        return parsed as SOAPContent;
    } catch (error) {
        console.error('Failed to parse SOAP response:', error, responseText);
        return null;
    }
}

export function useSOAPGenerator() {
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Generate SOAP from transcript
     */
    const generateSOAP = useCallback(async (request: SOAPGenerationRequest): Promise<SOAPContent | null> => {
        if (!request.transcript || request.transcript.length < 50) {
            const errorMsg = 'Transcrição muito curta para gerar SOAP';
            setError(errorMsg);
            console.error('❌', errorMsg);
            throw new Error(errorMsg);
        }

        setIsGenerating(true);
        setError(null);
        console.log('📝 Generating SOAP...', {
            transcriptLength: request.transcript.length,
            patient: request.patientName,
        });

        try {
            // Build patient context
            const patientContext = [
                `Nome: ${request.patientName}`,
                request.patientAge ? `Idade: ${request.patientAge} anos` : null,
                request.patientGender ? `Sexo: ${request.patientGender}` : null,
            ].filter(Boolean).join('\n');

            // Gemini Service Call
            const userPrompt = `INFORMAÇÕES DO PACIENTE:
${patientContext}

TRANSCRIÇÃO DA CONSULTA:
${request.transcript}

Gere um prontuário SOAP completo e profissional em formato JSON.`;

            const aiResponse = await callGemini(
                [{ role: 'user', content: userPrompt }],
                {
                    systemPrompt: SOAP_SYSTEM_PROMPT,
                    temperature: 0.2,
                    maxTokens: 1500,
                    jsonMode: true
                }
            );

            if (!aiResponse) {
                throw new Error('Empty response from Gemini');
            }

            console.log('🤖 Raw SOAP response:', aiResponse);

            const soapContent = parseSOAPResponse(aiResponse);

            if (!soapContent) {
                throw new Error('Failed to parse SOAP response');
            }

            console.log('✅ SOAP generated successfully');
            return soapContent;

        } catch (err: any) {
            console.error('❌ SOAP generation failed:', err);
            setError(err.message);
            throw err;
        } finally {
            setIsGenerating(false);
        }
    }, []);

    return {
        generateSOAP,
        isGenerating,
        error,
    };
}
