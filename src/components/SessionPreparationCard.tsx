import React, { memo} from'react';
import { BookOpen, Lightbulb, AlertCircle, CheckCircle} from'lucide-react';

interface SessionPreparationCardProps {
 client: {
 name: string;
 keyThemes: string[];
 goalsInProgress: string[];
 homework: string[];
 concerns: string[];
 progressNote: string;
};
}

const SessionPreparationCard: React.FC<SessionPreparationCardProps> = ({ client}) => {
 return (
 <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
 <h3 className="font-bold text-gray-800 text-lg mb-3 flex items-center gap-2">
 Preparação para Sessão - {client.name}
 </h3>
 
 <div className="space-y-4">
 {client.keyThemes.length > 0 && (
 <div>
 <h4 className="font-semibold text-gray-700 flex items-center gap-2 mb-2">
 <Lightbulb className="w-4 h-4 text-yellow-500" />
 Temas Recorrentes
 </h4>
 <ul className="space-y-1">
 {client.keyThemes.map((theme, index) => (
 <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
 <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full mt-1.5 flex-shrink-0"></span>
 {theme}
 </li>
 ))}
 </ul>
 </div>
 )}

 {client.goalsInProgress.length > 0 && (
 <div>
 <h4 className="font-semibold text-gray-700 flex items-center gap-2 mb-2">
 <CheckCircle className="w-4 h-4 text-green-500" />
 Metas em Andamento
 </h4>
 <ul className="space-y-1">
 {client.goalsInProgress.map((goal, index) => (
 <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
 <span className="w-1.5 h-1.5 bg-green-400 rounded-full mt-1.5 flex-shrink-0"></span>
 {goal}
 </li>
 ))}
 </ul>
 </div>
 )}

 {client.homework.length > 0 && (
 <div>
 <h4 className="font-semibold text-gray-700 flex items-center gap-2 mb-2">
 <BookOpen className="w-4 h-4 text-blue-500" />
 Tarefas de Casa
 </h4>
 <ul className="space-y-1">
 {client.homework.map((task, index) => (
 <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
 <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 flex-shrink-0"></span>
 {task}
 </li>
 ))}
 </ul>
 </div>
 )}

 {client.concerns.length > 0 && (
 <div>
 <h4 className="font-semibold text-gray-700 flex items-center gap-2 mb-2">
 <AlertCircle className="w-4 h-4 text-red-500" />
 Preocupações / Pontos de Atenção
 </h4>
 <ul className="space-y-1">
 {client.concerns.map((concern, index) => (
 <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
 <span className="w-1.5 h-1.5 bg-red-400 rounded-full mt-1.5 flex-shrink-0"></span>
 {concern}
 </li>
 ))}
 </ul>
 </div>
 )}

 {client.progressNote && (
 <div className="pt-2 border-t border-gray-100">
 <h4 className="font-semibold text-gray-700 mb-2">Resumo da Última Sessão</h4>
 <p className="text-sm text-gray-600 italic">{client.progressNote}</p>
 </div>
 )}
 </div>

 <div className="mt-4 text-xs text-gray-500">
 Lembrete: Este resumo é apenas uma orientação. A sessão deve permanecer aberta e adaptável à escuta ativa.
 </div>
 </div>
 );
};

export default memo(SessionPreparationCard);