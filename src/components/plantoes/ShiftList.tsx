import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useFinanceStore, ShiftStatus } from '@/stores/financeStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, MapPin, MoreHorizontal, Check, Clock, AlertTriangle, X, Wallet, CalendarDays } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';

export function ShiftList() {
    const { shifts, updateShiftStatus, deleteShift } = useFinanceStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<ShiftStatus | 'all'>('all');

    const filteredShifts = useMemo(() => {
        return shifts.filter(shift => {
            const matchSearch = shift.location.toLowerCase().includes(searchTerm.toLowerCase());
            const matchStatus = statusFilter === 'all' || shift.status === statusFilter;
            return matchSearch && matchStatus;
        });
    }, [shifts, searchTerm, statusFilter]);

    const getStatusBadge = (status: ShiftStatus) => {
        switch (status) {
            case 'pago':
                return <Badge className="bg-slate-50 text-[#512B81] border border-slate-100 font-bold uppercase tracking-widest text-[10px] px-3 py-1 rounded-full shadow-sm"><Check className="h-3 w-3 mr-1 shrink-0" /> Pago</Badge>;
            case 'aguardando':
                return <Badge className="bg-slate-50 text-slate-400 border border-slate-100 font-bold uppercase tracking-widest text-[10px] px-3 py-1 rounded-full"><Clock className="h-3 w-3 mr-1 shrink-0" /> No prazo</Badge>;
            case 'atrasado':
                return <Badge className="bg-red-50 text-red-500 border border-red-100 font-bold uppercase tracking-widest text-[10px] px-3 py-1 rounded-full"><AlertTriangle className="h-3 w-3 mr-1 shrink-0" /> Atrasado</Badge>;
            case 'glosa':
                return <Badge className="bg-[#1b1b1b] text-white border-0 font-bold uppercase tracking-widest text-[10px] px-3 py-1 rounded-full shadow-lg shadow-black/10"><AlertTriangle className="h-3 w-3 mr-1 shrink-0" /> Glosa</Badge>;
        }
    };

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value);
    };

    return (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="border border-slate-200 shadow-sm rounded-3xl bg-white overflow-hidden">
                <CardHeader className="pb-4 pt-6 px-6 border-b border-slate-100 bg-slate-50/30">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <CardTitle className="text-sm font-black text-[#1b1b1b] uppercase tracking-[0.2em] flex items-center gap-2">
                            <Wallet className="w-4 h-4 text-[#512B81]" /> Histórico Clínico-Financeiro
                        </CardTitle>

                        {/* Filters */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <Input
                                    type="text"
                                    placeholder="Buscar local..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9 h-10 w-full sm:w-64 bg-white border-slate-200 rounded-2xl focus-visible:border-slate-900 focus-visible:ring-slate-900/10"
                                />
                            </div>

                            <div className="flex gap-1 bg-slate-100 p-1 rounded-2xl overflow-x-auto no-scrollbar">
                                {(['all', 'pago', 'aguardando', 'atrasado', 'glosa'] as const).map(status => (
                                    <Button
                                        key={status}
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setStatusFilter(status)}
                                        className={cn(
                                            "h-8 px-4 rounded-xl text-xs font-semibold transition-all tracking-tight",
                                            statusFilter === status
                                                ? "bg-white shadow-sm text-slate-900"
                                                : "text-slate-500 hover:text-slate-700"
                                        )}
                                    >
                                        {status === 'all' ? 'Todos' : status.charAt(0).toUpperCase() + status.slice(1)}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-0">
                    {filteredShifts.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="h-16 w-16 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-6">
                                <CalendarDays className="h-8 w-8 text-slate-300" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-1">Nenhum plantão encontrado</h3>
                            <p className="text-sm text-slate-500 mb-8 max-w-xs leading-relaxed">Tente ajustar os filtros ou adicione um novo registro na sua agenda financeira.</p>

                            {(searchTerm || statusFilter !== 'all') && (
                                <Button
                                    variant="outline"
                                    onClick={() => { setSearchTerm(''); setStatusFilter('all'); }}
                                    className="text-slate-900 border-slate-200 rounded-full font-semibold px-6 hover:bg-slate-50"
                                >
                                    Limpar Filtros
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100 bg-white">
                            <AnimatePresence>
                                {filteredShifts.map((shift, index) => (
                                    <motion.div
                                        key={shift.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ delay: index * 0.03 }}
                                        className="group hover:bg-slate-50/50 transition-colors"
                                    >
                                        <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                                            {/* Esquerda: Identificação */}
                                            <div className="flex items-start gap-4 flex-1 min-w-0">
                                                <div className="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 hidden sm:flex group-hover:border-[#512B81]/20 group-hover:bg-[#512B81]/5 transition-all">
                                                    <MapPin className="h-5 w-5 text-slate-300 group-hover:text-[#512B81]" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center justify-between sm:justify-start gap-3 mb-1">
                                                        <h4 className="font-semibold text-slate-900 text-lg truncate">{shift.location}</h4>
                                                        <div className="sm:hidden shrink-0">{getStatusBadge(shift.status)}</div>
                                                    </div>
                                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium text-slate-500 mt-1">
                                                        <span className="flex items-center gap-1.5">
                                                            <CalendarDays className="w-3.5 h-3.5 text-slate-300" />
                                                            {new Date(shift.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                        </span>
                                                        <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-slate-300" />
                                                        <span className={cn(
                                                            "flex items-center gap-1.5",
                                                            (shift.status === 'atrasado' || shift.status === 'glosa') ? 'text-rose-500 font-semibold' : ''
                                                        )}>
                                                            <Clock className="w-3.5 h-3.5 opacity-60" />
                                                            Recebimento em {shift.paymentForecastDays} dias
                                                        </span>
                                                        {shift.contactSponsor && (
                                                            <>
                                                                <span className="hidden sm:inline-block w-1 h-1 rounded-full bg-slate-300" />
                                                                <span className="bg-slate-100 px-2.5 py-0.5 rounded-full text-slate-600 font-semibold text-[11px] border border-slate-200/50">
                                                                    Res: {shift.contactSponsor}
                                                                </span>
                                                            </>
                                                        )}
                                                    </div>
                                                    {shift.status === 'glosa' && shift.glosaReason && (
                                                        <div className="mt-3 bg-rose-50/50 border border-rose-100 rounded-xl p-3 text-xs text-rose-700 font-medium">
                                                            <strong className="font-bold">Motivo da Glosa:</strong> {shift.glosaReason}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Direita: Valor e Ações */}
                                            <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 pt-4 sm:pt-0 border-slate-100 mt-2 sm:mt-0 w-full sm:w-auto">

                                                <div className="text-left sm:text-right hidden sm:block">
                                                    <div className="flex justify-end mb-1.5">
                                                        {getStatusBadge(shift.status)}
                                                    </div>
                                                    <p className={cn(
                                                        "text-2xl font-semibold tracking-tight tabular-nums",
                                                        (shift.status === 'atrasado' || shift.status === 'glosa') ? "text-rose-600" : "text-slate-900"
                                                    )}>
                                                        {formatCurrency(shift.grossValue)}
                                                    </p>
                                                </div>

                                                {/* Mobile view that combines info */}
                                                <div className="sm:hidden flex flex-col items-start min-w-0">
                                                    <p className="text-[10px] uppercase tracking-widest font-bold text-slate-400 mb-0.5">VALOR BRUTO</p>
                                                    <p className={cn(
                                                        "text-xl font-semibold tabular-nums tracking-tight truncate max-w-full",
                                                        (shift.status === 'atrasado' || shift.status === 'glosa') ? "text-rose-600" : "text-slate-900"
                                                    )}>{formatCurrency(shift.grossValue)}</p>
                                                </div>

                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-all border border-transparent">
                                                            <MoreHorizontal className="h-5 w-5" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-56 bg-white z-50 rounded-2xl shadow-xl border border-slate-100 p-2">
                                                        {shift.status !== 'pago' && (
                                                            <DropdownMenuItem onClick={() => updateShiftStatus(shift.id, 'pago')} className="py-2.5 text-emerald-600 font-semibold focus:bg-emerald-50 focus:text-emerald-700 cursor-pointer rounded-xl">
                                                                <Check className="h-4 w-4 mr-2" /> Marcar como Pago
                                                            </DropdownMenuItem>
                                                        )}
                                                        {shift.status !== 'atrasado' && shift.status !== 'pago' && (
                                                            <DropdownMenuItem onClick={() => updateShiftStatus(shift.id, 'atrasado')} className="py-2.5 text-rose-600 font-semibold focus:bg-rose-50 focus:text-rose-700 cursor-pointer rounded-xl mt-1">
                                                                <AlertTriangle className="h-4 w-4 mr-2" /> Sinalizar Atraso
                                                            </DropdownMenuItem>
                                                        )}
                                                        {shift.status !== 'glosa' && shift.status !== 'pago' && (
                                                            <DropdownMenuItem onClick={() => updateShiftStatus(shift.id, 'glosa')} className="py-2.5 text-rose-600 font-semibold focus:bg-rose-50 focus:text-rose-700 cursor-pointer rounded-xl bg-rose-50 mt-1">
                                                                <AlertTriangle className="h-4 w-4 mr-2" /> Reportar Glosa
                                                            </DropdownMenuItem>
                                                        )}
                                                        {(shift.status === 'pago' || shift.status === 'glosa') && (
                                                            <DropdownMenuItem onClick={() => updateShiftStatus(shift.id, 'aguardando')} className="py-2.5 font-semibold focus:bg-slate-50 cursor-pointer rounded-xl">
                                                                <Clock className="h-4 w-4 mr-2" /> Desmarcar Recebimento
                                                            </DropdownMenuItem>
                                                        )}
                                                        <div className="h-px bg-slate-100 my-1.5" />
                                                        <DropdownMenuItem onClick={() => deleteShift(shift.id)} className="py-2 text-slate-400 focus:bg-red-50 focus:text-red-600 font-medium cursor-pointer rounded-xl">
                                                            <X className="h-4 w-4 mr-2" /> Excluir Registro
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>

                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
}
