import React, { useState } from 'react';
import PsychologyAISuggestions from '@/components/PsychologyAISuggestions';
import PsychologyNoteCard from '@/components/PsychologyNoteCard';
import SessionFocusMode from '@/components/SessionFocusMode';
import { AppLayout } from '@/components/AppLayout';
import { Brain, FileText, MessageSquare, Users } from 'lucide-react';

interface PsychologySessionState {
  clientName: string;
  sessionNotes: string;
  sessionDate: string;
  sessionType: string;
  focusMode: boolean;
}

const PsychologyConsultationPage: React.FC = () => {
  const [sessionState, setSessionState] = useState<PsychologySessionState>({
    clientName: 'Ana Silva',
    sessionNotes: 'Sessão inicial de acolhimento. Cliente demonstrou ansiedade em relação ao processo terapêutico.',
    sessionDate: '19/11/2024',
    sessionType: 'individual',
    focusMode: false
  });

  const [activeTab, setActiveTab] = useState<'session' | 'notes' | 'suggestions'>('session');

  const handleStartSession = () => {
    console.log('Starting session');
  };

  const handleEndSession = () => {
    console.log('Ending session');
  };

  const handleFocusToggle = (enabled: boolean) => {
    setSessionState(prev => ({ ...prev, focusMode: enabled }));
  };

  const handleSaveNotes = (notes: string) => {
    console.log('Saving notes:', notes);
    setSessionState(prev => ({ ...prev, sessionNotes: notes }));
  };

  return (
    <AppLayout
      title="Sessão Terapêutica"
      description="Sistema de apoio à prática clínica em psicologia"
    >
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Brain className="text-purple-600" />
              Sessão Terapêutica
            </h1>
            <p className="text-gray-600 mt-1">Sistema de apoio à prática clínica em psicologia</p>
          </div>
        
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
            <Users className="w-4 h-4" />
            {sessionState.clientName}
          </div>
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            {sessionState.sessionDate}
          </div>
        </div>
      </div>

      <SessionFocusMode
        clientName={sessionState.clientName}
        onStartSession={handleStartSession}
        onEndSession={handleEndSession}
        onFocusToggle={handleFocusToggle}
      />

      <div className="flex flex-wrap gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('session')}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
            activeTab === 'session'
              ? 'bg-white border-t border-l border-r border-gray-200 text-purple-700'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <MessageSquare className="w-4 h-4 inline mr-2" />
          Sessão
        </button>
        <button
          onClick={() => setActiveTab('notes')}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
            activeTab === 'notes'
              ? 'bg-white border-t border-l border-r border-gray-200 text-purple-700'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <FileText className="w-4 h-4 inline mr-2" />
          Anotações
        </button>
        <button
          onClick={() => setActiveTab('suggestions')}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg ${
            activeTab === 'suggestions'
              ? 'bg-white border-t border-l border-r border-gray-200 text-purple-700'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Brain className="w-4 h-4 inline mr-2" />
          Sugestões da IA
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
        {activeTab === 'session' && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-800">Andamento da Sessão</h2>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-2">Resumo da Última Sessão</h3>
              <p className="text-blue-700">
                Cliente demonstrou ansiedade em relação ao processo terapêutico. Identificamos pontos de resistência 
                e estabelecemos aliança terapêutica inicial. Tarefa de casa: Diário de sentimentos.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Temas Recorrentes</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 flex-shrink-0"></span>
                    <span>Ansiedade em situações sociais</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 flex-shrink-0"></span>
                    <span>Autocrítica excessiva</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 flex-shrink-0"></span>
                    <span>Dificuldade de assertividade</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Metas em Andamento</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></span>
                    <span>Reconhecer pensamentos distorcidos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></span>
                    <span>Praticar técnicas de relaxamento</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'notes' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Anotações da Sessão</h2>
            <PsychologyNoteCard 
              client={{ 
                name: sessionState.clientName, 
                sessionDate: sessionState.sessionDate, 
                sessionType: sessionState.sessionType 
              }} 
              initialNote={sessionState.sessionNotes} 
              onSave={handleSaveNotes} 
            />
          </div>
        )}

        {activeTab === 'suggestions' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Sugestões da IA</h2>
            <PsychologyAISuggestions 
              clientName={sessionState.clientName} 
              sessionNotes={sessionState.sessionNotes} 
            />
          </div>
        )}
      </div>

        <div className="text-xs text-gray-500 text-center pt-4 border-t border-gray-200">
          Lembrete: A IA é uma ferramenta de apoio. As decisões clínicas permanecem sob responsabilidade exclusiva do psicólogo.
        </div>
      </div>
    </AppLayout>
  );
};

export default PsychologyConsultationPage;