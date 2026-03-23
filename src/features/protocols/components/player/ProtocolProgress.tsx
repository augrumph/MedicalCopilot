import { Progress } from '@/components/ui/progress';
import { motion } from 'framer-motion';

interface ProtocolProgressProps {
  current: number;
  total: number;
}

export function ProtocolProgress({ current, total }: ProtocolProgressProps) {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">Progresso</span>
        <span className="text-sm font-black text-purple-600">
          {Math.round(percentage)}%
        </span>
      </div>

      <Progress value={percentage} className="h-3" />

      <motion.div
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-1 text-xs text-muted-foreground text-right"
      >
        {current} de {total} etapas
      </motion.div>
    </div>
  );
}
