export type AppContext = 'medical';

export interface ContextConfig {
  // General
  appName: string;
  professionalTitle: string;
  professionalTitleShort: string;

  // Patient/Client
  patientLabel: string;
  patientLabelPlural: string;

  // Consultation/Session
  consultationLabel: string;
  consultationLabelPlural: string;
  consultationAction: string;
  consultationInProgress: string;

  // Medical/Clinical terms
  diagnosisLabel: string;
  diagnosisLabelPlural: string;
  clinicalNoteLabel: string;
  summaryLabel: string;

  // Actions
  startConsultationAction: string;
  finishConsultationAction: string;
  generateNoteAction: string;

  // History
  historyTitle: string;
  historyDescription: string;

  // Dashboard
  dashboardTitle: string;
  dashboardWelcome: string;

  // Placeholders
  searchPlaceholder: string;
  notePlaceholder: string;
}

export const contextConfigs: Record<AppContext, ContextConfig> = {
  medical: {
    appName: 'Medical Copilot',
    professionalTitle: 'Médico',
    professionalTitleShort: 'Dr.',

    patientLabel: 'Paciente',
    patientLabelPlural: 'Pacientes',

    consultationLabel: 'Consulta',
    consultationLabelPlural: 'Consultas',
    consultationAction: 'Iniciar Consulta',
    consultationInProgress: 'Consulta em andamento',

    diagnosisLabel: 'Diagnóstico',
    diagnosisLabelPlural: 'Diagnósticos',
    clinicalNoteLabel: 'Nota Clínica',
    summaryLabel: 'Resumo para o Paciente',

    startConsultationAction: 'Iniciar Consulta',
    finishConsultationAction: 'Finalizar Consulta',
    generateNoteAction: 'Gerar Nota Clínica',

    historyTitle: 'Histórico de Consultas',
    historyDescription: 'Todas as consultas finalizadas',

    dashboardTitle: 'Dashboard Médico',
    dashboardWelcome: 'Bem-vindo de volta',

    searchPlaceholder: 'Buscar paciente, diagnóstico ou nota...',
    notePlaceholder: 'Digite a nota clínica da consulta...',
  }
};

export const getContextConfig = (context: AppContext): ContextConfig => {
  return contextConfigs[context];
};
