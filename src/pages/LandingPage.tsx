import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  Mic, FileText, Shield, ArrowRight, Menu, X,
  Brain, Stethoscope, CheckCircle2, Zap, Activity,
  Clock, Lock, ChevronRight,
} from "lucide-react";

/* ─── tokens ──────────────────────────────────────────────────────── */
const P  = "#512B81";
const P2 = "#9A64B5";
const BG = "#FAFAF8";

/* ─── stagger helpers ─────────────────────────────────────────────── */
const up = (delay = 0) => ({
  initial:    { opacity: 0, y: 20 },
  animate:    { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
});
const reveal = (delay = 0) => ({
  initial:     { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport:    { once: true, margin: "-80px" },
  transition:  { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
});

/* ─── floating hero panels ────────────────────────────────────────── */
function TranscriptPanel({ tick }: { tick: number }) {
  const lines = [
    "Paciente masculino, 68 anos...",
    "Dor torácica intensa há 2h.",
    "Dispneia + sudorese fria.",
    "PA 88/60 · FC 118 · SpO₂ 88%",
  ];
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: "#0f0a1e",
        border: "1px solid rgba(154,100,181,0.2)",
        boxShadow: "0 24px 60px rgba(81,43,129,0.35)",
      }}
    >
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/[0.06]" style={{ background: "rgba(255,255,255,0.03)" }}>
        <div className="w-2 h-2 rounded-full bg-[#ff5f57]" />
        <div className="w-2 h-2 rounded-full bg-[#febc2e]" />
        <div className="w-2 h-2 rounded-full bg-[#28c840]" />
        <span className="ml-2 text-[9px] text-white/20 font-mono">Transcrição ao vivo</span>
        <span className="ml-auto flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[8px] text-red-400 font-bold">REC</span>
        </span>
      </div>
      <div className="p-4 space-y-2.5">
        {lines.map((l, i) => (
          <motion.div
            key={i}
            animate={{ opacity: tick > i ? 1 : 0.12 }}
            transition={{ duration: 0.4 }}
            className="flex items-start gap-2"
          >
            <div className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ background: tick > i ? P2 : "rgba(255,255,255,0.15)" }} />
            <p className="text-[10px] text-white/65 font-mono leading-relaxed">{l}</p>
          </motion.div>
        ))}
        <div className="flex gap-1 pt-1">
          {[0, 1, 2].map(i => (
            <motion.div key={i} animate={{ y: [0, -3, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
              className="w-1 h-1 rounded-full" style={{ background: P2 }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ProtocolPanel({ tick }: { tick: number }) {
  const hypo = [
    { l: "TEP Alto Risco",  p: 84, c: "#ef4444" },
    { l: "SCA — IAMSSST",  p: 57, c: "#f97316" },
    { l: "Dissecção Aorta", p: 29, c: "#eab308" },
  ];
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: "#0f0a1e",
        border: "1px solid rgba(154,100,181,0.2)",
        boxShadow: "0 32px 80px rgba(81,43,129,0.4)",
      }}
    >
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/[0.06]" style={{ background: "rgba(255,255,255,0.03)" }}>
        <div className="w-2 h-2 rounded-full bg-[#ff5f57]" />
        <div className="w-2 h-2 rounded-full bg-[#febc2e]" />
        <div className="w-2 h-2 rounded-full bg-[#28c840]" />
        <span className="ml-2 text-[9px] text-white/20 font-mono">Hipóteses · IA Core</span>
      </div>
      <div className="p-4">
        <div className="space-y-3.5 mb-4">
          {hypo.map((h, i) => (
            <motion.div key={i} animate={{ opacity: tick >= 1 ? 1 : 0.06 }} transition={{ delay: i * 0.1 }}>
              <div className="flex justify-between mb-1.5">
                <span className="text-[10px] text-white/55">{h.l}</span>
                <span className="text-[10px] font-mono font-bold" style={{ color: h.c }}>{h.p}%</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: tick >= 1 ? `${h.p}%` : "0%" }}
                  transition={{ duration: 0.9, delay: 0.2 + i * 0.15 }}
                  className="h-full rounded-full" style={{ background: h.c }}
                />
              </div>
            </motion.div>
          ))}
        </div>
        <motion.div
          animate={{ opacity: tick >= 2 ? 1 : 0 }}
          className="p-3 rounded-lg"
          style={{ background: "rgba(81,43,129,0.25)", border: "1px solid rgba(154,100,181,0.25)" }}
        >
          <div className="flex items-center gap-1.5 mb-1">
            <Zap className="h-3 w-3" style={{ color: "#c084fc" }} />
            <p className="text-[9px] font-black uppercase tracking-widest" style={{ color: "#c084fc" }}>Protocolo urgente</p>
          </div>
          <p className="text-[9px] text-white/50 font-mono">HBPM + AngioTC tórax imediato</p>
        </motion.div>
      </div>
    </div>
  );
}

function SoapPanel({ tick }: { tick: number }) {
  const rows = [
    { tag: "S", v: "Dor torácica 2h, dispneia" },
    { tag: "O", v: "PA 88/60 · SpO₂ 88% · Wells 7" },
    { tag: "A", v: "TEP alto risco" },
    { tag: "P", v: "HBPM + AngioTC urgência" },
  ];
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: "#0f0a1e",
        border: "1px solid rgba(154,100,181,0.2)",
        boxShadow: "0 20px 50px rgba(81,43,129,0.3)",
      }}
    >
      <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-white/[0.06]" style={{ background: "rgba(255,255,255,0.03)" }}>
        <div className="w-2 h-2 rounded-full bg-[#ff5f57]" />
        <div className="w-2 h-2 rounded-full bg-[#febc2e]" />
        <div className="w-2 h-2 rounded-full bg-[#28c840]" />
        <span className="ml-2 text-[9px] text-white/20 font-mono">SOAP gerado</span>
        <motion.span
          animate={{ opacity: tick >= 3 ? 1 : 0 }}
          className="ml-auto text-[8px] font-bold text-emerald-400"
        >✓ pronto</motion.span>
      </div>
      <div className="p-4 space-y-2.5">
        {rows.map((r, i) => (
          <motion.div
            key={i}
            animate={{ opacity: tick >= 3 ? 1 : 0.08 }}
            transition={{ delay: i * 0.08 }}
            className="flex items-start gap-2.5"
          >
            <span className="text-[9px] font-black w-4 h-4 rounded flex items-center justify-center text-white shrink-0" style={{ background: P }}>
              {r.tag}
            </span>
            <p className="text-[10px] text-white/55 font-mono leading-relaxed">{r.v}</p>
          </motion.div>
        ))}
        <motion.button
          animate={{ opacity: tick >= 3 ? 1 : 0 }}
          className="mt-2 w-full h-7 rounded-lg text-[9px] font-bold text-emerald-300 flex items-center justify-center gap-1.5"
          style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)" }}
        >
          Copiar evolução <ArrowRight className="h-2.5 w-2.5" />
        </motion.button>
      </div>
    </div>
  );
}

/* ─── logos ───────────────────────────────────────────────────────── */
const LOGOS = [
  "Hospital das Clínicas", "Albert Einstein", "Sírio-Libanês",
  "Rede D'Or", "Mater Dei", "HCor", "Prevent Senior", "Santa Casa",
];

/* ─── testimonials ────────────────────────────────────────────────── */
const TESTIMONIALS = [
  {
    quote: "Reduzi meu tempo de evolução de 12 minutos para menos de 2. É absurdo como isso mudou meu plantão inteiro.",
    name: "Dra. Mariana Fonseca", role: "Clínica Médica · Hospital das Clínicas · SP", initials: "MF",
  },
  {
    quote: "A sugestão de TEP chegou antes de eu terminar de digitar os dados do paciente. Nunca vi nada assim.",
    name: "Dr. Rafael Torres", role: "Emergencista · Rede D'Or · RJ", initials: "RT",
  },
  {
    quote: "Em UTI a margem de erro é zero. A IA cita a diretriz antes de sugerir conduta. Isso mudou tudo.",
    name: "Dra. Camila Meireles", role: "Intensivista · Albert Einstein · SP", initials: "CM",
  },
];

/* ─── plans ───────────────────────────────────────────────────────── */
const PLANS = [
  {
    label: "Avulso", price: "R$ 99", sub: "por plantão", shifts: 1,
    features: ["13h de acesso contínuo", "SOAP ilimitado", "Protocolos clínicos", "Suporte via chat"],
    cta: "Começar", featured: false,
  },
  {
    label: "5 plantões", price: "R$ 445", sub: "R$ 89 por plantão", shifts: 5,
    badge: "Mais escolhido",
    features: ["Tudo do avulso", "Créditos sem validade", "Histórico de evoluções", "Suporte prioritário"],
    cta: "Escolher", featured: true,
  },
  {
    label: "10 plantões", price: "R$ 792", sub: "R$ 79 por plantão", shifts: 10,
    features: ["Tudo do pacote 5", "Dashboard financeiro", "Multi-dispositivos", "Onboarding dedicado"],
    cta: "Escolher", featured: false,
  },
];

/* ─── page ────────────────────────────────────────────────────────── */
export default function LandingPage() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [tick, setTick] = useState(0);

  const { scrollY } = useScroll();
  const panelY = useTransform(scrollY, [0, 600], [0, 80]);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setTick(s => s + 1), 2200);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: BG, color: "#0F0F0F", fontFamily: "'Manrope','Inter',system-ui,sans-serif" }}>

      {/* ── NAV ──────────────────────────────────────────────────────── */}
      <header
        className="fixed inset-x-0 top-0 z-50 transition-all duration-300"
        style={scrolled ? {
          background: "rgba(250,250,248,0.9)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(81,43,129,0.1)",
          boxShadow: "0 1px 16px rgba(81,43,129,0.06)",
        } : {}}
      >
        <div className="max-w-6xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl flex items-center justify-center" style={{ background: P }}>
              <Stethoscope className="h-4 w-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-[15px] font-bold">Medical<span style={{ color: P }}>Copilot</span></span>
          </a>

          <nav className="hidden md:flex items-center gap-8">
            {["Como funciona", "Recursos", "Preços"].map((l, i) => (
              <button key={l}
                onClick={() => document.getElementById(["como", "recursos", "precos"][i])?.scrollIntoView({ behavior: "smooth" })}
                className="text-[13px] font-medium text-[#666] hover:text-[#111] transition-colors"
              >{l}</button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/login")} className="hidden sm:block text-[13px] font-medium text-[#666] hover:text-[#111] transition-colors">
              Entrar
            </button>
            <button
              onClick={() => navigate("/register")}
              className="btn-primary-shimmer h-9 px-5 rounded-xl text-[13px] font-semibold text-white"
              style={{ background: P, boxShadow: "0 2px 12px rgba(81,43,129,0.3)" }}
            >
              Começar grátis
            </button>
            <button className="md:hidden h-9 w-9 flex items-center justify-center rounded-lg text-[#555] hover:bg-[#F3EEFF] transition-colors" onClick={() => setMenuOpen(o => !o)}>
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-[#FAFAF8] border-t border-[rgba(81,43,129,0.08)]"
            >
              <div className="px-6 py-6 flex flex-col gap-5">
                {["Como funciona", "Recursos", "Preços"].map((l, i) => (
                  <button key={l} onClick={() => { document.getElementById(["como","recursos","precos"][i])?.scrollIntoView({ behavior: "smooth" }); setMenuOpen(false); }}
                    className="text-left text-[15px] font-medium text-[#555]">{l}</button>
                ))}
                <div className="pt-3 border-t border-[rgba(81,43,129,0.08)] flex flex-col gap-3">
                  <button onClick={() => navigate("/login")} className="text-left text-[15px] font-medium text-[#555]">Entrar</button>
                  <button onClick={() => navigate("/register")} className="h-12 rounded-xl text-[14px] font-semibold text-white" style={{ background: P }}>Começar grátis</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-0 px-6 overflow-hidden" style={{ background: BG }}>

        {/* atmospheric glow */}
        <div className="absolute inset-x-0 top-0 h-[500px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse 70% 55% at 50% 0%, rgba(81,43,129,0.10), transparent 70%)" }} />

        <div className="max-w-5xl mx-auto">
          {/* eyebrow */}
          <motion.div {...up(0)} className="flex justify-center mb-8">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[12px] font-semibold"
              style={{ background: "#EEE6FF", color: P, border: "1px solid rgba(81,43,129,0.15)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              IA clínica · feita para plantonistas
            </span>
          </motion.div>

          {/* headline — massive */}
          <motion.h1 {...up(0.06)} className="text-center font-bold tracking-[-0.04em] leading-[1.04] mb-7"
            style={{ fontSize: "clamp(52px, 8.5vw, 100px)" }}>
            Menos prontuário.
            <br />
            <span className="bg-clip-text text-transparent"
              style={{ backgroundImage: `linear-gradient(135deg, ${P} 0%, ${P2} 55%, #C084FC 100%)` }}>
              Mais medicina.
            </span>
          </motion.h1>

          {/* sub */}
          <motion.p {...up(0.13)} className="text-center text-[#5A5A5A] leading-relaxed max-w-xl mx-auto mb-10"
            style={{ fontSize: "clamp(16px, 2vw, 20px)" }}>
            Enquanto você atende, a IA documenta, analisa e sugere hipóteses baseadas em evidências.
            SOAP completo em 90 segundos.
          </motion.p>

          {/* CTAs */}
          <motion.div {...up(0.2)} className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-7">
            <button onClick={() => navigate("/register")}
              className="btn-primary-shimmer w-full sm:w-auto px-8 py-4 rounded-2xl text-[15px] font-semibold text-white flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
              style={{ background: P, boxShadow: "0 6px 28px rgba(81,43,129,0.38)" }}>
              Criar conta gratuita <ArrowRight className="h-4 w-4" />
            </button>
            <button onClick={() => document.getElementById("como")?.scrollIntoView({ behavior: "smooth" })}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl text-[15px] font-medium text-[#444] flex items-center justify-center gap-2 hover:bg-white transition-colors"
              style={{ border: "1.5px solid rgba(81,43,129,0.16)", background: "rgba(255,255,255,0.6)" }}>
              Como funciona <ChevronRight className="h-4 w-4" />
            </button>
          </motion.div>

          {/* trust */}
          <motion.div {...up(0.27)} className="flex flex-wrap justify-center gap-5 mb-20">
            {["Sem cartão de crédito", "Acesso em 30 segundos", "LGPD compliant"].map(t => (
              <span key={t} className="flex items-center gap-1.5 text-[12px] font-medium text-[#888]">
                <CheckCircle2 className="h-3.5 w-3.5" style={{ color: P }} />{t}
              </span>
            ))}
          </motion.div>
        </div>

        {/* ── floating panels ── */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, ease: [0.21, 1.11, 0.81, 0.99] }}
          style={{ y: panelY }}
          className="relative max-w-4xl mx-auto"
        >
          {/* glow behind panels */}
          <div className="absolute -inset-10 pointer-events-none"
            style={{ background: "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(81,43,129,0.12), transparent 70%)", filter: "blur(20px)" }} />

          {/* panel layout */}
          <div className="relative flex items-start justify-center gap-4 pb-0" style={{ minHeight: 360 }}>
            {/* left — transcript */}
            <motion.div
              initial={{ opacity: 0, x: -24, rotate: -2 }}
              animate={{ opacity: 1, x: 0, rotate: -2 }}
              transition={{ duration: 0.7, delay: 0.55 }}
              className="hidden sm:block w-[220px] shrink-0 mt-10"
              style={{ filter: "drop-shadow(0 20px 40px rgba(81,43,129,0.25))" }}
            >
              <TranscriptPanel tick={tick} />
            </motion.div>

            {/* center — protocols (front, bigger) */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: 0.5 }}
              className="w-[260px] sm:w-[280px] shrink-0"
              style={{ filter: "drop-shadow(0 32px 64px rgba(81,43,129,0.4))", zIndex: 10 }}
            >
              <ProtocolPanel tick={tick} />
            </motion.div>

            {/* right — SOAP */}
            <motion.div
              initial={{ opacity: 0, x: 24, rotate: 2 }}
              animate={{ opacity: 1, x: 0, rotate: 2 }}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="hidden sm:block w-[210px] shrink-0 mt-14"
              style={{ filter: "drop-shadow(0 20px 40px rgba(81,43,129,0.25))" }}
            >
              <SoapPanel tick={tick} />
            </motion.div>
          </div>

          {/* fade to page */}
          <div className="absolute bottom-0 inset-x-0 h-32 pointer-events-none"
            style={{ background: `linear-gradient(to bottom, transparent, ${BG})` }} />
        </motion.div>
      </section>

      {/* ── LOGO BAR ─────────────────────────────────────────────────── */}
      <section className="py-12 px-6" style={{ borderTop: "1px solid rgba(81,43,129,0.07)", borderBottom: "1px solid rgba(81,43,129,0.07)" }}>
        <p className="text-center text-[10px] font-bold uppercase tracking-[0.28em] text-[#C0B0D0] mb-7">
          Confiado por plantonistas em todo o Brasil
        </p>
        <div className="relative overflow-hidden max-w-5xl mx-auto">
          <div className="absolute inset-y-0 left-0 w-20 z-10" style={{ background: `linear-gradient(to right, ${BG}, transparent)` }} />
          <div className="absolute inset-y-0 right-0 w-20 z-10" style={{ background: `linear-gradient(to left, ${BG}, transparent)` }} />
          <motion.div animate={{ x: ["0%", "-50%"] }} transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
            className="flex items-center gap-16 w-max">
            {[...LOGOS, ...LOGOS].map((l, i) => (
              <span key={i} className="text-[13px] font-bold text-[#CEC0DC] whitespace-nowrap select-none">{l}</span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS — full-bleed alternating ─────────────────────── */}
      <section id="como">

        {/* Step 1 */}
        <div className="flex flex-col md:flex-row">
          <div className="flex-1 flex flex-col justify-center px-10 md:px-16 py-20" style={{ background: P }}>
            <motion.div {...reveal(0)}>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/35 mb-5">01</p>
              <h3 className="font-bold text-white leading-tight mb-4" style={{ fontSize: "clamp(28px, 3.5vw, 42px)", letterSpacing: "-0.03em" }}>
                Inicie o plantão.
              </h3>
              <p className="text-[16px] text-white/55 leading-relaxed max-w-xs">
                Um clique. 13 horas de acesso começam. A IA está pronta para ouvir — sem setup, sem configuração, sem treinamento.
              </p>
            </motion.div>
          </div>
          <div className="flex-1 flex items-center justify-center px-10 md:px-16 py-20" style={{ background: "#F5F2FA" }}>
            <motion.div {...reveal(0.1)} className="w-full max-w-xs">
              <div className="p-6 rounded-2xl bg-white" style={{ border: "1px solid rgba(81,43,129,0.1)", boxShadow: "0 8px 32px rgba(81,43,129,0.1)" }}>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "#EEE6FF" }}>
                    <Clock className="h-6 w-6" style={{ color: P }} />
                  </div>
                  <div>
                    <p className="text-[13px] font-bold text-[#111]">Plantão ativo</p>
                    <p className="text-[11px] text-[#999]">Iniciado às 19:00</p>
                  </div>
                  <div className="ml-auto">
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Ao vivo
                    </span>
                  </div>
                </div>
                <div className="h-2 rounded-full overflow-hidden mb-2" style={{ background: "#EDE9F4" }}>
                  <motion.div className="h-full rounded-full" style={{ background: P }}
                    initial={{ width: "0%" }} whileInView={{ width: "35%" }} viewport={{ once: true }}
                    transition={{ duration: 1.2, ease: "easeOut" }} />
                </div>
                <div className="flex justify-between text-[11px] text-[#999]">
                  <span>4h 30min</span>
                  <span>13h restantes</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex flex-col md:flex-row-reverse">
          <div className="flex-1 flex flex-col justify-center px-10 md:px-16 py-20" style={{ background: "#1a0d2e" }}>
            <motion.div {...reveal(0)}>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/25 mb-5">02</p>
              <h3 className="font-bold text-white leading-tight mb-4" style={{ fontSize: "clamp(28px, 3.5vw, 42px)", letterSpacing: "-0.03em" }}>
                Atenda normalmente.
              </h3>
              <p className="text-[16px] text-white/50 leading-relaxed max-w-xs">
                Fale com o paciente como sempre. A IA transcreve, identifica queixa, sinais vitais e histórico — invisível no background.
              </p>
            </motion.div>
          </div>
          <div className="flex-1 flex items-center justify-center px-10 md:px-16 py-20 bg-white">
            <motion.div {...reveal(0.1)} className="w-full max-w-xs space-y-3">
              {[
                { text: "Paciente masculino, 68 anos...", delay: 0 },
                { text: "Dor torácica intensa há 2h.", delay: 0.2 },
                { text: "SpO₂ 88% em ar ambiente.", delay: 0.4 },
              ].map((l, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }} transition={{ delay: l.delay + 0.2, duration: 0.5 }}
                  className="flex items-start gap-3 p-3.5 rounded-xl"
                  style={{ background: "#F8F5FF", border: "1px solid rgba(81,43,129,0.08)" }}>
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: P }} />
                  <p className="text-[13px] text-[#333] font-mono leading-relaxed">{l.text}</p>
                </motion.div>
              ))}
              <div className="flex gap-1 pl-2 pt-1">
                {[0,1,2].map(i => (
                  <motion.div key={i} animate={{ y: [0,-3,0] }} transition={{ duration: 0.6, repeat: Infinity, delay: i*0.15 }}
                    className="w-1.5 h-1.5 rounded-full" style={{ background: P2 }} />
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex flex-col md:flex-row">
          <div className="flex-1 flex flex-col justify-center px-10 md:px-16 py-20" style={{ background: "#059669" }}>
            <motion.div {...reveal(0)}>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/35 mb-5">03</p>
              <h3 className="font-bold text-white leading-tight mb-4" style={{ fontSize: "clamp(28px, 3.5vw, 42px)", letterSpacing: "-0.03em" }}>
                SOAP em 90 segundos.
              </h3>
              <p className="text-[16px] text-white/55 leading-relaxed max-w-xs">
                Evolução estruturada, CID correto, conduta sugerida. Pronto para copiar direto no prontuário — antes do próximo caso.
              </p>
            </motion.div>
          </div>
          <div className="flex-1 flex items-center justify-center px-10 md:px-16 py-20" style={{ background: "#F0FDF4" }}>
            <motion.div {...reveal(0.1)} className="w-full max-w-xs">
              <div className="p-6 rounded-2xl bg-white" style={{ border: "1px solid rgba(5,150,105,0.15)", boxShadow: "0 8px 32px rgba(5,150,105,0.1)" }}>
                {[
                  { tag: "S", v: "Dor torácica 2h, dispneia, hipotensão" },
                  { tag: "O", v: "PA 88/60 · FC 118 · SpO₂ 88% · Wells 7" },
                  { tag: "A", v: "TEP alto risco" },
                  { tag: "P", v: "HBPM + AngioTC tórax urgência" },
                ].map((r, i) => (
                  <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                    transition={{ delay: 0.1 + i * 0.1 }} className="flex items-start gap-3 mb-3">
                    <span className="text-[10px] font-black w-5 h-5 rounded flex items-center justify-center text-white shrink-0"
                      style={{ background: "#059669" }}>{r.tag}</span>
                    <p className="text-[12px] text-[#333] leading-relaxed">{r.v}</p>
                  </motion.div>
                ))}
                <button className="mt-4 w-full h-9 rounded-xl text-[12px] font-bold text-white flex items-center justify-center gap-2"
                  style={{ background: "#059669" }}>
                  Copiar evolução <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── RECURSOS — full-bleed alternating ─────────────────────────── */}
      <section id="recursos">

        {/* Feature 1 — Transcription */}
        <div className="flex flex-col md:flex-row-reverse" style={{ borderTop: "1px solid rgba(81,43,129,0.07)" }}>
          <div className="flex-1 flex flex-col justify-center px-10 md:px-16 py-20 bg-white">
            <motion.div {...reveal(0)}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6" style={{ background: "#EEE6FF" }}>
                <Mic className="h-5 w-5" style={{ color: P }} />
              </div>
              <h3 className="font-bold text-[#111] leading-tight mb-4" style={{ fontSize: "clamp(26px, 3vw, 38px)", letterSpacing: "-0.03em" }}>
                Transcrição clínica ao vivo
              </h3>
              <p className="text-[16px] text-[#666] leading-relaxed mb-6 max-w-sm">
                A IA identifica queixa principal, história clínica, sinais vitais e alergias enquanto você fala — sem template, sem ditado.
              </p>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold"
                style={{ background: "#EEE6FF", color: P }}>
                <Zap className="h-3.5 w-3.5" /> Latência &lt; 200ms
              </span>
            </motion.div>
          </div>
          <div className="flex-1 flex items-center justify-center px-10 md:px-16 py-20" style={{ background: "#F8F5FF" }}>
            <motion.div {...reveal(0.1)} className="w-full max-w-sm space-y-2.5">
              {["Queixa principal: dor torácica intensa há 2 horas", "Antecedentes: HAS, DM tipo 2, tabagismo 20 anos", "Medicamentos em uso: losartana 50mg, metformina 500mg", "PA: 88/60 mmHg · FC: 118 bpm · SpO₂: 88%"].map((l, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                  className="flex items-start gap-2.5 p-3 rounded-xl" style={{ background: "white", border: "1px solid rgba(81,43,129,0.08)" }}>
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: P }} />
                  <p className="text-[12px] text-[#333] font-mono leading-relaxed">{l}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Feature 2 — Protocols */}
        <div className="flex flex-col md:flex-row" style={{ borderTop: "1px solid rgba(81,43,129,0.07)" }}>
          <div className="flex-1 flex flex-col justify-center px-10 md:px-16 py-20 bg-white">
            <motion.div {...reveal(0)}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6" style={{ background: "#EEE6FF" }}>
                <Brain className="h-5 w-5" style={{ color: P }} />
              </div>
              <h3 className="font-bold text-[#111] leading-tight mb-4" style={{ fontSize: "clamp(26px, 3vw, 38px)", letterSpacing: "-0.03em" }}>
                Hipóteses baseadas em evidências
              </h3>
              <p className="text-[16px] text-[#666] leading-relaxed mb-6 max-w-sm">
                SBC, UpToDate, DynaMed. Wells Score, HEART Score, TIMI — calculados e ranqueados por probabilidade em milissegundos.
              </p>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold"
                style={{ background: "#EEE6FF", color: P }}>
                <Activity className="h-3.5 w-3.5" /> 80+ calculadoras clínicas
              </span>
            </motion.div>
          </div>
          <div className="flex-1 flex items-center justify-center px-10 md:px-16 py-20" style={{ background: "#F8F5FF" }}>
            <motion.div {...reveal(0.1)} className="w-full max-w-sm space-y-4">
              {[
                { l: "TEP de Alto Risco", p: 84, c: "#ef4444" },
                { l: "SCA — IAMSSST",    p: 57, c: "#f97316" },
                { l: "Dissecção de Aorta",p: 29, c: "#eab308" },
              ].map((h, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-2">
                    <span className="text-[13px] font-medium text-[#333]">{h.l}</span>
                    <span className="text-[13px] font-bold font-mono" style={{ color: h.c }}>{h.p}%</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: "#EDE9F4" }}>
                    <motion.div initial={{ width: 0 }} whileInView={{ width: `${h.p}%` }} viewport={{ once: true }}
                      transition={{ duration: 0.9, delay: 0.2 + i * 0.15 }}
                      className="h-full rounded-full" style={{ background: h.c }} />
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Feature 3 — Security (dark) */}
        <div className="flex flex-col md:flex-row-reverse" style={{ borderTop: "1px solid rgba(81,43,129,0.07)" }}>
          <div className="flex-1 flex flex-col justify-center px-10 md:px-16 py-20" style={{ background: "#0D0A18" }}>
            <motion.div {...reveal(0)}>
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6" style={{ background: "rgba(81,43,129,0.3)" }}>
                <Lock className="h-5 w-5" style={{ color: "#c084fc" }} />
              </div>
              <h3 className="font-bold text-white leading-tight mb-4" style={{ fontSize: "clamp(26px, 3vw, 38px)", letterSpacing: "-0.03em" }}>
                LGPD & HIPAA por padrão.
              </h3>
              <p className="text-[16px] text-white/45 leading-relaxed mb-8 max-w-sm">
                Criptografia AES-256 ponta a ponta. Nenhum dado identificável retido após a sessão. Compliance total, zero configuração.
              </p>
              <div className="flex flex-wrap gap-2">
                {["AES-256", "LGPD", "HIPAA", "99,9% uptime", "Zero data retention"].map(tag => (
                  <span key={tag} className="px-3 py-1.5 rounded-full text-[11px] font-semibold text-white/60"
                    style={{ background: "rgba(154,100,181,0.15)", border: "1px solid rgba(154,100,181,0.2)" }}>{tag}</span>
                ))}
              </div>
            </motion.div>
          </div>
          <div className="flex-1 flex items-center justify-center px-10 md:px-16 py-20" style={{ background: "#100B20" }}>
            <motion.div {...reveal(0.1)} className="w-full max-w-xs space-y-4">
              {[
                { icon: Shield, title: "Dados criptografados", desc: "AES-256 em trânsito e em repouso" },
                { icon: Lock,   title: "Sem retenção de dados", desc: "Zero dados identificáveis após sessão" },
                { icon: CheckCircle2, title: "Certificado LGPD", desc: "Conformidade total sem configuração" },
              ].map(({ icon: Icon, title, desc }, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                  className="flex items-center gap-3 p-4 rounded-xl"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(154,100,181,0.12)" }}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "rgba(81,43,129,0.3)" }}>
                    <Icon className="h-4 w-4" style={{ color: "#c084fc" }} />
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold text-white/80">{title}</p>
                    <p className="text-[11px] text-white/35">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── METRICS STRIP ────────────────────────────────────────────── */}
      <section style={{ background: P }} className="py-20 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-px" style={{ background: "rgba(255,255,255,0.1)" }}>
          {[
            { v: "90s",    l: "Para gerar SOAP",       s: "antes eram 12 minutos" },
            { v: "<200ms", l: "Latência de análise",   s: "em tempo real" },
            { v: "80+",    l: "Calculadoras clínicas", s: "SBC, UpToDate, DynaMed" },
            { v: "13h",    l: "Acesso por plantão",    s: "sem limite de casos" },
          ].map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="text-center py-12 px-4" style={{ background: P }}>
              <p className="font-bold text-white mb-1 tracking-tight" style={{ fontSize: "clamp(32px, 4vw, 48px)" }}>{m.v}</p>
              <p className="text-[13px] font-semibold text-white/60 mb-0.5">{m.l}</p>
              <p className="text-[11px] text-white/28">{m.s}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────── */}
      <section className="py-32 px-6" style={{ background: BG }}>
        <div className="max-w-5xl mx-auto">
          <motion.div {...reveal()} className="mb-16">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] mb-4" style={{ color: P }}>Depoimentos</p>
            <h2 className="font-bold text-[#111] tracking-[-0.03em]" style={{ fontSize: "clamp(36px, 5vw, 60px)" }}>
              Médicos reais.<br /><span className="text-[#AAA]">Resultados reais.</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={i} {...reveal(i * 0.1)}
                className="flex flex-col gap-5 p-8 rounded-2xl bg-white"
                style={{ border: "1px solid rgba(81,43,129,0.08)", boxShadow: "0 2px 16px rgba(81,43,129,0.06)" }}>
                <div className="flex gap-0.5">
                  {Array(5).fill(0).map((_, j) => (
                    <svg key={j} className="h-4 w-4" viewBox="0 0 20 20" fill="#FBBF24">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-[11px] font-black uppercase tracking-widest" style={{ color: "#DDD6FE" }}>"</p>
                <p className="text-[15px] text-[#333] leading-relaxed flex-1">"{t.quote}"</p>
                <div className="flex items-center gap-3 pt-5" style={{ borderTop: "1px solid rgba(81,43,129,0.07)" }}>
                  <div className="h-9 w-9 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                    style={{ background: `linear-gradient(135deg, ${P}, ${P2})` }}>{t.initials}</div>
                  <div>
                    <p className="text-[13px] font-semibold text-[#111]">{t.name}</p>
                    <p className="text-[11px] text-[#999]">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────────────────── */}
      <section id="precos" className="py-32 px-6 bg-white" style={{ borderTop: "1px solid rgba(81,43,129,0.07)" }}>
        <div className="max-w-4xl mx-auto">
          <motion.div {...reveal()} className="text-center mb-16">
            <p className="text-[11px] font-bold uppercase tracking-[0.24em] mb-4" style={{ color: P }}>Preços</p>
            <h2 className="font-bold text-[#111] tracking-[-0.03em] mb-4" style={{ fontSize: "clamp(36px, 5vw, 60px)" }}>
              Pague pelo que usa.
            </h2>
            <p className="text-[17px] text-[#666] max-w-xs mx-auto leading-relaxed">
              Sem assinatura. Créditos sem validade. Simples assim.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
            {PLANS.map((plan, i) => (
              <motion.div key={i} {...reveal(i * 0.1)}
                className="relative flex flex-col rounded-2xl p-7"
                style={plan.featured
                  ? { background: P, boxShadow: "0 20px 60px rgba(81,43,129,0.4)" }
                  : { background: "white", border: "1px solid rgba(81,43,129,0.1)", boxShadow: "0 2px 12px rgba(81,43,129,0.05)" }
                }>
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[11px] font-bold whitespace-nowrap"
                    style={{ background: "white", color: P, boxShadow: "0 2px 8px rgba(81,43,129,0.2)" }}>{plan.badge}</div>
                )}
                <p className="text-[12px] font-semibold mb-2" style={{ color: plan.featured ? "rgba(255,255,255,0.5)" : "#999" }}>{plan.label}</p>
                <p className="text-[38px] font-bold tracking-tight mb-1" style={{ color: plan.featured ? "white" : "#111" }}>{plan.price}</p>
                <p className="text-[12px] mb-7" style={{ color: plan.featured ? "rgba(255,255,255,0.4)" : "#AAA" }}>{plan.sub}</p>
                <ul className="space-y-3 flex-1 mb-7">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-2.5 text-[13px]"
                      style={{ color: plan.featured ? "rgba(255,255,255,0.82)" : "#444" }}>
                      <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: plan.featured ? "rgba(255,255,255,0.5)" : P2 }} />{f}
                    </li>
                  ))}
                </ul>
                <button onClick={() => navigate(`/register?redirect=${encodeURIComponent(`/checkout?shifts=${plan.shifts}`)}`)}
                  className="btn-primary-shimmer w-full h-11 rounded-xl text-[14px] font-semibold transition-all active:scale-[0.98]"
                  style={plan.featured
                    ? { background: "white", color: P }
                    : { background: "#F3EEFF", color: P, border: "1px solid rgba(81,43,129,0.15)" }}>
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </div>
          <motion.p {...reveal(0.3)} className="text-center text-[12px] text-[#AAA] mt-8">
            Pagamento via Pix · Acesso liberado imediatamente após confirmação
          </motion.p>
        </div>
      </section>

      {/* ── CTA FINAL ────────────────────────────────────────────────── */}
      <section className="py-32 px-6 relative overflow-hidden"
        style={{ background: `linear-gradient(140deg, ${P} 0%, #3A1A6E 55%, #2D1060 100%)` }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 80% at 50% 100%, rgba(154,100,181,0.28), transparent 70%)" }} />

        <motion.div {...reveal()} className="relative z-10 max-w-2xl mx-auto text-center">
          <h2 className="font-bold text-white leading-[1.06] mb-5 tracking-[-0.04em]"
            style={{ fontSize: "clamp(40px, 6vw, 72px)" }}>
            Seu próximo plantão começa aqui.
          </h2>
          <p className="text-[18px] text-white/50 mb-10 leading-relaxed">
            Junte-se aos médicos que já economizam 2 horas por plantão com o Medical Copilot.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button onClick={() => navigate("/register")}
              className="btn-primary-shimmer w-full sm:w-auto h-14 px-10 rounded-2xl text-[16px] font-semibold bg-white flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
              style={{ color: P, boxShadow: "0 4px 24px rgba(0,0,0,0.2)" }}>
              Criar conta gratuita <ArrowRight className="h-5 w-5" />
            </button>
            <button onClick={() => navigate("/login")}
              className="w-full sm:w-auto h-14 px-10 rounded-2xl text-[16px] font-medium text-white/70 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors"
              style={{ border: "1.5px solid rgba(255,255,255,0.2)" }}>
              Já tenho conta
            </button>
          </div>
        </motion.div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────── */}
      <footer className="py-14 px-6" style={{ background: "#0D0A18" }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-12 mb-12">
            <div className="max-w-xs">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="h-8 w-8 rounded-xl flex items-center justify-center" style={{ background: P }}>
                  <Stethoscope className="h-4 w-4 text-white" strokeWidth={2.5} />
                </div>
                <span className="text-[15px] font-bold text-white">Medical<span style={{ color: P2 }}>Copilot</span></span>
              </div>
              <p className="text-[13px] leading-relaxed text-white/28">
                Inteligência clínica para médicos que valorizam o tempo — e os pacientes.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-10">
              {[
                { title: "Produto", links: ["Como funciona", "Recursos", "Preços", "Changelog"] },
                { title: "Legal",   links: ["Privacidade", "Termos de Uso", "LGPD", "Segurança"] },
                { title: "Empresa", links: ["Sobre nós", "Contato", "Blog", "Status"] },
              ].map(col => (
                <div key={col.title}>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/20 mb-4">{col.title}</p>
                  <ul className="space-y-2.5">
                    {col.links.map(l => (
                      <li key={l}><a href="#" className="text-[13px] text-white/22 hover:text-white/60 transition-colors">{l}</a></li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[12px] text-white/18">© 2026 Medical Copilot. Todos os direitos reservados.</p>
            <div className="flex items-center gap-5 text-[12px] text-white/18">
              <span className="flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />Todos os sistemas operacionais</span>
              <span>LGPD · HIPAA</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
