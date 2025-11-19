import React, { memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pill, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MedicationCardProps {
  med: {
    name: string;
    concentration: string;
    form: string;
    via: string;
    dosage: string;
    duration: string;
    quantity?: string;
    quantityText?: string;
    indication: string;
    type: 'primary' | 'alternative' | 'optional' | 'controlled';
    isControlled?: boolean;
  };
  idx: number;
}

const MedicationCard: React.FC<MedicationCardProps> = ({ med, idx }) => {
  return (
    <Card className={cn(
      "shadow-md",
      med.type === 'primary' && "bg-gradient-to-br from-[#8C00FF]/10 to-[#450693]/5 border border-[#8C00FF]/30",
      med.type === 'alternative' && "bg-gradient-to-br from-[#FFC400]/10 to-[#FF9500]/5 border border-[#FFC400]/30",
      med.type === 'optional' && "bg-gray-50 border border-gray-300"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={cn(
              "h-10 w-10 rounded-lg flex items-center justify-center",
              med.type === 'primary' && "bg-gradient-to-br from-[#8C00FF] to-[#450693]",
              med.type === 'alternative' && "bg-gradient-to-br from-[#FFC400] to-[#FF9500]",
              med.type === 'optional' && "bg-gray-400"
            )}>
              <Pill className="h-5 w-5 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900">{med.name}</h4>
              <p className="text-xs text-gray-600">{med.indication}</p>
            </div>
          </div>
          <Badge className={cn(
            "text-xs font-semibold",
            med.type === 'primary' && "bg-[#8C00FF] text-white",
            med.type === 'alternative' && "bg-[#FFC400] text-gray-900",
            med.type === 'optional' && "bg-gray-400 text-white"
          )}>
            {med.type === 'primary' && 'Primeira Escolha'}
            {med.type === 'alternative' && 'Alternativa'}
            {med.type === 'optional' && 'Opcional'}
          </Badge>
        </div>

        <div className="space-y-2 bg-white rounded-lg p-3 border border-gray-200">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-700">Posologia:</span>
            <span className="text-sm text-gray-900">{med.dosage}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-700">Duração:</span>
            <span className="text-sm text-gray-900">{med.duration}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default memo(MedicationCard);