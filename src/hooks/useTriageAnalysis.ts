/**
 * useTriageAnalysis v3
 *
 * Delegates the 3-stage image analysis to the backend (/api/analysis/triage).
 * The Gemini API key never touches the browser — it lives only in the backend.
 *
 * Client responsibilities:
 *  - Resize images before sending (bandwidth optimisation)
 *  - Handle PDF/document files correctly (skip canvas, send as-is)
 *  - Revoke object URLs to avoid memory leaks
 */

import { useState, useCallback } from 'react';

// ── Interfaces (kept intact — consumed by CopilotPanel) ──────────────────────

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

// ── Config ────────────────────────────────────────────────────────────────────

const BACKEND_URL   = import.meta.env.VITE_BACKEND_URL || 'https://api.medicalcopilot.com.br';
const MAX_IMAGE_PX  = 1024;
const JPEG_QUALITY  = 0.85;
const TIMEOUT_MS    = 180_000; // 3 min — thinking:high is slow

// ── Image helpers ─────────────────────────────────────────────────────────────

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload  = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
}

function resizeImageToMax(file: File): Promise<string> {
  // PDFs and office documents cannot be rendered by <img> — send as-is.
  // Gemini supports application/pdf as inline_data.
  const isDocument = file.type === 'application/pdf' ||
                     /\.(pdf|doc|docx|txt)$/i.test(file.name);
  if (isDocument) {
    return fileToBase64(file);
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    let objectUrl: string | null = URL.createObjectURL(file);

    const cleanup = () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
        objectUrl = null;
      }
    };

    img.onload = () => {
      cleanup();
      const { naturalWidth: w, naturalHeight: h } = img;

      // Small enough — no resize needed
      if (w <= MAX_IMAGE_PX && h <= MAX_IMAGE_PX && file.size < 500 * 1024) {
        fileToBase64(file).then(resolve).catch(reject);
        return;
      }

      const scale  = MAX_IMAGE_PX / Math.max(w, h);
      const canvas = document.createElement('canvas');
      canvas.width  = Math.round(w * scale);
      canvas.height = Math.round(h * scale);

      const ctx = canvas.getContext('2d');
      if (!ctx) { reject(new Error('Canvas context unavailable')); return; }

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', JPEG_QUALITY));
    };

    img.onerror = () => {
      cleanup(); // always revoke, even on error
      reject(new Error(`Não foi possível carregar a imagem: ${file.name}`));
    };

    img.src = objectUrl;
  });
}

// ── Hook ──────────────────────────────────────────────────────────────────────

export function useTriageAnalysis() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress,     setProgress]     = useState(0);
  const [stage,        setStage]        = useState('');
  const [error,        setError]        = useState<string | null>(null);
  const [analysis,     setAnalysis]     = useState<TriageAnalysis | null>(null);

  const analyzeImages = useCallback(async (
    triageImages: File[] = [],
    examsImages:  File[] = [],
  ) => {
    if (triageImages.length === 0 && examsImages.length === 0) {
      setError('Adicione ao menos uma imagem para analisar.');
      return null;
    }

    setIsProcessing(true);
    setProgress(5);
    setError(null);
    setStage('Preparando imagens...');

    const controller = new AbortController();
    const timeoutId  = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      // Resize all images in parallel (not serial)
      setStage('Redimensionando imagens...');
      setProgress(15);

      const [triageB64, examsB64] = await Promise.all([
        Promise.all(triageImages.map(f => resizeImageToMax(f))),
        Promise.all(examsImages.map(f => resizeImageToMax(f))),
      ]);

      setStage('Enviando para análise clínica...');
      setProgress(30);

      const res = await fetch(`${BACKEND_URL}/api/analysis/triage`, {
        method:      'POST',
        headers:     { 'Content-Type': 'application/json' },
        body:        JSON.stringify({ triageImages: triageB64, examsImages: examsB64 }),
        credentials: 'include',
        signal:      controller.signal,
      });

      setStage('Analisando exames...');
      setProgress(65);

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Erro HTTP ${res.status}`);
      }

      setStage('Gerando painel de decisão...');
      setProgress(90);

      const data = await res.json();
      if (!data.success || !data.analysis) {
        throw new Error(data.error || 'Resposta inválida do servidor');
      }

      setAnalysis(data.analysis);
      setProgress(100);
      setStage('');
      return data.analysis as TriageAnalysis;

    } catch (err: any) {
      if (err.name === 'AbortError') {
        setError('Tempo limite excedido. Tente novamente.');
      } else {
        console.error('[TriageAnalysis]', err);
        setError(err.message || 'Erro na análise');
      }
      return null;
    } finally {
      clearTimeout(timeoutId);
      setIsProcessing(false);
      setStage('');
    }
  }, []);

  return {
    analyzeImages,
    analysis,
    isProcessing,
    progress,
    stage,
    error,
    reset: () => { setAnalysis(null); setError(null); setProgress(0); },
  };
}
