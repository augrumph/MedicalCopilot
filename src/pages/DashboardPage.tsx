import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import { Stethoscope, Users, Calendar, ArrowRight, Sparkles, Clock, Phone, FileText, CheckCircle, AlertCircle, History, UserCheck, XCircle, Brain, Award } from 'lucide-react';
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

type WorklistFilter = 'all' | 'urgent' | 'now' | 'next' | 'pending';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, patients, startConsultation } = useAppStore();
  const { appointments, addAppointment, clearAllAppointments, updateAppointment } = useAppointmentStore();
  const [isInitialized, setIsInitialized] = useState(false);
  const [worklistFilter, setWorklistFilter] = useState<WorklistFilter>('all');

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
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [appointments, today]);

  // Classify appointments with SMART priority logic
  const classifiedAppointments = useMemo(() => {
    const classified = {
      urgent: [] as Appointment[], // Currently happening or critical
      now: [] as Appointment[], // Within next 15 minutes
      next: [] as Appointment[], // Within 15-30 minutes
      late: [] as Appointment[], // Late but not too late (15-120 min)
      probablyNoShow: [] as Appointment[], // Very late (>2 hours)
      pending: [] as Appointment[], // Scheduled but not confirmed
      scheduled: [] as Appointment[], // Confirmed for later
    };

    todayAppointments.forEach(apt => {
      // Skip already completed, cancelled or no-show
      if (apt.status === 'completed' || apt.status === 'cancelled' || apt.status === 'no-show') {
        return;
      }

      const [hours, minutes] = apt.startTime.split(':').map(Number);
      const appointmentTime = new Date();
      appointmentTime.setHours(hours, minutes, 0, 0);
      const diffMinutes = Math.floor((appointmentTime.getTime() - now.getTime()) / 60000);

      // In-progress appointments are URGENT
      if (apt.status === 'in-progress') {
        classified.urgent.push(apt);
      }
      // Within next 15 minutes - AGORA (NOW)
      else if (diffMinutes >= -5 && diffMinutes <= 15) {
        classified.now.push(apt);
      }
      // Next 15-30 minutes - PRÓXIMO
      else if (diffMinutes > 15 && diffMinutes <= 30) {
        classified.next.push(apt);
      }
      // Late 15-120 minutes - ATRASADO (not urgent, just late)
      else if (diffMinutes < -15 && diffMinutes >= -120) {
        classified.late.push(apt);
      }
      // Very late (>2 hours) - PROVÁVEL FALTA
      else if (diffMinutes < -120) {
        classified.probablyNoShow.push(apt);
      }
      // Not confirmed - PENDENTE
      else if (apt.status === 'scheduled') {
        classified.pending.push(apt);
      }
      // Confirmed for later - CONFIRMADO
      else {
        classified.scheduled.push(apt);
      }
    });

    return classified;
  }, [todayAppointments, now]);

  // Filter based on selected filter
  const filteredAppointments = useMemo(() => {
    if (worklistFilter === 'all') {
      return [
        ...classifiedAppointments.urgent,
        ...classifiedAppointments.now,
        ...classifiedAppointments.next,
        ...classifiedAppointments.late,
        ...classifiedAppointments.probablyNoShow,
        ...classifiedAppointments.pending,
        ...classifiedAppointments.scheduled,
      ];
    } else if (worklistFilter === 'urgent') {
      return [...classifiedAppointments.urgent, ...classifiedAppointments.now];
    } else if (worklistFilter === 'now') {
      return classifiedAppointments.now;
    } else if (worklistFilter === 'next') {
      return classifiedAppointments.next;
    } else {
      return classifiedAppointments.pending;
    }
  }, [worklistFilter, classifiedAppointments]);

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

  // Calculate stats
  const completedToday = todayAppointments.filter(a => a.status === 'completed').length;
  const totalToday = todayAppointments.filter(a => a.status !== 'no-show' && a.status !== 'cancelled').length;
  const completionRate = totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0;

  const stats = [
    {
      title: 'Agora',
      value: classifiedAppointments.now.length.toString(),
      icon: Clock,
      description: 'próximos 15min',
      gradient: 'from-[#8C00FF] to-[#450693]',
      iconBg: 'bg-[#8C00FF]',
      filter: 'now' as WorklistFilter,
    },
    {
      title: 'Próximos',
      value: classifiedAppointments.next.length.toString(),
      icon: UserCheck,
      description: 'em 30 minutos',
      gradient: 'from-[#FFC400] to-[#FF9500]',
      iconBg: 'bg-[#FFC400]',
      filter: 'next' as WorklistFilter,
    },
    {
      title: 'Pendentes',
      value: classifiedAppointments.pending.length.toString(),
      icon: AlertCircle,
      description: 'não confirmados',
      gradient: 'from-[#FF9500] to-[#FF6B00]',
      iconBg: 'bg-[#FF9500]',
      filter: 'pending' as WorklistFilter,
    },
    {
      title: 'Concluídos',
      value: `${completionRate}%`,
      icon: CheckCircle,
      description: `${completedToday} de ${totalToday}`,
      gradient: 'from-[#00D9A5] to-[#00B386]',
      iconBg: 'bg-[#00D9A5]',
      filter: 'all' as WorklistFilter,
    },
  ];

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

  const handleMarkNoShow = (appointment: Appointment) => {
    updateAppointment(appointment.id, { status: 'no-show' });
  };

  const getPriorityBadge = (appointment: Appointment) => {
    const [hours, minutes] = appointment.startTime.split(':').map(Number);
    const appointmentTime = new Date();
    appointmentTime.setHours(hours, minutes, 0, 0);
    const diffMinutes = Math.floor((appointmentTime.getTime() - now.getTime()) / 60000);

    // In progress
    if (appointment.status === 'in-progress') {
      return {
        label: 'EM ATENDIMENTO',
        color: 'bg-purple-600',
        textColor: 'text-white',
        icon: Stethoscope,
        urgent: true
      };
    }
    // Now (within next 15 min or slightly late)
    else if (diffMinutes >= -5 && diffMinutes <= 15) {
      return {
        label: 'AGORA',
        color: 'bg-blue-600',
        textColor: 'text-white',
        icon: Clock,
        urgent: false
      };
    }
    // Next 15-30 min
    else if (diffMinutes > 15 && diffMinutes <= 30) {
      return {
        label: 'PRÓXIMO',
        color: 'bg-green-600',
        textColor: 'text-white',
        icon: UserCheck,
        urgent: false
      };
    }
    // Late 15-120 min
    else if (diffMinutes < -15 && diffMinutes >= -120) {
      const minutesLate = Math.abs(diffMinutes);
      return {
        label: `ATRASADO ${minutesLate}min`,
        color: 'bg-orange-500',
        textColor: 'text-white',
        icon: AlertCircle,
        urgent: false
      };
    }
    // Very late (probable no-show)
    else if (diffMinutes < -120) {
      return {
        label: 'PROVÁVEL FALTA',
        color: 'bg-gray-400',
        textColor: 'text-white',
        icon: XCircle,
        urgent: false
      };
    }
    // Pending confirmation
    else if (appointment.status === 'scheduled') {
      return {
        label: 'PENDENTE',
        color: 'bg-yellow-500',
        textColor: 'text-white',
        icon: Calendar,
        urgent: false
      };
    }
    // Confirmed for later
    else {
      return {
        label: 'CONFIRMADO',
        color: 'bg-emerald-500',
        textColor: 'text-white',
        icon: CheckCircle,
        urgent: false
      };
    }
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

  const getSmartComplaint = (appointment: Appointment) => {
    const parts = [];

    // Base reason
    if (appointment.reason) {
      parts.push(appointment.reason);
    }

    // Add context
    if (appointment.type === 'follow-up') {
      if (appointment.hasExamResults) {
        parts.push('- Trouxe exames');
      }
      if (appointment.lastVisitDate) {
        parts.push(`- Última visita: ${appointment.lastVisitDate}`);
      }
    } else if (appointment.isFirstVisit) {
      parts.push('- Primeira consulta');
    }

    return parts.join(' ');
  };

  return (
    <AppLayout>
      <div className="min-h-full space-y-6">
        {/* Hero Section - Calming, Professional */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#450693] via-[#8C00FF] to-[#6B46C1] p-6 md:p-8 shadow-2xl"
        >
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>

          <div className="relative">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-2 mb-2"
            >
              <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm px-2.5 py-1 text-xs font-semibold">
                <Sparkles className="h-3 w-3 mr-1" />
                Cockpit Médico
              </Badge>
              <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm px-2.5 py-1 text-xs font-semibold">
                <Clock className="h-3 w-3 mr-1" />
                {now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} • {now.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
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
              className="text-white/90 font-medium max-w-2xl"
            >
              {totalToday > 0 ? (
                <>
                  Sua agenda está <strong>{completionRate}% concluída</strong> • {' '}
                  {classifiedAppointments.now.length > 0 && (
                    <span className="text-blue-200">
                      <strong>{classifiedAppointments.now.length}</strong> agora • {' '}
                    </span>
                  )}
                  {classifiedAppointments.next.length > 0 && (
                    <span className="text-green-200">
                      <strong>{classifiedAppointments.next.length}</strong> próximos • {' '}
                    </span>
                  )}
                  <strong>{completedToday}</strong> de <strong>{totalToday}</strong> finalizados
                </>
              ) : (
                'Sem agendamentos para hoje. Aproveite para organizar!'
              )}
            </motion.p>
          </div>
        </motion.div>

        {/* Stats Grid - Actionable KPIs */}
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.05 }}
              onClick={() => setWorklistFilter(stat.filter)}
              className="cursor-pointer"
            >
              <Card className={cn(
                "relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 group",
                worklistFilter === stat.filter && "ring-2 ring-offset-2 ring-[#8C00FF]"
              )}>
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />

                <CardContent className="p-4 relative">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-xl ${stat.iconBg} shadow-sm`}>
                      <stat.icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider truncate">
                        {stat.title}
                      </p>
                      <p className="text-2xl font-black text-gray-900 tracking-tight mt-0.5">
                        {stat.value}
                      </p>
                      <p className="text-[10px] text-gray-500 mt-0.5 truncate">
                        {stat.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Auto-cleanup suggestion */}
        {classifiedAppointments.probablyNoShow.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-orange-900">
                      {classifiedAppointments.probablyNoShow.length} paciente{classifiedAppointments.probablyNoShow.length > 1 ? 's' : ''} com provável falta
                    </h3>
                    <p className="text-sm text-orange-700 mt-1">
                      Pacientes com mais de 2 horas de atraso. Deseja marcar como falta?
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-orange-300 text-orange-700 hover:bg-orange-100"
                    onClick={() => {
                      classifiedAppointments.probablyNoShow.forEach(apt => handleMarkNoShow(apt));
                    }}
                  >
                    Marcar Todas
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Worklist */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-[#450693] to-[#8C00FF] bg-clip-text text-transparent">
              Lista de Trabalho
            </h2>
            {filteredAppointments.length > 0 && (
              <Button
                onClick={() => navigate('/appointments')}
                variant="outline"
                size="sm"
                className="border-[#8C00FF] text-[#8C00FF] hover:bg-[#8C00FF] hover:text-white"
              >
                Agenda Completa
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>

          {filteredAppointments.length === 0 ? (
            <Card className="border-0 shadow-lg">
              <CardContent className="p-12 text-center">
                <div className="relative mb-6 inline-block">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#8C00FF] to-[#450693] rounded-full blur-2xl opacity-20 animate-pulse"></div>
                  <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-[#8C00FF] to-[#450693] flex items-center justify-center shadow-xl">
                    <Calendar className="h-10 w-10 text-white" />
                  </div>
                </div>

                <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-[#450693] to-[#8C00FF] bg-clip-text text-transparent">
                  {patients.length === 0 ? 'Importe pacientes primeiro' : 'Nenhum paciente nesta categoria'}
                </h3>

                <p className="text-gray-600 mb-6">
                  {patients.length === 0
                    ? 'Você precisa importar pacientes antes de criar agendamentos'
                    : `Não há pacientes ${worklistFilter !== 'all' ? `na categoria "${worklistFilter}"` : 'agendados para hoje'}`}
                </p>

                <Button
                  onClick={() => patients.length === 0 ? navigate('/patients') : setWorklistFilter('all')}
                  className="bg-gradient-to-r from-[#8C00FF] to-[#450693] text-white shadow-lg hover:shadow-xl"
                >
                  {patients.length === 0 ? (
                    <>
                      <Users className="mr-2 h-4 w-4" />
                      Importar Pacientes
                    </>
                  ) : (
                    <>
                      Ver Todos
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {filteredAppointments.map((appointment, index) => {
                  const priority = getPriorityBadge(appointment);
                  const PriorityIcon = priority.icon;
                  const insurance = getInsuranceBadge(appointment.insurance);
                  const smartComplaint = getSmartComplaint(appointment);

                  return (
                    <motion.div
                      key={appointment.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.03 }}
                    >
                      <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 group">
                        <CardContent className="p-4 md:p-5">
                          {/* Mobile Layout */}
                          <div className="flex md:hidden flex-col gap-3">
                            {/* Header */}
                            <div className="flex items-start gap-3">
                              <div className="relative flex-shrink-0">
                                <img
                                  src={getPatientAvatar(appointment.patientName)}
                                  alt={appointment.patientName}
                                  className="h-14 w-14 rounded-xl object-cover ring-2 ring-white shadow-md"
                                />
                                {appointment.aiSummaryReady && (
                                  <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                                    <Brain className="h-3 w-3 text-white" />
                                  </div>
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-lg font-bold text-gray-900">{appointment.startTime}</span>
                                    <Badge className={cn(priority.color, priority.textColor, "text-[10px] px-2 py-0.5")}>
                                      <PriorityIcon className="h-3 w-3 mr-0.5" />
                                      {priority.label}
                                    </Badge>
                                  </div>
                                </div>
                                <h3 className="text-base font-bold text-gray-900 truncate">
                                  {appointment.patientName}{appointment.patientAge && `, ${appointment.patientAge}a`}
                                </h3>
                                <div className="flex items-center gap-2 mt-1 flex-wrap">
                                  {insurance && (
                                    <Badge className={cn(insurance.bg, insurance.text, "text-[10px] px-2 py-0.5")}>
                                      <Award className="h-2.5 w-2.5 mr-0.5" />
                                      {insurance.name}
                                    </Badge>
                                  )}
                                  {appointment.isFirstVisit && (
                                    <Badge className="bg-blue-100 text-blue-700 text-[10px] px-2 py-0.5">
                                      1ª Consulta
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Smart Complaint */}
                            {smartComplaint && (
                              <div className="pl-1">
                                <p className="text-sm text-gray-700 line-clamp-2">
                                  <FileText className="h-3.5 w-3.5 inline mr-1 text-[#8C00FF]" />
                                  {smartComplaint}
                                </p>
                              </div>
                            )}

                            {/* Actions */}
                            <div className="flex gap-2">
                              {priority.label.includes('ATRASADO') || priority.label === 'PROVÁVEL FALTA' ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="flex-1 h-9 border-orange-300 text-orange-700 hover:bg-orange-50"
                                  onClick={() => handleMarkNoShow(appointment)}
                                >
                                  <XCircle className="h-3.5 w-3.5 mr-1.5" />
                                  Marcar Falta
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="flex-1 h-9"
                                  onClick={() => navigate('/appointments')}
                                >
                                  <History className="h-3.5 w-3.5 mr-1.5" />
                                  Histórico
                                </Button>
                              )}
                              <Button
                                size="sm"
                                className="flex-1 h-9 bg-gradient-to-r from-[#8C00FF] to-[#450693] text-white"
                                onClick={() => handleStartConsultation(appointment)}
                              >
                                <Stethoscope className="h-3.5 w-3.5 mr-1.5" />
                                Iniciar
                              </Button>
                            </div>
                          </div>

                          {/* Desktop Layout */}
                          <div className="hidden md:flex items-center gap-4">
                            {/* Time + Priority */}
                            <div className="flex flex-col items-center min-w-[120px]">
                              <span className="text-2xl font-black text-gray-900">{appointment.startTime}</span>
                              <Badge className={cn(priority.color, priority.textColor, "text-xs px-2.5 py-0.5 mt-1")}>
                                <PriorityIcon className="h-3 w-3 mr-1" />
                                {priority.label}
                              </Badge>
                            </div>

                            {/* Avatar */}
                            <div className="relative">
                              <img
                                src={getPatientAvatar(appointment.patientName)}
                                alt={appointment.patientName}
                                className="h-16 w-16 rounded-2xl object-cover ring-2 ring-white shadow-md group-hover:scale-105 transition-transform"
                              />
                              {appointment.aiSummaryReady && (
                                <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1.5">
                                  <Brain className="h-3.5 w-3.5 text-white" />
                                </div>
                              )}
                            </div>

                            {/* Patient Info */}
                            <div className="flex-1 min-w-0">
                              <h3 className="text-xl font-bold text-gray-900 group-hover:text-[#8C00FF] transition-colors truncate">
                                {appointment.patientName}{appointment.patientAge && `, ${appointment.patientAge} anos`}
                              </h3>
                              <div className="flex items-center gap-3 mt-1 flex-wrap">
                                {insurance && (
                                  <Badge className={cn(insurance.bg, insurance.text, "text-xs px-2 py-0.5")}>
                                    <Award className="h-3 w-3 mr-0.5" />
                                    {insurance.name}
                                  </Badge>
                                )}
                                {appointment.isFirstVisit && (
                                  <Badge className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5">
                                    Primeira Consulta
                                  </Badge>
                                )}
                                {appointment.patientPhone && (
                                  <span className="text-sm text-gray-500 hidden lg:flex items-center gap-1">
                                    <Phone className="h-3.5 w-3.5" />
                                    {appointment.patientPhone}
                                  </span>
                                )}
                              </div>
                              {smartComplaint && (
                                <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                                  <FileText className="h-3.5 w-3.5 inline mr-1 text-[#8C00FF]" />
                                  {smartComplaint}
                                </p>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-2">
                              {priority.label.includes('ATRASADO') || priority.label === 'PROVÁVEL FALTA' ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-orange-300 text-orange-700 hover:bg-orange-50"
                                  onClick={() => handleMarkNoShow(appointment)}
                                >
                                  <XCircle className="h-4 w-4 mr-1.5" />
                                  Marcar Falta
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => navigate('/appointments')}
                                >
                                  <History className="h-4 w-4 mr-1.5" />
                                  Histórico
                                </Button>
                              )}
                              <Button
                                size="sm"
                                className="bg-gradient-to-r from-[#8C00FF] to-[#450693] text-white shadow-md hover:shadow-lg"
                                onClick={() => handleStartConsultation(appointment)}
                              >
                                <Stethoscope className="h-4 w-4 mr-1.5" />
                                Iniciar Consulta
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
};

export default DashboardPage;
