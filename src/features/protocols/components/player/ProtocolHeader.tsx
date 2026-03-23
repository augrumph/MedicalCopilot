import { ArrowLeft, RotateCcw, MoreVertical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Protocol } from '../../types';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

interface ProtocolHeaderProps {
  protocol: Protocol;
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onReset: () => void;
}

export function ProtocolHeader({
  protocol,
  currentStep,
  totalSteps,
  onBack,
  onReset,
}: ProtocolHeaderProps) {
  const headerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const headerOpacity = useTransform(scrollY, [0, 100], [1, 0.95]);
  const headerScale = useTransform(scrollY, [0, 100], [1, 0.98]);

  const triageBgClasses = {
    RED: 'from-red-600 to-red-700',
    ORANGE: 'from-orange-600 to-orange-700',
    YELLOW: 'from-yellow-600 to-yellow-700',
    GREEN: 'from-green-600 to-green-700',
    BLUE: 'from-blue-600 to-blue-700',
  };

  return (
    <motion.div
      ref={headerRef}
      style={{ opacity: headerOpacity, scale: headerScale }}
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b-2 border-gray-200 shadow-lg"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Back button + Title */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="flex-shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="font-black text-lg truncate">{protocol.title}</h2>
                <Badge
                  className={`bg-gradient-to-r ${
                    triageBgClasses[protocol.triageColor]
                  } text-white text-xs`}
                >
                  {protocol.triageColor}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Etapa {currentStep} de {totalSteps}
              </p>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onReset}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reiniciar Protocolo
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
