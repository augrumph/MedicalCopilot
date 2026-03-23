import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, User, Mail, Lock, CheckCircle, ChevronRight, AlertCircle, Stethoscope, ArrowLeft, LogIn } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { useAppStore } from '@/stores/appStore';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

const STATES_BR = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectAfter = searchParams.get('redirect') || '/worklist';
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    cpf: '',
    crm: '',
    crmState: 'SP',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'error' | 'success', message: string } | null>(null);

  const applyCpfMask = (v: string) => {
    v = v.replace(/\D/g, "");
    if (v.length > 11) v = v.slice(0, 11);
    if (v.length <= 11) {
      v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }
    return v;
  };

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleNext = () => {
    if (step === 1) {
      if (!formData.fullName || !formData.email || !formData.password) {
        setStatus({ type: 'error', message: 'Preencha todos os campos básicos' });
        return;
      }
      if (!EMAIL_RE.test(formData.email)) {
        setStatus({ type: 'error', message: 'Informe um e-mail válido' });
        return;
      }
    }
    setStatus(null);
    setStep(step + 1);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus(null);

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://api.medicalcopilot.com.br';
      const response = await fetch(`${backendUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setStatus({ type: 'success', message: 'Conta criada com sucesso! Redirecionando…' });
        setTimeout(() => navigate(`/login?redirect=${encodeURIComponent(redirectAfter)}`), 1500);
      } else {
        setStatus({ type: 'error', message: data.error || 'Erro ao criar conta' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Falha na conexão com o servidor' });
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      setStatus(null);
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://api.medicalcopilot.com.br';
        const response = await fetch(`${backendUrl}/api/auth/google`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: tokenResponse.access_token }),
        });

        const data = await response.json();
        if (data.success) {
          useAppStore.setState({
            isAuthenticated: true,
            user: {
              name: data.user.name || data.user.fullName,
              email: data.user.email
            }
          });
          toast.success('Login com Google realizado!');
          navigate(redirectAfter);
        } else {
          setStatus({ type: 'error', message: data.error || 'Falha no login com Google' });
        }
      } catch (err) {
        setStatus({ type: 'error', message: 'Erro de conexão com o servidor' });
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => setStatus({ type: 'error', message: 'Falha na autenticação com Google' }),
  });

  const handleSSORegister = () => {
    googleLogin();
  };

  return (
    <div className="min-h-screen bg-white text-[#1B1B1B] selection:bg-[#512B81]/10 font-sans flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.04]" 
           style={{ backgroundImage: `radial-gradient(#512B81 0.5px, transparent 0.5px)`, backgroundSize: "32px 32px" }} />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-white border border-slate-100 rounded-[40px] p-8 lg:p-12 shadow-2xl shadow-slate-200 relative overflow-hidden"
      >
        <div className="mb-10 flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-black tracking-tight uppercase">Criar conta</h1>
                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em] mt-2">Elite Clinical Stack for Physicians</p>
            </div>
            <div className="w-14 h-14 bg-[#512B81] rounded-2xl flex items-center justify-center shadow-xl shadow-purple-900/20">
                <Shield className="text-white w-7 h-7" strokeWidth={2.5} />
            </div>
        </div>

        {step === 1 && (
            <div className="mb-8 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => handleSSORegister()}
                    className="h-14 rounded-2xl bg-white border border-slate-100 text-[#1B1B1B] text-[11px] font-black uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow-md hover:bg-slate-50 hover:-translate-y-0.5 active:scale-[0.97] active:shadow-inner"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Google
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="h-14 rounded-2xl bg-white border border-slate-100 text-[#512B81] text-[11px] font-black uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow-md hover:bg-slate-50 hover:-translate-y-0.5 active:scale-[0.97] active:shadow-inner"
                  >
                    <LogIn className="w-5 h-5" />
                    Já tenho conta
                  </button>
                </div>

                <div className="relative flex items-center gap-3 py-2">
                  <div className="flex-1 h-px bg-slate-100" />
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">ou use seu e-mail</span>
                  <div className="flex-1 h-px bg-slate-100" />
                </div>
            </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nome Completo</label>
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                        <input 
                            type="text"
                            required
                            placeholder="Seu nome completo"
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 focus:border-[#512B81]/40 focus:ring-0 outline-none transition-all placeholder:text-slate-300 font-medium"
                            value={formData.fullName}
                            onChange={e => setFormData({...formData, fullName: e.target.value})}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">E-mail Institucional</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                        <input 
                            type="email"
                            required
                            placeholder="email@consultorio.com"
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 focus:border-[#512B81]/40 focus:ring-0 outline-none transition-all placeholder:text-slate-300 font-medium"
                            value={formData.email}
                            onChange={e => setFormData({...formData, email: e.target.value})}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Senha de Acesso</label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                        <input 
                            type="password"
                            required
                            placeholder="••••••••"
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 focus:border-[#512B81]/40 focus:ring-0 outline-none transition-all placeholder:text-slate-300 font-medium"
                            value={formData.password}
                            onChange={e => setFormData({...formData, password: e.target.value})}
                        />
                    </div>
                </div>

                <Button 
                    type="button"
                    onClick={handleNext}
                    className="w-full bg-[#1B1B1B] hover:bg-[#512B81] text-white font-black py-7 rounded-2xl flex items-center justify-center gap-3 transition-all mt-8 group uppercase tracking-[0.2em] text-[12px] shadow-xl shadow-slate-200"
                >
                    Continuar para Credenciais <ChevronRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                </Button>
              </motion.div>
            ) : (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4"
              >
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">CPF (Somente Números)</label>
                    <input 
                        type="text"
                        required
                        placeholder="000.000.000-00"
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-4 focus:border-[#512B81]/40 focus:ring-0 outline-none transition-all placeholder:text-slate-300 font-medium"
                        value={applyCpfMask(formData.cpf)}
                        onChange={e => setFormData({...formData, cpf: e.target.value.replace(/\D/g, "")})}
                    />
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2 space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Número CRM</label>
                        <div className="relative">
                            <Stethoscope className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                            <input 
                                type="text"
                                required
                                placeholder="123456"
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 focus:border-[#512B81]/40 focus:ring-0 outline-none transition-all placeholder:text-slate-300 font-medium"
                                value={formData.crm}
                                onChange={e => setFormData({...formData, crm: e.target.value})}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">UF</label>
                        <select 
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-4 focus:border-[#512B81]/40 focus:ring-0 outline-none transition-all appearance-none cursor-pointer font-medium"
                            value={formData.crmState}
                            onChange={e => setFormData({...formData, crmState: e.target.value})}
                        >
                            {STATES_BR.map(uf => <option key={uf} value={uf} className="bg-white">{uf}</option>)}
                        </select>
                    </div>
                </div>

                <div className="bg-[#512B81]/5 border border-[#512B81]/10 rounded-2xl p-5 flex items-start gap-4 mt-4">
                    <CheckCircle className="text-[#512B81] w-6 h-6 shrink-0 mt-0.5" />
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                        Ao prosseguir, validaremos seus dados automaticamente nos sistemas federais médicos para garantir a integridade da plataforma.
                    </p>
                </div>

                <Button 
                    disabled={isLoading}
                    className="w-full bg-[#1B1B1B] hover:bg-[#512B81] text-white font-black py-7 rounded-2xl flex items-center justify-center gap-2 transition-all mt-8 disabled:opacity-50 uppercase tracking-[0.2em] text-[12px] shadow-xl shadow-slate-200"
                >
                    {isLoading ? 'Verificando CRM...' : 'Finalizar Registro Médico'}
                </Button>

                <button 
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-full text-slate-400 text-[10px] font-black uppercase tracking-widest py-2 hover:text-[#512B81] transition-all flex items-center justify-center gap-2"
                >
                    <ArrowLeft className="w-3.5 h-3.5" /> Voltar para dados básicos
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        <AnimatePresence>
            {status && (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`mt-6 p-5 rounded-2xl flex items-center gap-4 ${status.type === 'error' ? 'bg-red-50 border border-red-100 text-red-600' : 'bg-emerald-50 border border-emerald-100 text-emerald-700'}`}
                >
                    {status.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                    <span className="text-sm font-bold uppercase tracking-tight">{status.message}</span>
                </motion.div>
            )}
        </AnimatePresence>

        <p className="mt-10 text-center text-slate-400 text-[11px] font-black uppercase tracking-[0.2em]">
          Medical Copilot — Elite Clinical Intelligence
        </p>
      </motion.div>
    </div>
  );
}
