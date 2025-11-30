// Types for the new appointment scheduling system

export type AppointmentStatus = 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
export type AppointmentType = 'consultation' | 'follow-up' | 'emergency' | 'checkup' | 'procedure';
export type InsuranceType = 'unimed' | 'bradesco' | 'amil' | 'sulamerica' | 'particular' | 'outro';

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientAge?: number;
  doctorId?: string;
  doctorName?: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  type: AppointmentType;
  status: AppointmentStatus;
  notes?: string;
  patientPhone?: string;
  reason?: string;
  insurance?: InsuranceType;
  isFirstVisit?: boolean;
  hasExamResults?: boolean;
  aiSummaryReady?: boolean;
  lastVisitDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TimeSlot {
  time: string; // HH:mm
  available: boolean;
  doctor?: string;
}

export interface DailySchedule {
  date: string; // YYYY-MM-DD
  slots: TimeSlot[];
}