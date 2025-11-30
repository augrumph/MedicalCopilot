import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { Stethoscope, Calendar, Sparkles, Clock, Phone, FileText, Award, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/stores/appStore';
import { useAppointmentStore } from '@/stores/appointmentStore';
import { initializeMockAppointments } from '@/lib/data/mockAppointments';
import { getPatientAvatar, cn } from '@/lib/utils';
import type { Appointment } from '@/lib/types/appointment';

type TimeGroup = 'past' | 'focus' | 'future';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, patients, startConsultation } = useAppStore();
  const { appointments, addAppointment, clearAllAppointments, updateAppointment } = useAppointmentStore();
  const [isInitialized, setIsInitialized] = useState(false);

  // Get today's date in YYYY-MM-DD format
  const today = useMemo(() => new Date().toLocaleDateString('en-CA'), []);
  const now = new Date();

  // Dynamic greeting based on time
  const getGreeting = () => {
    const hour = now.getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  // Filter appointments for today
  const todayAppointments = useMemo(() => {
    return appointments
      .filter(apt => apt.date === today)
      .filter(apt => apt.status !== 'cancelled' && apt.status !== 'no-show')
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [appointments, today]);

  // Group appointments by time (SIMPLE: past, focus, future)
  const groupedAppointments = useMemo(() => {
    const groups: Record<TimeGroup, Appointment[]> = {
      past: [],
      focus: [],
      future: [],
    };

    let focusFound = false;

    todayAppointments.forEach(apt => {
      // Skip completed
      if (apt.status === 'completed') {
        return;
      }

      const [hours, minutes] = apt.startTime.split(':').map(Number);
      const appointmentTime = new Date();
      appointmentTime.setHours(hours, minutes, 0, 0);
      const diffMinutes = Math.floor((appointmentTime.getTime() - now.getTime()) / 60000);

      // In progress = always focus
      if (apt.status === 'in-progress') {
        groups.focus.push(apt);
        focusFound = true;
      }
      // Within +/- 30 minutes and not yet focused on another = focus
      else if (!focusFound && diffMinutes >= -30 && diffMinutes <= 30) {
        groups.focus.push(apt);
        focusFound = true;
      }
      // Past (before current time - 30min)
      else if (diffMinutes < -30) {
        groups.past.push(apt);
      }
      // Future
      else {
        groups.future.push(apt);
      }
    });

    return groups;
  }, [todayAppointments, now]);

  // Initialize appointments from patients if needed
  useEffect(() => {
    const hasAppointmentsToday = appointments.some(apt => apt.date === today);

    if (!isInitialized && patients.length > 0 && (appointments.length === 0 || !hasAppointmentsToday)) {
      if (appointments.length > 0 && !hasAppointmentsToday) {
        clearAllAppointments();
      }

      const mockAppointments = initializeMockAppointments(patients);
      mockAppointments.forEach(apt => {
        const { id, createdAt, updatedAt, ...data } = apt;
        addAppointment(data);
      });
      setIsInitialized(true);
    }
  }, [isInitialized, appointments, patients, today, addAppointment, clearAllAppointments]);

  const handleStartConsultation = (appointment: Appointment) => {
    const patient = patients.find(p => p.id === appointment.patientId) ||
      patients.find(p => p.name.toLowerCase() === appointment.patientName.toLowerCase());

    if (patient) {
      // Update appointment status to in-progress
      updateAppointment(appointment.id, { status: 'in-progress' });
      startConsultation(patient);
      navigate('/consultation');
    }
  };

  // Parse smart tags from reason (simulate Google Calendar parsing)
  const getSmartTags = (appointment: Appointment) => {
    const tags: string[] = [];

    // Insurance from our data
    if (appointment.insurance) {
      tags.push(appointment.insurance);
    }

    // Parse keywords from reason
    if (appointment.reason) {
      const reason = appointment.reason.toLowerCase();
      if (reason.includes('retorno') || appointment.type === 'follow-up') {
        tags.push('Retorno');
      } else if (reason.includes('primeira') || appointment.isFirstVisit) {
        tags.push('1ª Vez');
      }
      if (reason.includes('exame')) {
        tags.push('Exames');
      }
    }

    return tags;
  };

  const getInsuranceBadge = (insurance?: string) => {
    if (!insurance) return null;

    const insuranceColors: Record<string, { bg: string; text: string; name: string }> = {
      unimed: { bg: 'bg-green-100', text: 'text-green-700', name: 'Unimed' },
      bradesco: { bg: 'bg-red-100', text: 'text-red-700', name: 'Bradesco' },
      amil: { bg: 'bg-blue-100', text: 'text-blue-700', name: 'Amil' },
      sulamerica: { bg: 'bg-indigo-100', text: 'text-indigo-700', name: 'SulAmérica' },
      particular: { bg: 'bg-purple-100', text: 'text-purple-700', name: 'Particular' },
      outro: { bg: 'bg-gray-100', text: 'text-gray-700', name: 'Outro' },
    };

    return insuranceColors[insurance] || insuranceColors.outro;
  };

  const renderAppointmentCard = (appointment: Appointment, group: TimeGroup, index: number) => {
    const insurance = getInsuranceBadge(appointment.insurance);
    const tags = getSmartTags(appointment);
    const isPast = group === 'past';
    const isFocus = group === 'focus';
    const isInProgress = appointment.status === 'in-progress';

    return (
      <motion.div
        key={appointment.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ delay: index * 0.02 }}
      >
        <Card
          className={cn(
            "border-0 shadow-md hover:shadow-lg transition-all duration-300 group",
            isPast && "opacity-50",
            isFocus && "ring-2 ring-[#8C00FF] shadow-xl",
            isInProgress && "ring-2 ring-green-500 shadow-xl animate-pulse"
          )}
        >
          <CardContent className="p-4 md:p-5">
            {/* Mobile Layout */}
            <div className="flex md:hidden items-start gap-3">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <img
                  src={getPatientAvatar(appointment.patientName)}
                  alt={appointment.patientName}
                  className="h-12 w-12 rounded-xl object-cover ring-2 ring-white shadow-md"
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={cn(
                    "text-base font-bold",
                    isPast ? "text-gray-500" : "text-gray-900"
                  )}>
                    {appointment.startTime}
                  </span>
                  {isInProgress && (
                    <Badge className="bg-green-600 text-white text-[10px] px-2 py-0.5">
                      EM ATENDIMENTO
                    </Badge>
                  )}
                  {isFocus && !isInProgress && (
                    <Badge className="bg-[#8C00FF] text-white text-[10px] px-2 py-0.5">
                      SUGERIDO
                    </Badge>
                  )}
                </div>
                <h3 className={cn(
                  "text-sm font-bold truncate",
                  isPast ? "text-gray-600" : "text-gray-900"
                )}>
                  {appointment.patientName}
                </h3>
                {appointment.reason && (
                  <p className="text-xs text-gray-500 truncate mt-0.5">
                    {appointment.reason}
                  </p>
                )}
                <div className="flex items-center gap-1 mt-1 flex-wrap">
                  {insurance && (
                    <Badge className={cn(insurance.bg, insurance.text, "text-[10px] px-1.5 py-0")}>
                      {insurance.name}
                    </Badge>
                  )}
                  {tags.filter(t => t !== appointment.insurance).map(tag => (
                    <Badge key={tag} className="bg-gray-100 text-gray-600 text-[10px] px-1.5 py-0">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Action */}
              <div className="flex-shrink-0">
                {isFocus ? (
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-[#8C00FF] to-[#450693] text-white h-12 px-4"
                    onClick={() => handleStartConsultation(appointment)}
                  >
                    <Stethoscope className="h-4 w-4 mr-1.5" />
                    Iniciar
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-12 w-12 p-0"
                    onClick={() => handleStartConsultation(appointment)}
                  >
                    <Play className="h-5 w-5" />
                  </Button>
                )}
              </div>
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:flex items-center gap-4">
              {/* Time */}
              <div className="flex flex-col items-center min-w-[80px]">
                <span className={cn(
                  "text-2xl font-black",
                  isPast ? "text-gray-400" : "text-gray-900"
                )}>
                  {appointment.startTime}
                </span>
                {isInProgress && (
                  <Badge className="bg-green-600 text-white text-xs px-2 py-0.5 mt-1">
                    EM ATENDIMENTO
                  </Badge>
                )}
                {isFocus && !isInProgress && (
                  <Badge className="bg-[#8C00FF] text-white text-xs px-2 py-0.5 mt-1">
                    SUGERIDO
                  </Badge>
                )}
              </div>

              {/* Avatar */}
              <div className="relative">
                <img
                  src={getPatientAvatar(appointment.patientName)}
                  alt={appointment.patientName}
                  className="h-14 w-14 rounded-2xl object-cover ring-2 ring-white shadow-md group-hover:scale-105 transition-transform"
                />
              </div>

              {/* Patient Info */}
              <div className="flex-1 min-w-0">
                <h3 className={cn(
                  "text-lg font-bold truncate",
                  isPast ? "text-gray-600" : "text-gray-900 group-hover:text-[#8C00FF] transition-colors"
                )}>
                  {appointment.patientName}
                </h3>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  {insurance && (
                    <Badge className={cn(insurance.bg, insurance.text, "text-xs px-2 py-0.5")}>
                      <Award className="h-3 w-3 mr-0.5" />
                      {insurance.name}
                    </Badge>
                  )}
                  {tags.filter(t => t !== appointment.insurance).map(tag => (
                    <Badge key={tag} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5">
                      {tag}
                    </Badge>
                  ))}
                  {appointment.patientPhone && (
                    <span className="text-sm text-gray-500 hidden lg:flex items-center gap-1">
                      <Phone className="h-3 w-3" />
                      {appointment.patientPhone}
                    </span>
                  )}
                </div>
                {appointment.reason && (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                    <FileText className="h-3 w-3 inline mr-1 text-[#8C00FF]" />
                    {appointment.reason}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {isFocus ? (
                  <Button
                    size="default"
                    className="bg-gradient-to-r from-[#8C00FF] to-[#450693] text-white shadow-md hover:shadow-lg"
                    onClick={() => handleStartConsultation(appointment)}
                  >
                    <Stethoscope className="h-4 w-4 mr-2" />
                    Iniciar Consulta
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleStartConsultation(appointment)}
                  >
                    <Play className="h-5 w-5" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const totalToday = todayAppointments.length;
  const completedToday = todayAppointments.filter(a => a.status === 'completed').length;

  return (
    <AppLayout>
      <div className="min-h-full space-y-6">
        {/* Simple Hero - Just greeting and count */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#450693] via-[#8C00FF] to-[#6B46C1] p-6 md:p-8 shadow-2xl"
        >
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

          <div className="relative">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-2 mb-2"
            >
              <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm px-2.5 py-1 text-xs font-semibold">
                <Sparkles className="h-3 w-3 mr-1" />
                Launcher
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm px-2.5 py-1 text-xs font-semibold">
                <Clock className="h-3 w-3 mr-1" />
                {now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2"
            >
              {getGreeting()}, Dr. {user?.name?.split(' ')[0]}! 👋
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-white/90 font-medium"
            >
              {totalToday > 0 ? (
                <>
                  Você tem <strong>{totalToday}</strong> {totalToday === 1 ? 'agendamento' : 'agendamentos'} hoje
                  {completedToday > 0 && <> • <strong>{completedToday}</strong> concluído{completedToday !== 1 && 's'}</>}
                </>
              ) : (
                'Sem agendamentos para hoje'
              )}
            </motion.p>
          </div>
        </motion.div>

        {/* Appointments List - Grouped */}
        <div className="space-y-6">
          {patients.length === 0 ? (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <div className="relative mb-6 inline-block">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#8C00FF] to-[#450693] rounded-full blur-2xl opacity-20 animate-pulse"></div>
                  <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-[#8C00FF] to-[#450693] flex items-center justify-center shadow-xl">
                    <Calendar className="h-10 w-10 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-[#450693] to-[#8C00FF] bg-clip-text text-transparent">
                  Importe pacientes primeiro
                </h3>
                <p className="text-gray-600 mb-6">
                  Você precisa importar pacientes antes de criar agendamentos
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Focus Patient (Highlighted) */}
              {groupedAppointments.focus.length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    {groupedAppointments.focus[0].status === 'in-progress' ? 'Em Atendimento' : 'Horário Atual'}
                  </h2>
                  <AnimatePresence>
                    {groupedAppointments.focus.map((apt, idx) =>
                      renderAppointmentCard(apt, 'focus', idx)
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Future Patients */}
              {groupedAppointments.future.length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    Próximos
                  </h2>
                  <AnimatePresence>
                    {groupedAppointments.future.map((apt, idx) =>
                      renderAppointmentCard(apt, 'future', idx)
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Past Patients (Faded) */}
              {groupedAppointments.past.length > 0 && (
                <div className="space-y-3">
                  <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                    Anteriores
                  </h2>
                  <AnimatePresence>
                    {groupedAppointments.past.map((apt, idx) =>
                      renderAppointmentCard(apt, 'past', idx)
                    )}
                  </AnimatePresence>
                </div>
              )}

              {totalToday === 0 && (
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-12 text-center">
                    <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">Nenhum agendamento para hoje</p>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default DashboardPage;
