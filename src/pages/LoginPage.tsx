import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, ArrowRight, Sparkles, Stethoscope, Brain, Shield, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useGoogleLogin } from '@react-oauth/google';
import { useAppStore } from '@/stores/appStore';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Spotlight } from '@/components/ui/spotlight';
import { BgGrid } from '@/components/ui/bg-grid';
import { toast } from 'sonner';

const FEATURES = [
  {
    icon: Sparkles,
    title: 'IA em Tempo Real',
    desc: 'Sugestões e análises instantâneas durante suas consultas',
    color: '#512B81',
  },
  {
    icon: Stethoscope,
    title: 'Protocolos Clínicos',
    desc: 'Biblioteca completa com protocolos baseados em evidências',
    color: '#1B1B1B',
  },
  {
    icon: Brain,
    title: 'Notas SOAP Automáticas',
    desc: 'Documentação gerada automaticamente pela voz do médico',
    color: '#512B81',
  },
  {
    icon: Shield,
    title: 'LGPD Compliant',
    desc: 'Dados dos pacientes protegidos com criptografia AES-256',
    color: '#1B1B1B',
  },
];

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const login = useAppStore((s) => s.login);
  const setUser = useAppStore((s) => s.setUser);
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate('/worklist');
  }, [isAuthenticated, navigate]);

  const validateForm = () => {
    let ok = true;
    if (!email) { setEmailError('Email é obrigatório'); ok = false; }
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setEmailError('Email inválido'); ok = false; }
    else setEmailError('');
    if (!password) { setPasswordError('Senha é obrigatória'); ok = false; }
    else if (password.length < 6) { setPasswordError('Mínimo 6 caracteres'); ok = false; }
    else setPasswordError('');
    return ok;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      await login(email, password);
    } catch (err: any) {
      setError(err.message || 'Falha ao entrar. Verifique suas credenciais.');
    } finally {
      setIsLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      setError('');
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://api.medicalcopilot.com.br';
        const response = await fetch(`${backendUrl}/api/auth/google`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ token: tokenResponse.access_token }),
        });

        const data = await response.json();
        if (data.success) {
          const u = data.user;
          setUser({
            id:            u.id,
            name:          u.name || u.fullName || u.firstName,
            email:         u.email,
            fullName:      u.fullName,
            firstName:     u.firstName,
            lastName:      u.lastName,
            birthDate:     u.birthDate,
            cpf:           u.cpf,
            city:          u.city,
            state:         u.state,
            crm:           u.crm,
            crmState:      u.crmState,
            isCrmVerified: u.isCrmVerified ?? false,
            acceptedTermsAt: u.acceptedTermsAt,
          });
          useAppStore.setState({ isAuthenticated: true });

          if (!u.isCrmVerified) {
            toast.info('Bem-vindo! Complete seu cadastro médico para continuar.');
            navigate('/onboarding');
          } else {
            toast.success('Login com Google realizado!');
          }
        } else {
          setError(data.error || 'Falha no login com Google');
        }
      } catch (err) {
        setError('Erro de conexão com o servidor');
      } finally {
        setIsLoading(false);
      }
    },
    onError: () => setError('Falha na autenticação com Google'),
  });

  const handleSSOLogin = () => {
    googleLogin();
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-white flex items-center justify-center p-4">
      {/* ── Dot grid ── */}
      <BgGrid dotColor="#512B81" opacity={0.04} gap={28} />

      {/* ── Spotlight cursor ── */}
      <Spotlight fill="rgba(81,43,129,0.05)" />

      {/* ── Floating orbs ── */}
      <motion.div
        className="absolute -top-40 -left-40 w-[500px] h-[500px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(81,43,129,0.08) 0%, transparent 70%)',
          filter: 'blur(60px)',
          animation: 'pulse-orb 8s ease-in-out infinite',
        }}
      />
      <motion.div
        className="absolute -bottom-40 -right-32 w-[420px] h-[420px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(27,27,27,0.05) 0%, transparent 70%)',
          filter: 'blur(70px)',
          animation: 'pulse-orb 10s ease-in-out 2s infinite',
        }}
      />

      {/* ── Main grid ── */}
      <div className="relative z-10 w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">

        {/* LEFT — Branding */}
        <motion.div
          className="hidden lg:flex flex-col gap-10"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {/* Logo */}
          <div className="flex items-center gap-4">
            <motion.div
              className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl"
              style={{
                background: '#512B81',
                boxShadow: '0 20px 40px rgba(81,43,129,0.2)',
              }}
              whileHover={{ scale: 1.08, rotate: 3 }}
            >
              <Activity className="w-9 h-9 text-white" strokeWidth={2.5} />
            </motion.div>
            <div>
              <p className="text-[11px] font-black tracking-[0.25em] text-slate-400 uppercase mb-1">
                Plataforma Médica
              </p>
              <h1 className="text-3xl font-black text-[#1B1B1B] leading-none tracking-tight">
                Medical{' '}
                <span className="text-[#512B81]">Copilot</span>
              </h1>
            </div>
          </div>

          {/* Headline */}
          <div className="space-y-3">
            <h2 className="text-5xl font-black text-[#1B1B1B] leading-[1.1] tracking-tight">
              Atenda mais.{' '}
              <br />
              <span className="text-[#512B81]">Documente menos.</span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed max-w-md font-medium">
              IA que trabalha com você durante a consulta — não depois dela.
            </p>
          </div>

          {/* Feature list */}
          <div className="grid grid-cols-2 gap-3">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="group flex items-start gap-3 p-4 rounded-2xl border border-slate-100 bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all cursor-default"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ background: `${f.color}10` }}
                >
                  <f.icon className="w-4 h-4" style={{ color: f.color }} />
                </div>
                <div>
                  <p className="text-sm font-bold text-[#1B1B1B] leading-none mb-1">{f.title}</p>
                  <p className="text-[11px] text-slate-400 leading-snug font-medium">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex items-center gap-3"
          >
            <div className="flex -space-x-2">
              {['#512B81', '#1B1B1B', '#9A64B5', '#5b3629'].map((c, i) => (
                <div
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-white text-[10px] font-black"
                  style={{ background: c }}
                >
                  {['Dr', 'RE', 'MD', '+1'][i]}
                </div>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 font-bold">
              <span className="text-[#1B1B1B]">+1.200 médicos</span> já usam diariamente
            </p>
          </motion.div>
        </motion.div>

        {/* RIGHT — Login form */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {/* Card wrapper */}
          <div className="relative p-[1px] rounded-[32px] bg-slate-100 shadow-2xl shadow-slate-200">
            <div className="relative bg-white rounded-[31px] p-8 md:p-10 z-10">

              {/* Mobile logo */}
              <div className="flex lg:hidden items-center gap-3 mb-8">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center bg-[#512B81]"
                >
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-black text-[#1B1B1B]">Medical Copilot</span>
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-black text-[#1B1B1B] mb-2 tracking-tight">
                  Bem-vindo de volta
                </h2>
                <p className="text-slate-400 text-sm font-medium">
                  Entre com suas credenciais para continuar
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    disabled={isLoading}
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
                    className={`h-12 bg-slate-50 border-slate-100 text-[#1B1B1B] placeholder:text-slate-300 rounded-xl focus:border-[#512B81]/40 focus:bg-white focus:ring-2 focus:ring-[#512B81]/5 transition-all ${emailError ? 'border-red-200' : ''}`}
                  />
                  {emailError && <p className="text-red-500 text-xs font-medium">{emailError}</p>}
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                      Senha
                    </Label>
                    <button type="button" onClick={() => navigate('/forgot-password')} className="text-[11px] text-[#512B81] hover:underline transition-colors font-bold uppercase tracking-wider">
                      Esqueceu?
                    </button>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    disabled={isLoading}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setPasswordError(''); }}
                    className={`h-12 bg-slate-50 border-slate-100 text-[#1B1B1B] placeholder:text-slate-300 rounded-xl focus:border-[#512B81]/40 focus:bg-white focus:ring-2 focus:ring-[#512B81]/5 transition-all ${passwordError ? 'border-red-200' : ''}`}
                  />
                  {passwordError && <p className="text-red-500 text-xs font-medium">{passwordError}</p>}
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 bg-[#1B1B1B] hover:bg-[#512B81] text-white rounded-2xl text-[13px] font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-slate-200 hover:shadow-[#512B81]/20 disabled:opacity-50"
                >
                  {isLoading ? 'Entrando...' : 'Entrar'}
                  {!isLoading && <ArrowRight className="ml-2 w-5 h-5" />}
                </Button>

                <div className="relative flex items-center gap-3 py-2">
                  <div className="flex-1 h-px bg-slate-100" />
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">ou</span>
                  <div className="flex-1 h-px bg-slate-100" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => handleSSOLogin()}
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
                    onClick={() => navigate('/register')}
                    className="h-14 rounded-2xl bg-white border border-slate-100 text-[#512B81] text-[11px] font-black uppercase tracking-[0.15em] transition-all flex items-center justify-center gap-3 shadow-sm hover:shadow-md hover:bg-slate-50 hover:-translate-y-0.5 active:scale-[0.97] active:shadow-inner"
                  >
                    <UserPlus className="w-5 h-5" />
                    Criar Conta
                  </button>
                </div>
              </form>

              {/* Demo badge */}
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-8 flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-slate-50 border border-slate-100"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#512B81]" />
                <p className="text-[11px] text-slate-400 font-bold">
                  <span className="text-[#1B1B1B] uppercase tracking-wider mr-1">Demo:</span> use qualquer email
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
