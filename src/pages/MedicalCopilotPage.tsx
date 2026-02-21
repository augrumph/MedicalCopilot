/**
 * MedicalCopilotPage - Tela de Copiloto Médico
 *
 * Fluxo: Captura de triagem → Processamento via OpenAI Vision → Painel PRD → Resumo
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
    Camera, Zap, AlertTriangle, CheckCircle, Activity,
    FileText, Upload, X,
    Sparkles,
    Copy, Check, Brain, ArrowRight, Clock
} from 'lucide-react';
import { motion } from 'framer-motion';
import { AppLayout } from '@/components/AppLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTriageAnalysis, type TriageAnalysis } from '@/hooks/useTriageAnalysis';
import { CopilotPanel } from '@/components/copilot/CopilotPanel';

type Screen = 'capture' | 'processing' | 'copilot' | 'summary';

export function MedicalCopilotPage() {
    const [screen, setScreen] = useState<Screen>('capture');
    const [triageFile, setTriageFile] = useState<File | null>(null);
    const [triagePreview, setTriagePreview] = useState<string | null>(null);
    const [examsFiles, setExamsFiles] = useState<File[]>([]);
    const [examsPreviews, setExamsPreviews] = useState<string[]>([]);
    const [timer, setTimer] = useState(0);
    const [isRecording, setIsRecording] = useState(false);
    const [triageInput, setTriageInput] = useState<HTMLInputElement | null>(null);
    const [examsInput, setExamsInput] = useState<HTMLInputElement | null>(null);

    const { analyzeImages, analysis, progress, error, reset } = useTriageAnalysis();

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (screen === 'copilot' && isRecording) {
            interval = setInterval(() => setTimer(t => t + 1), 1000);
        }
        return () => clearInterval(interval);
    }, [screen, isRecording]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const handleTriageSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setTriageFile(file);
            setTriagePreview(URL.createObjectURL(file));
        }
    }, []);

    const handleExamsSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length === 0) return;
        setExamsFiles(prev => [...prev, ...files]);
        setExamsPreviews(prev => [...prev, ...files.map(f => URL.createObjectURL(f))]);
        // Reset input so same files can be re-added if needed
        e.target.value = '';
    }, []);

    const handleProcess = useCallback(async () => {
        if (!triageFile && examsFiles.length === 0) return;
        setScreen('processing');
        const result = await analyzeImages(
            triageFile ? [triageFile] : [],
            examsFiles,
        );
        if (result) {
            setScreen('copilot');
            setIsRecording(true);
        } else {
            setScreen('capture');
        }
    }, [triageFile, examsFiles, analyzeImages]);

    const handleReset = useCallback(() => {
        setScreen('capture');
        setTriageFile(null);
        setTriagePreview(null);
        setExamsFiles([]);
        setExamsPreviews([]);
        setTimer(0);
        setIsRecording(false);
        reset();
    }, [reset]);

    return (
        <AppLayout title="Copiloto Médico" description="Análise inteligente de triagem">
            {screen === 'capture' && (
                <CaptureScreen
                    triagePreview={triagePreview}
                    examsPreviews={examsPreviews}
                    onTriageRemove={() => { setTriageFile(null); setTriagePreview(null); }}
                    onExamRemove={(idx) => {
                        setExamsFiles(prev => prev.filter((_, i) => i !== idx));
                        setExamsPreviews(prev => prev.filter((_, i) => i !== idx));
                    }}
                    onTriageClick={() => triageInput?.click()}
                    onExamsClick={() => examsInput?.click()}
                    onProcess={handleProcess}
                    canProcess={!!triageFile || examsFiles.length > 0}
                    error={error}
                />
            )}
            {screen === 'processing' && (
                <ProcessingScreen progress={progress} />
            )}
            {screen === 'copilot' && analysis && (
                <CopilotPanel
                    analysis={analysis}
                    timer={timer}
                    formatTime={formatTime}
                    onFinish={() => { setScreen('summary'); setIsRecording(false); }}
                    onBack={handleReset}
                />
            )}
            {screen === 'summary' && analysis && (
                <SummaryScreen
                    analysis={analysis}
                    timer={timer}
                    formatTime={formatTime}
                    onReset={handleReset}
                />
            )}

            <input
                ref={setTriageInput}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleTriageSelect}
            />
            {/* multiple: sem capture para permitir galeria + câmera */}
            <input
                ref={setExamsInput}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleExamsSelect}
            />
        </AppLayout>
    );
}

// ============================================
// SCREEN 1: CAPTURE
// ============================================
interface CaptureScreenProps {
    triagePreview: string | null;
    examsPreviews: string[];
    onTriageRemove: () => void;
    onExamRemove: (index: number) => void;
    onTriageClick: () => void;
    onExamsClick: () => void;
    onProcess: () => void;
    canProcess: boolean;
    error: string | null;
}

function CaptureScreen({
    triagePreview, examsPreviews,
    onTriageRemove, onExamRemove, onTriageClick, onExamsClick,
    onProcess, canProcess, error
}: CaptureScreenProps) {
    return (
        <div className="min-h-full space-y-4 md:space-y-6 pb-4 md:pb-0">

            {/* Hero Card — mesmo padrão do card "Paciente Atual" no Dashboard */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <Card className="relative overflow-hidden rounded-xl md:rounded-2xl bg-gradient-to-br from-[#450693] via-[#8C00FF] to-[#FF3F7F] shadow-xl border-0">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light" />
                    <div className="absolute top-0 right-0 w-32 h-32 md:w-48 md:h-48 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <CardContent className="relative p-4 md:p-6">
                        <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-sm text-[10px] font-bold tracking-wide mb-3 md:mb-4">
                            <Sparkles className="h-3 w-3 mr-1" />
                            IA Vision · GPT-4o
                        </Badge>
                        <h1 className="text-white text-2xl md:text-3xl font-bold tracking-tight mb-1.5">
                            Copiloto Médico
                        </h1>
                        <p className="text-white/70 text-xs md:text-sm leading-relaxed mb-3 md:mb-4 max-w-sm">
                            Fotografe a ficha de triagem e receba análise clínica completa em segundos.
                        </p>
                        <div className="flex flex-wrap gap-1.5 md:gap-2">
                            {['Sinais Vitais', 'Red Flags', 'Hipóteses', 'Plano Terapêutico'].map(f => (
                                <span key={f} className="text-[10px] md:text-[11px] font-medium text-white/80 bg-white/15 px-2 md:px-2.5 py-0.5 md:py-1 rounded-full border border-white/20">
                                    {f}
                                </span>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Error */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-3 md:p-4"
                >
                    <AlertTriangle className="h-4 w-4 md:h-5 md:w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-semibold text-red-800">Erro ao processar</p>
                        <p className="text-xs md:text-sm text-red-600 mt-0.5 leading-relaxed">{error}</p>
                    </div>
                </motion.div>
            )}

            {/* Triage Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
            >
                <Card className="border-0 shadow-lg bg-white rounded-xl md:rounded-2xl">
                    <CardHeader className="pb-3 md:pb-4 px-3 sm:px-4 md:px-6 pt-3 md:pt-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 md:gap-3">
                                <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg md:rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                                    <FileText className="h-4 w-4 md:h-5 md:w-5 text-purple-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-sm md:text-base">Ficha de Triagem</CardTitle>
                                    <CardDescription className="text-[11px] md:text-xs">Opcional · JPG, PNG, HEIC</CardDescription>
                                </div>
                            </div>
                            <Badge className="bg-purple-100 text-purple-700 border-0 text-[10px] font-bold">Passo 1</Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="px-3 sm:px-4 md:px-6 pb-3 md:pb-6">
                        {!triagePreview ? (
                            <button
                                onClick={onTriageClick}
                                className="group w-full aspect-[4/3] sm:aspect-[16/9] rounded-lg md:rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 hover:border-purple-400/60 hover:bg-purple-50/50 active:scale-[0.99] transition-all duration-200 flex flex-col items-center justify-center gap-3 touch-manipulation"
                            >
                                <div className="h-14 w-14 md:h-16 md:w-16 rounded-xl bg-white border border-gray-200 shadow-sm group-hover:shadow-md group-hover:border-purple-200 flex items-center justify-center transition-all duration-200">
                                    <Camera className="h-6 w-6 md:h-7 md:w-7 text-purple-600" />
                                </div>
                                <div className="text-center">
                                    <p className="text-sm font-semibold text-gray-700 group-hover:text-purple-700 transition-colors">
                                        Fotografar ou Enviar Ficha
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">Toque para selecionar</p>
                                </div>
                            </button>
                        ) : (
                            <div className="relative aspect-[4/3] sm:aspect-[16/9] rounded-lg md:rounded-xl overflow-hidden">
                                <img src={triagePreview} alt="Triagem" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                                    <div className="h-6 w-6 rounded-full bg-green-500 flex items-center justify-center">
                                        <Check className="h-3.5 w-3.5 text-white" />
                                    </div>
                                    <span className="text-white text-xs font-semibold">Triagem capturada</span>
                                </div>
                                <button
                                    onClick={onTriageRemove}
                                    className="absolute top-3 right-3 h-8 w-8 rounded-full bg-black/50 hover:bg-red-500 flex items-center justify-center transition-colors"
                                >
                                    <X className="h-4 w-4 text-white" />
                                </button>
                                <button
                                    onClick={onTriageClick}
                                    className="absolute inset-0 flex items-center justify-center bg-transparent hover:bg-black/20 transition-colors group"
                                >
                                    <span className="text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 px-3 py-1.5 rounded-full">
                                        Trocar imagem
                                    </span>
                                </button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </motion.div>

            {/* Exams Card — suporta múltiplas imagens */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
            >
                <Card className="border-0 shadow-lg bg-white rounded-xl md:rounded-2xl">
                    <CardHeader className="pb-3 md:pb-4 px-3 sm:px-4 md:px-6 pt-3 md:pt-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 md:gap-3">
                                <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg md:rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                                    <Activity className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                                </div>
                                <div>
                                    <CardTitle className="text-sm md:text-base">Exames Prévios</CardTitle>
                                    <CardDescription className="text-[11px] md:text-xs">
                                        Opcional · Múltiplos exames suportados (lab, ECG, RX...)
                                    </CardDescription>
                                </div>
                            </div>
                            <Badge className="bg-blue-100 text-blue-700 border-0 text-[10px] font-bold">
                                {examsPreviews.length > 0 ? `${examsPreviews.length} imagem(ns)` : 'Passo 2'}
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="px-3 sm:px-4 md:px-6 pb-3 md:pb-6 space-y-3">
                        {/* Thumbnails das imagens já adicionadas */}
                        {examsPreviews.length > 0 && (
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                {examsPreviews.map((preview, idx) => (
                                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                                        <img src={preview} alt={`Exame ${idx + 1}`} className="w-full h-full object-cover" />
                                        <button
                                            onClick={() => onExamRemove(idx)}
                                            className="absolute top-1 right-1 h-5 w-5 rounded-full bg-black/60 hover:bg-red-500 flex items-center justify-center transition-colors"
                                        >
                                            <X className="h-3 w-3 text-white" />
                                        </button>
                                        <div className="absolute bottom-0 inset-x-0 bg-black/40 text-white text-[9px] font-bold text-center py-0.5">
                                            #{idx + 1}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {/* Botão de adicionar (sempre visível) */}
                        <button
                            onClick={onExamsClick}
                            className={cn(
                                "group w-full rounded-xl border-2 border-dashed transition-all duration-200 flex items-center justify-center gap-3 touch-manipulation",
                                examsPreviews.length > 0
                                    ? "py-3 border-blue-200 bg-blue-50/50 hover:border-blue-400 hover:bg-blue-50"
                                    : "py-5 md:py-6 border-gray-200 bg-gray-50 hover:border-blue-400/60 hover:bg-blue-50/50"
                            )}
                        >
                            <div className="h-8 w-8 rounded-lg bg-white border border-gray-200 shadow-sm group-hover:border-blue-200 flex items-center justify-center transition-colors">
                                <Upload className="h-4 w-4 text-blue-500" />
                            </div>
                            <span className="text-sm font-semibold text-gray-500 group-hover:text-blue-600 transition-colors">
                                {examsPreviews.length > 0 ? 'Adicionar mais exames' : 'Adicionar Exames'}
                            </span>
                        </button>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Process Button */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
            >
                <Button
                    onClick={onProcess}
                    disabled={!canProcess}
                    size="lg"
                    className={cn(
                        "w-full h-11 sm:h-12 font-bold text-sm md:text-base active:scale-[0.98] touch-manipulation",
                        canProcess
                            ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed hover:bg-gray-100"
                    )}
                >
                    <Zap className={cn("h-4 w-4 mr-2", canProcess && "text-yellow-300")} />
                    Processar e Analisar com IA
                </Button>
                {!canProcess && (
                    <p className="text-xs text-center text-muted-foreground mt-2">
                        Adicione ao menos uma imagem para continuar
                    </p>
                )}
            </motion.div>
        </div>
    );
}

// ============================================
// SCREEN 2: PROCESSING
// ============================================
function ProcessingScreen({ progress }: { progress: number }) {
    const steps = [
        { text: 'Lendo a imagem...', threshold: 15 },
        { text: 'Extraindo dados via OCR...', threshold: 35 },
        { text: 'Gerando análise clínica...', threshold: 60 },
        { text: 'Montando protocolos...', threshold: 82 },
        { text: 'Finalizando...', threshold: 96 },
    ];

    const currentStep = steps.findIndex(s => progress <= s.threshold);
    const activeLabel = currentStep >= 0 ? steps[currentStep].text : 'Concluído!';

    return (
        <div className="min-h-full flex flex-col items-center justify-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-sm"
            >
                <Card className="relative overflow-hidden rounded-xl md:rounded-2xl bg-gradient-to-br from-[#450693] via-[#8C00FF] to-[#FF3F7F] shadow-xl border-0">
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light" />
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <CardContent className="relative p-6 text-center">
                        <div className="relative w-20 h-20 mx-auto mb-6">
                            <div className="absolute inset-0 rounded-full bg-white/20 animate-ping" />
                            <div className="absolute inset-2 rounded-full bg-white/10 animate-ping [animation-delay:0.3s]" />
                            <div className="relative w-20 h-20 rounded-full bg-white/15 backdrop-blur-xl border border-white/25 flex items-center justify-center shadow-xl">
                                <Brain className="h-10 w-10 text-white" />
                            </div>
                        </div>

                        <h2 className="text-white text-xl font-bold mb-1">Analisando Triagem</h2>
                        <p className="text-white/60 text-sm mb-6 font-medium">{activeLabel}</p>

                        <div className="w-full mb-2">
                            <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-white rounded-full transition-all duration-700 ease-out"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <div className="flex items-center justify-between mt-2">
                                <span className="text-white/50 text-xs">Processando</span>
                                <span className="text-white/80 text-xs font-bold tabular-nums">{progress}%</span>
                            </div>
                        </div>

                        <div className="mt-4 text-left space-y-2">
                            {steps.map((step, i) => {
                                const isDone = progress > step.threshold;
                                const isActive = i === currentStep;
                                return (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: isDone || isActive ? 1 : 0.3, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="flex items-center gap-2.5"
                                    >
                                        <div className={cn(
                                            "h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all",
                                            isDone ? "bg-green-400" : isActive ? "bg-white/20 border border-white/40" : "bg-white/10"
                                        )}>
                                            {isDone
                                                ? <Check className="h-3 w-3 text-white" />
                                                : isActive
                                                    ? <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                                                    : null
                                            }
                                        </div>
                                        <span className={cn("text-xs font-medium", isDone || isActive ? "text-white" : "text-white/40")}>
                                            {step.text}
                                        </span>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
}

// ============================================
// SCREEN 4: SUMMARY
// ============================================
interface SummaryScreenProps {
    analysis: TriageAnalysis;
    timer: number;
    formatTime: (s: number) => string;
    onReset: () => void;
}

function SummaryScreen({ analysis, timer, formatTime, onReset }: SummaryScreenProps) {
    const [copied, setCopied] = useState(false);

    const handleCopyToClipboard = useCallback(() => {
        const text = [
            'HISTÓRIA DA MOLÉSTIA ATUAL',
            '',
            analysis.hma,
            '',
            'HIPÓTESES DIAGNÓSTICAS',
            '',
            analysis.diagnosticHypotheses?.map(h => `• ${h.name} (${h.probability})`).join('\n') || '',
        ].join('\n');
        navigator.clipboard.writeText(text).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        });
    }, [analysis]);

    return (
        <div className="min-h-full space-y-4 md:space-y-6 pb-4 md:pb-0">

            {/* Success Stats pills — mesmo estilo do Dashboard */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 md:gap-3">
                    <div className="flex items-center gap-2.5 md:gap-3 bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-xl px-3 py-2.5 md:px-5 md:py-3 shadow-lg shadow-emerald-500/25 flex-1">
                        <div className="flex items-center justify-center h-7 w-7 md:h-8 md:w-8 bg-white/20 rounded-lg flex-shrink-0">
                            <CheckCircle className="h-4 w-4 md:h-5 md:w-5" />
                        </div>
                        <div>
                            <span className="text-base md:text-lg font-bold">Consulta Finalizada</span>
                            <p className="text-white/70 text-xs mt-0.5">{analysis.patientName}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2.5 md:gap-3 bg-gray-900 text-white rounded-xl px-3 py-2.5 md:px-5 md:py-3 shadow-lg shadow-gray-900/20 flex-shrink-0">
                        <div className="flex items-center justify-center h-7 w-7 md:h-8 md:w-8 bg-white/20 rounded-lg flex-shrink-0">
                            <Clock className="h-4 w-4 md:h-5 md:w-5" />
                        </div>
                        <div className="flex items-baseline gap-1.5 md:gap-2">
                            <span className="text-xl md:text-2xl font-bold tabular-nums">{formatTime(timer)}</span>
                            <span className="text-xs md:text-sm text-white/70 font-medium">duração</span>
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* HMA */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                <Card className="border-0 shadow-lg bg-white rounded-xl md:rounded-2xl">
                    <CardHeader className="pb-3 px-3 sm:px-4 md:px-6 pt-3 md:pt-6">
                        <div className="flex items-center gap-2 md:gap-3">
                            <div className="h-8 w-8 md:h-10 md:w-10 rounded-lg md:rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                                <FileText className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
                            </div>
                            <div>
                                <CardTitle className="text-sm md:text-base">História da Moléstia Atual</CardTitle>
                                <CardDescription className="text-[11px] md:text-xs">{analysis.patientName}</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="px-3 sm:px-4 md:px-6 pb-3 md:pb-6">
                        <p className="text-sm text-gray-700 leading-relaxed">{analysis.hma}</p>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Hypotheses */}
            {analysis.diagnosticHypotheses && analysis.diagnosticHypotheses.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                    <Card className="border-2 border-purple-200 shadow-md rounded-xl md:rounded-2xl">
                        <CardContent className="p-3 md:p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center flex-shrink-0">
                                    <Brain className="h-4 w-4 text-purple-600" />
                                </div>
                                <p className="text-[10px] font-bold text-purple-700 uppercase tracking-wider">Hipóteses Diagnósticas</p>
                            </div>
                            <div className="flex flex-wrap gap-1.5 md:gap-2">
                                {analysis.diagnosticHypotheses.map((h, i) => {
                                    const colorMap: Record<string, string> = {
                                        'provável': 'bg-blue-100 text-blue-700 border-blue-200',
                                        'possível': 'bg-purple-100 text-purple-700 border-purple-200',
                                        'diferencial': 'bg-orange-100 text-orange-700 border-orange-200',
                                    };
                                    const style = colorMap[h.probability] ?? 'bg-gray-100 text-gray-700 border-gray-200';
                                    return (
                                        <Badge key={i} className={cn("text-xs font-semibold border px-2.5 py-1", style)}>
                                            {h.name} <span className="opacity-60 ml-1">· {h.probability}</span>
                                        </Badge>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            {/* Actions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-2.5 md:space-y-3"
            >
                <Button
                    onClick={handleCopyToClipboard}
                    size="lg"
                    className={cn(
                        "w-full h-11 sm:h-12 font-bold text-sm md:text-base active:scale-[0.98] touch-manipulation shadow-lg transition-all",
                        copied
                            ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-green-500/25"
                            : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-purple-500/25 hover:shadow-xl"
                    )}
                >
                    {copied
                        ? <><Check className="h-4 w-4 mr-2" /> Copiado com sucesso!</>
                        : <><Copy className="h-4 w-4 mr-2" /> Copiar para Prontuário</>
                    }
                </Button>
                <Button
                    variant="outline"
                    onClick={onReset}
                    size="lg"
                    className="w-full h-10 sm:h-11 border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 touch-manipulation"
                >
                    <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                    Nova Análise
                </Button>
            </motion.div>
        </div>
    );
}
