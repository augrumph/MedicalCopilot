import type { Appointment, InsuranceType } from '@/lib/types/appointment';
import type { Patient } from '@/lib/types';

// Helper function to generate appointment ID
function generateAppointmentId(): string {
  return `apt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Function to add days to a date
function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

// Realistic appointment reasons
const appointmentReasons = [
  'Dor de cabeça persistente',
  'Acompanhamento pós-cirúrgico',
  'Consulta de rotina',
  'Dor no peito',
  'Febre e mal-estar',
  'Dor nas costas',
  'Exames de rotina',
  'Renovação de receita',
  'Controle de diabetes',
  'Controle de hipertensão',
  'Resultado de exames',
  'Dor abdominal',
  'Tosse persistente',
  'Avaliação pré-operatória',
  'Retorno após tratamento'
];

// Generate appointments from real patients in the database
// This function creates appointments using actual patient data (imported from CSV/Excel)
export function generateMockAppointments(patients: Patient[] = []): Appointment[] {
  const appointments: Appointment[] = [];

  // If no patients provided, return empty array
  // Appointments should only be created from real patient data
  if (patients.length === 0) {
    console.warn('No patients available to create appointments. Import patients first.');
    return appointments;
  }

  // ALWAYS use current date - this ensures appointments are always fresh
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Reset to start of day

  // Time slots available (8:00 AM to 5:00 PM)
  const timeSlots = [
    { start: '08:00', end: '08:30' },
    { start: '08:30', end: '09:00' },
    { start: '09:00', end: '09:30' },
    { start: '09:30', end: '10:00' },
    { start: '10:00', end: '10:30' },
    { start: '10:30', end: '11:00' },
    { start: '11:00', end: '11:30' },
    { start: '11:30', end: '12:00' },
    { start: '14:00', end: '14:30' },
    { start: '14:30', end: '15:00' },
    { start: '15:00', end: '15:30' },
    { start: '15:30', end: '16:00' },
    { start: '16:00', end: '16:30' },
    { start: '16:30', end: '17:00' },
  ];

  // Random appointment types
  const types: ('consultation' | 'follow-up' | 'checkup' | 'procedure')[] = [
    'consultation', 'follow-up', 'checkup', 'procedure'
  ];

  // Insurance types distribution (realistic for Brazilian private practice)
  const insuranceTypes: InsuranceType[] = [
    'unimed', 'unimed', 'unimed', // 30% Unimed (most common)
    'bradesco', 'bradesco', // 20% Bradesco
    'amil', // 10% Amil
    'sulamerica', // 10% Sulamerica
    'particular', 'particular', 'particular', // 30% Private pay
  ];

  // Create appointments for TODAY + next 6 days (total 7 days)
  for (let i = 0; i < 7; i++) {
    const appointmentDate = addDays(today, i);
    // Use local date string to avoid timezone issues
    const dateStr = appointmentDate.toLocaleDateString('en-CA'); // YYYY-MM-DD format

    // More appointments for TODAY, fewer for future days
    let numAppointments;
    if (i === 0) {
      // TODAY: 6-8 appointments (or less if not enough patients)
      numAppointments = Math.min(Math.floor(Math.random() * 3) + 6, patients.length, timeSlots.length);
    } else if (i <= 2) {
      // Next 2 days: 4-6 appointments
      numAppointments = Math.min(Math.floor(Math.random() * 3) + 4, patients.length, timeSlots.length);
    } else {
      // Future days: 2-4 appointments
      numAppointments = Math.min(Math.floor(Math.random() * 3) + 2, patients.length, timeSlots.length);
    }

    const usedSlots = new Set<number>();
    const usedPatients = new Set<string>();

    for (let j = 0; j < numAppointments && usedSlots.size < timeSlots.length; j++) {
      // Get a random time slot that hasn't been used yet
      let slotIndex;
      do {
        slotIndex = Math.floor(Math.random() * timeSlots.length);
      } while (usedSlots.has(slotIndex));

      usedSlots.add(slotIndex);
      const slot = timeSlots[slotIndex];

      // Get a random patient that hasn't been scheduled for this day yet
      let patient: Patient;
      let attempts = 0;
      do {
        patient = patients[Math.floor(Math.random() * patients.length)];
        attempts++;
        // Allow repeating patients after 20 attempts if we run out of unique ones
        if (attempts > 20) break;
      } while (usedPatients.has(patient.id) && usedPatients.size < patients.length);

      usedPatients.add(patient.id);

      // Random statuses - vary based on date
      let statuses: Appointment['status'][];
      if (i === 0) {
        // TODAY: mix of scheduled, confirmed, completed, and in-progress
        statuses = ['scheduled', 'confirmed', 'confirmed', 'completed', 'in-progress'];
      } else {
        // FUTURE: mostly scheduled or confirmed
        statuses = ['scheduled', 'confirmed', 'confirmed'];
      }

      const appointmentType = types[Math.floor(Math.random() * types.length)];
      const isFollowUp = appointmentType === 'follow-up';

      appointments.push({
        id: generateAppointmentId(),
        patientId: patient.id,
        patientName: patient.name,
        patientAge: patient.age,
        doctorName: 'Dr. Silva',
        date: dateStr,
        startTime: slot.start,
        endTime: slot.end,
        type: appointmentType,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        notes: Math.random() > 0.6 ? 'Paciente em acompanhamento regular' : undefined,
        patientPhone: patient.phone || undefined,
        reason: appointmentReasons[Math.floor(Math.random() * appointmentReasons.length)],
        insurance: insuranceTypes[Math.floor(Math.random() * insuranceTypes.length)],
        isFirstVisit: !isFollowUp && Math.random() > 0.7, // 30% first visits for non-follow-ups
        hasExamResults: isFollowUp && Math.random() > 0.5, // 50% of follow-ups have exam results
        aiSummaryReady: Math.random() > 0.4, // 60% have AI summary ready
        lastVisitDate: isFollowUp ? new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR') : undefined,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
  }

  // Sort appointments by date and time
  return appointments.sort((a, b) => {
    const dateCompare = a.date.localeCompare(b.date);
    if (dateCompare !== 0) return dateCompare;
    return a.startTime.localeCompare(b.startTime);
  });
}

export function initializeMockAppointments(patients: Patient[] = []): Appointment[] {
  return generateMockAppointments(patients);
}