import { useState } from 'react';
import { useFinanceStore } from '@/stores/financeStore';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { WalletMinimal, X } from 'lucide-react';
import { toast } from 'sonner';

interface AddShiftModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AddShiftModal({ isOpen, onClose }: AddShiftModalProps) {
    const { addShift } = useFinanceStore();

    const [location, setLocation] = useState('');
    const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
    const [grossValue, setGrossValue] = useState('');
    const [paymentForecastDays, setPaymentForecastDays] = useState('30');

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate slight delay for UX
        setTimeout(() => {
            addShift({
                location,
                date: new Date(date).toISOString(),
                grossValue: Number(grossValue),
                paymentForecastDays: Number(paymentForecastDays),
                status: 'aguardando'
            });

            toast.success(`Plantão em ${location} adicionado com sucesso!`);

            // Reset and close
            setIsSubmitting(false);
            setLocation('');
            setGrossValue('');
            onClose();
        }, 600);
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[425px] md:max-w-[480px] rounded-t-[32px] sm:rounded-[32px] p-0 overflow-hidden border-0 shadow-2xl bg-white w-full max-w-[95vw] mt-auto sm:mt-0 max-h-[90vh] flex flex-col">

                {/* Header - Premium Gradient */}
                <div className="bg-gradient-to-br from-[#4a1fa0] via-[#682bd7] to-[#bd2e95] p-8 pb-10 text-center relative flex flex-col items-center shrink-0">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light" />

                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white/70 hover:text-white hover:bg-white/20 rounded-full h-8 w-8 transition-colors z-20"
                    >
                        <X className="h-5 w-5" />
                    </Button>

                    <div className="bg-white/20 p-3 rounded-2xl mb-4 backdrop-blur-md shadow-inner relative z-10">
                        <WalletMinimal className="w-8 h-8 text-white drop-shadow-md" />
                    </div>

                    <DialogHeader className="relative z-10 m-0 space-y-0">
                        <DialogTitle className="text-2xl sm:text-3xl font-black text-white tracking-tighter mx-auto">
                            Novo Plantão
                        </DialogTitle>
                        <DialogDescription className="text-white/80 font-medium text-xs sm:text-sm mt-1 max-w-[280px] mx-auto text-center">
                            Cadastre os detalhes do seu plantão para acompanhamento financeiro
                        </DialogDescription>
                    </DialogHeader>
                </div>

                {/* Content - White Card Overlapping */}
                <div className="bg-white px-6 sm:px-8 pt-8 pb-8 flex-1 -mt-6 rounded-t-3xl relative z-10 overflow-y-auto custom-scrollbar">
                    <form onSubmit={handleSubmit} className="space-y-5">

                        <div className="space-y-1.5">
                            <Label htmlFor="location" className="text-xs font-bold uppercase text-gray-500 tracking-wider">Local do Atendimento</Label>
                            <Input
                                id="location"
                                placeholder="Ex: UPA Bela Vista, Hospital Albert Einstein..."
                                required
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="h-12 rounded-xl bg-gray-50 border-gray-200 focus-visible:ring-[#682bd7]/20 focus-visible:border-[#682bd7] text-base"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="date" className="text-xs font-bold uppercase text-gray-500 tracking-wider">Data Realizada</Label>
                            <Input
                                id="date"
                                type="date"
                                required
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="h-12 rounded-xl bg-gray-50 border-gray-200 focus-visible:ring-[#682bd7]/20 text-base"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="value" className="text-xs font-bold uppercase text-gray-500 tracking-wider">Valor Bruto</Label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">R$</span>
                                    <Input
                                        id="value"
                                        type="number"
                                        placeholder="0,00"
                                        required
                                        min="0"
                                        step="0.01"
                                        value={grossValue}
                                        onChange={(e) => setGrossValue(e.target.value)}
                                        className="h-12 pl-12 rounded-xl bg-gray-50 border-gray-200 focus-visible:ring-[#682bd7]/20 font-bold text-gray-900 text-lg tabular-nums placeholder:font-normal"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <Label htmlFor="days" className="text-xs font-bold uppercase text-gray-500 tracking-wider">Prazo (Dias)</Label>
                                <select
                                    id="days"
                                    className="flex h-12 w-full font-bold text-gray-900 items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-base focus:outline-none focus:ring-2 focus:border-[#682bd7] focus:ring-[#682bd7]/20 transition-all cursor-pointer"
                                    value={paymentForecastDays}
                                    onChange={(e) => setPaymentForecastDays(e.target.value)}
                                >
                                    <option value="0">Recebe na Hora</option>
                                    <option value="15">15 dias</option>
                                    <option value="30">30 dias</option>
                                    <option value="45">45 dias</option>
                                    <option value="60">60 dias</option>
                                    <option value="90">90 dias</option>
                                </select>
                            </div>
                        </div>

                        <div className="pt-6">
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#682bd7] to-[#4a1fa0] hover:from-[#5a24bc] hover:to-[#4a1fa0] text-white shadow-xl shadow-[#682bd7]/30 font-bold text-base tracking-wide transition-all active:scale-[0.98]"
                            >
                                {isSubmitting ? 'REGISTRANDO...' : 'REGISTRAR PLANTÃO'}
                            </Button>
                        </div>

                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
