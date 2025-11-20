import type { AISuggestions, UsageStats } from './types';

// Simula delay de rede
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock: Perguntar sobre o paciente
export async function askAboutPatient(_patientId: string, question: string): Promise<{ answer: string }> {
  await delay(800);

  const mockAnswers: Record<string, string> = {
    default: 'Este paciente teve creatinina de 1,3 mg/dL no último exame registrado há 4 meses.',
    medicação: 'O paciente está usando Losartana 50mg/dia e Metformina 850mg 2x/dia regularmente.',
    alergia: 'Paciente apresenta alergia documentada a Penicilina (rash cutâneo).',
    exame: 'Último hemograma: Hb 13,2 g/dL, Leucócitos 7.200/mm³, Plaquetas 250.000/mm³.',
  };

  const lowerQ = question.toLowerCase();
  if (lowerQ.includes('medicação') || lowerQ.includes('remédio')) {
    return { answer: mockAnswers.medicação };
  }
  if (lowerQ.includes('alergia')) {
    return { answer: mockAnswers.alergia };
  }
  if (lowerQ.includes('exame')) {
    return { answer: mockAnswers.exame };
  }

  return { answer: mockAnswers.default };
}

// Mock: Obter sugestões da IA durante a consulta
export async function getAISuggestions(/* consultationId: string, transcript: string */): Promise<AISuggestions> {
  await delay(1200);

  return {
    suggestedQuestions: [
      'Há quanto tempo começou a sentir essa dor?',
      'A dor piora com algum movimento específico?',
      'Teve febre ou outros sintomas associados?',
      'Já tomou alguma medicação para aliviar?',
    ],
    diagnosesMostLikely: [
      'Faringite viral aguda',
      'Amigdalite bacteriana',
    ],
    diagnosesPossible: [
      'Mononucleose infecciosa',
      'Refluxo gastroesofágico',
    ],
    diagnosesCantMiss: [
      'Abscesso peritonsilar',
      'Epiglotite (se dispneia ou estridor)',
    ],
    diagnosesToConsider: [],
    diagnosesUnlikely: [],
    reminders: [
      'Verificar sintomas de alarme antes de liberar o paciente',
      'Examinar orofaringe com boa iluminação',
      'Considerar teste rápido para Strepto A se disponível',
      'Orientar sinais de retorno imediato (disfagia grave, dispneia)',
    ],
  };
}

// Mock: Gerar nota clínica
export async function generateClinicalNote(/* consultationId: string */): Promise<string> {
  await delay(1500);

  return `**Queixa principal:**
Dor de garganta há 3 dias.

**História da doença atual:**
Paciente refere início de odinofagia há 3 dias, de moderada intensidade, acompanhada de febre não aferida e mal-estar geral. Nega tosse produtiva, dispneia ou rouquidão. Sem melhora com analgésicos comuns.

**Antecedentes relevantes:**
- Hipertensão arterial sistêmica em uso regular de Losartana 50mg/dia
- Diabetes Mellitus tipo 2 em uso de Metformina 850mg 2x/dia
- Alergia a Penicilina (rash cutâneo)

**Exame físico:**
- Estado geral: bom, corado, hidratado, acianótico
- PA: 130/80 mmHg, FC: 88 bpm, Tax: 37,8°C
- Orofaringe: hiperemia de pilares amigdalianos, sem exsudato
- Ausência de linfonodomegalia cervical dolorosa

**Hipóteses diagnósticas:**
1. Faringite viral aguda (principal)
2. Faringite bacteriana (a considerar)

**Conduta:**
- Orientações sobre hidratação e repouso
- Analgesia: Paracetamol 750mg VO 6/6h se dor
- Anti-inflamatório: Ibuprofeno 400mg VO 8/8h por 3-5 dias
- Retornar se piora dos sintomas, febre persistente > 3 dias ou surgimento de dispneia
- Reavaliação em 5-7 dias se sem melhora

Médico: Dr. Silva
CRM: XXXXX
Data: ${new Date().toLocaleDateString('pt-BR')}`;
}

import type { PatientSummary } from './types';

// Mock: Gerar resumo para o paciente
export async function generatePatientSummary(_consultationId: string): Promise<PatientSummary> {
  await delay(1000);

  return {
    explanation: `Você está com uma inflamação na garganta, provavelmente causada por um vírus. É uma condição comum e que geralmente melhora sozinha em alguns dias com os cuidados adequados.`,
    whatToDo: [
      'Beba bastante água e líquidos mornos (chás, sopas)',
      'Faça repouso e evite esforços físicos',
      'Tome os medicamentos prescritos nos horários corretos',
      'Evite alimentos muito quentes ou gelados',
      'Durma bem e mantenha o ambiente umidificado',
    ],
    whenToReturn: [
      'Se a febre não passar em 3 dias',
      'Se aparecer dificuldade para respirar ou engolir',
      'Se a dor piorar muito ou aparecerem novos sintomas',
      'Se não houver melhora após 5-7 dias',
    ],
  };
}

// Mock: Estatísticas de uso
export async function getUsageStats(): Promise<UsageStats> {
  await delay(500);

  return {
    monthConsultations: 12,
    monthLimit: 80,
    planName: 'Starter',
    planPrice: 99,
    timeSaved: 60, // em minutos (12 consultas * 5min)
  };
}
