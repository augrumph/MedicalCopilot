import { useState, useEffect} from'react';
import { FileText, Loader2, CheckCircle2, Clock} from'lucide-react';
import { ScrollArea} from'@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle} from'@/components/ui/card';
import { Badge} from'@/components/ui/badge';
import { Separator} from'@/components/ui/separator';
import { motion, AnimatePresence} from'framer-motion';
import { generateRealtimeSOAP, type RealtimeSOAP} from'@/lib/mockApi';
import { cn} from'@/lib/utils';

interface RealtimeSOAPPanelProps {
 transcript: string;
 isActive: boolean;
}

export function RealtimeSOAPPanel({ transcript, isActive}: RealtimeSOAPPanelProps) {
 const [soap, setSOAP] = useState<RealtimeSOAP>({
 subjective:'',
 objective:'',
 assessment:'',
 plan:'',
 isComplete: false,
 lastUpdated: new Date().toISOString()
});
 const [isGenerating, setIsGenerating] = useState(false);

 // Gera SOAP em tempo real conforme a transcrição avança
 useEffect(() => {
 if (!isActive || !transcript || transcript.length < 20) return;

 const timer = setTimeout(async () => {
 setIsGenerating(true);
 try {
 const newSOAP = await generateRealtimeSOAP(transcript);
 setSOAP(newSOAP);
} catch (error) {
 console.error('Erro ao gerar SOAP:', error);
} finally {
 setIsGenerating(false);
}
}, 2000); // Aguarda 2 segundos após última alteração

 return () => clearTimeout(timer);
}, [transcript, isActive]);

 const SOAPSection = ({
 title,
 letter,
 content,
 color,
 icon: Icon
}: {
 title: string;
 letter: string;
 content: string;
 color: string;
 icon: any;
}) => {
 const isEmpty = !content || content.trim() ==='';

 return (
 <motion.div
 initial={{ opacity: 0, y: 20}}
 animate={{ opacity: 1, y: 0}}
 transition={{ duration: 0.3}}
 className="mb-6"
 >
 <Card className={cn(
"border-l-4 transition-all duration-300",
 isEmpty ?"border-l-gray-300 bg-gray-50/50" : `border-l-${color}-500`
 )}>
 <CardHeader className="pb-3">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-3">
 <div className={cn(
"h-10 w-10 rounded-lg flex items-center justify-center shadow-sm",
 isEmpty
 ?"bg-gray-200 text-gray-400"
 : `bg-gradient-to-br from-${color}-500 to-${color}-600 text-white`
 )}>
 {isEmpty ? (
 <Clock className="h-5 w-5" />
 ) : (
 <Icon className="h-5 w-5" />
 )}
 </div>
 <div>
 <CardTitle className="text-lg font-bold">
 <span className={cn(
"text-2xl font-black mr-2",
 isEmpty ?"text-gray-400" : `text-${color}-600`
 )}>
 {letter}
 </span>
 {title}
 </CardTitle>
 <p className="text-xs text-gray-500 mt-0.5">
 {isEmpty ?'Aguardando dados...' :'Sendo preenchido automaticamente'}
 </p>
 </div>
 </div>
 {!isEmpty && (
 <Badge variant="outline" className={`bg-${color}-50 text-${color}-700 border-${color}-200`}>
 <CheckCircle2 className="h-3 w-3 mr-1" />
 Ativo
 </Badge>
 )}
 </div>
 </CardHeader>
 <CardContent className="pb-4">
 {isEmpty ? (
 <div className="text-center py-8 text-gray-400">
 <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
 <p className="text-sm">Aguardando informações da consulta...</p>
 </div>
 ) : (
 <div className="prose prose-sm max-w-none">
 <div
 className="text-gray-700 leading-relaxed whitespace-pre-line"
 dangerouslySetInnerHTML={{ __html: content.replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>')}}
 />
 </div>
 )}
 </CardContent>
 </Card>
 </motion.div>
 );
};

 return (
 <div className="h-full flex flex-col bg-gradient-to-br from-blue-50/30 to-purple-50/30">
 {/* Header */}
 <div className="flex-none p-6 pb-4">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-3">
 <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
 <FileText className="h-6 w-6 text-white" />
 </div>
 <div>
 <h3 className="font-bold text-xl text-gray-900">SOAP em Tempo Real</h3>
 <p className="text-sm text-gray-500">Documentação automática da consulta</p>
 </div>
 </div>
 <AnimatePresence>
 {isGenerating && (
 <motion.div
 initial={{ opacity: 0, scale: 0.8}}
 animate={{ opacity: 1, scale: 1}}
 exit={{ opacity: 0, scale: 0.8}}
 className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-sm"
 >
 <Loader2 className="h-3 w-3 animate-spin" />
 Atualizando...
 </motion.div>
 )}
 </AnimatePresence>
 </div>

 <Separator className="mt-4" />

 <div className="mt-4 flex items-center gap-2">
 <Badge variant="outline" className={cn(
"transition-colors",
 soap.isComplete ?"bg-green-50 text-green-700 border-green-200" :"bg-amber-50 text-amber-700 border-amber-200"
 )}>
 {soap.isComplete ? (
 <>
 <CheckCircle2 className="h-3 w-3 mr-1" />
 SOAP Completo
 </>
 ) : (
 <>
 <Clock className="h-3 w-3 mr-1" />
 Em Andamento
 </>
 )}
 </Badge>
 <span className="text-xs text-gray-400">
 Última atualização: {new Date(soap.lastUpdated).toLocaleTimeString('pt-BR', {
 hour:'2-digit',
 minute:'2-digit'
})}
 </span>
 </div>
 </div>

 {/* Content */}
 <ScrollArea className="flex-1 px-6 pb-6">
 <SOAPSection
 title="SUBJETIVO"
 letter="S"
 content={soap.subjective}
 color="blue"
 icon={FileText}
 />

 <SOAPSection
 title="OBJETIVO"
 letter="O"
 content={soap.objective}
 color="green"
 icon={FileText}
 />

 <SOAPSection
 title="AVALIAÇÃO"
 letter="A"
 content={soap.assessment}
 color="amber"
 icon={FileText}
 />

 <SOAPSection
 title="PLANO"
 letter="P"
 content={soap.plan}
 color="purple"
 icon={FileText}
 />

 {/* Info Footer */}
 <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200 mt-6">
 <CardContent className="pt-6">
 <div className="flex items-start gap-3">
 <div className="h-8 w-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
 <Loader2 className="h-4 w-4" />
 </div>
 <div>
 <p className="font-semibold text-gray-900 mb-1">Documentação Automática</p>
 <p className="text-sm text-gray-600 leading-relaxed">
 O SOAP está sendo preenchido automaticamente durante a consulta.
 Ao finalizar, você poderá revisar e editar antes de salvar.
 </p>
 </div>
 </div>
 </CardContent>
 </Card>
 </ScrollArea>
 </div>
 );
}
