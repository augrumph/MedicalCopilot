import { useState, useEffect } from 'react';
import { 
  CommandDialog, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList 
} from '@/components/ui/command';
import { Zap, Stethoscope, Activity, ChevronRight } from 'lucide-react';
import { useProtocolsStore } from '@/stores/protocolsStore';

interface CommandPaletteProps {
  onSelectProtocol: (id: string) => void;
}

export function CommandPalette({ onSelectProtocol }: CommandPaletteProps) {
  const [open, setOpen] = useState(false);
  const protocols = useProtocolsStore(state => state.protocols);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Buscar protocolo, sintoma ou doença (CMD+K)..." />
        <CommandList className="max-h-[400px]">
          <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
          
          <CommandGroup heading="Sugestões Contextuais">
             <CommandItem className="flex items-center gap-3 py-3 opacity-60">
                <Zap className="w-4 h-4 text-emerald-500" />
                <span className="text-sm font-bold">Dengue (Classificação A-D)</span>
             </CommandItem>
             <CommandItem className="flex items-center gap-3 py-3 opacity-60">
                <Zap className="w-4 h-4 text-rose-500" />
                <span className="text-sm font-bold">IAM com Supra (STEMI)</span>
             </CommandItem>
          </CommandGroup>

          <CommandGroup heading="Protocolos Clínicos">
            {protocols.map((protocol) => (
              <CommandItem
                key={protocol.id}
                onSelect={() => {
                  onSelectProtocol(protocol.id);
                  setOpen(false);
                }}
                className="p-0" // Remove default padding from CommandItem
              >
                <div className="p-3 bg-[#010101] border border-[#1a1a1a] rounded-2xl hover:border-[#a37cf0]/30 hover:bg-[#1a1a1a] transition-all cursor-pointer group flex items-center justify-between active:scale-[0.98]">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#a37cf0] flex items-center justify-center shadow-lg shadow-[#a37cf0]/20">
                      <Zap className="w-4 h-4 text-[#010101]" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-[#f7f4f1]">{protocol.title}</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Protocolo Estruturado</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-[#a37cf0] transition-transform group-hover:translate-x-1" />
                </div>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandGroup heading="Acesso Rápido">
             <CommandItem className="flex gap-3 py-3">
                <Stethoscope className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-medium">Calculadoras Médicas</span>
             </CommandItem>
             <CommandItem className="flex gap-3 py-3">
                <Activity className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-medium">Doses e Medicamentos</span>
             </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
