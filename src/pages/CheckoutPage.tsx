import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2, Clock, Stethoscope, ArrowRight,
  Zap, Shield, Loader2, ChevronLeft, Brain, FileText, Copy, Check, Lock,
} from 'lucide-react';
import { useAppStore } from '@/stores/appStore';

/* ─── types ───────────────────────────────────────────────────────── */
interface Plan {
  id: string;
  name: string;
  shiftsIncluded: number;
  priceInCents: number;
  discountPct: number;
  durationHoursPerShift: number;
  sortOrder: number;
}

interface PixData {
  pixId: string;
  billingId: string;
  brCode: string;
  brCodeBase64: string;
  expiresAt: string;
  amount: number;
}

/* ─── api ─────────────────────────────────────────────────────────── */
const API = import.meta.env.VITE_BACKEND_URL || 'https://api.medicalcopilot.com.br';

async function fetchPlans(): Promise<Plan[]> {
  const res = await fetch(`${API}/api/payments/plans`, { credentials: 'include' });
  if (!res.ok) throw new Error('Falha ao carregar planos');
  const json = await res.json();
  return json.data as Plan[];
}

async function createCardCheckout(shifts: number): Promise<{ checkoutUrl: string }> {
  const res = await fetch(`${API}/api/payments/checkout`, {
    method: 'POST', credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ shifts, method: 'CARD' }),
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.error || 'Falha ao criar checkout');
  return json;
}

async function createPix(shifts: number): Promise<PixData> {
  const res = await fetch(`${API}/api/payments/pix`, {
    method: 'POST', credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ shifts }),
  });
  const json = await res.json();
  if (!res.ok || !json.success) throw new Error(json.error || 'Falha ao gerar PIX');
  return json as PixData;
}


async function checkPixStatus(pixId: string): Promise<{ status: string; paid: boolean }> {
  const res = await fetch(`${API}/api/payments/pix/${pixId}/status`, { credentials: 'include' });
  const json = await res.json();
  if (!res.ok) throw new Error('Falha ao verificar status');
  return json;
}

function fmt(cents: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100);
}

/* ─── constants ───────────────────────────────────────────────────── */
const BADGE: Record<number, { label: string; color: string; bg: string }> = {
  1:  { label: 'Avulso',         color: '#512B81', bg: '#EEE6FF' },
  5:  { label: 'Mais escolhido', color: '#059669', bg: '#ECFDF5' },
  10: { label: 'Maior economia', color: '#0369a1', bg: '#E0F2FE' },
};

const INCLUDED = [
  { icon: Clock,     text: '13h de acesso contínuo por plantão' },
  { icon: Zap,       text: 'Transcrição clínica em tempo real' },
  { icon: Brain,     text: 'Hipóteses diagnósticas baseadas em evidências' },
  { icon: FileText,  text: 'SOAP gerado automaticamente em 90s' },
  { icon: Shield,    text: 'Dados criptografados · LGPD compliant' },
];

/* ─── Card Redirect View ──────────────────────────────────────────── */
function CardRedirectView({ checkoutUrl, amount }: { checkoutUrl: string; amount: number }) {
  const [step, setStep] = useState(0); // 0 = preparing, 1 = redirecting

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 1400);
    const t2 = setTimeout(() => { window.location.href = checkoutUrl; }, 2200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [checkoutUrl]);

  const steps = [
    'Verificando seu pedido…',
    'Conectando ao ambiente seguro…',
    'Redirecionando para o pagamento…',
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-8 text-center"
    >
      {/* icon */}
      <div className="relative mb-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 rounded-full border-2 border-transparent"
          style={{ borderTopColor: '#512B81', borderRightColor: 'rgba(81,43,129,0.2)' }}
        />
        <div
          className="absolute inset-0 m-auto w-10 h-10 rounded-full flex items-center justify-center"
          style={{ background: '#F3EEFF' }}
        >
          <Lock className="h-5 w-5" style={{ color: '#512B81' }} />
        </div>
      </div>

      <h2 className="text-[18px] font-bold text-[#111] mb-1">
        {step === 0 ? 'Preparando pagamento' : 'Redirecionando…'}
      </h2>
      <p className="text-[13px] text-[#888] mb-6">{fmt(amount)} · Cartão de crédito</p>

      {/* step list */}
      <div className="w-full space-y-2.5 text-left">
        {steps.map((label, i) => {
          const done = (step === 0 && i < 1) || (step === 1 && i < 3);
          const active = (step === 0 && i === 1) || (step === 1 && i === 2);
          return (
            <motion.div
              key={label}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.18 }}
              className="flex items-center gap-3"
            >
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all duration-300"
                style={{
                  background: done ? '#512B81' : active ? '#EEE6FF' : '#F5F5F5',
                  border: active ? '2px solid #512B81' : 'none',
                }}
              >
                {done
                  ? <Check className="h-3 w-3 text-white" />
                  : active
                    ? <Loader2 className="h-3 w-3 animate-spin" style={{ color: '#512B81' }} />
                    : null}
              </div>
              <span className={`text-[12px] font-medium ${done ? 'text-[#111]' : active ? 'text-[#512B81]' : 'text-[#CCC]'}`}>
                {label}
              </span>
            </motion.div>
          );
        })}
      </div>

      {/* trust badge */}
      <div
        className="mt-6 w-full rounded-xl px-4 py-3 flex items-center gap-2.5"
        style={{ background: '#F8F5FF', border: '1px solid rgba(81,43,129,0.1)' }}
      >
        <Shield className="h-4 w-4 shrink-0" style={{ color: '#512B81' }} />
        <p className="text-[11px] text-[#666]">
          Você será redirecionado para um ambiente de pagamento <strong>certificado e criptografado</strong>.
        </p>
      </div>

      {/* manual fallback */}
      <p className="mt-4 text-[11px] text-[#AAA] text-center">
        Não foi redirecionado?{' '}
        <a
          href={checkoutUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="underline"
          style={{ color: '#512B81' }}
        >
          Clique aqui
        </a>
      </p>
    </motion.div>
  );
}

/* ─── PIX QR View ─────────────────────────────────────────────────── */
function PixView({ pix, onBack }: { pix: PixData; onBack: () => void }) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [paid, setPaid] = useState(false);
  const [pollErrors, setPollErrors] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(() => {
    const diff = Math.floor((new Date(pix.expiresAt).getTime() - Date.now()) / 1000);
    return Math.max(0, diff);
  });

  // Countdown timer
  useEffect(() => {
    if (secondsLeft <= 0) return;
    const t = setInterval(() => setSecondsLeft(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [secondsLeft]);

  // Poll status every 3s — stop polling after 10 consecutive failures
  useEffect(() => {
    if (paid || pollErrors >= 10) return;
    const poll = async () => {
      try {
        const res = await checkPixStatus(pix.pixId);
        if (res.paid) setPaid(true);
        else setPollErrors(0);
      } catch {
        setPollErrors(n => n + 1);
      }
    };
    poll();
    const t = setInterval(poll, 3000);
    return () => clearInterval(t);
  }, [pix.pixId, paid, pollErrors]);

  // Redirect on confirmed
  useEffect(() => {
    if (paid) {
      const t = setTimeout(() => navigate('/payment-success'), 1800);
      return () => clearTimeout(t);
    }
  }, [paid, navigate]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(pix.brCode).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  }, [pix.brCode]);

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0');
  const ss = String(secondsLeft % 60).padStart(2, '0');
  const expired = secondsLeft <= 0;

  return (
    <AnimatePresence mode="wait">
      {paid ? (
        <motion.div
          key="paid"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-10 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 280, damping: 18 }}
            className="w-20 h-20 rounded-full flex items-center justify-center mb-5"
            style={{ background: '#ECFDF5' }}
          >
            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
          </motion.div>
          <h2 className="text-[22px] font-bold text-[#111] mb-2">Pagamento confirmado!</h2>
          <p className="text-[14px] text-[#888]">Redirecionando para o painel…</p>
        </motion.div>
      ) : (
        <motion.div key="qr" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] mb-0.5" style={{ color: '#512B81' }}>
                Pagamento via Pix
              </p>
              <p className="text-[22px] font-bold text-[#111]">{fmt(pix.amount)}</p>
            </div>
            <button
              onClick={onBack}
              className="text-[12px] font-medium text-[#888] hover:text-[#512B81] transition-colors flex items-center gap-1"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Voltar
            </button>
          </div>

          {/* QR Code */}
          <div
            className="rounded-2xl p-5 flex flex-col items-center mb-4"
            style={{ border: '1px solid rgba(81,43,129,0.12)', background: 'white' }}
          >
            {expired ? (
              <div className="w-48 h-48 flex flex-col items-center justify-center gap-2 text-[#999]">
                <Clock className="h-10 w-10" />
                <p className="text-[13px] font-medium">QR Code expirado</p>
              </div>
            ) : (
              <img
                src={pix.brCodeBase64}
                alt="QR Code PIX"
                className="w-48 h-48 object-contain rounded-lg"
              />
            )}

            {/* Timer */}
            <div className={`mt-3 flex items-center gap-1.5 text-[12px] font-semibold ${expired ? 'text-red-500' : secondsLeft < 120 ? 'text-amber-500' : 'text-[#888]'}`}>
              <Clock className="h-3.5 w-3.5" />
              {expired ? 'Expirado' : `Expira em ${mm}:${ss}`}
            </div>
          </div>

          {/* Copy-paste */}
          <div className="mb-4">
            <p className="text-[11px] font-semibold text-[#888] uppercase tracking-[0.16em] mb-2">Pix copia e cola</p>
            <div
              className="rounded-xl p-3 flex items-center gap-2"
              style={{ background: '#F8F5FF', border: '1px solid rgba(81,43,129,0.1)' }}
            >
              <p className="flex-1 text-[11px] text-[#555] font-mono break-all leading-relaxed line-clamp-2">{pix.brCode}</p>
              <button
                onClick={handleCopy}
                className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-semibold transition-all active:scale-95"
                style={{
                  background: copied ? '#ECFDF5' : '#512B81',
                  color: copied ? '#059669' : 'white',
                }}
              >
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copiado!' : 'Copiar'}
              </button>
            </div>
          </div>

          {/* Status indicator */}
          {pollErrors >= 10 ? (
            <div
              className="rounded-xl p-3 flex items-center gap-2.5"
              style={{ background: '#FFF7ED', border: '1px solid rgba(234,88,12,0.15)' }}
            >
              <p className="text-[12px] text-orange-700 font-medium">
                Não foi possível verificar o pagamento automaticamente. Se já pagou, aguarde alguns minutos e verifique seu acesso na plataforma.
              </p>
            </div>
          ) : (
            <div
              className="rounded-xl p-3 flex items-center gap-2.5"
              style={{ background: '#F0FDF4', border: '1px solid rgba(5,150,105,0.15)' }}
            >
              <Loader2 className="h-4 w-4 animate-spin text-emerald-500 shrink-0" />
              <p className="text-[12px] text-emerald-700 font-medium">
                Aguardando confirmação do pagamento…
              </p>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── page ────────────────────────────────────────────────────────── */
export default function CheckoutPage() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const isAuthenticated = useAppStore(s => s.isAuthenticated);

  const defaultShifts = parseInt(params.get('shifts') || '1', 10);
  const [selected, setSelected] = useState<number>(defaultShifts);
  const [pixData, setPixData] = useState<PixData | null>(null);
  const [cardData, setCardData] = useState<{ checkoutUrl: string; amount: number } | null>(null);

  const { data: plans, isLoading: loadingPlans, error: plansError } = useQuery({
    queryKey: ['plans'],
    queryFn: fetchPlans,
  });

  const cardCheckout = useMutation({
    mutationFn: createCardCheckout,
    onSuccess: ({ checkoutUrl }) => {
      const plan = plans?.find(p => p.shiftsIncluded === selected);
      setCardData({ checkoutUrl, amount: plan?.priceInCents ?? 0 });
    },
  });

  const pixMutation = useMutation({
    mutationFn: createPix,
    onSuccess: (data) => setPixData(data),
  });

  const selectedPlan = plans?.find(p => p.shiftsIncluded === selected);
  const isPending = pixMutation.isPending || cardCheckout.isPending;
  const mutationError = pixMutation.error || cardCheckout.error;

  return (
    <div className="min-h-screen" style={{ background: '#FAFAF8', fontFamily: "'Manrope','Inter',system-ui,sans-serif" }}>

      {/* nav */}
      <div className="border-b border-[rgba(81,43,129,0.08)] bg-white/90 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl flex items-center justify-center" style={{ background: '#512B81' }}>
              <Stethoscope className="h-4 w-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="text-[15px] font-bold">Medical<span style={{ color: '#512B81' }}>Copilot</span></span>
          </button>
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-[13px] font-medium text-[#666] hover:text-[#111] transition-colors">
            <ChevronLeft className="h-4 w-4" /> Voltar
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-10 items-start">

          {/* ── LEFT: plan selection ── */}
          <div className="flex-1 min-w-0">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <p className="text-[11px] font-bold uppercase tracking-[0.24em] mb-2" style={{ color: '#512B81' }}>
                Adquirir plantões
              </p>
              <h1 className="text-[32px] sm:text-[40px] font-bold tracking-[-0.03em] text-[#111] mb-2 leading-tight">
                Escolha seu plano.
              </h1>
              <p className="text-[16px] text-[#666] leading-relaxed mb-8">
                Créditos sem validade. Pague com Pix ou cartão de crédito.
              </p>
            </motion.div>

            {/* plans */}
            {loadingPlans ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-6 w-6 animate-spin" style={{ color: '#512B81' }} />
              </div>
            ) : plansError ? (
              <div className="p-5 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-[14px]">
                Falha ao carregar planos. Tente novamente.
              </div>
            ) : (
              <div className="space-y-3">
                {plans?.map((plan, i) => {
                  const badge = BADGE[plan.shiftsIncluded];
                  const isSelected = selected === plan.shiftsIncluded;
                  const pricePerShift = plan.priceInCents / plan.shiftsIncluded;

                  return (
                    <motion.button
                      key={plan.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07, duration: 0.45 }}
                      onClick={() => setSelected(plan.shiftsIncluded)}
                      className="w-full text-left rounded-2xl p-5 transition-all duration-200"
                      style={{
                        background: isSelected ? '#F3EEFF' : 'white',
                        border: isSelected ? '2px solid #512B81' : '1.5px solid rgba(81,43,129,0.12)',
                        boxShadow: isSelected ? '0 0 0 4px rgba(81,43,129,0.08)' : '0 1px 6px rgba(81,43,129,0.05)',
                      }}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3">
                          <div
                            className="mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all"
                            style={{ borderColor: isSelected ? '#512B81' : '#DDD6FE', background: isSelected ? '#512B81' : 'white' }}
                          >
                            {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[16px] font-bold text-[#111]">
                                {plan.shiftsIncluded === 1 ? '1 plantão' : `${plan.shiftsIncluded} plantões`}
                              </span>
                              {badge && (
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold" style={{ background: badge.bg, color: badge.color }}>
                                  {badge.label}
                                </span>
                              )}
                              {plan.discountPct > 0 && (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600">
                                  −{plan.discountPct}%
                                </span>
                              )}
                            </div>
                            <p className="text-[12px] text-[#999] mt-0.5">
                              {plan.durationHoursPerShift}h de acesso por plantão
                              {plan.shiftsIncluded > 1 && ` · ${fmt(pricePerShift)} por plantão`}
                            </p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-[22px] font-bold text-[#111]">{fmt(plan.priceInCents)}</p>
                          {plan.shiftsIncluded > 1 && <p className="text-[11px] text-[#999]">{fmt(pricePerShift)}/plantão</p>}
                        </div>
                      </div>

                      <AnimatePresence>
                        {isSelected && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-4 pt-4 border-t border-[rgba(81,43,129,0.1)] grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {INCLUDED.map(({ icon: Icon, text }) => (
                                <div key={text} className="flex items-center gap-2 text-[12px] text-[#555]">
                                  <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: '#512B81' }} />
                                  {text}
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── RIGHT: order summary + CTA ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="w-full lg:w-[360px] shrink-0"
          >
            <div
              className="rounded-2xl overflow-hidden sticky top-8"
              style={{ border: '1px solid rgba(81,43,129,0.12)', boxShadow: '0 8px 40px rgba(81,43,129,0.1)' }}
            >
              {/* header */}
              <div className="px-6 py-5" style={{ background: '#512B81' }}>
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/50 mb-2">Resumo do pedido</p>
                <AnimatePresence mode="wait">
                  {selectedPlan ? (
                    <motion.div key={selectedPlan.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                      <p className="text-[28px] font-bold text-white tracking-tight">{fmt(selectedPlan.priceInCents)}</p>
                      <p className="text-[13px] text-white/55 mt-0.5">
                        {selectedPlan.shiftsIncluded === 1 ? '1 plantão · 13h de acesso' : `${selectedPlan.shiftsIncluded} plantões · ${selectedPlan.shiftsIncluded * 13}h no total`}
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div key="empty" className="h-14 flex items-center">
                      <p className="text-[14px] text-white/40">Selecione um plano</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* body */}
              <div className="bg-white px-6 py-5 space-y-4">

                <AnimatePresence mode="wait">
                  {cardData ? (
                    <motion.div key="card-redirect" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <CardRedirectView checkoutUrl={cardData.checkoutUrl} amount={cardData.amount} />
                    </motion.div>
                  ) : pixData ? (
                    <motion.div key="pix-view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <PixView pix={pixData} onBack={() => setPixData(null)} />
                    </motion.div>
                  ) : (
                    <motion.div key="checkout-form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">

                      {/* line items */}
                      <div className="space-y-2.5">
                        <div className="flex justify-between text-[13px]">
                          <span className="text-[#666]">Plantões</span>
                          <span className="font-semibold text-[#111]">{selectedPlan ? selectedPlan.shiftsIncluded : '—'}</span>
                        </div>
                        <div className="flex justify-between text-[13px]">
                          <span className="text-[#666]">Acesso por plantão</span>
                          <span className="font-semibold text-[#111]">13 horas</span>
                        </div>
                        {selectedPlan && selectedPlan.discountPct > 0 && (
                          <div className="flex justify-between text-[13px]">
                            <span className="text-emerald-600">Desconto</span>
                            <span className="font-semibold text-emerald-600">−{selectedPlan.discountPct}%</span>
                          </div>
                        )}
                        <div className="flex justify-between text-[14px] pt-2 border-t border-[rgba(81,43,129,0.08)]">
                          <span className="font-bold text-[#111]">Total</span>
                          <span className="font-bold text-[#111]">{selectedPlan ? fmt(selectedPlan.priceInCents) : '—'}</span>
                        </div>
                      </div>

                      {/* auth gate or payment buttons */}
                      {!isAuthenticated ? (
                        <div className="rounded-2xl overflow-hidden" style={{ border: '1.5px solid rgba(81,43,129,0.15)' }}>
                          <div className="px-5 py-4 text-center" style={{ background: '#F8F5FF' }}>
                            <p className="text-[14px] font-bold text-[#111] mb-0.5">Crie sua conta para pagar</p>
                            <p className="text-[12px] text-[#888]">Grátis e leva menos de 1 minuto</p>
                          </div>
                          <div className="px-5 py-4 bg-white space-y-2.5">
                            <button
                              onClick={() => navigate(`/register?redirect=${encodeURIComponent(`/checkout?shifts=${selected}`)}`)}
                              className="btn-primary-shimmer w-full h-11 rounded-xl text-[14px] font-bold text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                              style={{ background: '#512B81', boxShadow: '0 4px 16px rgba(81,43,129,0.3)' }}
                            >
                              Criar conta grátis
                              <ArrowRight className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => navigate(`/login?redirect=${encodeURIComponent(`/checkout?shifts=${selected}`)}`)}
                              className="w-full h-10 rounded-xl text-[13px] font-semibold transition-colors"
                              style={{ color: '#512B81', border: '1.5px solid rgba(81,43,129,0.2)' }}
                            >
                              Já tenho conta — entrar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <p className="text-[11px] font-semibold text-[#888] uppercase tracking-[0.18em] mb-3">Pagar com</p>
                          <div className="space-y-2.5">
                            {/* PIX */}
                            <button
                              onClick={() => pixMutation.mutate(selected)}
                              disabled={!selectedPlan || isPending}
                              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                              style={{ background: '#32BCAD', boxShadow: '0 4px 16px rgba(50,188,173,0.35)' }}
                            >
                              {pixMutation.isPending ? (
                                <Loader2 className="h-5 w-5 text-white animate-spin mx-auto" />
                              ) : (
                                <>
                                  <img src="/pix.png" alt="Pix" className="h-7 w-auto object-contain brightness-0 invert" />
                                  <div className="flex-1 text-left">
                                    <p className="text-[14px] font-bold text-white leading-tight">Pagar com Pix</p>
                                    <p className="text-[11px] text-white/70">Aprovação imediata · acesso em segundos</p>
                                  </div>
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/20 text-white shrink-0">Instantâneo</span>
                                </>
                              )}
                            </button>

                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-px bg-[rgba(81,43,129,0.08)]" />
                              <span className="text-[11px] text-[#BBB] font-medium">ou</span>
                              <div className="flex-1 h-px bg-[rgba(81,43,129,0.08)]" />
                            </div>

                            {/* Card */}
                            <button
                              onClick={() => cardCheckout.mutate(selected)}
                              disabled={!selectedPlan || isPending}
                              className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                              style={{ background: 'white', border: '1.5px solid rgba(81,43,129,0.18)', boxShadow: '0 2px 8px rgba(81,43,129,0.07)' }}
                            >
                              {cardCheckout.isPending ? (
                                <Loader2 className="h-5 w-5 animate-spin mx-auto" style={{ color: '#512B81' }} />
                              ) : (
                                <>
                                  <div className="flex items-center gap-1.5 shrink-0">
                                    <svg width="30" height="20" viewBox="0 0 30 20" fill="none"><rect width="30" height="20" rx="3" fill="#1A1F71"/><path d="M12.5 13.9h-1.76l1.1-6.9h1.76L12.5 13.9zM9.4 7l-1.68 4.63-.2-1.02-.68-3.43S6.77 7 5.76 7H2.9l-.05.16s.9.19 1.95.82l1.63 5.92H8.5L11.65 7H9.4zM25.4 13.9h1.68L25.6 7h-1.46c-.92 0-1.15.72-1.15.72l-2.96 6.18h1.91l.38-1.05h2.33l.8 1.05zm-2.01-2.49.96-2.64.54 2.64h-1.5zM18.97 8.43l.26-1.5s-.82-.31-1.68-.31c-.93 0-3.13.4-3.13 2.38 0 1.86 2.59 1.88 2.59 2.85s-2.32.8-3.08.19l-.26 1.57s.84.4 2.12.4c1.28 0 3.22-.67 3.22-2.46 0-1.87-2.62-2.04-2.62-2.85 0-.8 1.82-.7 2.58-.27z" fill="white"/></svg>
                                    <svg width="26" height="20" viewBox="0 0 26 20" fill="none"><rect width="26" height="20" rx="3" fill="#231F20"/><circle cx="9.5" cy="10" r="5.2" fill="#EB001B"/><circle cx="16.5" cy="10" r="5.2" fill="#F79E1B"/><path d="M13 5.4a5.2 5.2 0 0 1 0 9.2 5.2 5.2 0 0 1 0-9.2z" fill="#FF5F00"/></svg>
                                    <svg width="26" height="20" viewBox="0 0 26 20" fill="none"><rect width="26" height="20" rx="3" fill="#FFD100"/><text x="4" y="13.5" fontSize="8" fontWeight="800" fill="#000" fontFamily="Arial">elo</text></svg>
                                  </div>
                                  <div className="flex-1 text-left">
                                    <p className="text-[14px] font-bold text-[#111] leading-tight">Pagar com Cartão</p>
                                    <p className="text-[11px] text-[#888]">Crédito · Visa, Mastercard, Elo</p>
                                  </div>
                                  <ArrowRight className="h-4 w-4 shrink-0" style={{ color: '#512B81' }} />
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      )}

                      {mutationError && (
                        <p className="text-center text-[12px] text-red-500">
                          {(mutationError as Error).message}
                        </p>
                      )}

                      {/* trust */}
                      <div className="flex flex-col gap-2 pt-1">
                        {[
                          { icon: Shield,       text: 'Dados criptografados · LGPD' },
                          { icon: CheckCircle2, text: 'Créditos nunca expiram' },
                          { icon: Zap,          text: 'Pix: acesso imediato · Cartão: conforme aprovação' },
                        ].map(({ icon: Icon, text }) => (
                          <div key={text} className="flex items-center gap-2 text-[11px] text-[#888]">
                            <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: '#9A64B5' }} />
                            {text}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
