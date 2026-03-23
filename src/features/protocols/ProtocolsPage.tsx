import { useEffect, useState, useCallback, useDeferredValue, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Search,
  X,
  Play,
  Clock,
  AlertCircle,
  Tag,
  Zap,
  BookOpen,
  Sparkles,
  Filter,
  FileCheck,
  Stethoscope,
  Heart,
  Brain,
  Baby,
  Activity,
  Bone,
  Eye,
  Thermometer,
  Syringe,
  FlaskConical,
  Scan,
  ShieldPlus,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import { useProtocolsStore } from './store/protocolsStore';
import { ProtocolPlayer } from './components/player/ProtocolPlayer';
import { useProtocolFilters } from './hooks/useProtocolFilters';
import { getTriageInfo } from './utils/protocolHelpers';
import { Protocol, TriageColor } from './types';

const TRIAGE_TYPES = [
  {
    id: 'RED' as TriageColor,
    label: 'Emergência',
    bgColor: 'bg-red-600',
    borderColor: 'border-red-200',
    textColor: 'text-red-700',
    description: 'Atendimento imediato',
  },
  {
    id: 'ORANGE' as TriageColor,
    label: 'Muito Urgente',
    bgColor: 'bg-orange-500',
    borderColor: 'border-orange-200',
    textColor: 'text-orange-700',
    description: '< 10 minutos',
  },
  {
    id: 'YELLOW' as TriageColor,
    label: 'Urgente',
    bgColor: 'bg-amber-400',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-700',
    description: '< 60 minutos',
  },
  {
    id: 'GREEN' as TriageColor,
    label: 'Pouco Urgente',
    bgColor: 'bg-emerald-500',
    borderColor: 'border-emerald-200',
    textColor: 'text-emerald-700',
    description: '< 120 minutos',
  },
  {
    id: 'BLUE' as TriageColor,
    label: 'Não Urgente',
    bgColor: 'bg-blue-500',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700',
    description: '< 240 minutos',
  },
];

// Mapeamento de ícones por especialidade
const SPECIALTY_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  'Cardiologia': Heart,
  'Neurologia': Brain,
  'Pediatria': Baby,
  'Clínica Médica': Stethoscope,
  'Emergência': Activity,
  'UTI': Activity,
  'Ortopedia': Bone,
  'Oftalmologia': Eye,
  'Infectologia': Thermometer,
  'Endocrinologia': FlaskConical,
  'Pneumologia': Scan,
  'Oncologia': ShieldPlus,
  'Cirurgia': Syringe,
  'Gastroenterologia': FlaskConical,
  'Nefrologia': FlaskConical,
  'Reumatologia': Bone,
  'Hematologia': Syringe,
  'Ginecologia': Baby,
  'Obstetrícia': Baby,
  'Psiquiatria': Brain,
  'Dermatologia': Eye,
  'Urologia': FlaskConical,
  'Otorrinolaringologia': Eye,
};

function getSpecialtyIcon(specialty: string): React.ComponentType<{ className?: string }> {
  // Try exact match first
  if (SPECIALTY_ICON_MAP[specialty]) return SPECIALTY_ICON_MAP[specialty];
  // Try partial match
  const lc = specialty.toLowerCase();
  if (lc.includes('cardio') || lc.includes('coração')) return Heart;
  if (lc.includes('neuro') || lc.includes('psiqui')) return Brain;
  if (lc.includes('pedi') || lc.includes('neonat') || lc.includes('obstet') || lc.includes('gineco')) return Baby;
  if (lc.includes('emergen') || lc.includes('uti') || lc.includes('intensi')) return Activity;
  if (lc.includes('ortop') || lc.includes('reumato') || lc.includes('traumato')) return Bone;
  if (lc.includes('oftalmo') || lc.includes('dermato') || lc.includes('otorri')) return Eye;
  if (lc.includes('infecto') || lc.includes('endocrino') || lc.includes('febr')) return Thermometer;
  if (lc.includes('onco') || lc.includes('hemato') || lc.includes('imuno')) return ShieldPlus;
  if (lc.includes('gastro') || lc.includes('nefro') || lc.includes('uro') || lc.includes('pulmo') || lc.includes('pneumo')) return FlaskConical;
  if (lc.includes('cirurg')) return Syringe;
  return Stethoscope;
}

// Paleta de cores para especialidades
const SPECIALTY_COLOR_PALETTE = [
  'from-purple-50 to-purple-100/60 border-purple-200 text-purple-700',
  'from-blue-50 to-blue-100/60 border-blue-200 text-blue-700',
  'from-emerald-50 to-emerald-100/60 border-emerald-200 text-emerald-700',
  'from-rose-50 to-rose-100/60 border-rose-200 text-rose-700',
  'from-amber-50 to-amber-100/60 border-amber-200 text-amber-700',
  'from-cyan-50 to-cyan-100/60 border-cyan-200 text-cyan-700',
  'from-indigo-50 to-indigo-100/60 border-indigo-200 text-indigo-700',
  'from-teal-50 to-teal-100/60 border-teal-200 text-teal-700',
  'from-orange-50 to-orange-100/60 border-orange-200 text-orange-700',
  'from-pink-50 to-pink-100/60 border-pink-200 text-pink-700',
  'from-lime-50 to-lime-100/60 border-lime-200 text-lime-700',
  'from-violet-50 to-violet-100/60 border-violet-200 text-violet-700',
];

export function ProtocolsPage() {
  const { protocols, isLoading, fetchProtocols, startProtocol, activeProtocol, resetProtocol } =
    useProtocolsStore();
  const [showPlayer, setShowPlayer] = useState(false);

  // Input state (instant update)
  const [searchInput, setSearchInput] = useState('');
  // Deferred value: only triggers filter recalc after React finishes rendering input update
  const deferredSearch = useDeferredValue(searchInput);

  const {
    filters,
    filteredProtocols,
    specialties,
    hasActiveFilters,
    setSearchTerm,
    setSpecialty,
    toggleTriageColor,
    setTargetAudience,
    clearFilters,
  } = useProtocolFilters(protocols);

  // Sync deferred search to the filter hook
  useEffect(() => {
    setSearchTerm(deferredSearch);
  }, [deferredSearch, setSearchTerm]);

  useEffect(() => {
    fetchProtocols();
  }, [fetchProtocols]);

  // Emergency protocols (RED + ORANGE)
  const emergencyProtocols = protocols
    .filter((p) => p.triageColor === 'RED' || p.triageColor === 'ORANGE')
    .sort((a, b) => {
      if (a.triageColor === 'RED' && b.triageColor === 'ORANGE') return -1;
      if (a.triageColor === 'ORANGE' && b.triageColor === 'RED') return 1;
      return a.title.localeCompare(b.title);
    });

  const handleStartProtocol = useCallback(async (protocolId: string) => {
    await startProtocol(protocolId);
    setShowPlayer(true);
  }, [startProtocol]);

  const handleExitPlayer = useCallback(() => {
    resetProtocol();
    setShowPlayer(false);
  }, [resetProtocol]);

  const handleClearAll = useCallback(() => {
    setSearchInput('');
    clearFilters();
  }, [clearFilters]);

  const combinedHasFilters = hasActiveFilters || searchInput !== '';

  // Contagem de protocolos por especialidade (para o seletor)
  const specialtyCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const p of protocols) {
      map[p.specialty] = (map[p.specialty] ?? 0) + 1;
    }
    return map;
  }, [protocols]);

  if (showPlayer && activeProtocol) {
    return <ProtocolPlayer onExit={handleExitPlayer} />;
  }

  if (isLoading) {
    return (
      <AppLayout title="Protocolos Clínicos" description="Baseados em evidências científicas">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-[#512B81] mx-auto mb-3" />
            <p className="text-sm text-slate-400 font-medium">Carregando protocolos...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Protocolos Clínicos" description="Baseados em evidências científicas">
      <div className="space-y-8">
        {/* Hero Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Disponível', value: protocols.length, icon: BookOpen, iconColor: 'text-[#512B81]' },
            { 
              label: 'Nacionais (Brasil)', 
              value: protocols.filter(p => p.isBrazilian).length, 
              icon: Sparkles, 
              iconColor: 'text-blue-600' 
            },
            { 
              label: 'Auditados (Evidência)', 
              value: protocols.filter(p => p.lastAuditDate).length, 
              icon: FileCheck, 
              iconColor: 'text-green-600' 
            },
            { label: 'Emergências', value: emergencyProtocols.length, icon: Zap, iconColor: 'text-red-600' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-effect rounded-[2rem] p-6 border border-white/20"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-white shadow-inner flex items-center justify-center border border-slate-100 flex-shrink-0">
                  <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-primary/40 mb-1 leading-none">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-black text-primary">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.24 }}
          className="glass-effect rounded-[2rem] p-8 border border-white/20"
        >
          <div className="flex items-center gap-2 mb-6">
            <Search className="h-4 w-4 text-[#512B81]" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40">
              Buscar Protocolo
            </span>
          </div>
          <div className="relative">
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Digite o nome, sintomas, tags ou código CID-10..."
              className="h-14 px-6 text-base rounded-2xl border-2 border-slate-100 focus:border-[#512B81]/20 bg-white"
            />
            {searchInput && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchInput('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 rounded-xl"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </motion.div>

        {/* Filtros */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32 }}
          className="glass-effect rounded-[2rem] p-8 border border-white/20 space-y-8"
        >
          {/* Triagem Manchester — multi-select */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-4 w-4 text-[#512B81]" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40">
                Classificação de Risco (Manchester)
              </span>
            </div>
            <div className="flex flex-wrap gap-3">
              {TRIAGE_TYPES.map((triage) => {
                const isActive = filters.triageColors.includes(triage.id);
                return (
                  <button
                    key={triage.id}
                    onClick={() => toggleTriageColor(triage.id)}
                    className={`
                      group flex items-center gap-3 px-5 py-3 rounded-2xl border transition-all duration-200 select-none
                      ${isActive
                        ? `${triage.bgColor} border-transparent shadow-lg scale-105`
                        : `bg-white ${triage.borderColor} hover:border-primary/20 hover:bg-slate-50`
                      }
                    `}
                  >
                    <div
                      className={`w-3 h-3 rounded-full shadow-sm ${isActive ? 'bg-white' : triage.bgColor}`}
                    />
                    <div className="flex flex-col items-start">
                      <span className={`text-[10px] font-black uppercase tracking-wider ${isActive ? 'text-white' : triage.textColor}`}>
                        {triage.label}
                      </span>
                      <span className={`text-[9px] font-medium ${isActive ? 'text-white/80' : 'text-slate-500'}`}>
                        {triage.description}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Especialidades — só aparece quando uma já está selecionada (trocar especialidade) */}
          {filters.specialty && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Filter className="h-4 w-4 text-[#512B81]" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40">
                  Trocar Especialidade
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {specialties.map((specialty) => {
                  const isActive = filters.specialty === specialty;
                  return (
                    <button
                      key={specialty}
                      onClick={() => setSpecialty(isActive ? null : specialty)}
                      className={`
                        px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 select-none
                        ${isActive
                          ? 'bg-primary text-white shadow-md'
                          : 'bg-white text-primary/60 border border-slate-200 hover:border-primary/20 hover:bg-slate-50'
                        }
                      `}
                    >
                      {specialty}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Público-Alvo */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-4 w-4 text-[#512B81]" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/40">
                Público-Alvo
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {(['ADULT', 'PEDIATRIC', 'PREGNANT'] as const).map((audience) => {
                const labels = { ADULT: 'Adultos', PEDIATRIC: 'Pediátrico', PREGNANT: 'Gestantes' };
                const isActive = filters.targetAudience === audience;
                return (
                  <button
                    key={audience}
                    onClick={() => setTargetAudience(isActive ? null : audience)}
                    className={`
                      px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 select-none
                      ${isActive
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-white text-primary/60 border border-slate-200 hover:border-primary/20 hover:bg-slate-50'
                      }
                    `}
                  >
                    {labels[audience]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Limpar filtros */}
          {combinedHasFilters && (
            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                onClick={handleClearAll}
                className="px-4 py-2 rounded-xl bg-primary/5 text-primary/60 hover:text-primary text-xs font-black uppercase tracking-widest transition-colors"
              >
                Limpar Filtros
              </button>
            </div>
          )}
        </motion.div>

        {/* Emergency Shortcuts */}
        {emergencyProtocols.length > 0 && !combinedHasFilters && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Zap className="h-5 w-5 text-red-600" />
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-primary/60">
                Acesso Rápido - Emergências
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {emergencyProtocols.slice(0, 4).map((protocol, index) => (
                <EmergencyProtocolCard
                  key={protocol.id}
                  protocol={protocol}
                  index={index}
                  onStart={handleStartProtocol}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Specialty Selection OR Protocol Grid */}
        {!combinedHasFilters ? (
          /* ── Nenhum filtro ativo: mostrar seletor de especialidade ── */
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Stethoscope className="h-5 w-5 text-[#512B81]" />
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-primary/60">
                Selecione uma Especialidade
                <span className="ml-3 text-[#512B81]">({specialties.length})</span>
              </h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {specialties.map((specialty, i) => {
                const Icon = getSpecialtyIcon(specialty);
                const count = specialtyCounts[specialty] ?? 0;
                const colorClass = SPECIALTY_COLOR_PALETTE[i % SPECIALTY_COLOR_PALETTE.length];
                return (
                  <motion.button
                    key={specialty}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.025, type: 'spring', stiffness: 300, damping: 24 }}
                    onClick={() => setSpecialty(specialty)}
                    className={`glass-effect rounded-[1.5rem] p-5 border-2 bg-gradient-to-br ${colorClass} text-left group hover:shadow-lg hover:-translate-y-1 transition-all duration-200`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-9 h-9 rounded-xl bg-white/70 flex items-center justify-center shadow-sm">
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="text-xl font-black opacity-80">{count}</span>
                    </div>
                    <p className="text-xs font-black text-primary leading-tight mb-1 line-clamp-2">
                      {specialty}
                    </p>
                    <div className="flex items-center gap-1 text-[10px] font-medium opacity-60 group-hover:opacity-100 transition-opacity">
                      <span>{count} {count === 1 ? 'protocolo' : 'protocolos'}</span>
                      <ChevronRight className="h-3 w-3" />
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        ) : (
          /* ── Filtro ativo: mostrar resultados ── */
          <div>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-primary/60">
                {filters.specialty && !filters.searchTerm && filters.triageColors.length === 0 && !filters.targetAudience
                  ? filters.specialty
                  : 'Resultados da Busca'}
                <span className="ml-3 text-[#512B81]">({filteredProtocols.length})</span>
              </h3>
              {/* Botão voltar para especialidades quando só especialidade está selecionada */}
              {filters.specialty && !filters.searchTerm && filters.triageColors.length === 0 && !filters.targetAudience && (
                <button
                  onClick={() => setSpecialty(null)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-primary/60 hover:text-primary hover:border-primary/30 transition-all"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  Especialidades
                </button>
              )}
            </div>

            {filteredProtocols.length === 0 ? (
              <div className="glass-effect rounded-[2rem] p-12 border border-white/20 text-center">
                <BookOpen className="h-12 w-12 text-primary/20 mx-auto mb-4" />
                <h3 className="text-lg font-black text-primary/40 mb-2">
                  Nenhum protocolo encontrado
                </h3>
                <p className="text-sm text-primary/30 mb-6">
                  Tente ajustar os filtros de busca
                </p>
                <Button onClick={handleClearAll} variant="outline">
                  Limpar Filtros
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProtocols.map((protocol) => (
                  <ProtocolCardElegant
                    key={protocol.id}
                    protocol={protocol}
                    onStart={handleStartProtocol}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

// Protocol Card — sem index-based delay para não lag ao filtrar
function ProtocolCardElegant({
  protocol,
  onStart,
}: {
  protocol: Protocol;
  onStart: (id: string) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const triageInfo = getTriageInfo(protocol.triageColor);
  const isCritical = protocol.triageColor === 'RED' || protocol.triageColor === 'ORANGE';

  const handleClick = async () => {
    setIsLoading(true);
    await onStart(protocol.id);
  };

  const triageColors = {
    RED: 'from-red-50 to-red-100/50 border-red-200',
    ORANGE: 'from-orange-50 to-orange-100/50 border-orange-200',
    YELLOW: 'from-amber-50 to-amber-100/50 border-amber-200',
    GREEN: 'from-emerald-50 to-emerald-100/50 border-emerald-200',
    BLUE: 'from-blue-50 to-blue-100/50 border-blue-200',
  };

  const triageBadgeColors = {
    RED: 'bg-red-600',
    ORANGE: 'bg-orange-500',
    YELLOW: 'bg-amber-400',
    GREEN: 'bg-emerald-500',
    BLUE: 'bg-blue-500',
  };

  return (
    <Card
      className={`h-full glass-effect rounded-[2rem] border-2 bg-gradient-to-br ${triageColors[protocol.triageColor]
        } overflow-hidden group cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-200 relative ${isLoading ? 'pointer-events-none' : ''
        }`}
      onClick={handleClick}
    >
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-20 rounded-[2rem]">
          <div className="text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#512B81]/10 flex items-center justify-center mx-auto mb-2">
              <Loader2 className="h-6 w-6 animate-spin text-[#512B81]" />
            </div>
            <p className="text-[10px] font-black uppercase tracking-wider text-primary/60">
              Carregando
            </p>
          </div>
        </div>
      )}

      <CardContent className="p-6 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-4">
          <div className="flex flex-wrap gap-1.5 flex-1 pr-2">
            <Badge
              className={`${triageBadgeColors[protocol.triageColor]} text-white text-[9px] font-black uppercase tracking-wider shadow-sm`}
            >
              {protocol.triageColor}
            </Badge>
            <Badge className="bg-white/80 text-primary/80 border border-slate-200 text-[9px] font-bold uppercase tracking-wider shadow-sm">
              {protocol.specialty}
            </Badge>
          </div>
          {isCritical && (
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 animate-pulse mt-0.5" />
          )}
        </div>

        {/* Source Guideline */}
        {protocol.sourceGuideline && (
          <div className="flex items-center gap-1.5 mb-1.5">
            <BookOpen className="w-3 h-3 text-[#512B81] flex-shrink-0" />
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#512B81] line-clamp-1">
              {protocol.sourceGuideline}
            </span>
          </div>
        )}

        {/* Title */}
        <h3 className="text-base font-black text-primary mb-3 line-clamp-2 leading-tight">
          {protocol.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-primary/60 mb-4 line-clamp-3 flex-grow leading-relaxed">
          {protocol.description || 'Protocolo clínico baseado em evidências científicas.'}
        </p>

        {/* Tags */}
        {protocol.tags && protocol.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {protocol.tags.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-white/60 text-primary/70 rounded-lg text-[10px] font-medium border border-slate-100"
              >
                <Tag className="h-2.5 w-2.5" />
                {tag}
              </span>
            ))}
            {protocol.tags.length > 3 && (
              <span className="px-2 py-0.5 bg-white/60 text-primary/50 rounded-lg text-[10px] font-medium border border-slate-100">
                +{protocol.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-white/40">
          <div className="flex items-center gap-1.5 text-[10px] font-medium text-primary/50">
            <Clock className="h-3 w-3" />
            <span>
              {triageInfo.targetMinutes === 0 ? 'Imediato' : `${triageInfo.targetMinutes}min`}
            </span>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-[#512B81] group-hover:gap-3 transition-all">
            Iniciar
            <Play className="h-3.5 w-3.5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Emergency Protocol Card
function EmergencyProtocolCard({
  protocol,
  index,
  onStart,
}: {
  protocol: Protocol;
  index: number;
  onStart: (id: string) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    await onStart(protocol.id);
  };

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4 + index * 0.05 }}
      whileHover={{ scale: 1.02, y: -2 }}
      onClick={handleClick}
      disabled={isLoading}
      className="glass-effect rounded-[2rem] p-6 border-2 border-red-200 bg-gradient-to-br from-red-50 to-red-100/50 text-left group hover:shadow-xl transition-all relative disabled:pointer-events-none"
    >
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-20 rounded-[2rem]">
          <div className="text-center">
            <div className="w-10 h-10 rounded-2xl bg-[#512B81]/10 flex items-center justify-center mx-auto mb-1">
              <Loader2 className="h-5 w-5 animate-spin text-[#512B81]" />
            </div>
            <p className="text-[9px] font-black uppercase tracking-wider text-primary/60">Carregando</p>
          </div>
        </div>
      )}

      <div className="flex items-start justify-between gap-3 mb-3">
        <Zap className="h-5 w-5 text-red-600 group-hover:scale-110 transition-transform flex-shrink-0" />
        <Badge className="bg-red-600 text-white text-[9px] font-black uppercase tracking-wider shadow-sm">
          {protocol.triageColor}
        </Badge>
      </div>

      {protocol.sourceGuideline && (
        <div className="flex items-center gap-1.5 mb-1.5">
          <BookOpen className="w-3 h-3 text-[#512B81] flex-shrink-0" />
          <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#512B81] line-clamp-1">
            {protocol.sourceGuideline}
          </span>
        </div>
      )}

      <h4 className="text-sm font-black text-primary mb-1 line-clamp-2 leading-tight">
        {protocol.title}
      </h4>
      <p className="text-[10px] font-medium text-primary/60 uppercase tracking-wider">
        {protocol.specialty}
      </p>
    </motion.button>
  );
}
