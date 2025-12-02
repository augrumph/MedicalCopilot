import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import {
  Stethoscope,
  Clock,
  FileText,
  Users,
  CheckCircle2,
  ChevronRight,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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
              {/* Greeting with modern typography */}
              <div className="flex items-baseline gap-3 mb-4">
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900">
                  Bem-vindo, <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Dr. Luzzi</span>
                </h1>
              </div>

              {/* Stats Row - Clean & Modern */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Progress Pill - Enhanced */}
                <div className="inline-flex items-center gap-3 bg-gray-900 text-white rounded-xl px-5 py-3 shadow-lg shadow-gray-900/20">
                  <div className="relative flex items-center justify-center">
                    <svg className="w-8 h-8 transform -rotate-90">
                      <circle
                        cx="16"
                        cy="16"
                        r="14"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="none"
                        className="text-white/20"
                      />
                      <circle
                        cx="16"
                        cy="16"
                        r="14"
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="none"
                        strokeDasharray={`${stats.completionRate * 0.88} 100`}
                        className="text-white transition-all duration-700"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="absolute text-[11px] font-bold">
                      {stats.completionRate}%
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold tabular-nums">{stats.completed}</span>
                    <span className="text-sm text-white/70 font-medium">/ {stats.total} pacientes</span>
                  </div>
                </div>

                {/* Time Saved - Always Show */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="inline-flex items-center gap-3 bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-xl px-5 py-3 shadow-lg shadow-emerald-500/25"
                >
                  <div className="flex items-center justify-center w-8 h-8 bg-white/20 rounded-lg">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold tabular-nums">{stats.totalTimeSaved.toFixed(0)}</span>
                    <span className="text-sm font-medium opacity-90">min economizados</span>
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
            <Card className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#450693] via-[#8C00FF] to-[#FF3F7F] shadow-xl border-0">
              <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light"></div>
              <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

              <CardContent className="relative p-4 sm:p-5 md:p-6">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                    <Avatar className="h-12 w-12 sm:h-14 sm:w-14 border-2 border-white/30 shadow-lg flex-shrink-0">
                      <AvatarFallback className="bg-white/20 text-white backdrop-blur-sm font-bold text-base sm:text-lg">
                        {getPatientInitials(currentPatient.patientName)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="mb-2">
                        <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm text-[10px] font-bold tracking-wide">
                          PRONTO PARA INICIAR
                        </Badge>
                      </div>
                      <h2 className={cn(
                        "text-2xl sm:text-3xl font-bold text-white mb-1 tracking-tight truncate",
                        privacyMode && "blur-md select-none"
                      )}>
                        {currentPatient.patientName}
                      </h2>
                      <p className="text-xs sm:text-sm text-white/80 font-medium truncate">
                        {currentPatient.startTime} • {currentPatient.reason}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/history')}
                      className="flex-1 h-9 sm:h-10 text-xs sm:text-sm bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 backdrop-blur-sm"
                    >
                      <Clock className="mr-1.5 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      <span className="hidden xs:inline">Histórico</span>
                      <span className="xs:hidden">Hist.</span>
                    </Button>

                    <Button
                      size="sm"
                      onClick={() => handleStartConsultation(currentPatient)}
                      className="flex-1 h-9 sm:h-10 text-xs sm:text-sm bg-white text-purple-700 hover:bg-gray-100 font-bold shadow-md"
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
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-purple-100 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Próximos Agendamentos</CardTitle>
                      <CardDescription className="text-xs">
                        {futureAppointments.length} {futureAppointments.length === 1 ? 'paciente aguardando' : 'pacientes aguardando'}
                      </CardDescription>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
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
                      <div className="group relative rounded-xl border border-gray-200 hover:border-purple-300 bg-white hover:shadow-md p-4 transition-all duration-200">
                        <div className="flex items-center gap-4">
                          {/* Time */}
                          <div className="text-center min-w-[60px]">
                            <div className="text-2xl font-bold text-gray-900 tabular-nums leading-none">
                              {apt.startTime}
                            </div>
                            <div className="text-[10px] text-gray-500 uppercase tracking-wide mt-1 font-medium">
                              Horário
                            </div>
                          </div>

                          <Separator orientation="vertical" className="h-12 bg-gray-200" />

                          {/* Avatar */}
                          <Avatar className="h-14 w-14 border-2 border-purple-100 group-hover:border-purple-200 transition-all">
                            <AvatarFallback className={cn("font-bold", colors.bg, colors.text)}>
                              {initials}
                            </AvatarFallback>
                          </Avatar>

                          {/* Patient Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <h4 className={cn(
                                "text-base font-bold text-gray-900",
                                privacyMode && "blur-md select-none"
                              )}>
                                {apt.patientName}
                              </h4>
                              {apt.aiSummaryReady && (
                                <Sparkles className="h-4 w-4 text-purple-500 flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{apt.reason}</p>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              {apt.patientAge && (
                                <span className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {apt.patientAge} anos
                                </span>
                              )}
                              {apt.insurance && (
                                <span className="flex items-center gap-1">
                                  • {apt.insurance}
                                </span>
                              )}
                              {apt.hasExamResults && (
                                <span className="flex items-center gap-1">
                                  <FileText className="h-3 w-3" />
                                  Exames
                                </span>
                              )}
                              {apt.isFirstVisit && (
                                <span className="text-purple-600 font-medium">
                                  • 1ª consulta
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2">
                            {lastConsultation && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => navigate(`/consultation/${lastConsultation.id}`)}
                                className="h-10 border-gray-300 text-gray-700 hover:bg-gray-50"
                              >
                                <FileText className="h-4 w-4 mr-1.5" />
                                Histórico
                              </Button>
                            )}
                            <Button
                              size="sm"
                              onClick={() => handleStartConsultation(apt)}
                              className="h-10 px-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold"
                            >
                              Iniciar
                              <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                          </div>
                        </div>
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
            <Card className="border-0 shadow-lg bg-white">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-xl bg-green-100 flex items-center justify-center">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Atendimentos Anteriores</CardTitle>
                      <CardDescription className="text-xs">Consultas finalizadas hoje</CardDescription>
                    </div>
                  </div>
                  <Badge className="bg-green-600 text-white hover:bg-green-700">
                    {pastAppointments.length} {pastAppointments.length === 1 ? 'concluído' : 'concluídos'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-0">
                {pastAppointments.map((apt, index) => {
                  const initials = getPatientInitials(apt.patientName);
                  const colors = getInitialsColor(apt.patientName);
                  const lastConsultation = getLastConsultation(apt.patientId);

                  return (
                    <div key={apt.id}>
                      {index > 0 && <Separator />}
                      <div className="py-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-4">
                          {/* Time */}
                          <div className="text-center min-w-[60px]">
                            <div className="text-xl font-bold text-gray-900 tabular-nums leading-none">
                              {apt.startTime}
                            </div>
                            <div className="text-[10px] text-gray-500 uppercase tracking-wide mt-1 font-medium">
                              Horário
                            </div>
                          </div>

                          <Separator orientation="vertical" className="h-12 bg-gray-200" />

                          {/* Avatar */}
                          <Avatar className="h-12 w-12 border-2 border-gray-200 opacity-75">
                            <AvatarFallback className={cn("text-sm font-bold", colors.bg, colors.text)}>
                              {initials}
                            </AvatarFallback>
                          </Avatar>

                          {/* Patient Info */}
                          <div className="flex-1 min-w-0">
                            <h4 className={cn(
                              "text-base font-bold text-gray-700 mb-1",
                              privacyMode && "blur-md select-none"
                            )}>
                              {apt.patientName}
                            </h4>
                            <p className="text-sm text-gray-600">{apt.reason}</p>
                          </div>

                          {/* Status & Action */}
                          <div className="flex items-center gap-3">
                            {apt.status === 'completed' && (
                              <CheckCircle2 className="h-5 w-5 text-green-600" />
                            )}

                            {lastConsultation && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => navigate(`/consultation/${lastConsultation.id}`)}
                                className="h-9 text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                              >
                                <FileText className="h-4 w-4 mr-1.5" />
                                Ver nota
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
