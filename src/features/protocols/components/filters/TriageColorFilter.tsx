import { AlertCircle, Clock, Activity } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { TriageColor, Protocol } from '../../types';
import { getTriageInfo } from '../../utils/protocolHelpers';
import { springConfig, pulseGlow } from '@/lib/animations/protocol-animations';
import { useMemo } from 'react';

interface TriageColorFilterProps {
  value: TriageColor[];
  onChange: (colors: TriageColor[]) => void;
  protocols: Protocol[];
}

const triageColors: TriageColor[] = ['RED', 'ORANGE', 'YELLOW', 'GREEN', 'BLUE'];

const colorClasses = {
  RED: 'bg-red-500 hover:bg-red-600 border-red-600',
  ORANGE: 'bg-orange-500 hover:bg-orange-600 border-orange-600',
  YELLOW: 'bg-yellow-500 hover:bg-yellow-600 border-yellow-600',
  GREEN: 'bg-green-500 hover:bg-green-600 border-green-600',
  BLUE: 'bg-blue-500 hover:bg-blue-600 border-blue-600',
};

export function TriageColorFilter({ value, onChange, protocols }: TriageColorFilterProps) {
  // Conta protocolos por cor
  const colorCounts = useMemo(() => {
    return triageColors.reduce((acc, color) => {
      acc[color] = protocols.filter((p) => p.triageColor === color).length;
      return acc;
    }, {} as Record<TriageColor, number>);
  }, [protocols]);

  const handleToggle = (color: TriageColor) => {
    const newValue = value.includes(color)
      ? value.filter((c) => c !== color)
      : [...value, color];
    onChange(newValue);
  };

  const isCritical = (color: TriageColor) => color === 'RED' || color === 'ORANGE';

  return (
    <div className="w-full">
      <label className="text-sm font-black uppercase tracking-widest text-gray-600 mb-3 block">
        Triagem (Manchester)
      </label>

      <div className="flex flex-wrap gap-3">
        {/* Críticos */}
        <div className="flex gap-2">
          {triageColors.filter(isCritical).map((color) => {
            const info = getTriageInfo(color);
            const isActive = value.includes(color);
            const count = colorCounts[color] || 0;

            return (
              <TooltipProvider key={color}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.button
                      onClick={() => handleToggle(color)}
                      className={`
                        relative inline-flex items-center gap-2 px-4 py-3 rounded-2xl
                        text-white font-medium border-2 transition-all
                        ${colorClasses[color]}
                        ${isActive ? 'shadow-2xl ring-4 ring-offset-2' : 'opacity-60 hover:opacity-100'}
                        ${
                          isActive && isCritical(color)
                            ? 'ring-red-200'
                            : ''
                        }
                      `}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      transition={springConfig}
                      animate={isActive && isCritical(color) ? 'animate' : 'initial'}
                      variants={pulseGlow}
                    >
                      <AlertCircle className="h-4 w-4" />
                      <span className="text-sm font-black">{color}</span>
                      <Badge variant="secondary" className="bg-white/20 text-white text-xs">
                        {count}
                      </Badge>
                    </motion.button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-xs">
                    <div className="space-y-2">
                      <p className="font-black text-sm">{info.label}</p>
                      <p className="text-xs text-muted-foreground">{info.description}</p>
                      <div className="flex items-center gap-1 text-xs">
                        <Clock className="h-3 w-3" />
                        <span>
                          {info.targetMinutes === 0
                            ? 'Imediato'
                            : `${info.targetMinutes} min`}
                        </span>
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>

        <Separator orientation="vertical" className="h-12 hidden sm:block" />

        {/* Padrão */}
        <div className="flex gap-2">
          {triageColors.filter((c) => !isCritical(c)).map((color) => {
            const info = getTriageInfo(color);
            const isActive = value.includes(color);
            const count = colorCounts[color] || 0;

            return (
              <TooltipProvider key={color}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.button
                      onClick={() => handleToggle(color)}
                      className={`
                        inline-flex items-center gap-2 px-4 py-3 rounded-2xl
                        text-white font-medium border-2 transition-all
                        ${colorClasses[color]}
                        ${isActive ? 'shadow-lg' : 'opacity-60 hover:opacity-100'}
                      `}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      transition={springConfig}
                    >
                      <Activity className="h-4 w-4" />
                      <span className="text-sm font-black">{color}</span>
                      <Badge variant="secondary" className="bg-white/20 text-white text-xs">
                        {count}
                      </Badge>
                    </motion.button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-xs">
                    <div className="space-y-2">
                      <p className="font-black text-sm">{info.label}</p>
                      <p className="text-xs text-muted-foreground">{info.description}</p>
                      <div className="flex items-center gap-1 text-xs">
                        <Clock className="h-3 w-3" />
                        <span>{info.targetMinutes} min</span>
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>
      </div>
    </div>
  );
}
