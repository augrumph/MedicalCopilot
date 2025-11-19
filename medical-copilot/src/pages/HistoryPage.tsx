import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, User, ArrowRight, Search, Filter, FileText, Clock, CheckCircle2, LayoutGrid, LayoutList, X, Stethoscope, Brain, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppStore } from '@/stores/appStore';
import { getContextConfig } from '@/lib/contextConfig';
import { psychologyPatients, psychologySessions } from '@/lib/psychologyMockData';

type ViewMode = 'grid' | 'list';
type DateFilter = 'all' | 'today' | 'week' | 'month' | 'quarter' | 'year';

export function HistoryPage() {
  const navigate = useNavigate();
  const { consultations: medicalConsultations, patients: medicalPatients, appContext } = useAppStore();
  const config = getContextConfig(appContext);

  // Use dados específicos baseado no contexto
  const consultations = appContext === 'psychology' ? psychologySessions : medicalConsultations;
  const patients = appContext === 'psychology' ? psychologyPatients : medicalPatients;

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

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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

  const getDateFilterLabel = (filter: DateFilter) => {
    const labels = {
      all: 'Todas as datas',
      today: 'Hoje',
      week: 'Última semana',
      month: 'Último mês',
      quarter: 'Último trimestre',
      year: 'Último ano'
    };
    return labels[filter];
  };

  return (
    <AppLayout title={config.historyTitle} description={config.historyDescription}>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-200"
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {config.historyTitle}
            </h1>
            <p className="text-gray-600">
              {filteredConsultations.length} de {consultations.length} {consultations.length === 1 ? config.consultationLabel.toLowerCase() : config.consultationLabelPlural.toLowerCase()}
            </p>
          </div>

          <div className="flex gap-4">
            <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200">
              <div className="h-10 w-10 rounded-lg bg-[#8C00FF]/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-[#8C00FF]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{filteredConsultations.length}</p>
                <p className="text-xs text-gray-500">Encontradas</p>
              </div>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200">
              <div className="h-10 w-10 rounded-lg bg-[#8C00FF]/10 flex items-center justify-center">
                <FileText className="h-5 w-5 text-[#8C00FF]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{consultations.length}</p>
                <p className="text-xs text-gray-500">Total</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Controls Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
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
              className="pl-10 h-10 border-gray-300 rounded-lg focus-visible:border-[#8C00FF] focus-visible:ring-2 focus-visible:ring-[#8C00FF]/20"
            />
          </div>

          {/* View Toggle */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setViewMode('grid')}
              className={`h-8 px-3 rounded-md transition-all ${
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
              className={`h-8 px-3 rounded-md transition-all ${
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
            className={`h-10 rounded-lg px-4 ${
              showFilters
                ? 'border-[#8C00FF] bg-[#8C00FF]/5 text-[#8C00FF]'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtros
            {activeFiltersCount > 0 && (
              <span className="ml-2 h-5 w-5 rounded-full bg-[#8C00FF] text-white text-xs flex items-center justify-center">
                {activeFiltersCount}
              </span>
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
              transition={{ duration: 0.15 }}
            >
              <Card className="border border-gray-200 rounded-xl">
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900">Filtros</h3>
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
                        <SelectTrigger className="h-10 border-gray-300 rounded-lg">
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
                        <SelectTrigger className="h-10 border-gray-300 rounded-lg">
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col items-center justify-center py-16 text-center"
          >
            <div className="h-20 w-20 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
              <FileText className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Nenhuma {config.consultationLabel.toLowerCase()} encontrada
            </h3>
            <p className="text-sm text-gray-500 mb-4 max-w-sm">
              Tente ajustar os filtros ou termos de busca
            </p>
            {(activeFiltersCount > 0 || searchTerm) && (
              <Button
                variant="outline"
                onClick={() => {
                  setDateFilter('all');
                  setDiagnosisFilter('all');
                  setSearchTerm('');
                }}
                className="border-gray-300"
              >
                <X className="h-4 w-4 mr-2" />
                Limpar filtros
              </Button>
            )}
          </motion.div>
        ) : (
          <motion.div
            className={viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4' : 'space-y-2'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
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
                      className="group border border-gray-200 hover:border-[#8C00FF] bg-white hover:shadow-md transition-all duration-200 cursor-pointer rounded-lg"
                      onClick={() => navigate(`/consultation/${consultation.id}`)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-4">
                          {/* Avatar */}
                          <div className="h-11 w-11 rounded-lg bg-gradient-to-br from-[#8C00FF] to-[#6B00CC] flex items-center justify-center text-white font-semibold flex-shrink-0">
                            {patient.name?.charAt(0) || 'P'}
                          </div>

                          {/* Content Grid */}
                          <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                            {/* Patient */}
                            <div className="md:col-span-3">
                              <h3 className="font-medium text-gray-900 truncate group-hover:text-[#8C00FF] transition-colors">
                                {patient.name}
                              </h3>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {patient.age} anos • {patient.gender === 'masculino' ? 'M' : 'F'}
                              </p>
                            </div>

                            {/* Date */}
                            <div className="md:col-span-2">
                              <p className="text-sm text-gray-700">
                                {new Date(consultation.startedAt).toLocaleDateString('pt-BR', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {formatDuration(consultation.startedAt, consultation.finishedAt)}
                              </p>
                            </div>

                            {/* Diagnosis */}
                            <div className="md:col-span-4">
                              <div className="flex items-center gap-2" title={`${config.diagnosisLabel}: ${diagnosis}`}>
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

                            {/* Status & Action */}
                            <div className="md:col-span-1 flex items-center justify-end gap-2">
                              <div className="h-2 w-2 rounded-full bg-green-500 flex-shrink-0" />
                              <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-[#8C00FF] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              }

              // Clean Grid Card View (Default)
              return (
                <motion.div
                  key={consultation.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.02, 0.3) }}
                >
                  <Card
                    className="group border border-gray-200 hover:border-[#8C00FF] bg-white hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden rounded-lg"
                    onClick={() => navigate(`/consultation/${consultation.id}`)}
                  >
                    <CardContent className="p-4">
                      {/* Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2.5 flex-1 min-w-0">
                          <div className="h-11 w-11 rounded-lg bg-gradient-to-br from-[#8C00FF] to-[#6B00CC] flex items-center justify-center text-white font-semibold flex-shrink-0">
                            {patient.name?.charAt(0) || 'P'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate group-hover:text-[#8C00FF] transition-colors">
                              {patient.name}
                            </h3>
                            <p className="text-xs text-gray-500">
                              {patient.age} anos • {patient.gender === 'masculino' ? 'M' : 'F'}
                            </p>
                          </div>
                        </div>
                        <div className="h-5 w-5 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
                          <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                        </div>
                      </div>

                      {/* Info Grid */}
                      <div className="grid grid-cols-2 gap-2.5 mb-3">
                        <div>
                          <p className="text-xs text-gray-500 mb-0.5">Data</p>
                          <p className="text-sm font-medium text-gray-900">
                            {new Date(consultation.startedAt).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: 'short',
                              year: '2-digit'
                            })}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-0.5">Duração</p>
                          <p className="text-sm font-medium text-gray-900">
                            {formatDuration(consultation.startedAt, consultation.finishedAt)}
                          </p>
                        </div>
                      </div>

                      {/* Diagnosis */}
                      <div className="mb-3">
                        <p className="text-xs text-gray-500 mb-1">{config.diagnosisLabel}</p>
                        <div className="flex items-center gap-2">
                          {appContext === 'psychology' ? (
                            <Brain className="h-3.5 w-3.5 text-[#8C00FF] flex-shrink-0" />
                          ) : (
                            <Stethoscope className="h-3.5 w-3.5 text-[#8C00FF] flex-shrink-0" />
                          )}
                          <p className="text-sm font-medium text-gray-900 truncate">{diagnosis}</p>
                        </div>
                      </div>

                      {/* Note Preview */}
                      {notePreview && (
                        <div className="mb-3 p-2.5 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-600 line-clamp-2">
                            {notePreview}
                          </p>
                        </div>
                      )}

                      {/* Footer */}
                      <div className="flex items-center justify-end pt-2.5 border-t border-gray-100">
                        <div className="flex items-center gap-1.5 text-sm font-medium text-gray-400 group-hover:text-[#8C00FF] transition-colors">
                          Ver detalhes
                          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
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
