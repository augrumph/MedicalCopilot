import { ChevronDown, ChevronUp, Lightbulb, CheckCircle, XCircle, Check, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface DiagnosticHypothesisItem {
  condition: string;
  explanation: string;
  scientificBasis: string[];
  confirmatoryTests?: string[];
  exclusionCriteria?: string[];
  probability?: 'alta' | 'moderada' | 'baixa';
  severity?: 'baixa' | 'media' | 'alta';
  keyIndicators?: string[];
}

interface DiagnosticHypothesisCompactCardProps {
  item: DiagnosticHypothesisItem;
  index: number;
  sectionTitle: string;
  isExpanded: boolean;
  onToggle: () => void;
}

const getProbabilityColor = (probability?: string) => {
  switch (probability) {
    case 'alta': return 'bg-green-500';
    case 'moderada': return 'bg-yellow-500';
    case 'baixa': return 'bg-red-500';
    default: return 'bg-gray-300';
  }
};

const getProbabilityText = (probability?: string) => {
  switch (probability) {
    case 'alta': return 'Alta';
    case 'moderada': return 'Moderada';
    case 'baixa': return 'Baixa';
    default: return 'Desconhecida';
  }
};

const getSeverityIcon = (severity?: string) => {
  switch (severity) {
    case 'alta': return <div className="w-2 h-2 rounded-full bg-red-500" />;
    case 'media': return <div className="w-2 h-2 rounded-full bg-yellow-500" />;
    case 'baixa': return <div className="w-2 h-2 rounded-full bg-green-500" />;
    default: return <div className="w-2 h-2 rounded-full bg-gray-300" />;
  }
};

const getSeverityColor = (severity?: string) => {
  switch (severity) {
    case 'alta': return 'text-red-600';
    case 'media': return 'text-yellow-600';
    case 'baixa': return 'text-green-600';
    default: return 'text-gray-600';
  }
};

const getSeverityBgColor = (severity?: string) => {
  switch (severity) {
    case 'alta': return 'bg-red-500/10 border-red-500/30';
    case 'media': return 'bg-yellow-500/10 border-yellow-500/30';
    case 'baixa': return 'bg-green-500/10 border-green-500/30';
    default: return 'bg-gray-500/10 border-gray-500/30';
  }
};

const shortenText = (text: string, maxLength: number = 120) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export function DiagnosticHypothesisCompactCard({
  item,
  index,
  sectionTitle,
  isExpanded,
  onToggle
}: DiagnosticHypothesisCompactCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -5 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
      className="w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card
        className={`transition-all duration-200 border rounded-lg overflow-hidden ${
          isExpanded || isHovered
            ? 'border-primary/50 bg-primary/5 shadow-sm'
            : 'border-transparent hover:border-muted-foreground/20'
        } ${getSeverityBgColor(item.severity)}`}
      >
        <button
          className="w-full text-left p-3 space-y-2 focus:outline-none"
          onClick={onToggle}
          aria-expanded={isExpanded}
          aria-label={`${item.condition}, ${isExpanded ? 'recolhido' : 'expandido'}`}
        >
          {/* Compact summary row */}
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-sm max-w-[70%] truncate">{item.condition}</h4>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {isExpanded ? 'Recolher' : 'Expandir'}
              </span>
              {isExpanded ? (
                <ChevronUp className="h-4 w-4 text-primary" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
          </div>

          {/* Probability and severity indicators */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${getProbabilityColor(item.probability)}`} />
              <span className="text-xs font-medium">
                Probabilidade: {getProbabilityText(item.probability)}
              </span>
            </div>
            
            <div className="flex items-center gap-1.5">
              {getSeverityIcon(item.severity)}
              <span className={`text-xs font-medium ${getSeverityColor(item.severity)}`}>
                {item.severity === 'alta' ? 'Alta gravidade' : 
                 item.severity === 'media' ? 'Média gravidade' : 
                 item.severity === 'baixa' ? 'Baixa gravidade' : 'Gravidade'}
              </span>
            </div>
          </div>

          {/* Key indicators as chips */}
          {item.keyIndicators && item.keyIndicators.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {item.keyIndicators.slice(0, 3).map((indicator, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs px-2 py-0.5">
                  {indicator}
                </Badge>
              ))}
              {item.keyIndicators.length > 3 && (
                <Badge variant="outline" className="text-xs px-2 py-0.5">
                  +{item.keyIndicators.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Shortened explanation */}
          <p className="text-xs text-muted-foreground mt-2">
            {shortenText(item.explanation)}
          </p>
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="pt-3 mt-3 space-y-4 border-t border-muted/50"
            >
              {/* Base científica card */}
              <div className="p-3 bg-muted/20 rounded-lg border border-muted">
                <h5 className="font-medium text-xs mb-2 flex items-center gap-1.5">
                  <Lightbulb className="h-3.5 w-3.5 text-primary" />
                  Por que eu acho isso?
                </h5>
                <ul className="space-y-1.5">
                  {item.scientificBasis.slice(0, 3).map((basis, basisIdx) => (
                    <li
                      key={basisIdx}
                      className="text-xs flex items-start gap-2 p-1.5 rounded-md bg-background"
                    >
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      <span className="font-medium">**{basis}**</span>
                    </li>
                  ))}
                  {item.scientificBasis.length > 3 && (
                    <li className="text-xs text-muted-foreground mt-2">
                      +{item.scientificBasis.length - 3} razões completas...
                    </li>
                  )}
                </ul>
              </div>

              {/* Confirmatory tests card */}
              {item.confirmatoryTests && item.confirmatoryTests.length > 0 && (
                <div className="p-3 bg-green-500/10 rounded-lg border border-green-500/30">
                  <h5 className="font-medium text-xs mb-2 flex items-center gap-1.5">
                    <CheckCircle className="h-3.5 w-3.5 text-green-600" />
                    O que fazer para confirmar
                  </h5>
                  <ul className="space-y-1.5">
                    {item.confirmatoryTests.map((test, testIdx) => (
                      <li
                        key={testIdx}
                        className="text-xs flex items-start gap-2 p-1.5 rounded-md"
                      >
                        <Check className="h-3.5 w-3.5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{test}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Exclusion criteria card */}
              {item.exclusionCriteria && item.exclusionCriteria.length > 0 && (
                <div className="p-3 bg-destructive/10 rounded-lg border border-destructive/30">
                  <h5 className="font-medium text-xs mb-2 flex items-center gap-1.5">
                    <XCircle className="h-3.5 w-3.5 text-destructive" />
                    O que afasta esse diagnóstico
                  </h5>
                  <ul className="space-y-1.5">
                    {item.exclusionCriteria.map((criteria, criteriaIdx) => (
                      <li
                        key={criteriaIdx}
                        className="text-xs flex items-start gap-2 p-1.5 rounded-md"
                      >
                        <X className="h-3.5 w-3.5 text-destructive mt-0.5 flex-shrink-0" />
                        <span>{criteria}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
}