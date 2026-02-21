/**
 * CopilotPanel — PRD 7-zone layout
 * Design philosophy: ZERO interaction required.
 * The doctor sees everything at a glance before the consultation starts.
 * All zones are fully expanded by default. No hidden content.
 * Rounded-2xl throughout, matching platform design system.
 */
import React, { useState } from 'react';
import {
    Activity, Pill, Brain, Target, Shield,
    ChevronLeft, HeartPulse, Thermometer, Wind, Droplets,
    Gauge, Clock, CheckCircle2, Circle, Zap, FlaskConical,
    AlertTriangle, ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { VitalBadge } from './VitalBadge';
import type { TriageAnalysis, ExamFinding } from '@/hooks/useTriageAnalysis';

interface CopilotPanelProps {
    analysis: TriageAnalysis;
    timer: number;
    formatTime: (s: number) => string;
    onFinish: () => void;
    onBack: () => void;
}

// ── helpers ───────────────────────────────────────────────────────────────────

const statusConfig = {
    critical: {
        label: 'Instabilidade Crítica',
        bg: 'bg-red-50 border-red-200',
        badge: 'bg-red-100 text-red-700 border-red-200',
        dot: 'bg-red-500 animate-pulse shadow-red-500/50 shadow-sm',
        text: 'text-red-800',
    },
    warning: {
        label: 'Atenção — Risco Moderado',
        bg: 'bg-amber-50 border-amber-200',
        badge: 'bg-amber-100 text-amber-700 border-amber-200',
        dot: 'bg-amber-500',
        text: 'text-amber-800',
    },
    stable: {
        label: 'Estável no Momento',
        bg: 'bg-emerald-50 border-emerald-200',
        badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        dot: 'bg-emerald-500',
        text: 'text-emerald-800',
    },
};

const riskBadgeColor: Record<string, string> = {
    vermelho: 'bg-red-100 text-red-700 border-red-200',
    laranja: 'bg-orange-100 text-orange-700 border-orange-200',
    amarelo: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    verde: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    azul: 'bg-blue-100 text-blue-700 border-blue-200',
};

function getRiskBadge(risk?: string) {
    if (!risk) return 'bg-gray-100 text-gray-600 border-gray-200';
    const key = risk.toLowerCase().split(' ')[0];
    return riskBadgeColor[key] ?? 'bg-gray-100 text-gray-600 border-gray-200';
}

// ── Section header helper ─────────────────────────────────────────────────────

function SectionHeader({ icon, title, badge }: {
    icon: React.ReactNode;
    title: string;
    badge?: React.ReactNode;
}) {
    return (
        <div className="flex items-center gap-2.5 mb-3">
            <div className="p-1.5 bg-gray-100 rounded-xl flex-shrink-0">{icon}</div>
            <span className="text-sm font-bold text-gray-800">{title}</span>
            {badge && <div className="ml-auto">{badge}</div>}
        </div>
    );
}

// ── Zone 1: Patient Header ────────────────────────────────────────────────────

function Zone1Header({ a, timer, formatTime, onBack, onFinish }: {
    a: TriageAnalysis;
    timer: number;
    formatTime: (s: number) => string;
    onBack: () => void;
    onFinish: () => void;
}) {
    const vs = a.vitalSigns;
    return (
        <Card className="border-0 shadow-lg rounded-2xl overflow-hidden">
            {/* Gradient hero */}
            <div className="bg-gradient-to-r from-[#450693] via-[#8C00FF] to-[#FF3F7F] px-4 md:px-6 py-4">
                <div className="flex items-start justify-between gap-3">
                    {/* Left: patient info */}
                    <div className="flex items-start gap-2 flex-1 min-w-0">
                        <button
                            onClick={onBack}
                            className="text-white/60 hover:text-white transition-colors flex-shrink-0 mt-0.5"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h2 className="text-white font-bold text-base md:text-lg leading-tight">{a.patientName}</h2>
                                {a.patientAge && <span className="text-white/70 text-sm">{a.patientAge}</span>}
                                {a.patientSex && <span className="text-white/70 text-sm">· {a.patientSex}</span>}
                            </div>
                            <p className="text-white/80 text-sm mt-0.5 font-medium">{a.chiefComplaint}</p>
                            {a.evolutionTime && (
                                <div className="flex items-center gap-1 text-white/50 text-xs mt-1">
                                    <Clock className="h-3 w-3" />
                                    <span>{a.evolutionTime}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: timer + risk + finish */}
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-xl px-2.5 py-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-300 animate-pulse" />
                            <span className="text-white text-xs font-bold tabular-nums">{formatTime(timer)}</span>
                        </div>
                        {a.riskClassification && (
                            <Badge className={cn('text-[10px] font-bold border', getRiskBadge(a.riskClassification))}>
                                {a.riskClassification}
                            </Badge>
                        )}
                    </div>
                </div>
            </div>

            {/* Vitals + Finish button */}
            <CardContent className="px-4 md:px-6 py-3 bg-white">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Sinais Vitais</p>
                        <div className="flex flex-wrap gap-1.5">
                            {vs.pressaoArterial && <VitalBadge label="PA" value={vs.pressaoArterial} unit="mmHg" icon={<Gauge className="h-3 w-3" />} />}
                            {vs.frequenciaCardiaca && <VitalBadge label="FC" value={vs.frequenciaCardiaca} unit="bpm" icon={<HeartPulse className="h-3 w-3" />} />}
                            {vs.frequenciaRespiratoria && <VitalBadge label="FR" value={vs.frequenciaRespiratoria} unit="irpm" icon={<Wind className="h-3 w-3" />} />}
                            {vs.saturacao && <VitalBadge label="SpO₂" value={vs.saturacao} unit="%" icon={<Droplets className="h-3 w-3" />} />}
                            {vs.temperatura && <VitalBadge label="Temp" value={vs.temperatura} unit="°C" icon={<Thermometer className="h-3 w-3" />} />}
                            {vs.glicemia && <VitalBadge label="Glic" value={vs.glicemia} unit="mg/dL" icon={<Activity className="h-3 w-3" />} />}
                        </div>
                    </div>
                    <Button
                        onClick={onFinish}
                        className="bg-gradient-to-r from-[#450693] to-[#8C00FF] hover:from-[#3a0580] hover:to-[#7a00df] text-white font-bold shadow-md rounded-xl h-10 px-4 flex-shrink-0"
                    >
                        <Zap className="h-3.5 w-3.5 mr-1.5" />
                        <span className="hidden sm:inline">Finalizar</span>
                        <ArrowRight className="h-3.5 w-3.5 sm:hidden" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

// ── Zone 2: Global Status ─────────────────────────────────────────────────────

function Zone2Status({ a }: { a: TriageAnalysis }) {
    const status = a.globalStatus ?? 'stable';
    const cfg = statusConfig[status];
    return (
        <Card className={cn('border-2 shadow-md rounded-2xl', cfg.bg)}>
            <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                    <div className={cn('w-2.5 h-2.5 rounded-full flex-shrink-0', cfg.dot)} />
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Status Global</span>
                    <Badge className={cn('ml-auto text-[10px] border font-bold', cfg.badge)}>
                        {cfg.label}
                    </Badge>
                </div>
                {a.globalStatusText && (
                    <p className={cn('text-sm font-semibold mb-2 leading-snug', cfg.text)}>{a.globalStatusText}</p>
                )}
                {a.alerts && a.alerts.length > 0 && (
                    <div className="space-y-1 mt-2 pt-2 border-t border-black/5">
                        {a.alerts.slice(0, 4).map((alert, i) => (
                            <div key={i} className="flex items-start gap-1.5">
                                <AlertTriangle className="h-3 w-3 text-amber-500 flex-shrink-0 mt-0.5" />
                                <span className="text-xs text-gray-700">{alert}</span>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

// ── Zone 3: Alarm Signs ───────────────────────────────────────────────────────
// Checkboxes are optional — doctor can mark present ones, but all are visible upfront

function Zone3AlarmSigns({ a }: { a: TriageAnalysis }) {
    const [checked, setChecked] = useState<Set<number>>(new Set());
    const toggle = (i: number) => setChecked(prev => {
        const next = new Set(prev);
        next.has(i) ? next.delete(i) : next.add(i);
        return next;
    });
    const flags = a.redFlags?.slice(0, 8) ?? [];
    if (flags.length === 0) return null;

    return (
        <Card className="border-2 border-red-100 shadow-md rounded-2xl">
            <CardHeader className="pb-2 px-4 pt-4">
                <SectionHeader
                    icon={<Shield className="h-4 w-4 text-red-600" />}
                    title="Sinais de Alarme"
                    badge={
                        <Badge className="bg-red-100 text-red-700 border-red-200 text-[10px] border">
                            {flags.length} itens
                        </Badge>
                    }
                />
            </CardHeader>
            <CardContent className="px-4 pb-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {flags.map((f, i) => {
                        const isChecked = checked.has(i);
                        return (
                            <button
                                key={i}
                                onClick={() => toggle(i)}
                                className={cn(
                                    'flex items-center gap-2.5 text-left rounded-xl px-3 py-2.5 transition-all border',
                                    isChecked
                                        ? 'bg-red-100 border-red-300'
                                        : 'bg-gray-50 border-gray-100 hover:border-red-200 hover:bg-red-50/50'
                                )}
                            >
                                {isChecked
                                    ? <CheckCircle2 className="h-4 w-4 text-red-500 flex-shrink-0" />
                                    : <Circle className="h-4 w-4 text-gray-300 flex-shrink-0" />
                                }
                                <span className={cn('text-sm leading-snug', isChecked ? 'text-red-700 font-semibold' : 'text-gray-700')}>
                                    {f.description}
                                </span>
                            </button>
                        );
                    })}
                </div>
                <p className="text-[10px] text-gray-400 mt-2">Toque para marcar os presentes durante a consulta.</p>
            </CardContent>
        </Card>
    );
}

// ── Zone 4: Clinical Synthesis ────────────────────────────────────────────────

function Zone4Synthesis({ a }: { a: TriageAnalysis }) {
    const bullets = a.clinicalSynthesis?.slice(0, 6) ?? [];
    return (
        <Card className="border-0 shadow-md rounded-2xl">
            <CardHeader className="pb-2 px-4 pt-4">
                <SectionHeader
                    icon={<Brain className="h-4 w-4 text-purple-600" />}
                    title="Síntese Clínica"
                />
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-2">
                {bullets.map((b, i) => (
                    <div key={i} className="flex items-start gap-2.5 bg-purple-50/50 rounded-xl px-3 py-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-2 flex-shrink-0" />
                        <span className="text-sm text-gray-700 leading-snug">{b}</span>
                    </div>
                ))}
                {bullets.length === 0 && a.complaintDetail && (
                    <p className="text-sm text-gray-600 leading-relaxed">{a.complaintDetail}</p>
                )}
                {a.hma && (
                    <>
                        <Separator className="my-1" />
                        <div className="bg-gray-50 rounded-xl px-3 py-2.5">
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">HMA</p>
                            <p className="text-xs text-gray-600 leading-relaxed">{a.hma}</p>
                        </div>
                    </>
                )}
            </CardContent>
        </Card>
    );
}

// ── Zone 5: Protocol Trail ────────────────────────────────────────────────────

function Zone5Protocol({ a }: { a: TriageAnalysis }) {
    return (
        <Card className="border-2 border-amber-200 shadow-md rounded-2xl bg-amber-50/30">
            <CardHeader className="pb-2 px-4 pt-4">
                <SectionHeader
                    icon={<Target className="h-4 w-4 text-amber-700" />}
                    title="Protocolo Sugerido"
                />
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-3">
                {(a.mainProtocol || a.suggestedProtocol) && (
                    <div className="bg-amber-100/60 border border-amber-200 rounded-xl px-3 py-2.5">
                        <p className="text-sm font-bold text-amber-900">{a.mainProtocol || a.suggestedProtocol}</p>
                    </div>
                )}

                {a.differentials && a.differentials.length > 0 && (
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Diferenciais Graves</p>
                        <div className="flex flex-wrap gap-1.5">
                            {a.differentials.map((d, i) => (
                                <Badge key={i} variant="outline" className="text-xs bg-orange-50 text-orange-700 border-orange-200 rounded-lg">
                                    {d}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}

                {a.timeline && a.timeline.length > 0 && (
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Linha do Tempo</p>
                        <div className="space-y-1.5">
                            {a.timeline.map((t, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-lg min-w-[3.5rem] text-center flex-shrink-0">
                                        {t.timing}
                                    </span>
                                    <span className="text-xs text-gray-700">{t.action}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {a.protocolDetail && (
                    <>
                        <Separator />
                        <p className="text-xs text-gray-500 leading-relaxed">{a.protocolDetail}</p>
                    </>
                )}
            </CardContent>
        </Card>
    );
}

// ── Zone 6: Conduct ───────────────────────────────────────────────────────────

function Zone6Conduct({ a }: { a: TriageAnalysis }) {
    return (
        <Card className="border-0 shadow-md rounded-2xl">
            <CardHeader className="pb-2 px-4 pt-4">
                <SectionHeader
                    icon={<FlaskConical className="h-4 w-4 text-blue-600" />}
                    title="Conduta Provável"
                />
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-3">
                {a.exams && a.exams.length > 0 && (
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Propedêutica</p>
                        <div className="space-y-1">
                            {a.exams.map((e, i) => (
                                <div key={i} className="flex items-center gap-2 bg-blue-50/50 rounded-xl px-3 py-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                                    <span className="text-sm text-gray-700 flex-1">{e.name}</span>
                                    {e.urgency === 'URGENTE' && (
                                        <Badge className="bg-amber-100 text-amber-700 border-amber-200 text-[10px] border rounded-lg">URGENTE</Badge>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {a.exams?.length > 0 && a.medications?.length > 0 && <Separator />}

                {a.medications && a.medications.length > 0 && (
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Terapêutica Inicial</p>
                        <div className="space-y-1.5">
                            {a.medications.map((m, i) => (
                                <div key={i} className="flex items-start gap-2.5 bg-green-50 border border-green-100 rounded-xl px-3 py-2.5">
                                    <Pill className="h-3.5 w-3.5 text-green-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <span className="text-sm font-bold text-gray-900">{m.name}</span>
                                        <span className="text-sm text-gray-500"> — {m.dosage} · {m.route}</span>
                                        {m.detailedDose && (
                                            <p className="text-xs text-gray-400 mt-0.5">{m.detailedDose}</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

// ── Zone 7: Diagnostic Hypotheses ────────────────────────────────────────────

function Zone7Hypotheses({ a }: { a: TriageAnalysis }) {
    const hyps = a.diagnosticHypotheses ?? [];
    if (hyps.length === 0) return null;

    const colorMap: Record<string, { card: string; badge: string }> = {
        'provável': { card: 'bg-blue-50 border-blue-200', badge: 'bg-blue-100 text-blue-700 border-blue-200' },
        'possível': { card: 'bg-purple-50 border-purple-200', badge: 'bg-purple-100 text-purple-700 border-purple-200' },
        'diferencial': { card: 'bg-orange-50 border-orange-200', badge: 'bg-orange-100 text-orange-700 border-orange-200' },
    };

    return (
        <Card className="border-2 border-purple-100 shadow-md rounded-2xl">
            <CardHeader className="pb-2 px-4 pt-4">
                <SectionHeader
                    icon={<Brain className="h-4 w-4 text-purple-600" />}
                    title="Hipóteses Diagnósticas"
                    badge={
                        <Badge className="bg-purple-100 text-purple-700 border-purple-200 border text-[10px]">
                            {hyps.length} hipóteses
                        </Badge>
                    }
                />
            </CardHeader>
            <CardContent className="px-4 pb-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                    {hyps.map((h, i) => {
                        const colors = colorMap[h.probability] ?? { card: 'bg-gray-50 border-gray-200', badge: 'bg-gray-100 text-gray-700 border-gray-200' };
                        return (
                            <div key={i} className={cn('rounded-xl border p-3', colors.card)}>
                                <div className="flex items-start justify-between gap-1 mb-1">
                                    <span className="text-sm font-bold text-gray-900 leading-snug">{h.name}</span>
                                    <Badge className={cn('text-[10px] border flex-shrink-0', colors.badge)}>
                                        {h.probability}
                                    </Badge>
                                </div>
                                {h.rationale && (
                                    <p className="text-xs text-gray-500 leading-relaxed mt-1">{h.rationale}</p>
                                )}
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}

// ── Zone 8: Exam Findings (deep analysis, shown when exams were sent) ─────────

function ZoneExamFindings({ findings }: { findings: ExamFinding[] }) {
    const statusOrder: Record<string, number> = { critico: 0, alterado: 1, normal: 2 };
    const sorted = [...findings].sort((a, b) =>
        (statusOrder[a.status] ?? 3) - (statusOrder[b.status] ?? 3)
    );

    const statusStyle: Record<string, { row: string; badge: string; label: string }> = {
        critico: {
            row: 'bg-red-50 border-l-4 border-l-red-500',
            badge: 'bg-red-100 text-red-700 border-red-200',
            label: 'CRÍTICO',
        },
        alterado: {
            row: 'bg-amber-50 border-l-4 border-l-amber-400',
            badge: 'bg-amber-100 text-amber-700 border-amber-200',
            label: 'ALTERADO',
        },
        normal: {
            row: 'bg-white border-l-4 border-l-emerald-400',
            badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            label: 'NORMAL',
        },
    };

    const criticalCount = sorted.filter(f => f.status === 'critico').length;
    const alteredCount = sorted.filter(f => f.status === 'alterado').length;

    return (
        <Card className="border-2 border-blue-100 shadow-md rounded-2xl">
            <CardHeader className="pb-2 px-4 pt-4">
                <SectionHeader
                    icon={<Activity className="h-4 w-4 text-blue-600" />}
                    title="Achados dos Exames — Análise Detalhada"
                    badge={
                        <div className="flex gap-1.5">
                            {criticalCount > 0 && (
                                <Badge className="bg-red-100 text-red-700 border-red-200 border text-[10px]">
                                    {criticalCount} crítico{criticalCount > 1 ? 's' : ''}
                                </Badge>
                            )}
                            {alteredCount > 0 && (
                                <Badge className="bg-amber-100 text-amber-700 border-amber-200 border text-[10px]">
                                    {alteredCount} alterado{alteredCount > 1 ? 's' : ''}
                                </Badge>
                            )}
                        </div>
                    }
                />
            </CardHeader>
            <CardContent className="px-4 pb-4 space-y-2">
                {sorted.map((f, i) => {
                    const s = statusStyle[f.status] ?? statusStyle.normal;
                    return (
                        <div key={i} className={cn('rounded-xl px-3 py-2.5', s.row)}>
                            <div className="flex items-start justify-between gap-2 mb-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-sm font-bold text-gray-900">{f.parameter}</span>
                                    <span className="text-sm font-bold text-gray-700 tabular-nums">{f.value}</span>
                                    {f.reference && (
                                        <span className="text-xs text-gray-400">ref: {f.reference}</span>
                                    )}
                                </div>
                                <Badge className={cn('text-[10px] border flex-shrink-0', s.badge)}>
                                    {s.label}
                                </Badge>
                            </div>
                            {f.interpretation && (
                                <p className="text-xs text-gray-700 leading-snug mb-1">{f.interpretation}</p>
                            )}
                            {f.clinicalAction && f.status !== 'normal' && (
                                <div className="flex items-start gap-1.5 mt-1">
                                    <ArrowRight className="h-3 w-3 text-blue-500 flex-shrink-0 mt-0.5" />
                                    <p className="text-xs text-blue-700 font-medium leading-snug">{f.clinicalAction}</p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
}

// ── Main export ──────────────────────────────────────────────────────────────

export function CopilotPanel({ analysis: a, timer, formatTime, onFinish, onBack }: CopilotPanelProps) {
    return (
        <div className="space-y-4 pb-8">
            {/* Zone 1 — Patient Header + Vitals */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                <Zone1Header a={a} timer={timer} formatTime={formatTime} onBack={onBack} onFinish={onFinish} />
            </motion.div>

            {/* Zone 2 — Global Status (always first thing the doctor reads) */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
                <Zone2Status a={a} />
            </motion.div>

            {/* ── DESKTOP: 2-column grid ── */}
            <div className="hidden md:grid md:grid-cols-[60%_40%] gap-4">
                {/* Left column */}
                <div className="space-y-4">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <Zone3AlarmSigns a={a} />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                        <Zone4Synthesis a={a} />
                    </motion.div>
                </div>

                {/* Right column */}
                <div className="space-y-4">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                        <Zone5Protocol a={a} />
                    </motion.div>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                        <Zone6Conduct a={a} />
                    </motion.div>
                </div>
            </div>

            {/* ── MOBILE: vertical stack, all expanded ── */}
            <div className="md:hidden space-y-4">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                    <Zone3AlarmSigns a={a} />
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
                    <Zone4Synthesis a={a} />
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                    <Zone5Protocol a={a} />
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                    <Zone6Conduct a={a} />
                </motion.div>
            </div>

            {/* Zone 7 — Hypotheses (always at bottom, fully visible) */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <Zone7Hypotheses a={a} />
            </motion.div>

            {/* Zone 8 — Exam Findings (only when exams were sent) */}
            {a.examFindings && a.examFindings.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                    <ZoneExamFindings findings={a.examFindings} />
                </motion.div>
            )}

            {/* Finish button — bottom of page, easy to reach after review */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                <Button
                    onClick={onFinish}
                    size="lg"
                    className="w-full h-12 bg-gradient-to-r from-[#450693] to-[#8C00FF] hover:from-[#3a0580] hover:to-[#7a00df] text-white font-bold shadow-lg rounded-2xl text-base"
                >
                    <Zap className="h-4 w-4 mr-2" />
                    Finalizar Consulta
                </Button>
            </motion.div>
        </div>
    );
}
