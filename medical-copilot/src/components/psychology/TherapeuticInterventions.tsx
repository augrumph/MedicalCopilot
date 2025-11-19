import { motion } from 'framer-motion';
import { Lightbulb, Brain, Heart, Activity, BookOpen, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface TherapeuticInterventionsProps {
  patientName: string;
}

export function TherapeuticInterventions({ patientName }: TherapeuticInterventionsProps) {
  const interventions = [
    {
      category: 'Reestruturação Cognitiva',
      icon: Brain,
      color: 'from-purple-500 to-purple-700',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      techniques: [
        {
          name: 'Identificação de Pensamentos Automáticos',
          description: 'Auxiliar o paciente a reconhecer pensamentos negativos e distorcidos que surgem automaticamente em situações específicas',
          steps: [
            'Pedir para anotar pensamentos em um diário',
            'Identificar situações gatilho',
            'Questionar a validade dos pensamentos',
            'Buscar evidências a favor e contra',
          ],
          expected: 'Maior consciência sobre padrões de pensamento',
        },
        {
          name: 'Questionamento Socrático',
          description: 'Utilizar perguntas abertas para ajudar o paciente a examinar suas crenças e desenvolver pensamentos mais adaptativos',
          steps: [
            'Questionar evidências para o pensamento',
            'Explorar explicações alternativas',
            'Avaliar consequências do pensamento',
            'Desenvolver pensamentos mais equilibrados',
          ],
          expected: 'Desenvolvimento de pensamento crítico',
        },
      ],
    },
    {
      category: 'Regulação Emocional',
      icon: Heart,
      color: 'from-pink-500 to-pink-700',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200',
      techniques: [
        {
          name: 'Técnicas de Respiração',
          description: 'Ensinar exercícios de respiração para reduzir ansiedade e promover relaxamento',
          steps: [
            'Respiração diafragmática (4-4-4)',
            'Prática de 5 minutos, 2x ao dia',
            'Usar em momentos de ansiedade',
            'Registrar sensações antes e depois',
          ],
          expected: 'Redução de sintomas de ansiedade',
        },
        {
          name: 'Validação Emocional',
          description: 'Reconhecer e validar as emoções do paciente sem julgamento',
          steps: [
            'Nomear e identificar emoções',
            'Normalizar experiências emocionais',
            'Explorar função das emoções',
            'Desenvolver aceitação emocional',
          ],
          expected: 'Maior aceitação e compreensão emocional',
        },
      ],
    },
    {
      category: 'Exposição Gradual',
      icon: Activity,
      color: 'from-orange-500 to-orange-700',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      techniques: [
        {
          name: 'Hierarquia de Ansiedade',
          description: 'Criar lista de situações ansiogênicas ordenadas por nível de desconforto',
          steps: [
            'Listar situações evitadas (0-10)',
            'Começar com situações de nível 3-4',
            'Progredir gradualmente',
            'Celebrar pequenas vitórias',
          ],
          expected: 'Redução progressiva do medo e evitação',
        },
        {
          name: 'Exposição in Vivo',
          description: 'Enfrentar situações temidas de forma gradual e controlada',
          steps: [
            'Planejar exposição com paciente',
            'Definir tempo e contexto',
            'Praticar técnicas de enfrentamento',
            'Processar experiência após exposição',
          ],
          expected: 'Aumento de confiança e redução de evitação',
        },
      ],
    },
    {
      category: 'Habilidades Sociais',
      icon: BookOpen,
      color: 'from-blue-500 to-blue-700',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      techniques: [
        {
          name: 'Treino de Assertividade',
          description: 'Desenvolver capacidade de expressar necessidades e estabelecer limites',
          steps: [
            'Identificar direitos assertivos',
            'Praticar comunicação direta',
            'Usar técnica "disco riscado"',
            'Role-playing de situações difíceis',
          ],
          expected: 'Maior capacidade de auto-expressão',
        },
        {
          name: 'Escuta Ativa',
          description: 'Melhorar qualidade das interações sociais através da escuta empática',
          steps: [
            'Praticar atenção plena na conversa',
            'Parafrasear para confirmar compreensão',
            'Fazer perguntas abertas',
            'Demonstrar interesse genuíno',
          ],
          expected: 'Melhora na qualidade dos relacionamentos',
        },
      ],
    },
  ];

  const homework = [
    'Registrar pensamentos automáticos diariamente (mínimo 3 situações)',
    'Praticar respiração diafragmática 2x ao dia (manhã e noite)',
    'Realizar uma exposição de nível 3-4 da hierarquia',
    'Ler capítulo sobre assertividade no material fornecido',
    'Manter diário de humor e atividades',
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#8C00FF] to-[#450693] flex items-center justify-center">
          <Lightbulb className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-gray-900">Intervenções Terapêuticas Sugeridas</h3>
          <p className="text-sm text-gray-600">Baseadas na abordagem TCC e demandas apresentadas</p>
        </div>
      </div>

      {/* Interventions */}
      <div className="space-y-4">
        {interventions.map((intervention, idx) => {
          const Icon = intervention.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all">
                <CardContent className="p-5">
                  <div className="space-y-4">
                    {/* Category Header */}
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${intervention.color} flex items-center justify-center`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900">{intervention.category}</h4>
                        <p className="text-xs text-gray-500">{intervention.techniques.length} técnicas disponíveis</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Recomendado
                      </Badge>
                    </div>

                    {/* Techniques */}
                    <div className="space-y-3">
                      {intervention.techniques.map((technique, techIdx) => (
                        <div
                          key={techIdx}
                          className={`${intervention.bgColor} border ${intervention.borderColor} rounded-lg p-4`}
                        >
                          <div className="space-y-3">
                            <div>
                              <h5 className="font-semibold text-gray-900 mb-1">{technique.name}</h5>
                              <p className="text-sm text-gray-600">{technique.description}</p>
                            </div>

                            {/* Steps */}
                            <div>
                              <p className="text-xs font-semibold text-gray-700 mb-2">Passos Sugeridos:</p>
                              <ul className="space-y-1.5">
                                {technique.steps.map((step, stepIdx) => (
                                  <li key={stepIdx} className="flex items-start gap-2 text-sm text-gray-700">
                                    <span className="font-bold text-purple-600">{stepIdx + 1}.</span>
                                    <span>{step}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Expected Outcome */}
                            <div className="flex items-start gap-2 bg-white rounded-md p-2 border border-gray-200">
                              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-xs font-semibold text-gray-700">Resultado Esperado:</p>
                                <p className="text-xs text-gray-600">{technique.expected}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Homework */}
      <Card className="border-0 bg-gradient-to-br from-yellow-50 to-orange-50 shadow-md">
        <CardContent className="p-5">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-orange-600" />
              <h4 className="font-bold text-gray-900">Tarefas de Casa Sugeridas</h4>
            </div>
            <ul className="space-y-2">
              {homework.map((task, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                  <span>{task}</span>
                </li>
              ))}
            </ul>
            <div className="pt-2 border-t border-orange-200">
              <p className="text-xs text-gray-600 italic">
                Revisar tarefas com o paciente e ajustar conforme necessário
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
