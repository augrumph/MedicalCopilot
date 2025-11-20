import type { Patient, Consultation } from './types';

// Nomes brasileiros realistas
const firstNames = [
  'Maria', 'João', 'Ana', 'Pedro', 'Juliana', 'Carlos', 'Fernanda', 'Lucas',
  'Mariana', 'Rafael', 'Camila', 'Bruno', 'Beatriz', 'Felipe', 'Amanda',
  'Rodrigo', 'Larissa', 'Thiago', 'Gabriela', 'Gustavo', 'Patricia',
  'Diego', 'Renata', 'Marcelo', 'Vanessa', 'Leonardo', 'Priscila',
  'Anderson', 'Leticia', 'Ricardo', 'Aline', 'Fabio', 'Tatiane',
  'Vinicius', 'Carla', 'Eduardo', 'Claudia', 'Marcos', 'Sandra',
  'Paulo', 'Monica', 'Roberto', 'Adriana', 'Alexandre', 'Denise',
  'Daniel', 'Luciana', 'Fernando', 'Cristina', 'Sergio', 'Simone'
];

const lastNames = [
  'Silva', 'Santos', 'Oliveira', 'Souza', 'Lima', 'Pereira', 'Costa',
  'Rodrigues', 'Almeida', 'Nascimento', 'Araujo', 'Fernandes', 'Gomes',
  'Martins', 'Rocha', 'Ribeiro', 'Carvalho', 'Alves', 'Monteiro', 'Mendes',
  'Barbosa', 'Dias', 'Castro', 'Campos', 'Cardoso', 'Cavalcanti', 'Reis',
  'Freitas', 'Pinto', 'Moreira', 'Teixeira', 'Vieira', 'Azevedo', 'Correia',
  'Nunes', 'Soares', 'Ramos', 'Cunha', 'Barros', 'Moura', 'Melo'
];

const diagnoses = [
  'Hipertensão Arterial Sistêmica',
  'Diabetes Mellitus tipo 2',
  'Infecção Respiratória Aguda',
  'Gastrite',
  'Cefaleia Tensional',
  'Enxaqueca',
  'Lombalgia',
  'Faringite Aguda',
  'Rinite Alérgica',
  'Ansiedade Generalizada',
  'Depressão Leve',
  'Infecção do Trato Urinário',
  'Dermatite Atópica',
  'Artrose de Joelho',
  'Refluxo Gastroesofágico',
  'Obesidade',
  'Dislipidemia',
  'Insônia',
  'Síndrome do Intestino Irritável',
  'Hipotireoidismo',
  'Bursite de Ombro',
  'Tendinite',
  'Asma Brônquica',
  'Pneumonia Comunitária',
  'Amigdalite Bacteriana',
  'Conjuntivite Viral',
  'Otite Média Aguda',
  'Sinusite Aguda',
  'Dengue',
  'Covid-19'
];

const medications = [
  'Losartana 50mg',
  'Enalapril 10mg',
  'Metformina 850mg',
  'Glibenclamida 5mg',
  'Omeprazol 20mg',
  'Paracetamol 500mg',
  'Ibuprofeno 400mg',
  'Dipirona 500mg',
  'Amoxicilina 500mg',
  'Azitromicina 500mg',
  'Loratadina 10mg',
  'Dexclorfeniramina 2mg',
  'Sinvastatina 20mg',
  'Atorvastatina 20mg',
  'Levotiroxina 50mcg',
  'Escitalopram 10mg',
  'Fluoxetina 20mg',
  'Clonazepam 2mg',
  'Rivotril 0,5mg',
  'Dorflex'
];

// Gerar nome completo
const generateName = (): string => {
  const first = firstNames[Math.floor(Math.random() * firstNames.length)];
  const last = lastNames[Math.floor(Math.random() * lastNames.length)];
  const middle = Math.random() > 0.5 ? lastNames[Math.floor(Math.random() * lastNames.length)] : '';
  return middle ? `${first} ${middle} ${last}` : `${first} ${last}`;
};

// Gerar idade
const generateAge = (): number => {
  return Math.floor(Math.random() * 60) + 20; // 20-80 anos
};

// Gerar gênero
const generateGender = (): "masculino" | "feminino" => {
  return Math.random() > 0.5 ? "masculino" : "feminino";
};

// Gerar data aleatória nos últimos 180 dias
const generateRecentDate = (daysAgo: number = 180): string => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  date.setHours(Math.floor(Math.random() * 12) + 8); // Entre 8h e 20h
  date.setMinutes(Math.floor(Math.random() * 60));
  return date.toISOString();
};

// Gerar diagnóstico aleatório
const generateDiagnosis = (): string => {
  return diagnoses[Math.floor(Math.random() * diagnoses.length)];
};

// Gerar medicação aleatória
const generateMedication = (): string => {
  return medications[Math.floor(Math.random() * medications.length)];
};

// Gerar nota clínica enxuta
const generateClinicalNote = (diagnosis: string, age: number): string => {
  const templates = [
    `Paciente ${age}a, ${diagnosis}. Sintomas há 5 dias. PA: 130/85, FC: 78bpm. Prescrito medicação, hidratação, repouso. Retorno 7d.`,

    `${diagnosis} - Quadro iniciado há 3d. Exame: BEG, sinais vitais estáveis. Plano: tratamento medicamentoso + medidas não farmacológicas. Reavaliar 15d.`,

    `Retorno - ${diagnosis} em acompanhamento. Evolução favorável, aderente ao tratamento. Manter conduta atual. Retorno 30d.`,

    `${diagnosis} confirmado. Iniciado tratamento com orientações de autocuidado. Paciente orientado sobre sinais de alerta. Retorno se piora ou em 10d.`,

    `Consulta: ${diagnosis}. Exame físico sem alterações graves. Conduta conservadora, medicação sintomática. Retorno conforme necessário.`
  ];

  return templates[Math.floor(Math.random() * templates.length)];
};

// Gerar resumo para paciente
const generatePatientSummary = (diagnosis: string) => {
  const summaries = [
    {
      explanation: `Você está com ${diagnosis}. É uma condição comum e que tem tratamento adequado.`,
      whatToDo: [
        'Tomar a medicação nos horários corretos',
        'Manter alimentação saudável',
        'Praticar atividade física leve',
        'Evitar estresse excessivo'
      ],
      whenToReturn: [
        'Retornar em 30 dias para reavaliação',
        'Se houver piora dos sintomas, retornar antes',
        'Trazer exames se solicitados'
      ]
    },
    {
      explanation: `O diagnóstico é ${diagnosis}. Vamos controlar com medicação e mudanças no estilo de vida.`,
      whatToDo: [
        'Seguir corretamente a prescrição médica',
        'Aumentar ingestão de água (2-3L/dia)',
        'Evitar alimentos muito gordurosos',
        'Dormir adequadamente (7-8 horas)'
      ],
      whenToReturn: [
        'Consulta de retorno em 15 dias',
        'Se febre persistir por mais de 3 dias',
        'Se surgirem novos sintomas'
      ]
    }
  ];

  return summaries[Math.floor(Math.random() * summaries.length)];
};

// Gerar pacientes
export const generateMockPatients = (count: number = 100): Patient[] => {
  const patients: Patient[] = [];

  for (let i = 0; i < count; i++) {
    patients.push({
      id: `patient-${i + 1}`,
      name: generateName(),
      age: generateAge(),
      gender: generateGender(),
      mainConditions: Math.random() > 0.7 ? [generateDiagnosis()] : undefined,
      medications: Math.random() > 0.6 ? [generateMedication()] : undefined,
      attachments: []
    });
  }

  return patients;
};

// Gerar consultas
export const generateMockConsultations = (patients: Patient[], count: number = 100): Consultation[] => {
  const consultations: Consultation[] = [];

  // Garantir que cada paciente tenha pelo menos 1 consulta
  const patientsToAssign = [...patients];

  for (let i = 0; i < count; i++) {
    // Se ainda temos pacientes sem consulta, pegar um deles
    // Caso contrário, pegar um paciente aleatório (retorno)
    const patientId = i < patientsToAssign.length
      ? patientsToAssign[i].id
      : patients[Math.floor(Math.random() * patients.length)].id;

    const patient = patients.find(p => p.id === patientId)!;
    const diagnosis = generateDiagnosis();
    const startedAt = generateRecentDate();
    const startDate = new Date(startedAt);
    const endDate = new Date(startDate.getTime() + (30 + Math.floor(Math.random() * 30)) * 60000); // 30-60 min

    const diagnoses = [diagnosis];
    if (Math.random() > 0.7) {
      diagnoses.push(generateDiagnosis());
    }

    const possibleDiagnoses: string[] = [];
    if (Math.random() > 0.5) {
      possibleDiagnoses.push(generateDiagnosis());
    }

    const cantMiss: string[] = [];
    if (Math.random() > 0.85) {
      cantMiss.push(generateDiagnosis());
    }

    const reminders = [
      `Verificar evolução de ${diagnosis.toLowerCase()}`,
      `Perguntar sobre adesão à medicação prescrita`,
      `Avaliar necessidade de exames complementares`
    ];

    consultations.push({
      id: `consultation-${i + 1}`,
      patientId: patientId,
      startedAt: startedAt,
      finishedAt: endDate.toISOString(),
      status: 'finished',
      transcript: `Médico: Bom dia, como está se sentindo?
Paciente: Olá doutor, vim porque estou com ${diagnosis.toLowerCase()}.
Médico: Há quanto tempo começou?
Paciente: Faz uns 3 dias que venho sentindo...
Médico: Entendo. Vou examinar...`,
      aiSuggestions: {
        suggestedQuestions: [
          `Como está a intensidade dos sintomas de ${diagnosis.toLowerCase()}?`,
          'Teve febre nos últimos dias?',
          'Está conseguindo se alimentar normalmente?'
        ],
        diagnosesMostLikely: diagnoses,
        diagnosesPossible: possibleDiagnoses,
        diagnosesCantMiss: cantMiss,
        diagnosesToConsider: [],
        diagnosesUnlikely: [],
        reminders: reminders
      },
      doctorNotes: generateClinicalNote(diagnosis, patient.age || 50),
      patientSummary: generatePatientSummary(diagnosis)
    });
  }

  // Ordenar por data (mais recentes primeiro)
  return consultations.sort((a, b) =>
    new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
  );
};
