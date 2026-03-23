import { Heart, Brain, Baby, Bone, Eye, Stethoscope, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'framer-motion';
import { springConfig } from '@/lib/animations/protocol-animations';
import { Protocol } from '../../types';
import { useMemo } from 'react';

interface SpecialtyFilterProps {
  value: string | null;
  onChange: (specialty: string | null) => void;
  specialties: string[];
  protocols: Protocol[];
}

// Mapa de ícones por especialidade (adicionar mais conforme necessário)
const specialtyIcons: Record<string, any> = {
  Cardiologia: Heart,
  Neurologia: Brain,
  Pediatria: Baby,
  Ortopedia: Bone,
  Oftalmologia: Eye,
  Clínica: Stethoscope,
  Emergência: Activity,
};

export function SpecialtyFilter({
  value,
  onChange,
  specialties,
  protocols,
}: SpecialtyFilterProps) {
  // Conta protocolos por especialidade
  const specialtyCounts = useMemo(() => {
    return specialties.reduce((acc, specialty) => {
      acc[specialty] = protocols.filter((p) => p.specialty === specialty).length;
      return acc;
    }, {} as Record<string, number>);
  }, [specialties, protocols]);

  const handleSelect = (specialty: string) => {
    onChange(value === specialty ? null : specialty);
  };

  return (
    <div className="w-full">
      <label className="text-sm font-black uppercase tracking-widest text-gray-600 mb-3 block">
        Especialidade
      </label>

      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex gap-2 pb-2">
          {specialties.map((specialty) => {
            const Icon = specialtyIcons[specialty] || Stethoscope;
            const isActive = value === specialty;
            const count = specialtyCounts[specialty] || 0;

            return (
              <motion.button
                key={specialty}
                onClick={() => handleSelect(specialty)}
                className={`
                  inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl
                  border-2 transition-all
                  ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white border-transparent shadow-lg'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-purple-300 hover:shadow-md'
                  }
                `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={springConfig}
              >
                <Icon className="h-4 w-4" />
                <span className="font-medium text-sm">{specialty}</span>
                <Badge
                  variant={isActive ? 'secondary' : 'outline'}
                  className={`
                    text-xs
                    ${isActive ? 'bg-white/20 text-white border-white/30' : ''}
                  `}
                >
                  {count}
                </Badge>
              </motion.button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
