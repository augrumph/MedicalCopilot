import React, { useState, memo } from 'react';
import { FileText, Sparkles, Download, AlertTriangle } from 'lucide-react';

type DocumentType = 'declaration' | 'report' | 'referral' | 'other';

interface PsychologicalDocumentationCardProps {
  clientName: string;
  onGenerate: (document: string, type: DocumentType) => void;
}

const PsychologicalDocumentationCard: React.FC<PsychologicalDocumentationCardProps> = ({ 
  clientName, 
  onGenerate 
}) => {
  const [selectedType, setSelectedType] = useState<DocumentType>('declaration');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');

  const documentTypes: { value: DocumentType; label: string; description: string }[] = [
    { value: 'declaration', label: 'Declaração', description: 'Declaração de comparecimento' },
    { value: 'report', label: 'Relatório', description: 'Relatório de acompanhamento clínico' },
    { value: 'referral', label: 'Encaminhamento', description: 'Carta de encaminhamento para outros profissionais' },
    { value: 'other', label: 'Outro', description: 'Outros documentos psicológicos' },
  ];

  const generateDocument = async () => {
    setIsGenerating(true);
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // This would actually call an AI service in a real implementation
    const documentContent = `Documento de ${documentTypes.find(t => t.value === selectedType)?.label.toLowerCase()} para ${clientName}\n\n`;
    
    setGeneratedContent(documentContent);
    onGenerate(documentContent, selectedType);
    setIsGenerating(false);
  };

  const downloadDocument = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${selectedType}_${clientName.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-5 h-5 text-blue-600" />
        <h3 className="font-bold text-gray-800 text-lg">Documentos Psicológicos</h3>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        {documentTypes.map((type) => (
          <button
            key={type.value}
            onClick={() => setSelectedType(type.value)}
            className={`p-3 rounded-lg border text-left ${
              selectedType === type.value
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:bg-gray-50'
            }`}
          >
            <div className="font-medium">{type.label}</div>
            <div className="text-xs text-gray-600 mt-1">{type.description}</div>
          </button>
        ))}
      </div>

      <div className="flex gap-2 mb-4">
        <button
          onClick={generateDocument}
          disabled={isGenerating}
          className="flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-200 disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4" />
          {isGenerating ? 'Gerando...' : 'Gerar Documento'}
        </button>

        {generatedContent && (
          <button
            onClick={downloadDocument}
            className="flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200"
          >
            <Download className="w-4 h-4" />
            Baixar
          </button>
        )}
      </div>

      {generatedContent && (
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
          <h4 className="font-semibold text-gray-700 mb-2">
            Documento Gerado ({documentTypes.find(t => t.value === selectedType)?.label})
          </h4>
          <pre className="whitespace-pre-wrap font-sans text-sm text-gray-700 max-h-40 overflow-y-auto">
            {generatedContent}
          </pre>
          
          <div className="mt-3 pt-3 border-t border-gray-200 flex items-center gap-2 text-xs text-yellow-600">
            <AlertTriangle className="w-3 h-3 flex-shrink-0" />
            Lembrete: Revise e edite o conteúdo antes de assinar. A IA serve apenas como ferramenta de apoio.
          </div>
        </div>
      )}

      {!generatedContent && (
        <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
          <FileText className="w-8 h-8 mx-auto text-gray-400 mb-2" />
          <p>Selecione o tipo de documento e clique em "Gerar Documento"</p>
        </div>
      )}
    </div>
  );
};

export default memo(PsychologicalDocumentationCard);