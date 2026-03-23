/**
 * OnboardingPage — Completar perfil médico após cadastro via Google
 *
 * Exibido quando isCrmVerified === false.
 * Coleta: nome completo, data de nascimento, CPF, CRM, estado do CRM, cidade e estado.
 * Valida CRM no backend antes de liberar acesso.
 * Após cadastro bem-sucedido, oferece o tutorial do sistema.
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  User,
  Sparkles,
  BookOpen,
  ChevronRight,
} from 'lucide-react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAppStore } from '@/stores/appStore';
import TutorialModal, { useTutorialSeen } from '@/components/TutorialModal';
import { DotBackground } from '@/components/ui/dot-background';
import { BorderBeam } from '@/components/ui/border-beam';
import { ShimmerButton } from '@/components/ui/shimmer-button';

const ESTADOS_BR = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS',
  'MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC',
  'SP','SE','TO',
];

function maskCPF(v: string) {
  return v.replace(/\D/g, '').slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
}

function isValidCPF(raw: string): boolean {
  const c = raw.replace(/\D/g, '');
  if (c.length !== 11 || /^(\d)\1{10}$/.test(c)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(c[i]) * (10 - i);
  let r = (sum * 10) % 11;
  if (r === 10 || r === 11) r = 0;
  if (r !== parseInt(c[9])) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(c[i]) * (11 - i);
  r = (sum * 10) % 11;
  if (r === 10 || r === 11) r = 0;
  return r === parseInt(c[10]);
}

const API = import.meta.env.VITE_BACKEND_URL || 'https://api.medicalcopilot.com.br';

// ── Tutorial offer screen ─────────────────────────────────────────────────────

interface TutorialOfferProps {
  name: string;
  onStart: () => void;
  onSkip: () => void;
}

function TutorialOffer({ name, onStart, onSkip }: TutorialOfferProps) {
  const firstName = name.split(' ')[0];

  const features = [
    { icon: '🎙️', label: 'Consulta com IA por voz' },
    { icon: '📋', label: 'SOAP automático em 1 clique' },
    { icon: '🧬', label: 'Protocolos clínicos interativos' },
    { icon: '💰', label: 'Controle financeiro de plantões' },
  ];

  return (
    <motion.div
      key="tutorial-offer"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-lg"
    >
      {/* Success banner */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-4 mb-6"
      >
        <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <p className="text-emerald-800 font-black text-sm">CRM verificado com sucesso!</p>
          <p className="text-emerald-600 text-xs mt-0.5">Bem-vindo ao Medical Copilot, Dr. {firstName}.</p>
        </div>
      </motion.div>

      {/* Card — white with purple top stripe */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative bg-white rounded-[24px] sm:rounded-[28px] border border-slate-100 shadow-xl shadow-slate-200/60 overflow-hidden"
      >
        {/* Purple gradient top stripe */}
        <div className="h-1 w-full bg-gradient-to-r from-[#512B81] to-[#a876c4]" />

        {/* Subtle dot pattern overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: 'radial-gradient(circle, #512B8112 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        />

        <div className="relative z-10 p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-[#512B81]" />
            </div>
            <div>
              <p className="text-slate-400 text-[10px] font-black tracking-[0.2em] uppercase">Tour rápido</p>
              <h2 className="text-xl font-black text-[#1B1B1B]">Quer ver como funciona?</h2>
            </div>
          </div>

          <p className="text-slate-500 text-sm leading-relaxed mb-6">
            Em menos de 2 minutos, vamos te mostrar os principais recursos que vão transformar seus plantões.
          </p>

          {/* Feature list */}
          <div className="grid grid-cols-2 gap-2.5 mb-8">
            {features.map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.1 }}
                className="flex items-center gap-2.5 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2.5"
              >
                <span className="text-base">{f.icon}</span>
                <span className="text-slate-600 text-xs font-medium leading-tight">{f.label}</span>
              </motion.div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            <ShimmerButton
              onClick={onStart}
              background="#512B81"
              className="w-full h-12 text-[13px] uppercase tracking-widest shadow-lg shadow-purple-200/60"
            >
              <Sparkles className="mr-2 w-4 h-4" />
              Fazer o tour agora
            </ShimmerButton>
            <Button
              variant="ghost"
              onClick={onSkip}
              className="w-full h-11 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-2xl font-bold text-[13px] transition-all"
            >
              Pular e ir para o painel
              <ChevronRight className="ml-1 w-4 h-4" />
            </Button>
          </div>
        </div>
      </motion.div>

      <p className="text-center text-[11px] text-slate-400 font-medium mt-6">
        Você pode acessar o tour novamente em Configurações a qualquer momento.
      </p>
    </motion.div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const navigate  = useNavigate();
  const user      = useAppStore((s) => s.user);
  const setUser   = useAppStore((s) => s.setUser);
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);

  const [step, setStep]             = useState(1);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');
  const [showOffer, setShowOffer]   = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [savedName, setSavedName]   = useState('');

  const tutorialSeen = useTutorialSeen(user?.id);

  // Step 1 — dados pessoais
  const [fullName,   setFullName]   = useState(user?.fullName || user?.name || '');
  const [birthDate,  setBirthDate]  = useState(user?.birthDate || '');
  const [cpf,        setCpf]        = useState(user?.cpf || '');

  // Step 2 — dados médicos
  const [crm,      setCrm]      = useState(user?.crm || '');
  const [crmState, setCrmState] = useState(user?.crmState || '');
  const [city,     setCity]     = useState(user?.city || '');
  const [state,    setState]    = useState(user?.state || '');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (user?.isCrmVerified && !showOffer && !showTutorial) {
      navigate('/worklist');
    }
  }, [user?.isCrmVerified, showOffer, showTutorial, navigate]);

  if (!isAuthenticated || (user?.isCrmVerified && !showOffer && !showTutorial)) {
    return null;
  }

  // ── Step 1 submit ──────────────────────────────────────────────────────────

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) return setError('Nome completo é obrigatório.');
    if (!birthDate)       return setError('Data de nascimento é obrigatória.');
    if (cpf && !isValidCPF(cpf))
                          return setError('CPF inválido — verifique os dígitos.');
    setError('');
    setStep(2);
  };

  // ── Step 2 submit ──────────────────────────────────────────────────────────

  const handleStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!crm.trim())      return setError('Número do CRM é obrigatório.');
    if (!crmState)        return setError('Estado do CRM é obrigatório.');
    if (!city.trim())     return setError('Cidade é obrigatória.');
    if (!state)           return setError('Estado de atuação é obrigatório.');
    setError('');
    setLoading(true);

    try {
      const res  = await fetch(`${API}/api/auth/profile`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          fullName,
          birthDate,
          cpf:      cpf.replace(/\D/g, '') || undefined,
          crm:      crm.trim(),
          crmState,
          city:     city.trim(),
          state,
        }),
      });

      if (res.status === 401) {
        // Sessão expirada — limpa estado e volta ao login
        setUser(null as any);
        useAppStore.setState({ isAuthenticated: false });
        navigate('/login');
        return;
      }

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.error || 'Erro ao salvar perfil. Verifique os dados e tente novamente.');
        return;
      }

      const u = data.user;
      setUser({
        id:            u.id,
        name:          u.name || u.firstName,
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
        isCrmVerified: u.isCrmVerified,
        acceptedTermsAt: u.acceptedTermsAt ?? user?.acceptedTermsAt,
      });

      setSavedName(u.fullName || u.firstName || fullName);
      toast.success('Cadastro completo! Bem-vindo ao Medical Copilot.');

      // Show tutorial offer instead of navigating immediately
      setShowOffer(true);
    } catch {
      setError('Erro de conexão. Verifique sua internet e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // ── Tutorial handlers ─────────────────────────────────────────────────────

  const handleStartTutorial = () => {
    setShowOffer(false);
    setShowTutorial(true);
  };

  const handleSkipTutorial = () => {
    tutorialSeen.markSeen();
    navigate('/worklist');
  };

  const handleTutorialComplete = () => {
    tutorialSeen.markSeen();
    setShowTutorial(false);
    navigate('/worklist');
  };

  const handleTutorialClose = () => {
    tutorialSeen.markSeen();
    setShowTutorial(false);
    navigate('/worklist');
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <DotBackground className="min-h-screen bg-white flex items-center justify-center p-4 sm:p-6">
        {/* Soft purple radial spotlight at top center */}
        <div
          className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl"
          style={{ background: 'radial-gradient(ellipse at center, rgba(81,43,129,0.08) 0%, transparent 70%)' }}
        />

        <AnimatePresence mode="wait">
          {showOffer ? (
            <TutorialOffer
              name={savedName}
              onStart={handleStartTutorial}
              onSkip={handleSkipTutorial}
            />
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-lg"
            >
              {/* Top badge */}
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex justify-center mb-6"
              >
                <div className="inline-flex items-center gap-2 bg-purple-50 border border-purple-100 rounded-full px-4 py-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#512B81]" />
                  <span className="text-[10px] font-black tracking-[0.2em] text-[#512B81] uppercase">
                    Medical Copilot
                  </span>
                </div>
              </motion.div>

              {/* Header */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-[#512B81] flex items-center justify-center shadow-lg shadow-purple-200/60">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-black tracking-[0.25em] text-slate-400 uppercase">Primeiro acesso</p>
                  <h1 className="text-xl font-black text-[#1B1B1B] tracking-tight">Complete seu cadastro</h1>
                </div>
              </div>

              {/* Progress */}
              <div className="flex items-center gap-3 mb-8">
                {[1, 2].map((s) => (
                  <div key={s} className="flex items-center gap-2 flex-1">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border-2 transition-all ${
                        step > s
                          ? 'bg-[#512B81] border-[#512B81] text-white'
                          : step === s
                          ? 'border-[#512B81] text-[#512B81] ring-2 ring-purple-200'
                          : 'border-slate-200 text-slate-300'
                      }`}
                    >
                      {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
                    </div>
                    <span className={`text-xs font-bold ${step >= s ? 'text-[#1B1B1B]' : 'text-slate-300'}`}>
                      {s === 1 ? 'Dados pessoais' : 'Credenciais médicas'}
                    </span>
                    {s < 2 && <div className={`flex-1 h-0.5 ${step > s ? 'bg-[#512B81]' : 'bg-slate-100'}`} />}
                  </div>
                ))}
              </div>

              {/* Card */}
              <div className="relative bg-white border border-slate-100 rounded-[28px] shadow-xl shadow-slate-200/60 p-8 overflow-hidden">
                <BorderBeam duration={5} colorFrom="#512B81" colorTo="#a876c4" borderWidth={1.5} />

                {error && (
                  <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
                    {error}
                  </div>
                )}

                {/* ── Step 1 ── */}
                {step === 1 && (
                  <motion.form
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onSubmit={handleStep1}
                    className="space-y-5"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <User className="w-4 h-4 text-[#512B81]" />
                      <h2 className="text-base font-black text-[#1B1B1B]">Suas informações pessoais</h2>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                        Nome completo *
                      </Label>
                      <Input
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Dr. Nome Sobrenome"
                        className="h-12 bg-slate-50 border-slate-100 rounded-xl"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                        Data de nascimento *
                      </Label>
                      <Input
                        type="date"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        max={new Date().toISOString().split('T')[0]}
                        className="h-12 bg-slate-50 border-slate-100 rounded-xl"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                        CPF <span className="text-slate-300 normal-case font-medium">(opcional)</span>
                      </Label>
                      <Input
                        value={cpf}
                        onChange={(e) => setCpf(maskCPF(e.target.value))}
                        placeholder="000.000.000-00"
                        className="h-12 bg-slate-50 border-slate-100 rounded-xl"
                      />
                    </div>

                    <ShimmerButton
                      type="submit"
                      background="#1B1B1B"
                      shimmerColor="rgba(255,255,255,0.15)"
                      className="w-full h-12 text-[13px] uppercase tracking-widest"
                    >
                      Próximo
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </ShimmerButton>

                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => navigate('/worklist')}
                      className="w-full h-10 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-2xl font-bold text-[13px] transition-all"
                    >
                      Completar depois
                    </Button>
                  </motion.form>
                )}

                {/* ── Step 2 ── */}
                {step === 2 && (
                  <motion.form
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onSubmit={handleStep2}
                    className="space-y-5"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <ShieldCheck className="w-4 h-4 text-[#512B81]" />
                      <h2 className="text-base font-black text-[#1B1B1B]">Credenciais e localização</h2>
                    </div>

                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-100 text-amber-700 text-xs font-medium">
                      Seu CRM será validado automaticamente. Sem CRM válido, o acesso à plataforma não é liberado.
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                          CRM *
                        </Label>
                        <Input
                          value={crm}
                          onChange={(e) => setCrm(e.target.value.replace(/\D/g, ''))}
                          placeholder="123456"
                          className="h-12 bg-slate-50 border-slate-100 rounded-xl"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                          UF do CRM *
                        </Label>
                        <select
                          value={crmState}
                          onChange={(e) => setCrmState(e.target.value)}
                          className="w-full h-12 px-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium text-[#1B1B1B] focus:outline-none focus:ring-2 focus:ring-[#512B81]/10"
                        >
                          <option value="">UF</option>
                          {ESTADOS_BR.map((uf) => (
                            <option key={uf} value={uf}>{uf}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                        Cidade de atuação *
                      </Label>
                      <Input
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="São Paulo"
                        className="h-12 bg-slate-50 border-slate-100 rounded-xl"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                        Estado de atuação *
                      </Label>
                      <select
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full h-12 px-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium text-[#1B1B1B] focus:outline-none focus:ring-2 focus:ring-[#512B81]/10"
                      >
                        <option value="">Selecione o estado</option>
                        {ESTADOS_BR.map((uf) => (
                          <option key={uf} value={uf}>{uf}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => { setStep(1); setError(''); }}
                        className="flex-1 h-12 rounded-2xl font-black text-[13px] border-slate-200 text-slate-500"
                        disabled={loading}
                      >
                        Voltar
                      </Button>
                      <ShimmerButton
                        type="submit"
                        disabled={loading}
                        background="#512B81"
                        className="flex-1 h-12 text-[13px] uppercase tracking-wider shadow-lg shadow-purple-200/60"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                            Validando CRM...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="mr-2 w-4 h-4" />
                            Finalizar cadastro
                          </>
                        )}
                      </ShimmerButton>
                    </div>
                  </motion.form>
                )}
              </div>

              <p className="text-center text-[11px] text-slate-400 font-medium mt-6">
                Seus dados são protegidos conforme a LGPD.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </DotBackground>

      {/* Tutorial modal — rendered outside the main card */}
      <TutorialModal
        isOpen={showTutorial}
        onClose={handleTutorialClose}
        onComplete={handleTutorialComplete}
        userName={savedName}
      />
    </>
  );
}
