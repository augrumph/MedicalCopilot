import React, { useState, useEffect, useMemo } from 'react';
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
  Phone
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
      console.log('Initializing appointments from patient database...', {
        patientsCount: patients.length,
        appointmentsTotal: appointments.length,
        hasToday: hasAppointmentsToday,
        today
      });

      // Clear old appointments if they exist but none for today
      if (appointments.length > 0 && !hasAppointmentsToday) {
        clearAllAppointments();
      }

      // Generate appointments using REAL patients from the database
      const mockAppointments = initializeMockAppointments(patients);
      console.log('Generated appointments from patients:', mockAppointments.length, 'First date:', mockAppointments[0]?.date);

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

    console.log('Resetting appointments with', patients.length, 'patients...');
    clearAllAppointments();
    setIsInitialized(false);

    // Force re-initialization with real patients
    setTimeout(() => {
      const mockAppointments = initializeMockAppointments(patients);
      console.log('Creating', mockAppointments.length, 'appointments from patient database');
      mockAppointments.forEach(apt => {
        const { id, createdAt, updatedAt, ...data } = apt;
        addAppointment(data);
      });
      setIsInitialized(true);
      console.log('Appointments reset successfully!');
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
      <div className="min-h-full space-y-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#450693] via-[#8C00FF] to-[#FF3F7F] p-6 md:p-8 shadow-2xl"
        >
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>

          <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl md:text-4xl font-black text-white tracking-tight"
              >
                Agenda Médica
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-white/90 font-medium max-w-md"
              >
                Gerencie seus agendamentos com eficiência e estilo.
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="flex gap-3"
            >
              <Button
                onClick={handleResetAppointments}
                className="bg-white/20 text-white hover:bg-white/30 shadow-xl hover:shadow-2xl transition-all duration-300 px-4 py-6 h-auto text-sm font-bold rounded-2xl backdrop-blur-sm border border-white/30"
                title="Limpar e recriar agendamentos com data de hoje"
              >
                Atualizar Dados
              </Button>
              <Button
                onClick={handleCreateAppointment}
                className="bg-white text-[#450693] hover:bg-white/90 shadow-xl hover:shadow-2xl transition-all duration-300 px-6 py-6 h-auto text-base font-bold rounded-2xl group"
              >
                <Plus className="mr-2 h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
                Novo Agendamento
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group bg-white/80 backdrop-blur-sm">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                <div className={`absolute top-0 right-0 w-16 h-16 bg-gradient-to-br ${stat.gradient} opacity-10 rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-110`} />

                <CardContent className="p-5 relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-2xl ${stat.iconBg} shadow-lg shadow-${stat.iconBg}/20 ring-4 ring-white`}>
                      {React.createElement(stat.icon, { className: "h-5 w-5 text-white" })}
                    </div>
                    <Badge className="bg-gray-100 text-gray-600 border-0 font-semibold text-[0.65rem] px-2 py-0.5 rounded-full">
                      Hoje
                    </Badge>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                      {stat.title}
                    </p>
                    <p className="text-4xl font-black text-gray-900 tracking-tight">
                      {stat.value}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Filters and Search */}
        <div className="sticky top-4 z-30 bg-white/80 backdrop-blur-xl p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
          <Tabs value={activeTab} onValueChange={(v: any) => setActiveTab(v)} className="w-full md:w-auto">
            <TabsList className="bg-gray-100/50 p-1 rounded-xl">
              <TabsTrigger value="today" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#8C00FF] font-medium">Hoje</TabsTrigger>
              <TabsTrigger value="upcoming" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#8C00FF] font-medium">Próximos</TabsTrigger>
              <TabsTrigger value="history" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-[#8C00FF] font-medium">Histórico</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-72 group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-[#8C00FF] transition-colors" />
              <Input
                placeholder="Buscar paciente, motivo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-50 border-transparent focus:bg-white focus:border-[#8C00FF]/20 rounded-xl transition-all"
              />
            </div>

            <Select value={filterStatus} onValueChange={(v: any) => setFilterStatus(v)}>
              <SelectTrigger className="w-[160px] rounded-xl bg-gray-50 border-transparent focus:bg-white focus:border-[#8C00FF]/20">
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
        </div>

        {/* Creative Timeline Layout */}
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
              <div className="space-y-6 relative pb-12">
                {/* Timeline Line */}
                <div className="absolute left-8 top-4 bottom-4 w-0.5 bg-gradient-to-b from-[#8C00FF]/20 via-[#FF3F7F]/20 to-transparent hidden md:block" />

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
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="relative md:pl-24 group"
                    >
                      {/* Timeline Time & Dot */}
                      <div className="hidden md:flex flex-col items-end absolute left-0 top-0 w-20 pr-4 pt-4">
                        <span className={`text-sm font-bold ${isCurrent ? 'text-[#8C00FF]' : 'text-gray-500'}`}>
                          {appointment.startTime}
                        </span>
                        <div className={`absolute right-[-5px] top-6 w-3 h-3 rounded-full border-2 border-white shadow-sm z-10 transition-colors duration-300 ${isCurrent ? 'bg-[#8C00FF] scale-125 ring-4 ring-[#8C00FF]/20' :
                          appointment.status === 'completed' ? 'bg-green-500' :
                            appointment.status === 'cancelled' ? 'bg-red-500' :
                              'bg-gray-300 group-hover:bg-[#8C00FF]/50'
                          }`} />
                      </div>

                      <Card
                        className={cn(
                          "relative overflow-hidden transition-all duration-300 border-0 shadow-md hover:shadow-xl group-hover:-translate-y-1",
                          isCurrent
                            ? "bg-gradient-to-r from-[#8C00FF]/5 to-white ring-1 ring-[#8C00FF]/30"
                            : "bg-white hover:bg-gray-50/50"
                        )}
                      >
                        {/* Status Stripe */}
                        <div className={cn(
                          "absolute left-0 top-0 bottom-0 w-1.5",
                          appointment.status === 'confirmed' ? "bg-green-500" :
                            appointment.status === 'completed' ? "bg-blue-500" :
                              appointment.status === 'cancelled' ? "bg-red-500" :
                                "bg-[#8C00FF]"
                        )} />

                        <CardContent className="p-5 flex flex-col md:flex-row gap-5 items-start md:items-center">
                          {/* Mobile Time */}
                          <div className="md:hidden flex items-center gap-2 text-sm font-bold text-gray-500 mb-2">
                            <Clock className="h-4 w-4" />
                            {appointment.startTime} - {appointment.endTime}
                          </div>

                          {/* Patient Info */}
                          <div className="flex items-center gap-4 flex-1">
                            <div className="relative">
                              <img
                                src={getPatientAvatar(appointment.patientName)}
                                alt={appointment.patientName}
                                className="h-14 w-14 rounded-2xl object-cover shadow-sm ring-2 ring-white"
                              />
                              {isCurrent && (
                                <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-white"></span>
                                </span>
                              )}
                            </div>

                            <div>
                              <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#8C00FF] transition-colors">
                                {appointment.patientName}
                              </h3>
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Badge variant="secondary" className="rounded-md px-2 py-0 h-5 text-[10px] font-medium uppercase tracking-wide">
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

                          {/* Reason & Notes */}
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
                          <div className="flex items-center gap-2 w-full md:w-auto mt-4 md:mt-0">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-10 w-10 rounded-xl text-gray-400 hover:text-[#8C00FF] hover:bg-[#8C00FF]/10"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewPatient(appointment);
                              }}
                            >
                              <FileText className="h-5 w-5" />
                            </Button>

                            <Button
                              variant="outline"
                              className="flex-1 md:flex-none border-gray-200 hover:border-[#8C00FF] hover:text-[#8C00FF] rounded-xl"
                              onClick={() => handleEditAppointment(appointment)}
                            >
                              Detalhes
                            </Button>

                            <Button
                              className={cn(
                                "flex-1 md:flex-none rounded-xl shadow-lg shadow-purple-500/20",
                                isCurrent
                                  ? "bg-green-600 hover:bg-green-700 text-white"
                                  : "bg-[#8C00FF] hover:bg-[#7a00e6] text-white"
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
      </div>
    </AppLayout>
  );
}