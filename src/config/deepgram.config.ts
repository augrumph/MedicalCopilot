/**
 * Deepgram Configuration
 * Optimized settings for medical transcription
 */

/**
 * Medical Keywords para Deepgram Keyword Boosting
 * Aumenta a precisão em até 6x para termos médicos específicos
 * Formato: "palavra:peso" onde peso é 1.0-2.0
 */
export const MEDICAL_KEYWORDS = [
  // Condições comuns
  'hipertensão:1.5',
  'diabetes:1.5',
  'covid:1.5',
  'asma:1.5',
  'pneumonia:1.5',
  'bronquite:1.5',
  'sinusite:1.5',
  'faringite:1.5',
  'amigdalite:1.5',
  'gastrite:1.5',
  'rinite:1.5',
  'otite:1.5',

  // Medicamentos comuns
  'medicamento:1.5',
  'remédio:1.5',
  'prescrição:1.5',
  'receita:1.5',
  'dipirona:1.5',
  'paracetamol:1.5',
  'ibuprofeno:1.5',
  'amoxicilina:1.5',
  'azitromicina:1.5',
  'losartana:1.5',
  'enalapril:1.5',
  'metformina:1.5',
  'omeprazol:1.5',
  'sinvastatina:1.5',

  // Termos médicos gerais
  'paciente:1.5',
  'sintoma:1.5',
  'diagnóstico:1.5',
  'tratamento:1.5',
  'exame:1.5',
  'consulta:1.5',
  'prontuário:1.5',
  'anamnese:1.5',
  'histórico:1.5',
  'alergia:1.5',
  'alérgico:1.5',

  // Sinais vitais
  'pressão:1.5',
  'temperatura:1.5',
  'frequência:1.5',
  'cardíaca:1.5',
  'respiratória:1.5',
  'saturação:1.5',
  'oxigênio:1.5',

  // Especialidades
  'cardiologia:1.3',
  'pediatria:1.3',
  'ortopedia:1.3',
  'dermatologia:1.3',
  'ginecologia:1.3',
  'neurologia:1.3',
  'psiquiatria:1.3',

  // CID-10 (exemplos)
  'CID:1.8',
  'I10:1.8',
  'E11:1.8',
  'J06:1.8',
  'A09:1.8',
];

/**
 * Deepgram Model Configuration
 * Nova-3 oferece 54% melhor WER para streaming em pt-BR
 */
export const DEEPGRAM_CONFIG = {
  // Modelo otimizado para português
  model: 'nova-3',
  language: 'pt-BR',

  // Formatação e limpeza
  smart_format: true,      // Formatar moedas, datas, etc
  punctuate: true,         // Adicionar pontuação automática
  filler_words: true,      // Remover "ãh", "né", etc
  numerals: true,          // Formatar números (50 → cinquenta)

  // Real-time features
  interim_results: true,   // Resultados parciais (latência ~150ms)

  // Diarização de alta precisão
  diarize: true,           // Identificar diferentes speakers

  // Keywords para termos médicos (REDUZIDO - apenas essenciais)
  // Compatible only with Nova-3
  keywords: [
    'hipertensão:1.8',
    'diabetes:1.8',
    'paciente:1.5',
    'sintoma:1.5',
    'diagnóstico:1.5',
    'pressão:1.5',
    'medicamento:1.5',
    'exame:1.5',
    'CID:1.8',
  ],

  // Audio optimization
  encoding: 'linear16' as const,
  sample_rate: 16000,      // 16kHz suficiente para voz humana

  // Advanced features
  utterances: true,        // Detectar fim de frase
  utt_split: 0.8,         // Sensibilidade de divisão de frase
};

/**
 * Audio Chunk Configuration
 * Baseado em best practices da Deepgram
 */
export const AUDIO_CHUNK_CONFIG = {
  // Chunk size ideal para diferentes condições de rede
  stable: 100,      // 100ms - conexão 4G/5G/WiFi
  moderate: 150,    // 150ms - conexão 3G
  poor: 250,        // 250ms - conexão 2G/instável
  default: 150,     // Default: 150ms (bom equilíbrio)

  // Keep-alive interval (recomendação Deepgram)
  keepAliveInterval: 3000,  // 3 segundos

  // Audio quality
  audioBitsPerSecond: 16000,  // 16kbps para voz
} as const;

/**
 * Detecta o melhor mimeType suportado pelo navegador
 * Opus codec é 3x mais eficiente que WebM padrão
 */
export const getBestAudioMimeType = (): string => {
  const types = [
    'audio/webm;codecs=opus',  // Melhor opção - Opus codec
    'audio/ogg;codecs=opus',   // Fallback Opus
    'audio/webm',              // WebM genérico
    'audio/ogg',               // OGG genérico
    'audio/mp4',               // MP4 (última opção)
  ];

  const supported = types.find(type => MediaRecorder.isTypeSupported(type));

  if (!supported) {
    console.warn('⚠️ No preferred audio format supported, using default');
    return '';
  }

  console.log('✅ Using audio format:', supported);
  return supported;
};

/**
 * Detecta qualidade da conexão de rede
 * Retorna chunk size apropriado
 */
export const getOptimalChunkSize = (): number => {
  // @ts-ignore - NetworkInformation API pode não estar disponível
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;

  if (!connection) {
    return AUDIO_CHUNK_CONFIG.default;
  }

  const effectiveType = connection.effectiveType;

  switch (effectiveType) {
    case '4g':
    case '5g':
      return AUDIO_CHUNK_CONFIG.stable;
    case '3g':
      return AUDIO_CHUNK_CONFIG.moderate;
    case '2g':
    case 'slow-2g':
      return AUDIO_CHUNK_CONFIG.poor;
    default:
      return AUDIO_CHUNK_CONFIG.default;
  }
};

/**
 * Performance Monitoring
 */
export const createLatencyMonitor = () => {
  const latencies: number[] = [];
  let totalTranscripts = 0;

  return {
    recordLatency: (startTime: number) => {
      const latency = Date.now() - startTime;
      latencies.push(latency);
      totalTranscripts++;

      // Manter apenas últimas 100 medições
      if (latencies.length > 100) {
        latencies.shift();
      }

      return latency;
    },

    getStats: () => {
      if (latencies.length === 0) {
        return null;
      }

      const sorted = [...latencies].sort((a, b) => a - b);
      const p50 = sorted[Math.floor(sorted.length * 0.5)];
      const p95 = sorted[Math.floor(sorted.length * 0.95)];
      const p99 = sorted[Math.floor(sorted.length * 0.99)];
      const avg = latencies.reduce((a, b) => a + b, 0) / latencies.length;

      return {
        p50,
        p95,
        p99,
        avg: Math.round(avg),
        total: totalTranscripts,
      };
    },

    reset: () => {
      latencies.length = 0;
      totalTranscripts = 0;
    }
  };
};
