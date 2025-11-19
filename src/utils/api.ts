// Mock API service with simulated latency
export const mockApi = {
  // Patients API
  getPatients: async (): Promise<any[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [
      {
        id: '1',
        name: 'Maria Santos',
        age: 45,
        gender: 'Feminino',
        history: 'Hipertensão arterial',
        allergies: 'Penicilina',
      },
      {
        id: '2',
        name: 'João Oliveira',
        age: 62,
        gender: 'Masculino',
        history: 'Diabetes tipo 2',
        allergies: 'Nenhuma',
      },
      {
        id: '3',
        name: 'Ana Costa',
        age: 34,
        gender: 'Feminino',
        history: 'Asma',
        allergies: 'Pólen',
      },
    ];
  },

  createPatient: async (patientData: any): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return {
      ...patientData,
      id: Math.random().toString(36).substr(2, 9),
    };
  },

  // Consultations API
  getConsultations: async (): Promise<any[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return [
      {
        id: '1',
        patientId: '1',
        date: '2023-10-15',
        transcript: 'O paciente apresenta sintomas de dor de cabeça persistente...',
        aiResponse: 'Com base nos sintomas relatados, sugiro considerar: 1) Hipertensão, 2) Enxaqueca, 3) Desidratação.',
        diagnosis: 'Dor de cabeça tensional'
      }
    ];
  },

  createConsultation: async (consultationData: any): Promise<any> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      ...consultationData,
      id: Math.random().toString(36).substr(2, 9),
    };
  },

  // AI Transcription API
  transcribeAudio: async (audioData: Blob): Promise<string> => {
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
  getAIReasoning: async (transcript: string): Promise<any> => {
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