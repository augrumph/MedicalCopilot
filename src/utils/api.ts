import { Patient, Consultation } from '@/lib/types';

// Mock API service with simulated latency
export const mockApi = {
  // Patients API
  getPatients: async (): Promise<Patient[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [
      {
        id: '1',
        name: 'Maria Santos',
        age: 45,
        gender: 'feminino',
        mainConditions: ['Hipertensão arterial'],
        allergies: ['Penicilina'],
      },
      {
        id: '2',
        name: 'João Oliveira',
        age: 62,
        gender: 'masculino',
        mainConditions: ['Diabetes tipo 2'],
        allergies: ['Nenhuma'],
      },
      {
        id: '3',
        name: 'Ana Costa',
        age: 34,
        gender: 'feminino',
        mainConditions: ['Asma'],
        allergies: ['Pólen'],
      },
    ];
  },

  createPatient: async (patientData: Omit<Patient, 'id'>): Promise<Patient> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return {
      ...patientData,
      id: Math.random().toString(36).substr(2, 9),
    };
  },

  // Consultations API
  getConsultations: async (): Promise<Consultation[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [
      {
        id: '1',
        patientId: '1',
        startedAt: '2023-10-15',
        status: 'finished',
        transcript: 'O paciente apresenta sintomas de dor de cabeça persistente...',
        aiSuggestions: {
          suggestedQuestions: [],
          diagnosesMostLikely: [],
          diagnosesPossible: [],
          diagnosesCantMiss: [],
          diagnosesToConsider: [],
          diagnosesUnlikely: [],
          reminders: []
        },
        doctorNotes: 'Dor de cabeça tensional'
      }
    ];
  },

  createConsultation: async (consultationData: Omit<Consultation, 'id'>): Promise<Consultation> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      ...consultationData,
      id: Math.random().toString(36).substr(2, 9),
    };
  },

  // AI Transcription API
  transcribeAudio: async (_audioData: Blob): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const mockResponses = [
      "O paciente relata dor de cabeça há 3 dias, piorando com estresse.",
      "Apresenta febre baixa e cansaço constante há uma semana.",
      "Mãe refere que a criança apresenta tosse seca e coriza há 2 dias.",
      "Paciente com histórico de hipertensão, mas tomando medicamento regularmente."
    ];
    return mockResponses[Math.floor(Math.random() * mockResponses.length)];
  },

  // AI Reasoning API
  getAIReasoning: async (_transcript: string): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      diagnosticHypotheses: [
        "Hipertensão arterial",
        "Enxaqueca",
        "Desidratação"
      ],
      redFlags: [
        "Febre persistente",
        "Dor intensa",
        "Histórico familiar de doenças cardíacas"
      ],
      recommendations: [
        "Solicitar exame de sangue completo",
        "Monitorar pressão arterial por 7 dias",
        "Prescrever repouso e hidratação adequada"
      ]
    };
  }
};