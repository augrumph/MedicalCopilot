import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar, User, CheckCircle2 } from 'lucide-react';

interface ConsentLog {
  id: string;
  date: string;
  time: string;
  patientName: string;
  action: string;
  ip: string;
}

export function ConsentLogs() {
  // Mock data - em produção, isso viria do backend
  const [logs] = useState<ConsentLog[]>([
    {
      id: '1',
      date: '30/11/2025',
      time: '09:40',
      patientName: 'Carla Silva',
      action: 'Consentimento Verbal Registrado',
      ip: '192.168.1.45'
    },
    {
      id: '2',
      date: '30/11/2025',
      time: '10:15',
      patientName: 'João Santos',
      action: 'Consentimento Verbal Registrado',
      ip: '192.168.1.45'
    },
    {
      id: '3',
      date: '29/11/2025',
      time: '14:30',
      patientName: 'Maria Oliveira',
      action: 'Consentimento Verbal Registrado',
      ip: '192.168.1.45'
    },
    {
      id: '4',
      date: '29/11/2025',
      time: '15:45',
      patientName: 'Pedro Costa',
      action: 'Consentimento Verbal Registrado',
      ip: '192.168.1.45'
    },
    {
      id: '5',
      date: '28/11/2025',
      time: '09:00',
      patientName: 'Ana Paula',
      action: 'Consentimento Verbal Registrado',
      ip: '192.168.1.45'
    },
  ]);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Logs de Consentimento</h2>
        <p className="text-sm text-gray-600 mb-4">
          Registro de todos os consentimentos verbais obtidos para gravação de consultas
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-xs text-gray-700">
          <strong>Nota Legal:</strong> Estes logs são mantidos por 6 meses para fins de auditoria e conformidade
          com o Marco Civil da Internet (Lei 12.965/2014). O registro do consentimento verbal é uma boa prática
          recomendada para proteção do profissional.
        </p>
      </div>

      <ScrollArea className="h-[400px] rounded-lg border border-gray-200 p-4 bg-gray-50">
        <div className="space-y-3">
          {logs.map((log) => (
            <div
              key={log.id}
              className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="mt-1">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-bold text-gray-900">
                        {log.date} às {log.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-700">
                        Paciente: <strong>{log.patientName}</strong>
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-100 text-green-700 border-green-200">
                        {log.action}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-500">IP: {log.ip}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-xs text-gray-600">
          <strong>Total de registros:</strong> {logs.length} consentimentos nos últimos 3 dias
        </p>
      </div>
    </div>
  );
}
