import { useNavigate } from 'react-router-dom';
import { Stethoscope, Users, Settings, Activity, Calendar, TrendingUp, ArrowRight, Sparkles, Clock, CheckCircle2, Brain } from 'lucide-react';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/stores/appStore';
import { getContextConfig } from '@/lib/contextConfig';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, patients, consultations, appContext } = useAppStore();
  const config = getContextConfig(appContext);

  const stats = [
    {
      title: `Total de ${config.patientLabelPlural}`,
      value: patients.length.toString(),
      icon: Users,
      description: '+12% vs. mês passado',
      trend: '+12%',
      gradient: 'from-[#8C00FF] to-[#450693]',
      bgGlow: 'bg-[#8C00FF]/10',
      iconBg: 'bg-gradient-to-br from-[#8C00FF] to-[#450693]',
    },
    {
      title: `${config.consultationLabelPlural} Hoje`,
      value: '0',
      icon: Calendar,
      description: 'Nenhuma agendada',
      trend: '0',
      gradient: 'from-[#FF3F7F] to-[#FF1654]',
      bgGlow: 'bg-[#FF3F7F]/10',
      iconBg: 'bg-gradient-to-br from-[#FF3F7F] to-[#FF1654]',
    },
    {
      title: `${config.consultationLabelPlural} Totais`,
      value: consultations.length.toString(),
      icon: Activity,
      description: 'Total registrado',
      trend: consultations.length > 0 ? '+' + consultations.length : '0',
      gradient: 'from-[#FFC400] to-[#FF9500]',
      bgGlow: 'bg-[#FFC400]/10',
      iconBg: 'bg-gradient-to-br from-[#FFC400] to-[#FF9500]',
    },
  ];

  const quickActions = [
    {
      title: `Nova ${config.consultationLabel}`,
      description: 'Iniciar atendimento com IA',
      icon: appContext === 'psychology' ? Brain : Stethoscope,
      onClick: () => navigate('/consultation'),
      gradient: 'from-[#8C00FF] to-[#450693]',
      glowColor: 'shadow-[#8C00FF]/30',
    },
    {
      title: `Meus ${config.patientLabelPlural}`,
      description: 'Gerenciar cadastros',
      icon: Users,
      onClick: () => navigate('/patients'),
      gradient: 'from-[#FF3F7F] to-[#FF1654]',
      glowColor: 'shadow-[#FF3F7F]/30',
    },
    {
      title: 'Configurações',
      description: 'Personalizar sistema',
      icon: Settings,
      onClick: () => navigate('/settings'),
      gradient: 'from-[#FFC400] to-[#FF9500]',
      glowColor: 'shadow-[#FFC400]/30',
    },
  ];

  return (
    <AppLayout>
      <div className="min-h-full space-y-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#450693] via-[#8C00FF] to-[#FF3F7F] p-4 md:p-5 shadow-lg"
        >
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMCA0MGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6bS0yMC0yMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>

          <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
            <div className="space-y-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-1.5"
              >
                <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm px-2 py-0.5 text-[10px]">
                  <Sparkles className="h-2.5 w-2.5 mr-0.5" />
                  AI-Powered
                </Badge>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl md:text-2xl font-bold text-white"
              >
                Olá, {user?.name?.split(' ')[0]}! 👋
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xs md:text-sm text-white/90"
              >
                {appContext === 'psychology'
                  ? 'Seu assistente psicológico inteligente está pronto para ajudar'
                  : 'Seu assistente médico inteligente está pronto para ajudar'}
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Button
                onClick={() => navigate('/consultation')}
                className="bg-white text-[#450693] hover:bg-white/90 shadow-lg px-4 py-2 h-auto text-sm font-semibold"
              >
                {appContext === 'psychology' ? (
                  <Brain className="mr-1.5 h-4 w-4" />
                ) : (
                  <Stethoscope className="mr-1.5 h-4 w-4" />
                )}
                {config.startConsultationAction}
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <Card className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />

                <CardContent className="p-6 relative">
                  <div className="flex items-start justify-between mb-6">
                    <div className={`p-4 rounded-2xl ${stat.iconBg} shadow-lg`}>
                      <stat.icon className="h-7 w-7 text-white" />
                    </div>
                    <Badge className="bg-green-100 text-green-700 border-0 font-semibold">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {stat.trend}
                    </Badge>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </p>
                    <p className="text-4xl font-bold text-gray-900">
                      {stat.value}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {stat.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-[#450693] to-[#8C00FF] bg-clip-text text-transparent">
              Ações Rápidas
            </h2>
            <Sparkles className="h-6 w-6 text-[#8C00FF] animate-pulse" />
          </div>

          <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                whileHover={{ scale: 1.03, y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card
                  className={`cursor-pointer border-0 shadow-lg hover:shadow-2xl ${action.glowColor} transition-all duration-300 group overflow-hidden relative h-full`}
                  onClick={action.onClick}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                  <CardContent className="p-6 relative z-10">
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${action.gradient} shadow-xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <action.icon className="h-8 w-8 text-white" />
                    </div>

                    <CardTitle className="text-xl font-bold mb-2 group-hover:text-white transition-colors">
                      {action.title}
                    </CardTitle>

                    <CardDescription className="text-gray-600 group-hover:text-white/90 transition-colors flex items-center justify-between">
                      <span>{action.description}</span>
                      <ArrowRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all" />
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Consultations */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-[#450693] to-[#FF3F7F] bg-clip-text text-transparent">
              Consultas Recentes
            </h2>
            {consultations.length > 0 && (
              <Button
                onClick={() => navigate('/history')}
                variant="outline"
                className="border-[#8C00FF] text-[#8C00FF] hover:bg-[#8C00FF] hover:text-white"
              >
                Ver todas
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>

          <Card className="border-0 shadow-xl overflow-hidden">
            <CardContent className="p-6">
              {consultations.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-16 text-center"
                >
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#8C00FF] to-[#450693] rounded-full blur-2xl opacity-20 animate-pulse"></div>
                    <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-[#8C00FF] to-[#450693] flex items-center justify-center shadow-xl">
                      <Activity className="h-12 w-12 text-white" />
                    </div>
                  </div>

                  <p className="text-2xl font-bold mb-3 bg-gradient-to-r from-[#450693] to-[#8C00FF] bg-clip-text text-transparent">
                    Nenhuma consulta ainda
                  </p>

                  <p className="text-gray-600 max-w-md mb-8 text-lg">
                    Comece sua primeira consulta e deixe a IA ajudar no diagnóstico
                  </p>

                  <Button
                    onClick={() => navigate('/consultation')}
                    size="lg"
                    className="bg-gradient-to-r from-[#8C00FF] to-[#450693] text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 px-8 py-6 h-auto text-lg"
                  >
                    <Stethoscope className="mr-2 h-6 w-6" />
                    Iniciar Primeira Consulta
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  {consultations.slice(0, 5).map((consultation, index) => (
                    <motion.div
                      key={consultation.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-5 rounded-2xl border-2 border-gray-100 hover:border-[#8C00FF]/30 hover:bg-gradient-to-r hover:from-[#8C00FF]/5 hover:to-transparent hover:shadow-lg transition-all duration-300 group cursor-pointer"
                      onClick={() => navigate(`/consultation/${consultation.id}`)}
                    >
                      <div className="flex items-center gap-4 min-w-0 flex-1">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#8C00FF] to-[#450693] flex items-center justify-center text-white font-bold text-xl shadow-lg flex-shrink-0 group-hover:scale-110 transition-transform">
                          {patients.find(p => p.id === consultation.patientId)?.name?.charAt(0) || 'P'}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-lg truncate text-gray-900 group-hover:text-[#8C00FF] transition-colors">
                            {patients.find(p => p.id === consultation.patientId)?.name || 'Paciente'}
                          </p>
                          <p className="text-sm text-gray-500 flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            {consultation.startedAt ? new Date(consultation.startedAt).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric'
                            }) : 'Data não disponível'}
                          </p>
                        </div>
                      </div>

                      <div className="opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <Badge className="bg-gradient-to-r from-[#8C00FF] to-[#450693] text-white border-0 px-4 py-2">
                          Ver detalhes
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default DashboardPage;
