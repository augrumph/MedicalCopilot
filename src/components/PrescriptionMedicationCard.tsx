import React, { memo, useState } from 'react';
import { CheckCircle2, AlertTriangle, Edit3, Trash2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

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

  const bgColor = isControlled ? 'bg-red-50' : 'bg-gray-50';
  const borderColor = isControlled ? 'border-red-200' : 'border-gray-200';

  const handleSave = () => {
    onEdit(editedMed);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className={`${bgColor} rounded-lg p-3 border ${borderColor} sm:p-4`}>
        <div className="flex items-start gap-2 sm:gap-3">
          <div className={`flex-shrink-0 ${isControlled ? 'bg-red-600' : 'bg-[#8C00FF]'} text-white rounded-full w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-xs sm:text-sm font-bold`}>
            {idx + 1}
          </div>
          <div className="flex-1 space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-medium text-gray-700">Nome do Medicamento</label>
                <Input
                  value={editedMed.name}
                  onChange={(e) => setEditedMed({...editedMed, name: e.target.value})}
                  className="text-xs sm:text-sm p-2"
                  placeholder="Ex: Paracetamol"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700">Concentração</label>
                <Input
                  value={editedMed.concentration}
                  onChange={(e) => setEditedMed({...editedMed, concentration: e.target.value})}
                  className="text-xs sm:text-sm p-2"
                  placeholder="Ex: 500mg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-medium text-gray-700">Forma Farmacêutica</label>
                <Input
                  value={editedMed.form}
                  onChange={(e) => setEditedMed({...editedMed, form: e.target.value})}
                  className="text-xs sm:text-sm p-2"
                  placeholder="Ex: comprimidos"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700">Via de Administração</label>
                <Input
                  value={editedMed.via}
                  onChange={(e) => setEditedMed({...editedMed, via: e.target.value})}
                  className="text-xs sm:text-sm p-2"
                  placeholder="Ex: VO (via oral)"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-medium text-gray-700">Posologia</label>
                <Input
                  value={editedMed.dosage}
                  onChange={(e) => setEditedMed({...editedMed, dosage: e.target.value})}
                  className="text-xs sm:text-sm p-2"
                  placeholder="Ex: 1 comp. c/6h"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700">Duração</label>
                <Input
                  value={editedMed.duration}
                  onChange={(e) => setEditedMed({...editedMed, duration: e.target.value})}
                  className="text-xs sm:text-sm p-2"
                  placeholder="Ex: 5 dias"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="text-xs font-medium text-gray-700">Qtde (números)</label>
                <Input
                  value={editedMed.quantity || ''}
                  onChange={(e) => setEditedMed({...editedMed, quantity: e.target.value})}
                  className="text-xs sm:text-sm p-2"
                  placeholder="Ex: 10"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700">Qtde (extenso)</label>
                <Input
                  value={editedMed.quantityText || ''}
                  onChange={(e) => setEditedMed({...editedMed, quantityText: e.target.value})}
                  className="text-xs sm:text-sm p-2"
                  placeholder="Ex: 10 (dez)"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-700">Indicação</label>
              <Input
                value={editedMed.indication}
                onChange={(e) => setEditedMed({...editedMed, indication: e.target.value})}
                className="text-xs sm:text-sm p-2"
                placeholder="Ex: Dor e febre"
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3 pt-2 gap-2">
              <label className="flex items-center gap-2 text-xs sm:text-sm">
                <input
                  type="checkbox"
                  checked={editedMed.isControlled}
                  onChange={(e) => setEditedMed({...editedMed, isControlled: e.target.checked})}
                  className="rounded text-[#8C00FF] focus:ring-[#8C00FF] w-4 h-4"
                />
                <span className={`${isControlled ? 'text-red-700 font-semibold' : 'text-gray-700'}`}>Medicamento Controlado</span>
              </label>

              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-gray-300 text-gray-700 text-xs px-2 py-1 flex-1"
                  onClick={() => setIsEditing(false)}
                >
                  Cancelar
                </Button>
                <Button
                  size="sm"
                  className={`bg-[#8C00FF] hover:bg-[#7a00e6] text-xs px-2 py-1 flex-1 ${isControlled ? 'bg-red-600 hover:bg-red-700' : 'bg-[#8C00FF] hover:bg-[#7a00e6]'}`}
                  onClick={handleSave}
                >
                  <Save className="w-3 h-3 mr-1" />
                  Salvar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${bgColor} rounded-lg p-3 border ${borderColor} sm:p-4`}>
      <div className="flex items-start gap-2 sm:gap-3">
        <div className={`flex-shrink-0 ${isControlled ? 'bg-red-600' : 'bg-[#8C00FF]'} text-white rounded-full w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-xs sm:text-sm font-bold`}>
          {idx + 1}
        </div>
        <div className="flex-1 space-y-1.5 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className={`font-bold ${isControlled ? 'text-red-800' : 'text-gray-900'} text-sm sm:text-base truncate`}>
                {med.name} {med.concentration} – {med.form}
              </p>
              <p className="text-xs text-gray-600 truncate">{med.indication}</p>
            </div>
            <div className="flex gap-1 ml-2">
              <Button
                size="sm"
                variant="ghost"
                className="h-7 w-7 p-0 text-gray-600 hover:text-gray-800 touch-target"
                onClick={() => setIsEditing(true)}
              >
                <Edit3 className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="h-7 w-7 p-0 text-red-600 hover:text-red-800 touch-target"
                onClick={onDelete}
              >
                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-x-4 sm:gap-y-1 text-xs sm:text-sm">
            <div>
              <span className={`font-semibold ${isControlled ? 'text-red-700' : 'text-gray-700'}`}>Via:</span>
              <span className={`${isControlled ? 'text-red-900' : 'text-gray-900'} ml-1`}>{med.via}</span>
            </div>
            <div>
              <span className={`font-semibold ${isControlled ? 'text-red-700' : 'text-gray-700'}`}>Qtde:</span>
              <span className={`${isControlled ? 'text-red-900' : 'text-gray-900'} ml-1`}>{med.quantityText || med.quantity}</span>
            </div>
          </div>

          <div className="text-xs sm:text-sm">
            <span className={`font-semibold ${isControlled ? 'text-red-700' : 'text-gray-700'}`}>Posologia:</span>
            <span className={`${isControlled ? 'text-red-900' : 'text-gray-900'} ml-1`}>{med.dosage}</span>
          </div>

          <div className="text-xs sm:text-sm">
            <span className={`font-semibold ${isControlled ? 'text-red-700' : 'text-gray-700'}`}>Duração:</span>
            <span className={`${isControlled ? 'text-red-900' : 'text-gray-900'} ml-1`}>{med.duration}</span>
          </div>

          {isControlled && (
            <div className="mt-1 text-[10px] sm:text-xs font-semibold text-red-600 bg-red-100 rounded px-1.5 py-1 sm:px-2 sm:py-1 inline-block">
              MEDICAMENTO CONTROLADO
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(PrescriptionMedicationCard);