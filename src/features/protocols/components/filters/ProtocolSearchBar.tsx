import { useState, useMemo, useEffect } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { Protocol } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { fadeInScale } from '@/lib/animations/protocol-animations';

interface ProtocolSearchBarProps {
  value: string;
  onChange: (value: string) => void;
  protocols: Protocol[];
  placeholder?: string;
}

export function ProtocolSearchBar({
  value,
  onChange,
  protocols,
  placeholder = 'Buscar protocolos, tags, CID-10...',
}: ProtocolSearchBarProps) {
  const [open, setOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Simula loading ao digitar
  useEffect(() => {
    if (value) {
      setIsSearching(true);
      const timer = setTimeout(() => setIsSearching(false), 300);
      return () => clearTimeout(timer);
    }
    setIsSearching(false);
  }, [value]);

  // Sugestões baseadas no termo de busca
  const suggestions = useMemo(() => {
    if (!value.trim() || value.length < 2) return [];

    const term = value.toLowerCase();
    const results: Array<{
      type: 'title' | 'tag' | 'cid10';
      protocol: Protocol;
      match: string;
    }> = [];

    protocols.forEach((protocol) => {
      // Match em título
      if (protocol.title.toLowerCase().includes(term)) {
        results.push({
          type: 'title',
          protocol,
          match: protocol.title,
        });
      }

      // Match em tags
      protocol.tags?.forEach((tag) => {
        if (tag.toLowerCase().includes(term) && results.length < 8) {
          results.push({
            type: 'tag',
            protocol,
            match: tag,
          });
        }
      });

      // Match em CID-10
      protocol.cid10Codes?.forEach((code) => {
        if (code.toLowerCase().includes(term) && results.length < 8) {
          results.push({
            type: 'cid10',
            protocol,
            match: code,
          });
        }
      });
    });

    return results.slice(0, 8);
  }, [value, protocols]);

  const handleClear = () => {
    onChange('');
    setOpen(false);
  };

  const handleSelectSuggestion = (suggestion: typeof suggestions[0]) => {
    onChange(suggestion.match);
    setOpen(false);
  };

  return (
    <div className="relative w-full max-w-2xl">
      <Popover open={open && suggestions.length > 0} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />

            <Input
              value={value}
              onChange={(e) => {
                onChange(e.target.value);
                setOpen(true);
              }}
              placeholder={placeholder}
              className="pl-12 pr-12 h-14 text-base rounded-2xl shadow-lg border-2 focus-visible:ring-2 focus-visible:ring-purple-500"
            />

            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <AnimatePresence mode="wait">
                {isSearching ? (
                  <motion.div
                    key="loading"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Loader2 className="h-4 w-4 animate-spin text-purple-600" />
                  </motion.div>
                ) : value ? (
                  <motion.div
                    key="clear"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleClear}
                      className="h-8 w-8 rounded-full hover:bg-gray-100"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          </div>
        </PopoverTrigger>

        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0 rounded-2xl shadow-2xl"
          align="start"
        >
          <Command>
            <CommandList>
              <CommandEmpty>Nenhuma sugestão encontrada</CommandEmpty>

              <CommandGroup heading="Sugestões">
                {suggestions.map((suggestion, index) => (
                  <CommandItem
                    key={`${suggestion.protocol.id}-${suggestion.type}-${index}`}
                    onSelect={() => handleSelectSuggestion(suggestion)}
                    className="flex items-center gap-3 py-3"
                  >
                    <Badge
                      variant={
                        suggestion.type === 'title'
                          ? 'default'
                          : suggestion.type === 'tag'
                          ? 'secondary'
                          : 'outline'
                      }
                      className="text-xs"
                    >
                      {suggestion.type === 'title'
                        ? 'Título'
                        : suggestion.type === 'tag'
                        ? 'Tag'
                        : 'CID-10'}
                    </Badge>

                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{suggestion.match}</p>
                      {suggestion.type !== 'title' && (
                        <p className="text-xs text-muted-foreground truncate">
                          {suggestion.protocol.title}
                        </p>
                      )}
                    </div>

                    <Badge
                      variant="outline"
                      className={`
                        text-xs
                        ${suggestion.protocol.triageColor === 'RED' && 'border-red-500 text-red-700'}
                        ${suggestion.protocol.triageColor === 'ORANGE' && 'border-orange-500 text-orange-700'}
                        ${suggestion.protocol.triageColor === 'YELLOW' && 'border-yellow-500 text-yellow-700'}
                        ${suggestion.protocol.triageColor === 'GREEN' && 'border-green-500 text-green-700'}
                        ${suggestion.protocol.triageColor === 'BLUE' && 'border-blue-500 text-blue-700'}
                      `}
                    >
                      {suggestion.protocol.triageColor}
                    </Badge>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Contador de resultados */}
      <AnimatePresence>
        {value && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={fadeInScale}
            className="mt-2 text-sm text-muted-foreground"
          >
            {suggestions.length > 0 ? (
              <span>{suggestions.length} sugestões encontradas</span>
            ) : (
              <span>Digite pelo menos 2 caracteres para ver sugestões</span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
