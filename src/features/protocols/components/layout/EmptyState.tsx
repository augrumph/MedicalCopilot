import { SearchX, FileQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { fadeInScale } from '@/lib/animations/protocol-animations';

interface EmptyStateProps {
  hasFilters: boolean;
  onClearFilters?: () => void;
}

export function EmptyState({ hasFilters, onClearFilters }: EmptyStateProps) {
  return (
    <motion.div
      variants={fadeInScale}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      <div className="bg-gray-100 rounded-full p-6 mb-6">
        {hasFilters ? (
          <SearchX className="h-12 w-12 text-gray-400" />
        ) : (
          <FileQuestion className="h-12 w-12 text-gray-400" />
        )}
      </div>

      <h3 className="text-2xl font-black text-gray-900 mb-2">
        {hasFilters ? 'Nenhum protocolo encontrado' : 'Nenhum protocolo disponível'}
      </h3>

      <p className="text-gray-600 text-center max-w-md mb-6">
        {hasFilters
          ? 'Tente ajustar os filtros para encontrar o que você procura.'
          : 'Ainda não há protocolos cadastrados no sistema.'}
      </p>

      {hasFilters && onClearFilters && (
        <Button onClick={onClearFilters} variant="outline" size="lg">
          Limpar filtros
        </Button>
      )}
    </motion.div>
  );
}
