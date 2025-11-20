import React, { useState, memo } from 'react';
import { Moon, Zap, Brain, Clock } from 'lucide-react';

interface SessionFocusModeProps {
  clientName: string;
  onStartSession: () => void;
  onEndSession: () => void;
  onFocusToggle: (enabled: boolean) => void;
}

const SessionFocusMode: React.FC<SessionFocusModeProps> = ({ 
  clientName, 
  onStartSession, 
  onEndSession, 
  onFocusToggle 
}) => {
  const [isActive, setIsActive] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(false);

  const toggleFocusMode = () => {
    const newMode = !isFocusMode;
    setIsFocusMode(newMode);
    onFocusToggle(newMode);
  };

  const startSession = () => {
    setIsActive(true);
    onStartSession();
  };

  const endSession = () => {
    setIsActive(false);
    onEndSession();
  };

  return (
    <div className={`rounded-lg p-4 border transition-all ${
      isActive 
        ? isFocusMode 
          ? 'bg-indigo-50 border-indigo-200' 
          : 'bg-blue-50 border-blue-200'
        : 'bg-gray-50 border-gray-200'
    }`}>
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-bold text-gray-800 flex items-center gap-2">
            {isActive ? <Brain className="w-5 h-5 text-purple-500" /> : <Clock className="w-5 h-5 text-blue-500" />}
            {isActive ? `Sessão com ${clientName}` : `Próxima sessão: ${clientName}`}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            {isActive 
              ? isFocusMode 
                ? 'Modo foco ativado - IA silenciada' 
                : 'Sessão em andamento'
              : 'Aguardando início da sessão'}
          </p>
        </div>

        <div className="flex gap-2">
          {isActive ? (
            <>
              <button
                onClick={toggleFocusMode}
                className={`p-2 rounded-lg flex items-center gap-2 ${
                  isFocusMode
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {isFocusMode ? <Moon className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
              </button>
              <button
                onClick={endSession}
                className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
              >
                Finalizar
              </button>
            </>
          ) : (
            <button
              onClick={startSession}
              className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 flex items-center gap-2"
            >
              <Brain className="w-4 h-4" />
              Iniciar Sessão
            </button>
          )}
        </div>
      </div>

      {isActive && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-600">
            <span>Modo foco: {isFocusMode ? 'Ativado' : 'Desativado'}</span>
            <span>IA: {isFocusMode ? 'Silenciada' : 'Ativa'}</span>
          </div>
          {isFocusMode && (
            <p className="text-xs text-indigo-600 mt-1 italic">
              Alerta: IA desativada para manter foco na escuta terapêutica
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default memo(SessionFocusMode);