export type PatientAttachment = {
  id: string;
  name: string;
  type: string; // MIME type
  size: number; // bytes
  uploadedAt: string;
  url?: string; // URL do arquivo (pode ser base64 ou URL do storage)
  category?: 'exame' | 'laudo' | 'imagem' | 'documento' | 'outro';
};

export type Patient = {
  id: string;
  name: string;
  age?: number;
  gender?: "masculino" | "feminino" | "outro" | "nao_informado";
  mainConditions?: string[]; // DM2, HAS etc.
  medications?: string[];
  attachments?: PatientAttachment[]; // Arquivos anexados (exames, laudos, imagens, etc.)
  notes?: string; // observações gerais
};

export type ConsultationStatus = "draft" | "in_progress" | "finished";

export type AISuggestions = {
  suggestedQuestions: string[];
  diagnosesMostLikely: string[];
  diagnosesPossible: string[];
  diagnosesCantMiss: string[];
  reminders: string[]; // coisas a não esquecer (exame físico, encaminhamento etc.)
};

export type SignatureType = 'icp-brasil-mock' | 'icp-brasil-a3' | 'icp-brasil-a1' | 'none';

export type PrescriptionStatus = "draft" | "signed" | "revoked";

export type Prescription = {
  id: string; // ID público (o que aparece no PDF - ex: RX-2025-00001234)
  internalId: string; // ID interno
  consultationId: string;
  createdAt: string;
  signedAt?: string;
  signedByDoctorId?: string;
  doctorCRM?: string;
  doctorUF?: string;
  signatureType?: SignatureType;
  status: PrescriptionStatus;
  contentHash?: string; // SHA-256 do conteúdo textual da receita na hora da assinatura
  verificationCode?: string; // Código de verificação único
};

export type Consultation = {
  id: string;
  patientId: string;
  startedAt: string;
  finishedAt?: string;
  status: ConsultationStatus;
  transcript?: string; // texto da transcrição
  aiSuggestions?: AISuggestions;
  doctorNotes?: string; // nota gerada/editada
  patientSummary?: string; // resumo para o paciente
  prescription?: Prescription; // Receita médica associada
  date?: string; // deprecated, use startedAt instead
};

export type UsageStats = {
  monthConsultations: number;
  monthLimit: number;
  planName: string;
  planPrice: number;
  timeSaved: number; // em minutos
};
