import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Appointment } from '@/lib/types/appointment';

interface AppointmentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => void;
  appointment?: Appointment | null;
  patients: { id: string; name: string; phone?: string }[];
  existingAppointments?: Appointment[];
}

const DEFAULT_APPOINTMENT = {
  patientId: '',
  patientName: '',
  patientPhone: '',
  doctorName: 'Dr. Silva',
  date: new Date().toISOString().split('T')[0],
  startTime: '09:00',
  endTime: '09:30',
  type: 'consultation' as const,
  status: 'scheduled' as const,
  reason: '',
  notes: ''
};

export function AppointmentForm({
  isOpen,
  onClose,
  onSubmit,
  appointment,
  patients = [],
  existingAppointments = []
}: AppointmentFormProps) {
  const [formData, setFormData] = useState<Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>>(DEFAULT_APPOINTMENT);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [timeOptions, setTimeOptions] = useState<string[]>([]);

  // Set form data when appointment prop changes or when opening the form
  useEffect(() => {
    if (appointment) {
      setFormData({
        patientId: appointment.patientId,
        patientName: appointment.patientName,
        patientPhone: appointment.patientPhone || '',
        doctorName: appointment.doctorName || 'Dr. Silva',
        date: appointment.date,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        type: appointment.type,
        status: appointment.status,
        reason: appointment.reason || '',
        notes: appointment.notes || ''
      });
    } else {
      setFormData(DEFAULT_APPOINTMENT);
      setErrors({});
    }
  }, [appointment, isOpen]);

  // Generate time options when date changes
  useEffect(() => {
    if (formData.date) {
      generateTimeOptions();
    }
  }, [formData.date, existingAppointments]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user selects a value
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle patient selection
  const handlePatientSelect = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    if (patient) {
      setFormData(prev => ({
        ...prev,
        patientId,
        patientName: patient.name,
        patientPhone: patient.phone || ''
      }));
    }
  };

  // Generate time options (30-minute intervals from 8:00 to 18:00)
  const generateTimeOptions = () => {
    const options: string[] = [];
    for (let hour = 8; hour <= 17; hour++) {
      options.push(`${String(hour).padStart(2, '0')}:00`);
      options.push(`${String(hour).padStart(2, '0')}:30`);
    }
    options.push('18:00'); // Add the last option

    // Filter out already booked times if editing an existing appointment
    if (appointment) {
      setTimeOptions(options);
      return;
    }

    // If creating new appointment, filter out already booked times
    const bookedTimes = existingAppointments
      .filter(apt => apt.date === formData.date)
      .map(apt => apt.startTime);

    const availableOptions = options.filter(time => !bookedTimes.includes(time));
    setTimeOptions(availableOptions);
  };

  // Check if the selected time slot is available
  const isTimeSlotAvailable = (startTime: string, endTime: string): boolean => {
    // Check if the slot is already booked by another appointment
    const isBooked = existingAppointments.some(apt => {
      return (
        apt.date === formData.date &&
        apt.id !== appointment?.id && // Exclude the appointment being edited
        (
          // New appointment starts during an existing one
          (startTime >= apt.startTime && startTime < apt.endTime) ||
          // New appointment ends during an existing one
          (endTime > apt.startTime && endTime <= apt.endTime) ||
          // New appointment encompasses an existing one
          (startTime <= apt.startTime && endTime >= apt.endTime)
        )
      );
    });

    return !isBooked;
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.patientId) {
      newErrors.patientId = 'Selecione um paciente';
    }

    if (!formData.date) {
      newErrors.date = 'Data é obrigatória';
    }

    if (!formData.startTime) {
      newErrors.startTime = 'Horário de início é obrigatório';
    }

    if (!formData.endTime) {
      newErrors.endTime = 'Horário de término é obrigatório';
    }

    if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
      newErrors.endTime = 'Horário de término deve ser maior que horário de início';
    }

    if (formData.date && formData.startTime && formData.endTime) {
      const isAvailable = isTimeSlotAvailable(formData.startTime, formData.endTime);
      if (!isAvailable) {
        newErrors.startTime = 'Horário já está ocupado';
        newErrors.endTime = 'Horário já está ocupado';
      }
    }

    if (!formData.type) {
      newErrors.type = 'Tipo de consulta é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
      onClose();
    }
  };

  // Handle form cancellation
  const handleCancel = () => {
    setFormData(DEFAULT_APPOINTMENT);
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-900">
            {appointment ? 'Editar Agendamento' : 'Novo Agendamento'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="patientId" className="text-gray-700">Paciente *</Label>
            <Select
              value={formData.patientId}
              onValueChange={handlePatientSelect}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Selecione um paciente" />
              </SelectTrigger>
              <SelectContent>
                {patients.map(patient => (
                  <SelectItem key={patient.id} value={patient.id}>
                    {patient.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.patientId && (
              <p className="text-sm text-red-500">{errors.patientId}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="text-gray-700">Data *</Label>
              <Input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
                className="h-10"
              />
              {errors.date && (
                <p className="text-sm text-red-500">{errors.date}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type" className="text-gray-700">Tipo *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleSelectChange('type', value)}
              >
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="consultation">Consulta</SelectItem>
                  <SelectItem value="follow-up">Retorno</SelectItem>
                  <SelectItem value="emergency">Emergência</SelectItem>
                  <SelectItem value="checkup">Check-up</SelectItem>
                  <SelectItem value="procedure">Procedimento</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && (
                <p className="text-sm text-red-500">{errors.type}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime" className="text-gray-700">Horário Início *</Label>
              <Select
                value={formData.startTime}
                onValueChange={(value) => handleSelectChange('startTime', value)}
              >
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map(time => (
                    <SelectItem
                      key={time}
                      value={time}
                      disabled={!isTimeSlotAvailable(time, formData.endTime)}
                    >
                      {time} {isTimeSlotAvailable(time, formData.endTime) ? '' : '(Ocupado)'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.startTime && (
                <p className="text-sm text-red-500">{errors.startTime}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime" className="text-gray-700">Horário Término *</Label>
              <Select
                value={formData.endTime}
                onValueChange={(value) => handleSelectChange('endTime', value)}
              >
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map(time => (
                    <SelectItem
                      key={time}
                      value={time}
                      disabled={!isTimeSlotAvailable(formData.startTime, time)}
                    >
                      {time} {isTimeSlotAvailable(formData.startTime, time) ? '' : '(Ocupado)'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.endTime && (
                <p className="text-sm text-red-500">{errors.endTime}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason" className="text-gray-700">Motivo</Label>
            <Input
              type="text"
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              placeholder="Motivo da consulta"
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="patientPhone" className="text-gray-700">Telefone</Label>
            <Input
              type="tel"
              id="patientPhone"
              name="patientPhone"
              value={formData.patientPhone}
              onChange={handleInputChange}
              placeholder="(00) 00000-0000"
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-gray-700">Observações</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Observações sobre o agendamento..."
              rows={3}
              className="resize-none"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="border-gray-300 text-gray-700"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-[#8C00FF] hover:bg-[#7a00e6]"
            >
              {appointment ? 'Atualizar' : 'Agendar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}