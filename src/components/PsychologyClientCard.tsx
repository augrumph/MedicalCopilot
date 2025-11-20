import React, { memo } from 'react';
import { Calendar, Clock, FileText, Heart, AlertTriangle } from 'lucide-react';

interface PsychologyClientCardProps {
  client: {
    id: string;
    name: string;
    age: number;
    therapyStartDate: string;
    therapyGoals: string[];
    lastSession: string;
    sessionFrequency: string; // weekly, biweekly, monthly
    therapeuticApproach: string;
    riskLevel?: 'low' | 'medium' | 'high';
    status: 'active' | 'paused' | 'completed';
  };
}

const PsychologyClientCard: React.FC<PsychologyClientCardProps> = ({ client }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk: string = 'low') => {
    switch (risk) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      default: return 'text-green-600';
    }
  };

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-3">
          <div className="bg-blue-100 text-blue-800 rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold">
            {client.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-base">{client.name}, {client.age} anos</h3>
            <p className="text-gray-600 text-sm">{client.therapeuticApproach}</p>
          </div>
        </div>
        
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(client.status)}`}>
          {client.status === 'active' ? 'Ativo' : client.status === 'paused' ? 'Pausado' : 'Concluído'}
        </span>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-gray-600">
            <Calendar className="w-3 h-3" />
            <span>Início:</span>
          </div>
          <span className="font-medium text-gray-800">{client.therapyStartDate}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-gray-600">
            <Clock className="w-3 h-3" />
            <span>Frequência:</span>
          </div>
          <span className="font-medium text-gray-800">{client.sessionFrequency}</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-gray-600">
            <FileText className="w-3 h-3" />
            <span>Última sessão:</span>
          </div>
          <span className="font-medium text-gray-800">{client.lastSession}</span>
        </div>

        {client.riskLevel && (
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-gray-600">
              <AlertTriangle className={`w-3 h-3 ${getRiskColor(client.riskLevel)}`} />
              <span>Risco:</span>
            </div>
            <span className={`font-medium capitalize ${getRiskColor(client.riskLevel)}`}>
              {client.riskLevel}
            </span>
          </div>
        )}
      </div>

      {client.therapyGoals.length > 0 && (
        <div className="mt-4">
          <h4 className="font-semibold text-gray-700 text-sm flex items-center gap-1 mb-1">
            <Heart className="w-3 h-3 text-pink-500" />
            Metas Terapêuticas
          </h4>
          <ul className="space-y-1">
            {client.therapyGoals.slice(0, 2).map((goal, index) => (
              <li key={index} className="text-xs text-gray-600 truncate">
                • {goal}
              </li>
            ))}
            {client.therapyGoals.length > 2 && (
              <li className="text-xs text-gray-500">
                +{client.therapyGoals.length - 2} meta{client.therapyGoals.length - 2 > 1 ? 's' : ''}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default memo(PsychologyClientCard);