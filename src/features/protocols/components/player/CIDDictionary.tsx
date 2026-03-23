import { useState, useCallback, memo } from 'react';
import { Copy, Check, BookOpen, ChevronDown, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { getCIDInfo, hasCIDDescription } from '../../utils/cid10-lookup';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';

interface CIDDictionaryProps {
    codes: string[];
    protocolTitle?: string;
}

const CATEGORY_COLORS: Record<string, string> = {
    'Respiratório': 'bg-sky-100 text-sky-700',
    'Cardiologia': 'bg-red-100 text-red-700',
    'Digestivo': 'bg-amber-100 text-amber-700',
    'Urologia': 'bg-blue-100 text-blue-700',
    'Ginecologia': 'bg-pink-100 text-pink-700',
    'Obstetrícia': 'bg-rose-100 text-rose-700',
    'Endocrinologia': 'bg-purple-100 text-purple-700',
    'Dermatologia': 'bg-orange-100 text-orange-700',
    'Infectologia': 'bg-teal-100 text-teal-700',
    'Neurologia': 'bg-indigo-100 text-indigo-700',
    'Psiquiatria': 'bg-violet-100 text-violet-700',
    'Ortopedia': 'bg-stone-100 text-stone-700',
    'Reumatologia': 'bg-emerald-100 text-emerald-700',
    'Oftalmologia': 'bg-cyan-100 text-cyan-700',
    'ORL': 'bg-lime-100 text-lime-700',
    'Pediatria': 'bg-yellow-100 text-yellow-700',
    'Trauma': 'bg-red-100 text-red-700',
    'Emergência': 'bg-red-200 text-red-800',
    'Musculoesquelético': 'bg-stone-100 text-stone-700',
};

function getCategoryStyle(category: string): string {
    return CATEGORY_COLORS[category] ?? 'bg-gray-100 text-gray-600';
}

interface CIDRowProps {
    code: string;
    protocolTitle?: string;
}

const CIDRow = memo(function CIDRow({ code, protocolTitle }: CIDRowProps) {
    const [copiedCode, setCopiedCode] = useState(false);
    const [copiedFull, setCopiedFull] = useState(false);
    const info = getCIDInfo(code);
    const hasDesc = hasCIDDescription(code);

    const handleCopyCode = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        navigator.clipboard.writeText(code);
        setCopiedCode(true);
        toast.success(`${code} copiado!`, {
            description: 'Pronto para colar no sistema do hospital',
            duration: 2000,
        });
        setTimeout(() => setCopiedCode(false), 2000);
    }, [code]);

    const handleCopyAtestado = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
        const title = protocolTitle ?? info.description;
        navigator.clipboard.writeText(`CID ${code} - ${title}`);
        setCopiedFull(true);
        toast.success('Copiado para atestado!', {
            description: `CID ${code} - ${title}`,
            duration: 2500,
        });
        setTimeout(() => setCopiedFull(false), 2500);
    }, [code, info.description, protocolTitle]);

    return (
        <div className="flex items-start gap-3 py-3 px-4 hover:bg-gray-50 transition-colors rounded-xl">
            {/* Code chip — clica para copiar código puro */}
            <button
                onClick={handleCopyCode}
                title="Copiar código (sistemas hospitalares)"
                className="flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-900 text-white text-xs font-black font-mono tracking-wider hover:bg-gray-700 transition-colors"
            >
                {copiedCode ? <Check className="h-2.5 w-2.5 text-emerald-400" /> : <Copy className="h-2.5 w-2.5 opacity-50" />}
                {code}
            </button>

            {/* Descrição */}
            <div className="flex-1 min-w-0">
                <p className={`text-xs font-semibold leading-snug ${hasDesc ? 'text-gray-800' : 'text-gray-400 italic'}`}>
                    {info.description}
                </p>
                <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${getCategoryStyle(info.category)}`}>
                        {info.category}
                    </span>
                    {!hasDesc && (
                        <a
                            href={`https://cid10.com.br/${code}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            className="text-[9px] text-blue-500 hover:text-blue-700 flex items-center gap-0.5"
                        >
                            Buscar <ExternalLink className="h-2 w-2" />
                        </a>
                    )}
                </div>
            </div>

            {/* Botão atestado */}
            <button
                onClick={handleCopyAtestado}
                title="Copiar para atestado (código + nome da doença)"
                className="flex-shrink-0 flex items-center gap-1 px-2 py-1 rounded-lg border border-gray-200 text-[9px] font-bold text-gray-500 hover:bg-gray-900 hover:text-white hover:border-transparent transition-all"
            >
                {copiedFull ? <Check className="h-2.5 w-2.5 text-emerald-400" /> : <Copy className="h-2.5 w-2.5" />}
                Atestado
            </button>
        </div>
    );
});

export const CIDDictionary = memo(function CIDDictionary({ codes, protocolTitle }: CIDDictionaryProps) {
    const [open, setOpen] = useState(false);

    if (!codes || codes.length === 0) return null;

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                {/* Trigger compacto — não ocupa espaço no layout */}
                <button
                    className="inline-flex items-center gap-1.5 mt-1.5 px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-gray-600 hover:text-gray-900 cursor-pointer"
                    aria-label="Ver CIDs do protocolo"
                >
                    <BookOpen className="h-3 w-3 opacity-60" />
                    <span className="text-[10px] font-black font-mono tracking-wider">
                        {codes.length === 1 ? codes[0] : `${codes[0]} +${codes.length - 1}`}
                    </span>
                    <ChevronDown className={`h-2.5 w-2.5 opacity-50 transition-transform ${open ? 'rotate-180' : ''}`} />
                </button>
            </PopoverTrigger>

            {/* Painel flutuante — não empurra o layout */}
            <PopoverContent
                align="start"
                sideOffset={8}
                className="w-[360px] p-0 rounded-2xl border border-gray-100 shadow-2xl shadow-black/10 bg-white overflow-hidden"
            >
                {/* Header do popover */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/80">
                    <div className="flex items-center gap-2">
                        <BookOpen className="h-3.5 w-3.5 text-gray-400" />
                        <span className="text-[10px] font-black uppercase tracking-wider text-gray-600">
                            Classificação CID-10
                        </span>
                        <span className="text-[9px] font-bold text-gray-400 bg-gray-200 px-1.5 py-0.5 rounded-full">
                            {codes.length} {codes.length === 1 ? 'código' : 'códigos'}
                        </span>
                    </div>
                </div>

                {/* Lista de CIDs */}
                <div className="py-1 max-h-60 overflow-y-auto">
                    {codes.map(code => (
                        <CIDRow key={code} code={code} protocolTitle={protocolTitle} />
                    ))}
                </div>

                {/* Footer */}
                <div className="px-4 py-2.5 bg-gray-50/80 border-t border-gray-100">
                    <p className="text-[9px] text-gray-400 font-medium">
                        Código preto → sistema do hospital • "Atestado" → CID + nome da doença
                    </p>
                </div>
            </PopoverContent>
        </Popover>
    );
});
