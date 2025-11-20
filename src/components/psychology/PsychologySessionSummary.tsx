import { Brain, Target, CheckCircle2, AlertCircle, TrendingUp, MessageSquare } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PsychologySessionSummaryProps {
  patientName: string;
  lastSessionDate?: string;
  daysSinceLastSession?: number;
}

export function PsychologySessionSummary({
  lastSessionDate,
  daysSinceLastSession
}: PsychologySessionSummaryProps) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900">Resumo da Última Sessão</h3>
            <p className="text-sm text-gray-600">
              {lastSessionDate && `${new Date(lastSessionDate).toLocaleDateString('pt-BR')} • `}
              {daysSinceLastSession && `${daysSinceLastSession}d atrás`}
            </p>
          </div>
        </div>
        <Badge className="bg-green-100 text-green-800 border-green-200">
          Ativo
        </Badge>
      </div>

      {/* Demanda/Queixa Principal */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-purple-600" />
              <h4 className="font-semibold text-gray-900">Demanda da Sessão</h4>
            </div>
            <p className="text-sm text-gray-700">
              Ansiedade relacionada a situações sociais, principalmente em ambiente de trabalho.
              Relato de evitação de reuniões e apresentações.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Temas Trabalhados */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-purple-600" />
              <h4 className="font-semibold text-gray-900">Temas Trabalhados</h4>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-xs">
                Ansiedade Social
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Pensamentos Automáticos
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Assertividade
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Intervenções Realizadas */}
      <Card className="border-0 shadow-md">
        <CardContent className="p-4">
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 text-sm">Intervenções Realizadas</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Reestruturação cognitiva de pensamentos distorcidos sobre julgamento</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Ensino de técnica de respiração diafragmática para manejo de ansiedade</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Psicoeducação sobre Transtorno de Ansiedade Social</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Tarefas de Casa */}
      <Card className="border-0 bg-orange-50 shadow-md">
        <CardContent className="p-4">
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900 text-sm">Tarefas Solicitadas</h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <div className="h-4 w-4 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="h-2 w-2 rounded-full bg-orange-500" />
                </div>
                <span>Registrar pensamentos automáticos em situações sociais (3x/dia)</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <div className="h-4 w-4 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="h-2 w-2 rounded-full bg-orange-500" />
                </div>
                <span>Praticar respiração diafragmática 2x ao dia</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <div className="h-4 w-4 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="h-2 w-2 rounded-full bg-orange-500" />
                </div>
                <span>Exposição gradual: conversa breve com colega de trabalho</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Perguntar ao Paciente */}
      <Card className="border-0 bg-blue-50 shadow-md">
        <CardContent className="p-4">
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-900">Perguntar Hoje</h4>
            <p className="text-xs text-gray-600 mb-3">
              Baseado na sessão anterior e tarefas propostas
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-3 text-sm text-gray-700">
                <span className="font-semibold text-blue-600 flex-shrink-0">1</span>
                <span>Como foi a prática de registro de pensamentos? Conseguiu identificar padrões?</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-gray-700">
                <span className="font-semibold text-blue-600 flex-shrink-0">2</span>
                <span>Praticou as técnicas de respiração? Percebeu redução da ansiedade?</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-gray-700">
                <span className="font-semibold text-blue-600 flex-shrink-0">3</span>
                <span>Conseguiu realizar a exposição (conversa breve)? Como foi a experiência?</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-gray-700">
                <span className="font-semibold text-blue-600 flex-shrink-0">4</span>
                <span>Houve alguma situação de ansiedade intensa na semana? Como manejou?</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Progresso e Alertas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-0 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <h4 className="font-semibold text-gray-900 text-sm">Progresso</h4>
            </div>
            <p className="text-xs text-gray-600 mb-2">Desde o início do tratamento</p>
            <ul className="space-y-1">
              <li className="text-xs text-gray-700">
                • Maior consciência sobre padrões de pensamento
              </li>
              <li className="text-xs text-gray-700">
                • Redução de 40% na evitação social
              </li>
              <li className="text-xs text-gray-700">
                • Melhora na qualidade do sono
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-0 bg-red-50 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <h4 className="font-semibold text-gray-900 text-sm">Pontos de Atenção</h4>
            </div>
            <ul className="space-y-1">
              <li className="text-xs text-gray-700">
                • Relato de pico de ansiedade na última semana
              </li>
              <li className="text-xs text-gray-700">
                • Dificuldade em realizar algumas exposições
              </li>
              <li className="text-xs text-gray-700">
                • Considerar avaliação psiquiátrica se não houver melhora
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Próximos Passos */}
      <Card className="border-0 bg-gradient-to-br from-purple-50 to-blue-50 shadow-md">
        <CardContent className="p-4">
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900">Focos para Esta Sessão</h4>
            <ul className="space-y-1.5">
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-purple-600">→</span>
                <span>Revisar registro de pensamentos e identificar distorções cognitivas</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-purple-600">→</span>
                <span>Avançar na hierarquia de exposições (próximo nível)</span>
              </li>
              <li className="flex items-start gap-2 text-sm text-gray-700">
                <span className="text-purple-600">→</span>
                <span>Trabalhar assertividade e estabelecimento de limites</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
