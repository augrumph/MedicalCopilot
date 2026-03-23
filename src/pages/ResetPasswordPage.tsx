import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, ArrowRight, Stethoscope, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const API = import.meta.env.VITE_BACKEND_URL || 'https://api.medicalcopilot.com.br';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Redirect if no token in URL
  useEffect(() => {
    if (!token) navigate('/forgot-password', { replace: true });
  }, [token, navigate]);

  const passwordStrength = (): { label: string; color: string; width: string } => {
    const p = newPassword;
    if (!p) return { label: '', color: '', width: '0%' };
    let score = 0;
    if (p.length >= 8) score++;
    if (p.length >= 12) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    if (score <= 1) return { label: 'Fraca', color: '#ef4444', width: '25%' };
    if (score <= 2) return { label: 'Razoável', color: '#f97316', width: '50%' };
    if (score <= 3) return { label: 'Boa', color: '#eab308', width: '75%' };
    return { label: 'Forte', color: '#22c55e', width: '100%' };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setError('A senha deve ter pelo menos 8 caracteres.');
      return;
    }
    if (newPassword !== confirm) {
      setError('As senhas não coincidem.');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      const res = await fetch(`${API}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => navigate('/login'), 3000);
      } else {
        setError(data.error || 'Token inválido ou expirado. Solicite um novo link.');
      }
    } catch {
      setError('Falha de conexão. Verifique sua internet e tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const strength = passwordStrength();

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

          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-5">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
              <h2 className="text-xl font-black text-[#1b1b1b] mb-2 tracking-tight">Senha redefinida!</h2>
              <p className="text-sm text-slate-400 leading-relaxed mb-2">
                Sua senha foi atualizada com sucesso.
              </p>
              <p className="text-[12px] text-slate-300 font-medium">Redirecionando para o login…</p>
            </motion.div>
          ) : (
            <>
              <h2 className="text-2xl font-black text-[#1b1b1b] mb-1 tracking-tight">Nova senha</h2>
              <p className="text-sm text-slate-400 mb-8 leading-relaxed">
                Escolha uma senha forte para proteger sua conta.
              </p>

              {error && (
                <div className="mb-5 p-3.5 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* New password */}
                <div className="space-y-1.5">
                  <Label htmlFor="new-password" className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Nova senha
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <Input
                      id="new-password"
                      type={showNew ? 'text' : 'password'}
                      placeholder="Mínimo 8 caracteres"
                      value={newPassword}
                      onChange={(e) => { setNewPassword(e.target.value); setError(''); }}
                      disabled={isLoading}
                      className="h-12 pl-11 pr-11 bg-slate-50 border-slate-100 rounded-xl focus:border-[#512B81]/40 focus:ring-2 focus:ring-[#512B81]/5 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(v => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                    >
                      {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {/* Strength bar */}
                  {newPassword && (
                    <div className="space-y-1">
                      <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full transition-all"
                          animate={{ width: strength.width }}
                          style={{ background: strength.color }}
                        />
                      </div>
                      <p className="text-[11px] font-semibold" style={{ color: strength.color }}>
                        {strength.label}
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm password */}
                <div className="space-y-1.5">
                  <Label htmlFor="confirm-password" className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Confirmar senha
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <Input
                      id="confirm-password"
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="Repita a senha"
                      value={confirm}
                      onChange={(e) => { setConfirm(e.target.value); setError(''); }}
                      disabled={isLoading}
                      className={`h-12 pl-11 pr-11 bg-slate-50 rounded-xl focus:ring-2 focus:ring-[#512B81]/5 transition-all ${
                        confirm && confirm !== newPassword
                          ? 'border-red-200 focus:border-red-300'
                          : 'border-slate-100 focus:border-[#512B81]/40'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(v => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500 transition-colors"
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {confirm && confirm !== newPassword && (
                    <p className="text-[11px] text-red-500 font-medium">As senhas não coincidem</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || !newPassword || !confirm}
                  className="w-full h-12 bg-[#1b1b1b] hover:bg-[#512B81] text-white rounded-2xl text-[12px] font-black uppercase tracking-[0.18em] transition-all shadow-xl shadow-slate-200 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? 'Redefinindo…' : <>Redefinir senha <ArrowRight className="w-4 h-4" /></>}
                </Button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
