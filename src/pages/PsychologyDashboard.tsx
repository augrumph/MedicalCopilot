import React, { useState } from 'react';
import PsychologyClientCard from '@/components/PsychologyClientCard';
import PsychologySessionCard from '@/components/PsychologySessionCard';
import SessionPreparationCard from '@/components/SessionPreparationCard';
import PsychologyNoteCard from '@/components/PsychologyNoteCard';
import PsychologicalDocumentationCard from '@/components/PsychologicalDocumentationCard';
import PsychologyAISuggestions from '@/components/PsychologyAISuggestions';
import SessionFocusMode from '@/components/SessionFocusMode';
import { AppLayout } from '@/components/AppLayout';
import { Brain, Users, Calendar, FileText, Target } from 'lucide-react';

// Mock data for demonstration
const mockClients = [
  {
    id: '1',
    name: 'Ana Silva',
    age: 32,
    therapyStartDate: '15/03/2024',
    therapyGoals: ['Melhorar autoestima', 'Reduzir ansiedade em situações sociais'],
    lastSession: '10/11/2024',
    sessionFrequency: 'Semanal',
    therapeuticApproach: 'TCC',
    riskLevel: 'low' as const,
    status: 'active' as const
  },
  {
    id: '2',
    name: 'Carlos Oliveira',
    age: 45,
    therapyStartDate: '02/05/2024',
    therapyGoals: ['Lidar com estresse no trabalho', 'Melhorar comunicação interpessoal'],
    lastSession: '08/11/2024',
    sessionFrequency: 'Semanal',
    therapeuticApproach: 'Psicodinâmica',
    riskLevel: 'medium' as const,
    status: 'active' as const
  },
  {
    id: '3',
    name: 'Mariana Costa',
    age: 28,
    therapyStartDate: '20/06/2024',
    therapyGoals: ['Processar luto', 'Reconstituir rotina saudável'],
    lastSession: '12/11/2024',
    sessionFrequency: 'Quinzenal',
    therapeuticApproach: 'Humanista',
    riskLevel: 'low' as const,
    status: 'active' as const
  }
];

const mockSessions = [
  {
    name: 'Ana Silva',
    sessionDate: '19/11/2024',
    startTime: '14:00',
    duration: '50 min',
    therapyGoals: ['Ansiedade social', 'Autoestima'],
    lastSessionNotes: 'Cliente mostrou avanços na identificação de pensamentos distorcidos',
    progress: 'Melhora gradual na confiança',
    sessionType: 'individual'
  },
  {
    name: 'Carlos Oliveira',
    sessionDate: '20/11/2024',
    startTime: '10:00',
    duration: '50 min',
    therapyGoals: ['Estresse no trabalho'],
    lastSessionNotes: 'Focado em técnicas de respiração e mindfulness',
    progress: 'Boa adesão às práticas sugeridas',
    sessionType: 'individual'
  }
];

const mockPreparationData = {
  name: 'Ana Silva',
  keyThemes: ['Ansiedade em situações sociais', 'Autocrítica excessiva', 'Dificuldade de assertividade'],
  goalsInProgress: ['Reconhecer pensamentos distorcidos', 'Praticar técnicas de relaxamento'],
  homework: ['Exercício de exposição gradual a situações sociais', 'Diário de pensamentos'],
  concerns: ['Baixa autoestima persistente', 'Recaídas em momentos de estresse'],
  progressNote: 'Cliente mostrou-se mais aberta e participativa. Identificou progresso na consciência dos pensamentos autodestrutivos.'
};

const PsychologyDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'today' | 'clients' | 'preparation' | 'notes' | 'documents'>('today');
  const [selectedClient, setSelectedClient] = useState<string | null>(null);

  const handleStartSession = (clientId: string) => {
    setSelectedClient(clientId);
    setActiveTab('preparation');
  };

  const handleEndSession = () => {
    setSelectedClient(null);
  };

  return (
    <AppLayout
      title="Dashboard de Psicologia"
      description="Sistema de apoio à prática clínica em psicologia"
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center gap-3 tracking-tight">
              <Brain className="text-purple-600 h-8 w-8 md:h-10 md:w-10" />
              Dashboard de Psicologia
            </h1>
            <p className="text-gray-600 mt-2 text-lg font-medium">Sistema de apoio à prática clínica em psicologia</p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Clientes Ativos</p>
                <p className="text-2xl font-bold text-gray-900">{mockClients.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Sessões Hoje</p>
                <p className="text-2xl font-bold text-gray-900">{mockSessions.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Metas em Andamento</p>
                <p className="text-2xl font-bold text-gray-900">
                  {mockClients.reduce((sum, client) => sum + client.therapyGoals.length, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="bg-yellow-100 p-2 rounded-lg">
                <FileText className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Próximas Sessões</p>
                <p className="text-2xl font-bold text-gray-900">5</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('today')}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg ${activeTab === 'today'
              ? 'bg-white border-t border-l border-r border-gray-200 text-purple-700'
              : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            Hoje
          </button>
          <button
            onClick={() => setActiveTab('clients')}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg ${activeTab === 'clients'
              ? 'bg-white border-t border-l border-r border-gray-200 text-purple-700'
              : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            Clientes
          </button>
          <button
            onClick={() => setActiveTab('preparation')}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg ${activeTab === 'preparation'
              ? 'bg-white border-t border-l border-r border-gray-200 text-purple-700'
              : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            Preparação
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg ${activeTab === 'notes'
              ? 'bg-white border-t border-l border-r border-gray-200 text-purple-700'
              : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            Anotações
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg ${activeTab === 'documents'
              ? 'bg-white border-t border-l border-r border-gray-200 text-purple-700'
              : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            Documentos
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
          {activeTab === 'today' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Sessões de Hoje</h2>

              <div className="space-y-4">
                {mockSessions.map((session, index) => (
                  <PsychologySessionCard
                    key={index}
                    client={session}
                    idx={index}
                  />
                ))}
              </div>

              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Modo Sessão</h2>
                <SessionFocusMode
                  clientName="Ana Silva"
                  onStartSession={() => handleStartSession('1')}
                  onEndSession={handleEndSession}
                  onFocusToggle={() => { }}
                />
              </div>
            </div>
          )}

          {activeTab === 'clients' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight">Meus Clientes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockClients.map((client) => (
                  <PsychologyClientCard key={client.id} client={client} />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'preparation' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Preparação da Sessão</h2>
              <SessionPreparationCard client={mockPreparationData} />
            </div>
          )}

          {activeTab === 'notes' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Anotações de Sessão</h2>
              <PsychologyNoteCard
                client={{
                  name: selectedClient ? mockClients.find(c => c.id === selectedClient)?.name || 'Cliente' : 'Cliente',
                  sessionDate: '19/11/2024',
                  sessionType: 'individual'
                }}
                initialNote={selectedClient ? `Sessão com ${mockClients.find(c => c.id === selectedClient)?.name || 'Cliente'}` : ''}
              />

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Sugestões da IA</h3>
                <PsychologyAISuggestions
                  clientName={selectedClient ? mockClients.find(c => c.id === selectedClient)?.name || 'Cliente' : 'Cliente'}
                  sessionNotes={selectedClient ? `Sessão com ${mockClients.find(c => c.id === selectedClient)?.name || 'Cliente'}` : ''}
                />
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Documentos Psicológicos</h2>
              <PsychologicalDocumentationCard
                clientName={selectedClient ? mockClients.find(c => c.id === selectedClient)?.name || 'Cliente' : 'Cliente'}
                onGenerate={() => { }}
              />
            </div>
          )}
        </div>

        <div className="text-xs text-gray-500 text-center pt-4 border-t border-gray-200">
          Sistema de apoio clínico em psicologia. As decisões clínicas permanecem sob responsabilidade exclusiva do psicólogo.
        </div>
      </div>
    </AppLayout>
  );
};

export default PsychologyDashboard;