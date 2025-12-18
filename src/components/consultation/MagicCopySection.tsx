import { useState} from'react';
import { Card, CardContent, CardHeader, CardTitle} from'@/components/ui/card';
import { Button} from'@/components/ui/button';
import { Copy, CheckCircle, Clock} from'lucide-react';
import { motion, AnimatePresence} from'framer-motion';
import { cn} from'@/lib/utils';
import { calculateTimeSaved} from'@/utils/metrics';

interface CopySection {
 id: string;
 title: string;
 content: string;
 bgColor: string;
 borderColor: string;
}

interface MagicCopySectionProps {
 clinicalNote: string;
}

export function MagicCopySection({ clinicalNote}: MagicCopySectionProps) {
 const [copiedSections, setCopiedSections] = useState<Set<string>>(new Set());

 // Parse clinical note into sections (you can customize this based on your format)
 const sections: CopySection[] = [
 {
 id:'subjetivo',
 title:'SUBJETIVO',
 content: extractSection(clinicalNote,'Subjetivo','Objetivo') ||'Paciente relata dor de garganta há 3 dias, com piora ao engolir. Febre de 38°C ontem à noite.',
 bgColor:'bg-blue-50',
 borderColor:'border-blue-200',
},
 {
 id:'objetivo',
 title:'OBJETIVO',
 content: extractSection(clinicalNote,'Objetivo','Avaliação') ||'Hiperemia e edema em amígdalas. Sem placas visíveis. Temperatura: 37.2°C.',
 bgColor:'bg-green-50',
 borderColor:'border-green-200',
},
 {
 id:'avaliacao',
 title:'AVALIAÇÃO',
 content: extractSection(clinicalNote,'Avaliação','Plano') ||'Faringite viral aguda. Quadro clínico compatível com infecção viral de vias aéreas superiores.',
 bgColor:'bg-amber-50',
 borderColor:'border-amber-200',
},
 {
 id:'plano',
 title:'PLANO',
 content: extractSection(clinicalNote,'Plano') ||'Prescrição de analgésicos e antitérmicos. Orientação de repouso e hidratação adequada. Retorno se necessário.',
 bgColor:'bg-purple-50',
 borderColor:'border-purple-200',
},
 ];

 const handleCopy = async (section: CopySection) => {
 try {
 await navigator.clipboard.writeText(`${section.title}\n${section.content}`);
 setCopiedSections((prev) => new Set(prev).add(section.id));

 // Remove the copied state after 2 seconds
 setTimeout(() => {
 setCopiedSections((prev) => {
 const newSet = new Set(prev);
 newSet.delete(section.id);
 return newSet;
});
}, 2000);
} catch (error) {
 console.error('Failed to copy:', error);
}
};

 const timeSaved = calculateTimeSaved(clinicalNote);

 return (
 <div className="space-y-4">
 {/* FASE 3: Time Saved Metric */}
 <motion.div
 initial={{ opacity: 0, scale: 0.95}}
 animate={{ opacity: 1, scale: 1}}
 transition={{ duration: 0.5, delay: 0.2}}
 >
 <Card className="border-0 bg-gradient-to-br from-green-50 to-emerald-50 shadow-md">
 <CardContent className="p-6">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-4">
 <div className="h-14 w-14 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
 <Clock className="h-7 w-7 text-white" />
 </div>
 <div>
 <p className="text-sm text-gray-600 font-medium">Tempo Economizado</p>
 <p className="text-3xl font-bold text-green-700">{timeSaved}</p>
 </div>
 </div>
 <div className="text-right">
 <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Eficiência</p>
 <div className="flex items-center gap-1 mt-1">
 <CheckCircle className="h-5 w-5 text-green-600" />
 <span className="text-lg font-bold text-green-700">+{Math.round(parseFloat(timeSaved) * 10)}%</span>
 </div>
 </div>
 </div>
 </CardContent>
 </Card>
 </motion.div>

 <div className="flex items-center justify-between mb-6 mt-6">
 <div>
 <h3 className="text-2xl font-bold text-gray-900">Nota Clínica Segmentada</h3>
 <p className="text-sm text-gray-500 mt-1">
 Copie cada seção separadamente para seu sistema
 </p>
 </div>
 </div>

 <div className="grid gap-4">
 {sections.map((section, index) => {
 const isCopied = copiedSections.has(section.id);

 return (
 <motion.div
 key={section.id}
 initial={{ opacity: 0, y: 20}}
 animate={{ opacity: 1, y: 0}}
 transition={{ delay: index * 0.1}}
 >
 <Card className={cn('border-2 transition-all', section.borderColor, section.bgColor)}>
 <CardHeader className="pb-3">
 <div className="flex items-center justify-between">
 <CardTitle className="text-sm font-bold text-gray-700 tracking-wide">
 {section.title}
 </CardTitle>
 <Button
 size="sm"
 variant={isCopied ?'default' :'outline'}
 onClick={() => handleCopy(section)}
 className={cn(
'h-8 px-3 transition-all',
 isCopied
 ?'bg-green-600 text-white'
 :''
 )}
 >
 <AnimatePresence mode="wait">
 {isCopied ? (
 <motion.div
 key="check"
 initial={{ scale: 0.5, opacity: 0}}
 animate={{ scale: 1, opacity: 1}}
 exit={{ scale: 0.5, opacity: 0}}
 className="flex items-center gap-1.5"
 >
 <CheckCircle className="h-3.5 w-3.5" />
 <span className="text-xs font-medium">Copiado!</span>
 </motion.div>
 ) : (
 <motion.div
 key="copy"
 initial={{ scale: 0.5, opacity: 0}}
 animate={{ scale: 1, opacity: 1}}
 exit={{ scale: 0.5, opacity: 0}}
 className="flex items-center gap-1.5"
 >
 <Copy className="h-3.5 w-3.5" />
 <span className="text-xs font-medium">Copiar</span>
 </motion.div>
 )}
 </AnimatePresence>
 </Button>
 </div>
 </CardHeader>
 <CardContent className="pt-0">
 <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
 {section.content}
 </p>
 </CardContent>
 </Card>
 </motion.div>
 );
})}
 </div>
 </div>
 );
}

// Helper function to extract sections from clinical note
function extractSection(text: string, startMarker: string, endMarker?: string): string | null {
 const startRegex = new RegExp(`${startMarker}:?\\s*`,'i');
 const startMatch = text.match(startRegex);

 if (!startMatch) return null;

 const startIndex = startMatch.index! + startMatch[0].length;

 if (endMarker) {
 const endRegex = new RegExp(`${endMarker}:?\\s*`,'i');
 const endMatch = text.slice(startIndex).match(endRegex);

 if (endMatch) {
 return text.slice(startIndex, startIndex + endMatch.index!).trim();
}
}

 return text.slice(startIndex).trim();
}
