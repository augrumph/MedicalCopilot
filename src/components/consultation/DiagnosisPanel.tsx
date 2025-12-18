import { Lightbulb, AlertCircle, AlertTriangle, ChevronDown, ChevronUp, CheckCircle, XCircle, Check, X} from'lucide-react';
import { Card, CardContent, CardHeader, CardTitle} from'@/components/ui/card';
import { motion, AnimatePresence} from'framer-motion';
import { useState} from'react';

interface DiagnosisItem {
 condition: string;
 explanation: string;
 scientificBasis: string[];
 confirmatoryTests?: string[];
 exclusionCriteria?: string[];
 probability?:'alta' |'moderada' |'baixa';
 severity?:'baixa' |'media' |'alta';
 keyIndicators?: string[];
}

interface DiagnosisPanelProps {
 mostLikely: DiagnosisItem[];
 possible: DiagnosisItem[];
 cantMiss: DiagnosisItem[];
}

export function DiagnosisPanel({ mostLikely, possible, cantMiss}: DiagnosisPanelProps) {
 if (!mostLikely?.length && !possible?.length && !cantMiss?.length) {
 return null;
}

 const sections = [
 {
 title:'Mais Prováveis',
 items: mostLikely,
 icon: Lightbulb,
 color:'text-green-500',
 bgColor:'bg-green-500/10',
 borderColor:'border-green-500/20',
},
 {
 title:'Possíveis',
 items: possible,
 icon: AlertCircle,
 color:'text-blue-500',
 bgColor:'bg-blue-500/10',
 borderColor:'border-blue-500/20',
},
 {
 title:'Não Pode Esquecer',
 items: cantMiss,
 icon: AlertTriangle,
 color:'text-orange-500',
 bgColor:'bg-orange-500/10',
 borderColor:'border-orange-500/20',
},
 ];

 const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

 const toggleItem = (section: string, index: number) => {
 const key = `${section}-${index}`;
 setExpandedItems(prev => ({
 ...prev,
 [key]: !prev[key]
}));
};

 return (
 <Card>
 <CardHeader>
 <CardTitle className="text-lg">Hipóteses Diagnósticas</CardTitle>
 </CardHeader>
 <CardContent className="space-y-4">
 {sections.map((section, sectionIdx) => {
 if (!section.items || section.items.length === 0) return null;

 const Icon = section.icon;

 return (
 <motion.div
 key={section.title}
 initial={{ opacity: 0, x: -10}}
 animate={{ opacity: 1, x: 0}}
 transition={{ delay: sectionIdx * 0.1}}
 >
 <Card className={`${section.borderColor} ${section.bgColor}`}>
 <CardHeader className="pb-3">
 <div className="flex items-center gap-2">
 <Icon className={`h-5 w-5 ${section.color}`} />
 <h3 className="font-semibold">{section.title}</h3>
 </div>
 </CardHeader>
 <CardContent className="space-y-3">
 {section.items.map((item, idx) => {
 const key = `${section.title}-${idx}`;
 const isExpanded = expandedItems[key] || false;

 return (
 <motion.div
 key={idx}
 initial={{ opacity: 0, x: -5}}
 animate={{ opacity: 1, x: 0}}
 transition={{ delay: sectionIdx * 0.1 + idx * 0.05}}
 >
 <Card
 className={`border transition-all duration-200 ${
 isExpanded
 ?'border-primary/50 bg-primary/5 shadow-sm'
 :'border-transparent'
}`}
 >
 <button
 className="w-full text-left p-3 space-y-2 focus:outline-none"
 onClick={() => toggleItem(section.title, idx)}
 aria-expanded={isExpanded}
 aria-label={`${item.condition}, ${isExpanded ?'recolhido' :'expandido'}`}
 >
 <div className="flex items-center justify-between">
 <h4 className="font-medium text-sm">{item.condition}</h4>
 <div className="flex items-center gap-2">
 <span className="text-xs text-muted-foreground">
 {isExpanded ?'Recolher' :'Expandir'}
 </span>
 {isExpanded ?
 <ChevronUp className="h-4 w-4 text-primary" /> :
 <ChevronDown className="h-4 w-4 text-muted-foreground" />
}
 </div>
 </div>

 <p className="text-xs text-muted-foreground">
 {item.explanation}
 </p>

 <AnimatePresence>
 {isExpanded && (
 <motion.div
 initial={{ opacity: 0, height: 0}}
 animate={{ opacity: 1, height:'auto'}}
 exit={{ opacity: 0, height: 0}}
 transition={{ duration: 0.3}}
 className="pt-3 mt-3 space-y-4 border-t border-muted"
 >
 <div>
 <h5 className="font-medium text-xs mb-2 flex items-center gap-1.5">
 <Lightbulb className="h-3.5 w-3.5 text-primary" />
 Base Científica
 </h5>
 <ul className="space-y-1.5">
 {item.scientificBasis.map((basis, basisIdx) => (
 <li
 key={basisIdx}
 className="text-xs flex items-start gap-2 p-2 rounded-md bg-muted/30"
 >
 <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
 <span>{basis}</span>
 </li>
 ))}
 </ul>
 </div>

 {item.confirmatoryTests && item.confirmatoryTests.length > 0 && (
 <div>
 <h5 className="font-medium text-xs mb-2 flex items-center gap-1.5">
 <CheckCircle className="h-3.5 w-3.5 text-green-600" />
 Para Confirmar
 </h5>
 <ul className="space-y-1.5">
 {item.confirmatoryTests.map((test, testIdx) => (
 <li
 key={testIdx}
 className="text-xs flex items-start gap-2 p-2 rounded-md bg-green-500/10 border border-green-500/20"
 >
 <Check className="h-3.5 w-3.5 text-green-600 mt-0.5 flex-shrink-0" />
 <span>{test}</span>
 </li>
 ))}
 </ul>
 </div>
 )}

 {item.exclusionCriteria && item.exclusionCriteria.length > 0 && (
 <div>
 <h5 className="font-medium text-xs mb-2 flex items-center gap-1.5">
 <XCircle className="h-3.5 w-3.5 text-destructive" />
 Para Excluir
 </h5>
 <ul className="space-y-1.5">
 {item.exclusionCriteria.map((criteria, criteriaIdx) => (
 <li
 key={criteriaIdx}
 className="text-xs flex items-start gap-2 p-2 rounded-md bg-destructive/10 border border-destructive/20"
 >
 <X className="h-3.5 w-3.5 text-destructive mt-0.5 flex-shrink-0" />
 <span>{criteria}</span>
 </li>
 ))}
 </ul>
 </div>
 )}
 </motion.div>
 )}
 </AnimatePresence>
 </button>
 </Card>
 </motion.div>
 );
})}
 </CardContent>
 </Card>
 </motion.div>
 );
})}
 </CardContent>
 </Card>
 );
}
