import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Users, UserPlus, Eye, TrendingUp, ChevronDown, X, FileText, Pill, Calendar, Activity, AlertCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAppStore } from '@/stores/appStore';
import type { Patient } from '@/lib/types';
import { cn, getPatientAvatar } from '@/lib/utils';

const MedicalPatientsPage = () => {
    const navigate = useNavigate();
    const patients = useAppStore(state => state.patients);
    const startConsultation = useAppStore(state => state.startConsultation);

    const [searchQuery, setSearchQuery] = useState('');
    const [expandedPatient, setExpandedPatient] = useState<string | null>(null);

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
        setExpandedPatient(expandedPatient === patientId ? null : patientId);
    };

    const getAvatarColor = useMemo(() => (name: string) => {
        const colors = [
            'from-[#8C00FF] to-[#450693]',
            'from-[#FF3F7F] to-[#FF1654]',
            'from-[#0099FF] to-[#0066CC]',
            'from-[#00D9FF] to-[#00A3CC]',
            'from-[#FFC400] to-[#FF9500]',
            'from-[#00E676] to-[#00C853]',
        ];
        const index = name.charCodeAt(0) % colors.length;
        return colors[index];
    }, []);

    const stats = [
        {
            title: 'Pacientes',
            value: patients.length.toString(),
            icon: Users,
            gradient: 'from-purple-500 to-purple-700',
            iconBg: 'bg-purple-500',
            titleBorder: 'border-purple-200',
            titleTextColor: 'text-purple-700'
        },
        {
            title: 'Ativos',
            value: patients.filter(p => p.mainConditions && p.mainConditions.length > 0).length.toString(),
            icon: Activity,
            gradient: 'from-green-500 to-green-700',
            iconBg: 'bg-green-500',
            titleBorder: 'border-green-200',
            titleTextColor: 'text-green-700'
        },
        {
            title: 'Agendados',
            value: '12',
            icon: Calendar,
            gradient: 'from-blue-500 to-blue-700',
            iconBg: 'bg-blue-500',
            titleBorder: 'border-blue-200',
            titleTextColor: 'text-blue-700'
        },
        {
            title: 'Consultas',
            value: '48',
            icon: Activity,
            gradient: 'from-orange-500 to-orange-700',
            iconBg: 'bg-orange-500',
            titleBorder: 'border-orange-200',
            titleTextColor: 'text-orange-700'
        },
    ];

    return (
        <AppLayout>
            <div className="space-y-6 pb-8">
                {/* Hero Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#450693] via-[#8C00FF] to-[#FF3F7F] p-4 md:p-5 shadow-lg"
                >
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtMi4yMS0xLjc5LTQtNC00cy00IDEuNzktNCA0IDEuNzkgNCA0IDQgNC0xLjc5IDQtNHptMCA0MGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6bS0yMC0yMGMwLTIuMjEtMS43OS00LTQtNHMtNCAxLjc5LTQgNCAxLjc5IDQgNCA0IDQtMS43OSA0LTR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30"></div>

                    <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
                        <div className="space-y-1">
                            <motion.h1
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-xl md:text-2xl font-bold text-white"
                            >
                                Gerenciar Pacientes
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-xs md:text-sm text-white/90"
                            >
                                Visualize e gerencie todos os seus pacientes cadastrados
                            </motion.p>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            <Button
                                onClick={() => navigate('/patients/new')}
                                className="bg-white text-[#450693] hover:bg-white/90 shadow-lg px-4 py-2 h-auto text-sm font-semibold"
                            >
                                <UserPlus className="mr-1.5 h-4 w-4" />
                                Novo Paciente
                            </Button>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat) => (
                        <motion.div
                            key={stat.title}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                        >
                            <Card className="relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
                                <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />

                                <CardContent className="p-3 relative">
                                    <div className="flex items-start justify-between mb-2">
                                        <div className={`p-2 rounded-lg ${stat.iconBg} shadow-sm`}>
                                            {React.createElement(stat.icon, { className: "h-4 w-4 text-white" })}
                                        </div>
                                        <Badge className="bg-green-100 text-green-700 border-0 font-semibold text-[0.6rem]">
                                            <TrendingUp className="h-2 w-2 mr-0.5" />
                                            100%
                                        </Badge>
                                    </div>

                                    <div className="space-y-1">
                                        <Badge variant="outline" className={`text-xs font-bold px-2.5 py-1 border ${stat.titleBorder} ${stat.titleTextColor}`}>
                                            {stat.title}
                                        </Badge>
                                        <p className="text-3xl font-bold text-gray-900">
                                            {stat.value}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Search Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="relative"
                >
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                        placeholder="Buscar paciente..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-12 text-base border-gray-300 shadow-sm"
                    />
                </motion.div>

                {/* Patients Grid */}
                {filteredPatients.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.35 }}
                        className="text-center py-16"
                    >
                        <Users className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                        <p className="text-xl font-semibold text-gray-600 mb-2">
                            {searchQuery ? 'Nenhum paciente encontrado' : 'Nenhum paciente cadastrado'}
                        </p>
                        <p className="text-xs md:text-sm text-gray-500">
                            {searchQuery ? 'Tente buscar com outro nome' : 'Clique em "Novo Paciente" para começar'}
                        </p>
                    </motion.div>
                ) : (
                    <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
                        {filteredPatients.map((patient, index) => {
                            const isExpanded = expandedPatient === patient.id;

                            return (
                                <motion.div
                                    key={patient.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.35 + index * 0.05 }}
                                    layout
                                >
                                    <Card className={cn(
                                        "relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group",
                                        isExpanded && "lg:col-span-2"
                                    )}>
                                        <CardContent className="p-6">
                                            <div className="flex items-start gap-4 mb-4">
                                                <Avatar className="h-16 w-16 shadow-lg border-4 border-white flex-shrink-0">
                                                    <AvatarImage src={getPatientAvatar(patient.name)} alt={patient.name} className="object-cover" />
                                                    <AvatarFallback className={cn("text-white font-bold text-xl bg-gradient-to-br", getAvatarColor(patient.name))}>
                                                        {patient.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                                                    </AvatarFallback>
                                                </Avatar>

                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-bold text-lg text-gray-900 mb-1 truncate">
                                                        {patient.name}
                                                    </h3>
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <span className="text-xs md:text-sm text-gray-600">{patient.age} anos</span>
                                                        <span className="text-gray-300">•</span>
                                                        <Badge variant="outline" className={cn(
                                                            "text-xs whitespace-nowrap px-2 py-1",
                                                            patient.gender === 'masculino' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                                                patient.gender === 'feminino' ? 'bg-pink-50 text-pink-700 border-pink-200' :
                                                                    'bg-gray-50 text-gray-700 border-gray-200'
                                                        )}>
                                                            {patient.gender === 'masculino' ? 'Masculino' :
                                                                patient.gender === 'feminino' ? 'Feminino' : 'Outro'}
                                                        </Badge>
                                                        <span className="text-gray-300">•</span>
                                                        <span className="text-xs md:text-sm text-gray-500">Há 4 dias</span>
                                                    </div>
                                                    <p className="text-xs md:text-sm text-gray-700 mt-2 font-medium">
                                                        {patient.mainConditions?.[0] || 'Sem diagnóstico registrado'}
                                                    </p>
                                                </div>

                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => toggleExpand(patient.id)}
                                                    className="flex-shrink-0"
                                                >
                                                    {isExpanded ? <X className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                                </Button>
                                            </div>

                                            {/* Expanded Content - Tabs */}
                                            <AnimatePresence>
                                                {isExpanded && (
                                                    <motion.div
                                                        initial={{ opacity: 0, height: 0 }}
                                                        animate={{ opacity: 1, height: 'auto' }}
                                                        exit={{ opacity: 0, height: 0 }}
                                                        transition={{ duration: 0.3 }}
                                                    >
                                                        <Separator className="my-4" />

                                                        <Tabs defaultValue="history" className="w-full">
                                                            <TabsList className="grid w-full grid-cols-4 mb-6 bg-gray-100/80 p-1 rounded-xl shadow-inner">
                                                                <TabsTrigger
                                                                    value="info"
                                                                    className="flex items-center justify-center gap-1.5 data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg transition-all font-medium"
                                                                >
                                                                    <FileText className="h-4 w-4" />
                                                                    <span className="hidden md:inline text-xs md:text-sm">Info</span>
                                                                </TabsTrigger>
                                                                <TabsTrigger
                                                                    value="prescriptions"
                                                                    className="flex items-center justify-center gap-1.5 data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg transition-all font-medium"
                                                                >
                                                                    <Pill className="h-4 w-4" />
                                                                    <span className="hidden md:inline text-xs md:text-sm">Receitas</span>
                                                                </TabsTrigger>
                                                                <TabsTrigger
                                                                    value="documents"
                                                                    className="flex items-center justify-center gap-1.5 data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg transition-all font-medium"
                                                                >
                                                                    <FileText className="h-4 w-4" />
                                                                    <span className="hidden md:inline text-xs md:text-sm">Docs</span>
                                                                </TabsTrigger>
                                                                <TabsTrigger
                                                                    value="history"
                                                                    className="flex items-center justify-center gap-1.5 data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg transition-all font-medium"
                                                                >
                                                                    <Calendar className="h-4 w-4" />
                                                                    <span className="hidden md:inline text-xs md:text-sm">Histórico</span>
                                                                </TabsTrigger>
                                                            </TabsList>

                                                            {/* Tab: Informações */}
                                                            <TabsContent value="info" className="space-y-4 mt-0">
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                    {/* Medical Info */}
                                                                    <Card className="bg-gradient-to-br from-purple-50/50 to-white border-purple-100">
                                                                        <CardContent className="p-4">
                                                                            <h4 className="font-semibold text-xs md:text-sm text-gray-900 mb-3 flex items-center gap-2">
                                                                                <div className="p-1.5 bg-purple-100 rounded-lg">
                                                                                    <Activity className="h-3.5 w-3.5 text-purple-600" />
                                                                                </div>
                                                                                Informações Médicas
                                                                            </h4>
                                                                            {patient.id === 'patient-1' ? (
                                                                                <>
                                                                                    <div>
                                                                                        <h4 className="font-semibold text-xs md:text-sm text-gray-700 mb-2">Condições Principais</h4>
                                                                                        <div className="flex flex-wrap gap-2">
                                                                                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs whitespace-nowrap px-2 py-1">
                                                                                                Hipertensão Arterial
                                                                                            </Badge>
                                                                                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 text-xs whitespace-nowrap px-2 py-1">
                                                                                                Dislipidemia
                                                                                            </Badge>
                                                                                        </div>
                                                                                    </div>

                                                                                    <div>
                                                                                        <h4 className="font-semibold text-xs md:text-sm text-gray-700 mb-2">Alergias</h4>
                                                                                        <div className="flex flex-wrap gap-2">
                                                                                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs whitespace-nowrap px-2 py-1">
                                                                                                Penicilina
                                                                                            </Badge>
                                                                                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 text-xs whitespace-nowrap px-2 py-1">
                                                                                                AAS (Ácido Acetilsalicílico)
                                                                                            </Badge>
                                                                                        </div>
                                                                                    </div>

                                                                                    <div>
                                                                                        <h4 className="font-semibold text-xs md:text-sm text-gray-700 mb-2">Medicações em Uso</h4>
                                                                                        <div className="flex flex-wrap gap-2">
                                                                                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs whitespace-nowrap px-2 py-1">
                                                                                                Losartana 50mg
                                                                                            </Badge>
                                                                                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs whitespace-nowrap px-2 py-1">
                                                                                                Sinvastatina 20mg
                                                                                            </Badge>
                                                                                        </div>
                                                                                    </div>
                                                                                </>
                                                                            ) : (
                                                                                <p className="text-sm text-gray-500 italic">Informações detalhadas disponíveis em breve</p>
                                                                            )}
                                                                        </CardContent>
                                                                    </Card>

                                                                    {/* Contact Info */}
                                                                    <Card className="bg-gradient-to-br from-blue-50/50 to-white border-blue-100">
                                                                        <CardContent className="p-4">
                                                                            <h4 className="font-semibold text-xs md:text-sm text-gray-900 mb-3 flex items-center gap-2">
                                                                                <div className="p-1.5 bg-blue-100 rounded-lg">
                                                                                    <Users className="h-3.5 w-3.5 text-blue-600" />
                                                                                </div>
                                                                                Informações de Contato
                                                                            </h4>
                                                                            {patient.id === 'patient-1' ? (
                                                                                <div className="space-y-2">
                                                                                    <p className="text-xs md:text-sm text-gray-700"><strong>Telefone:</strong> (11) 98765-4321</p>
                                                                                    <p className="text-xs md:text-sm text-gray-700"><strong>Email:</strong> maria.silva@example.com</p>
                                                                                    <p className="text-xs md:text-sm text-gray-700"><strong>Endereço:</strong> Rua das Flores, 123 - São Paulo, SP</p>
                                                                                </div>
                                                                            ) : (
                                                                                <p className="text-sm text-gray-500 italic">Informações de contato disponíveis em breve</p>
                                                                            )}
                                                                        </CardContent>
                                                                    </Card>
                                                                </div>
                                                            </TabsContent>

                                                            {/* Tab: Receitas */}
                                                            <TabsContent value="prescriptions" className="space-y-4 mt-0">
                                                                <p className="text-sm text-gray-500">Receitas do paciente</p>
                                                            </TabsContent>

                                                            {/* Tab: Documentos */}
                                                            <TabsContent value="documents" className="space-y-4 mt-0">
                                                                <p className="text-sm text-gray-500">Documentos do paciente</p>
                                                            </TabsContent>

                                                            {/* Tab: Histórico - REVISÃO RÁPIDA PRÉ-CONSULTA (1 MINUTO) */}
                                                            <TabsContent value="history" className="space-y-5 mt-0">
                                                                {patient.id === 'patient-1' ? (
                                                                    <div className="space-y-5">
                                                                        {/* Cabeçalho de Status */}
                                                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200 shadow-sm">
                                                                            <div className="flex items-center gap-3 mb-3 sm:mb-0">
                                                                                <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse shadow-lg shadow-green-500/50" />
                                                                                <div>
                                                                                    <p className="text-sm font-bold text-gray-900">Paciente Estável</p>
                                                                                    <p className="text-xs text-gray-600">Última consulta: <span className="font-semibold">15 Nov 2024</span> • Rotina • <span className="text-green-600">4 dias atrás</span></p>
                                                                                </div>
                                                                            </div>
                                                                            <Button size="sm" variant="outline" className="text-xs h-8 border-green-300 text-green-700 hover:bg-green-100">
                                                                                <FileText className="h-3.5 w-3.5 mr-1.5" />
                                                                                Relatório Completo
                                                                            </Button>
                                                                        </div>

                                                                        {/* Grid Principal: Última Consulta + Vitais/Tratamento */}
                                                                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                                                                            {/* Última Consulta */}
                                                                            <Card className="border-2 border-purple-200 shadow-md">
                                                                                <CardContent className="p-5">
                                                                                    <div className="flex items-center gap-2 mb-4">
                                                                                        <div className="p-2 bg-purple-100 rounded-lg">
                                                                                            <Calendar className="h-4 w-4 text-purple-600" />
                                                                                        </div>
                                                                                        <h4 className="font-bold text-gray-900">Última Consulta</h4>
                                                                                        <Badge className="ml-auto bg-purple-100 text-purple-700 border-0 text-[10px]">15/11/2024 14:30</Badge>
                                                                                    </div>

                                                                                    <div className="space-y-3">
                                                                                        <div>
                                                                                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">Motivo da Consulta</p>
                                                                                            <p className="text-sm text-gray-800">Acompanhamento de rotina - Hipertensão Arterial</p>
                                                                                        </div>

                                                                                        <Separator />

                                                                                        <div>
                                                                                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">Hipótese Diagnóstica</p>
                                                                                            <div className="flex flex-wrap gap-1.5">
                                                                                                <Badge className="bg-blue-100 text-blue-700 border-0 text-xs">HAS Estágio 1 Controlada</Badge>
                                                                                                <Badge className="bg-purple-100 text-purple-700 border-0 text-xs">Dislipidemia Mista</Badge>
                                                                                            </div>
                                                                                        </div>

                                                                                        <Separator />

                                                                                        <div>
                                                                                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">Conduta</p>
                                                                                            <ul className="text-xs text-gray-700 space-y-1 list-disc list-inside">
                                                                                                <li>Mantida medicação atual (Losartana 50mg + Sinvastatina 20mg)</li>
                                                                                                <li>Solicitado perfil lipídico de controle</li>
                                                                                                <li>Reforçadas orientações sobre dieta hipossódica</li>
                                                                                            </ul>
                                                                                        </div>

                                                                                        <Separator />

                                                                                        <div>
                                                                                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1">Próximos Passos</p>
                                                                                            <div className="flex flex-wrap gap-2">
                                                                                                <Badge variant="outline" className="text-xs bg-amber-50 border-amber-300 text-amber-700">
                                                                                                    <AlertCircle className="h-3 w-3 mr-1" />
                                                                                                    Retorno em 3 meses
                                                                                                </Badge>
                                                                                                <Badge variant="outline" className="text-xs bg-blue-50 border-blue-300 text-blue-700">
                                                                                                    Perfil lipídico em 30 dias
                                                                                                </Badge>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </CardContent>
                                                                            </Card>

                                                                            {/* Coluna Direita: Vitais + Tratamento */}
                                                                            <div className="space-y-4">
                                                                                {/* Sinais Vitais */}
                                                                                <Card className="border-2 border-blue-200 shadow-md">
                                                                                    <CardContent className="p-4">
                                                                                        <div className="flex items-center gap-2 mb-3">
                                                                                            <div className="p-1.5 bg-blue-100 rounded-lg">
                                                                                                <Activity className="h-3.5 w-3.5 text-blue-600" />
                                                                                            </div>
                                                                                            <h4 className="font-bold text-sm text-gray-900">Sinais Vitais Atuais</h4>
                                                                                        </div>

                                                                                        {/* Mobile: Layout horizontal compacto */}
                                                                                        <div className="flex sm:hidden gap-2 overflow-x-auto pb-2">
                                                                                            <div className="bg-gradient-to-br from-green-50 to-white p-3 rounded-xl border border-green-200 text-center min-w-[110px] flex-shrink-0">
                                                                                                <p className="text-[10px] font-semibold text-gray-500 mb-1">PA</p>
                                                                                                <p className="text-xl font-black text-gray-900">125/80</p>
                                                                                                <p className="text-[10px] font-medium text-green-600 mt-1">Estável</p>
                                                                                            </div>
                                                                                            <div className="bg-gradient-to-br from-blue-50 to-white p-3 rounded-xl border border-blue-200 text-center min-w-[90px] flex-shrink-0">
                                                                                                <p className="text-[10px] font-semibold text-gray-500 mb-1">FC</p>
                                                                                                <p className="text-xl font-black text-gray-900">72</p>
                                                                                                <p className="text-[10px] text-gray-400 mt-1">bpm</p>
                                                                                            </div>
                                                                                            <div className="bg-gradient-to-br from-red-50 to-white p-3 rounded-xl border border-red-200 text-center min-w-[90px] flex-shrink-0">
                                                                                                <p className="text-[10px] font-semibold text-gray-500 mb-1">Peso</p>
                                                                                                <p className="text-xl font-black text-gray-900">78.5</p>
                                                                                                <p className="text-[10px] font-medium text-red-500 mt-1">+0.5kg</p>
                                                                                            </div>
                                                                                        </div>

                                                                                        {/* Desktop: Grid 3 colunas */}
                                                                                        <div className="hidden sm:grid grid-cols-3 gap-2">
                                                                                            <div className="bg-gradient-to-br from-green-50 to-white p-2.5 rounded-lg border border-green-200 text-center">
                                                                                                <p className="text-[9px] font-bold text-gray-500 mb-0.5">PA (mmHg)</p>
                                                                                                <p className="text-lg font-black text-gray-900">125/80</p>
                                                                                                <div className="flex items-center justify-center mt-1">
                                                                                                    <TrendingUp className="h-2.5 w-2.5 text-green-600 mr-0.5" />
                                                                                                    <span className="text-[9px] font-semibold text-green-600">Estável</span>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="bg-gradient-to-br from-blue-50 to-white p-2.5 rounded-lg border border-blue-200 text-center">
                                                                                                <p className="text-[9px] font-bold text-gray-500 mb-0.5">FC (bpm)</p>
                                                                                                <p className="text-lg font-black text-gray-900">72</p>
                                                                                                <span className="text-[9px] text-gray-400">Normal</span>
                                                                                            </div>
                                                                                            <div className="bg-gradient-to-br from-red-50 to-white p-2.5 rounded-lg border border-red-200 text-center">
                                                                                                <p className="text-[9px] font-bold text-gray-500 mb-0.5">Peso (kg)</p>
                                                                                                <p className="text-lg font-black text-gray-900">78.5</p>
                                                                                                <div className="flex items-center justify-center mt-1">
                                                                                                    <TrendingUp className="h-2.5 w-2.5 text-red-500 mr-0.5" />
                                                                                                    <span className="text-[9px] font-semibold text-red-500">+0.5kg</span>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </CardContent>
                                                                                </Card>

                                                                                {/* Tratamento em Curso */}
                                                                                <Card className="border-2 border-green-200 shadow-md">
                                                                                    <CardContent className="p-4">
                                                                                        <div className="flex items-center gap-2 mb-3">
                                                                                            <div className="p-1.5 bg-green-100 rounded-lg">
                                                                                                <Pill className="h-3.5 w-3.5 text-green-600" />
                                                                                            </div>
                                                                                            <h4 className="font-bold text-sm text-gray-900">Tratamento em Curso</h4>
                                                                                        </div>

                                                                                        <div className="space-y-2.5 mb-3">
                                                                                            <div className="bg-green-50 p-2 rounded-lg border border-green-200">
                                                                                                <div className="flex items-start justify-between">
                                                                                                    <div>
                                                                                                        <p className="text-xs font-bold text-gray-900">Losartana Potássica</p>
                                                                                                        <p className="text-[10px] text-gray-600">50mg • 1 comp. pela manhã</p>
                                                                                                    </div>
                                                                                                    <Badge className="bg-green-600 text-white border-0 text-[9px] h-4">Ativa</Badge>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className="bg-purple-50 p-2 rounded-lg border border-purple-200">
                                                                                                <div className="flex items-start justify-between">
                                                                                                    <div>
                                                                                                        <p className="text-xs font-bold text-gray-900">Sinvastatina</p>
                                                                                                        <p className="text-[10px] text-gray-600">20mg • 1 comp. à noite</p>
                                                                                                    </div>
                                                                                                    <Badge className="bg-purple-600 text-white border-0 text-[9px] h-4">Ativa</Badge>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>

                                                                                        <Separator className="my-2.5" />

                                                                                        <div>
                                                                                            <p className="text-[10px] font-bold text-red-600 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                                                                                                <AlertCircle className="h-3 w-3" />
                                                                                                Alergias Conhecidas
                                                                                            </p>
                                                                                            <div className="flex flex-wrap gap-1.5">
                                                                                                <Badge className="bg-red-100 text-red-700 border-red-300 text-[10px]">Penicilina</Badge>
                                                                                                <Badge className="bg-red-100 text-red-700 border-red-300 text-[10px]">AAS</Badge>
                                                                                            </div>
                                                                                        </div>
                                                                                    </CardContent>
                                                                                </Card>
                                                                            </div>
                                                                        </div>

                                                                        {/* Exames Recentes */}
                                                                        <Card className="border-2 border-cyan-200 shadow-md">
                                                                            <CardContent className="p-5">
                                                                                <div className="flex items-center gap-2 mb-4">
                                                                                    <div className="p-2 bg-cyan-100 rounded-lg">
                                                                                        <FileText className="h-4 w-4 text-cyan-600" />
                                                                                    </div>
                                                                                    <h4 className="font-bold text-gray-900">Exames Recentes (Últimos 30 dias)</h4>
                                                                                    <Badge className="ml-auto bg-cyan-100 text-cyan-700 border-0 text-[10px]">2 novos</Badge>
                                                                                </div>

                                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                                                    <div className="bg-gradient-to-br from-green-50 to-white p-3 rounded-lg border-2 border-green-200">
                                                                                        <div className="flex items-start justify-between mb-2">
                                                                                            <div>
                                                                                                <p className="text-sm font-bold text-gray-900">Hemograma Completo</p>
                                                                                                <p className="text-xs text-gray-500">10/11/2024</p>
                                                                                            </div>
                                                                                            <Badge className="bg-green-600 text-white border-0 text-[10px] h-5">Normal</Badge>
                                                                                        </div>
                                                                                        <Button variant="link" className="text-cyan-600 text-xs p-0 h-auto">
                                                                                            Visualizar <ArrowRight className="h-3 w-3 ml-1" />
                                                                                        </Button>
                                                                                    </div>

                                                                                    <div className="bg-gradient-to-br from-yellow-50 to-white p-3 rounded-lg border-2 border-yellow-300">
                                                                                        <div className="flex items-start justify-between mb-2">
                                                                                            <div>
                                                                                                <p className="text-sm font-bold text-gray-900">Perfil Lipídico</p>
                                                                                                <p className="text-xs text-gray-500">10/11/2024</p>
                                                                                            </div>
                                                                                            <Badge className="bg-yellow-600 text-white border-0 text-[10px] h-5">Limítrofe</Badge>
                                                                                        </div>
                                                                                        <p className="text-xs text-yellow-800 mb-2">Colesterol Total: 210 mg/dL</p>
                                                                                        <Button variant="link" className="text-cyan-600 text-xs p-0 h-auto">
                                                                                            Visualizar <ArrowRight className="h-3 w-3 ml-1" />
                                                                                        </Button>
                                                                                    </div>
                                                                                </div>
                                                                            </CardContent>
                                                                        </Card>

                                                                        {/* Alertas e Pendências */}
                                                                        <Card className="border-2 border-amber-200 shadow-md bg-amber-50/30">
                                                                            <CardContent className="p-4">
                                                                                <div className="flex items-center gap-2 mb-3">
                                                                                    <AlertCircle className="h-4 w-4 text-amber-600" />
                                                                                    <h4 className="font-bold text-sm text-gray-900">Atenção</h4>
                                                                                </div>

                                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                                                    <div className="bg-amber-100 p-3 rounded-lg border border-amber-300">
                                                                                        <p className="text-xs font-bold text-amber-900 mb-1">Pendências</p>
                                                                                        <ul className="text-xs text-amber-800 space-y-1">
                                                                                            <li className="flex items-center gap-2">
                                                                                                <div className="h-1.5 w-1.5 rounded-full bg-amber-600" />
                                                                                                Renovar receita de Sinvastatina (vence em 15 dias)
                                                                                            </li>
                                                                                            <li className="flex items-center gap-2">
                                                                                                <div className="h-1.5 w-1.5 rounded-full bg-amber-600" />
                                                                                                Agendar retorno em 3 meses (Feb/2025)
                                                                                            </li>
                                                                                        </ul>
                                                                                    </div>

                                                                                    <div className="bg-green-100 p-3 rounded-lg border border-green-300">
                                                                                        <p className="text-xs font-bold text-green-900 mb-1">Sem Alertas Críticos</p>
                                                                                        <p className="text-xs text-green-700">Nenhuma interação medicamentosa detectada. Adesão ao tratamento: boa.</p>
                                                                                    </div>
                                                                                </div>
                                                                            </CardContent>
                                                                        </Card>

                                                                        {/* Timeline Compacta (Opcional - Colapsável) */}
                                                                        <details className="group">
                                                                            <summary className="cursor-pointer list-none">
                                                                                <Card className="border border-gray-300 shadow-sm hover:shadow-md transition-shadow">
                                                                                    <CardContent className="p-4">
                                                                                        <div className="flex items-center justify-between">
                                                                                            <div className="flex items-center gap-2">
                                                                                                <Calendar className="h-4 w-4 text-gray-500" />
                                                                                                <h4 className="font-bold text-sm text-gray-900">Evolução (Últimas Consultas)</h4>
                                                                                            </div>
                                                                                            <ChevronDown className="h-4 w-4 text-gray-500 group-open:rotate-180 transition-transform" />
                                                                                        </div>
                                                                                    </CardContent>
                                                                                </Card>
                                                                            </summary>

                                                                            <div className="mt-3 pl-4 border-l-2 border-gray-200 space-y-4 ml-2">
                                                                                <div className="relative">
                                                                                    <div className="absolute -left-[17px] top-1 h-3 w-3 rounded-full bg-purple-500 border-2 border-white" />
                                                                                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                                                                                        <div className="flex justify-between items-start mb-1">
                                                                                            <p className="text-xs font-bold text-gray-900">Rotina - Acompanhamento</p>
                                                                                            <p className="text-[10px] text-gray-500">15/11/2024</p>
                                                                                        </div>
                                                                                        <p className="text-xs text-gray-600">PA controlada, mantida medicação.</p>
                                                                                    </div>
                                                                                </div>

                                                                                <div className="relative">
                                                                                    <div className="absolute -left-[17px] top-1 h-3 w-3 rounded-full bg-blue-500 border-2 border-white" />
                                                                                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                                                                                        <div className="flex justify-between items-start mb-1">
                                                                                            <p className="text-xs font-bold text-gray-900">Check-up Semestral</p>
                                                                                            <p className="text-[10px] text-gray-500">15/08/2024</p>
                                                                                        </div>
                                                                                        <p className="text-xs text-gray-600">Exames laboratoriais solicitados. Ajuste de dose.</p>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </details>
                                                                    </div>
                                                                ) : (
                                                                    <div className="text-center py-12">
                                                                        <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                                                                        <p className="text-sm font-medium text-gray-600 mb-1">Nenhuma consulta registrada</p>
                                                                        <p className="text-xs text-gray-500">O histórico clínico aparecerá aqui</p>
                                                                    </div>
                                                                )}
                                                            </TabsContent>


                                                        </Tabs>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>

                                            {/* Action Buttons */}
                                            <div className={cn("grid gap-2", isExpanded ? "grid-cols-1 mt-4" : "grid-cols-2")}>
                                                <Button
                                                    onClick={() => handleStartConsultation(patient)}
                                                    className="bg-gradient-to-r from-[#8C00FF] to-[#450693] hover:opacity-90 text-white"
                                                >
                                                    <Activity className="mr-2 h-4 w-4" />
                                                    Iniciar Consulta
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    onClick={() => toggleExpand(patient.id)}
                                                    className="border-purple-200 text-purple-700 hover:bg-purple-50"
                                                >
                                                    <Eye className="mr-2 h-4 w-4" />
                                                    {isExpanded ? 'Ver Menos' : 'Ver Detalhes'}
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </AppLayout >
    );
};

export default MedicalPatientsPage;
