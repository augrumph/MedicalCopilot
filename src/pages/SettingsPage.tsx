import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
    FileText,
    Shield,
    ArrowLeft,
    Trash2,
    Bell,
    Lock,
    Stethoscope,
    Building2,
    Cloud,
    MapPin,
    Mail,
    Phone,
    BookOpen,
    ChevronRight,
    CreditCard,
    CheckCircle2,
    TrendingUp,
    Mic,
    FileCheck,
    Activity,
    Crown,
    Receipt,
    Download,
    ExternalLink,
    Sparkles,
    ArrowUpRight,
    Zap,
    Plus,
} from 'lucide-react';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useAppStore } from '@/stores/appStore';
import { cn } from '@/lib/utils';
import PageTransition from '@/components/PageTransition';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import TutorialModal, { useTutorialSeen } from '@/components/TutorialModal';

type SettingsTab = 'medical' | 'clinical' | 'clinic' | 'billing' | 'privacy' | 'appearance';

const USAGE = [
    { label: 'Atendimentos com IA', used: 247, limit: 500, icon: Mic, color: 'bg-violet-500' },
    { label: 'Documentos Gerados', used: 89, limit: 200, icon: FileCheck, color: 'bg-emerald-500' },
    { label: 'Análises de Protocolo', used: 34, limit: 100, icon: Activity, color: 'bg-sky-500' },
];

const BILLING_HISTORY = [
    { date: '15 Mar, 2026', description: 'Medical Copilot Pro', amount: 'R$ 149,00', status: 'Pago' },
    { date: '15 Fev, 2026', description: 'Medical Copilot Pro', amount: 'R$ 149,00', status: 'Pago' },
    { date: '15 Jan, 2026', description: 'Medical Copilot Pro', amount: 'R$ 149,00', status: 'Pago' },
    { date: '15 Dez, 2025', description: 'Medical Copilot Pro', amount: 'R$ 149,00', status: 'Pago' },
];

const PLANS = [
    {
        id: 'starter',
        name: 'Starter',
        price: 'Grátis',
        period: '',
        description: 'Para conhecer a plataforma',
        features: ['50 atendimentos/mês', '20 documentos', 'Suporte por e-mail'],
        current: false,
        highlight: false,
    },
    {
        id: 'pro',
        name: 'Pro',
        price: 'R$ 149',
        period: '/mês',
        description: 'Para médicos em plena atividade',
        features: ['500 atendimentos/mês', '200 documentos', 'Análise de protocolos', 'Suporte prioritário', 'Backup Pro'],
        current: true,
        highlight: true,
    },
    {
        id: 'enterprise',
        name: 'Enterprise',
        price: 'Sob consulta',
        period: '',
        description: 'Para hospitais e clínicas',
        features: ['Ilimitado', 'Multi-usuário', 'API dedicada', 'Gerente de conta', 'SLA garantido'],
        current: false,
        highlight: false,
    },
];

const API = import.meta.env.VITE_BACKEND_URL || 'https://api.medicalcopilot.com.br';

const SHIFT_PLANS = [
    { shifts: 1,  label: '1 plantão',   price: 'R$ 99',  pricePerShift: 'R$ 99/plantão',   badge: null,            featured: false },
    { shifts: 5,  label: '5 plantões',  price: 'R$ 445', pricePerShift: 'R$ 89/plantão',   badge: 'Mais escolhido', featured: true  },
    { shifts: 10, label: '10 plantões', price: 'R$ 792', pricePerShift: 'R$ 79/plantão',   badge: '−20%',          featured: false },
];

function PlantõesCard({ navigate }: { navigate: (path: string) => void }) {
    const [selected, setSelected] = useState(5);

    const { data } = useQuery({
        queryKey: ['access-status'],
        queryFn: async () => {
            const res = await fetch(`${API}/api/access/status`, { credentials: 'include' });
            if (!res.ok) return null;
            return res.json().then((j: any) => j.data);
        },
        refetchInterval: 30_000,
    });

    const available: number = data?.availableCount ?? 0;
    const hasActive: boolean = data?.hasActiveAccess ?? false;
    const minutesLeft: number = data?.minutesRemaining ?? 0;
    const hoursLeft = Math.floor(minutesLeft / 60);
    const minsLeft = minutesLeft % 60;

    return (
        <Card className="bg-white border-slate-200 p-6 rounded-3xl shadow-sm">
            {/* header */}
            <div className="flex items-center justify-between mb-5">
                <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1" style={{ color: '#512B81' }}>Plantões</p>
                    <h3 className="font-bold text-slate-900 text-[18px] leading-tight">
                        {available > 0
                            ? <>{available} <span className="text-slate-400 font-normal text-[14px]">{available === 1 ? 'plantão disponível' : 'plantões disponíveis'}</span></>
                            : 'Sem plantões'
                        }
                    </h3>
                    {hasActive && (
                        <div className="flex items-center gap-1.5 mt-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <p className="text-[11px] font-semibold text-emerald-600">
                                Plantão ativo · {hoursLeft}h{minsLeft > 0 ? ` ${minsLeft}min` : ''} restantes
                            </p>
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] font-semibold" style={{ background: '#F3EEFF', color: '#512B81' }}>
                    <Zap className="h-3.5 w-3.5" />
                    13h / plantão
                </div>
            </div>

            {/* plan selector */}
            <div className="grid grid-cols-3 gap-2.5 mb-4">
                {SHIFT_PLANS.map((plan) => {
                    const isSel = selected === plan.shifts;
                    return (
                        <button
                            key={plan.shifts}
                            onClick={() => setSelected(plan.shifts)}
                            className="relative flex flex-col rounded-2xl p-3.5 text-left transition-all duration-150"
                            style={
                                plan.featured && isSel
                                    ? { background: '#512B81', boxShadow: '0 8px 24px rgba(81,43,129,0.35)', border: '2px solid #512B81' }
                                    : plan.featured
                                    ? { background: '#512B81', opacity: 0.9, border: '2px solid #512B81' }
                                    : isSel
                                    ? { background: '#F3EEFF', border: '2px solid #512B81', boxShadow: '0 0 0 3px rgba(81,43,129,0.1)' }
                                    : { background: '#FAFAFA', border: '1.5px solid #E5E7EB' }
                            }
                        >
                            {plan.badge && (
                                <span
                                    className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[9px] font-black whitespace-nowrap"
                                    style={plan.featured ? { background: 'white', color: '#512B81' } : { background: '#512B81', color: 'white' }}
                                >
                                    {plan.badge}
                                </span>
                            )}
                            <p className="text-[11px] font-semibold mb-1 mt-0.5" style={{ color: plan.featured ? 'rgba(255,255,255,0.65)' : '#888' }}>{plan.label}</p>
                            <p className="text-[16px] font-bold leading-none" style={{ color: plan.featured ? 'white' : '#111' }}>{plan.price}</p>
                            <p className="text-[9px] mt-1" style={{ color: plan.featured ? 'rgba(255,255,255,0.5)' : '#AAA' }}>{plan.pricePerShift}</p>
                        </button>
                    );
                })}
            </div>

            {/* CTA */}
            <button
                onClick={() => navigate(`/checkout?shifts=${selected}`)}
                className="btn-primary-shimmer w-full h-11 rounded-xl text-[14px] font-bold text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                style={{ background: '#512B81', boxShadow: '0 4px 18px rgba(81,43,129,0.3)' }}
            >
                <Plus className="h-4 w-4" />
                Comprar {SHIFT_PLANS.find(p => p.shifts === selected)?.label}
            </button>

            <p className="text-center text-[10px] text-slate-400 mt-3">
                Pix · Cartão de crédito · Créditos sem validade
            </p>
        </Card>
    );
}

function SettingsPage() {
    const navigate = useNavigate();
    const {
        doctorName,
        doctorSpecialty,
        doctorCRM,
        doctorUF,
        clinicName,
        autoDeleteAudio,
        prescriptionValidityDays,
        antibioticValidityDays,
        defaultPrescriptionInstructions,
        setDoctorName,
        setDoctorSpecialty,
        setDoctorCRM,
        setDoctorUF,
        setClinicName,
        setAutoDeleteAudio,
        setPrescriptionValidityDays,
        setAntibioticValidityDays,
        setDefaultPrescriptionInstructions,
    } = useAppStore();

    const [activeTab, setActiveTab] = useState<SettingsTab>('medical');
    const [isSaving, setIsSaving] = useState(false);
    const [showTutorial, setShowTutorial] = useState(false);
    const tutorialSeen = useTutorialSeen();

    const handleSaveSettings = async () => {
        setIsSaving(true);
        await new Promise(resolve => setTimeout(resolve, 600));
        setIsSaving(false);
        toast.success('Configurações salvas com sucesso');
    };

    const TABS = [
        { id: 'medical',    label: 'Identidade',  icon: Stethoscope },
        { id: 'clinical',   label: 'Prescrições', icon: FileText    },
        { id: 'clinic',     label: 'Consultório', icon: Building2   },
        { id: 'billing',    label: 'Plano & Uso',  icon: CreditCard  },
        { id: 'privacy',    label: 'Segurança',   icon: Shield      },
        { id: 'appearance', label: 'Preferências',icon: Bell        },
    ] as const;

    return (
        <>
            <AppLayout>
                <PageTransition>
                    <div className="max-w-4xl mx-auto pb-20 px-4 sm:px-6 pt-8">

                        {/* Header */}
                        <div className="mb-8 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => navigate('/worklist')}
                                    className="h-9 w-9 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors flex-shrink-0"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                                <div>
                                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900">Configurações</h1>
                                    <p className="text-slate-500 text-xs font-medium mt-0.5">Gestão profissional da sua conta</p>
                                </div>
                            </div>

                            <Button
                                onClick={handleSaveSettings}
                                disabled={isSaving}
                                className="bg-slate-900 hover:bg-slate-800 text-white rounded-full h-9 px-6 shadow-sm transition-all font-semibold text-xs border-none flex-shrink-0"
                            >
                                {isSaving ? 'Salvando...' : 'Salvar'}
                            </Button>
                        </div>

                        {/* Horizontal Tab Bar */}
                        <div className="mb-8 overflow-x-auto pb-1 -mx-1 px-1">
                            <div className="flex items-center gap-1 min-w-max bg-slate-100/80 p-1 rounded-2xl w-fit">
                                {TABS.map((tab) => {
                                    const Icon = tab.icon;
                                    const isActive = activeTab === tab.id;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={cn(
                                                "flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap outline-none text-sm font-semibold",
                                                isActive
                                                    ? tab.id === 'billing'
                                                        ? "bg-violet-600 text-white shadow-sm shadow-violet-200"
                                                        : "bg-white text-slate-900 shadow-sm"
                                                    : "text-slate-500 hover:text-slate-700 hover:bg-white/50"
                                            )}
                                        >
                                            <Icon className="h-3.5 w-3.5 flex-shrink-0" />
                                            <span>{tab.label}</span>
                                            {tab.id === 'billing' && isActive && (
                                                <span className="ml-0.5 text-[9px] font-black bg-yellow-400 text-yellow-900 px-1.5 py-0.5 rounded-full">PRO</span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Tab Content */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -4 }}
                                transition={{ duration: 0.18 }}
                            >
                                {/* ── BILLING (special multi-card layout) ── */}
                                {activeTab === 'billing' ? (
                                    <div className="space-y-5">

                                        {/* Current Plan Banner */}
                                        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#2D1260] via-[#3b1a7a] to-[#1a0d3d] p-7 text-white">
                                            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #ffffff22 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                                            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <Crown className="h-3.5 w-3.5 text-yellow-400" />
                                                        <span className="text-[10px] font-bold text-yellow-400 uppercase tracking-wider">Plano Ativo</span>
                                                    </div>
                                                    <h2 className="text-2xl font-bold mb-1">
                                                        Pro
                                                        <span className="text-base font-normal text-white/60 ml-2">R$ 149/mês</span>
                                                    </h2>
                                                    <p className="text-xs text-white/60">Renova automaticamente em 15 de Abril, 2026</p>
                                                </div>
                                                <div className="flex flex-row sm:flex-col gap-2 sm:items-end">
                                                    <div className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-1.5">
                                                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                                                        <span className="text-xs font-semibold">Ativo</span>
                                                    </div>
                                                    <Button variant="ghost" size="sm" className="text-white/70 hover:text-white hover:bg-white/10 text-xs h-8 px-3 rounded-full">
                                                        Gerenciar
                                                        <ExternalLink className="h-3 w-3 ml-1" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Plantões card */}
                                        <PlantõesCard navigate={navigate} />

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            {/* Usage */}
                                            <Card className="bg-white border-slate-200 p-6 rounded-3xl shadow-sm">
                                                <div className="flex items-center justify-between mb-5">
                                                    <div>
                                                        <h3 className="font-semibold text-slate-900 text-sm">Uso Este Mês</h3>
                                                        <p className="text-[10px] text-slate-400 mt-0.5">15 Mar — 15 Abr, 2026</p>
                                                    </div>
                                                    <TrendingUp className="h-4 w-4 text-slate-300" />
                                                </div>
                                                <div className="space-y-4">
                                                    {USAGE.map((item) => {
                                                        const Icon = item.icon;
                                                        const pct = Math.round((item.used / item.limit) * 100);
                                                        return (
                                                            <div key={item.label}>
                                                                <div className="flex items-center justify-between mb-1.5">
                                                                    <div className="flex items-center gap-1.5">
                                                                        <Icon className="h-3 w-3 text-slate-400" />
                                                                        <span className="text-xs font-semibold text-slate-700">{item.label}</span>
                                                                    </div>
                                                                    <span className="text-[10px] font-bold text-slate-400">{item.used} / {item.limit}</span>
                                                                </div>
                                                                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                                    <div className={cn("h-full rounded-full", item.color)} style={{ width: `${pct}%` }} />
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </Card>

                                            {/* Payment Method */}
                                            <Card className="bg-white border-slate-200 p-6 rounded-3xl shadow-sm">
                                                <div className="flex items-center justify-between mb-5">
                                                    <h3 className="font-semibold text-slate-900 text-sm">Pagamento</h3>
                                                    <Button variant="ghost" size="sm" className="text-xs text-slate-400 hover:text-slate-900 h-7 px-2 rounded-lg">Alterar</Button>
                                                </div>
                                                <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-4">
                                                    <div className="w-10 h-7 bg-gradient-to-br from-slate-700 to-slate-900 rounded-md flex items-center justify-center flex-shrink-0">
                                                        <CreditCard className="h-3.5 w-3.5 text-white" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-xs font-semibold text-slate-900 truncate">•••• •••• •••• 4242</p>
                                                        <p className="text-[10px] text-slate-400">Vence 12/2028</p>
                                                    </div>
                                                    <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                                                </div>
                                                <div className="mt-auto">
                                                    <p className="text-[10px] text-slate-400 font-medium mb-2">Próxima cobrança</p>
                                                    <p className="text-lg font-bold text-slate-900">R$ 149,00 <span className="text-xs font-normal text-slate-400">em 15 Abr</span></p>
                                                </div>
                                            </Card>
                                        </div>

                                        {/* Plan Comparison */}
                                        <Card className="bg-white border-slate-200 p-6 rounded-3xl shadow-sm">
                                            <div className="flex items-center justify-between mb-5">
                                                <div>
                                                    <h3 className="font-semibold text-slate-900 text-sm">Comparar Planos</h3>
                                                    <p className="text-[10px] text-slate-400 mt-0.5">Faça upgrade a qualquer momento</p>
                                                </div>
                                                <Sparkles className="h-4 w-4 text-violet-400" />
                                            </div>
                                            <div className="grid grid-cols-3 gap-3">
                                                {PLANS.map((plan) => (
                                                    <div
                                                        key={plan.id}
                                                        className={cn(
                                                            "relative rounded-2xl p-4 flex flex-col gap-3",
                                                            plan.highlight
                                                                ? "bg-gradient-to-b from-[#2D1260] to-[#1a0d3d] text-white shadow-lg shadow-violet-900/20"
                                                                : "bg-slate-50 border border-slate-100"
                                                        )}
                                                    >
                                                        {plan.current && (
                                                            <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                                                                <span className="text-[9px] font-black bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full whitespace-nowrap">ATUAL</span>
                                                            </div>
                                                        )}
                                                        <div>
                                                            <p className={cn("text-[10px] font-black uppercase tracking-wider mb-0.5", plan.highlight ? "text-violet-300" : "text-slate-400")}>{plan.name}</p>
                                                            <p className={cn("text-lg font-bold leading-none", plan.highlight ? "text-white" : "text-slate-900")}>
                                                                {plan.price}
                                                                <span className={cn("text-xs font-normal", plan.highlight ? "text-white/60" : "text-slate-400")}>{plan.period}</span>
                                                            </p>
                                                        </div>
                                                        <ul className="space-y-1.5 flex-1">
                                                            {plan.features.map((f) => (
                                                                <li key={f} className="flex items-start gap-1.5">
                                                                    <CheckCircle2 className={cn("h-3 w-3 mt-0.5 flex-shrink-0", plan.highlight ? "text-violet-300" : "text-emerald-500")} />
                                                                    <span className={cn("text-[10px] font-medium leading-tight", plan.highlight ? "text-white/80" : "text-slate-600")}>{f}</span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                        {!plan.current && (
                                                            <Button size="sm" className={cn("h-8 rounded-xl text-[10px] font-bold w-full mt-1 px-2", plan.id === 'enterprise' ? "bg-slate-900 hover:bg-slate-800 text-white" : "bg-violet-600 hover:bg-violet-700 text-white")}>
                                                                {plan.id === 'starter' ? 'Downgrade' : 'Upgrade'}
                                                                <ArrowUpRight className="h-2.5 w-2.5 ml-1" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </Card>

                                        {/* Billing History */}
                                        <Card className="bg-white border-slate-200 p-6 rounded-3xl shadow-sm">
                                            <div className="flex items-center justify-between mb-5">
                                                <h3 className="font-semibold text-slate-900 text-sm">Histórico de Cobranças</h3>
                                                <Receipt className="h-4 w-4 text-slate-300" />
                                            </div>
                                            <div className="space-y-2">
                                                {BILLING_HISTORY.map((item, i) => (
                                                    <div key={i} className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors group">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center flex-shrink-0">
                                                                <FileText className="h-3 w-3 text-slate-400" />
                                                            </div>
                                                            <div>
                                                                <p className="text-xs font-semibold text-slate-900">{item.description}</p>
                                                                <p className="text-[10px] text-slate-400">{item.date}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2.5">
                                                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{item.status}</span>
                                                            <span className="text-xs font-bold text-slate-900">{item.amount}</span>
                                                            <Button variant="ghost" size="icon" className="h-6 w-6 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <Download className="h-2.5 w-2.5 text-slate-400" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </Card>
                                    </div>
                                ) : (
                                    <Card className="bg-white border-slate-200 p-7 md:p-9 shadow-sm rounded-3xl">

                                        {/* Identidade Médica */}
                                        {activeTab === 'medical' && (
                                            <div className="space-y-7">
                                                <div>
                                                    <h2 className="text-lg font-semibold text-slate-900 mb-1">Identidade Profissional</h2>
                                                    <p className="text-slate-500 text-sm">Dados fundamentais para seus registros e documentos clínicos.</p>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                    <div className="space-y-2">
                                                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Nome Completo</label>
                                                        <Input value={doctorName} onChange={(e) => setDoctorName(e.target.value)} className="h-11 px-4 rounded-xl border-slate-200 font-medium" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Especialidade / RQE</label>
                                                        <Input value={doctorSpecialty} onChange={(e) => setDoctorSpecialty(e.target.value)} className="h-11 px-4 rounded-xl border-slate-200 font-medium" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Número do CRM</label>
                                                        <Input value={doctorCRM} onChange={(e) => setDoctorCRM(e.target.value)} className="h-11 px-4 rounded-xl border-slate-200 font-medium" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">UF do Conselho</label>
                                                        <Select value={doctorUF} onValueChange={setDoctorUF}>
                                                            <SelectTrigger className="h-11 px-4 rounded-xl border-slate-200 font-medium">
                                                                <SelectValue placeholder="Estado" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {['AC','AL','AM','AP','BA','CE','DF','ES','GO','MA','MG','MS','MT','PA','PB','PE','PI','PR','RJ','RN','RO','RR','RS','SC','SE','SP','TO'].map(uf => (
                                                                    <SelectItem key={uf} value={uf}>{uf} - CRM/{uf}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Estatutos Clínicos */}
                                        {activeTab === 'clinical' && (
                                            <div className="space-y-7">
                                                <div>
                                                    <h2 className="text-lg font-semibold text-slate-900 mb-1">Estatutos Clínicos</h2>
                                                    <p className="text-slate-500 text-sm">Defina os padrões de validade para suas prescrições automáticas.</p>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                                                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-3">Receita Comum</label>
                                                        <div className="flex items-center gap-3">
                                                            <Input type="number" value={prescriptionValidityDays} onChange={(e) => setPrescriptionValidityDays(Number(e.target.value))} className="h-10 w-20 px-3 rounded-lg border-slate-200 font-semibold text-center" />
                                                            <span className="text-sm font-medium text-slate-600">Dias Corridos</span>
                                                        </div>
                                                    </div>
                                                    <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100">
                                                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-3">Antibióticos</label>
                                                        <div className="flex items-center gap-3">
                                                            <Input type="number" value={antibioticValidityDays} onChange={(e) => setAntibioticValidityDays(Number(e.target.value))} className="h-10 w-20 px-3 rounded-lg border-slate-200 font-semibold text-center" />
                                                            <span className="text-sm font-medium text-slate-600">Dias Corridos</span>
                                                        </div>
                                                    </div>
                                                    <div className="md:col-span-2 space-y-2">
                                                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Observações de Rodapé (Auto-Fill)</label>
                                                        <Textarea value={defaultPrescriptionInstructions} onChange={(e) => setDefaultPrescriptionInstructions(e.target.value)} rows={4} className="w-full rounded-2xl border-slate-200 font-medium p-4 text-sm resize-none" placeholder="Rodapé padrão para todas as prescrições..." />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Consultório */}
                                        {activeTab === 'clinic' && (
                                            <div className="space-y-7">
                                                <div>
                                                    <h2 className="text-lg font-semibold text-slate-900 mb-1">Unidade de Atendimento</h2>
                                                    <p className="text-slate-500 text-sm">Informações do local onde os atendimentos são realizados.</p>
                                                </div>
                                                <div className="space-y-5">
                                                    <div className="space-y-2">
                                                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Hospital / Clínica</label>
                                                        <div className="relative">
                                                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                                            <Input value={clinicName} onChange={(e) => setClinicName(e.target.value)} className="h-11 pl-12 pr-4 rounded-xl border-slate-200 font-medium" />
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                                        <div className="space-y-2">
                                                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">E-mail de Contato</label>
                                                            <div className="relative">
                                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                                                <Input className="h-11 pl-12 pr-4 rounded-xl border-slate-200 font-medium" placeholder="recepcao@hospital.com" />
                                                            </div>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Telefone da Unidade</label>
                                                            <div className="relative">
                                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                                                <Input className="h-11 pl-12 pr-4 rounded-xl border-slate-200 font-medium" placeholder="+55 00 0000-0000" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider ml-1">Endereço Profissional</label>
                                                        <div className="relative">
                                                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                                            <Input className="h-11 pl-12 pr-4 rounded-xl border-slate-200 font-medium" placeholder="Av. Principal, 123 - Centro" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Segurança */}
                                        {activeTab === 'privacy' && (
                                            <div className="space-y-7">
                                                <div>
                                                    <h2 className="text-lg font-semibold text-slate-900 mb-1">Segurança & Dados</h2>
                                                    <p className="text-slate-500 text-sm">Configurações para conformidade com a LGPD médica.</p>
                                                </div>
                                                <div className="space-y-4">
                                                    <div className="p-5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between">
                                                        <div className="space-y-0.5 pe-4">
                                                            <h4 className="font-semibold text-sm text-slate-900">Auto-Exclusão de Áudio</h4>
                                                            <p className="text-xs text-slate-500">Deletar arquivos de voz originais após transcrição da IA.</p>
                                                        </div>
                                                        <Switch checked={autoDeleteAudio} onCheckedChange={setAutoDeleteAudio} />
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-4">
                                                            <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center border border-slate-200">
                                                                <Lock className="h-4 w-4 text-slate-400" />
                                                            </div>
                                                            <div>
                                                                <h4 className="font-semibold text-sm text-slate-900">Senha</h4>
                                                                <p className="text-[11px] font-medium text-slate-500">Alterar credenciais de segurança.</p>
                                                            </div>
                                                            <Button variant="outline" className="h-9 rounded-xl text-xs font-semibold border-slate-200 bg-white">Alterar</Button>
                                                        </div>
                                                        <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col gap-4">
                                                            <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center border border-red-100">
                                                                <Trash2 className="h-4 w-4 text-red-400" />
                                                            </div>
                                                            <div>
                                                                <h4 className="font-semibold text-sm text-red-600">Encerrar Conta</h4>
                                                                <p className="text-[11px] font-medium text-slate-500">Exclusão irreversível de registros.</p>
                                                            </div>
                                                            <Button variant="ghost" className="h-9 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50">Solicitar</Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Preferências */}
                                        {activeTab === 'appearance' && (
                                            <div className="space-y-7">
                                                <div>
                                                    <h2 className="text-lg font-semibold text-slate-900 mb-1">Preferências</h2>
                                                    <p className="text-slate-500 text-sm">Ajuste o visual e o comportamento do sistema.</p>
                                                </div>
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-100">
                                                        <div className="space-y-0.5">
                                                            <h4 className="font-semibold text-sm text-slate-900">Modo de Interface</h4>
                                                            <p className="text-xs text-slate-500">Alterne entre o visual claro ou escuro.</p>
                                                        </div>
                                                        <div className="flex p-1 bg-white rounded-lg border border-slate-200">
                                                            <button className="px-3 py-1.5 text-xs font-semibold rounded-md bg-slate-900 text-white shadow-sm">Claro</button>
                                                            <button className="px-3 py-1.5 text-xs font-semibold text-slate-400">Escuro</button>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-100">
                                                        <div className="space-y-0.5">
                                                            <h4 className="font-semibold text-sm text-slate-900">Notificações</h4>
                                                            <p className="text-xs text-slate-500">Alertas críticos de protocolos e plantão.</p>
                                                        </div>
                                                        <Switch defaultChecked />
                                                    </div>
                                                    <div
                                                        className="flex items-center justify-between p-5 rounded-2xl bg-gradient-to-r from-[#2D1260] to-[#1a0d3d] text-white cursor-pointer hover:opacity-90 transition-opacity"
                                                        onClick={() => setShowTutorial(true)}
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                                                                <BookOpen className="w-4 h-4 text-purple-300" />
                                                            </div>
                                                            <div>
                                                                <h4 className="font-semibold text-sm">Tour do sistema</h4>
                                                                <p className="text-xs text-white/50 mt-0.5">Revisitar o tutorial de introdução.</p>
                                                            </div>
                                                        </div>
                                                        <ChevronRight className="w-4 h-4 text-white/40" />
                                                    </div>
                                                    <div className="p-5 rounded-2xl bg-slate-900 text-white flex items-center justify-between overflow-hidden relative">
                                                        <div className="relative z-10">
                                                            <h4 className="font-semibold text-sm mb-0.5">Backup Pro</h4>
                                                            <p className="text-xs text-white/60">Redundância de dados ativada.</p>
                                                        </div>
                                                        <Cloud className="absolute -right-4 -bottom-4 h-20 w-20 text-white/5" />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                    </Card>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </PageTransition>
            </AppLayout>

            <TutorialModal
                isOpen={showTutorial}
                onClose={() => { tutorialSeen.markSeen(); setShowTutorial(false); }}
                onComplete={() => { tutorialSeen.markSeen(); setShowTutorial(false); }}
                userName={doctorName}
            />
        </>
    );
}

export { SettingsPage };
