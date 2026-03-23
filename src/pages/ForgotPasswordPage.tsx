import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft, Stethoscope, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const API = import.meta.env.VITE_BACKEND_URL || 'https://api.medicalcopilot.com.br';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email)) {
      setError('Informe um e-mail válido.');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      await fetch(`${API}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      // Always show success — don't reveal whether e-mail exists
      setSent(true);
    } catch {
      setError('Falha de conexão. Verifique sua internet e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(#512B81 0.5px, transparent 0.5px)', backgroundSize: '28px 28px' }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="relative w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-2xl shadow-slate-200">

          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-[#512B81] flex items-center justify-center shadow-lg shadow-purple-900/15">
              <Stethoscope className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.22em] leading-none">Medical</p>
              <p className="text-sm font-bold text-[#1b1b1b] leading-none tracking-tight mt-0.5">COPILOT</p>
            </div>
          </div>

          {sent ? (
            /* ── Success state ── */
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
              <h2 className="text-xl font-black text-[#1b1b1b] mb-2 tracking-tight">Verifique seu e-mail</h2>
              <p className="text-sm text-slate-400 leading-relaxed mb-8">
                Se <strong className="text-[#1b1b1b]">{email}</strong> estiver cadastrado, você receberá um link de redefinição em instantes. Verifique também sua pasta de spam.
              </p>
              <Button
                onClick={() => navigate('/login')}
                className="w-full h-12 bg-[#1b1b1b] hover:bg-[#512B81] text-white rounded-2xl text-[12px] font-black uppercase tracking-[0.18em] transition-all"
              >
                Voltar para o login
              </Button>
            </motion.div>
          ) : (
            /* ── Form state ── */
            <>
              <h2 className="text-2xl font-black text-[#1b1b1b] mb-1 tracking-tight">Esqueceu a senha?</h2>
              <p className="text-sm text-slate-400 mb-8 leading-relaxed">
                Informe seu e-mail e enviaremos um link para redefinir sua senha.
              </p>

              {error && (
                <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    E-mail
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(''); }}
                      disabled={isLoading}
                      className="h-12 pl-11 bg-slate-50 border-slate-100 rounded-xl focus:border-[#512B81]/40 focus:ring-2 focus:ring-[#512B81]/5 transition-all"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-13 bg-[#1b1b1b] hover:bg-[#512B81] text-white rounded-2xl text-[12px] font-black uppercase tracking-[0.18em] transition-all shadow-xl shadow-slate-200 disabled:opacity-50"
                >
                  {isLoading ? 'Enviando…' : 'Enviar link de redefinição'}
                </Button>
              </form>

              <button
                onClick={() => navigate('/login')}
                className="mt-6 w-full flex items-center justify-center gap-2 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-[#512B81] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Voltar para o login
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
