/**
 * AtestadoPanel Component - PREMIUM DESIGN
 * Painel profissional para criação de atestados médicos
 * Suporta: Afastamento, Comparecimento e Acompanhamento
 */

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  Activity,
  Clock,
  Baby,
  Lock,
  Printer,
  QrCode,
  FileCheck,
  Edit3,
  Shield,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

type AtestadoType = 'afastamento' | 'comparecimento' | 'acompanhamento';
type Periodo = 'Manhã' | 'Tarde' | 'Integral';

interface AtestadoData {
  tipo: AtestadoType;
  dias: string;
  cid: string;
  exibirCid: boolean;
  periodo: Periodo;
  local: string;
  textoLivre: string;
}

interface AtestadoPanelProps {
  patientName?: string;
  doctorName?: string;
  onAtestadoCreated?: (data: AtestadoData) => void;
}

export function AtestadoPanel({
  patientName = 'PACIENTE',
  doctorName = 'Médico Exemplo',
  onAtestadoCreated
}: AtestadoPanelProps) {
  const [atestadoData, setAtestadoData] = useState<AtestadoData>({
    tipo: 'afastamento',
    dias: '3',
    cid: 'J03.0',
    exibirCid: false,
    periodo: 'Integral',
    local: 'São Paulo',
    textoLivre: ''
  });

  // Auto-generate text based on type
  useEffect(() => {
    const nome = patientName.toUpperCase();
    const doc = "RG: 00.000.000-0";
    let texto = "";

    const hoje = new Date().toLocaleDateString('pt-BR');
    const dataFim = new Date();
    dataFim.setDate(dataFim.getDate() + parseInt(atestadoData.dias || '0'));
    const fimFormatado = dataFim.toLocaleDateString('pt-BR');

    if (atestadoData.tipo === 'afastamento') {
      texto = `Atesto para os devidos fins que o(a) paciente ${nome}, portador(a) do ${doc}, esteve sob meus cuidados médicos.\n\nRecomendo REPOUSO de ${atestadoData.dias} (${numeroPorExtenso(parseInt(atestadoData.dias))}) dia(s), no período de ${hoje} a ${fimFormatado}.`;
    } else if (atestadoData.tipo === 'comparecimento') {
      texto = `Declaro para fins de justificativa de horas que o(a) Sr(a). ${nome}, portador(a) do ${doc}, compareceu a este serviço médico nesta data, no período da ${atestadoData.periodo}, para realização de consulta médica e exames complementares.`;
    } else {
      texto = `Atesto que o(a) Sr(a). RESPONSÁVEL LEGAL, portador(a) do CPF 000.000.000-00, compareceu a esta unidade na qualidade de acompanhante do paciente ${nome}, durante o período da ${atestadoData.periodo}.`;
    }

    setAtestadoData(prev => ({ ...prev, textoLivre: texto }));
  }, [atestadoData.tipo, atestadoData.dias, atestadoData.periodo, patientName]);

  const numeroPorExtenso = (num: number): string => {
    const extenso: Record<number, string> = {
      1: 'um', 2: 'dois', 3: 'três', 5: 'cinco', 7: 'sete',
      10: 'dez', 14: 'catorze', 15: 'quinze', 21: 'vinte e um', 30: 'trinta'
    };
    return extenso[num] || num.toString();
  };

  const handlePrint = () => {
    window.print();
    if (onAtestadoCreated) {
      onAtestadoCreated(atestadoData);
    }
  };

  return (
    <div className="h-full flex bg-gradient-to-br from-emerald-50/30 via-white to-teal-50/30">
      {/* Left Panel: Config */}
      <div className="w-96 border-r border-gray-200 bg-white shadow-xl print:hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-emerald-500 to-teal-600">
          <div className="flex items-center gap-3 text-white">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
              <FileCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Atestado Médico</h2>
              <p className="text-sm text-emerald-100">Configure e visualize</p>
            </div>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-6 space-y-6">
            {/* Type Selection */}
            <div>
              <Label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">
                Tipo de Documento
              </Label>
              <div className="flex flex-col gap-2">
                {[
                  {
                    id: 'afastamento' as AtestadoType,
                    label: 'Atestado Médico',
                    sub: 'Abona faltas por doença',
                    icon: Activity,
                    color: 'emerald'
                  },
                  {
                    id: 'comparecimento' as AtestadoType,
                    label: 'Declaração de Comparecimento',
                    sub: 'Justifica horas trabalhadas',
                    icon: Clock,
                    color: 'blue'
                  },
                  {
                    id: 'acompanhamento' as AtestadoType,
                    label: 'Atestado Acompanhante',
                    sub: 'Lei 13.257/16 (Filhos)',
                    icon: Baby,
                    color: 'purple'
                  }
                ].map(tipo => (
                  <motion.button
                    key={tipo.id}
                    onClick={() => setAtestadoData({ ...atestadoData, tipo: tipo.id })}
                    className={cn(
                      "flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all group",
                      atestadoData.tipo === tipo.id
                        ? `bg-${tipo.color}-50 border-${tipo.color}-500 ring-2 ring-${tipo.color}-200 shadow-md`
                        : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm"
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={cn(
                      "mt-0.5 p-2 rounded-lg transition-colors",
                      atestadoData.tipo === tipo.id
                        ? `bg-${tipo.color}-200 text-${tipo.color}-800`
                        : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                    )}>
                      <tipo.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className={cn(
                        "text-sm font-bold",
                        atestadoData.tipo === tipo.id ? "text-gray-900" : "text-gray-700"
                      )}>
                        {tipo.label}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{tipo.sub}</p>
                    </div>
                    {atestadoData.tipo === tipo.id && (
                      <Badge className={`bg-${tipo.color}-600`}>
                        Selecionado
                      </Badge>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Afastamento Options */}
            {atestadoData.tipo === 'afastamento' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                <div>
                  <Label className="text-xs font-bold text-gray-500 uppercase mb-2 block">
                    Quantidade de Dias
                  </Label>
                  <div className="grid grid-cols-5 gap-2">
                    {['1', '2', '3', '5', '7', '10', '14', '15', '21', '30'].map(d => (
                      <button
                        key={d}
                        onClick={() => setAtestadoData({ ...atestadoData, dias: d })}
                        className={cn(
                          "h-11 text-sm font-bold rounded-lg border-2 transition-all",
                          atestadoData.dias === d
                            ? "bg-emerald-600 text-white border-emerald-600 shadow-md scale-105"
                            : "bg-white text-gray-600 border-gray-200 hover:border-emerald-500 hover:text-emerald-600"
                        )}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="bg-amber-50 p-4 rounded-xl border-2 border-amber-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-amber-900 flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Sigilo do CID
                    </span>
                    <Switch
                      checked={atestadoData.exibirCid}
                      onCheckedChange={(c) => setAtestadoData({ ...atestadoData, exibirCid: c })}
                      className="data-[state=checked]:bg-amber-600"
                    />
                  </div>
                  {atestadoData.exibirCid && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                    >
                      <Input
                        value={atestadoData.cid}
                        onChange={(e) => setAtestadoData({ ...atestadoData, cid: e.target.value })}
                        className="bg-white border-amber-300 focus:border-amber-500"
                        placeholder="Ex: J03.0"
                      />
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Comparecimento/Acompanhamento Options */}
            {(atestadoData.tipo === 'comparecimento' || atestadoData.tipo === 'acompanhamento') && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-4"
              >
                <div>
                  <Label className="text-xs font-bold text-gray-500 uppercase mb-2 block">
                    Período do Dia
                  </Label>
                  <div className="flex bg-gray-100 p-1 rounded-xl">
                    {(['Manhã', 'Tarde', 'Integral'] as Periodo[]).map(p => (
                      <button
                        key={p}
                        onClick={() => setAtestadoData({ ...atestadoData, periodo: p })}
                        className={cn(
                          "flex-1 py-2.5 text-sm font-bold rounded-lg transition-all",
                          atestadoData.periodo === p
                            ? "bg-white text-emerald-700 shadow-sm"
                            : "text-gray-500 hover:text-gray-700"
                        )}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Local */}
            <div>
              <Label className="text-xs font-bold text-gray-500 uppercase mb-2 block">
                Cidade
              </Label>
              <Input
                value={atestadoData.local}
                onChange={(e) => setAtestadoData({ ...atestadoData, local: e.target.value })}
                className="bg-gray-50 border-gray-200"
                placeholder="Ex: São Paulo"
              />
            </div>

            {/* Print Button */}
            <Button
              onClick={handlePrint}
              className="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold shadow-lg"
            >
              <Printer className="w-5 h-5 mr-2" />
              Imprimir Atestado
            </Button>
          </div>
        </ScrollArea>
      </div>

      {/* Right Panel: Preview */}
      <div className="flex-1 flex flex-col">
        <div className="p-6 bg-white border-b print:hidden flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <Edit3 className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Visualização do Documento</h3>
              <p className="text-sm text-gray-500">Edite o texto conforme necessário</p>
            </div>
          </div>
          <Badge variant="outline" className="flex items-center gap-2">
            <Shield className="w-3 h-3" />
            Documento Legal
          </Badge>
        </div>

        <ScrollArea className="flex-1 p-8 bg-gradient-to-br from-gray-50 to-white print:p-0">
          {/* Document */}
          <div className="max-w-4xl mx-auto bg-white shadow-2xl print:shadow-none rounded-2xl print:rounded-none overflow-hidden">
            <div className="relative p-16 print:p-12">
              {/* Watermark */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.02] pointer-events-none">
                <FileCheck className="w-96 h-96" />
              </div>

              {/* Header */}
              <header className="flex items-start justify-between mb-12 relative z-10 pb-8 border-b-2 border-gray-300">
                <div>
                  <h2 className="font-serif text-3xl font-bold text-gray-900 tracking-tight">
                    Dr. {doctorName}
                  </h2>
                  <div className="flex gap-3 mt-3">
                    <Badge variant="outline" className="bg-emerald-50 border-emerald-600 text-emerald-700 font-bold">
                      CRM-SP 123.456
                    </Badge>
                    <Badge variant="outline" className="bg-emerald-50 border-emerald-600 text-emerald-700 font-bold">
                      RQE 45.092
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <h2 className="text-sm font-bold uppercase tracking-widest text-emerald-900">
                    Medicina de Família
                  </h2>
                  <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                    Rua da Saúde, 1000 - Sala 42<br />
                    {atestadoData.local} - SP<br />
                    Tel: (11) 1234-5678
                  </p>
                </div>
              </header>

              {/* Title */}
              <div className="text-center mb-16 relative z-10">
                <div className="inline-block">
                  <h1 className="text-5xl font-black uppercase tracking-[0.25em] text-gray-900 pb-3 border-b-4 border-emerald-600">
                    {atestadoData.tipo === 'afastamento'
                      ? 'Atestado Médico'
                      : atestadoData.tipo === 'comparecimento'
                      ? 'Declaração'
                      : 'Atestado de Acompanhante'}
                  </h1>
                  <p className="text-xs text-gray-400 mt-3 font-mono uppercase tracking-[0.3em]">
                    Documento Médico Legal
                  </p>
                </div>
              </div>

              {/* Body */}
              <div className="relative z-10 px-8 mb-12 group">
                <div className="absolute -left-8 top-0 opacity-0 group-hover:opacity-100 transition-opacity print:hidden">
                  <div className="bg-emerald-50 text-emerald-700 p-2 rounded-lg shadow-sm">
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>
                <Textarea
                  className="w-full min-h-[400px] border-0 focus-visible:ring-0 p-0 text-xl leading-[2.8] text-justify font-serif resize-none bg-transparent selection:bg-emerald-100 text-gray-800"
                  value={atestadoData.textoLivre}
                  onChange={(e) => setAtestadoData({ ...atestadoData, textoLivre: e.target.value })}
                />
              </div>

              {/* CID Box */}
              {atestadoData.exibirCid && atestadoData.tipo === 'afastamento' && (
                <div className="flex justify-center mb-12 relative z-10">
                  <div className="border-4 border-gray-900 px-12 py-4 bg-gray-50 print:bg-white relative">
                    <span className="absolute -top-3 left-6 bg-white px-3 text-xs font-bold uppercase tracking-wider text-gray-600">
                      Diagnóstico
                    </span>
                    <p className="font-mono text-2xl font-bold text-gray-900">
                      CID-10: {atestadoData.cid}
                    </p>
                  </div>
                </div>
              )}

              {/* Footer */}
              <footer className="mt-16 pt-12 border-t-2 border-gray-300 relative z-10 flex items-end justify-between">
                {/* QR Code */}
                <div className="text-center">
                  <div className="border-2 border-gray-900 p-2 bg-white inline-block mb-3">
                    <QrCode className="w-28 h-28 text-gray-900" />
                  </div>
                  <p className="text-[9px] font-mono text-gray-500 uppercase leading-tight">
                    Autenticidade Verificável em:<br />
                    <span className="font-bold">VALIDADOR.ITI.GOV.BR</span>
                  </p>
                </div>

                {/* Signature */}
                <div className="text-center">
                  <div className="w-80 border-b-2 border-gray-900 mb-3"></div>
                  <p className="font-serif text-xl font-bold text-gray-900">Dr. {doctorName}</p>
                  <p className="text-sm text-gray-600 mt-1">CRM-SP 123.456</p>
                  <p className="text-xs text-gray-400 mt-4">
                    {atestadoData.local}, {new Date().toLocaleDateString('pt-BR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </footer>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
