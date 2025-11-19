import React, { useState, memo } from 'react';
import { Edit3, Sparkles, Save, Check, AlertTriangle } from 'lucide-react';

interface PsychologyNoteCardProps {
  client: {
    name: string;
    sessionDate: string;
    sessionType: string;
  };
  initialNote?: string;
  onSave?: (note: string) => void;
}

const PsychologyNoteCard: React.FC<PsychologyNoteCardProps> = ({ client, initialNote = '', onSave }) => {
  const [note, setNote] = useState(initialNote);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [generatedContent, setGeneratedContent] = useState('');

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate saving process
    await new Promise(resolve => setTimeout(resolve, 500));
    onSave?.(note);
    setIsSaving(false);
    setIsEditing(false);
  };

  const handleGenerate = async () => {
    // Simulate AI generation
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // This would actually call an AI service in a real implementation
    const aiSuggestion = `Resumo da sessão com ${client.name} em ${client.sessionDate}.\n\nTemas abordados: [temas relevantes]\n\nIntervenções utilizadas: [intervenções]\n\nPróximos passos: [metas para próxima sessão]\n\nObservações: [notas clínicas relevantes]`;
    
    setGeneratedContent(aiSuggestion);
    setNote(prev => prev + (prev ? '\n\n' : '') + aiSuggestion);
    setIsSaving(false);
  };

  return (
    <div className="bg-white rounded-lg p-5 border border-gray-200 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-gray-800 text-lg">Anotações da Sessão</h3>
          <p className="text-gray-600 text-sm">
            {client.name} • {client.sessionDate} • {client.sessionType}
          </p>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className={`p-2 rounded-lg flex items-center gap-2 ${
              isEditing 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            {isEditing ? 'Editar' : 'Ver'}
          </button>
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-4">
          <div className="flex justify-between">
            <button
              onClick={handleGenerate}
              disabled={isSaving}
              className="flex items-center gap-2 bg-purple-100 text-purple-700 px-3 py-1.5 rounded-lg text-sm hover:bg-purple-200 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              {isSaving ? 'Gerando...' : 'Ajuda da IA'}
            </button>
            
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-sm hover:bg-green-200 disabled:opacity-50"
            >
              {isSaving ? <Save className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              {isSaving ? 'Salvando...' : 'Salvar Nota'}
            </button>
          </div>

          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full h-64 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Escreva as anotações da sessão aqui..."
          />

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <AlertTriangle className="w-3 h-3" />
            Lembre-se: A IA gera rascunhos. Revise e edite antes de finalizar.
          </div>
        </div>
      ) : (
        <div className="prose max-w-none">
          {note ? (
            <pre className="whitespace-pre-wrap font-sans text-gray-700">
              {note}
            </pre>
          ) : (
            <p className="text-gray-500 italic">Nenhuma anotação registrada ainda.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default memo(PsychologyNoteCard);