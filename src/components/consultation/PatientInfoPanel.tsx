import { Heart, Pill, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { Patient } from '@/lib/types';

interface PatientInfoPanelProps {
  patient: Patient;
}

export function PatientInfoPanel({ patient }: PatientInfoPanelProps) {
  return (
    <div className="space-y-4">
      {/* Patient Header */}
      <Card className="border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary/20">
              <AvatarFallback className="bg-[#283618] text-white text-xl font-bold">
                {patient.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{patient.name}</h2>
              <p className="text-muted-foreground">
                {patient.age ? `${patient.age} anos` : 'Idade não informada'}
                {patient.gender && ` • ${patient.gender}`}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Conditions */}
      {patient.mainConditions && patient.mainConditions.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-500" />
              Condições Crônicas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {patient.mainConditions.map((condition, idx) => (
                <Badge key={idx} variant="secondary" className="text-sm">
                  {condition}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Medications */}
      {patient.medications && patient.medications.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Pill className="h-4 w-4 text-blue-500" />
              Medicações em Uso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {patient.medications.map((med, idx) => (
                <li key={idx} className="text-sm flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                  {med}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Allergies */}
      {patient.allergies && patient.allergies.length > 0 && (
        <Card className="border-destructive/20 bg-destructive/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              Alergias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {patient.allergies.map((allergy: string, idx: number) => (
                <Badge key={idx} variant="destructive" className="text-sm">
                  {allergy}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notes */}
      {patient.notes && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Observações</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{patient.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
