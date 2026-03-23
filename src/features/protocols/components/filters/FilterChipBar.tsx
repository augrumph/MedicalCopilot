import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { filterChip } from '@/lib/animations/protocol-animations';
import { ProtocolFilters } from '../../types';

interface FilterChipBarProps {
  activeFilters: Array<{
    key: keyof ProtocolFilters;
    label: string;
    value: string;
  }>;
  onRemoveFilter: (filterKey: keyof ProtocolFilters, value?: string) => void;
  onClearAll: () => void;
}

export function FilterChipBar({ activeFilters, onRemoveFilter, onClearAll }: FilterChipBarProps) {
  if (activeFilters.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2 flex-wrap py-4"
    >
      <span className="text-sm font-medium text-muted-foreground">Filtros ativos:</span>

      <AnimatePresence mode="popLayout">
        {activeFilters.map((filter, index) => (
          <motion.div
            key={`${filter.key}-${filter.value}-${index}`}
            variants={filterChip}
            initial="hidden"
            animate="visible"
            exit="exit"
            layout
          >
            <Badge
              variant="secondary"
              className="pl-3 pr-1 py-1.5 gap-2 text-sm font-medium hover:bg-secondary/80 transition-colors"
            >
              <span className="text-xs text-muted-foreground font-normal">
                {filter.label}:
              </span>
              <span className="font-medium">{filter.value}</span>

              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5 rounded-full hover:bg-muted ml-1"
                onClick={() => {
                  if (filter.key === 'triageColors') {
                    // Remove apenas essa cor específica
                    // A lógica de remoção individual será tratada no componente pai
                    onRemoveFilter(filter.key, filter.value);
                  } else {
                    onRemoveFilter(filter.key);
                  }
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          </motion.div>
        ))}
      </AnimatePresence>

      {activeFilters.length > 1 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="text-xs h-8 text-muted-foreground hover:text-foreground"
          >
            Limpar tudo
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
}
