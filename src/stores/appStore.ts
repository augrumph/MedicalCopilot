import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Patient, Consultation, AISuggestions, SignatureType, Prescription } from '@/lib/types';
import type { AppContext } from '@/lib/contextConfig';

interface User {
  id: string;
  name: string;
  email: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  cpf?: string;
  city?: string;
  state?: string;
  crm?: string;
  crmState?: string;
  isCrmVerified: boolean;
  acceptedTermsAt?: string;
}

interface AppState {
  // App Context
  appContext: AppContext;
  setAppContext: (context: AppContext) => void;

  // Authentication
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  acceptTerms: () => Promise<void>;
  setUser: (user: User) => void;

  // Patients
  patients: Patient[];
  selectedPatient: Patient | null;
  setSelectedPatient: (patient: Patient | null) => void;
  addPatient: (patient: Omit<Patient, 'id'>) => void;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  deletePatient: (id: string) => void;

  // Consultations
  consultations: Consultation[];
  currentConsultation: Consultation | null;
  selectedConsultation: Consultation | null;
  setSelectedConsultation: (consultation: Consultation | null) => void;
  startConsultation: (patient: Patient) => void;
  startEmergencyConsultation: () => void;
  loadConsultation: (consultationId: string) => void;
  updateTranscript: (text: string) => void;
  updateAISuggestions: (suggestions: AISuggestions) => void;
  finishConsultation: (note: string) => void;
  setDoctorNotes: (note: string) => void;
  setPatientSummary: (summary: string) => void;
  addConsultation: (consultation: Omit<Consultation, 'id'>) => void;
  updateConsultation: (id: string, updates: Partial<Consultation>) => void;
  createPrescription: (consultationId: string) => void;
  signPrescription: (consultationId: string, crm: string, uf: string, signatureType: SignatureType) => void;
  revokePrescription: (prescriptionId: string) => void;

  // Consultation state
  isListening: boolean;
  setIsListening: (isListening: boolean) => void;
  transcript: string;
  setTranscript: (text: string) => void;
  aiResponse: string;
  setAiResponse: (text: string) => void;

  // Settings
  doctorName: string;
  setDoctorName: (name: string) => void;
  doctorSpecialty: string;
  setDoctorSpecialty: (specialty: string) => void;
  doctorCRM: string;
  setDoctorCRM: (crm: string) => void;
  doctorUF: string;
  setDoctorUF: (uf: string) => void;
  clinicName: string;
  setClinicName: (name: string) => void;
  clinicAddress: string;
  setClinicAddress: (address: string) => void;
  clinicLocation: string;
  setClinicLocation: (location: string) => void;
  clinicPhone: string;
  setClinicPhone: (phone: string) => void;
  clinicEmail: string;
  setClinicEmail: (email: string) => void;
  
  // AI Settings
  aiDetailLevel: 'short' | 'medium' | 'long';
  setAiDetailLevel: (level: 'short' | 'medium' | 'long') => void;
  language: 'pt' | 'en';
  setLanguage: (lang: 'pt' | 'en') => void;
  aiSuggestions: boolean;
  setAiSuggestions: (enabled: boolean) => void;
  aiSimilarityAnalysis: boolean;
  setAiSimilarityAnalysis: (enabled: boolean) => void;
  aiInteractionAlerts: boolean;
  setAiInteractionAlerts: (enabled: boolean) => void;

  // Prescription Settings
  prescriptionValidityDays: number;
  setPrescriptionValidityDays: (days: number) => void;
  antibioticValidityDays: number;
  setAntibioticValidityDays: (days: number) => void;
  defaultPrescriptionInstructions: string;
  setDefaultPrescriptionInstructions: (instructions: string) => void;

  // Privacy Mode
  privacyMode: boolean;
  togglePrivacyMode: () => void;

  // LGPD: Auto-Delete Audio
  autoDeleteAudio: boolean;
  setAutoDeleteAudio: (value: boolean) => void;

  // Shift Management
  shiftStatus: 'active' | 'inactive';
  shiftStartedAt: string | null;
  activeShiftId: string | null;
  activeSessionId: string | null;
  startShift: (shiftId: string) => Promise<void>;
  endShift: () => Promise<void>;
}

// No mock data generated in production
const mockPatients: Patient[] = [];
const mockConsultations: Consultation[] = [];

// Cache para evitar recriação
const cachedMockPatients = [...mockPatients];
const cachedMockConsultations = [...mockConsultations];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // App Context
      appContext: 'medical' as AppContext,
      setAppContext: (context: AppContext) => set({ appContext: context }),

      // Authentication
      isAuthenticated: false,
      user: null,
      login: async (email: string, password: string) => {
        if (!email || !password) {
          throw new Error("Email e senha são obrigatórios");
        }

        const API = import.meta.env.VITE_BACKEND_URL || 'https://api.medicalcopilot.com.br';

        try {
          const response = await fetch(`${API}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email, password }),
          });

          const data = await response.json();

          if (!response.ok || !data.success) {
            throw new Error(data.error || 'Falha na autenticação');
          }

          set({
            isAuthenticated: true,
            user: {
              id:            data.user.id,
              name:          data.user.name || data.user.fullName || data.user.firstName,
              email:         data.user.email,
              fullName:      data.user.fullName,
              firstName:     data.user.firstName,
              lastName:      data.user.lastName,
              birthDate:     data.user.birthDate,
              cpf:           data.user.cpf,
              city:          data.user.city,
              state:         data.user.state,
              crm:           data.user.crm,
              crmState:      data.user.crmState,
              isCrmVerified: data.user.isCrmVerified ?? false,
              acceptedTermsAt: data.user.acceptedTermsAt,
            },
          });
        } catch (error: any) {
          throw error;
        }
      },
      setUser: (user: User) => set({ user }),
      acceptTerms: async () => {
        const API = import.meta.env.VITE_BACKEND_URL || 'https://api.medicalcopilot.com.br';
        try {
          const res = await fetch(`${API}/api/auth/accept-terms`, {
            method: 'POST',
            credentials: 'include',
          });
          const data = await res.json();
          if (data.success) {
            const { user } = get();
            if (user) {
              set({ user: { ...user, acceptedTermsAt: data.acceptedAt } });
            }
          }
        } catch (error) {
          console.error('Failed to accept terms in backend', error);
        }
      },
      logout: async () => {
        const API = import.meta.env.VITE_BACKEND_URL || 'https://api.medicalcopilot.com.br';
        try {
          await fetch(`${API}/api/auth/logout`, {
            method: 'POST',
            credentials: 'include',
          });
        } catch {
          // ignore logout network errors — local state is cleared regardless
        } finally {
          set({ isAuthenticated: false, user: null });
          localStorage.removeItem('medical-copilot-storage');
        }
      },

      // Patients
      patients: cachedMockPatients,
      selectedPatient: null,
      setSelectedPatient: (patient) => set({ selectedPatient: patient }),
      addPatient: (patient) => set((state) => ({
        patients: [...state.patients, { ...patient, id: Date.now().toString() }]
      })),
      updatePatient: (id, updates) => set((state) => ({
        patients: state.patients.map(patient =>
          patient.id === id ? { ...patient, ...updates } : patient
        )
      })),
      deletePatient: (id) => set((state) => ({
        patients: state.patients.filter(patient => patient.id !== id)
      })),

      // Consultations
      consultations: cachedMockConsultations,
      currentConsultation: null,
      selectedConsultation: null,
      setSelectedConsultation: (consultation) => set({ selectedConsultation: consultation }),

      startConsultation: (patient) => {
        // console.log('🚀 Starting consultation for patient:', patient.name);
        const consultation: Consultation = {
          id: Date.now().toString(),
          patientId: patient.id,
          startedAt: new Date().toISOString(),
          status: 'in_progress',
          transcript: '',
        };
        set({
          currentConsultation: consultation,
          selectedPatient: patient,
        });
        // console.log('✅ Store updated: selectedPatient set');
      },

      startEmergencyConsultation: () => {
        const timestamp = Date.now();
        // console.log('🚨 Starting emergency consultation...');
        const emergencyPatient: Patient = {
          id: `emerg-${timestamp}`,
          name: `Paciente Emergência #${timestamp.toString().slice(-4)}`,
          age: 0,
          gender: 'nao_informado',
          allergies: [],
          medications: [],
          mainConditions: [],
        };

        const consultation: Consultation = {
          id: timestamp.toString(),
          patientId: emergencyPatient.id,
          startedAt: new Date().toISOString(),
          status: 'in_progress',
          transcript: '',
        };

        set((state) => ({
          patients: [...state.patients, emergencyPatient],
          currentConsultation: consultation,
          selectedPatient: emergencyPatient,
        }));
        // console.log('✅ Emergency consultation state set');
      },

      loadConsultation: (consultationId) => {
        const state = get();
        const consultation = state.consultations.find(c => c.id === consultationId);

        if (consultation) {
          const patient = state.patients.find(p => p.id === consultation.patientId);
          set({
            currentConsultation: consultation,
            selectedPatient: patient || null,
          });
        }
      },

      updateTranscript: (text) => set((state) => {
        if (!state.currentConsultation) return state;
        return {
          currentConsultation: {
            ...state.currentConsultation,
            transcript: text,
          }
        };
      }),

      updateAISuggestions: (suggestions) => set((state) => {
        if (!state.currentConsultation) return state;
        return {
          currentConsultation: {
            ...state.currentConsultation,
            aiSuggestions: suggestions,
          }
        };
      }),

      finishConsultation: (note) => set((state) => {
        if (!state.currentConsultation) return state;
        const finishedConsultation: Consultation = {
          ...state.currentConsultation,
          status: 'finished',
          finishedAt: new Date().toISOString(),
          doctorNotes: note,
        };

        // Atualizar as notas do paciente com a nota da consulta
        const updatedPatients = state.patients.map(patient => {
          if (patient.id === state.currentConsultation?.patientId) {
            const existingNotes = patient.notes || '';
            const separator = existingNotes ? '\n\n---\n\n' : '';
            const dateHeader = `Consulta - ${new Date().toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}\n\n`;
            return {
              ...patient,
              notes: existingNotes + separator + dateHeader + note
            };
          }
          return patient;
        });

        return {
          currentConsultation: null,
          consultations: [...state.consultations, finishedConsultation],
          patients: updatedPatients,
        };
      }),

      setDoctorNotes: (note) => set((state) => {
        if (!state.currentConsultation) return state;
        return {
          currentConsultation: {
            ...state.currentConsultation,
            doctorNotes: note,
          }
        };
      }),

      setPatientSummary: (summary) => set((state) => {
        if (!state.currentConsultation) return state;
        return {
          currentConsultation: {
            ...state.currentConsultation,
            patientSummary: { explanation: summary, whatToDo: [], whenToReturn: [] },
          }
        };
      }),

      addConsultation: (consultation) => set((state) => ({
        consultations: [...state.consultations, { ...consultation, id: Date.now().toString() }]
      })),

      updateConsultation: (id, updates) => set((state) => ({
        consultations: state.consultations.map(consultation =>
          consultation.id === id ? { ...consultation, ...updates } : consultation
        )
      })),

      createPrescription: (consultationId) => set((state) => {
        const consultation = state.consultations.find(c => c.id === consultationId) || state.currentConsultation;
        if (!consultation) return state;

        // Generate unique prescription ID and verification code
        const prescriptionId = `RX-${new Date().getFullYear()}-${String(Date.now()).slice(-8).padStart(8, '0')}`;
        const randomSegment = () => Array.from(crypto.getRandomValues(new Uint8Array(3)))
          .map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 4).toUpperCase();
        const verificationCode = `R${randomSegment()}-${randomSegment()}-${randomSegment()}-${randomSegment()}`;

        // Generate hash of content (mock for now, in real app would hash the actual prescription content)
        const contentHash = `hash-${Date.now()}`;

        const newPrescription: Prescription = {
          id: prescriptionId,
          internalId: Date.now().toString(),
          consultationId: consultationId,
          createdAt: new Date().toISOString(),
          status: 'draft',
          verificationCode: verificationCode,
          contentHash: contentHash
        };

        // Update the consultation with the new prescription
        const updatedConsultation = { ...consultation, prescription: newPrescription };
        const isCurrent = state.currentConsultation?.id === consultationId;

        return {
          currentConsultation: isCurrent ? updatedConsultation : state.currentConsultation,
          consultations: state.consultations.map(c =>
            c.id === consultationId ? updatedConsultation : c
          )
        };
      }),

      signPrescription: (consultationId, crm, uf, signatureType) => set((state) => {
        const consultation = state.consultations.find(c => c.id === consultationId) || state.currentConsultation;
        if (!consultation || !consultation.prescription) return state;

        const updatedPrescription: Prescription = {
          ...consultation.prescription,
          signedAt: new Date().toISOString(),
          signedByDoctorId: state.user?.email || 'doctor@example.com', // Mock doctor ID
          doctorCRM: crm,
          doctorUF: uf,
          signatureType: signatureType,
          status: 'signed'
        };

        const updatedConsultation = { ...consultation, prescription: updatedPrescription };
        const isCurrent = state.currentConsultation?.id === consultationId;

        return {
          currentConsultation: isCurrent ? updatedConsultation : state.currentConsultation,
          consultations: state.consultations.map(c =>
            c.id === consultationId ? updatedConsultation : c
          )
        };
      }),

      revokePrescription: (prescriptionId) => set((state) => {
        const consultation = [...state.consultations, state.currentConsultation].find(c =>
          c && c.prescription && c.prescription.id === prescriptionId
        );

        if (!consultation) return state;

        const updatedPrescription: Prescription = {
          ...consultation.prescription!,
          status: 'revoked',
          signedAt: new Date().toISOString() // When revoking, we record the time
        };

        const updatedConsultation = { ...consultation, prescription: updatedPrescription };
        const consultationId = consultation.id;
        const isCurrent = state.currentConsultation?.id === consultationId;

        return {
          currentConsultation: isCurrent ? updatedConsultation : state.currentConsultation,
          consultations: state.consultations.map(c =>
            c.id === consultationId ? updatedConsultation : c
          )
        };
      }),

      // Consultation state
      isListening: false,
      setIsListening: (isListening) => set({ isListening }),
      transcript: '',
      setTranscript: (text) => set({ transcript: text }),
      aiResponse: '',
      setAiResponse: (text) => set({ aiResponse: text }),

      // Settings
      doctorName: 'Dr. Luzzi',
      setDoctorName: (name) => set({ doctorName: name }),
      doctorSpecialty: 'Clínico Geral',
      setDoctorSpecialty: (specialty) => set({ doctorSpecialty: specialty }),
      doctorCRM: '123456',
      setDoctorCRM: (crm) => set({ doctorCRM: crm }),
      doctorUF: 'SP',
      setDoctorUF: (uf) => set({ doctorUF: uf }),
      clinicName: '',
      setClinicName: (name) => set({ clinicName: name }),
      clinicAddress: '',
      setClinicAddress: (address) => set({ clinicAddress: address }),
      clinicLocation: '',
      setClinicLocation: (location) => set({ clinicLocation: location }),
      clinicPhone: '',
      setClinicPhone: (phone) => set({ clinicPhone: phone }),
      clinicEmail: '',
      setClinicEmail: (email) => set({ clinicEmail: email }),
      aiDetailLevel: 'medium',
      setAiDetailLevel: (level) => set({ aiDetailLevel: level }),
      language: 'pt',
      setLanguage: (lang) => set({ language: lang }),
      aiSuggestions: true,
      setAiSuggestions: (enabled) => set({ aiSuggestions: enabled }),
      aiSimilarityAnalysis: true,
      setAiSimilarityAnalysis: (enabled) => set({ aiSimilarityAnalysis: enabled }),
      aiInteractionAlerts: true,
      setAiInteractionAlerts: (enabled) => set({ aiInteractionAlerts: enabled }),

      // Prescription Settings
      prescriptionValidityDays: 30,
      setPrescriptionValidityDays: (days) => set({ prescriptionValidityDays: days }),
      antibioticValidityDays: 10,
      setAntibioticValidityDays: (days) => set({ antibioticValidityDays: days }),
      defaultPrescriptionInstructions: 'Tomar os medicamentos nos horários indicados. Beber bastante água. Fazer repouso relativo. Em caso de efeitos colaterais, retornar para avaliação médica.',
      setDefaultPrescriptionInstructions: (instructions) => set({ defaultPrescriptionInstructions: instructions }),

      // Privacy Mode
      privacyMode: false,
      togglePrivacyMode: () => set((state) => ({ privacyMode: !state.privacyMode })),

      // LGPD: Auto-Delete Audio
      autoDeleteAudio: true, // Default: enabled for privacy
      setAutoDeleteAudio: (value) => set({ autoDeleteAudio: value }),

      // Shift Management
      shiftStatus: 'inactive',
      shiftStartedAt: null,
      activeShiftId: null,
      activeSessionId: null,
      startShift: async (shiftId) => {
        const timestamp = new Date().toISOString();

        // Optimistic update
        set({ shiftStatus: 'active', shiftStartedAt: timestamp, activeShiftId: shiftId });

        try {
          const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'https://api.medicalcopilot.com.br'}/api/shifts/start`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ shiftId, metadata: { startedAt: timestamp } })
          });
          const result = await res.json();
          if (result.success) {
            set({
              activeSessionId: result.data.id,
              shiftStartedAt: result.data.startTime,
            });
          } else {
            // Rollback optimistic state — user doesn't actually have access
            set({ shiftStatus: 'inactive', shiftStartedAt: null, activeShiftId: null, activeSessionId: null });
            // Bubble up error code so callers can react (e.g. show buy modal)
            throw new Error(result.error ?? 'SHIFT_START_FAILED');
          }
        } catch (error) {
          // Always roll back optimistic state on any failure — leaving a phantom "active"
          // shift is worse than making the user tap again.
          set({ shiftStatus: 'inactive', shiftStartedAt: null, activeShiftId: null, activeSessionId: null });
          throw error;
        }
      },
      endShift: async () => {
        const { activeSessionId } = get();
        if (!activeSessionId) {
          set({ shiftStatus: 'inactive', shiftStartedAt: null, activeShiftId: null, activeSessionId: null });
          return;
        }
        try {
          await fetch(`${import.meta.env.VITE_BACKEND_URL || 'https://api.medicalcopilot.com.br'}/api/shifts/${activeSessionId}/end`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ metrics: {} })
          });
          set({ shiftStatus: 'inactive', shiftStartedAt: null, activeShiftId: null, activeSessionId: null });
        } catch {
          // ignore network errors — local shift state is cleared regardless
        }
      },
    }),
    {
      name: 'medical-copilot-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Apenas persistir auth, user, theme e appContext (NÃO persistir patients nem consultations mockadas)
        appContext: state.appContext,
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        doctorName: state.doctorName,
        doctorSpecialty: state.doctorSpecialty,
        doctorCRM: state.doctorCRM,
        doctorUF: state.doctorUF,
        clinicName: state.clinicName,
        clinicAddress: state.clinicAddress,
        clinicLocation: state.clinicLocation,
        clinicPhone: state.clinicPhone,
        clinicEmail: state.clinicEmail,
        aiDetailLevel: state.aiDetailLevel,
        language: state.language,
        aiSuggestions: state.aiSuggestions,
        aiSimilarityAnalysis: state.aiSimilarityAnalysis,
        aiInteractionAlerts: state.aiInteractionAlerts,
        prescriptionValidityDays: state.prescriptionValidityDays,
        antibioticValidityDays: state.antibioticValidityDays,
        defaultPrescriptionInstructions: state.defaultPrescriptionInstructions,
        autoDeleteAudio: state.autoDeleteAudio,
        shiftStatus: state.shiftStatus,
        shiftStartedAt: state.shiftStartedAt,
        activeShiftId: state.activeShiftId,
        activeSessionId: state.activeSessionId,
      }),
    }
  )
);