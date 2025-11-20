import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Patient, Consultation, AISuggestions, SignatureType, Prescription } from '@/lib/types';
import { generateMockPatients, generateMockConsultations } from '@/lib/mockData';
import type { AppContext } from '@/lib/contextConfig';
import { psychologyPatients, psychologySessions } from '@/lib/psychologyMockData';

interface User {
  name: string;
  email: string;
}

interface AppState {
  // App Context
  appContext: AppContext;
  setAppContext: (context: AppContext) => void;

  // Authentication
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => void;
  logout: () => void;

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
  aiDetailLevel: 'short' | 'medium' | 'long';
  setAiDetailLevel: (level: 'short' | 'medium' | 'long') => void;
  language: 'pt' | 'en';
  setLanguage: (lang: 'pt' | 'en') => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
}

// Gerar dados mockados realistas
const mockPatients = generateMockPatients(100);
const mockConsultations = generateMockConsultations(mockPatients, 100);

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
      login: (email: string, password: string) => {
        // More secure mock authentication
        if (!email || !password) {
          console.error("Email and password are required");
          return;
        }

        // In a real app, this would verify credentials via API
        // This is still a mock, but with better validation
        const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        const isValidPassword = password.length >= 6;

        if (!isValidEmail || !isValidPassword) {
          console.error("Invalid email or password");
          return;
        }

        set({
          isAuthenticated: true,
          user: {
            name: 'Dr. Silva',
            email: email
          }
        });
      },
      logout: () => set({ isAuthenticated: false, user: null }),

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
      },

      loadConsultation: (consultationId) => {
        const state = get();
        const appContext = state.appContext;

        // Buscar na lista correta baseado no contexto
        const consultations = appContext === 'psychology' ? psychologySessions : state.consultations;
        const patients = appContext === 'psychology' ? psychologyPatients : state.patients;

        const consultation = consultations.find(c => c.id === consultationId);

        if (consultation) {
          const patient = patients.find(p => p.id === consultation.patientId);
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
            patientSummary: summary as any, // Temporary fix - the function needs to be updated to handle PatientSummary type
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
        const verificationCode = `R${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

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
      doctorName: 'Dr. Silva',
      setDoctorName: (name) => set({ doctorName: name }),
      doctorSpecialty: 'Clínico Geral',
      setDoctorSpecialty: (specialty) => set({ doctorSpecialty: specialty }),
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
      theme: 'light',
      setTheme: (theme) => {
        // Atualizar o DOM
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        set({ theme });
      },
      toggleTheme: () => {
        const currentTheme = get().theme;
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        get().setTheme(newTheme);
      },
    }),
    {
      name: 'medical-copilot-storage', // nome único para o localStorage
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Apenas persistir auth, user, theme e appContext (NÃO persistir patients nem consultations mockadas)
        appContext: state.appContext,
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        theme: state.theme,
        clinicName: state.clinicName,
        clinicAddress: state.clinicAddress,
        clinicLocation: state.clinicLocation,
        clinicPhone: state.clinicPhone,
        clinicEmail: state.clinicEmail,
      }),
      onRehydrateStorage: () => (state) => {
        // Sempre garantir que temos os dados mock
        if (state) {
          state.patients = cachedMockPatients;
          state.consultations = cachedMockConsultations;

          // MIGRAÇÃO: Forçar tema claro para todos os usuários (sobrescrever tema escuro antigo)
          if (state.theme === 'dark') {
            state.theme = 'light';
            document.documentElement.classList.remove('dark');
          }
        }
      },
    }
  )
);