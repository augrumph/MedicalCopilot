/**
 * useTriageAnalysis v2 - Arquitetura de 3 Estágios + Síntese Combo
 *
 * Estágio 1: Extração de Triagem (OCR/Leitura)
 * Estágio 2: Análise Clínica Universal (Raciocínio em 4 etapas)
 * Estágio 3: Síntese de Painel (Cruzamento de dados + Decisão)
 */

import { useState, useCallback } from 'react';


import { callGemini } from '../services/gemini';

// ── Interfaces Compatíveis com CopilotPanel ──

export interface VitalSigns {
  pressaoArterial?: string;
  frequenciaCardiaca?: string;
  saturacao?: string;
  temperatura?: string;
  frequenciaRespiratoria?: string;
  glicemia?: string;
}

export interface InvestigationItem {
  question: string;
  details: string;
  clinicalNote: string;
}

export interface RedFlag {
  description: string;
  tooltip?: string;
}

export interface ExamItem {
  name: string;
  urgency?: 'URGENTE' | 'ROTINA';
}

export interface MedicationItem {
  name: string;
  dosage: string;
  route: string;
  detailedDose?: string;
}

export interface DiagnosticHypothesis {
  name: string;
  probability: 'provável' | 'possível' | 'diferencial';
  rationale?: string;
}

export interface TimelineItem {
  action: string;
  timing: string;
}

export interface ExamFinding {
  parameter: string;
  value: string;
  reference: string;
  status: 'normal' | 'alterado' | 'critico';
  interpretation: string;
  clinicalAction: string;
}

export interface TriageAnalysis {
  patientName: string;
  patientAge: string;
  patientSex?: string;
  chiefComplaint: string;
  complaintDetail: string;
  arrivalTime: string;
  evolutionTime?: string;
  riskClassification?: string;
  vitalSigns: VitalSigns;
  globalStatus?: 'critical' | 'warning' | 'stable';
  globalStatusText?: string;
  alerts?: string[];
  redFlags: RedFlag[];
  clinicalSynthesis?: string[];
  suggestedProtocol: string;
  mainProtocol?: string;
  protocolDetail: string;
  differentials?: string[];
  timeline?: TimelineItem[];
  exams: ExamItem[];
  medications: MedicationItem[];
  diagnosticHypotheses: DiagnosticHypothesis[];
  investigation: InvestigationItem[];
  hma: string;
  examFindings?: ExamFinding[];
}

// ── Prompts Especializados ──

const TRIAGE_EXTRACTION_PROMPT = `Você é um Digitaizer de Triagem de alta fidelidade.
Sua missão é extrair dados brutos de fichas de triagem (fotos, PDFs, manuscritos) SEM INTERPRETAR.

### PROTOCOLO DE EXTRAÇÃO:
- **Literabilidade**: Extraia exatamente o que está escrito. Se a letra for ilegível, use [ILEGÍVEL].
- **Sinais Vitais**: Se houver múltiplas medidas, use a mais recente ou a mais alterada.
- **Antecedentes**: Liste comorbidades e medicamentos em uso citados.
- **Invisibilidade**: Se o campo não existir na imagem, retorne null.

### ESCOPO DE DADOS:
1. IDENTIFICAÇÃO (Nome, Idade, Sexo)
2. CLÍNICA (Queixa Principal, HMA, Início)
3. VITAIS (PA, FC, FR, T, SpO2, Glicemia, Escala de Dor)
4. RISCO (Classificação de cor original da triagem)`;

const CLINICAL_ANALYSIS_PROMPT = `Você é um Analista de Diagnóstico por Imagem e Laboratório, agindo sob rigorosos padrões de Medicina Baseada em Evidências.
Sua tarefa é analisar os exames fornecidos e detectar alterações patológicas com alta especificidade.

### DIRETRIZES DE ANÁLISE:
1. **Diferenciação Etária/Fisiológica**: Ajuste sua interpretação para neonatos, crianças, adultos e idosos.
2. **Padrões de Emergência (Time-Sensitive)**:
   - **ECG**: Detecte Supra/Infra de ST, bloqueios de condução, Wellens, De Winter, QT longo.
   - **TC/RM Crânio**: Identifique Hematomas (Epidural vs Subdural), AVC Isquêmico/Hemorrágico, Edema.
   - **RX/TC Tórax**: Identifique Pneumotórax, Consolidações, Derrame Pleural, Congestão.
   - **Laboratório**: Identifique desvios críticos (Troponina, D-Dímero, Lactato, Eletrólitos).

### REGRAS DE OURO:
- **Descrição Objetiva**: Não descreva apenas "alterado". Use termos como "Hipodensidade", "Infiltrado Intersticial", "Desvio de Eixo".
- **Ação Clínica**: Para cada achado alterado, sugira a conduta imediata esperada pelo médico.

### RETORNO JSON:
Use o SCHEMA definido para listar Parameter, Value, Reference, Status (NORMAL|ALTERADO|CRÍTICO) e Interpretation.`;

const COMBO_SYNTHESIS_PROMPT = `Você é o Diretor da Unidade de Emergência.
Sua missão é cruzar os dados da triagem com os resultados dos exames para uma decisão clínica resolutiva e segura.

### CRITÉRIOS DE DECISÃO:
1. **Status Global (NEWS2/qSOFA)**: 
   - Use os sinais vitais da triagem para calcular mentalmente o risco. 
   - **critical**: Sepse, Choque, IAM, AVC, Insuficiência Respiratória aguda, HED/HSD/HSA.
   - **warning**: Sinais vitais limítrofes, dor intensa, exames com alterações moderadas.
   - **stable**: Sinais vitais normais e exames sem alterações significativas.

2. **Diferenciais Estruturados**: Liste hipóteses em ordem de probabilidade e gravidade.
3. **Timeline e Protocolo**: Sugira os próximos passos (ex: "Jejum", "Monitorização contínua", "Transferência para sala vermelha").
4. **Red Flags**: Liste alertas que exigem ação imediata (ex: "Risco de Torsades de Pointes", "Efeito de massa intracraniano").

### REGRAS DE OURO:
- **HMA Técnico**: Se não houver dados, descreva apenas "Dados de triagem não disponibilizados".
- **Sintese Clínica**: Crie um resumo conciso (1 parágrafo) correlacionando queixa + exames.

### OUTPUT JSON:
Retorne o objeto JSON seguindo exatamente a interface TriageAnalysis.`;

// ── Hook Principal ──

export function useTriageAnalysis() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState<string>(""); // Novo estado de estágio
  const [error, setError] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<TriageAnalysis | null>(null);

  // Helpers de Imagem (Mantidos)
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
    });
  };

  const MAX_IMAGE_PX = 1024;
  const resizeImageToMax = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      const isDocument = file.type.includes('pdf') || file.name.match(/\.(pdf|doc|docx|txt)$/i);
      const quality = isDocument ? 0.92 : 0.82;

      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        const { naturalWidth: w, naturalHeight: h } = img;
        if (w <= MAX_IMAGE_PX && h <= MAX_IMAGE_PX && file.size < 500 * 1024) {
          fileToBase64(file).then(resolve).catch(reject);
          return;
        }
        const scale = MAX_IMAGE_PX / Math.max(w, h);
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(w * scale);
        canvas.height = Math.round(h * scale);
        const ctx = canvas.getContext('2d');
        if (!ctx) { reject(new Error('Canvas context unavailable')); return; }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = objectUrl;
    });
  };



  const safeParseJSON = (text: string) => {
    try { return JSON.parse(text); } catch {
      try { return JSON.parse(text.replace(/```json|```/g, "").trim()); }
      catch { return null; }
    }
  };

  const analyzeImages = useCallback(async (
    triageImages: File[] = [],
    examsImages: File[] = [],
  ) => {
    // if (!OPENAI_API_KEY) { setError('API Key missing'); return null; }
    if (triageImages.length === 0 && examsImages.length === 0) { setError('Sem imagens'); return null; }

    setIsProcessing(true);
    setProgress(5);
    setError(null);
    setStage("Iniciando...");

    try {
      // 1. Prepara Imagens (Resize)
      const triageB64: string[] = [];
      for (const f of triageImages) triageB64.push(await resizeImageToMax(f));

      const examsB64: string[] = [];
      for (const f of examsImages) examsB64.push(await resizeImageToMax(f));

      let extractedTriage: any = null;
      let examAnalysis: any = null;

      // ── ESTÁGIO 1: Extração de Triagem ──
      if (triageB64.length > 0) {
        setStage("Lendo ficha de triagem...");
        setProgress(20);
        const content: any[] = [{ type: "text", text: "Extraia dados desta ficha." }];
        for (const b64 of triageB64) {
          content.push({ type: "image_url", image_url: { url: b64, detail: "high" } });
        }
        const raw = await callGemini(content, { systemPrompt: TRIAGE_EXTRACTION_PROMPT, maxTokens: 1500, jsonMode: true, temperature: 0.2 });
        extractedTriage = safeParseJSON(raw);
      }

      // ── ESTÁGIO 2: Análise de Exames ──
      if (examsB64.length > 0) {
        setStage("Analisando exames...");
        setProgress(50);
        const content: any[] = [];
        if (extractedTriage) {
          content.push({ type: "text", text: `CONTEXTO DO PACIENTE:\n${JSON.stringify(extractedTriage)}` });
        }
        content.push({ type: "text", text: "Analise estes exames com raciocínio clínico em 4 etapas." });
        for (const b64 of examsB64) {
          content.push({ type: "image_url", image_url: { url: b64, detail: "high" } });
        }
        const raw = await callGemini(content, { systemPrompt: CLINICAL_ANALYSIS_PROMPT, maxTokens: 3000, jsonMode: true, temperature: 0.2 });
        examAnalysis = safeParseJSON(raw);
      }

      // ── ESTÁGIO 3: Síntese Final (Combo) ──
      setStage("Gerando painel de decisão...");
      setProgress(80);

      const synthContent: any[] = [];
      if (extractedTriage) synthContent.push({ type: "text", text: `DADOS TRIAGEM:\n${JSON.stringify(extractedTriage)}` });
      if (examAnalysis) synthContent.push({ type: "text", text: `ANÁLISE EXAMES:\n${JSON.stringify(examAnalysis)}` });

      synthContent.push({
        type: "text",
        text: "Gere o PAINEL FINAL (7 Zonas) cruzando os dados. Retorne JSON no formato TriageAnalysis EXATO."
      });

      const finalRaw = await callGemini(synthContent, { systemPrompt: COMBO_SYNTHESIS_PROMPT, maxTokens: 3000, jsonMode: true, temperature: 0.2 });
      const finalPanel = safeParseJSON(finalRaw);

      console.log("✅ Análise Final Concluída:", finalPanel?.patientName);
      setAnalysis(finalPanel);
      setProgress(100);
      return finalPanel;

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erro na análise");
    } finally {
      setIsProcessing(false);
      setStage("");
    }
  }, []);

  return { analyzeImages, analysis, isProcessing, progress, stage, error, reset: () => setAnalysis(null) };
}
