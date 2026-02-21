/**
 * ExamRequestPanel Component - PREMIUM DESIGN
 * Painel profissional para solicitação de exames médicos
 * Integra com MEMED API via protocolo
 */

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Activity,
  FlaskConical,
  Heart,
  Stethoscope,
  Loader2,
  Search,
  CheckCircle2,
  AlertCircle,
  X,
  Plus,
  FileText,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface ExamCategory {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  exams: ExamItem[];
}

interface ExamItem {
  id: string;
  name: string;
  category: string;
  sus?: string;
  tuss?: string;
  preparacao?: string;
}

// Catálogo de exames mais comuns
const EXAM_CATALOG: ExamCategory[] = [
  {
    id: 'laboratoriais',
    name: 'Laboratoriais',
    icon: FlaskConical,
    color: 'blue',
    exams: [
      { id: 'hemograma', name: 'Hemograma Completo', category: 'laboratoriais', sus: '0202010473', preparacao: 'Jejum não obrigatório' },
      { id: 'glicemia', name: 'Glicemia em Jejum', category: 'laboratoriais', sus: '0202010376', preparacao: 'Jejum de 8-12 horas' },
      { id: 'colesterol', name: 'Colesterol Total e Frações', category: 'laboratoriais', sus: '0202010317', preparacao: 'Jejum de 12 horas' },
      { id: 'tsh', name: 'TSH (Hormônio Tireoestimulante)', category: 'laboratoriais', sus: '0202010562' },
      { id: 't4livre', name: 'T4 Livre', category: 'laboratoriais', sus: '0202010554' },
      { id: 'ureia', name: 'Ureia', category: 'laboratoriais', sus: '0202010589' },
      { id: 'creatinina', name: 'Creatinina', category: 'laboratoriais', sus: '0202010325' },
      { id: 'eas', name: 'EAS (Urina Tipo 1)', category: 'laboratoriais', sus: '0202010392', preparacao: 'Primeira urina da manhã' },
      { id: 'pcr', name: 'Proteína C Reativa', category: 'laboratoriais', sus: '0202010503' },
      { id: 'hba1c', name: 'Hemoglobina Glicada', category: 'laboratoriais', sus: '0202010406' },
    ]
  },
  {
    id: 'imagem',
    name: 'Imagem',
    icon: Activity,
    color: 'purple',
    exams: [
      { id: 'rx-torax', name: 'Raio-X de Tórax', category: 'imagem', sus: '0206010079' },
      { id: 'rx-abdomen', name: 'Raio-X de Abdome', category: 'imagem', sus: '0206010036' },
      { id: 'us-abdomen', name: 'US Abdome Total', category: 'imagem', sus: '0205020073' },
      { id: 'us-tireoide', name: 'US Tireoide', category: 'imagem', sus: '0205020146' },
      { id: 'mamografia', name: 'Mamografia Bilateral', category: 'imagem', sus: '0204030030' },
      { id: 'tc-cranio', name: 'TC de Crânio', category: 'imagem', sus: '0206020010' },
      { id: 'rm-coluna', name: 'RM de Coluna', category: 'imagem', tuss: '40901106' },
    ]
  },
  {
    id: 'cardiologicos',
    name: 'Cardiológicos',
    icon: Heart,
    color: 'red',
    exams: [
      { id: 'ecg', name: 'Eletrocardiograma', category: 'cardiologicos', sus: '0211020028' },
      { id: 'ecocardiograma', name: 'Ecocardiograma', category: 'cardiologicos', sus: '0205020016' },
      { id: 'holter24h', name: 'Holter 24h', category: 'cardiologicos', sus: '0211050032' },
      { id: 'mapa', name: 'MAPA', category: 'cardiologicos', sus: '0211050040' },
      { id: 'teste-ergometrico', name: 'Teste Ergométrico', category: 'cardiologicos', sus: '0211020044' },
    ]
  },
  {
    id: 'outros',
    name: 'Outros',
    icon: Stethoscope,
    color: 'emerald',
    exams: [
      { id: 'espirometria', name: 'Espirometria', category: 'outros', sus: '0211070011' },
      { id: 'endoscopia', name: 'Endoscopia Digestiva Alta', category: 'outros', sus: '0201010135' },
      { id: 'colonoscopia', name: 'Colonoscopia', category: 'outros', sus: '0201010046' },
      { id: 'papanicolau', name: 'Papanicolau', category: 'outros', sus: '0203010019' },
    ]
  },
];

interface ExamRequestPanelProps {
  patientName?: string;
  doctorName?: string;
  onExamRequested?: (examIds: string[]) => void;
}

export function ExamRequestPanel({
  patientName,
  doctorName,
  onExamRequested
}: ExamRequestPanelProps) {
  const [selectedExams, setSelectedExams] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const toggleExam = (examId: string) => {
    setSelectedExams(prev =>
      prev.includes(examId)
        ? prev.filter(id => id !== examId)
        : [...prev, examId]
    );
  };

  const clearSelection = () => setSelectedExams([]);

  const allExams = EXAM_CATALOG.flatMap(cat => cat.exams);

  const filteredExams = allExams.filter(exam =>
    exam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    exam.sus?.includes(searchTerm) ||
    exam.tuss?.includes(searchTerm)
  );

  const selectedExamDetails = allExams.filter(exam => selectedExams.includes(exam.id));

  const handleRequestExams = async () => {
    if (selectedExams.length === 0) {
      toast.error('Selecione pelo menos um exame');
      return;
    }

    setIsLoading(true);

    try {
      const examData = selectedExamDetails.map(exam => ({
        id: exam.id,
        nome: exam.name,
        categoria: exam.category,
        codigoSUS: exam.sus,
        codigoTUSS: exam.tuss,
        preparacao: exam.preparacao
      }));

      const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

      const prescriberResponse = await fetch(`${BACKEND_URL}/api/memed/prescriber/upsert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          externalId: 'doctor-default-001',
          name: doctorName || 'Dr. Médico Exemplo',
          cpf: '12345678900',
          professionalId: '123456',
          state: 'SP',
          specialtyId: 1,
        }),
      });

      if (!prescriberResponse.ok) {
        throw new Error('Falha ao obter token do médico');
      }

      const prescriberData = await prescriberResponse.json();
      const doctorToken = prescriberData.data.token;

      const protocolResponse = await fetch(`${BACKEND_URL}/api/memed/protocol`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userToken: doctorToken,
          name: `Solicitação de Exames - ${patientName || 'Paciente'} - ${new Date().toLocaleDateString('pt-BR')}`,
          exams: examData,
        }),
      });

      if (!protocolResponse.ok) {
        throw new Error('Falha ao criar solicitação de exames');
      }

      await protocolResponse.json();

      toast.success('Solicitação criada com sucesso!', {
        description: `${selectedExams.length} exame(s) solicitado(s) para ${patientName}`,
      });

      if (onExamRequested) {
        onExamRequested(selectedExams);
      }

      clearSelection();

    } catch (error: any) {
      console.error('Erro ao solicitar exames:', error);
      toast.error('Erro ao criar solicitação', {
        description: error.message || 'Tente novamente',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryColor = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-500',
      purple: 'bg-purple-500',
      red: 'bg-red-500',
      emerald: 'bg-emerald-500',
    };
    return colors[color] || 'bg-gray-500';
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header Premium */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                <FlaskConical className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Solicitação de Exames</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  Paciente: <span className="font-semibold text-gray-700">{patientName || 'Não informado'}</span>
                </p>
              </div>
            </div>
            <AnimatePresence>
              {selectedExams.length > 0 && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                >
                  <Badge className="bg-blue-600 text-white px-4 py-2 text-base">
                    {selectedExams.length} selecionado{selectedExams.length > 1 ? 's' : ''}
                  </Badge>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Search Bar */}
          <div className="mt-6 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Buscar por nome, código SUS ou TUSS..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 text-base bg-gray-50 border-gray-200 focus:bg-white transition-colors"
            />
          </div>

          {/* Category Pills */}
          <ScrollArea className="w-full mt-4">
            <div className="flex gap-2 pb-2">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
                className={cn(
                  "rounded-full px-4 font-semibold transition-all",
                  selectedCategory === null && "bg-gray-900 hover:bg-gray-800 shadow-md"
                )}
              >
                Todos os Exames
              </Button>
              {EXAM_CATALOG.map(category => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    "rounded-full px-4 font-semibold transition-all",
                    selectedCategory === category.id && `${getCategoryColor(category.color)} hover:opacity-90 text-white shadow-md`
                  )}
                >
                  <category.icon className="w-4 h-4 mr-2" />
                  {category.name}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Exam List */}
          <div className="lg:col-span-2">
            <ScrollArea className="h-[calc(100vh-360px)]">
              <div className="space-y-6 pr-4">
                {searchTerm ? (
                  /* Search Results */
                  <div>
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4">
                      {filteredExams.length} Resultado{filteredExams.length !== 1 ? 's' : ''}
                    </h3>
                    <div className="grid gap-3">
                      {filteredExams.map(exam => (
                        <ExamCard
                          key={exam.id}
                          exam={exam}
                          isSelected={selectedExams.includes(exam.id)}
                          onToggle={() => toggleExam(exam.id)}
                          color={EXAM_CATALOG.find(c => c.id === exam.category)?.color || 'gray'}
                        />
                      ))}
                    </div>
                    {filteredExams.length === 0 && (
                      <div className="text-center py-16">
                        <AlertCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <p className="text-gray-500 font-medium">Nenhum exame encontrado</p>
                        <p className="text-sm text-gray-400 mt-1">Tente outro termo de busca</p>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Category View */
                  EXAM_CATALOG
                    .filter(cat => selectedCategory === null || cat.id === selectedCategory)
                    .map(category => (
                      <div key={category.id}>
                        <div className="flex items-center gap-3 mb-4">
                          <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", getCategoryColor(category.color))}>
                            <category.icon className="w-5 h-5 text-white" />
                          </div>
                          <h3 className="text-lg font-bold text-gray-900">{category.name}</h3>
                          <span className="text-xs text-gray-400 font-medium">
                            ({category.exams.length} exames)
                          </span>
                        </div>
                        <div className="grid gap-3">
                          {category.exams.map(exam => (
                            <ExamCard
                              key={exam.id}
                              exam={exam}
                              isSelected={selectedExams.includes(exam.id)}
                              onToggle={() => toggleExam(exam.id)}
                              color={category.color}
                            />
                          ))}
                        </div>
                      </div>
                    ))
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Right: Selected Summary */}
          <div className="lg:col-span-1">
            <Card className="h-[calc(100vh-360px)] flex flex-col border-2 border-gray-200 shadow-lg">
              <CardHeader className="pb-4 border-b bg-gradient-to-r from-blue-50 to-purple-50">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    Selecionados
                  </h3>
                  {selectedExams.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearSelection}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Limpar
                    </Button>
                  )}
                </div>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col p-0">
                {selectedExams.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center text-center p-6">
                    <div>
                      <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                        <Plus className="w-10 h-10 text-gray-300" />
                      </div>
                      <p className="text-sm font-medium text-gray-500">Nenhum exame selecionado</p>
                      <p className="text-xs text-gray-400 mt-1">Clique nos exames à esquerda</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <ScrollArea className="flex-1 p-4">
                      <AnimatePresence mode="popLayout">
                        <div className="space-y-2">
                          {selectedExamDetails.map((exam, idx) => (
                            <motion.div
                              key={exam.id}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              className="group bg-gradient-to-r from-blue-50 to-white border-2 border-blue-200 rounded-lg p-3 hover:shadow-md transition-all"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  <p className="font-bold text-blue-900 text-sm flex items-center gap-2">
                                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 text-white text-xs">
                                      {idx + 1}
                                    </span>
                                    {exam.name}
                                  </p>
                                  {exam.sus && (
                                    <p className="text-xs text-blue-600 mt-1 font-mono">SUS {exam.sus}</p>
                                  )}
                                  {exam.preparacao && (
                                    <p className="text-xs text-gray-600 mt-1 flex items-start gap-1">
                                      <Sparkles className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                      <span className="italic">{exam.preparacao}</span>
                                    </p>
                                  )}
                                </div>
                                <button
                                  onClick={() => toggleExam(exam.id)}
                                  className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-full bg-red-100 hover:bg-red-200 flex items-center justify-center transition-all"
                                >
                                  <X className="w-4 h-4 text-red-600" />
                                </button>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </AnimatePresence>
                    </ScrollArea>

                    <div className="p-4 border-t bg-gray-50 space-y-3">
                      <Button
                        onClick={handleRequestExams}
                        disabled={isLoading}
                        className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold shadow-lg hover:shadow-xl transition-all"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Gerando Solicitação...
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-5 h-5 mr-2" />
                            Gerar Solicitação ({selectedExams.length})
                          </>
                        )}
                      </Button>
                      <p className="text-xs text-center text-gray-500">
                        Protocolo será criado via <span className="font-semibold">MEMED API</span>
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

// Exam Card Component
function ExamCard({
  exam,
  isSelected,
  onToggle,
  color
}: {
  exam: ExamItem;
  isSelected: boolean;
  onToggle: () => void;
  color: string;
}) {
  const getBorderColor = () => {
    const colors: Record<string, string> = {
      blue: 'border-blue-500 bg-blue-50',
      purple: 'border-purple-500 bg-purple-50',
      red: 'border-red-500 bg-red-50',
      emerald: 'border-emerald-500 bg-emerald-50',
    };
    return colors[color] || 'border-gray-500 bg-gray-50';
  };

  return (
    <motion.label
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={cn(
        "flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all group",
        isSelected
          ? `${getBorderColor()} shadow-md ring-2 ring-offset-2 ${color === 'blue' ? 'ring-blue-300' : color === 'purple' ? 'ring-purple-300' : color === 'red' ? 'ring-red-300' : 'ring-emerald-300'}`
          : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm"
      )}
    >
      <Checkbox
        checked={isSelected}
        onCheckedChange={onToggle}
        className="mt-1"
      />
      <div className="flex-1 min-w-0">
        <p className={cn(
          "text-sm font-bold leading-tight",
          isSelected ? `${color === 'blue' ? 'text-blue-900' : color === 'purple' ? 'text-purple-900' : color === 'red' ? 'text-red-900' : 'text-emerald-900'}` : "text-gray-700"
        )}>
          {exam.name}
        </p>
        <div className="flex flex-wrap gap-2 mt-2">
          {exam.sus && (
            <Badge variant="outline" className="text-xs font-mono bg-white">
              SUS {exam.sus}
            </Badge>
          )}
          {exam.tuss && (
            <Badge variant="outline" className="text-xs font-mono bg-white">
              TUSS {exam.tuss}
            </Badge>
          )}
        </div>
        {exam.preparacao && (
          <p className="text-xs text-gray-600 mt-2 flex items-start gap-1">
            <Sparkles className="w-3 h-3 mt-0.5 flex-shrink-0 text-amber-500" />
            <span className="italic">{exam.preparacao}</span>
          </p>
        )}
      </div>
    </motion.label>
  );
}
