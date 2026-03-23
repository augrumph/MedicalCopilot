import { Play, Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Protocol } from '../../types';

interface EmergencyShortcutCardProps {
  protocol: Protocol;
  onStart: (protocolId: string) => void;
}

export function EmergencyShortcutCard({ protocol, onStart }: EmergencyShortcutCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
    >
      <Card className="bg-gradient-to-r from-red-600 to-red-700 text-white border-2 border-red-500 shadow-xl overflow-hidden">
        <CardContent className="p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="bg-white/20 rounded-full p-2 flex-shrink-0">
              <Zap className="h-6 w-6 text-white" />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="font-black text-sm mb-0.5 truncate">{protocol.title}</h4>
              <p className="text-xs text-red-100 truncate">{protocol.specialty}</p>
            </div>
          </div>

          <Button
            size="sm"
            onClick={() => onStart(protocol.id)}
            className="bg-white text-red-600 hover:bg-red-50 font-bold shadow-lg flex-shrink-0"
          >
            <Play className="h-4 w-4 mr-1" />
            Iniciar
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
