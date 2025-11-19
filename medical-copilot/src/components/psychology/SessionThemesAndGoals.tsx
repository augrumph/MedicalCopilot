import { motion } from 'framer-motion';
import { Target, MessageSquare, TrendingUp, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SessionThemesAndGoalsProps {
  patientName: string;
}

export function SessionThemesAndGoals({ patientName }: SessionThemesAndGoalsProps) {
  const themes = [
    {
      title: 'Ansiedade Social',
      description: 'Dificuldade em interações sociais e medo de julgamento',
      intensity: 'Alta',
      frequency: 'Recorrente',
      color: 'red',
    },
    {
      title: 'Autocrítica Excessiva',
      description: 'Pensamentos autodestrutivos e baixa autoestima',
      intensity: 'Média',
      frequency: 'Frequente',
      color: 'orange',
    },
    {
      title: 'Dificuldade de Assertividade',
      description: 'Problemas em expressar necessidades e estabelecer limites',
      intensity: 'Média',
      frequency: 'Ocasional',
      color: 'yellow',
    },
  ];

  const goals = [
    {
      title: 'Reconhecer Pensamentos Distorcidos',
      progress: 60,
      status: 'Em Progresso',
      nextSteps: 'Continuar registro diário de pensamentos',
      techniques: ['Reestruturação Cognitiva', 'Diário de Pensamentos'],
    },
    {
      title: 'Praticar Técnicas de Relaxamento',
      progress: 40,
      status: 'Em Progresso',
      nextSteps: 'Introduzir mindfulness e respiração diafragmática',
      techniques: ['Respiração Diafragmática', 'Mindfulness'],
    },
    {
      title: 'Desenvolver Habilidades Sociais',
      progress: 20,
      status: 'Inicial',
      nextSteps: 'Exposição gradual a situações sociais',
      techniques: ['Exposição Gradual', 'Role-playing'],
    },
  ];

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'Alta': return 'bg-red-100 text-red-800 border-red-200';
      case 'Média': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Baixa': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 70) return 'bg-green-500';
    if (progress >= 40) return 'bg-orange-500';
    return 'bg-yellow-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
          <Target className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-gray-900">Temas e Metas Terapêuticas</h3>
          <p className="text-sm text-gray-600">Acompanhamento da evolução do paciente</p>
        </div>
      </div>

      {/* Temas Recorrentes */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="h-5 w-5 text-purple-600" />
          <h4 className="font-semibold text-gray-900">Temas Recorrentes na Sessão</h4>
        </div>
        <div className="space-y-3">
          {themes.map((theme, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="border-0 shadow-md hover:shadow-lg transition-all">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h5 className="font-semibold text-gray-900">{theme.title}</h5>
                        <Badge className={`text-xs ${getIntensityColor(theme.intensity)}`}>
                          {theme.intensity}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{theme.description}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Frequência:</span>
                        <Badge variant="outline" className="text-xs">
                          {theme.frequency}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Metas Terapêuticas */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-purple-600" />
          <h4 className="font-semibold text-gray-900">Metas Terapêuticas em Andamento</h4>
        </div>
        <div className="space-y-3">
          {goals.map((goal, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 + 0.3 }}
            >
              <Card className="border-0 shadow-md hover:shadow-lg transition-all">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h5 className="font-semibold text-gray-900">{goal.title}</h5>
                          <Badge variant="outline" className="text-xs">
                            {goal.status}
                          </Badge>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-purple-600">{goal.progress}%</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${getProgressColor(goal.progress)}`}
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>

                    {/* Next Steps */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-blue-900 mb-1">Próximos Passos</p>
                          <p className="text-xs text-blue-700">{goal.nextSteps}</p>
                        </div>
                      </div>
                    </div>

                    {/* Techniques */}
                    <div>
                      <p className="text-xs font-semibold text-gray-700 mb-2">Técnicas Utilizadas:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {goal.techniques.map((technique, techIdx) => (
                          <Badge key={techIdx} variant="secondary" className="text-xs">
                            {technique}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <Card className="border-0 bg-gradient-to-br from-purple-50 to-blue-50 shadow-md">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-lg bg-purple-500 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="h-4 w-4 text-white" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-2">Recomendações para Próxima Sessão</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-purple-600">•</span>
                  <span>Revisar registro de pensamentos automáticos</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600">•</span>
                  <span>Praticar técnicas de respiração diariamente</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600">•</span>
                  <span>Realizar exposição gradual a situação social leve</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-600">•</span>
                  <span>Manter diário de atividades e humor</span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
