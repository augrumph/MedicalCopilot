import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Brain, Lightbulb, Pill, FileCheck, FileText, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

interface Medication {
  name: string;
  indication: string;
  dosage: string;
  duration: string;
  type: 'primary' | 'alternative' | 'optional';
}

interface TabContentProps {
  activeTab: string;
  transcript: string;
  suggestedMedications: Medication[];
  prescriptionGenerated: boolean;
  setPrescriptionGenerated: (value: boolean) => void;
}

const TabContent: React.FC<TabContentProps> = ({
  activeTab,
  transcript,
  suggestedMedications,
  prescriptionGenerated,
  setPrescriptionGenerated
}) => {
  const renderContent = () => {
    switch (activeTab) {
      case 'ai':
        return (
          <div>
            <h3 className="font-bold text-lg text-gray-900 mb-4">Assistente IA</h3>
            <div className="bg-gray-100 rounded-lg p-4 min-h-[200px]">
              <p className="text-gray-700">Transcrição da consulta:</p>
              <p className="text-gray-900 mt-2">{transcript || 'Nenhuma transcrição disponível ainda...'}</p>
            </div>
          </div>
        );
      case 'diagnosis':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#FFC400] to-[#FF9500] flex items-center justify-center">
                <Lightbulb className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900">Hipóteses Diagnósticas</h3>
                <p className="text-sm text-gray-600">Análise baseada em evidências clínicas</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <h4 className="font-bold text-gray-900">Mais Prováveis</h4>
                </div>

                <div className="space-y-3">
                  <Card className="border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 shadow-md">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                            <CheckCircle2 className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h5 className="font-bold text-lg text-gray-900">Faringite Viral Aguda</h5>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="px-2 py-1 rounded-full bg-green-500 text-white text-xs">Alta Probabilidade</span>
                              <span className="px-2 py-1 rounded-full bg-blue-500 text-white text-xs">Baixa Gravidade</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 mt-4">
                        <div className="bg-white rounded-lg p-4 border border-green-200">
                          <h6 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <Brain className="h-4 w-4 text-green-600" />
                            Explicação
                          </h6>
                          <p className="text-sm text-gray-700">
                            Inflamação da faringe causada por vírus, sendo o quadro clínico consistente com sintomas virais como dor de garganta, febre baixa e ausência de sinais bacterianos.
                          </p>
                        </div>

                        <div className="bg-white rounded-lg p-4 border border-green-200">
                          <h6 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            <FileText className="h-4 w-4 text-green-600" />
                            Base Científica
                          </h6>
                          <ul className="space-y-2">
                            <li className="text-sm text-gray-700 flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>Dor de garganta + febre baixa + quadro viral típico</span>
                            </li>
                            <li className="text-sm text-gray-700 flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>Score de Centor ≤2, sem sinais bacterianos marcantes</span>
                            </li>
                            <li className="text-sm text-gray-700 flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>Evolução autolimitada comum em infecções virais</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        );
      case 'medication':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#FF3F7F] to-[#FF1654] flex items-center justify-center">
                <Pill className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900">Medicação Sugerida</h3>
                <p className="text-sm text-gray-600">Prescrições baseadas no diagnóstico</p>
              </div>
            </div>

            <div className="space-y-3">
              {suggestedMedications.map((med, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className={cn(
                    "shadow-md",
                    med.type === 'primary' && "bg-gradient-to-br from-[#8C00FF]/10 to-[#450693]/5 border border-[#8C00FF]/30",
                    med.type === 'alternative' && "bg-gradient-to-br from-[#FFC400]/10 to-[#FF9500]/5 border border-[#FFC400]/30",
                    med.type === 'optional' && "bg-gray-50 border border-gray-300"
                  )}>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "h-10 w-10 rounded-lg flex items-center justify-center",
                            med.type === 'primary' && "bg-gradient-to-br from-[#8C00FF] to-[#450693]",
                            med.type === 'alternative' && "bg-gradient-to-br from-[#FFC400] to-[#FF9500]",
                            med.type === 'optional' && "bg-gray-400"
                          )}>
                            <Pill className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900">{med.name}</h4>
                            <p className="text-xs text-gray-600">{med.indication}</p>
                          </div>
                        </div>
                        <div className={cn(
                          "px-2 py-1 rounded-full text-xs font-semibold",
                          med.type === 'primary' && "bg-[#8C00FF] text-white",
                          med.type === 'alternative' && "bg-[#FFC400] text-gray-900",
                          med.type === 'optional' && "bg-gray-400 text-white"
                        )}>
                          {med.type === 'primary' && 'Primeira Escolha'}
                          {med.type === 'alternative' && 'Alternativa'}
                          {med.type === 'optional' && 'Opcional'}
                        </div>
                      </div>

                      <div className="space-y-2 bg-white rounded-lg p-3 border border-gray-200">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-gray-700">Posologia:</span>
                          <span className="text-sm text-gray-900">{med.dosage}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-gray-700">Duração:</span>
                          <span className="text-sm text-gray-900">{med.duration}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}

              <Card className="border-0 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-md mt-6">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
                      <AlertTriangle className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 mb-2">Orientações Importantes</h4>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Verificar alergias medicamentosas antes de prescrever</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Orientar sobre hidratação adequada (2-3L/dia)</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>Repouso relativo durante o tratamento</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <XCircle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <span>Retornar se sintomas piorarem ou não melhorarem em 3-5 dias</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );
      case 'prescription':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-[#8C00FF] to-[#450693] flex items-center justify-center">
                  <FileCheck className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">Receita Médica</h3>
                  <p className="text-sm text-gray-600">Prescrição profissional para o paciente</p>
                </div>
              </div>

              {!prescriptionGenerated && (
                <Button
                  onClick={() => setPrescriptionGenerated(true)}
                  className="bg-gradient-to-r from-[#8C00FF] to-[#450693] text-white hover:opacity-90 shadow-md"
                >
                  <FileCheck className="mr-2 h-4 w-4" />
                  Gerar Receita
                </Button>
              )}
            </div>

            {!prescriptionGenerated ? (
              <Card className="border-0 bg-gradient-to-br from-gray-50 to-gray-100 shadow-md">
                <CardContent className="p-12 text-center">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#8C00FF] to-[#450693] rounded-full blur-2xl opacity-20 animate-pulse"></div>
                    <div className="relative h-24 w-24 rounded-full bg-gradient-to-br from-[#8C00FF] to-[#450693] flex items-center justify-center mx-auto shadow-xl">
                      <FileCheck className="h-12 w-12 text-white" />
                    </div>
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 mb-2">Receita Médica</h4>
                  <p className="text-gray-600 mb-6">
                    Clique no botão acima para gerar automaticamente uma receita médica profissional baseada nas medicações sugeridas.
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span>Geração automática com base nas medicações selecionadas</span>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                <p>Conteúdo da receita gerada será exibido aqui</p>
              </div>
            )}
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
                <FileText className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900">Configurações</h3>
                <p className="text-sm text-gray-600">Personalizar preferências da consulta</p>
              </div>
            </div>

            <Card className="border-0 bg-gradient-to-br from-gray-50 to-gray-100 shadow-md">
              <CardContent className="p-6">
                <p className="text-gray-700">Opções de configuração da consulta serão exibidas aqui</p>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Card className="flex-1 border-0 shadow-lg h-full">
      <CardContent className="p-6 h-full">
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export default memo(TabContent);