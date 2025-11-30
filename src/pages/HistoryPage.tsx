import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Search, Filter, FileText, LayoutGrid, LayoutList, X, Stethoscope, Brain, TrendingUp, Clock, Sparkles, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppStore } from '@/stores/appStore';
import { getContextConfig } from '@/lib/contextConfig';
import { getPatientAvatar } from '@/lib/utils';

type ViewMode = 'grid' | 'list';
type DateFilter = 'all' | 'today' | 'week' | 'month' | 'quarter' | 'year';

export function HistoryPage() {
  const navigate = useNavigate();
  const { consultations, patients, appContext } = useAppStore();
  const config = getContextConfig(appContext);

  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [diagnosisFilter, setDiagnosisFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  // Get unique diagnoses for filter
  const uniqueDiagnoses = useMemo(() => {
    const diagnoses = new Set<string>();
    consultations.forEach(c => {
      c.aiSuggestions?.diagnosesMostLikely?.forEach(d => diagnoses.add(d));
    });
    return Array.from(diagnoses).sort();
  }, [consultations]);

  // Filter consultations
  const filteredConsultations = useMemo(() => {
    return consultations.filter(consultation => {
      const patient = patients.find(p => p.id === consultation.patientId);
      if (!patient) return false;

      // Search filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || (
        patient.name.toLowerCase().includes(searchLower) ||
        consultation.doctorNotes?.toLowerCase().includes(searchLower) ||
        new Date(consultation.startedAt).toLocaleDateString('pt-BR').includes(searchLower)
      );

      // Date filter
      const consultationDate = new Date(consultation.startedAt);
      const now = new Date();
      let matchesDate = true;

      if (dateFilter === 'today') {
        matchesDate = consultationDate.toDateString() === now.toDateString();
      } else if (dateFilter === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        matchesDate = consultationDate >= weekAgo;
      } else if (dateFilter === 'month') {
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        matchesDate = consultationDate >= monthAgo;
      } else if (dateFilter === 'quarter') {
        const quarterAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        matchesDate = consultationDate >= quarterAgo;
      } else if (dateFilter === 'year') {
        const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        matchesDate = consultationDate >= yearAgo;
      }

      // Diagnosis filter
      const matchesDiagnosis = diagnosisFilter === 'all' ||
        consultation.aiSuggestions?.diagnosesMostLikely?.includes(diagnosisFilter);

      return matchesSearch && matchesDate && matchesDiagnosis;
    });
  }, [consultations, patients, searchTerm, dateFilter, diagnosisFilter]);

  const formatDuration = (startedAt: string, finishedAt?: string) => {
    if (!finishedAt) return 'Em andamento';
    const start = new Date(startedAt);
    const end = new Date(finishedAt);
    const diff = Math.floor((end.getTime() - start.getTime()) / 60000);
    return `${diff} min`;
  };

  const activeFiltersCount = [
    dateFilter !== 'all',
    diagnosisFilter !== 'all',
  ].filter(Boolean).length;

  // Calculate stats
  const completedConsultations = consultations.filter(c => c.status === 'finished').length;
  const avgDuration = consultations.length > 0
    ? Math.round(consultations.reduce((acc, c) => {
      if (!c.finishedAt) return acc;
      const diff = Math.floor((new Date(c.finishedAt).getTime() - new Date(c.startedAt).getTime()) / 60000);
      return acc + diff;
    }, 0) / completedConsultations)
    : 0;

  const stats = [
    {
      title: 'Total',
      value: consultations.length.toString(),
      icon: FileText,
      description: 'consultas',
      gradient: 'from-[#8C00FF] to-[#450693]',
      iconBg: 'bg-[#8C00FF]',
    },
    {
      title: 'Encontradas',
      value: filteredConsultations.length.toString(),
      icon: Search,
      description: 'nos filtros',
      gradient: 'from-[#FF3F7F] to-[#FF1654]',
      iconBg: 'bg-[#FF3F7F]',
    },
    {
      title: 'Concluídas',
      value: completedConsultations.toString(),
      icon: TrendingUp,
      description: 'finalizadas',
      gradient: 'from-[#00D9A5] to-[#00B386]',
      iconBg: 'bg-[#00D9A5]',
    },
    {
      title: 'Duração Média',
      value: `${avgDuration}min`,
      icon: Clock,
      description: 'por consulta',
      gradient: 'from-[#FFC400] to-[#FF9500]',
      iconBg: 'bg-[#FFC400]',
    },
  ];

  return (
    <AppLayout>
      <div className="min-h-full space-y-6">
        {/* Hero Section - Compact */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#450693] via-[#8C00FF] to-[#FF3F7F] p-6 md:p-8 shadow-2xl"
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
                Histórico Completo
              </Badge>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-3xl md:text-4xl font-black text-white tracking-tight mb-2"
            >
              {config.historyTitle}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-white/90 font-medium max-w-2xl"
            >
              {filteredConsultations.length} de {consultations.length} {consultations.length === 1 ? config.consultationLabel.toLowerCase() : config.consultationLabelPlural.toLowerCase()} • {completedConsultations} concluídas
            </motion.p>
          </div>
        </motion.div>

        {/* Stats Grid - Compact */}
        <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.05 }}
            >
              <Card className="relative overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 group">
                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5`} />

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

        {/* Controls Bar - Compact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col lg:flex-row gap-3"
        >
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder={config.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10 border-gray-200 rounded-xl focus-visible:border-[#8C00FF] focus-visible:ring-2 focus-visible:ring-[#8C00FF]/20"
            />
          </div>

          {/* View Toggle */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode('grid')}
              className={`h-8 px-3 rounded-lg transition-all ${
                viewMode === 'grid'
                  ? 'bg-white shadow-sm text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <LayoutGrid className="h-4 w-4 mr-1.5" />
              Grade
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode('list')}
              className={`h-8 px-3 rounded-lg transition-all ${
                viewMode === 'list'
                  ? 'bg-white shadow-sm text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <LayoutList className="h-4 w-4 mr-1.5" />
              Lista
            </Button>
          </div>

          {/* Filters Button */}
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className={`h-10 rounded-xl px-4 border-gray-200 ${
              showFilters
                ? 'border-[#8C00FF] bg-[#8C00FF]/5 text-[#8C00FF]'
                : 'hover:border-gray-300'
            }`}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtros
            {activeFiltersCount > 0 && (
              <Badge className="ml-2 h-5 w-5 rounded-full bg-[#8C00FF] text-white text-xs flex items-center justify-center p-0">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </motion.div>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="border-0 shadow-md rounded-2xl">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Filtros Avançados</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setDateFilter('all');
                        setDiagnosisFilter('all');
                      }}
                      className="h-8 text-gray-600 hover:text-red-600"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Limpar
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Date Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        Período
                      </label>
                      <Select value={dateFilter} onValueChange={(value) => setDateFilter(value as DateFilter)}>
                        <SelectTrigger className="h-10 border-gray-200 rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Todas as datas</SelectItem>
                          <SelectItem value="today">Hoje</SelectItem>
                          <SelectItem value="week">Última semana</SelectItem>
                          <SelectItem value="month">Último mês</SelectItem>
                          <SelectItem value="quarter">Último trimestre</SelectItem>
                          <SelectItem value="year">Último ano</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Diagnosis Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        {config.diagnosisLabel}
                      </label>
                      <Select value={diagnosisFilter} onValueChange={setDiagnosisFilter}>
                        <SelectTrigger className="h-10 border-gray-200 rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          <SelectItem value="all">Todos os {config.diagnosisLabelPlural.toLowerCase()}</SelectItem>
                          {uniqueDiagnoses.map(diagnosis => (
                            <SelectItem key={diagnosis} value={diagnosis}>
                              {diagnosis}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Lista de Consultas */}
        {filteredConsultations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-br from-[#8C00FF] to-[#450693] rounded-full blur-2xl opacity-20 animate-pulse"></div>
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-[#8C00FF] to-[#450693] flex items-center justify-center shadow-xl">
                <FileText className="h-12 w-12 text-white" />
              </div>
            </div>

            <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-[#450693] to-[#8C00FF] bg-clip-text text-transparent">
              Nenhuma {config.consultationLabel.toLowerCase()} encontrada
            </h3>

            <p className="text-gray-600 max-w-md mb-8 text-lg">
              Tente ajustar os filtros ou termos de busca
            </p>

            {(activeFiltersCount > 0 || searchTerm) && (
              <Button
                onClick={() => {
                  setDateFilter('all');
                  setDiagnosisFilter('all');
                  setSearchTerm('');
                }}
                className="bg-gradient-to-r from-[#8C00FF] to-[#450693] text-white shadow-lg hover:shadow-xl"
              >
                <X className="h-4 w-4 mr-2" />
                Limpar filtros
              </Button>
            )}
          </motion.div>
        ) : (
          <motion.div
            className={viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4' : 'space-y-3'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {filteredConsultations.map((consultation, index) => {
              const patient = patients.find(p => p.id === consultation.patientId);
              if (!patient) return null;

              const diagnosis = consultation.aiSuggestions?.diagnosesMostLikely?.[0] || `Sem ${config.diagnosisLabel.toLowerCase()}`;
              const notePreview = consultation.doctorNotes
                ? consultation.doctorNotes.substring(0, 100) + (consultation.doctorNotes.length > 100 ? '...' : '')
                : '';

              if (viewMode === 'list') {
                // Clean List View
                return (
                  <motion.div
                    key={consultation.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: Math.min(index * 0.01, 0.2) }}
                  >
                    <Card
                      className="group border-0 shadow-md hover:shadow-lg bg-white hover:border-[#8C00FF]/20 transition-all duration-200 cursor-pointer rounded-2xl"
                      onClick={() => navigate(`/consultation/${consultation.id}`)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          {/* Avatar */}
                          <img
                            src={getPatientAvatar(patient.name)}
                            alt={patient.name}
                            className="h-12 w-12 rounded-xl object-cover flex-shrink-0 ring-2 ring-white shadow-sm"
                          />

                          {/* Content Grid */}
                          <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                            {/* Patient */}
                            <div className="md:col-span-3">
                              <h3 className="font-semibold text-gray-900 truncate group-hover:text-[#8C00FF] transition-colors">
                                {patient.name}
                              </h3>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {patient.age} anos • {patient.gender === 'masculino' ? 'M' : 'F'}
                              </p>
                            </div>

                            {/* Date */}
                            <div className="md:col-span-2">
                              <p className="text-sm font-medium text-gray-700">
                                {new Date(consultation.startedAt).toLocaleDateString('pt-BR', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: '2-digit'
                                })}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {formatDuration(consultation.startedAt, consultation.finishedAt)}
                              </p>
                            </div>

                            {/* Diagnosis */}
                            <div className="md:col-span-4">
                              <div className="flex items-center gap-2">
                                {appContext === 'psychology' ? (
                                  <Brain className="h-3.5 w-3.5 text-[#8C00FF] flex-shrink-0" />
                                ) : (
                                  <Stethoscope className="h-3.5 w-3.5 text-[#8C00FF] flex-shrink-0" />
                                )}
                                <p className="text-sm text-gray-700 truncate font-medium">{diagnosis}</p>
                              </div>
                            </div>

                            {/* Note Preview */}
                            <div className="hidden lg:block md:col-span-2">
                              <p className="text-xs text-gray-500 truncate italic">
                                {notePreview}
                              </p>
                            </div>

                            {/* Action */}
                            <div className="md:col-span-1 flex items-center justify-end">
                              <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-[#8C00FF] group-hover:translate-x-1 transition-all flex-shrink-0" />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              }

              // Clean Grid Card View
              return (
                <motion.div
                  key={consultation.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.02, 0.3) }}
                >
                  <Card
                    className="group border-0 shadow-md hover:shadow-xl bg-white transition-all duration-200 cursor-pointer overflow-hidden rounded-2xl"
                    onClick={() => navigate(`/consultation/${consultation.id}`)}
                  >
                    <CardContent className="p-4">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2.5 flex-1 min-w-0">
                          <img
                            src={getPatientAvatar(patient.name)}
                            alt={patient.name}
                            className="h-12 w-12 rounded-xl object-cover flex-shrink-0 ring-2 ring-white shadow-sm"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 truncate group-hover:text-[#8C00FF] transition-colors">
                              {patient.name}
                            </h3>
                            <p className="text-xs text-gray-500">
                              {patient.age} anos • {patient.gender === 'masculino' ? 'M' : 'F'}
                            </p>
                          </div>
                        </div>
                        <Badge className="bg-green-100 text-green-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                          Concluída
                        </Badge>
                      </div>

                      {/* Info Grid */}
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Data</p>
                            <p className="text-sm font-semibold text-gray-900">
                              {new Date(consultation.startedAt).toLocaleDateString('pt-BR', {
                                day: '2-digit',
                                month: 'short'
                              })}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3.5 w-3.5 text-gray-400" />
                          <div>
                            <p className="text-xs text-gray-500">Duração</p>
                            <p className="text-sm font-semibold text-gray-900">
                              {formatDuration(consultation.startedAt, consultation.finishedAt)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Diagnosis */}
                      <div className="mb-3 p-3 bg-gradient-to-r from-[#8C00FF]/5 to-transparent rounded-xl">
                        <p className="text-xs text-gray-500 mb-1">{config.diagnosisLabel}</p>
                        <div className="flex items-center gap-2">
                          {appContext === 'psychology' ? (
                            <Brain className="h-3.5 w-3.5 text-[#8C00FF] flex-shrink-0" />
                          ) : (
                            <Stethoscope className="h-3.5 w-3.5 text-[#8C00FF] flex-shrink-0" />
                          )}
                          <p className="text-sm font-semibold text-gray-900 truncate">{diagnosis}</p>
                        </div>
                      </div>

                      {/* Note Preview */}
                      {notePreview && (
                        <div className="mb-3 p-3 bg-gray-50 rounded-xl">
                          <p className="text-xs text-gray-600 line-clamp-2 italic">
                            "{notePreview}"
                          </p>
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-end pt-3 border-t border-gray-100">
                        <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-400 group-hover:text-[#8C00FF] transition-colors">
                          Ver detalhes
                          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </AppLayout>
  );
}
