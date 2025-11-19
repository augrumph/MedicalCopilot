import { motion } from 'framer-motion';
import { Lightbulb, Brain, AlertTriangle, CheckCircle2, TrendingUp, FileText, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PsychologyClinicalHypothesisProps {
  patientName: string;
}

export function PsychologyClinicalHypothesis({ patientName }: PsychologyClinicalHypothesisProps) {
  const hypotheses = [
    {
      category: 'Mais Provável',
      color: 'green',
      gradient: 'from-green-500 to-green-700',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      items: [
        {
          condition: 'Transtorno de Ansiedade Social (TAS)',
          explanation: 'Medo persistente e acentuado de situações sociais ou de desempenho, com evitação significativa e prejuízo funcional',
          evidence: [
            'Relato de ansiedade intensa em interações sociais',
            'Medo de julgamento negativo pelos outros',
            'Evitação de situações sociais',
            'Sintomas físicos (taquicardia, sudorese) em contextos sociais',
            'Prejuízo em área acadêmica/profissional',
          ],
          supportingFactors: [
            'Início na adolescência (padrão típico)',
            'Curso crônico com flutuações',
            'Resposta positiva à abordagem TCC',
          ],
          differentialConsiderations: [
            'Descartar Fobia Específica (sintomas restritos a situações específicas)',
            'Diferenciar de Timidez Normal (sem prejuízo significativo)',
          ],
          severity: 'Moderada',
          references: [
            'DSM-5: Transtorno de Ansiedade Social',
            'Literatura: CBT for Social Anxiety Disorder',
            'Escalas: LSAS (Liebowitz Social Anxiety Scale)',
          ],
        },
      ],
    },
    {
      category: 'A Considerar',
      color: 'yellow',
      gradient: 'from-yellow-500 to-yellow-700',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      items: [
        {
          condition: 'Transtorno de Ansiedade Generalizada (TAG)',
          explanation: 'Ansiedade e preocupação excessivas sobre diversos eventos ou atividades, difíceis de controlar',
          evidence: [
            'Preocupações excessivas relatadas',
            'Dificuldade de concentração',
            'Tensão muscular frequente',
            'Inquietação reportada',
          ],
          supportingFactors: [
            'Sintomas presentes há mais de 6 meses',
            'Prejuízo em múltiplas áreas da vida',
          ],
          differentialConsiderations: [
            'Preocupações são primariamente sociais (mais compatível com TAS)',
            'Avaliar se há ansiedade em situações não-sociais',
          ],
          severity: 'Leve a Moderada',
          references: [
            'DSM-5: Transtorno de Ansiedade Generalizada',
            'Escala: GAD-7',
          ],
        },
        {
          condition: 'Transtorno Depressivo com Ansiedade',
          explanation: 'Presença de sintomas depressivos associados a sintomas ansiosos significativos',
          evidence: [
            'Humor deprimido em algumas situações',
            'Autocrítica excessiva (possível baixa autoestima)',
            'Anedonia social reportada',
          ],
          supportingFactors: [
            'Comorbidade comum com transtornos de ansiedade',
            'Sintomas podem ser secundários à ansiedade social',
          ],
          differentialConsiderations: [
            'Avaliar se humor deprimido é reativo à ansiedade social',
            'Investigar sintomas neurovegetativos de depressão',
          ],
          severity: 'Leve',
          references: [
            'DSM-5: Transtorno Depressivo Maior',
            'Escala: PHQ-9, BDI-II',
          ],
        },
      ],
    },
    {
      category: 'Menos Provável',
      color: 'blue',
      gradient: 'from-blue-500 to-blue-700',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      items: [
        {
          condition: 'Transtorno da Personalidade Evitativa',
          explanation: 'Padrão invasivo de inibição social, sentimentos de inadequação e hipersensibilidade a avaliações negativas',
          evidence: [
            'Evitação de situações sociais',
            'Sentimentos de inadequação',
          ],
          supportingFactors: [
            'Padrão de longa data',
          ],
          differentialConsiderations: [
            'Diferença: TP Evitativa é mais pervasiva e rígida',
            'TAS pode ter início mais circunscrito',
            'Avaliar padrão desde início da idade adulta',
          ],
          severity: 'A avaliar',
          references: [
            'DSM-5: Transtorno da Personalidade Evitativa',
            'SCID-II para avaliação',
          ],
        },
      ],
    },
  ];

  const recommendations = [
    {
      icon: FileText,
      title: 'Avaliação Complementar',
      items: [
        'Aplicar LSAS (Liebowitz Social Anxiety Scale)',
        'Aplicar GAD-7 para ansiedade generalizada',
        'Aplicar PHQ-9 para sintomas depressivos',
        'Investigar histórico familiar de transtornos de ansiedade',
      ],
    },
    {
      icon: TrendingUp,
      title: 'Plano de Tratamento',
      items: [
        'TCC focada em ansiedade social (protocolo de 12-16 sessões)',
        'Reestruturação cognitiva de pensamentos distorcidos',
        'Exposição gradual a situações sociais',
        'Treino de habilidades sociais e assertividade',
      ],
    },
    {
      icon: Users,
      title: 'Considerações de Encaminhamento',
      items: [
        'Avaliar necessidade de avaliação psiquiátrica (se sintomas graves)',
        'Considerar grupos terapêuticos para habilidades sociais',
        'Avaliação neuropsicológica se houver queixas cognitivas',
      ],
    },
  ];

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'Grave':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Moderada':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Leve':
      case 'Leve a Moderada':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (color: string) => {
    switch (color) {
      case 'green':
        return <CheckCircle2 className="h-5 w-5 text-white" />;
      case 'yellow':
        return <AlertTriangle className="h-5 w-5 text-white" />;
      default:
        return <Brain className="h-5 w-5 text-white" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#FFC400] to-[#FF9500] flex items-center justify-center">
          <Lightbulb className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-lg text-gray-900">Hipóteses Clínicas</h3>
          <p className="text-sm text-gray-600">Análise baseada em evidências clínicas e relato do paciente</p>
        </div>
      </div>

      {/* Disclaimer */}
      <Card className="border-0 bg-blue-50 border-l-4 border-l-blue-500 shadow-sm">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Brain className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm text-blue-900 font-semibold mb-1">Importante</p>
              <p className="text-xs text-blue-700">
                Estas hipóteses são baseadas nas informações apresentadas até o momento e devem ser
                refinadas com avaliação mais aprofundada. Sempre considere o contexto individual do paciente.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hypotheses */}
      {hypotheses.map((category, catIdx) => (
        <div key={catIdx} className="space-y-3">
          <div className="flex items-center gap-2">
            <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${category.gradient} flex items-center justify-center`}>
              {getCategoryIcon(category.color)}
            </div>
            <h4 className="font-bold text-gray-900">{category.category}</h4>
          </div>

          {category.items.map((hyp, hypIdx) => (
            <motion.div
              key={hypIdx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: catIdx * 0.2 + hypIdx * 0.1 }}
            >
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all">
                <CardContent className="p-5">
                  <div className="space-y-4">
                    {/* Title */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <h5 className="font-bold text-gray-900 text-lg mb-1">{hyp.condition}</h5>
                        <p className="text-sm text-gray-600">{hyp.explanation}</p>
                      </div>
                      <Badge className={getSeverityBadge(hyp.severity)}>
                        {hyp.severity}
                      </Badge>
                    </div>

                    {/* Evidence */}
                    <div className={`${category.bgColor} border ${category.borderColor} rounded-lg p-4`}>
                      <h6 className="font-semibold text-gray-900 mb-2 text-sm">Evidências Clínicas:</h6>
                      <ul className="space-y-1">
                        {hyp.evidence.map((ev, evIdx) => (
                          <li key={evIdx} className="flex items-start gap-2 text-sm text-gray-700">
                            <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>{ev}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Supporting Factors */}
                    <div>
                      <h6 className="font-semibold text-gray-900 mb-2 text-sm">Fatores de Apoio:</h6>
                      <ul className="space-y-1">
                        {hyp.supportingFactors.map((factor, factorIdx) => (
                          <li key={factorIdx} className="flex items-start gap-2 text-sm text-gray-600">
                            <span className="text-purple-600">•</span>
                            <span>{factor}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Differential */}
                    <div>
                      <h6 className="font-semibold text-gray-900 mb-2 text-sm">Considerações Diferenciais:</h6>
                      <ul className="space-y-1">
                        {hyp.differentialConsiderations.map((diff, diffIdx) => (
                          <li key={diffIdx} className="flex items-start gap-2 text-sm text-gray-600">
                            <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                            <span>{diff}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* References */}
                    <div className="pt-3 border-t border-gray-200">
                      <p className="text-xs font-semibold text-gray-700 mb-1">Referências:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {hyp.references.map((ref, refIdx) => (
                          <Badge key={refIdx} variant="outline" className="text-xs">
                            {ref}
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
      ))}

      {/* Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        {recommendations.map((rec, idx) => {
          const Icon = rec.icon;
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + idx * 0.1 }}
            >
              <Card className="border-0 shadow-md hover:shadow-lg transition-all h-full">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Icon className="h-5 w-5 text-purple-600" />
                    <h5 className="font-semibold text-gray-900 text-sm">{rec.title}</h5>
                  </div>
                  <ul className="space-y-2">
                    {rec.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex items-start gap-2 text-xs text-gray-600">
                        <CheckCircle2 className="h-3 w-3 text-purple-600 mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
