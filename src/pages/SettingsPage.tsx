import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Brain,
  FileText,
  Stethoscope,
  Shield,
  
  Bell,
  Globe,
  Lock,
  Save,
  ArrowLeft
} from 'lucide-react';
import { AppLayout } from '@/components/AppLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useAppStore } from '@/stores/appStore';
import { motion, } from 'framer-motion';
import { cn } from '@/lib/utils';

function SettingsPage() {
  const navigate = useNavigate();
  const { 
    doctorName, 
    doctorSpecialty, 
    clinicName, 
    clinicAddress, 
    clinicLocation, 
    clinicPhone, 
    clinicEmail,
    setDoctorName,
    setDoctorSpecialty,
    setClinicName,
    setClinicAddress,
    setClinicLocation,
    setClinicPhone,
    setClinicEmail
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'profile' | 'prescription' | 'ai' | 'security' | 'notification' | 'general'>('profile');
  const [crm, setCRM] = useState('123456');
  const [uf, setUF] = useState('SP');

  return (
    <AppLayout>
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        {/* Header com botão de voltar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full border-b border-gray-300 bg-gradient-to-r from-gray-50 to-white py-4 px-4 shadow-sm"
        >
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/dashboard')}
                className="h-10 w-10 hover:bg-gray-100 text-gray-700"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>

              <div>
                <h1 className="text-xl font-bold text-gray-900">Configurações</h1>
                <p className="text-sm text-gray-600">Personalize suas preferências e informações</p>
              </div>
            </div>

            <Button className="bg-gradient-to-r from-[#8C00FF] to-[#450693] text-white hover:opacity-90 shadow-md">
              <Save className="mr-2 h-4 w-4" />
              Salvar Configurações
            </Button>
          </div>
        </motion.div>

        {/* Tabs para navegação */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-7xl mx-auto w-full px-4 py-4"
        >
          <div className="flex gap-2 bg-gray-100 rounded-xl p-1.5 shadow-sm border border-gray-200 overflow-x-auto">
            {[
              { id: 'profile', label: 'Perfil', icon: User },
              { id: 'prescription', label: 'Prescrições', icon: FileText },
              { id: 'ai', label: 'Assistente IA', icon: Brain },
              { id: 'security', label: 'Segurança', icon: Shield },
              { id: 'notification', label: 'Notificações', icon: Bell },
              { id: 'general', label: 'Geral', icon: Globe },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "flex-1 h-10 transition-all font-medium min-w-[120px]",
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-[#8C00FF] to-[#450693] text-white shadow-md hover:opacity-90'
                      : 'text-gray-700 hover:bg-gray-200'
                  )}
                  onClick={() => setActiveTab(tab.id as any)}
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {tab.label}
                </Button>
              );
            })}
          </div>
        </motion.div>

        {/* Conteúdo principal */}
        <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full px-4 pb-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex-1"
          >
            <Card className="flex-1 border-0 shadow-lg">
              <CardContent className="p-6 h-full">
                {/* Aba Perfil */}
                {activeTab === 'profile' && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#8C00FF] to-[#450693] flex items-center justify-center">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">Informações do Médico</h3>
                        <p className="text-sm text-gray-600">Atualize suas informações profissionais</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Nome Completo</label>
                        <Input
                          value={doctorName}
                          onChange={(e) => setDoctorName(e.target.value)}
                          className="bg-gray-50 border-gray-300 focus:ring-2 focus:ring-[#8C00FF] focus:border-transparent"
                          placeholder="Dr. João Pedro da Silva"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Especialidade</label>
                        <Input
                          value={doctorSpecialty}
                          onChange={(e) => setDoctorSpecialty(e.target.value)}
                          className="bg-gray-50 border-gray-300 focus:ring-2 focus:ring-[#8C00FF] focus:border-transparent"
                          placeholder="Clínico Geral"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">CRM</label>
                        <Input
                          value={crm}
                          onChange={(e) => setCRM(e.target.value)}
                          className="bg-gray-50 border-gray-300 focus:ring-2 focus:ring-[#8C00FF] focus:border-transparent"
                          placeholder="123456"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">UF</label>
                        <Input
                          value={uf}
                          onChange={(e) => setUF(e.target.value)}
                          className="bg-gray-50 border-gray-300 focus:ring-2 focus:ring-[#8C00FF] focus:border-transparent"
                          placeholder="SP"
                        />
                      </div>
                    </div>

                    <Separator className="my-6 bg-gray-200" />

                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#0099FF] to-[#0066CC] flex items-center justify-center">
                        <Stethoscope className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">Informações da Clínica</h3>
                        <p className="text-sm text-gray-600">Dados da instituição onde atua</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Nome da Clínica</label>
                        <Input
                          value={clinicName || ''}
                          onChange={(e) => setClinicName(e.target.value)}
                          className="bg-gray-50 border-gray-300 focus:ring-2 focus:ring-[#8C00FF] focus:border-transparent"
                          placeholder="Clínica Médica ABC"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Endereço</label>
                        <Input
                          value={clinicAddress || ''}
                          onChange={(e) => setClinicAddress(e.target.value)}
                          className="bg-gray-50 border-gray-300 focus:ring-2 focus:ring-[#8C00FF] focus:border-transparent"
                          placeholder="Rua Exemplo, 123"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Cidade/UF</label>
                        <Input
                          value={clinicLocation || ''}
                          onChange={(e) => setClinicLocation(e.target.value)}
                          className="bg-gray-50 border-gray-300 focus:ring-2 focus:ring-[#8C00FF] focus:border-transparent"
                          placeholder="São Paulo/SP"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Telefone</label>
                        <Input
                          value={clinicPhone || ''}
                          onChange={(e) => setClinicPhone(e.target.value)}
                          className="bg-gray-50 border-gray-300 focus:ring-2 focus:ring-[#8C00FF] focus:border-transparent"
                          placeholder="(11) 99999-9999"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-sm font-medium text-gray-700 mb-2 block">E-mail</label>
                        <Input
                          value={clinicEmail || ''}
                          onChange={(e) => setClinicEmail(e.target.value)}
                          className="bg-gray-50 border-gray-300 focus:ring-2 focus:ring-[#8C00FF] focus:border-transparent"
                          placeholder="contato@clinicamedica.com.br"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Aba Prescrições */}
                {activeTab === 'prescription' && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">Configurações de Prescrição</h3>
                        <p className="text-sm text-gray-600">Personalize o padrão das suas receitas</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Validade Padrão para Receitas Comuns (dias)</label>
                        <Input
                          type="number"
                          defaultValue="30"
                          className="bg-gray-50 border-gray-300 focus:ring-2 focus:ring-[#8C00FF] focus:border-transparent"
                          placeholder="30"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">Validade Padrão para Antibióticos (dias)</label>
                        <Input
                          type="number"
                          defaultValue="10"
                          className="bg-gray-50 border-gray-300 focus:ring-2 focus:ring-[#8C00FF] focus:border-transparent"
                          placeholder="10"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Orientações Padrão para Pacientes</label>
                      <Textarea
                        className="min-h-[120px] bg-gray-50 border-gray-300 focus:ring-2 focus:ring-[#8C00FF] focus:border-transparent"
                        placeholder="Orientações gerais que aparecem em todas as receitas..."
                        defaultValue="Tomar os medicamentos nos horários indicados. Beber bastante água. Fazer repouso relativo. Em caso de efeitos colaterais, retornar para avaliação médica."
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700 block">Quantidade em Números e por Extenso</label>
                          <p className="text-xs text-gray-500">Para medicamentos controlados</p>
                        </div>
                        <Badge className="bg-[#8C00FF] text-white">Ativado</Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700 block">Receitas Separadas</label>
                          <p className="text-xs text-gray-500">Controlados e comuns em documentos distintos</p>
                        </div>
                        <Badge className="bg-[#8C00FF] text-white">Ativado</Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700 block">Notificação de Farmácia</label>
                          <p className="text-xs text-gray-500">Bloco para preenchimento da farmácia</p>
                        </div>
                        <Badge className="bg-[#8C00FF] text-white">Ativado</Badge>
                      </div>
                    </div>
                  </div>
                )}

                {/* Aba Assistente IA */}
                {activeTab === 'ai' && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#450693] to-[#8C00FF] flex items-center justify-center">
                        <Brain className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">Preferências da IA</h3>
                        <p className="text-sm text-gray-600">Configure como a IA se comporta nas suas consultas</p>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Nível de Detalhamento</label>
                      <div className="grid grid-cols-3 gap-3">
                        {['Curto', 'Médio', 'Longo'].map((level) => (
                          <Button
                            key={level}
                            variant="outline"
                            className="py-3 border-gray-300 hover:bg-gray-50"
                          >
                            {level}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Idioma</label>
                      <div className="grid grid-cols-2 gap-3">
                        {['Português', 'English'].map((lang) => (
                          <Button
                            key={lang}
                            variant="outline"
                            className="py-3 border-gray-300 hover:bg-gray-50"
                          >
                            {lang}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700 block">Sugestões Automáticas</label>
                          <p className="text-xs text-gray-500">Sugerir diagnósticos baseados em sintomas</p>
                        </div>
                        <Badge className="bg-[#8C00FF] text-white">Ativado</Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700 block">Análise de Similaridade</label>
                          <p className="text-xs text-gray-500">Comparar caso com histórico do paciente</p>
                        </div>
                        <Badge className="bg-[#8C00FF] text-white">Ativado</Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <label className="text-sm font-medium text-gray-700 block">Alertas de Interações</label>
                          <p className="text-xs text-gray-500">Verificar interações medicamentosas</p>
                        </div>
                        <Badge className="bg-[#8C00FF] text-white">Ativado</Badge>
                      </div>
                    </div>
                  </div>
                )}

                {/* Aba Segurança */}
                {activeTab === 'security' && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#10B981] to-[#059669] flex items-center justify-center">
                        <Shield className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">Segurança da Conta</h3>
                        <p className="text-sm text-gray-600">Gerencie sua autenticação e segurança</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div>
                          <label className="text-sm font-medium text-gray-700 block">Senha</label>
                          <p className="text-xs text-gray-500">Última alteração: 15/06/2024</p>
                        </div>
                        <Button variant="outline" className="border-gray-300">
                          Alterar Senha
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div>
                          <label className="text-sm font-medium text-gray-700 block">Autenticação de Dois Fatores</label>
                          <p className="text-xs text-gray-500">Proteção adicional para sua conta</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-red-100 text-red-800 border border-red-200">Desativado</Badge>
                          <Button variant="outline" className="border-gray-300">
                            Configurar
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div>
                          <label className="text-sm font-medium text-gray-700 block">Certificado Digital</label>
                          <p className="text-xs text-gray-500">Configurações da assinatura digital</p>
                        </div>
                        <Button variant="outline" className="border-gray-300">
                          Gerenciar
                        </Button>
                      </div>
                    </div>

                    <Separator className="my-6 bg-gray-200" />

                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center">
                        <Lock className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">Política de Acesso</h3>
                        <p className="text-sm text-gray-600">Controles de acesso e permissões</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div>
                          <label className="text-sm font-medium text-gray-700 block">Sessões Ativas</label>
                          <p className="text-xs text-gray-500">Dispositivos conectados à sua conta</p>
                        </div>
                        <Button variant="outline" className="border-gray-300">
                          Ver Sessões
                        </Button>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div>
                          <label className="text-sm font-medium text-gray-700 block">Histórico de Acesso</label>
                          <p className="text-xs text-gray-500">Registros de login e atividade</p>
                        </div>
                        <Button variant="outline" className="border-gray-300">
                          Visualizar
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Aba Notificações */}
                {activeTab === 'notification' && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center">
                        <Bell className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">Notificações</h3>
                        <p className="text-sm text-gray-600">Gerencie como e quando receber notificações</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div>
                          <label className="text-sm font-medium text-gray-700 block">Consultas Agendadas</label>
                          <p className="text-xs text-gray-500">Lembretes de consultas próximas</p>
                        </div>
                        <Badge className="bg-[#8C00FF] text-white">Ativo</Badge>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div>
                          <label className="text-sm font-medium text-gray-700 block">Resultados de Exames</label>
                          <p className="text-xs text-gray-500">Notificações quando resultados estiverem prontos</p>
                        </div>
                        <Badge className="bg-[#8C00FF] text-white">Ativo</Badge>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div>
                          <label className="text-sm font-medium text-gray-700 block">Mensagens de Pacientes</label>
                          <p className="text-xs text-gray-500">Novas mensagens e atualizações</p>
                        </div>
                        <Badge className="bg-[#8C00FF] text-white">Ativo</Badge>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div>
                          <label className="text-sm font-medium text-gray-700 block">Lembretes de Medicamentos</label>
                          <p className="text-xs text-gray-500">Para pacientes com receitas ativas</p>
                        </div>
                        <Badge className="bg-red-100 text-red-800 border border-red-200">Desativado</Badge>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div>
                          <label className="text-sm font-medium text-gray-700 block">Atualizações do Sistema</label>
                          <p className="text-xs text-gray-500">Novos recursos e correções</p>
                        </div>
                        <Badge className="bg-[#8C00FF] text-white">Ativo</Badge>
                      </div>
                    </div>

                    <Separator className="my-6 bg-gray-200" />

                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#6B7280] to-[#374151] flex items-center justify-center">
                        <Globe className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">Canal de Notificação</h3>
                        <p className="text-sm text-gray-600">Escolha como deseja receber notificações</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div>
                          <label className="text-sm font-medium text-gray-700 block">E-mail</label>
                          <p className="text-xs text-gray-500">Notificações por e-mail</p>
                        </div>
                        <Badge className="bg-[#8C00FF] text-white">Ativo</Badge>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div>
                          <label className="text-sm font-medium text-gray-700 block">Push</label>
                          <p className="text-xs text-gray-500">Notificações no aplicativo</p>
                        </div>
                        <Badge className="bg-[#8C00FF] text-white">Ativo</Badge>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div>
                          <label className="text-sm font-medium text-gray-700 block">SMS</label>
                          <p className="text-xs text-gray-500">Notificações por mensagem de texto</p>
                        </div>
                        <Badge className="bg-red-100 text-red-800 border border-red-200">Desativado</Badge>
                      </div>
                    </div>
                  </div>
                )}

                {/* Aba Geral */}
                {activeTab === 'general' && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#6B7280] to-[#374151] flex items-center justify-center">
                        <Globe className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">Configurações Gerais</h3>
                        <p className="text-sm text-gray-600">Preferências gerais da aplicação</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div>
                          <label className="text-sm font-medium text-gray-700 block">Tema da Interface</label>
                          <p className="text-xs text-gray-500">Modo claro ou escuro</p>
                        </div>
                        <Badge className="bg-[#8C00FF] text-white">Claro</Badge>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div>
                          <label className="text-sm font-medium text-gray-700 block">Unidade de Medida</label>
                          <p className="text-xs text-gray-500">Sistema métrico ou imperial</p>
                        </div>
                        <Badge className="bg-[#8C00FF] text-white">Métrico</Badge>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div>
                          <label className="text-sm font-medium text-gray-700 block">Formato de Data</label>
                          <p className="text-xs text-gray-500">DD/MM/AAAA ou MM/DD/AAAA</p>
                        </div>
                        <Badge className="bg-[#8C00FF] text-white">DD/MM/AAAA</Badge>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div>
                          <label className="text-sm font-medium text-gray-700 block">Fuso Horário</label>
                          <p className="text-xs text-gray-500">Horário local</p>
                        </div>
                        <Badge className="bg-[#8C00FF] text-white">GMT-3 (America/Sao_Paulo)</Badge>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div>
                          <label className="text-sm font-medium text-gray-700 block">Idioma do Sistema</label>
                          <p className="text-xs text-gray-500">Idioma da interface</p>
                        </div>
                        <Badge className="bg-[#8C00FF] text-white">Português</Badge>
                      </div>
                    </div>

                    <Separator className="my-6 bg-gray-200" />

                    <div className="flex items-center gap-3 mb-6">
                      <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#EF4444] to-[#DC2626] flex items-center justify-center">
                        <Shield className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg text-gray-900">Privacidade e Dados</h3>
                        <p className="text-sm text-gray-600">Controle de informações e privacidade</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div>
                          <label className="text-sm font-medium text-gray-700 block">Backup Automático</label>
                          <p className="text-xs text-gray-500">Cópias de segurança automáticas</p>
                        </div>
                        <Badge className="bg-[#8C00FF] text-white">Ativo</Badge>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div>
                          <label className="text-sm font-medium text-gray-700 block">Histórico de Consultas</label>
                          <p className="text-xs text-gray-500">Armazenamento e retenção</p>
                        </div>
                        <Badge className="bg-[#8C00FF] text-white">5 anos</Badge>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div>
                          <label className="text-sm font-medium text-gray-700 block">Exportar Dados</label>
                          <p className="text-xs text-gray-500">Exportar todas as informações</p>
                        </div>
                        <Button variant="outline" className="border-gray-300">
                          Exportar
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
}

export { SettingsPage };