
import { useMemed } from '@/hooks/useMemed';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, AlertCircle } from 'lucide-react';

interface MemedPrescriptionProps {
    containerId?: string;
}

export function MemedPrescription({ containerId = 'memed-container' }: MemedPrescriptionProps) {
    const { isLoaded, error } = useMemed({ containerId });

    if (error) {
        return (
            <Card className="h-full flex items-center justify-center p-6 border-red-200 bg-red-50">
                <CardContent className="text-center max-w-md">
                    <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-2" />
                    <h3 className="font-bold text-red-700">Erro na Integração MEMED</h3>
                    <p className="text-sm text-red-600 mt-1">{error}</p>
                    <p className="text-xs text-gray-500 mt-4">
                        Verifique se o backend está rodando em http://localhost:3001
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="w-full h-full relative bg-gray-50 flex flex-col">
            {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-50">
                    <div className="flex flex-col items-center">
                        <Loader2 className="w-8 h-8 text-[#8C00FF] animate-spin mb-2" />
                        <p className="text-sm font-medium text-gray-600">Inicializando MEMED...</p>
                        <p className="text-xs text-gray-400 mt-2">Obtendo token do médico...</p>
                    </div>
                </div>
            )}

            {/* MEMED injeta o módulo de prescrição neste container */}
            <div id={containerId} className="flex-1 w-full h-full min-h-[600px]" />
        </div>
    );
}
