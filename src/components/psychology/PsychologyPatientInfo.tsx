import { Brain, Target, AlertTriangle, Pill, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import type { Patient } from '@/lib/types';
import { getPatientAvatar } from '@/lib/utils';

interface PsychologyPatientInfoProps {
  patient: Patient;
}

export function PsychologyPatientInfo({ patient }: PsychologyPatientInfoProps) {
  // Dados de exemplo - idealmente viriam do patient object
  const psychologyData = {
    mainDemand: 'Ansiedade em situações sociais e dificuldade de relacionamento interpessoal',
    recurringThemes: ['Ansiedade Social', 'Autocrítica', 'Baixa Autoestima'],
    therapeuticGoals: [
      { goal: 'Reduzir ansiedade social', progress: 60 },
      { goal: 'Desenvolver assertividade', progress: 40 },
      { goal: 'Melhorar autoestima', progress: 30 }
    ],
    sessionCount: 8,
    startDate: '2025-09-15',
    psychiatricMedication: ['Sertralina 50mg (manhã)'],
    riskFactors: []
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 70) return 'bg-green-500';
    if (progress >= 40) return 'bg-orange-500';
    return 'bg-yellow-500';
  };

  return (
    <div className="space-y-4">
      {/* Patient Header */}
      <Card className="border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary/20">
              <AvatarImage src={getPatientAvatar(patient.name)} alt={patient.name} className="object-cover" />
              <AvatarFallback className="bg-[#8C00FF] text-white text-xl font-bold">
                {patient.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{patient.name}</h2>
              <p className="text-muted-foreground">
                {patient.age ? `${patient.age} anos` : 'Idade não informada'}
                {patient.gender && ` • ${patient.gender}`}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {psychologyData.sessionCount} sessões • Início: {new Date(psychologyData.startDate).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Demand */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Brain className="h-4 w-4 text-purple-500" />
            Demanda Principal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {psychologyData.mainDemand}
          </p>
        </CardContent>
      </Card>

      {/* Recurring Themes */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="h-4 w-4 text-blue-500" />
            Temas Recorrentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {psychologyData.recurringThemes.map((theme, idx) => (
              <Badge key={idx} variant="secondary" className="text-sm">
                {theme}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Therapeutic Goals */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            Metas Terapêuticas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {psychologyData.therapeuticGoals.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">{item.goal}</span>
                  <span className="text-purple-600 font-semibold">{item.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all ${getProgressColor(item.progress)}`}
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Psychiatric Medication */}
      {psychologyData.psychiatricMedication && psychologyData.psychiatricMedication.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Pill className="h-4 w-4 text-blue-500" />
              Medicação Psiquiátrica
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {psychologyData.psychiatricMedication.map((med, idx) => (
                <li key={idx} className="text-sm flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {med}
                </li>
              ))}
            </ul>
            <p className="text-xs text-gray-500 mt-2 italic">
              Prescrito por psiquiatra - acompanhamento conjunto
            </p>
          </CardContent>
        </Card>
      )}

      {/* Risk Factors / Alerts */}
      {psychologyData.riskFactors && psychologyData.riskFactors.length > 0 && (
        <Card className="border-destructive/20 bg-destructive/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              Fatores de Risco
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {psychologyData.riskFactors.map((risk, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-destructive">{risk}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notes */}
      {patient.notes && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Observações Gerais</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{patient.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
