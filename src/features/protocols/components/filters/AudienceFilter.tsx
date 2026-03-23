import { Users, Baby, Heart, UserCheck } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { TargetAudience, Protocol } from '../../types';
import { Check } from 'lucide-react';
import { springConfig } from '@/lib/animations/protocol-animations';
import { useMemo } from 'react';

interface AudienceFilterProps {
  value: TargetAudience | null;
  onChange: (audience: TargetAudience | null) => void;
  protocols: Protocol[];
}

const audiences: Array<{
  value: TargetAudience;
  label: string;
  icon: any;
  description: string;
}> = [
  {
    value: 'ADULT',
    label: 'Adultos',
    icon: Users,
    description: 'Protocolos para pacientes adultos',
  },
  {
    value: 'PEDIATRIC',
    label: 'Pediátricos',
    icon: Baby,
    description: 'Protocolos pediátricos',
  },
  {
    value: 'PREGNANT',
    label: 'Gestantes',
    icon: Heart,
    description: 'Protocolos para gestantes',
  },
  {
    value: 'ALL',
    label: 'Todos',
    icon: UserCheck,
    description: 'Protocolos gerais',
  },
];

export function AudienceFilter({ value, onChange, protocols }: AudienceFilterProps) {
  // Conta protocolos por público
  const audienceCounts = useMemo(() => {
    return audiences.reduce((acc, aud) => {
      acc[aud.value] = protocols.filter(
        (p) => p.targetAudience === aud.value || (aud.value === 'ALL' && p.targetAudience === 'ALL')
      ).length;
      return acc;
    }, {} as Record<TargetAudience, number>);
  }, [protocols]);

  return (
    <div className="w-full">
      <label className="text-sm font-black uppercase tracking-widest text-gray-600 mb-3 block">
        Público-Alvo
      </label>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {audiences.map((audience) => {
          const Icon = audience.icon;
          const isActive = value === audience.value;
          const count = audienceCounts[audience.value] || 0;

          return (
            <motion.div
              key={audience.value}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={springConfig}
            >
              <Card
                className={`
                  relative p-4 cursor-pointer transition-all border-2
                  ${
                    isActive
                      ? 'bg-purple-50 border-purple-500 shadow-lg'
                      : 'bg-white border-gray-200 hover:border-purple-300 hover:shadow-md'
                  }
                `}
                onClick={() => onChange(isActive ? null : audience.value)}
              >
                {/* Checkmark quando ativo */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                      className="absolute top-2 right-2 bg-purple-600 rounded-full p-1"
                    >
                      <Check className="h-3 w-3 text-white" />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex flex-col items-center text-center space-y-2">
                  <motion.div
                    animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    <Icon
                      className={`h-8 w-8 ${
                        isActive ? 'text-purple-600' : 'text-gray-600'
                      }`}
                    />
                  </motion.div>

                  <div>
                    <p className="font-black text-sm">{audience.label}</p>
                    <p className="text-xs text-muted-foreground">{audience.description}</p>
                  </div>

                  <Badge
                    variant={isActive ? 'default' : 'secondary'}
                    className={`text-xs ${isActive ? 'bg-purple-600' : ''}`}
                  >
                    {count} protocolos
                  </Badge>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
