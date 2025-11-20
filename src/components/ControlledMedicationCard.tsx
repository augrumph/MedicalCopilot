import React, { memo } from 'react';

interface ControlledMedicationCardProps {
  med: {
    name: string;
    concentration: string;
    form: string;
    via: string;
    dosage: string;
    duration: string;
    quantity?: string;
    quantityText?: string;
    indication: string;
    controlledType?: string | null;
  };
  idx: number;
}

// Função para converter número para extenso (simplificada)
const numberToExtenso = (num: number): string => {
  const unidades = ['', 'um', 'dois', 'três', 'quatro', 'cinco', 'seis', 'sete', 'oito', 'nove'];
  const dezenas = ['', '', 'vinte', 'trinta', 'quarenta', 'cinquenta', 'sessenta', 'setenta', 'oitenta', 'noventa'];

  if (num < 10) return unidades[num];
  if (num < 20) {
    const teens = ['dez', 'onze', 'doze', 'treze', 'quatorze', 'quinze', 'dezesseis', 'dezessete', 'dezoito', 'dezenove'];
    return teens[num - 10];
  }
  if (num < 100) {
    const dez = Math.floor(num / 10);
    const uni = num % 10;
    return dezenas[dez] + (uni > 0 ? ' e ' + unidades[uni] : '');
  }
  // Para números maiores, retornamos o número normal (poderia ser expandido)
  return num.toString();
};

const ControlledMedicationCard: React.FC<ControlledMedicationCardProps> = ({ med, idx }) => {
  // Converter quantidade para extenso se possível
  const quantityExtenso = med.quantityText || med.quantity;

  // Extrair número para converter para extenso (se possível)
  let quantidadeExtenso = quantityExtenso;
  if (quantityExtenso && !quantityExtenso.includes("(") && quantityExtenso.match(/^\d+/)) {
    const numero = parseInt(quantityExtenso.match(/^\d+/)?.[0] || "0");
    if (numero > 0) {
      const extenso = numberToExtenso(numero);
      if (!quantityExtenso.toLowerCase().includes(extenso.toLowerCase())) {
        quantidadeExtenso = `${quantityExtenso} (${numero > 0 ? numberToExtenso(numero) : ''})`;
      }
    }
  }

  return (
    <div className="bg-red-50 rounded-lg p-4 border border-red-200">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold">
          {idx + 1}
        </div>
        <div className="flex-1 space-y-1.5">
          <p className="font-bold text-red-800 text-base">{med.name} {med.concentration} – {med.form}</p>

          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
            <div>
              <span className="font-semibold text-red-700">Via:</span>
              <span className="text-red-900 ml-1">{med.via}</span>
            </div>
            <div>
              <span className="font-semibold text-red-700">Quantidade:</span>
              <span className="text-red-900 ml-1">{quantidadeExtenso}</span>
            </div>
          </div>

          <p className="text-sm">
            <span className="font-semibold text-red-700">Posologia:</span>
            <span className="text-red-900 ml-1">{med.dosage}</span>
          </p>

          <p className="text-sm">
            <span className="font-semibold text-red-700">Duração do tratamento:</span>
            <span className="text-red-900 ml-1">{med.duration}</span>
          </p>

          <p className="text-sm text-red-600 italic pt-1">
            {med.indication}
          </p>
        </div>
      </div>
    </div>
  );
};

export default memo(ControlledMedicationCard);