import React, { memo } from 'react';
import { TrendingUp, Heart, Calendar, AlertTriangle, Target } from 'lucide-react';

interface TherapyProgressCardProps {
  client: {
    name: string;
    progress: string;
    sessionCount: number;
    goalsAchieved: number;
    totalGoals: number;
    lastSessionDate: string;
    riskLevel?: 'low' | 'medium' | 'high';
    therapeuticApproach: string;
  };
}

const TherapyProgressCard: React.FC<TherapyProgressCardProps> = ({ client }) => {
  const getRiskColor = (risk: string = 'low') => {
    switch (risk) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      default: return 'text-green-600';
    }
  };

  const getRiskBg = (risk: string = 'low') => {
    switch (risk) {
      case 'high': return 'bg-red-50 border-red-200';
      case 'medium': return 'bg-yellow-50 border-yellow-200';
      default: return 'bg-green-50 border-green-200';
    }
  };

  return (
    <div className={`rounded-lg p-4 border ${getRiskBg(client.riskLevel)} transition-all`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-500" />
            {client.name}
          </h3>
          <p className="text-gray-600 text-sm mt-1">{client.therapeuticApproach} approach</p>
        </div>
        
        {client.riskLevel && (
          <div className={`flex items-center gap-1 ${getRiskColor(client.riskLevel)}`}>
            <AlertTriangle className={`w-4 h-4 ${getRiskColor(client.riskLevel)}`} />
            <span className="text-xs font-semibold uppercase">
              Risco {client.riskLevel}
            </span>
          </div>
        )}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="bg-white rounded p-2 text-center">
          <TrendingUp className="w-4 h-4 mx-auto text-blue-500" />
          <p className="text-xs text-gray-600 mt-1">Sessões</p>
          <p className="font-bold text-gray-800">{client.sessionCount}</p>
        </div>
        
        <div className="bg-white rounded p-2 text-center">
          <Target className="w-4 h-4 mx-auto text-green-500" />
          <p className="text-xs text-gray-600 mt-1">Metas</p>
          <p className="font-bold text-gray-800">{client.goalsAchieved}/{client.totalGoals}</p>
        </div>
        
        <div className="bg-white rounded p-2 text-center">
          <Calendar className="w-4 h-4 mx-auto text-purple-500" />
          <p className="text-xs text-gray-600 mt-1">Última</p>
          <p className="font-bold text-gray-800 text-xs">{client.lastSessionDate}</p>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-200">
        <p className="text-sm text-gray-700">
          <span className="font-semibold">Progresso:</span> {client.progress}
        </p>
      </div>
    </div>
  );
};

export default memo(TherapyProgressCard);