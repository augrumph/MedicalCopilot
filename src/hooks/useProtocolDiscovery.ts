/**
 * useProtocolDiscovery
 *
 * Calls the backend /api/discovery/rank endpoint, which uses Gemini with
 * function calling to query the protocols DB and return a ranked list of 15.
 * No JSON parsing, no Gemini calls from the browser, no truncation issues.
 */
import { useState, useCallback } from 'react';

// ── Types (kept compatible with existing consumers) ────────────────────────────

export type DiscoveryStage = 'INITIAL' | 'IDENTIFIED';

export interface ProtocolRank {
  protocolId: string;
  title: string;
  specialty: string;
  triageColor: string;
  probability: number;
  reason: string;
}

export interface PatientContext {
  age?: string;
  gender?: 'M' | 'F' | '';
  vitalSigns?: { pa?: string; fc?: string; sat?: string; temp?: string };
}

// Kept for type-import compatibility in DiscoveryPanel
export interface DiscoveryQuestion {
  id: string;
  text: string;
  impact: Record<string, number>;
}

// ── Hook ───────────────────────────────────────────────────────────────────────

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://api.medicalcopilot.com.br';

export function useProtocolDiscovery() {
  const [stage,        setStage]        = useState<DiscoveryStage>('INITIAL');
  const [ranking,      setRanking]      = useState<ProtocolRank[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAll,      setShowAll]      = useState(false);
  const [error,        setError]        = useState<string | null>(null);

  const updateInitialRanking = useCallback(async (
    transcript: string,
    ctx: PatientContext,
  ) => {
    if (!transcript?.trim() || isProcessing) return;

    setIsProcessing(true);
    setError(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120_000);

    try {
      const res = await fetch(`${BACKEND_URL}/api/discovery/rank`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          complaint: transcript.trim(),
          patientContext: {
            ...ctx,
            gender: ctx.gender || undefined,
          },
        }),
        credentials: 'include',
        signal: controller.signal,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || `HTTP ${res.status}`);
      }

      const data = await res.json();

      if (!data.success || !Array.isArray(data.rankings) || data.rankings.length === 0) {
        throw new Error('Nenhum protocolo encontrado para este caso.');
      }

      const ranked: ProtocolRank[] = data.rankings.map((r: any) => ({
        protocolId:  r.id,
        title:       r.title,
        specialty:   r.specialty   ?? '',
        triageColor: r.triageColor ?? 'GREEN',
        probability: r.probability ?? 0.5,
        reason:      r.reason      ?? '',
      }));

      setRanking(ranked);
      setShowAll(false);
      setStage('IDENTIFIED');
    } catch (err: any) {
      if (err.name === 'AbortError') {
        setError('Tempo limite excedido. Tente novamente.');
      } else {
        console.error('[Discovery] Error:', err);
        setError(err.message ?? 'Erro ao buscar protocolos.');
      }
    } finally {
      clearTimeout(timeoutId);
      setIsProcessing(false);
    }
  }, [isProcessing]);

  const recordFinalDecision = useCallback(() => {
    setStage('INITIAL');
    setRanking([]);
    setShowAll(false);
    setError(null);
  }, []);

  return {
    stage,
    setStage,
    ranking,
    isProcessing,
    showAll,
    setShowAll,
    error,
    updateInitialRanking,
    recordFinalDecision,
  };
}
