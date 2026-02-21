/**
 * useSpeakerDiarization Hook
 * Gerencia identificação e tracking de speakers (Médico vs Paciente)
 *
 * Features:
 * - Auto-identificação de roles baseado em padrões de fala
 * - Tracking de estatísticas por speaker
 * - Formatação de transcrições com speakers identificados
 * - Detecção de mudança de speaker
 */

import { useState, useCallback, useRef } from 'react';
import {
  Speaker,
  SpeakerRole,
  TranscriptionSegment,
  SpeakerStats,
} from '@/types/transcription.types';

interface UseSpeakerDiarizationProps {
  onSpeakerChange?: (currentSpeaker: Speaker) => void;
  onSegmentComplete?: (segment: TranscriptionSegment) => void;
}

export function useSpeakerDiarization({
  onSpeakerChange,
  onSegmentComplete,
}: UseSpeakerDiarizationProps = {}) {
  // Estado
  const [speakers, setSpeakers] = useState<Map<number, Speaker>>(new Map());
  const [segments, setSegments] = useState<TranscriptionSegment[]>([]);
  const [currentSpeaker, setCurrentSpeaker] = useState<Speaker | null>(null);
  const [interimTranscript, setInterimTranscript] = useState<{ speakerId: number, text: string } | null>(null);

  // Refs
  const segmentIdCounter = useRef(0);
  const lastSpeakerId = useRef<number | null>(null);
  const lastDetectedRole = useRef<SpeakerRole | null>(null);
  const virtualSpeakerId = useRef<number>(0); // Our own speaker ID counter

  /**
   * Identifica role do speaker baseado em padrões
   * ENHANCED: Funciona independentemente da diarização do Deepgram
   */
  const identifySpeakerRole = useCallback((speakerId: number, text: string, currentSpeakers: Map<number, Speaker>): SpeakerRole => {
    // Se já identificado COM CERTEZA, retornar
    const existingSpeaker = currentSpeakers.get(speakerId);
    if (existingSpeaker && existingSpeaker.role !== 'unknown') {
      return existingSpeaker.role;
    }

    const lowerText = text.toLowerCase();

    // HEURÍSTICA FORTE: Palavras-chave médicas (alta confiança)
    const strongDoctorKeywords = [
      'vou examinar',
      'vou prescrever',
      'vou solicitar',
      'vou auscultar',
      'diagnóstico',
      'tratamento',
      'medicamento',
      'medicação',
      'receita',
      'exame',
      'vou pedir',
      'você deve',
      'você precisa',
      'recomendo',
      'prescrevo',
      'ausculta',
      'palpação',
      'pressão arterial',
      'sou médico',
      'sou o médico',
      'doutor',
      'doutora',
      'realizar o atendimento',
      'realizar a consulta',
      'vou te examinar',
      'vou te auscultar',
    ];

    const hasStrongDoctorKeywords = strongDoctorKeywords.some(keyword => lowerText.includes(keyword));
    if (hasStrongDoctorKeywords) {
      return 'doctor';
    }

    // HEURÍSTICA FORTE: Palavras-chave do paciente (alta confiança)
    const strongPatientKeywords = [
      'estou sentindo',
      'sinto',
      'dói',
      'me dói',
      'tenho dor',
      'não consigo',
      'está doendo',
      'comecei a sentir',
      'sou o paciente',
      'sou paciente',
      'estou pronto',
      'vou contar',
      'quero contar',
      'tudo bem doutor',
      'oi doutor',
      'olá doutor',
      'obrigado doutor',
    ];

    const hasStrongPatientKeywords = strongPatientKeywords.some(keyword => lowerText.includes(keyword));
    if (hasStrongPatientKeywords) {
      return 'patient';
    }

    // HEURÍSTICA MÉDIA: Primeira pessoa indicando sintomas
    const symptomFirstPerson = /\b(estou|sinto|tenho|senti|não consigo|me sinto)\b/i;
    if (symptomFirstPerson.test(lowerText)) {
      return 'patient';
    }

    // HEURÍSTICA: Primeira fala na consulta geralmente é o médico se apresentando
    if (currentSpeakers.size === 0) {
      return 'doctor';
    }

    // HEURÍSTICA: Segunda voz diferente geralmente é o paciente
    if (speakerId === 1 && currentSpeakers.size === 1) {
      return 'patient';
    }

    return 'unknown';
  }, []);

  /**
   * Registra ou atualiza um speaker
   */
  const registerSpeaker = useCallback((speakerId: number, text: string): Speaker => {
    // Default speaker in case of error
    let resultSpeaker: Speaker = {
      id: speakerId,
      role: 'unknown',
      name: `Speaker ${speakerId}`,
    };

    setSpeakers(prev => {
      const existing = prev.get(speakerId);

      if (existing) {
        // Se já existe e role é unknown, tentar re-identificar
        if (existing.role === 'unknown') {
          const newRole = identifySpeakerRole(speakerId, text, prev);
          if (newRole !== 'unknown') {
            const updated = { ...existing, role: newRole, name: newRole === 'doctor' ? 'Médico' : newRole === 'patient' ? 'Paciente' : existing.name };
            prev.set(speakerId, updated);
            resultSpeaker = updated;
            return new Map(prev);
          }
        }
        // Se já existe, retornar o existente
        resultSpeaker = existing;
        return prev;
      }

      // Novo speaker
      const role = identifySpeakerRole(speakerId, text, prev);
      const newSpeaker: Speaker = {
        id: speakerId,
        role,
        name: role === 'doctor' ? 'Médico' : role === 'patient' ? 'Paciente' : `Speaker ${speakerId}`,
      };

      prev.set(speakerId, newSpeaker);
      resultSpeaker = newSpeaker;
      return new Map(prev);
    });

    return resultSpeaker;
  }, [identifySpeakerRole]);

  /**
   * Processa nova transcrição com speaker ID
   * ENHANCED: Detecta mudanças de speaker baseado no conteúdo (ignora Deepgram bugado)
   */
  const processTranscription = useCallback((
    text: string,
    speakerId: number, // Ignoramos este ID - Deepgram sempre retorna 0
    isFinal: boolean = false,
    confidence?: number
  ) => {
    if (!text.trim()) return;

    // DETECÇÃO INTELIGENTE: Identificar role baseado no conteúdo
    const detectedRole = identifySpeakerRole(virtualSpeakerId.current, text, speakers);

    // Se detectamos uma mudança de role, criar um novo speaker virtual
    if (lastDetectedRole.current !== null &&
        lastDetectedRole.current !== detectedRole &&
        detectedRole !== 'unknown') {
      // Mudança detectada! Incrementar ID virtual
      virtualSpeakerId.current += 1;
      console.log(`🔄 Speaker role change detected: ${lastDetectedRole.current} → ${detectedRole}`);
    }

    // Atualizar último role detectado (se não for unknown)
    if (detectedRole !== 'unknown') {
      lastDetectedRole.current = detectedRole;
    }

    // Usar nosso speaker ID virtual ao invés do Deepgram
    const effectiveSpeakerId = virtualSpeakerId.current;

    // Registrar speaker com ID virtual
    const speaker = registerSpeaker(effectiveSpeakerId, text);

    // Safety check
    if (!speaker || !speaker.name) {
      console.error('❌ Invalid speaker object:', speaker);
      return;
    }

    // Detectar mudança de speaker virtual
    if (lastSpeakerId.current !== null && lastSpeakerId.current !== effectiveSpeakerId) {
      console.log(`🔄 Virtual speaker change: ${lastSpeakerId.current} → ${effectiveSpeakerId}`);
      if (onSpeakerChange) {
        onSpeakerChange(speaker);
      }
    }

    lastSpeakerId.current = effectiveSpeakerId;
    setCurrentSpeaker(speaker);

    // Gerenciar transcrição temporária (interim)
    if (!isFinal) {
      setInterimTranscript({ speakerId: effectiveSpeakerId, text: text.trim() });
    } else {
      // Limpar interim quando for final
      setInterimTranscript(null);

      const segment: TranscriptionSegment = {
        id: `seg-${++segmentIdCounter.current}`,
        speaker,
        text: text.trim(),
        timestamp: Date.now(),
        isFinal: true,
        confidence,
      };

      setSegments(prev => [...prev, segment]);

      if (onSegmentComplete) {
        onSegmentComplete(segment);
      }

      console.log(`📝 [${speaker.name}] "${text}"`);
    }
  }, [registerSpeaker, onSpeakerChange, onSegmentComplete, identifySpeakerRole, speakers]);

  /**
   * Força identificação de um speaker
   */
  const setSpeakerRole = useCallback((speakerId: number, role: SpeakerRole, name?: string) => {
    setSpeakers(prev => {
      const existing = prev.get(speakerId);
      if (!existing) {
        console.warn(`Speaker ${speakerId} not found`);
        return prev;
      }

      const updated: Speaker = {
        ...existing,
        role,
        name: name || (role === 'doctor' ? 'Médico' : role === 'patient' ? 'Paciente' : existing.name),
      };

      prev.set(speakerId, updated);
      console.log(`✅ Speaker ${speakerId} identified as ${role}${name ? ` (${name})` : ''}`);
      return new Map(prev);
    });
  }, []);

  /**
   * Obtém estatísticas por speaker
   */
  const getSpeakerStats = useCallback((): SpeakerStats[] => {
    const stats = new Map<number, SpeakerStats>();

    segments.forEach(segment => {
      const speakerId = segment.speaker.id;
      const existing = stats.get(speakerId);

      if (existing) {
        existing.wordCount += segment.text.split(' ').length;
        existing.segments += 1;
        if (segment.confidence) {
          existing.averageConfidence =
            (existing.averageConfidence * (existing.segments - 1) + segment.confidence) / existing.segments;
        }
      } else {
        stats.set(speakerId, {
          speaker: segment.speaker,
          wordCount: segment.text.split(' ').length,
          speakingTime: 0, // TODO: calcular baseado em timestamps
          averageConfidence: segment.confidence || 0,
          segments: 1,
        });
      }
    });

    return Array.from(stats.values());
  }, [segments]);

  /**
   * Formata transcrição completa com speakers
   */
  const getFormattedTranscript = useCallback((): string => {
    const history = segments
      .filter(seg => seg.speaker && seg.speaker.name) // Safety check
      .map(seg => `${seg.speaker.name}: ${seg.text}`)
      .join('\n\n');

    if (interimTranscript) {
      const speaker = speakers.get(interimTranscript.speakerId);
      const speakerName = speaker?.name || `Speaker ${interimTranscript.speakerId}`;
      const interimLine = `${speakerName}: ${interimTranscript.text}...`;
      return history ? `${history}\n\n${interimLine}` : interimLine;
    }

    return history;
  }, [segments, interimTranscript, speakers]);

  /**
   * Limpa tudo
   */
  const reset = useCallback(() => {
    setSpeakers(new Map());
    setSegments([]);
    setCurrentSpeaker(null);
    setInterimTranscript(null);
    lastSpeakerId.current = null;
    lastDetectedRole.current = null;
    virtualSpeakerId.current = 0;
    segmentIdCounter.current = 0;
    console.log('🔄 Speaker diarization reset');
  }, []);

  /**
   * Obtém speaker por ID
   */
  const getSpeaker = useCallback((speakerId: number): Speaker | undefined => {
    return speakers.get(speakerId);
  }, [speakers]);

  return {
    // Estado
    speakers: Array.from(speakers.values()),
    speakersMap: speakers,
    segments,
    currentSpeaker,

    // Métodos
    processTranscription,
    setSpeakerRole,
    getSpeakerStats,
    getFormattedTranscript,
    getSpeaker,
    reset,
  };
}
