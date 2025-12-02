import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import {
  Stethoscope,
  Users,
  ArrowRight,
  PlayCircle,
  Clock,
  FileText,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useAppStore } from '@/stores/appStore';
import { useAppointmentStore } from '@/stores/appointmentStore';
import { initializeMockAppointments } from '@/lib/data/mockAppointments';
import { getPatientInitials, getInitialsColor, cn } from '@/lib/utils';
import type { Appointment } from '@/lib/types/appointment';
import { calculateTimeSaved } from '@/utils/metrics';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, startConsultation, patients, privacyMode, consultations } = useAppStore();
  const { appointments, addAppointment, clearAllAppointments } = useAppointmentStore();
  const [isInitialized, setIsInitialized] = useState(false);

  // Get today's date
  const today = useMemo(() => new Date().toLocaleDateString('en-CA'), []);
  // Use state for now to ensure it updates
  const [now] = useState(() => new Date());

  // Dynamic greeting
  const getGreeting = () => {
    const hour = now.getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  // Initialize mock data
  useEffect(() => {
    // Check if we need to reinitialize (version bump or empty)
    const APPOINTMENTS_VERSION = '2.0'; // Bump this to force refresh
    const currentVersion = localStorage.getItem('appointments-version');

    if (!isInitialized && (appointments.length === 0 || currentVersion !== APPOINTMENTS_VERSION)) {
      console.log('🔄 Reinitializing appointments...');
      clearAllAppointments();
      const mockAppointments = initializeMockAppointments(patients);
      console.log('📅 Generated appointments:', mockAppointments.length);
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

    console.log('🔍 DEBUG: Finding current patient...');
    console.log('Current time:', now.getHours() + ':' + now.getMinutes());
    console.log('Current minutes:', currentMinutes);
    console.log('Today appointments:', todayAppointments.length);
    console.log('Appointments:', todayAppointments.map(a => ({
      time: a.startTime,
      name: a.patientName,
      status: a.status
    })));

    const found = todayAppointments.find(apt => {
      if (apt.status === 'in-progress') return true;
      if (apt.status === 'completed' || apt.status === 'cancelled') return false;

      const [hours, minutes] = apt.startTime.split(':').map(Number);
      const aptMinutes = hours * 60 + minutes;
      const diff = Math.abs(aptMinutes - currentMinutes);

      console.log(`Checking ${apt.patientName} at ${apt.startTime}: aptMinutes=${aptMinutes}, diff=${diff}`);

      return diff <= 30;
    });

    console.log('✅ Current patient found:', found?.patientName || 'NONE');

    return found;
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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-foreground">
                {getGreeting()}, {user?.name || 'Dr. Luzzi'}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                {stats.completed} de {stats.total} pacientes atendidos hoje
              </p>
            </div>

            {stats.totalTimeSaved > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="hidden sm:flex items-center gap-3 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl px-5 py-3 shadow-sm"
              >
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium">Tempo Economizado Hoje</p>
                  <p className="text-xl font-bold text-green-700">{stats.totalTimeSaved.toFixed(1)} min</p>
                </div>
              </motion.div>
            )}
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
                      {currentPatient.status === 'in-progress' ? (
                        <>
                          <ArrowRight className="mr-1.5 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          Retomar
                        </>
                      ) : (
                        <>
                          <Stethoscope className="mr-1.5 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                          Abrir Copilot
                        </>
                      )}
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
            className="space-y-3"
          >
            <h3 className="text-base font-semibold text-foreground">Próximos</h3>

            {futureAppointments.map((apt, index) => {
              const initials = getPatientInitials(apt.patientName);
              const colors = getInitialsColor(apt.patientName);
              const lastConsultation = getLastConsultation(apt.patientId);

              return (
                <motion.div
                  key={apt.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * index }}
                >
                  <Card className="border border-gray-200 bg-white hover:shadow-sm transition-all">
                    <CardContent className="py-3 px-3 sm:px-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 w-full">
                          <div className="text-xs sm:text-sm font-mono font-bold text-muted-foreground min-w-[40px] sm:min-w-[45px]">
                            {apt.startTime}
                          </div>

                          <Avatar className={cn("h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0", colors.bg)}>
                            <AvatarFallback className={cn(colors.bg, colors.text, "font-medium text-xs sm:text-sm")}>
                              {initials}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0">
                            <h4 className={cn(
                              "text-sm sm:text-base font-medium text-foreground truncate",
                              privacyMode && "blur-md select-none"
                            )}>
                              {apt.patientName}
                            </h4>
                            <p className="text-xs sm:text-sm text-muted-foreground truncate">
                              {apt.reason}
                            </p>
                          </div>
                        </div>

                        <TooltipProvider delayDuration={0}>
                          <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0 w-full sm:w-auto">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => navigate('/history')}
                                  className="h-8 px-2 text-gray-700 hover:text-[#8C00FF] hover:bg-[#8C00FF]/10 transition-colors"
                                >
                                  <Clock className="h-3.5 w-3.5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="top" className="bg-gray-900 text-white border-gray-700">
                                <p>Ver histórico de consultas</p>
                              </TooltipContent>
                            </Tooltip>

                            {lastConsultation && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => navigate(`/consultation/${lastConsultation.id}`)}
                                    className="h-8 px-2 text-gray-700 hover:text-[#8C00FF] hover:bg-[#8C00FF]/10 transition-colors"
                                  >
                                    <FileText className="h-3.5 w-3.5" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="bg-gray-900 text-white border-gray-700">
                                  <p>Ver última consulta</p>
                                </TooltipContent>
                              </Tooltip>
                            )}

                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleStartConsultation(apt)}
                                  className="flex-1 sm:flex-none h-8 px-2 sm:px-3 text-xs sm:text-sm border-gray-300 text-gray-700 hover:border-[#8C00FF] hover:text-[#8C00FF] hover:bg-[#8C00FF]/10 transition-colors"
                                >
                                  <Stethoscope className="mr-1 sm:mr-1.5 h-3.5 w-3.5" />
                                  Iniciar
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="top" className="bg-gray-900 text-white border-gray-700">
                                <p>Iniciar atendimento</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                        </TooltipProvider>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Anteriores */}
        {pastAppointments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-3"
          >
            <h3 className="text-base font-semibold text-foreground">Anteriores</h3>

            {pastAppointments.map((apt, index) => {
              const initials = getPatientInitials(apt.patientName);
              const colors = getInitialsColor(apt.patientName);
              const lastConsultation = getLastConsultation(apt.patientId);

              return (
                <motion.div
                  key={apt.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * index }}
                >
                  <Card className="border border-gray-200 bg-white hover:shadow-sm transition-all opacity-60 hover:opacity-100">
                    <CardContent className="py-3 px-3 sm:px-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0 w-full">
                          <div className="text-xs sm:text-sm font-mono font-bold text-muted-foreground min-w-[40px] sm:min-w-[45px]">
                            {apt.startTime}
                          </div>

                          <Avatar className={cn("h-9 w-9 sm:h-10 sm:w-10 flex-shrink-0", colors.bg)}>
                            <AvatarFallback className={cn(colors.bg, colors.text, "font-medium text-xs sm:text-sm")}>
                              {initials}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0">
                            <h4 className={cn(
                              "text-sm sm:text-base font-medium text-foreground truncate",
                              privacyMode && "blur-md select-none"
                            )}>
                              {apt.patientName}
                            </h4>
                            <p className="text-xs sm:text-sm text-muted-foreground truncate">
                              {apt.reason}
                            </p>
                          </div>
                        </div>

                        <TooltipProvider delayDuration={0}>
                          <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0 w-full sm:w-auto">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => navigate('/history')}
                                  className="h-8 px-2 text-gray-700 hover:text-[#8C00FF] hover:bg-[#8C00FF]/10 transition-colors"
                                >
                                  <Clock className="h-3.5 w-3.5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent side="top" className="bg-gray-900 text-white border-gray-700">
                                <p>Ver histórico de consultas</p>
                              </TooltipContent>
                            </Tooltip>

                            {lastConsultation && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => navigate(`/consultation/${lastConsultation.id}`)}
                                    className="h-8 px-2 text-gray-700 hover:text-[#8C00FF] hover:bg-[#8C00FF]/10 transition-colors"
                                  >
                                    <FileText className="h-3.5 w-3.5" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="bg-gray-900 text-white border-gray-700">
                                  <p>Ver última consulta</p>
                                </TooltipContent>
                              </Tooltip>
                            )}

                            {apt.status !== 'completed' && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleStartConsultation(apt)}
                                    className="flex-1 sm:flex-none h-8 px-2 sm:px-3 text-xs sm:text-sm border-gray-300 text-gray-700 hover:border-[#8C00FF] hover:text-[#8C00FF] hover:bg-[#8C00FF]/10 transition-colors"
                                  >
                                    <PlayCircle className="mr-1 sm:mr-1.5 h-3.5 w-3.5" />
                                    Iniciar
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="bg-gray-900 text-white border-gray-700">
                                  <p>Iniciar atendimento</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                        </TooltipProvider>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
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
