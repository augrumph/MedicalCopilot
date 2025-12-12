import type { AISuggestions, UsageStats } from './types';

// Simula delay de rede
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Interface para SOAP em tempo real
export interface RealtimeSOAP {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
  isComplete: boolean;
  lastUpdated: string;
}

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

// Mock: Gerar nota clínica no formato SOAP
export async function generateClinicalNote(/* consultationId: string */): Promise<string> {
  await delay(1500);

  return `# SOAP - Nota Clínica

## S - SUBJETIVO (O que o paciente relata)

**Queixa Principal:**
Dor de garganta há 3 dias.

**História da Doença Atual:**
Paciente refere início de odinofagia há 3 dias, de moderada intensidade, que piora ao engolir. Relata febre não aferida ontem à noite (38°C segundo paciente). Nega tosse produtiva, dispneia ou rouquidão. Tentou aliviar com analgésicos comuns sem sucesso significativo.

**Antecedentes Pessoais:**
- Hipertensão arterial sistêmica em uso regular de Losartana 50mg/dia
- Diabetes Mellitus tipo 2 em uso de Metformina 850mg 2x/dia
- Alergia a Penicilina (rash cutâneo)
- Nega cirurgias prévias
- Nega tabagismo ou etilismo

**Medicações em Uso:**
- Losartana 50mg/dia
- Metformina 850mg 12/12h

---

## O - OBJETIVO (O que o médico observa)

**Exame Físico:**

**Sinais Vitais:**
- PA: 130/80 mmHg
- FC: 88 bpm
- FR: 16 irpm
- Tax: 37,8°C
- SpO2: 98% (ar ambiente)

**Estado Geral:**
Paciente em bom estado geral, corado, hidratado, acianótico, anictérico, afebril no momento do exame.

**Oroscopia:**
- Hiperemia e edema de pilares amigdalianos bilateral
- Ausência de exsudato purulento ou placas
- Úvula centralizada

**Palpação Cervical:**
- Ausência de linfonodomegalia cervical dolorosa
- Ausência de massas palpáveis

**Aparelho Respiratório:**
- Murmúrio vesicular presente e simétrico bilateralmente
- Ausência de ruídos adventícios

---

## A - AVALIAÇÃO (Diagnóstico e raciocínio clínico)

**Hipótese Diagnóstica Principal:**
1. **Faringite Viral Aguda** (mais provável)
   - Evidências: quadro clínico compatível com etiologia viral (ausência de exsudato purulento, febre baixa, sintomas sistêmicos leves)
   - Critérios de Centor: 1 ponto (presença de febre) - sugere etiologia viral

**Diagnósticos Diferenciais:**
2. Faringite Bacteriana (Streptococcus pyogenes) - menos provável pela ausência de exsudato
3. Mononucleose infecciosa - considerar se não houver melhora em 5-7 dias

**Diagnósticos Improváveis mas que não podem ser perdidos:**
- Abscesso peritonsilar (ausência de trismo, abaulamento unilateral)
- Epiglotite (ausência de dispneia, estridor ou disfagia grave)

---

## P - PLANO (Conduta terapêutica e seguimento)

**Tratamento Não Farmacológico:**
- Orientações sobre repouso relativo
- Hidratação abundante (2-3L de água/dia)
- Dieta leve e fria/gelada para alívio sintomático
- Gargarejos com água morna e sal (opcional)

**Tratamento Farmacológico:**

*Analgesia e Antitérmico:*
- Paracetamol 750mg VO de 6/6h se dor ou febre
  (máximo 4g/dia - atenção à função hepática)

*Anti-inflamatório:*
- Ibuprofeno 400mg VO de 8/8h por 3-5 dias
  (tomar após refeições - atenção à função renal e PA)

**Orientações de Sinais de Alerta:**
Retornar imediatamente se apresentar:
- Febre persistente > 3 dias ou > 39°C
- Dificuldade para respirar ou engolir
- Piora progressiva da dor
- Rigidez de nuca
- Alteração do estado mental

**Seguimento:**
- Retorno em 5-7 dias se não houver melhora
- Considerar teste rápido para Streptococcus se evolução desfavorável

**Atestado:**
Repouso de 2 dias

---

**Médico:** Dr. Silva
**CRM:** XXXXX
**Data:** ${new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })}
**Hora:** ${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`;
}

// Mock: Gerar SOAP em tempo real durante a transcrição
export async function generateRealtimeSOAP(transcript: string): Promise<RealtimeSOAP> {
  await delay(300); // Delay menor para parecer mais responsivo

  // Analisa a transcrição e extrai informações relevantes
  const lines = transcript.split('\n');
  const linesLower = transcript.toLowerCase().split('\n');

  // Extrai falas do paciente e do médico
  const patientLines = lines.filter(l => l.toLowerCase().startsWith('paciente:'));
  const doctorLines = lines.filter(l => l.toLowerCase().startsWith('médico:'));

  // Detecta seções da consulta
  const hasQueixa = linesLower.some(l =>
    l.includes('dor') || l.includes('sintoma') || l.includes('não estou bem')
  );

  const hasExameFisico = linesLower.some(l =>
    l.includes('examinar') || l.includes('sinais vitais') ||
    l.includes('pressão') || l.includes('temperatura') ||
    l.includes('auscultar') || l.includes('palpar') ||
    l.includes('observo') || l.includes('hiperemia')
  );

  const hasDiagnostico = linesLower.some(l =>
    l.includes('diagnóstico') || l.includes('faringite') ||
    l.includes('viral') || l.includes('bacteriana') ||
    l.includes('quadro clínico')
  );

  const hasTratamento = linesLower.some(l =>
    l.includes('prescrever') || l.includes('medicamento') ||
    l.includes('paracetamol') || l.includes('ibuprofeno') ||
    l.includes('tratamento') || l.includes('tomar')
  );

  // Constrói o SOAP progressivamente
  let subjective = '';
  let objective = '';
  let assessment = '';
  let plan = '';

  // SUBJETIVO - Extrai queixa e história
  if (hasQueixa && patientLines.length > 0) {
    const queixaPrincipal = patientLines[0]
      .replace(/^paciente:\s*/i, '')
      .trim();

    const historiaAtual = patientLines
      .slice(0, 10)
      .map(l => '• ' + l.replace(/^paciente:\s*/i, '').trim())
      .join('\n');

    subjective = `**Queixa Principal:**
${queixaPrincipal}

**História da Doença Atual:**
${historiaAtual}

**Revisão de Sistemas:**
${patientLines.length > 5 ? '• Paciente relatou sintomas associados durante a anamnese' : '• Em coleta...'}`;
  }

  // OBJETIVO - Extrai dados do exame físico
  if (hasExameFisico) {
    const exameFisicoLines = doctorLines
      .filter(l => {
        const lower = l.toLowerCase();
        return lower.includes('pressão') || lower.includes('temperatura') ||
               lower.includes('observo') || lower.includes('palp') ||
               lower.includes('ausculta') || lower.includes('examin');
      })
      .map(l => '• ' + l.replace(/^médico:\s*/i, '').trim())
      .join('\n');

    // Extrai sinais vitais especificamente
    const pvLine = lines.find(l => l.toLowerCase().includes('pressão arterial'));
    const fcLine = lines.find(l => l.toLowerCase().includes('frequência cardíaca'));
    const tempLine = lines.find(l => l.toLowerCase().includes('temperatura:'));
    const satLine = lines.find(l => l.toLowerCase().includes('saturação'));

    objective = `**Sinais Vitais:**
${pvLine ? '• ' + pvLine.replace(/^médico:\s*/i, '').trim() : '• PA: Em aferição...'}
${fcLine ? '• ' + fcLine.replace(/^médico:\s*/i, '').trim() : '• FC: Em aferição...'}
${tempLine ? '• ' + tempLine.replace(/^médico:\s*/i, '').trim() : '• Tax: Em aferição...'}
${satLine ? '• ' + satLine.replace(/^médico:\s*/i, '').trim() : ''}

**Exame Físico:**
${exameFisicoLines || '• Exame em andamento...'}`;
  }

  // AVALIAÇÃO - Extrai diagnóstico e raciocínio
  if (hasDiagnostico) {
    const diagnosticoLines = doctorLines
      .filter(l => {
        const lower = l.toLowerCase();
        return lower.includes('faringite') || lower.includes('diagnóstico') ||
               lower.includes('quadro') || lower.includes('causa') ||
               lower.includes('viral') || lower.includes('bacteriana');
      })
      .map(l => '• ' + l.replace(/^médico:\s*/i, '').trim())
      .join('\n');

    assessment = `**Hipótese Diagnóstica Principal:**
${diagnosticoLines || '• Análise em andamento...'}

**Diagnósticos Diferenciais:**
• Sendo considerados com base nos achados clínicos

**Raciocínio Clínico:**
• Baseado em anamnese completa e exame físico detalhado`;
  }

  // PLANO - Extrai tratamento e conduta
  if (hasTratamento) {
    const tratamentoLines = doctorLines
      .filter(l => {
        const lower = l.toLowerCase();
        return lower.includes('prescrever') || lower.includes('tomar') ||
               lower.includes('paracetamol') || lower.includes('ibuprofeno') ||
               lower.includes('líquido') || lower.includes('repouso') ||
               lower.includes('retorn') || lower.includes('orientação');
      })
      .map(l => '• ' + l.replace(/^médico:\s*/i, '').trim())
      .join('\n');

    plan = `**Tratamento Prescrito:**
${tratamentoLines || '• Plano terapêutico em definição...'}

**Orientações ao Paciente:**
• Orientações sendo fornecidas durante a consulta

**Seguimento:**
• Critérios de retorno sendo estabelecidos`;
  }

  const isComplete = hasQueixa && hasExameFisico && hasDiagnostico && hasTratamento;

  return {
    subjective,
    objective,
    assessment,
    plan,
    isComplete,
    lastUpdated: new Date().toISOString()
  };
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
