import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, ArrowRight, Stethoscope, Loader2 } from 'lucide-react';

const API = import.meta.env.VITE_BACKEND_URL || 'https://api.medicalcopilot.com.br';

type Status = 'polling' | 'confirmed' | 'timeout';

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>('polling');
  const [availableCount, setAvailableCount] = useState<number | null>(null);
  const [attempts, setAttempts] = useState(0);

  // Poll /api/access/status until availableCount > 0 (webhook confirmed)
  useEffect(() => {
    let cancelled = false;
    const MAX_ATTEMPTS = 20; // ~60s total

    const poll = async () => {
      if (cancelled) return;
      try {
        const res = await fetch(`${API}/api/access/status`, { credentials: 'include' });
        if (!res.ok) throw new Error();
        const json = await res.json();
        const count: number = json.data?.availableCount ?? 0;
        const hasActive: boolean = json.data?.hasActiveAccess ?? false;

        setAttempts(a => a + 1);

        if (count > 0 || hasActive) {
          setAvailableCount(count);
          setStatus('confirmed');
          return;
        }

        if (attempts >= MAX_ATTEMPTS) {
          setStatus('timeout');
          return;
        }

        setTimeout(poll, 3000);
      } catch {
        setTimeout(poll, 3000);
      }
    };

    // Start polling after 2s (give webhook time to arrive)
    const t = setTimeout(poll, 2000);
    return () => { cancelled = true; clearTimeout(t); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6"
      style={{ background: '#FAFAF8', fontFamily: "'Manrope','Inter',system-ui,sans-serif" }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 mb-16">
        <div className="h-8 w-8 rounded-xl flex items-center justify-center" style={{ background: '#512B81' }}>
          <Stethoscope className="h-4 w-4 text-white" strokeWidth={2.5} />
        </div>
        <span className="text-[15px] font-bold">Medical<span style={{ color: '#512B81' }}>Copilot</span></span>
      </div>

      <div className="w-full max-w-md text-center">

        {/* ── POLLING ── */}
        {status === 'polling' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8"
              style={{ background: '#EEE6FF', border: '2px solid rgba(81,43,129,0.15)' }}
            >
              <Loader2 className="h-8 w-8 animate-spin" style={{ color: '#512B81' }} />
            </div>
            <h1 className="text-[28px] font-bold text-[#111] tracking-tight mb-3">
              Confirmando pagamento…
            </h1>
            <p className="text-[16px] text-[#666] leading-relaxed mb-8">
              Estamos aguardando a confirmação do Pix. Isso leva alguns segundos.
            </p>
            <div className="flex items-center justify-center gap-2 text-[13px] text-[#999]">
              <Clock className="h-4 w-4" />
              Verificando automaticamente…
            </div>
          </motion.div>
        )}

        {/* ── CONFIRMED ── */}
        {status === 'confirmed' && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
            {/* animated checkmark */}
            <div className="relative w-24 h-24 mx-auto mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 18, delay: 0.1 }}
                className="w-24 h-24 rounded-full flex items-center justify-center"
                style={{ background: '#ECFDF5' }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.25 }}
                >
                  <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                </motion.div>
              </motion.div>
              {/* pulse ring */}
              <motion.div
                className="absolute inset-0 rounded-full"
                style={{ border: '2px solid rgba(16,185,129,0.3)' }}
                animate={{ scale: [1, 1.4, 1.4], opacity: [1, 0, 0] }}
                transition={{ duration: 1.2, delay: 0.3, repeat: 2 }}
              />
            </div>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <h1 className="text-[32px] font-bold text-[#111] tracking-tight mb-3">
                Pagamento confirmado!
              </h1>
              <p className="text-[16px] text-[#555] leading-relaxed mb-2">
                {availableCount && availableCount > 0
                  ? `${availableCount} plantão${availableCount > 1 ? 'ões' : ''} disponível${availableCount > 1 ? 'is' : ''} na sua conta.`
                  : 'Seus plantões foram adicionados à sua conta.'
                }
              </p>
              <p className="text-[14px] text-[#888] mb-10">
                Cada plantão libera 13h de acesso completo à plataforma.
              </p>
            </motion.div>

            {/* what to do next */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="p-5 rounded-2xl mb-8 text-left"
              style={{ background: 'white', border: '1px solid rgba(81,43,129,0.1)', boxShadow: '0 2px 12px rgba(81,43,129,0.06)' }}
            >
              <p className="text-[12px] font-bold uppercase tracking-[0.22em] text-[#9A64B5] mb-4">Próximos passos</p>
              <div className="space-y-3">
                {[
                  'Acesse o painel e clique em "Iniciar plantão"',
                  'A IA começa a escutar assim que você iniciar',
                  'SOAP pronto ao final de cada consulta',
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-black text-white mt-0.5"
                      style={{ background: '#512B81' }}>
                      {i + 1}
                    </div>
                    <p className="text-[13px] text-[#444] leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              onClick={() => navigate('/worklist')}
              className="btn-primary-shimmer w-full h-13 px-8 py-4 rounded-2xl text-[15px] font-semibold text-white flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
              style={{ background: '#512B81', boxShadow: '0 4px 24px rgba(81,43,129,0.35)' }}
            >
              Ir para o painel
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          </motion.div>
        )}

        {/* ── TIMEOUT ── */}
        {status === 'timeout' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-8"
              style={{ background: '#FEF3C7', border: '2px solid rgba(245,158,11,0.2)' }}>
              <Clock className="h-9 w-9 text-amber-500" />
            </div>
            <h1 className="text-[28px] font-bold text-[#111] tracking-tight mb-3">
              Ainda processando…
            </h1>
            <p className="text-[16px] text-[#555] leading-relaxed mb-8">
              Seu pagamento está sendo processado. Os créditos aparecerão na sua conta em até 5 minutos.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => { setStatus('polling'); setAttempts(0); }}
                className="px-6 py-3 rounded-xl text-[14px] font-semibold text-white"
                style={{ background: '#512B81' }}
              >
                Verificar novamente
              </button>
              <button
                onClick={() => navigate('/worklist')}
                className="px-6 py-3 rounded-xl text-[14px] font-medium text-[#512B81] hover:bg-[#F3EEFF] transition-colors"
                style={{ border: '1.5px solid rgba(81,43,129,0.18)' }}
              >
                Ir para o painel
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
