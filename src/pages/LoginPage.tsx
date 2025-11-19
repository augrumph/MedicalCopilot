import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppStore } from '@/stores/appStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const login = useAppStore(state => state.login);
  const isAuthenticated = useAppStore(state => state.isAuthenticated);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const validateForm = () => {
    let isValid = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
      setEmailError('Email é obrigatório');
      isValid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Email inválido');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (!password) {
      setPasswordError('Senha é obrigatória');
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError('Senha deve ter pelo menos 6 caracteres');
      isValid = false;
    } else {
      setPasswordError('');
    }

    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // Login instantâneo sem delay
      login(email, password);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -left-40 w-80 h-80 rounded-full bg-primary/20 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 w-80 h-80 rounded-full bg-accent/20 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>

      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left Side - Branding */}
        <motion.div
          className="hidden lg:block space-y-8"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl gradient-purple flex items-center justify-center shadow-lg shadow-primary/50">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-primary">
                  Medical Copilot
                </h1>
                <p className="text-sm text-primary/80">AI-Powered Healthcare Assistant</p>
              </div>
            </div>
          </div>

          <div className="space-y-6 pt-8">
            <motion.div
              className="flex items-start gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Assistência IA em Tempo Real</h3>
                <p className="text-muted-foreground">
                  Obtenha sugestões e análises instantâneas durante suas consultas
                </p>
              </div>
            </motion.div>

            <motion.div
              className="flex items-start gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                <Activity className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Gestão Inteligente de Pacientes</h3>
                <p className="text-muted-foreground">
                  Organize e acesse históricos médicos de forma eficiente
                </p>
              </div>
            </motion.div>

            <motion.div
              className="flex items-start gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="w-10 h-10 rounded-lg bg-chart-3/10 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-chart-3" />
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">Insights Baseados em Dados</h3>
                <p className="text-muted-foreground">
                  Tome decisões informadas com análises avançadas
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Right Side - Login Form */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full"
        >
          <Card className="border-border/50 shadow-2xl backdrop-blur-sm">
            <CardHeader className="space-y-1 pb-6">
              <div className="lg:hidden flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl gradient-purple flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-2xl text-primary">Medical Copilot</CardTitle>
              </div>
              <CardTitle className="text-2xl lg:text-3xl">Bem-vindo de volta</CardTitle>
              <CardDescription className="text-base">
                Entre com suas credenciais para acessar o sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError(''); // Clear error when user starts typing
                    }}
                    className={`h-11 ${emailError ? 'border-red-500' : ''}`}
                    required
                  />
                  {emailError && (
                    <p className="text-red-500 text-sm">{emailError}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Senha
                    </Label>
                    <button
                      type="button"
                      className="text-sm text-primary hover:text-primary/80 transition-colors"
                    >
                      Esqueceu a senha?
                    </button>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (passwordError) setPasswordError(''); // Clear error when user starts typing
                    }}
                    className={`h-11 ${passwordError ? 'border-red-500' : ''}`}
                    required
                  />
                  {passwordError && (
                    <p className="text-red-500 text-sm">{passwordError}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 text-base font-semibold gradient-purple"
                  size="lg"
                >
                  Entrar
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>

                <div className="text-center pt-4">
                  <p className="text-sm text-muted-foreground">
                    Não tem uma conta?{' '}
                    <button
                      type="button"
                      className="text-primary hover:text-primary/80 font-medium transition-colors"
                    >
                      Criar conta
                    </button>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Demo Info */}
          <motion.div
            className="mt-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 backdrop-blur-sm border border-border/50">
              <Sparkles className="w-4 h-4 text-primary" />
              <p className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">Demo:</span> Use qualquer email para entrar
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
