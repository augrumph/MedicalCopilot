/**
 * Transcription Types
 * Types for medical transcription with speaker diarization
 */

/**
 * Speaker identification
 */
export type SpeakerRole = 'doctor' | 'patient' | 'unknown';

export interface Speaker {
  id: number;              // Speaker ID from Deepgram (0, 1, 2, ...)
  role: SpeakerRole;       // Identified role (doctor/patient)
  name?: string;           // Optional speaker name
  confidence?: number;     // Confidence score
}

/**
 * Transcription segment with speaker info
 */
export interface TranscriptionSegment {
  id: string;
  speaker: Speaker;
  text: string;
  timestamp: number;
  isFinal: boolean;
  confidence?: number;
}

/**
 * Full consultation transcript
 */
export interface ConsultationTranscript {
  consultationId: string;
  startTime: number;
  endTime?: number;
  segments: TranscriptionSegment[];
  speakers: Map<number, Speaker>;
  metadata: {
    model: string;
    language: string;
    totalSegments: number;
    duration?: number;
  };
}

/**
 * Deepgram word-level data (for advanced diarization)
 */
export interface DeepgramWord {
  word: string;
  start: number;
  end: number;
  confidence: number;
  speaker?: number;
  punctuated_word?: string;
}

/**
 * Speaker statistics
 */
export interface SpeakerStats {
  speaker: Speaker;
  wordCount: number;
  speakingTime: number;     // milliseconds
  averageConfidence: number;
  segments: number;
}

/**
 * AI Analysis Types
 */

export type AIInsightType = 'alert' | 'suggestion' | 'diagnostic' | 'exam' | 'medication';

export interface AIInsight {
  id: string;
  type: AIInsightType;
  title: string;
  content: string;
  tags?: string[];
  confidence?: number;
  timestamp: number;
}

export interface AIAnalysisResponse {
  insights: Array<{
    type: AIInsightType;
    title: string;
    content: string;
    tags?: string[];
  }>;
}

/**
 * SOAP Generation Types
 */

export interface SOAPContent {
  subjetivo: string;
  objetivo: string;
  avaliacao: string;
  plano: string;
}

export interface SOAPGenerationRequest {
  transcript: string;
  patientName: string;
  patientAge?: number;
  patientGender?: string;
}
