import React, { memo } from 'react';
import { User, Calendar, Clock, Target, FileText } from 'lucide-react';

interface PsychologySessionCardProps {
  client: {
    name: string;
    sessionDate: string;
    startTime: string;
    duration: string;
    therapyGoals: string[];
    lastSessionNotes: string;
    progress: string;
    sessionType: string; // individual, couple, family, group
  };
  idx: number;
}

const PsychologySessionCard: React.FC<PsychologySessionCardProps> = ({ client, idx }) => {
  return (
    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 bg-blue-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold">
          {idx + 1}
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2">
            <User className="text-blue-700 w-4 h-4" />
            <p className="font-bold text-blue-800 text-base">{client.name}</p>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
            <div className="flex items-center gap-1">
              <Calendar className="text-blue-600 w-3 h-3" />
              <span className="font-semibold text-blue-700">Data:</span>
              <span className="text-blue-900">{client.sessionDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="text-blue-600 w-3 h-3" />
              <span className="font-semibold text-blue-700">Duração:</span>
              <span className="text-blue-900">{client.duration}</span>
            </div>
          </div>

          <div className="flex items-center gap-1 mt-1">
            <Target className="text-blue-600 w-3 h-3" />
            <span className="font-semibold text-blue-700">Metas:</span>
            <span className="text-blue-900 ml-1">
              {client.therapyGoals.length > 0 ? client.therapyGoals.join(', ') : 'Nenhuma meta definida'}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <FileText className="text-blue-600 w-3 h-3" />
            <span className="font-semibold text-blue-700">Resumo última sessão:</span>
            <span className="text-blue-900 ml-1 line-clamp-2">
              {client.lastSessionNotes || 'Nenhuma sessão anterior registrada'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(PsychologySessionCard);