import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import {
  Stethoscope,
  Clock,
  FileText,
  Users,
  CheckCircle2,
  Calendar,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Pill,
  AlertCircle,
  Lightbulb,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppStore } from '@/stores/appStore';
import { useAppointmentStore } from '@/stores/appointmentStore';
import { initializeMockAppointments } from '@/lib/data/mockAppointments';
import { getPatientInitials, getInitialsColor, cn } from '@/lib/utils';
import type { Appointment } from '@/lib/types/appointment';
import { calculateTimeSaved } from '@/utils/metrics';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { startConsultation, patients, privacyMode, consultations } = useAppStore();
  const { appointments, addAppointment, clearAllAppointments } = useAppointmentStore();
  const [isInitialized, setIsInitialized] = useState(false);
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  // Get today's date
  const today = useMemo(() => new Date().toLocaleDateString('en-CA'), []);
  // Use state for now to ensure it updates
  const [now] = useState(() => new Date());

  // Initialize mock data
  useEffect(() => {
    // Check if we need to reinitialize (version bump or empty)
    const APPOINTMENTS_VERSION = '2.0'; // Bump this to force refresh
    const currentVersion = localStorage.getItem('appointments-version');

    if (!isInitialized && (appointments.length === 0 || currentVersion !== APPOINTMENTS_VERSION)) {
      clearAllAppointments();
      const mockAppointments = initializeMockAppointments(patients);
      mockAppointments.forEach(apt => addAppointment(apt));
      localStorage.setItem('appointments-version', APPOINTMENTS_VERSION);
      setIsInitialized(true);
    }
  }, [isInitialized, appointments.length, addAppointment, clearAllAppointments, patients]);

  // Filter today's appointments
  const todayAppointments = useMemo(() => {
    return appointments
      .filter(apt => apt.date === today)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [appointments, today]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = todayAppointments.length;
    const completed = todayAppointments.filter(a => a.status === 'completed').length;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Calculate total time saved today
    const todayConsultations = consultations.filter(c => {
      const consultDate = new Date(c.startedAt).toLocaleDateString('en-CA');
      return consultDate === today && c.doctorNotes;
    });

    const totalTimeSaved = todayConsultations.reduce((acc, consultation) => {
      const timeStr = calculateTimeSaved(consultation.doctorNotes || '');
      const minutes = parseFloat(timeStr);
      return acc + (isNaN(minutes) ? 0 : minutes);
    }, 0);

    return { total, completed, completionRate, totalTimeSaved };
  }, [todayAppointments, consultations, today]);

  // Find current patient (within ±30min)
  const currentPatient = useMemo(() => {
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    return todayAppointments.find(apt => {
      if (apt.status === 'in-progress') return true;
      if (apt.status === 'completed' || apt.status === 'cancelled') return false;

      const [hours, minutes] = apt.startTime.split(':').map(Number);
      const aptMinutes = hours * 60 + minutes;
      const diff = Math.abs(aptMinutes - currentMinutes);

      return diff <= 30;
    });
  }, [todayAppointments, now]);

  // Split appointments into future and past
  const { futureAppointments, pastAppointments } = useMemo(() => {
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const future: Appointment[] = [];
    const past: Appointment[] = [];

    todayAppointments.forEach(apt => {
      // Skip the current patient (already in hero)
      if (currentPatient && apt.id === currentPatient.id) return;

      const [hours, minutes] = apt.startTime.split(':').map(Number);
      const aptMinutes = hours * 60 + minutes;

      if (aptMinutes > currentMinutes || apt.status === 'scheduled') {
        future.push(apt);
      } else {
        past.push(apt);
      }
    });

    return { futureAppointments: future, pastAppointments: past };
  }, [todayAppointments, currentPatient, now]);

  // Handle start consultation
  const handleStartConsultation = (appointment: Appointment) => {
    const patient = patients.find(p => p.id === appointment.patientId);
    if (patient) {
      startConsultation(patient);
      navigate('/consultation');
    }
  };

  // Get last consultation for a patient
  const getLastConsultation = (patientId: string) => {
    const patientConsultations = consultations
      .filter(c => c.patientId === patientId)
      .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
    return patientConsultations[0];
  };

  // Get recent consultations (last 3)
  const getRecentConsultations = (patientId: string) => {
    return consultations
      .filter(c => c.patientId === patientId)
      .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime())
      .slice(0, 3);
  };

  // Get patient full info for expanded card
  const getPatientFullInfo = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    const recentConsultations = getRecentConsultations(patientId);

    return {
      patient,
      allergies: patient?.allergies || [],
      medications: patient?.medications || [],
      mainConditions: patient?.mainConditions || [],
      recentConsultations,
    };
  };

  return (
    <AppLayout>
      <div className="min-h-full space-y-4 md:space-y-6 pb-4 md:pb-0">
        {/* Header - Silicon Valley Style */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              {/* Greeting with modern typography */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3 md:mb-4">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900">
                  Bem-vindo, <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Dr. Luzzi</span>
                </h1>

                {/* Tabs Navigation - Worklist vs Agenda */}
                <Tabs defaultValue="worklist" className="w-full sm:w-auto">
                  <TabsList className="bg-gray-100 p-1 h-10 md:h-11 w-full sm:w-auto grid grid-cols-2 sm:flex">
                    <TabsTrigger
                      value="worklist"
                      className="data-[state=active]:bg-white data-[state=active]:shadow-sm px-3 sm:px-4 md:px-6 text-xs sm:text-sm font-semibold"
                    >
                      <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-2" />
                      <span className="hidden sm:inline">Worklist do Dia</span>
                      <span className="sm:hidden ml-1.5">Worklist</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="agenda"
                      onClick={() => navigate('/appointments')}
                      className="data-[state=active]:bg-white data-[state=active]:shadow-sm px-3 sm:px-4 md:px-6 text-xs sm:text-sm font-semibold"
                    >
                      <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 sm:mr-2" />
                      <span className="hidden sm:inline">Agenda Completa</span>
                      <span className="sm:hidden ml-1.5">Agenda</span>
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Stats Row - Clean & Modern - Mobile Optimized */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 md:gap-3">
                {/* Progress Pill - Enhanced */}
                <div className="flex items-center gap-2.5 md:gap-3 bg-gray-900 text-white rounded-xl px-3 py-2.5 md:px-5 md:py-3 shadow-lg shadow-gray-900/20 flex-1 sm:flex-initial">
                  <div className="relative flex items-center justify-center flex-shrink-0">
                    <svg className="w-7 h-7 md:w-8 md:h-8 transform -rotate-90">
                      <circle
                        cx="14"
                        cy="14"
                        r="12"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        fill="none"
                        className="text-white/20 md:hidden"
                      />
                      <circle
                        cx="14"
                        cy="14"
                        r="12"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        fill="none"
                        strokeDasharray={`${stats.completionRate * 0.75} 100`}
                        className="text-white transition-all duration-700 md:hidden"
                        strokeLinecap="round"
                      />
                      <circle
                        cx="16"
                        cy="16"
                        r="14"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="none"
                        className="text-white/20 hidden md:block"
                      />
                      <circle
                        cx="16"
                        cy="16"
                        r="14"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="none"
                        strokeDasharray={`${stats.completionRate * 0.88} 100`}
                        className="text-white transition-all duration-700 hidden md:block"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute text-[10px] md:text-[11px] font-bold">
                      {stats.completionRate}%
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1.5 md:gap-2">
                    <span className="text-xl md:text-2xl font-bold tabular-nums">{stats.completed}</span>
                    <span className="text-xs md:text-sm text-white/70 font-medium">/ {stats.total} pacientes</span>
                  </div>
                </div>

                {/* Time Saved - Always Show */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-2.5 md:gap-3 bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-xl px-3 py-2.5 md:px-5 md:py-3 shadow-lg shadow-emerald-500/25 flex-1 sm:flex-initial"
                >
                  <div className="flex items-center justify-center w-7 h-7 md:w-8 md:h-8 bg-white/20 rounded-lg flex-shrink-0">
                    <Clock className="h-4 w-4 md:h-5 md:w-5" />
                  </div>
                  <div className="flex items-baseline gap-1.5 md:gap-2">
                    <span className="text-xl md:text-2xl font-bold tabular-nums">{stats.totalTimeSaved.toFixed(0)}</span>
                    <span className="text-xs md:text-sm font-medium opacity-90">min economizados</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Paciente Atual */}
        {currentPatient && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="relative overflow-hidden rounded-xl md:rounded-2xl bg-gradient-to-br from-[#450693] via-[#8C00FF] to-[#FF3F7F] shadow-xl border-0 active:scale-[0.99] transition-transform">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
              <div className="absolute top-0 right-0 w-32 h-32 md:w-48 md:h-48 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

              <CardContent className="relative p-3 sm:p-4 md:p-6">
                <div className="flex flex-col gap-3 md:gap-4">
                  <div className="flex items-center gap-2.5 sm:gap-3 md:gap-4 flex-1 min-w-0">
                    <Avatar className="h-11 w-11 sm:h-12 sm:w-12 md:h-14 md:w-14 border-2 border-white/30 shadow-lg flex-shrink-0">
                      <AvatarFallback className="bg-white/20 text-white backdrop-blur-sm font-bold text-sm sm:text-base md:text-lg">
                        {getPatientInitials(currentPatient.patientName)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="mb-1.5 md:mb-2">
                        <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm text-[9px] md:text-[10px] font-bold tracking-wide">
                          PRONTO PARA INICIAR
                        </Badge>
                      </div>
                      <h2 className={cn(
                        "text-xl sm:text-2xl md:text-3xl font-bold text-white mb-0.5 md:mb-1 tracking-tight truncate",
                        privacyMode && "blur-md select-none"
                      )}>
                        {currentPatient.patientName}
                      </h2>
                      <p className="text-[11px] sm:text-xs md:text-sm text-white/80 font-medium truncate">
                        {currentPatient.startTime} • {currentPatient.reason}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/history')}
                      className="flex-1 h-10 sm:h-11 md:h-10 text-xs sm:text-sm bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 backdrop-blur-sm active:scale-95 transition-transform touch-manipulation"
                    >
                      <Clock className="mr-1.5 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <span className="hidden xs:inline">Histórico</span>
                      <span className="xs:hidden">Hist.</span>
                    </Button>

                    <Button
                      size="sm"
                      onClick={() => handleStartConsultation(currentPatient)}
                      className="flex-1 h-10 sm:h-11 md:h-10 text-xs sm:text-sm bg-white text-purple-700 hover:bg-gray-100 font-bold shadow-md active:scale-95 transition-transform touch-manipulation"
                    >
                      <Stethoscope className="mr-1.5 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      Abrir Copilot
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Próximos Agendamentos */}
        {futureAppointments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-0 shadow-lg bg-white rounded-xl md:rounded-2xl">
              <CardHeader className="pb-3 md:pb-4 px-3 sm:px-4 md:px-6 pt-3 md:pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg md:rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle className="text-base md:text-lg">Próximos Agendamentos</CardTitle>
                      <CardDescription className="text-[11px] md:text-xs">
                        {futureAppointments.length} {futureAppointments.length === 1 ? 'paciente aguardando' : 'pacientes aguardando'}
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 md:space-y-3 px-3 sm:px-4 md:px-6 pb-3 md:pb-6">
                {futureAppointments.map((apt, index) => {
                  const initials = getPatientInitials(apt.patientName);
                  const colors = getInitialsColor(apt.patientName);
                  const lastConsultation = getLastConsultation(apt.patientId);

                  return (
                    <motion.div
                      key={apt.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div
                        onClick={() => setExpandedCard(expandedCard === apt.id ? null : apt.id)}
                        className="rounded-lg md:rounded-xl border border-gray-200 hover:border-purple-300 bg-white hover:shadow-md p-3 md:p-4 transition-all duration-200 cursor-pointer active:scale-[0.99] touch-manipulation"
                      >
                        <div className="flex items-center gap-2.5 md:gap-4">
                          {/* Time */}
                          <div className="text-center min-w-[50px] md:min-w-[60px]">
                            <div className="text-lg md:text-2xl font-bold text-gray-900 tabular-nums leading-none">
                              {apt.startTime}
                            </div>
                            <div className="text-[9px] md:text-[10px] text-gray-500 uppercase tracking-wide mt-0.5 md:mt-1 font-medium">
                              Horário
                            </div>
                          </div>

                          <Separator orientation="vertical" className="h-10 md:h-12 bg-gray-200" />

                          {/* Avatar */}
                          <Avatar className="h-11 w-11 md:h-14 md:w-14 border-2 border-purple-100 group-hover:border-purple-200 transition-all flex-shrink-0">
                            <AvatarFallback className={cn("font-bold text-sm md:text-base", colors.bg, colors.text)}>
                              {initials}
                            </AvatarFallback>
                          </Avatar>

                          {/* Patient Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-1.5 md:gap-2 mb-0.5 md:mb-1">
                              <h4 className={cn(
                                "text-sm md:text-base font-bold text-gray-900",
                                privacyMode && "blur-md select-none"
                              )}>
                                {apt.patientName}
                              </h4>
                              {apt.aiSummaryReady && (
                                <Sparkles className="h-3.5 w-3.5 md:h-4 md:w-4 text-purple-500 flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-xs md:text-sm text-gray-600 mb-1 md:mb-2 line-clamp-1">{apt.reason}</p>
                            <div className="flex items-center gap-2 md:gap-3 text-[10px] md:text-xs text-gray-500 flex-wrap">
                              {apt.patientAge && (
                                <span className="flex items-center gap-0.5 md:gap-1">
                                  <Users className="h-2.5 w-2.5 md:h-3 md:w-3" />
                                  {apt.patientAge}a
                                </span>
                              )}
                              {apt.insurance && (
                                <span className="flex items-center gap-0.5 md:gap-1">
                                  • {apt.insurance}
                                </span>
                              )}
                              {apt.hasExamResults && (
                                <span className="flex items-center gap-0.5 md:gap-1">
                                  <FileText className="h-2.5 w-2.5 md:h-3 md:w-3" />
                                  <span className="hidden sm:inline">Exames</span>
                                </span>
                              )}
                              {apt.isFirstVisit && (
                                <span className="text-purple-600 font-medium">
                                  • 1ª
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Actions - Mobile Optimized */}
                          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
                            {lastConsultation && (
                              <>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setExpandedCard(expandedCard === apt.id ? null : apt.id);
                                  }}
                                  className="h-10 px-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                                >
                                  {expandedCard === apt.id ? (
                                    <ChevronUp className="h-4 w-4" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4" />
                                  )}
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/consultation/${lastConsultation.id}`);
                                  }}
                                  className="h-10 border-gray-300 text-gray-700 hover:bg-gray-50"
                                >
                                  <FileText className="h-4 w-4 mr-1.5" />
                                  Histórico
                                </Button>
                              </>
                            )}
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStartConsultation(apt);
                              }}
                              className="h-10 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold shadow-lg hover:shadow-xl transition-all"
                            >
                              <Stethoscope className="h-4 w-4 mr-2" />
                              Consulta
                            </Button>
                          </div>

                          {/* Mobile Actions - Chevron Only */}
                          <div className="md:hidden flex items-center flex-shrink-0">
                            {lastConsultation && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setExpandedCard(expandedCard === apt.id ? null : apt.id);
                                }}
                                className="h-9 w-9 p-0 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                              >
                                {expandedCard === apt.id ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </Button>
                            )}
                          </div>
                        </div>

                        {/* Mobile Action Buttons - Below content */}
                        <div className="md:hidden flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                          {lastConsultation && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/consultation/${lastConsultation.id}`);
                              }}
                              className="flex-1 h-10 border-gray-300 text-gray-700 hover:bg-gray-50 active:scale-95 transition-transform touch-manipulation"
                            >
                              <FileText className="h-3.5 w-3.5 mr-1.5" />
                              Histórico
                            </Button>
                          )}
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartConsultation(apt);
                            }}
                            className="flex-1 h-10 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold shadow-lg active:scale-95 transition-transform touch-manipulation"
                          >
                            <Stethoscope className="h-3.5 w-3.5 mr-1.5" />
                            Consulta
                          </Button>
                        </div>

                        {/* Informações da Última Consulta - Expansível */}
                        {expandedCard === apt.id && (() => {
                          const patientInfo = getPatientFullInfo(apt.patientId);
                          const { patient, allergies, medications, recentConsultations } = patientInfo;
                          const lastConsult = recentConsultations[0];
                          const aiSuggestions = lastConsult?.aiSuggestions;

                          return (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-gray-200"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {/* Info Básica */}
                              <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4 px-0.5 md:px-1 text-xs md:text-sm flex-wrap">
                                <div>
                                  <span className="text-gray-500">Idade:</span>
                                  <span className="ml-1 font-semibold text-gray-900">{patient?.age}a</span>
                                </div>
                                <div>
                                  <span className="text-gray-500">Sexo:</span>
                                  <span className="ml-1 font-semibold text-gray-900">
                                    {patient?.gender === 'masculino' ? 'M' : patient?.gender === 'feminino' ? 'F' : '-'}
                                  </span>
                                </div>
                                {lastConsult && (
                                  <div>
                                    <span className="text-gray-500">Últ. consulta:</span>
                                    <span className="ml-1 font-semibold text-gray-900">
                                      {new Date(lastConsult.startedAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Grid Layout - Mobile Single Column */}
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5 md:gap-4">
                                {/* COLUNA ESQUERDA */}
                                <div className="space-y-2 md:space-y-3">
                                  {/* Diagnóstico */}
                                  {aiSuggestions?.diagnosesMostLikely && aiSuggestions.diagnosesMostLikely.length > 0 && (
                                    <Card className="border-2 border-purple-200 shadow-md">
                                      <CardContent className="p-2.5 md:p-3">
                                        <div className="flex items-center gap-2 mb-2">
                                          <div className="p-1.5 bg-purple-100 rounded-lg">
                                            <Stethoscope className="h-3.5 w-3.5 text-purple-600" />
                                          </div>
                                          <h5 className="text-xs font-bold text-gray-900">DIAGNÓSTICO</h5>
                                        </div>
                                        <div className="flex flex-wrap gap-1.5">
                                          {aiSuggestions.diagnosesMostLikely.map((diagnosis: string, idx: number) => (
                                            <Badge key={idx} className="bg-purple-100 text-purple-700 border-0 text-xs">
                                              {diagnosis}
                                            </Badge>
                                          ))}
                                        </div>
                                      </CardContent>
                                    </Card>
                                  )}

                                  {/* Alergias */}
                                  {allergies.length > 0 && (
                                    <Card className="border-2 border-red-200 shadow-md">
                                      <CardContent className="p-2.5 md:p-3">
                                        <p className="text-[9px] md:text-[10px] font-bold text-red-600 uppercase tracking-wide mb-1.5 md:mb-2 flex items-center gap-1">
                                          <AlertCircle className="h-2.5 w-2.5 md:h-3 md:w-3" />
                                          Alergias Conhecidas
                                        </p>
                                        <div className="flex flex-wrap gap-1 md:gap-1.5">
                                          {allergies.map((allergy: string, idx: number) => (
                                            <Badge key={idx} className="bg-red-100 text-red-700 border-red-300 text-[9px] md:text-[10px]">
                                              {allergy}
                                            </Badge>
                                          ))}
                                        </div>
                                      </CardContent>
                                    </Card>
                                  )}

                                  {/* Medicações */}
                                  {medications.length > 0 && (
                                    <Card className="border-2 border-blue-200 shadow-md">
                                      <CardContent className="p-2.5 md:p-3">
                                        <div className="flex items-center gap-1.5 md:gap-2 mb-1.5 md:mb-2">
                                          <div className="p-1 md:p-1.5 bg-blue-100 rounded-lg">
                                            <Pill className="h-3 w-3 md:h-3.5 md:w-3.5 text-blue-600" />
                                          </div>
                                          <h5 className="text-[10px] md:text-xs font-bold text-gray-900">MEDICAÇÕES</h5>
                                        </div>
                                        <div className="space-y-0.5 md:space-y-1">
                                          {medications.slice(0, 4).map((med: string, idx: number) => (
                                            <div key={idx} className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs text-gray-700">
                                              <div className="h-1 w-1 md:h-1.5 md:w-1.5 rounded-full bg-blue-600 flex-shrink-0" />
                                              <span className="line-clamp-1">{med}</span>
                                            </div>
                                          ))}
                                          {medications.length > 4 && (
                                            <span className="text-[10px] md:text-xs text-gray-500 ml-2.5 md:ml-3.5">+{medications.length - 4} mais</span>
                                          )}
                                        </div>
                                      </CardContent>
                                    </Card>
                                  )}

                                  {/* Não Perder */}
                                  {aiSuggestions?.diagnosesCantMiss && aiSuggestions.diagnosesCantMiss.length > 0 && (
                                    <Card className="border-2 border-orange-200 shadow-md bg-orange-50/30">
                                      <CardContent className="p-2.5 md:p-3">
                                        <p className="text-[9px] md:text-[10px] font-bold text-orange-600 uppercase tracking-wide mb-1.5 md:mb-2 flex items-center gap-1">
                                          <AlertTriangle className="h-2.5 w-2.5 md:h-3 md:w-3" />
                                          Não Perder
                                        </p>
                                        <div className="flex flex-wrap gap-1 md:gap-1.5">
                                          {aiSuggestions.diagnosesCantMiss.map((diagnosis: string, idx: number) => (
                                            <Badge key={idx} className="bg-orange-100 text-orange-900 border-orange-300 text-[9px] md:text-[10px]">
                                              {diagnosis}
                                            </Badge>
                                          ))}
                                        </div>
                                      </CardContent>
                                    </Card>
                                  )}
                                </div>

                                {/* COLUNA DIREITA */}
                                <div className="space-y-2 md:space-y-3">
                                  {/* Perguntas Sugeridas */}
                                  {aiSuggestions?.suggestedQuestions && aiSuggestions.suggestedQuestions.length > 0 && (
                                    <Card className="border-2 border-purple-200 shadow-md">
                                      <CardContent className="p-2.5 md:p-3">
                                        <div className="flex items-center gap-1.5 md:gap-2 mb-1.5 md:mb-2">
                                          <div className="p-1 md:p-1.5 bg-purple-100 rounded-lg">
                                            <Lightbulb className="h-3 w-3 md:h-3.5 md:w-3.5 text-purple-600" />
                                          </div>
                                          <h5 className="text-[10px] md:text-xs font-bold text-gray-900">PERGUNTAS SUGERIDAS</h5>
                                        </div>
                                        <div className="space-y-1.5 md:space-y-2">
                                          {aiSuggestions.suggestedQuestions.slice(0, 3).map((question: string, idx: number) => (
                                            <div key={idx} className="flex items-start gap-1.5 md:gap-2">
                                              <span className="flex-shrink-0 w-4 h-4 md:w-5 md:h-5 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-[9px] md:text-[10px] font-bold">
                                                {idx + 1}
                                              </span>
                                              <span className="text-[10px] md:text-xs text-gray-700 leading-relaxed">{question}</span>
                                            </div>
                                          ))}
                                        </div>
                                      </CardContent>
                                    </Card>
                                  )}

                                  {/* Lembretes */}
                                  {aiSuggestions?.reminders && aiSuggestions.reminders.length > 0 && (
                                    <Card className="border-2 border-gray-200 shadow-md">
                                      <CardContent className="p-2.5 md:p-3">
                                        <div className="flex items-center gap-1.5 md:gap-2 mb-1.5 md:mb-2">
                                          <div className="p-1 md:p-1.5 bg-gray-100 rounded-lg">
                                            <CheckCircle className="h-3 w-3 md:h-3.5 md:w-3.5 text-gray-600" />
                                          </div>
                                          <h5 className="text-[10px] md:text-xs font-bold text-gray-900">LEMBRETES</h5>
                                        </div>
                                        <div className="space-y-0.5 md:space-y-1">
                                          {aiSuggestions.reminders.slice(0, 3).map((reminder: string, idx: number) => (
                                            <div key={idx} className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs text-gray-700">
                                              <div className="h-1 w-1 md:h-1.5 md:w-1.5 rounded-full bg-gray-600 flex-shrink-0" />
                                              <span className="line-clamp-1">{reminder}</span>
                                            </div>
                                          ))}
                                        </div>
                                      </CardContent>
                                    </Card>
                                  )}
                                </div>
                              </div>

                              {/* Botão Ver Consulta Completa */}
                              {lastConsult && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/consultation/${lastConsult.id}`);
                                  }}
                                  className="w-full mt-2.5 md:mt-3 h-9 md:h-8 text-xs active:scale-95 transition-transform touch-manipulation"
                                >
                                  <FileText className="h-3.5 w-3.5 mr-1.5" />
                                  Ver Consulta Completa
                                </Button>
                              )}
                            </motion.div>
                          );
                        })()}
                      </div>
                    </motion.div>
                  );
                })}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Atendimentos Anteriores */}
        {pastAppointments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-0 shadow-lg bg-white rounded-xl md:rounded-2xl">
              <CardHeader className="pb-2 md:pb-3 px-3 sm:px-4 md:px-6 pt-3 md:pt-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 md:gap-0">
                  <div className="flex items-center gap-2 md:gap-2">
                    <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg md:rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
                    </div>
                    <div>
                      <CardTitle className="text-base md:text-lg">Atendimentos Anteriores</CardTitle>
                      <CardDescription className="text-[11px] md:text-xs">Consultas finalizadas hoje</CardDescription>
                    </div>
                  </div>
                  <Badge className="bg-green-600 text-white hover:bg-green-700 text-xs w-fit">
                    {pastAppointments.length} {pastAppointments.length === 1 ? 'concluído' : 'concluídos'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-0 px-3 sm:px-4 md:px-6 pb-3 md:pb-6">
                {pastAppointments.map((apt, index) => {
                  const initials = getPatientInitials(apt.patientName);
                  const colors = getInitialsColor(apt.patientName);
                  const lastConsultation = getLastConsultation(apt.patientId);

                  return (
                    <div key={apt.id}>
                      {index > 0 && <Separator />}
                      <div className="py-3 md:py-4 hover:bg-gray-50 transition-colors active:bg-gray-100">
                        <div className="flex items-center gap-2.5 md:gap-4">
                          {/* Time */}
                          <div className="text-center min-w-[50px] md:min-w-[60px]">
                            <div className="text-lg md:text-xl font-bold text-gray-900 tabular-nums leading-none">
                              {apt.startTime}
                            </div>
                            <div className="text-[9px] md:text-[10px] text-gray-500 uppercase tracking-wide mt-0.5 md:mt-1 font-medium">
                              Horário
                            </div>
                          </div>

                          <Separator orientation="vertical" className="h-10 md:h-12 bg-gray-200" />

                          {/* Avatar */}
                          <Avatar className="h-10 w-10 md:h-12 md:w-12 border-2 border-gray-200 opacity-75 flex-shrink-0">
                            <AvatarFallback className={cn("text-xs md:text-sm font-bold", colors.bg, colors.text)}>
                              {initials}
                            </AvatarFallback>
                          </Avatar>

                          {/* Patient Info */}
                          <div className="flex-1 min-w-0">
                            <h4 className={cn(
                              "text-sm md:text-base font-bold text-gray-700 mb-0.5 md:mb-1 truncate",
                              privacyMode && "blur-md select-none"
                            )}>
                              {apt.patientName}
                            </h4>
                            <p className="text-xs md:text-sm text-gray-600 line-clamp-1">{apt.reason}</p>
                          </div>

                          {/* Status & Action */}
                          <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
                            {apt.status === 'completed' && (
                              <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
                            )}

                            {lastConsultation && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate(`/consultation/${lastConsultation.id}`)}
                                className="h-8 md:h-9 text-purple-600 hover:text-purple-700 hover:bg-purple-50 active:scale-95 transition-transform touch-manipulation px-2 md:px-3"
                              >
                                <FileText className="h-3.5 w-3.5 md:h-4 md:w-4 md:mr-1.5" />
                                <span className="hidden md:inline">Ver nota</span>
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Empty state */}
        {!currentPatient && futureAppointments.length === 0 && pastAppointments.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Nenhum agendamento para hoje
            </h3>
            <p className="text-sm text-muted-foreground">
              Aproveite para descansar ou revisar casos anteriores.
            </p>
          </motion.div>
        )}
      </div>

    </AppLayout>
  );
};

export default DashboardPage;
