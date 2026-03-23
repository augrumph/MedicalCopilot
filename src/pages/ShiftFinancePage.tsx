import { useState, useEffect } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { MetricsDashboard } from '@/components/plantoes/MetricsDashboard';
import { ShiftList } from '@/components/plantoes/ShiftList';
import { AddShiftModal } from '@/components/plantoes/AddShiftModal';
import { BuyAccessModal } from '@/components/BuyAccessModal';
import { AccessStatusBadge } from '@/components/AccessStatusBadge';
import { Plus, WalletMinimal, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useFinanceStore } from '@/stores/financeStore';

export default function ShiftFinancePage() {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isBuyOpen, setIsBuyOpen] = useState(false);
    const { fetchData } = useFinanceStore();

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <AppLayout>
            <div className="min-h-full pb-4 md:pb-6">

                {/* Header Title */}
                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center gap-4 mb-3">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1b1b1b] shadow-sm border border-slate-100 flex-shrink-0">
                                <WalletMinimal className="h-6 w-6 text-[#512B81]" />
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight text-[#1b1b1b]">
                                Meus Plantões
                            </h1>
                        </div>
                        <p className="text-slate-500 font-bold text-sm sm:text-base ml-0 md:ml-16 max-w-md leading-relaxed">
                            Controle de recebimentos e organização financeira profissional para médicos.
                        </p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="flex items-center gap-3 flex-shrink-0"
                    >
                        <div className="hidden md:block">
                            <AccessStatusBadge />
                        </div>
                        <Button
                            onClick={() => setIsBuyOpen(true)}
                            variant="outline"
                            className="h-12 px-5 rounded-full border-[#512B81] text-[#512B81] font-bold hover:bg-[#512B81] hover:text-white transition-all"
                        >
                            <Zap className="h-4 w-4 mr-2" />
                            Comprar Acesso
                        </Button>
                        <Button
                            onClick={() => setIsAddModalOpen(true)}
                            className="w-full md:w-auto bg-[#512B81] hover:bg-[#43236b] text-white font-bold rounded-full h-12 px-8 tracking-tight transition-all active:scale-95 shadow-md shadow-purple-900/10"
                        >
                            <Plus className="h-5 w-5 mr-2" />
                            Novo Plantão
                        </Button>
                    </motion.div>
                </motion.div>

                <div className="space-y-6">
                    {/* Dashboard de Métricas */}
                    <MetricsDashboard />

                    {/* Lista de Plantões */}
                    <ShiftList />
                </div>

                <AddShiftModal
                    isOpen={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                />
                <BuyAccessModal open={isBuyOpen} onClose={() => setIsBuyOpen(false)} />

            </div>
        </AppLayout>
    );
}
