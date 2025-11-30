import React, { memo, useState } from 'react';
import { Edit3, Trash2, Save, X, Pill, Clock, Calendar, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface PrescriptionMedicationCardProps {
  med: {
    id: number;
    name: string;
    concentration: string;
    form: string;
    via: string;
    dosage: string;
    duration: string;
    quantity?: string;
    quantityText?: string;
    indication: string;
    isControlled?: boolean;
    controlledType?: string | null;
  };
  idx: number;
  onEdit: (updatedMed: any) => void;
  onDelete: () => void;
}

const PrescriptionMedicationCard: React.FC<PrescriptionMedicationCardProps> = ({
  med,
  idx,
  onEdit,
  onDelete
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedMed, setEditedMed] = useState({ ...med });
  const isControlled = med.isControlled;

  const handleSave = () => {
    onEdit(editedMed);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <Card className={cn(
        "shadow-lg border-2",
        isControlled ? "border-red-100 bg-red-50/30" : "border-primary/20 bg-white"
      )}>
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold text-white",
                isControlled ? "bg-red-500" : "bg-primary"
              )}>
                {idx + 1}
              </div>
              <h4 className="font-semibold text-gray-900">Editar Medicamento</h4>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsEditing(false)} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-gray-500 uppercase tracking-wider">Medicamento</Label>
                <Input
                  value={editedMed.name}
                  onChange={(e) => setEditedMed({ ...editedMed, name: e.target.value })}
                  className="bg-white"
                  placeholder="Nome"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-gray-500 uppercase tracking-wider">Concentração</Label>
                <Input
                  value={editedMed.concentration}
                  onChange={(e) => setEditedMed({ ...editedMed, concentration: e.target.value })}
                  className="bg-white"
                  placeholder="Ex: 500mg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-gray-500 uppercase tracking-wider">Forma</Label>
                <Input
                  value={editedMed.form}
                  onChange={(e) => setEditedMed({ ...editedMed, form: e.target.value })}
                  className="bg-white"
                  placeholder="Ex: comprimidos"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-gray-500 uppercase tracking-wider">Via</Label>
                <Input
                  value={editedMed.via}
                  onChange={(e) => setEditedMed({ ...editedMed, via: e.target.value })}
                  className="bg-white"
                  placeholder="Ex: VO"
                />
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-gray-500 uppercase tracking-wider">Posologia</Label>
                <Input
                  value={editedMed.dosage}
                  onChange={(e) => setEditedMed({ ...editedMed, dosage: e.target.value })}
                  className="bg-white"
                  placeholder="Ex: 1 comp. c/6h"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-gray-500 uppercase tracking-wider">Duração</Label>
                <Input
                  value={editedMed.duration}
                  onChange={(e) => setEditedMed({ ...editedMed, duration: e.target.value })}
                  className="bg-white"
                  placeholder="Ex: 5 dias"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-gray-500 uppercase tracking-wider">Quantidade</Label>
                <Input
                  value={editedMed.quantity || ''}
                  onChange={(e) => setEditedMed({ ...editedMed, quantity: e.target.value })}
                  className="bg-white"
                  placeholder="Numérico"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-gray-500 uppercase tracking-wider">Extenso</Label>
                <Input
                  value={editedMed.quantityText || ''}
                  onChange={(e) => setEditedMed({ ...editedMed, quantityText: e.target.value })}
                  className="bg-white"
                  placeholder="Por extenso"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                className={cn(isControlled ? "bg-red-600 hover:bg-red-700" : "bg-primary hover:bg-primary/90")}
              >
                <Save className="w-4 h-4 mr-2" />
                Salvar Alterações
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(
      "group transition-all duration-300 hover:shadow-md border-l-4",
      isControlled ? "border-l-red-500 bg-red-50/10" : "border-l-primary bg-white"
    )}>
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className={cn(
            "h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0 mt-1",
            isControlled ? "bg-red-500" : "bg-primary"
          )}>
            {idx + 1}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className={cn("font-bold text-lg", isControlled ? "text-red-900" : "text-gray-900")}>
                    {med.name}
                  </h4>
                  <Badge variant="outline" className="text-gray-600 bg-white">
                    {med.concentration}
                  </Badge>
                  {isControlled && (
                    <Badge className="bg-red-100 text-red-700 hover:bg-red-200 border-red-200">
                      Controlado
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                  <span className="capitalize">{med.form}</span>
                  <span className="h-1 w-1 rounded-full bg-gray-300" />
                  <span>{med.via}</span>
                </p>
              </div>

              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-500 hover:text-primary hover:bg-primary/10"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit3 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50"
                  onClick={onDelete}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mt-4 bg-gray-50/50 p-3 rounded-lg border border-gray-100">
              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 text-gray-400 mt-0.5" />
                <div>
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Posologia</span>
                  <span className="text-sm font-medium text-gray-900">{med.dosage}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 text-gray-400 mt-0.5" />
                <div>
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Duração</span>
                  <span className="text-sm font-medium text-gray-900">{med.duration}</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Pill className="h-4 w-4 text-gray-400 mt-0.5" />
                <div>
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Quantidade</span>
                  <span className="text-sm font-medium text-gray-900">
                    {med.quantity} <span className="text-gray-500 font-normal">({med.quantityText})</span>
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <AlertCircle className="h-4 w-4 text-gray-400 mt-0.5" />
                <div>
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block">Indicação</span>
                  <span className="text-sm font-medium text-gray-900">{med.indication}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default memo(PrescriptionMedicationCard);