import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Save, UserCircle } from 'lucide-react';
import { useFinanceStore } from '@/stores/financeStore';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function PJConfigCard() {
    // Local state for the inputs
    const [localTaxRate, setLocalTaxRate] = useState("15.5");
    const [localProLabore, setLocalProLabore] = useState("5000");
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            toast.success('Configurações salvas localmente (Sincronização desativada para este MVP).');
        }, 400);
    };

    return (
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.45 }}>
            <Card className="rounded-2xl md:rounded-3xl bg-white shadow-lg border-0 h-full relative overflow-hidden group">
                <CardHeader className="pb-2 pt-6 px-6">
                    <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <div className="bg-orange-100 p-1.5 rounded-lg text-orange-600">
                            <Building2 className="w-4 h-4" />
                        </div>
                        Gestão PJ vs PF
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <p className="text-sm font-medium text-gray-500 mb-6">
                        Configure as despesas da sua empresa médica para descobrir quanto do seu faturamento em plantões é realmente o seu dinheiro líquido.
                    </p>

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="taxRate" className="text-xs font-bold uppercase text-gray-500 tracking-wider">Imposto Médio (Ex: Simples Nacional)</Label>
                            <div className="relative">
                                <Input
                                    id="taxRate"
                                    type="number"
                                    step="0.1"
                                    value={localTaxRate}
                                    onChange={(e) => setLocalTaxRate(e.target.value)}
                                    className="h-11 pl-4 pr-10 rounded-xl bg-gray-50 border-gray-200 focus-visible:ring-orange-500/20 focus-visible:border-orange-500 text-base font-bold text-gray-900"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">%</span>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label htmlFor="proLabore" className="text-xs font-bold uppercase text-gray-500 tracking-wider">Pró-labore "Salário" (PF)</Label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-gray-400">R$</span>
                                <Input
                                    id="proLabore"
                                    type="number"
                                    value={localProLabore}
                                    onChange={(e) => setLocalProLabore(e.target.value)}
                                    className="h-11 pl-12 rounded-xl bg-gray-50 border-gray-200 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-500 text-base font-bold text-gray-900 tabular-nums"
                                />
                                <UserCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                            </div>
                        </div>

                        <Button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="w-full h-11 mt-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all active:scale-[0.98]"
                        >
                            {isSaving ? 'Salvando...' : <><Save className="w-4 h-4 mr-2" /> Salvar Configurações</>}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
}
