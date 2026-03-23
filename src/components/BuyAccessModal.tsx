import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, Clock, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Plan {
    id: string;
    name: string;
    shiftsIncluded: number;
    priceInCents: number;
    discountPct: number;
    durationHoursPerShift: number;
}

interface BuyAccessModalProps {
    open: boolean;
    onClose: () => void;
}

async function fetchPlans(): Promise<Plan[]> {
    const res = await fetch('/api/payments/plans', { credentials: 'include' });
    if (!res.ok) throw new Error('Failed to load plans');
    const json = await res.json();
    return json.data;
}

function formatCurrency(cents: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100);
}

export function BuyAccessModal({ open, onClose }: BuyAccessModalProps) {
    const [selectedShifts, setSelectedShifts] = useState<number | null>(null);
    const navigate = useNavigate();

    const { data: plans, isLoading: plansLoading } = useQuery({
        queryKey: ['subscription-plans'],
        queryFn: fetchPlans,
        staleTime: 5 * 60_000,
        enabled: open,
    });

    const handleBuy = () => {
        if (!selectedShifts) return;
        onClose();
        navigate(`/checkout?shifts=${selectedShifts}`);
    };

    return (
        <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
            <DialogContent className="max-w-md rounded-3xl border border-slate-200 shadow-2xl p-0 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-br from-[#512B81] to-[#3a1e5e] px-6 pt-6 pb-8">
                    <DialogHeader>
                        <DialogTitle className="text-white text-xl font-black tracking-tight flex items-center gap-2">
                            <Zap className="h-5 w-5 text-purple-300" />
                            Adquirir Plantões
                        </DialogTitle>
                        <DialogDescription className="text-purple-200 text-sm mt-1">
                            Cada plantão libera acesso completo por{' '}
                            <span className="font-bold text-white">13 horas</span>.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="mt-4 flex items-center gap-3 text-purple-200 text-xs">
                        <div className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" />
                            <span>13h de acesso contínuo</span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-purple-400" />
                        <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Ativo logo após o pagamento</span>
                        </div>
                    </div>
                </div>

                {/* Plans */}
                <div className="px-6 py-5 space-y-3">
                    {plansLoading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin text-[#512B81]" />
                        </div>
                    ) : (
                        plans?.map((plan) => {
                            const isSelected = selectedShifts === plan.shiftsIncluded;
                            const pricePerShift = plan.priceInCents / plan.shiftsIncluded;
                            return (
                                <button
                                    key={plan.id}
                                    onClick={() => setSelectedShifts(plan.shiftsIncluded)}
                                    className={cn(
                                        'w-full text-left rounded-2xl border-2 px-4 py-3.5 transition-all',
                                        isSelected
                                            ? 'border-[#512B81] bg-purple-50'
                                            : 'border-slate-200 bg-white hover:border-[#512B81]/40 hover:bg-slate-50',
                                    )}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-black text-[#1b1b1b]">
                                                    {plan.name}
                                                </span>
                                                {plan.discountPct > 0 && (
                                                    <Badge className="bg-emerald-100 text-emerald-700 border-0 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                                        -{plan.discountPct}%
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-[11px] text-slate-500 mt-0.5">
                                                {formatCurrency(pricePerShift)} / plantão
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-lg font-black text-[#512B81]">
                                                {formatCurrency(plan.priceInCents)}
                                            </span>
                                        </div>
                                    </div>
                                </button>
                            );
                        })
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 pb-6">
                    <Button
                        onClick={handleBuy}
                        disabled={!selectedShifts}
                        className="w-full h-12 bg-[#512B81] hover:bg-[#43236b] text-white font-bold rounded-2xl text-sm tracking-tight transition-all active:scale-[0.98] shadow-lg shadow-purple-900/20 disabled:opacity-50"
                    >
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Ir para Pagamento
                    </Button>
                    <p className="mt-3 text-center text-[11px] text-slate-400">
                        Pagamento via Pix · Acesso imediato após confirmação
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
