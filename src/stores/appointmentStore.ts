import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Appointment } from '@/lib/types/appointment';

interface AppointmentState {
  appointments: Appointment[];
  // Actions
  addAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;
  getAppointmentsByDate: (date: string) => Appointment[];
  getAppointmentsByDateRange: (startDate: string, endDate: string) => Appointment[];
  getAppointmentsByPatient: (patientId: string) => Appointment[];
  getAppointmentsByStatus: (status: string) => Appointment[];
  clearAllAppointments: () => void;
}

export const useAppointmentStore = create<AppointmentState>()(
  persist(
    (set, get) => ({
      appointments: [],

      addAppointment: (appointmentData) => {
        const newAppointment: Appointment = {
          ...appointmentData,
          id: `apt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          appointments: [...state.appointments, newAppointment],
        }));
      },

      updateAppointment: (id, updates) => {
        set((state) => ({
          appointments: state.appointments.map((apt) =>
            apt.id === id
              ? { ...apt, ...updates, updatedAt: new Date().toISOString() }
              : apt
          ),
        }));
      },

      deleteAppointment: (id) => {
        set((state) => ({
          appointments: state.appointments.filter((apt) => apt.id !== id),
        }));
      },

      getAppointmentsByDate: (date) => {
        return get().appointments.filter((apt) => apt.date === date);
      },

      getAppointmentsByDateRange: (startDate, endDate) => {
        return get().appointments.filter((apt) => {
          return apt.date >= startDate && apt.date <= endDate;
        });
      },

      getAppointmentsByPatient: (patientId) => {
        return get().appointments.filter((apt) => apt.patientId === patientId);
      },

      getAppointmentsByStatus: (status) => {
        return get().appointments.filter((apt) => apt.status === status);
      },

      clearAllAppointments: () => {
        set({ appointments: [] });
      },
    }),
    {
      name: 'appointment-storage',
    }
  )
);