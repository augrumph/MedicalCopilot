import { Play, Clock, AlertCircle, Tag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { cardHover, overlayFade } from '@/lib/animations/protocol-animations';
import { Protocol } from '../../types';
import { getTriageInfo, formatTags } from '../../utils/protocolHelpers';
import { useState } from 'react';

interface ProtocolCardProps {
  protocol: Protocol;
  onStart: (protocolId: string) => void;
  index?: number;
}

const triageColorClasses = {
  RED: 'border-red-500 bg-red-50/30',
  ORANGE: 'border-orange-500 bg-orange-50/30',
  YELLOW: 'border-yellow-500 bg-yellow-50/30',
  GREEN: 'border-green-500 bg-green-50/30',
  BLUE: 'border-blue-500 bg-blue-50/30',
};

const triageBadgeClasses = {
  RED: 'bg-red-500 text-white',
  ORANGE: 'bg-orange-500 text-white',
  YELLOW: 'bg-yellow-500 text-white',
  GREEN: 'bg-green-500 text-white',
  BLUE: 'bg-blue-500 text-white',
};

export function ProtocolCard({ protocol, onStart, index = 0 }: ProtocolCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const triageInfo = getTriageInfo(protocol.triageColor);
  const { visible: visibleTags, remaining: remainingTags } = formatTags(protocol.tags, 3);
  const isCritical = protocol.triageColor === 'RED' || protocol.triageColor === 'ORANGE';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay: index * 0.05,
        duration: 0.3,
        ease: [0.4, 0, 0.2, 1],
      }}
      whileHover="hover"
      whileTap="tap"
      variants={cardHover}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="h-full"
    >
      <Card
        className={`
          relative h-full overflow-hidden
          backdrop-blur-sm bg-white/80
          border-l-4 transition-all duration-300
          ${triageColorClasses[protocol.triageColor]}
          ${isCritical ? 'shadow-lg shadow-red-500/10' : 'shadow-lg'}
        `}
      >
        <CardContent className="p-6 flex flex-col h-full">
          {/* Header: Badges */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex flex-wrap gap-2 pr-2">
              {/* Triage Badge */}
              <Badge className={`${triageBadgeClasses[protocol.triageColor]} font-black text-xs`}>
                {protocol.triageColor}
              </Badge>

              {/* Specialty Badge */}
              <Badge variant="secondary" className="text-xs">
                {protocol.specialty}
              </Badge>

              {/* Target Audience */}
              <Badge variant="outline" className="text-xs">
                {protocol.targetAudience}
              </Badge>

              {/* CID Badges */}
              {protocol.cid10Codes && protocol.cid10Codes.length > 0 && (
                <Badge variant="secondary" className="text-xs bg-purple-100 text-purple-800 border-purple-200 font-bold">
                  CID: {protocol.cid10Codes.join(', ')}
                </Badge>
              )}

              {/* Source Badge */}
              {protocol.sourceGuideline && (
                <Badge className="bg-[#682bd7] hover:bg-[#682bd7]/90 text-white font-bold text-xs border-transparent shadow-sm">
                  {protocol.sourceGuideline}
                </Badge>
              )}
            </div>

            {/* Critical Indicator */}
            {isCritical && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 400 }}
              >
                <AlertCircle className="h-5 w-5 text-red-600" />
              </motion.div>
            )}
          </div>

          {/* Title */}
          <h3 className="text-xl font-black text-gray-900 mb-2 line-clamp-2 leading-tight">
            🔍 {protocol.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-grow">
            {protocol.description || 'Protocolo clínico baseado em evidências científicas.'}
          </p>

          {/* Tags */}
          {visibleTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {visibleTags.map((tag, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium"
                >
                  <Tag className="h-3 w-3" />
                  {tag}
                </span>
              ))}
              {remainingTags > 0 && (
                <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                  +{remainingTags}
                </span>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Clock className="h-3.5 w-3.5" />
              <span className="font-medium">
                {triageInfo.targetMinutes === 0 ? 'Imediato' : `${triageInfo.targetMinutes}min`}
              </span>
            </div>

            <Button
              size="sm"
              onClick={() => onStart(protocol.id)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold shadow-md"
            >
              <Play className="h-4 w-4 mr-1" />
              Iniciar
            </Button>
          </div>
        </CardContent>

        {/* Hover Overlay */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              variants={overlayFade}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="absolute inset-0 bg-gradient-to-br from-purple-600/5 to-pink-600/5 backdrop-blur-[2px] pointer-events-none"
            />
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}
