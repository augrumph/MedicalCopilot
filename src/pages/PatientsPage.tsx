import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Stethoscope, Users, Calendar, UserPlus, Grid3x3, List, ChevronDown, ChevronUp, FileText, Upload, Pill, Edit, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAppStore } from '@/stores/appStore';
import type { Patient } from '@/lib/types';
import { cn } from '@/lib/utils';
import { getContextConfig } from '@/lib/contextConfig';
import { psychologyPatients } from '@/lib/psychologyMockData';

const PatientsPage = () => {
  const navigate = useNavigate();
  const medicalPatients = useAppStore(state => state.patients);
  const startConsultation = useAppStore(state => state.startConsultation);
  const appContext = useAppStore(state => state.appContext);
  const config = getContextConfig(appContext);

  // Use dados específicos baseado no contexto
  const patients = appContext === 'psychology' ? psychologyPatients : medicalPatients;
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [expandedPatient, setExpandedPatient] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'documents' | 'history' | 'prescriptions'>('info');

  const filteredPatients = useMemo(() =>
    patients.filter(patient =>
      patient.name.toLowerCase().includes(searchQuery.toLowerCase())
    ), [patients, searchQuery]
  );

  const handleStartConsultation = (patient: Patient) => {
    startConsultation(patient);
    navigate('/consultation');
  };

  const toggleExpand = (patientId: string) => {
    if (expandedPatient === patientId) {
      setExpandedPatient(null);
    } else {
      setExpandedPatient(patientId);
      setActiveTab('info');
      // Switch to list view when expanding in grid mode
      if (viewMode === 'grid') {
        setViewMode('list');
      }
    }
  };

  const getAvatarColor = useMemo(() => (name: string) => {
    const colors = [
      'from-[#8C00FF] to-[#450693]',
      'from-[#FF3F7F] to-[#FF1654]',
      'from-[#FFC400] to-[#FF9500]',
      'from-[#450693] to-[#8C00FF]',
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  }, []);

  const getGenderBadgeColor = useMemo(() => (gender: string) => {
    if (gender === 'Masculino') return 'bg-blue-100 text-blue-700 border-blue-200';
    if (gender === 'Feminino') return 'bg-pink-100 text-pink-700 border-pink-200';
    return 'bg-gray-100 text-gray-700 border-gray-200';
  }, []);

  const tabs = [
    { id: 'info' as const, label: 'Informações', icon: Users },
    { id: 'documents' as const, label: 'Documentos', icon: FileText },
    { id: 'history' as const, label: 'Histórico', icon: Calendar },
    { id: 'prescriptions' as const, label: 'Receitas', icon: Pill },
  ];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#450693] to-[#8C00FF] bg-clip-text text-transparent">
              {config.patientLabelPlural}
            </h1>
            <p className="text-gray-600 mt-1 flex items-center gap-2">
              <Users className="h-4 w-4" />
              {filteredPatients.length} {filteredPatients.length === 1 ? config.patientLabel.toLowerCase() : config.patientLabelPlural.toLowerCase()}
              {searchQuery && ' encontrados'}
            </p>
          </div>

          <Button
            onClick={() => navigate('/patients/new')}
            className="bg-gradient-to-r from-[#8C00FF] to-[#450693] text-white hover:opacity-90 shadow-lg hover:shadow-xl transition-all"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Novo {config.patientLabel}
          </Button>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Buscar por nome..."
              className="pl-10 bg-gray-100 border-gray-300 focus-visible:bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "h-10 w-10 transition-all",
                viewMode === 'grid' && "bg-[#8C00FF] text-white border-[#8C00FF]"
              )}
              onClick={() => setViewMode('grid')}
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className={cn(
                "h-10 w-10 transition-all",
                viewMode === 'list' && "bg-[#8C00FF] text-white border-[#8C00FF]"
              )}
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="border-0 shadow-md bg-gradient-to-br from-[#8C00FF]/10 to-[#450693]/5 hover:shadow-lg transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total de {config.patientLabelPlural}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">{patients.length}</p>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#8C00FF] to-[#450693] flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <Card className="border-0 shadow-md bg-gradient-to-br from-[#FF3F7F]/10 to-[#FF1654]/5 hover:shadow-lg transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Mulheres</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                      {patients.filter(p => p.gender === 'Feminino').length}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#FF3F7F] to-[#FF1654] flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-0 shadow-md bg-gradient-to-br from-[#FFC400]/10 to-[#FF9500]/5 hover:shadow-lg transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Homens</p>
                    <p className="text-3xl font-bold text-gray-900 mt-1">
                      {patients.filter(p => p.gender === 'Masculino').length}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#FFC400] to-[#FF9500] flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Patients List */}
        {filteredPatients.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35 }}
          >
            <Card className="border-0 shadow-lg">
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#8C00FF] to-[#450693] rounded-full blur-2xl opacity-20 animate-pulse"></div>
                  <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-[#8C00FF] to-[#450693] flex items-center justify-center shadow-xl">
                    <Users className="h-10 w-10 text-white" />
                  </div>
                </div>

                <p className="text-2xl font-bold mb-2 bg-gradient-to-r from-[#450693] to-[#8C00FF] bg-clip-text text-transparent">
                  {searchQuery ? 'Nenhum paciente encontrado' : 'Nenhum paciente cadastrado'}
                </p>

                <p className="text-gray-600 mb-6">
                  {searchQuery ? 'Tente buscar com outro nome' : 'Comece adicionando seu primeiro paciente'}
                </p>

                {!searchQuery && (
                  <Button
                    onClick={() => navigate('/patients/new')}
                    className="bg-gradient-to-r from-[#8C00FF] to-[#450693] text-white shadow-lg hover:shadow-xl"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Adicionar Primeiro Paciente
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ) : viewMode === 'list' ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredPatients.map((patient, index) => {
              const isExpanded = expandedPatient === patient.id;

              return (
                <motion.div
                  key={patient.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 + index * 0.03 }}
                  layout
                >
                  <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
                    {/* Card Header - Always Visible */}
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <Avatar className="h-14 w-14 shadow-lg border-2 border-white flex-shrink-0">
                            <AvatarFallback className={cn(
                              "text-white font-bold text-lg bg-gradient-to-br",
                              getAvatarColor(patient.name)
                            )}>
                              {patient.name.charAt(0).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 truncate">
                              {patient.name}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge className={cn("text-xs font-semibold border", getGenderBadgeColor(patient.gender))}>
                                {patient.gender}
                              </Badge>
                              <span className="text-sm text-gray-600">{patient.age} anos</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Button
                            onClick={() => handleStartConsultation(patient)}
                            className="bg-gradient-to-r from-[#8C00FF] to-[#450693] text-white hover:opacity-90 shadow-md"
                          >
                            <Stethoscope className="mr-2 h-4 w-4" />
                            {config.startConsultationAction}
                          </Button>

                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => toggleExpand(patient.id)}
                            className="h-10 w-10 border-gray-300"
                          >
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      {/* Expanded Content */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <Separator className="my-5 bg-gray-300" />

                            {/* Tabs */}
                            <div className="flex gap-2 mb-5 overflow-x-auto pb-2">
                              {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                  <Button
                                    key={tab.id}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                      "flex items-center gap-2 transition-all whitespace-nowrap",
                                      activeTab === tab.id
                                        ? "bg-[#8C00FF] text-white border-[#8C00FF] shadow-md"
                                        : "border-gray-300 hover:border-[#8C00FF]/50"
                                    )}
                                  >
                                    <Icon className="h-4 w-4" />
                                    {tab.label}
                                  </Button>
                                );
                              })}
                            </div>

                            {/* Tab Content */}
                            <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                              {activeTab === 'info' && (
                                <div className="space-y-4">
                                  <div className="flex items-center justify-between">
                                    <h4 className="font-semibold text-gray-900">Informações do Paciente</h4>
                                    <Button variant="outline" size="sm">
                                      <Edit className="h-4 w-4 mr-2" />
                                      Editar
                                    </Button>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                                      <p className="text-sm text-gray-600 mb-1">Nome Completo</p>
                                      <p className="font-semibold text-gray-900">{patient.name}</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                                      <p className="text-sm text-gray-600 mb-1">Idade</p>
                                      <p className="font-semibold text-gray-900">{patient.age} anos</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                                      <p className="text-sm text-gray-600 mb-1">Gênero</p>
                                      <p className="font-semibold text-gray-900">{patient.gender}</p>
                                    </div>
                                    <div className="bg-white p-4 rounded-lg border border-gray-200">
                                      <p className="text-sm text-gray-600 mb-1">Data de Cadastro</p>
                                      <p className="font-semibold text-gray-900">{new Date().toLocaleDateString('pt-BR')}</p>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {activeTab === 'documents' && (
                                <div className="space-y-4">
                                  <div className="flex items-center justify-between">
                                    <h4 className="font-semibold text-gray-900">Documentos e Exames</h4>
                                    <Button variant="outline" size="sm">
                                      <Upload className="h-4 w-4 mr-2" />
                                      Upload
                                    </Button>
                                  </div>

                                  <div className="text-center py-12">
                                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                    <p className="text-gray-600 mb-2">Nenhum documento cadastrado</p>
                                    <p className="text-sm text-gray-500">Adicione exames, laudos e documentos médicos</p>
                                  </div>
                                </div>
                              )}

                              {activeTab === 'history' && (
                                <div className="space-y-4">
                                  <h4 className="font-semibold text-gray-900">Histórico de Consultas</h4>

                                  <div className="text-center py-12">
                                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                    <p className="text-gray-600 mb-2">Nenhuma consulta realizada</p>
                                    <p className="text-sm text-gray-500">O histórico aparecerá aqui após consultas</p>
                                  </div>
                                </div>
                              )}

                              {activeTab === 'prescriptions' && (
                                <div className="space-y-4">
                                  <div className="flex items-center justify-between">
                                    <h4 className="font-semibold text-gray-900">Receitas Médicas</h4>
                                    <Button variant="outline" size="sm">
                                      <Plus className="h-4 w-4 mr-2" />
                                      Nova Receita
                                    </Button>
                                  </div>

                                  <div className="text-center py-12">
                                    <Pill className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                                    <p className="text-gray-600 mb-2">Nenhuma receita gerada</p>
                                    <p className="text-sm text-gray-500">Receitas aparecem automaticamente após consultas</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        ) : (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPatients.map((patient, index) => (
              <motion.div
                key={patient.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + index * 0.05 }}
              >
                <Card className="border-0 shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer overflow-hidden h-full">
                  <CardContent className="p-5 flex flex-col h-full">
                    <div className="flex items-start gap-4 mb-4">
                      <Avatar className="h-14 w-14 shadow-lg border-2 border-white flex-shrink-0">
                        <AvatarFallback className={cn(
                          "text-white font-bold text-lg bg-gradient-to-br",
                          getAvatarColor(patient.name)
                        )}>
                          {patient.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 truncate group-hover:text-[#8C00FF] transition-colors">
                          {patient.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={cn("text-xs font-semibold border", getGenderBadgeColor(patient.gender))}>
                            {patient.gender}
                          </Badge>
                          <span className="text-sm text-gray-600">{patient.age} anos</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>Cadastrado em {new Date().toLocaleDateString('pt-BR')}</span>
                      </div>
                    </div>

                    <div className="mt-auto space-y-2">
                      <Button
                        onClick={() => handleStartConsultation(patient)}
                        className="w-full bg-gradient-to-r from-[#8C00FF] to-[#450693] text-white hover:opacity-90 shadow-md group-hover:shadow-lg transition-all"
                      >
                        <Stethoscope className="mr-2 h-4 w-4" />
                        {config.startConsultationAction}
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => toggleExpand(patient.id)}
                        className="w-full border-gray-300 hover:border-[#8C00FF] hover:text-[#8C00FF]"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Ver Detalhes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default PatientsPage;
