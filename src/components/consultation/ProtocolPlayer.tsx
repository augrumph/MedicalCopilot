import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    PlayCircle,
    AlertTriangle,
    Syringe,
    Calculator,
    CheckCircle2,
    ArrowRight,
    ChevronRight,
    Activity,
    Clock,
    Info,
    ArrowLeft
} from 'lucide-react';
import { useProtocolsStore } from '@/stores/protocolsStore';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ProtocolPlayerProps {
    compact?: boolean;
    onClose?: () => void;
}

export function ProtocolPlayer({ compact = false, onClose }: ProtocolPlayerProps) {
    const {
        activeProtocol, currentNode, currentEdges,
        moveToNextNode, goBack, resetProtocol
    } = useProtocolsStore();

    // Local state for calculators (SCORE_CALC)
    const [calcAnswers, setCalcAnswers] = useState<Record<string, boolean>>({});

    if (!activeProtocol || !currentNode) return null;

    const renderIconForNodeType = (type: string, size = "w-5 h-5") => {
        switch (type) {
            case 'START': return <PlayCircle className={`${size} text-accent`} />;
            case 'QUESTION': return <AlertTriangle className={`${size} text-warning`} />;
            case 'ACTION': return <Activity className={`${size} text-primary`} />;
            case 'PRESCRIPTION': return <Syringe className={`${size} text-pink-500`} />;
            case 'SCORE_CALC': return <Calculator className={`${size} text-[#682bd7]`} />;
            case 'END': return <CheckCircle2 className={`${size} text-success`} />;
            default: return <Info className={`${size} text-muted-foreground`} />;
        }
    };

    const content = currentNode.content;

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={currentNode.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02, transition: { duration: 0.2 } }}
                className={cn("w-full mx-auto", compact ? "" : "max-w-4xl")}
            >
                {/* Protocol Header for Compact Mode */}
                {compact && (
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#682bd7] to-[#4a1fa0] flex items-center justify-center shadow-lg">
                                <PlayCircle className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h3 className="font-black text-sm text-primary tracking-tight leading-none uppercase">
                                    {activeProtocol.title}
                                </h3>
                                <p className="text-[10px] text-gray-500 font-bold mt-1">Protocolo Ativo</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="icon" onClick={goBack} className="h-8 w-8 rounded-lg bg-gray-50">
                                <ArrowLeft className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => { resetProtocol(); onClose?.(); }} className="h-8 w-8 rounded-lg bg-red-50 text-red-600">
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                )}

                {/* Glassmorphism Container */}
                <div className={cn(
                    "glass-effect overflow-hidden shadow-2xl border border-white/20",
                    compact ? "rounded-3xl" : "rounded-[2.5rem] mb-8 mt-2"
                )}>

                    {/* Progress Indicator */}
                    <div className="h-1.5 w-full bg-primary/5 flex">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: '40%' }} // Mock progress for now
                            className="h-full bg-gradient-to-r from-[#682bd7] to-[#bd2e95]"
                        />
                    </div>

                    <div className={cn("p-6", compact ? "md:p-8" : "md:p-12")}>
                        {/* Header Section */}
                        <div className="flex items-start justify-between mb-8">
                            <div className="flex gap-4">
                                <div className={cn(
                                    "rounded-2xl bg-white shadow-inner flex items-center justify-center border border-gray-100 shrink-0",
                                    compact ? "w-12 h-12" : "w-16 h-16"
                                )}>
                                    {renderIconForNodeType(currentNode.type, compact ? "w-6 h-6" : "w-8 h-8")}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Badge className="bg-primary/5 text-primary border-primary/10 text-[9px] font-black uppercase tracking-widest px-2 py-0.5">
                                            {currentNode.type}
                                        </Badge>
                                        {currentNode.critical && (
                                            <Badge className="bg-red-50 text-red-600 border-red-100 text-[9px] font-black uppercase tracking-widest">
                                                CRÍTICO
                                            </Badge>
                                        )}
                                    </div>
                                    <h2 className={cn(
                                        "font-black text-primary tracking-tight leading-tight",
                                        compact ? "text-xl" : "text-3xl md:text-4xl"
                                    )}>
                                        {currentNode.title || 'Passo Clínico'}
                                    </h2>
                                </div>
                            </div>
                        </div>

                        {/* Node Content */}
                        <div className={cn("flex flex-col justify-center mb-8", compact ? "min-h-[80px]" : "min-h-[140px]")}>
                            {/* TEXT CONTENT */}
                            {(currentNode.type === 'START' || currentNode.type === 'QUESTION' || currentNode.type === 'END' || currentNode.type === 'INFO') && content.text && (
                                <p className={cn(
                                    "font-bold text-gray-800 leading-relaxed italic",
                                    compact ? "text-base" : "text-xl md:text-2xl"
                                )}>
                                    "{content.text}"
                                </p>
                            )}

                            {/* PRESCRIPTION RENDERER */}
                            {currentNode.type === 'PRESCRIPTION' && (
                                <div className="space-y-4">
                                    <div className={cn(
                                        "bg-white border-2 border-gray-100 rounded-[2rem] shadow-sm relative overflow-hidden",
                                        compact ? "p-4" : "p-8"
                                    )}>
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#682bd7]/5 blur-3xl rounded-full" />

                                        <div className="flex items-center gap-2 mb-4">
                                            <div className="p-1.5 bg-[#682bd7]/10 rounded-lg">
                                                <Syringe className="w-4 h-4 text-[#682bd7]" />
                                            </div>
                                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#682bd7]">Prescrição</span>
                                        </div>

                                        <h4 className={cn("font-black text-primary mb-6 tracking-tight", compact ? "text-xl" : "text-3xl")}>
                                            {content.drug_name}
                                        </h4>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <span className="text-[8px] font-black uppercase text-gray-400 tracking-widest">Via Adms.</span>
                                                <div className="text-sm font-bold text-primary flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-[#682bd7]" />
                                                    {content.route}
                                                </div>
                                            </div>
                                            <div>
                                                <span className="text-[8px] font-black uppercase text-gray-400 tracking-widest">Dosagem</span>
                                                <div className="text-xl font-black text-primary">
                                                    {content.dose}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {content.warnings && (
                                        <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex gap-3 text-xs text-amber-900 font-bold">
                                            <AlertTriangle className="w-5 h-5 shrink-0 text-amber-600" />
                                            <ul className="space-y-1">
                                                {content.warnings.map((w: string, i: number) => (
                                                    <li key={i} className="flex items-start gap-1.5">
                                                        <div className="mt-1.5 w-1 h-1 rounded-full bg-amber-400 shrink-0" />
                                                        {w}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ACTION RENDERER */}
                            {currentNode.type === 'ACTION' && (
                                <div className={cn("bg-primary/5 border border-primary/10 rounded-[2rem] relative overflow-hidden", compact ? "p-4" : "p-8")}>
                                    <span className="block text-[8px] font-black uppercase text-primary/50 tracking-widest mb-3">Ação Requerida</span>
                                    {content.instruction && (
                                        <p className={cn("font-black text-primary leading-tight mb-4", compact ? "text-lg" : "text-2xl")}>
                                            {content.instruction}
                                        </p>
                                    )}
                                    {content.time_target_minutes && (
                                        <div className="inline-flex items-center gap-3 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
                                            <Clock className="w-4 h-4 text-[#682bd7]" />
                                            <div>
                                                <div className="text-[8px] font-black uppercase text-gray-400 tracking-widest leading-none">Minutos Alvo</div>
                                                <div className="text-sm font-black text-primary leading-none mt-0.5">{content.time_target_minutes}m</div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* SCORE_CALC RENDERER */}
                            {currentNode.type === 'SCORE_CALC' && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 gap-3">
                                        {content.questions.map((q: any) => (
                                            <div
                                                key={q.id}
                                                onClick={() => setCalcAnswers(prev => ({ ...prev, [q.id]: !prev[q.id] }))}
                                                className={cn(
                                                    "group flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all duration-300",
                                                    calcAnswers[q.id]
                                                        ? 'bg-[#682bd7]/5 border-[#682bd7]'
                                                        : 'bg-white border-gray-100 hover:border-gray-200'
                                                )}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={cn(
                                                        "w-10 h-10 rounded-lg flex items-center justify-center font-black transition-colors",
                                                        calcAnswers[q.id] ? 'bg-[#682bd7] text-white' : 'bg-gray-100 text-gray-400'
                                                    )}>
                                                        +{q.points}
                                                    </div>
                                                    <span className={cn("font-bold text-sm", calcAnswers[q.id] ? 'text-primary' : '')}>{q.text}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className={cn("bg-white rounded-[2rem] border-4 border-primary/5 flex items-center justify-between shadow-xl mt-4", compact ? "p-6" : "p-8")}>
                                        <div>
                                            <div className="text-[8px] font-black uppercase tracking-[0.3em] text-gray-400 mb-1">Escore Total</div>
                                            <div className={cn("font-black tracking-tighter text-primary tabular-nums", compact ? "text-4xl" : "text-6xl")}>
                                                {content.questions.reduce((acc: number, q: any) => acc + (calcAnswers[q.id] ? q.points : 0), 0)}
                                                <span className="text-xl text-gray-300 ml-1 font-black">pts</span>
                                            </div>
                                        </div>
                                        <Button
                                            className="bg-gradient-to-r from-[#682bd7] to-[#4a1fa0] text-white shadow-xl shadow-[#682bd7]/30 transition-all font-black text-sm"
                                            onClick={() => {
                                                const total = content.questions.reduce((acc: number, q: any) => acc + (calcAnswers[q.id] ? q.points : 0), 0);
                                                const matchedEdge = currentEdges.find(e => {
                                                    if (e.condition?.minScore !== undefined && e.condition?.maxScore !== undefined) {
                                                        return total >= e.condition.minScore && total <= e.condition.maxScore;
                                                    }
                                                    if (e.condition?.minScore !== undefined) return total >= e.condition.minScore;
                                                    if (e.condition?.maxScore !== undefined) return total <= e.condition.maxScore;
                                                    return false;
                                                }) || currentEdges[0];

                                                setCalcAnswers({});
                                                moveToNextNode(matchedEdge);
                                            }}
                                        >
                                            CALCULAR
                                            <ArrowRight className="ml-2 w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* DECISION BUTTONS */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {content.options && currentEdges.length > 0 ? (
                                content.options.map((opt: any) => {
                                    const edge = currentEdges.find(e =>
                                        e.condition?.property === 'answer' && e.condition?.value === opt.value
                                    );
                                    if (!edge) return null;

                                    return (
                                        <Button
                                            key={opt.value}
                                            onClick={() => moveToNextNode(edge)}
                                            className={cn(
                                                "w-full h-16 text-lg font-black rounded-2xl shadow-lg transition-all border-0",
                                                opt.color === 'danger' ? 'bg-gradient-to-r from-red-600 to-red-800 text-white' :
                                                    opt.color === 'success' ? 'bg-gradient-to-r from-emerald-600 to-emerald-800 text-white' :
                                                        opt.color === 'warning' ? 'bg-gradient-to-r from-amber-500 to-amber-700 text-white' :
                                                            'bg-gradient-to-r from-gray-800 to-primary text-white'
                                            )}
                                        >
                                            {opt.label}
                                        </Button>
                                    );
                                })
                            ) : (
                                currentEdges.length > 0 && currentEdges.map(edge => (
                                    <Button
                                        key={edge.id}
                                        onClick={() => moveToNextNode(edge)}
                                        className="w-full h-16 text-lg font-black bg-gradient-to-r from-[#682bd7] to-[#4a1fa0] text-white rounded-2xl shadow-xl shadow-[#682bd7]/30 border-0 transition-all col-span-full"
                                    >
                                        PRÓXIMO PASSO
                                        <ChevronRight className="ml-2 w-6 h-6" />
                                    </Button>
                                ))
                            )}

                            {currentNode.type === 'END' && (
                                <Button
                                    onClick={() => { resetProtocol(); onClose?.(); }}
                                    className="w-full h-16 text-xl font-black bg-gradient-to-r from-emerald-600 to-emerald-800 text-white rounded-2xl shadow-xl shadow-emerald-200 border-0 col-span-full"
                                >
                                    CONCLUIR
                                    <CheckCircle2 className="ml-2 w-6 h-6" />
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}

const X = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M18 6 6 18" /><path d="m6 6 12 12" />
    </svg>
);
