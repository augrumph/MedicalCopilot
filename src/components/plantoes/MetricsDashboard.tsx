import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { PiggyBank, ClockAlert, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useFinanceStore } from '@/stores/financeStore';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export function MetricsDashboard() {
    const { shifts, monthlyGoal } = useFinanceStore();

    const metrics = useMemo(() => {
        let recebido = 0;
        let aReceber = 0;
        let atrasado = 0;
        let glosado = 0;

        shifts.forEach(shift => {
            if (shift.status === 'pago') recebido += shift.grossValue;
            if (shift.status === 'aguardando') aReceber += shift.grossValue;
            if (shift.status === 'atrasado') atrasado += shift.grossValue;
            if (shift.status === 'glosa') glosado += shift.grossValue;
        });

        const totalTrabalhado = recebido + aReceber + atrasado + glosado;

        const goalProgress = monthlyGoal > 0 ? Math.min((totalTrabalhado / monthlyGoal) * 100, 100) : 0;

        return {
            recebido,
            aReceber,
            atrasado,
            glosado,
            totalTrabalhado,
            goalProgress
        };
    }, [shifts, monthlyGoal]);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    const cards = [
        {
            title: 'Já Recebido',
            value: formatCurrency(metrics.recebido),
            icon: CheckCircle2,
            description: 'Disponível em conta',
            iconBg: 'bg-[#512B81]/5 text-[#512B81]',
            accent: 'purple'
        },
        {
            title: 'A Receber',
            value: formatCurrency(metrics.aReceber),
            icon: ClockAlert,
            description: 'Pagamento previsto',
            iconBg: 'bg-slate-50 text-slate-400',
            accent: 'slate'
        },
        {
            title: 'Atrasos / Glosas',
            value: formatCurrency(metrics.atrasado + metrics.glosado),
            icon: AlertTriangle,
            description: 'Requer atenção',
            iconBg: 'bg-red-50 text-red-500',
            highlight: true,
            hasGlosas: metrics.glosado > 0,
            accent: 'red'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-min">

            {/* Cards de Valores - 3 colunas em lg */}
            <div className="md:col-span-12 lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
                {cards.map((stat, index) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.05 + index * 0.1 }}
                    >
                        <Card className={cn(
                            "relative overflow-hidden rounded-[32px] border border-slate-100 shadow-sm transition-all h-full bg-white group hover:shadow-xl hover:shadow-purple-900/5",
                            stat.highlight && (metrics.atrasado > 0 || metrics.glosado > 0) && "border-red-100 bg-red-50/10"
                        )}>
                            <CardContent className="p-8 flex flex-col justify-between h-full min-h-[200px]">
                                <div>
                                    <div className="flex justify-between items-start mb-6">
                                        <div className={cn("p-4 rounded-2xl shadow-sm border border-slate-50", stat.iconBg)}>
                                            <stat.icon className="h-6 w-6" />
                                        </div>
                                        {stat.hasGlosas && (
                                            <Badge variant="destructive" className="bg-red-500 border-0 rounded-full px-3 text-[10px] font-black tracking-widest">GLOSA</Badge>
                                        )}
                                    </div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
                                        {stat.title}
                                    </p>
                                    <h2 className={cn(
                                        "text-3xl font-black tracking-tight tabular-nums truncate text-[#1b1b1b]",
                                        stat.highlight && (metrics.atrasado > 0 || metrics.glosado > 0) && "text-red-600"
                                    )}>
                                        {stat.value}
                                    </h2>
                                </div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-auto pt-4 flex items-center gap-2">
                                    {stat.highlight && (metrics.atrasado > 0 || metrics.glosado > 0) && <span className="h-1.5 w-1.5 rounded-full bg-red-500 shrink-0 animate-pulse" />}
                                    {stat.description}
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Meta e Resumo Mensal */}
            <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="md:col-span-12 lg:col-span-4"
            >
                <Card className="rounded-3xl bg-white shadow-xl border border-slate-200 h-full relative overflow-hidden group">
                    <CardContent className="p-8 flex flex-col justify-between h-full min-h-[180px] relative z-10">
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <Badge className="bg-[#1b1b1b] text-white border-0 px-3 py-1 rounded-full text-[10px] font-black tracking-widest shadow-[0_4px_12px_rgba(27,27,27,0.2)]">
                                    META MENSAL
                                </Badge>
                                <PiggyBank className="text-[#512B81] w-6 h-6" />
                            </div>
                            <h3 className="text-3xl font-bold text-[#1b1b1b] tracking-tight tabular-nums mb-1">
                                {formatCurrency(metrics.totalTrabalhado)}
                            </h3>
                            <p className="text-sm font-bold text-slate-400">
                                faturamento projetado
                            </p>
                        </div>

                        <div className="mt-8 space-y-4">
                            <div>
                                <div className="flex justify-between text-[11px] text-white/60 font-bold mb-2 uppercase tracking-widest">
                                    <span>Progresso</span>
                                    <span className="text-white">{metrics.goalProgress.toFixed(0)}%</span>
                                </div>
                                <div className="relative h-2 w-full bg-white/10 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${metrics.goalProgress}%` }}
                                        transition={{ duration: 1.2, ease: [0.34, 1.56, 0.64, 1], delay: 0.5 }}
                                        className={cn(
                                            "absolute top-0 left-0 h-full rounded-full",
                                            metrics.goalProgress >= 100 ? "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.3)]" : "bg-white"
                                        )}
                                    />
                                </div>
                            </div>

                            {metrics.goalProgress >= 100 && (
                                <p className="text-[11px] text-emerald-400 font-bold mt-2 uppercase tracking-widest text-center">
                                    Meta Mensal Atingida
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

        </div>
    );
}
