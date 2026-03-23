/**
 * TutorialModal — Tour interativo do Medical Copilot
 *
 * Ilustrações fiéis à interface real da plataforma.
 * Responsivo: mobile, tablet e desktop.
 * Tema light: fundos brancos, texto escuro, acentos em roxo.
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  ArrowRight,
  X,
  Mic,
  FileText,
  Stethoscope,
  Clock,
  Wallet,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Copy,
  BookOpen,
  Zap,
  CheckCircle2,
  Plus,
  Search,
  WalletMinimal,
  ClipboardCheck,
  AlertTriangle,
  Play,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ShimmerButton } from '@/components/ui/shimmer-button';

// ─────────────────────────────────────────────────────────────────────────────
// Illustration: Welcome
// ─────────────────────────────────────────────────────────────────────────────

function IllustrationWelcome({ name }: { name: string }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Orbiting rings */}
      {[72, 116, 160].map((size, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-purple-200/40"
          style={{ width: size, height: size }}
          animate={{ rotate: 360 }}
          transition={{ duration: 10 + i * 5, repeat: Infinity, ease: 'linear' }}
        />
      ))}

      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 180, damping: 14, delay: 0.15 }}
        className="relative z-10 flex flex-col items-center gap-3"
      >
        {/* Logo box — keep dark/purple */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-[#512B81] flex items-center justify-center shadow-2xl shadow-purple-300/40">
          <Activity className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <p className="text-slate-400 text-[10px] font-black tracking-[0.2em] uppercase">Medical Copilot</p>
          <p className="text-slate-800 font-black text-lg sm:text-xl mt-0.5">
            Olá, Dr. {name.split(' ')[0]}!
          </p>
        </motion.div>
      </motion.div>

      {/* Floating sparkles */}
      {[
        { top: '20%', left: '12%', delay: 0.3 },
        { top: '22%', right: '14%', delay: 0.6 },
        { bottom: '24%', left: '16%', delay: 0.9 },
        { bottom: '20%', right: '12%', delay: 0.45 },
      ].map((pos, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={pos as React.CSSProperties}
          animate={{ y: [-4, 4, -4], opacity: [0.3, 0.9, 0.3] }}
          transition={{ duration: 2.5 + i * 0.6, repeat: Infinity, delay: pos.delay as number }}
        >
          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400" />
        </motion.div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Illustration: Dashboard hero card (replica real)
// ─────────────────────────────────────────────────────────────────────────────

function IllustrationDashboard() {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setActive(true), 700);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden px-3 sm:px-5">
      <div className="w-full max-w-[280px] sm:max-w-xs z-10 space-y-2.5">
        {/* Toggle row — light */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-2.5 bg-white border border-slate-200 rounded-2xl px-3.5 py-2.5"
        >
          <motion.div
            animate={active ? { scale: [1, 1.4, 1] } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
            className={`w-2 h-2 rounded-full flex-shrink-0 ${active ? 'bg-emerald-500' : 'bg-slate-300'}`}
          />
          <span className={`text-xs font-bold transition-colors ${active ? 'text-emerald-600' : 'text-slate-400'}`}>
            {active ? 'Plantão Ativo · UPA Central' : 'Offline · Inicie seu plantão'}
          </span>
        </motion.div>

        {/* Dark hero card — KEEP DARK, this is the real UI */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.25 }}
          className="bg-[#1b1b1b] rounded-[20px] p-4 sm:p-5 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #1b1b1b 60%, #2d1260 100%)' }}
        >
          {/* Purple glow */}
          <div className="absolute top-0 right-0 w-20 h-20 bg-[#512B81]/20 rounded-full blur-2xl" />

          <div className="relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 bg-[#512B81]/20 border border-[#512B81]/30 rounded-full px-2.5 py-1 mb-3">
              <Stethoscope className="w-2.5 h-2.5 text-white/70" />
              <span className="text-[9px] font-black text-white uppercase tracking-widest">Copiloto Ativo</span>
            </div>

            <h3 className="text-white font-bold text-sm sm:text-base leading-tight mb-3">
              Iniciar Novo{' '}
              <span style={{ color: '#a876c4' }}>Atendimento</span>
            </h3>

            <p className="text-white/40 text-[10px] mb-3 leading-relaxed">
              IA treinada com protocolos oficiais, ativa em tempo real.
            </p>

            {/* CTA button */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center justify-center gap-2 bg-[#512B81] rounded-2xl h-9 cursor-default"
            >
              <Plus className="w-3.5 h-3.5 text-white" strokeWidth={3} />
              <span className="text-white text-xs font-bold">Novo Atendimento</span>
            </motion.div>
          </div>
        </motion.div>

        {/* Protocol shortcuts — light */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 gap-1.5"
        >
          {[
            { label: 'Dor Torácica', color: '#512B81' },
            { label: 'Sepse', color: '#F61115' },
            { label: 'AVC Isquêmico', color: '#512B81' },
            { label: 'Manchester', color: '#1B1B1B' },
          ].map((p, i) => (
            <motion.div
              key={p.label}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55 + i * 0.1 }}
              className="flex items-center gap-1.5 bg-white border border-slate-100 rounded-xl px-2.5 py-2"
            >
              <Zap className="w-3 h-3 flex-shrink-0" style={{ color: p.color === '#1B1B1B' ? '#94a3b8' : p.color }} />
              <span className="text-slate-700 text-[10px] font-medium truncate">{p.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Illustration: Consultation / Voice → Protocol Discovery
// ─────────────────────────────────────────────────────────────────────────────

function IllustrationConsulta() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const ts = [
      setTimeout(() => setPhase(1), 700),
      setTimeout(() => setPhase(2), 1800),
      setTimeout(() => setPhase(3), 2800),
    ];
    return () => ts.forEach(clearTimeout);
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden px-3 sm:px-5">
      <div className="w-full max-w-[280px] sm:max-w-xs z-10 space-y-2.5">
        {/* Progress bar — light */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-1 bg-white border border-slate-200 rounded-full px-2.5 py-1.5"
        >
          {['Queixa', 'Protocolo', 'SOAP'].map((label, i) => (
            <div key={label} className="flex items-center gap-1">
              <span
                className={`text-[9px] font-black px-2 py-0.5 rounded-full transition-all ${
                  i <= phase ? 'bg-[#512B81] text-white' : 'text-slate-400'
                }`}
              >
                {label}
              </span>
              {i < 2 && <ChevronRight className="w-2 h-2 text-slate-300 flex-shrink-0" />}
            </div>
          ))}
          <div className="ml-auto flex items-center gap-1 bg-slate-50 rounded-full px-2 py-0.5">
            <Clock className="w-2.5 h-2.5 text-[#512B81]" />
            <span className="text-[9px] text-slate-500 font-bold">0:42</span>
          </div>
        </motion.div>

        {/* Mic + sound bars — light card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center gap-2 bg-white border border-slate-100 rounded-2xl py-3"
        >
          <motion.div
            animate={phase === 0 ? { scale: [1, 1.15, 1], boxShadow: ['0 0 0 0 rgba(16,185,129,0)', '0 0 0 8px rgba(16,185,129,0.15)', '0 0 0 0 rgba(16,185,129,0)'] } : {}}
            transition={{ duration: 1.2, repeat: Infinity }}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              phase <= 1 ? 'bg-emerald-500' : 'bg-slate-100'
            }`}
          >
            <Mic className={`w-5 h-5 ${phase <= 1 ? 'text-white' : 'text-slate-400'}`} />
          </motion.div>

          {phase <= 1 && (
            <div className="flex items-end gap-0.5 h-4">
              {[3, 7, 10, 14, 10, 7, 4, 9, 12, 7, 4].map((h, i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-emerald-400 rounded-full"
                  animate={{ height: [h, h * 1.8, h] }}
                  transition={{ duration: 0.45, repeat: Infinity, delay: i * 0.07 }}
                  style={{ height: h }}
                />
              ))}
            </div>
          )}

          <AnimatePresence>
            {phase >= 1 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-slate-500 text-[9px] px-4 text-center leading-relaxed"
              >
                "Paciente 65a, dor precordial há 2h, irradiando para braço esquerdo..."
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Hypothesis cards — light */}
        <AnimatePresence>
          {phase >= 2 && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-1.5"
            >
              <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest px-1">Hipóteses — Cori</p>
              {[
                { label: 'SCA / Angina Instável', badge: 'Provável', color: 'blue' },
                { label: 'IAM sem supra', badge: 'Possível', color: 'purple' },
              ].map((h, i) => (
                <motion.div
                  key={h.label}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.2 }}
                  className="flex items-center gap-2 bg-white border border-slate-100 rounded-xl px-3 py-2"
                >
                  <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${
                    h.color === 'blue' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                  }`}>{h.badge}</span>
                  <span className="text-slate-700 text-[10px] font-medium">{h.label}</span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Active protocol badge — light purple */}
        <AnimatePresence>
          {phase >= 3 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 bg-purple-50 border border-purple-200 rounded-xl px-3 py-2"
            >
              <div className="w-6 h-6 rounded-lg bg-[#512B81] flex items-center justify-center flex-shrink-0">
                <Zap className="w-3 h-3 text-white" />
              </div>
              <div>
                <p className="text-[8px] font-black text-purple-400 uppercase tracking-widest">Protocolo Ativo</p>
                <p className="text-purple-800 text-[10px] font-bold">SCA — Dor Torácica</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Illustration: Protocols library (replica real — light)
// ─────────────────────────────────────────────────────────────────────────────

function IllustrationProtocolos() {
  const protocols = [
    { name: 'Sepse Grave', triage: 'VERMELHO', bgCard: 'bg-red-50', border: 'border-red-100', badge: 'bg-red-600 text-white', source: 'SEPSIS-3 / ILAS', sourceColor: 'text-red-600' },
    { name: 'Dor Torácica', triage: 'LARANJA', bgCard: 'bg-orange-50', border: 'border-orange-100', badge: 'bg-orange-500 text-white', source: 'SBC 2023', sourceColor: 'text-orange-600' },
    { name: 'AVC Isquêmico', triage: 'VERMELHO', bgCard: 'bg-red-50', border: 'border-red-100', badge: 'bg-red-600 text-white', source: 'AHA/ASA 2023', sourceColor: 'text-red-600' },
  ];

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden px-3 sm:px-5">
      <div className="w-full max-w-[280px] sm:max-w-xs z-10 space-y-2">
        {/* Search bar — light */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2"
        >
          <Search className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          <span className="text-slate-400 text-[10px] font-medium">Buscar protocolo, CID-10...</span>
        </motion.div>

        {/* Triage filter — light */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="flex gap-1.5"
        >
          {[
            { label: 'Vermelho', activeBg: 'bg-red-600', activeDot: 'bg-white/60', dotColor: 'bg-red-600' },
            { label: 'Laranja', activeBg: 'bg-orange-500', activeDot: 'bg-white/60', dotColor: 'bg-orange-500' },
            { label: 'Amarelo', activeBg: 'bg-amber-400', activeDot: 'bg-white/60', dotColor: 'bg-amber-400' },
          ].map((t, i) => (
            <div
              key={t.label}
              className={`flex items-center gap-1 rounded-full px-2 py-0.5 ${
                i === 0 ? `${t.activeBg}` : 'bg-white border border-slate-200'
              }`}
            >
              <div className={`w-1.5 h-1.5 rounded-full ${i === 0 ? t.activeDot : t.dotColor}`} />
              <span className={`text-[8px] font-black ${i === 0 ? 'text-white' : 'text-slate-500'}`}>{t.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Protocol cards — light tinted */}
        {protocols.map((p, i) => (
          <motion.div
            key={p.name}
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + i * 0.18 }}
            className={`${p.bgCard} border ${p.border} rounded-2xl px-3 py-2.5`}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-full ${p.badge}`}>{p.triage}</span>
              <div className="flex items-center gap-1 ml-auto">
                <BookOpen className="w-2.5 h-2.5 text-[#512B81]" />
                <span className={`text-[8px] font-extrabold uppercase ${p.sourceColor}`}>{p.source}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-slate-800 text-xs font-black">{p.name}</p>
              <div className="flex items-center gap-1 text-[#512B81]">
                <span className="text-[8px] font-black uppercase">Iniciar</span>
                <Play className="w-2.5 h-2.5" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Illustration: SOAP generation (replica real — light)
// ─────────────────────────────────────────────────────────────────────────────

function IllustrationSoap() {
  const fields = [
    { key: 'S', label: 'Subjetivo', text: 'Paciente relata dor precordial há 2h, irradiando para braço esquerdo. Diaforético.' },
    { key: 'O', label: 'Objetivo', text: 'PA 148/92, FC 94, SpO2 97%. ECG: inversão de onda T em V1-V4.' },
    { key: 'A', label: 'Avaliação', text: 'Síndrome Coronariana Aguda sem supra ST. TIMI 4/7.' },
    { key: 'P', label: 'Plano', text: 'AAS 200mg + Clopidogrel 300mg. Heparina 60UI/kg. Cardiologista acionado.' },
  ];

  const [generated, setGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setGenerating(true), 600);
    const t2 = setTimeout(() => { setGenerating(false); setGenerated(true); }, 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden px-3 sm:px-5">
      <div className="w-full max-w-[280px] sm:max-w-xs z-10 space-y-2">
        {/* Header bar — light */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 justify-between bg-slate-50 border border-slate-100 rounded-xl px-3 py-2"
        >
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center">
              <FileText className="w-3 h-3 text-[#512B81]" />
            </div>
            <div>
              <p className="text-slate-700 text-[9px] font-black uppercase tracking-widest">Registro SOAP</p>
              <p className="text-slate-400 text-[8px]">Sincronização em tempo real</p>
            </div>
          </div>
          <div className="flex gap-1.5">
            <motion.div
              animate={generating ? { opacity: [1, 0.5, 1] } : {}}
              transition={{ duration: 0.6, repeat: Infinity }}
              className="flex items-center gap-1 border border-purple-200 rounded-lg px-2 py-1"
            >
              <Sparkles className="w-2.5 h-2.5 text-purple-700" />
              <span className="text-[8px] font-bold text-purple-700">
                {generating ? 'Gerando...' : 'Gerar com IA'}
              </span>
            </motion.div>
            <div className="flex items-center gap-1 bg-slate-900 rounded-lg px-2 py-1">
              <ClipboardCheck className="w-2.5 h-2.5 text-white" />
              <span className="text-[8px] font-bold text-white">Copiar</span>
            </div>
          </div>
        </motion.div>

        {/* SOAP fields grid — light */}
        <div className="grid grid-cols-2 gap-1.5">
          {fields.map((f, i) => (
            <motion.div
              key={f.key}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 + i * 0.1 }}
              className="relative bg-white border border-slate-100 rounded-xl p-2"
            >
              <div className="flex items-center gap-1 mb-1.5">
                <span className={`text-[8px] font-black px-1 py-0.5 rounded ${
                  generated ? 'bg-[#512B81] text-white' : 'bg-slate-100 text-slate-400'
                }`}>{f.key}</span>
                <span className="text-slate-400 text-[8px] font-bold uppercase">{f.label}</span>
              </div>
              {generated ? (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.15 }}
                  className="text-slate-600 text-[8px] leading-relaxed line-clamp-3"
                >
                  {f.text}
                </motion.p>
              ) : (
                <div className="space-y-1">
                  <div className="h-1.5 bg-slate-100 rounded-full w-full" />
                  <div className="h-1.5 bg-slate-100 rounded-full w-4/5" />
                  <div className="h-1.5 bg-slate-100 rounded-full w-3/5" />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-center gap-1.5 opacity-50"
        >
          <AlertTriangle className="w-2.5 h-2.5 text-slate-400 flex-shrink-0" />
          <p className="text-slate-400 text-[8px] font-bold uppercase tracking-wide">
            Apoio ao raciocínio clínico. Decisão final é do médico.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Illustration: Shift Finance (replica real — light)
// ─────────────────────────────────────────────────────────────────────────────

function IllustrationPlantoes() {
  const shifts = [
    { local: 'UPA Central', date: '14 Mar 2026', value: 'R$ 850', status: 'Recebido' },
    { local: 'Hospital São Lucas', date: '11 Mar 2026', value: 'R$ 1.200', status: 'Pendente' },
    { local: 'PS Municipal', date: '08 Mar 2026', value: 'R$ 950', status: 'Recebido' },
  ];

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden px-3 sm:px-5">
      <div className="w-full max-w-[280px] sm:max-w-xs z-10 space-y-2.5">
        {/* Header — light */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center">
              <WalletMinimal className="w-4 h-4 text-[#512B81]" />
            </div>
            <div>
              <p className="text-slate-700 text-xs font-black uppercase tracking-widest">Meus Plantões</p>
              <p className="text-slate-400 text-[9px]">Controle financeiro</p>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-[#512B81] rounded-full px-2.5 py-1">
            <Plus className="w-3 h-3 text-white" strokeWidth={3} />
            <span className="text-[9px] font-bold text-white">Novo</span>
          </div>
        </motion.div>

        {/* Total card — green-50 light */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-green-50 border border-emerald-200 rounded-2xl px-4 py-3"
        >
          <p className="text-emerald-600 text-[9px] font-black uppercase tracking-widest mb-0.5">Recebido em Março</p>
          <p className="text-emerald-800 font-black text-xl">R$ 3.000</p>
          <p className="text-emerald-500 text-[9px]">3 plantões registrados</p>
        </motion.div>

        {/* Shift list — light */}
        {shifts.map((s, i) => (
          <motion.div
            key={s.local}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.15 }}
            className="flex items-center gap-2.5 bg-white border border-slate-100 rounded-xl px-3 py-2.5"
          >
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${s.status === 'Recebido' ? 'bg-emerald-500' : 'bg-amber-400'}`} />
            <div className="flex-1 min-w-0">
              <p className="text-slate-700 text-[10px] font-bold truncate">{s.local}</p>
              <p className="text-slate-400 text-[9px]">{s.date}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className={`text-[10px] font-black ${s.status === 'Recebido' ? 'text-emerald-600' : 'text-amber-600'}`}>{s.value}</p>
              <p className="text-slate-400 text-[8px]">{s.status}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Slides config — light theme
// ─────────────────────────────────────────────────────────────────────────────

const SLIDES = [
  {
    id: 'welcome',
    illustrationBg: 'bg-gradient-to-br from-purple-50 to-violet-100/60',
    topBorderGradient: 'from-[#512B81] to-[#a876c4]',
    accentColor: '#512B81',
    tag: null as string | null,
    title: (name: string) => `Bem-vindo, Dr. ${name.split(' ')[0]}!`,
    subtitle: 'Em 5 slides você descobre como o Medical Copilot vai transformar sua rotina de plantão. Tour rápido, prático e direto ao ponto.',
    illustration: (name: string) => <IllustrationWelcome name={name} />,
  },
  {
    id: 'dashboard',
    illustrationBg: 'bg-gradient-to-br from-slate-50 to-purple-50/40',
    topBorderGradient: 'from-[#512B81] to-[#a876c4]',
    accentColor: '#512B81',
    tag: '01 — Cockpit',
    title: () => 'Seu painel de controle',
    subtitle: 'Ative o plantão, inicie atendimentos e acesse os principais protocolos de emergência diretamente do painel. Tudo em um só lugar.',
    illustration: () => <IllustrationDashboard />,
  },
  {
    id: 'consulta',
    illustrationBg: 'bg-gradient-to-br from-emerald-50 to-teal-100/40',
    topBorderGradient: 'from-emerald-400 to-teal-500',
    accentColor: '#059669',
    tag: '02 — Atendimento',
    title: () => 'Fale. A Cori anota e analisa.',
    subtitle: 'Inicie um atendimento e fale normalmente com o paciente. A transcrição e as hipóteses diagnósticas acontecem em tempo real, enquanto você atende.',
    illustration: () => <IllustrationConsulta />,
  },
  {
    id: 'protocolos',
    illustrationBg: 'bg-gradient-to-br from-purple-50 to-indigo-100/40',
    topBorderGradient: 'from-indigo-400 to-[#512B81]',
    accentColor: '#4f46e5',
    tag: '03 — Protocolos',
    title: () => 'Protocolos oficiais interativos',
    subtitle: 'Acesse uma biblioteca de protocolos baseados em evidências (SBC, AHA, ILAS, SEPSIS-3 e mais). Filtrados por urgência do Manchester, especialidade e público-alvo.',
    illustration: () => <IllustrationProtocolos />,
  },
  {
    id: 'soap',
    illustrationBg: 'bg-gradient-to-br from-blue-50 to-purple-50/30',
    topBorderGradient: 'from-blue-400 to-[#512B81]',
    accentColor: '#3b82f6',
    tag: '04 — Documentação',
    title: () => 'SOAP completo em 1 clique',
    subtitle: 'Ao encerrar o atendimento, gere a nota SOAP estruturada com IA. Copie direto para o prontuário eletrônico — sem reescrever nada, sem burocracia.',
    illustration: () => <IllustrationSoap />,
  },
  {
    id: 'plantoes',
    illustrationBg: 'bg-gradient-to-br from-emerald-50 to-green-100/40',
    topBorderGradient: 'from-emerald-400 to-green-500',
    accentColor: '#059669',
    tag: '05 — Financeiro',
    title: () => 'Controle financeiro dos plantões',
    subtitle: 'Registre cada plantão, acompanhe recebimentos e visualize o histórico financeiro completo. Nunca mais perca o controle do quanto você está ganhando.',
    illustration: () => <IllustrationPlantoes />,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Main Modal
// ─────────────────────────────────────────────────────────────────────────────

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  userName: string;
}

const TUTORIAL_KEY = 'mc_tutorial_seen_v1';

export function useTutorialSeen(userId?: string) {
  const key = userId ? `${TUTORIAL_KEY}_${userId}` : TUTORIAL_KEY;
  return {
    hasSeen: () => localStorage.getItem(key) === '1',
    markSeen: () => localStorage.setItem(key, '1'),
  };
}

export default function TutorialModal({ isOpen, onClose, onComplete, userName }: TutorialModalProps) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const total = SLIDES.length;
  const isLast = current === total - 1;
  const slide = SLIDES[current];
  const displayName = userName || 'Médico';

  useEffect(() => {
    if (isOpen) setCurrent(0);
  }, [isOpen]);

  const go = useCallback(
    (delta: number) => {
      setDirection(delta);
      setCurrent((c) => Math.min(Math.max(c + delta, 0), total - 1));
    },
    [total],
  );

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, go, onClose]);

  const slideVariants = {
    enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 32 : -32 }),
    center: { opacity: 1, x: 0 },
    exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -32 : 32 }),
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="tutorial-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6"
          style={{ backdropFilter: 'blur(20px)', backgroundColor: 'rgba(255,255,255,0.60)' }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', stiffness: 240, damping: 24 }}
            className="relative w-full max-w-sm sm:max-w-md bg-white rounded-[28px] sm:rounded-[32px] overflow-hidden border border-slate-200 shadow-2xl shadow-slate-300/50 flex flex-col"
            style={{ maxHeight: '95dvh' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Colored top border strip per slide */}
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id + '-border'}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`h-1 w-full bg-gradient-to-r ${slide.topBorderGradient} flex-shrink-0`}
              />
            </AnimatePresence>

            {/* Illustration area */}
            <div className={`h-52 sm:h-60 relative flex-shrink-0 ${slide.illustrationBg} transition-all duration-500`}>
              {/* Top bar overlaid on illustration */}
              <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-5 pt-3 sm:pt-4">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={slide.tag}
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    className="text-[9px] sm:text-[10px] font-black tracking-[0.2em] uppercase"
                    style={{ color: slide.accentColor }}
                  >
                    {slide.tag ?? 'Medical Copilot'}
                  </motion.span>
                </AnimatePresence>
                <button
                  onClick={onClose}
                  className="flex items-center gap-1 text-slate-300 hover:text-slate-500 text-[10px] font-bold transition-colors px-2 py-1 rounded-full hover:bg-slate-100/60"
                >
                  Pular <X className="w-3 h-3" />
                </button>
              </div>

              {/* Illustration content */}
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={slide.id + '-ill'}
                  className="absolute inset-0"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                >
                  {slide.illustration(displayName)}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Divider */}
            <div className="h-px bg-slate-100 flex-shrink-0" />

            {/* Content area — white */}
            <div className="px-5 sm:px-7 pt-4 sm:pt-5 pb-5 sm:pb-6 flex flex-col flex-shrink-0 bg-white">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={slide.id + '-content'}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                >
                  <h2 className="text-[#1B1B1B] font-black text-xl sm:text-2xl leading-tight mb-2 sm:mb-3">
                    {slide.title(displayName)}
                  </h2>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {slide.subtitle}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Progress dots */}
              <div className="flex items-center justify-center gap-1.5 mt-4 sm:mt-5 mb-3 sm:mb-4">
                {SLIDES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width: i === current ? 20 : 6,
                      height: 6,
                      backgroundColor: i === current ? '#512B81' : '#e2e8f0',
                    }}
                  />
                ))}
              </div>

              {/* Nav buttons */}
              <div className="flex gap-2.5">
                {current > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => go(-1)}
                    className="flex-shrink-0 h-11 w-11 p-0 rounded-2xl border-slate-200 bg-white hover:bg-slate-50 text-slate-400 hover:text-slate-600"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                )}
                {isLast ? (
                  <ShimmerButton
                    onClick={onComplete}
                    background="#512B81"
                    className="flex-1 h-11 text-[12px] sm:text-[13px] uppercase tracking-widest shadow-lg shadow-purple-200/60"
                  >
                    <Sparkles className="mr-2 w-4 h-4" />
                    Começar agora
                  </ShimmerButton>
                ) : (
                  <Button
                    onClick={() => go(1)}
                    className="flex-1 h-11 bg-[#1B1B1B] hover:bg-[#2d2d2d] text-white rounded-2xl font-black text-[12px] sm:text-[13px] transition-all"
                  >
                    Próximo
                    <ArrowRight className="ml-1.5 w-4 h-4" />
                  </Button>
                )}
              </div>

              {/* Keyboard hint — hidden on mobile */}
              <p className="hidden sm:block text-center text-[9px] text-slate-300 font-medium mt-3">
                ← → para navegar · Esc para fechar
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
