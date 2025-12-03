import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Calendar,
  Search,
  Clock,
  CheckCircle,
  XCircle,
  FileText,
  Stethoscope,
  Phone,
  RefreshCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AppointmentForm } from '@/components/appointments/AppointmentForm';
import { CalendarIntegrationsDialog } from '@/components/appointments/CalendarIntegrationsDialog';
import { useAppointmentStore } from '@/stores/appointmentStore';
import { useAppStore } from '@/stores/appStore';
import { initializeMockAppointments } from '@/lib/data/mockAppointments';
import { AppLayout } from '@/components/AppLayout';
import type { Appointment } from '@/lib/types/appointment';
import { cn, getPatientAvatar } from '@/lib/utils';

export function AppointmentPage() {
  const navigate = useNavigate();
  const { appointments, addAppointment, updateAppointment, clearAllAppointments } = useAppointmentStore();
  const { patients, startConsultation, setSelectedPatient } = useAppStore();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isIntegrationsOpen, setIsIntegrationsOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | Appointment['status']>('all');
  const [activeTab, setActiveTab] = useState<'today' | 'upcoming' | 'history'>('today');

  // Initialize with mock data if needed - ONLY if we have patients
  useEffect(() => {
    const today = new Date().toLocaleDateString('en-CA');
    const hasAppointmentsToday = appointments.some(apt => apt.date === today);

    // Only initialize appointments if we have patients in the database
    if (!isInitialized && patients.length > 0 && (appointments.length === 0 || !hasAppointmentsToday)) {


      // Clear old appointments if they exist but none for today
      if (appointments.length > 0 && !hasAppointmentsToday) {
        clearAllAppointments();
      }

      // Generate appointments using REAL patients from the database
      const mockAppointments = initializeMockAppointments(patients);


      mockAppointments.forEach(apt => {
        const { id, createdAt, updatedAt, ...data } = apt;
        addAppointment(data);
      });
      setIsInitialized(true);
    }
  }, [isInitialized, appointments, patients, addAppointment, clearAllAppointments]);

  // Handle creating a new appointment
  const handleCreateAppointment = () => {
    setEditingAppointment(null);
    setIsFormOpen(true);
  };

  // Handle resetting appointments (for testing)
  const handleResetAppointments = () => {
    if (patients.length === 0) {
      console.warn('Cannot create appointments: No patients in database. Import patients first.');
      alert('Não há pacientes cadastrados. Importe pacientes primeiro para criar agendamentos.');
      return;
    }


    clearAllAppointments();
    setIsInitialized(false);

    // Force re-initialization with real patients
    setTimeout(() => {
      const mockAppointments = initializeMockAppointments(patients);

      mockAppointments.forEach(apt => {
        const { id, createdAt, updatedAt, ...data } = apt;
        addAppointment(data);
      });
      setIsInitialized(true);

    }, 100);
  };

  // Handle editing an appointment
  const handleEditAppointment = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setIsFormOpen(true);
  };

  // Handle form submission
  const handleFormSubmit = (appointmentData: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingAppointment) {
      updateAppointment(editingAppointment.id, appointmentData);
    } else {
      addAppointment(appointmentData);
    }
    setIsFormOpen(false);
    setEditingAppointment(null);
  };

  // Helper to find patient
  const findPatient = (appointment: Appointment) => {
    // Try to find by ID first, then by name
    return patients.find(p => p.id === appointment.patientId) ||
      patients.find(p => p.name.toLowerCase() === appointment.patientName.toLowerCase());
  };

  const handleStartConsultation = (appointment: Appointment) => {
    const patient = findPatient(appointment);

    if (patient) {
      startConsultation(patient);
      navigate('/consultation');
    } else {
      // Fallback if patient not found in store (shouldn't happen in real app)
      const mockPatient: any = {
        id: appointment.patientId,
        name: appointment.patientName,
        phone: appointment.patientPhone || '',
        email: '',
        gender: 'other',
        birthDate: '1990-01-01',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      startConsultation(mockPatient);
      navigate('/consultation');
    }
  };

  const handleViewPatient = (appointment: Appointment) => {
    const patient = findPatient(appointment);
    if (patient) {
      setSelectedPatient(patient);
      navigate(`/patients/${patient.id}`);
    } else {
      // If patient doesn't exist in main store, we can't show history
      // For now, maybe just show a toast or alert, or navigate to patients list
      navigate('/patients');
    }
  };

  // Filter appointments based on active tab and filters
  const filteredAppointments = useMemo(() => {
    let filtered = [...appointments];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(apt =>
        apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.patientPhone?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(apt => apt.status === filterStatus);
    }

    // Apply tab filter
    const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD

    switch (activeTab) {
      case 'today':
        filtered = filtered.filter(apt => apt.date === today);
        break;
      case 'upcoming':
        filtered = filtered.filter(apt => apt.date > today && apt.status !== 'completed' && apt.status !== 'cancelled');
        break;
      case 'history':
        filtered = filtered.filter(apt => apt.date < today || apt.status === 'completed' || apt.status === 'cancelled');
        break;
    }

    // Order appointments
    return filtered.sort((a, b) => {
      if (a.date !== b.date) {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      }
      return a.startTime.localeCompare(b.startTime);
    });
  }, [appointments, searchTerm, filterStatus, activeTab]);

  // Stats for the cards
  const stats = [
    {
      title: 'Agendados Hoje',
      value: appointments.filter(a => a.date === new Date().toLocaleDateString('en-CA')).length.toString(),
      icon: Calendar,
      gradient: 'from-purple-500 to-purple-700',
      iconBg: 'bg-purple-500',
      titleBorder: 'border-purple-200',
      titleTextColor: 'text-purple-700'
    },
    {
      title: 'Confirmados',
      value: appointments.filter(a => a.status === 'confirmed').length.toString(),
      icon: CheckCircle,
      gradient: 'from-green-500 to-green-700',
      iconBg: 'bg-green-500',
      titleBorder: 'border-green-200',
      titleTextColor: 'text-green-700'
    },
    {
      title: 'Pendentes',
      value: appointments.filter(a => a.status === 'scheduled').length.toString(),
      icon: Clock,
      gradient: 'from-blue-500 to-blue-700',
      iconBg: 'bg-blue-500',
      titleBorder: 'border-blue-200',
      titleTextColor: 'text-blue-700'
    },
    {
      title: 'Cancelados',
      value: appointments.filter(a => a.status === 'cancelled').length.toString(),
      icon: XCircle,
      gradient: 'from-red-500 to-red-700',
      iconBg: 'bg-red-500',
      titleBorder: 'border-red-200',
      titleTextColor: 'text-red-700'
    },
  ];

  // Convert patients to options for the form
  const patientOptions = patients.map(patient => ({
    id: patient.id,
    name: patient.name,
    phone: patient.phone
  }));

  return (
    <AppLayout>
      <div className="min-h-full space-y-6">
        {/* Header - Silicon Valley Style */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              {/* Header similar ao Dashboard */}
              <div className="flex items-center justify-end gap-3 mb-4">
                {/* Tabs Navigation - Worklist vs Agenda */}
                <Tabs defaultValue="agenda" className="w-auto">
                  <TabsList className="bg-gray-100 p-1 h-11">
                    <TabsTrigger
                      value="worklist"
                      onClick={() => navigate('/worklist')}
                      className="data-[state=active]:bg-white data-[state=active]:shadow-sm px-6 text-sm font-semibold"
                    >
                      <Clock className="h-4 w-4 mr-2" />
                      Worklist do Dia
                    </TabsTrigger>
                    <TabsTrigger
                      value="agenda"
                      className="data-[state=active]:bg-white data-[state=active]:shadow-sm px-6 text-sm font-semibold"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      Agenda Completa
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Stats Row - Clean & Modern */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Today's Appointments Pill */}
                <div className="inline-flex items-center gap-3 bg-gray-900 text-white rounded-xl px-5 py-3 shadow-lg shadow-gray-900/20">
                  <div className="flex items-center justify-center w-8 h-8 bg-white/20 rounded-lg">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold tabular-nums">{stats[0].value}</span>
                    <span className="text-sm text-white/70 font-medium">agendados hoje</span>
                  </div>
                </div>

                {/* Confirmed Pill */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-3 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl px-5 py-3 shadow-lg shadow-green-500/25"
                >
                  <div className="flex items-center justify-center w-8 h-8 bg-white/20 rounded-lg">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold tabular-nums">{stats[1].value}</span>
                    <span className="text-sm font-medium opacity-90">confirmados</span>
                  </div>
                </motion.div>

                {/* Pending Pill */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="inline-flex items-center gap-3 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl px-5 py-3 shadow-lg shadow-blue-500/25"
                >
                  <div className="flex items-center justify-center w-8 h-8 bg-white/20 rounded-lg">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold tabular-nums">{stats[2].value}</span>
                    <span className="text-sm font-medium opacity-90">pendentes</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-3"
        >
          <Button
            onClick={handleResetAppointments}
            variant="outline"
            className="border-gray-300 hover:border-purple-300 hover:bg-purple-50"
            title="Limpar e recriar agendamentos com data de hoje"
          >
            Atualizar Dados
          </Button>
          <Button
            onClick={() => setIsIntegrationsOpen(true)}
            variant="outline"
            className="border-gray-300 hover:border-purple-300 hover:bg-purple-50"
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Gerenciar Integrações
          </Button>
          <Button
            onClick={handleCreateAppointment}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            <Plus className="mr-2 h-4 w-4" />
            Novo Agendamento
          </Button>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="sticky top-4 z-30 bg-white/90 backdrop-blur-xl p-4 rounded-2xl shadow-lg border-0 flex flex-col md:flex-row gap-4 items-center justify-between"
        >
          <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)} className="w-full md:w-auto">
            <TabsList className="bg-gray-100 p-1 rounded-xl">
              <TabsTrigger value="today" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-purple-600 font-medium">Hoje</TabsTrigger>
              <TabsTrigger value="upcoming" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-purple-600 font-medium">Próximos</TabsTrigger>
              <TabsTrigger value="history" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-purple-600 font-medium">Histórico</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-72 group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-purple-600 transition-colors" />
              <Input
                placeholder="Buscar paciente, motivo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200 focus:bg-white focus:border-purple-300 rounded-xl transition-all"
              />
            </div>

            <Select value={filterStatus} onValueChange={(v: any) => setFilterStatus(v)}>
              <SelectTrigger className="w-[160px] rounded-xl bg-gray-50 border-gray-200 focus:bg-white focus:border-purple-300">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="scheduled">Agendado</SelectItem>
                <SelectItem value="confirmed">Confirmado</SelectItem>
                <SelectItem value="completed">Concluído</SelectItem>
                <SelectItem value="cancelled">Cancelado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Appointments List */}
        <div className="relative min-h-[400px]">
          <AnimatePresence mode="popLayout">
            {filteredAppointments.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                  <Calendar className="h-10 w-10 text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Nenhum agendamento</h3>
                <p className="text-gray-500 max-w-xs mx-auto">
                  Não encontramos agendamentos para os filtros selecionados.
                </p>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {filteredAppointments.map((appointment, index) => {
                  const isToday = new Date(appointment.date).toDateString() === new Date().toDateString();
                  const now = new Date();
                  const [hours, minutes] = appointment.startTime.split(':').map(Number);
                  const appointmentTime = new Date();
                  appointmentTime.setHours(hours, minutes, 0, 0);

                  // Check if appointment is roughly now (within 30 mins)
                  const isCurrent = isToday && Math.abs(now.getTime() - appointmentTime.getTime()) < 30 * 60 * 1000;

                  return (
                    <motion.div
                      key={appointment.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card
                        className={cn(
                          "relative overflow-hidden transition-all duration-300 border-0 shadow-lg hover:shadow-xl bg-white",
                          isCurrent && "ring-2 ring-purple-400"
                        )}
                      >
                        <CardContent className="p-5">
                          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                            {/* Time */}
                            <div className="text-center min-w-[80px]">
                              <div className="text-2xl font-bold text-gray-900 tabular-nums leading-none">
                                {appointment.startTime}
                              </div>
                              <div className="text-xs text-gray-500 uppercase tracking-wide mt-1 font-medium">
                                {appointment.endTime}
                              </div>
                            </div>

                            {/* Patient Avatar & Info */}
                            <div className="flex items-center gap-4 flex-1">
                              <div className="relative">
                                <img
                                  src={getPatientAvatar(appointment.patientName)}
                                  alt={appointment.patientName}
                                  className="h-14 w-14 rounded-xl object-cover shadow-sm ring-2 ring-gray-100"
                                />
                                {isCurrent && (
                                  <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-4 w-4 bg-purple-600 border-2 border-white"></span>
                                  </span>
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-bold text-gray-900 mb-1">
                                  {appointment.patientName}
                                </h3>
                                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                                  <Badge variant="secondary" className="rounded-md px-2 py-0 h-5 text-xs font-medium">
                                    {appointment.type}
                                  </Badge>
                                  {appointment.patientPhone && (
                                    <span className="flex items-center gap-1">
                                      <Phone className="h-3 w-3" />
                                      {appointment.patientPhone}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Reason */}
                            <div className="flex-1 md:border-l md:pl-5 md:border-gray-100">
                              <p className="text-sm font-medium text-gray-900 mb-1">
                                {appointment.reason || 'Consulta de rotina'}
                              </p>
                              {appointment.notes && (
                                <p className="text-xs text-gray-500 line-clamp-1">
                                  <FileText className="h-3 w-3 inline mr-1" />
                                  {appointment.notes}
                                </p>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 w-full md:w-auto">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-10 w-10 rounded-xl text-gray-400 hover:text-purple-600 hover:bg-purple-50"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewPatient(appointment);
                                }}
                              >
                                <FileText className="h-5 w-5" />
                              </Button>

                              <Button
                                variant="outline"
                                className="flex-1 md:flex-none border-gray-200 hover:border-purple-300 hover:text-purple-600 rounded-xl"
                                onClick={() => handleEditAppointment(appointment)}
                              >
                                Detalhes
                              </Button>

                              <Button
                                className={cn(
                                  "flex-1 md:flex-none rounded-xl shadow-lg",
                                  isCurrent
                                    ? "bg-green-600 hover:bg-green-700 text-white shadow-green-500/20"
                                    : "bg-purple-600 hover:bg-purple-700 text-white shadow-purple-500/20"
                                )}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStartConsultation(appointment);
                                }}
                              >
                                <Stethoscope className="h-4 w-4 mr-2" />
                                Consultar
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Appointment Form Modal */}
        <AppointmentForm
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingAppointment(null);
          }}
          onSubmit={handleFormSubmit}
          appointment={editingAppointment}
          patients={patientOptions}
          existingAppointments={appointments}
        />

        {/* Calendar Integrations Dialog */}
        <CalendarIntegrationsDialog
          isOpen={isIntegrationsOpen}
          onClose={() => setIsIntegrationsOpen(false)}
        />
      </div>
    </AppLayout>
  );
}