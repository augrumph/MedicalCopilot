import {
 Lightbulb,
 AlertCircle,
 AlertTriangle,
 ChevronDown,
 ChevronUp,
 Check,
 X,
 Info,
 TrendingUp,
 Shield,
 Activity
} from'lucide-react';
import { Card, CardContent, CardHeader} from'@/components/ui/card';
import { Badge} from'@/components/ui/badge';
import { useState} from'react';
import { motion, AnimatePresence} from'framer-motion';

interface DiagnosticHypothesisItem {
 condition: string;
 explanation: string;
 scientificBasis: string[];
 confirmatoryTests?: string[];
 exclusionCriteria?: string[];
 probability?:'alta' |'moderada' |'baixa';
 severity?:'baixa' |'media' |'alta';
 keyIndicators?: string[];
 references?: string[]; // Fontes bibliográficas (UpToDate, Medscape, WhiteBook, etc.)
}

interface ImprovedDiagnosisPanelProps {
 mostLikely: DiagnosticHypothesisItem[];
 possible: DiagnosticHypothesisItem[];
 cantMiss: DiagnosticHypothesisItem[];
}

const getProbabilityConfig = (probability?: string) => {
 switch (probability) {
 case'alta':
 return {
 color:'bg-primary text-primary-foreground',
 icon: TrendingUp,
 label:'Alta',
 percentage: 85,
 barColor:'bg-primary'
};
 case'moderada':
 return {
 color:'bg-secondary text-secondary-foreground',
 icon: Activity,
 label:'Moderada',
 percentage: 55,
 barColor:'bg-secondary'
};
 case'baixa':
 return {
 color:'bg-muted text-muted-foreground',
 icon: Activity,
 label:'Baixa',
 percentage: 25,
 barColor:'bg-muted-foreground'
};
 default:
 return {
 color:'bg-muted text-muted-foreground',
 icon: Activity,
 label:'N/A',
 percentage: 0,
 barColor:'bg-muted-foreground'
};
}
};

const getSeverityConfig = (severity?: string) => {
 switch (severity) {
 case'alta':
 return {
 color:'bg-destructive text-destructive-foreground',
 icon: AlertTriangle,
 label:'Crítico'
};
 case'media':
 return {
 color:'bg-warning text-warning-foreground',
 icon: AlertCircle,
 label:'Moderado'
};
 case'baixa':
 return {
 color:'bg-success text-success-foreground',
 icon: Shield,
 label:'Leve'
};
 default:
 return {
 color:'bg-muted text-muted-foreground',
 icon: Info,
 label:'N/A'
};
}
};

export function ImprovedDiagnosisPanel({ mostLikely, possible, cantMiss}: ImprovedDiagnosisPanelProps) {
 if (!mostLikely?.length && !possible?.length && !cantMiss?.length) {
 return null;
}

 const sections = [
 {
 title:'Mais Prováveis',
 items: mostLikely,
 icon: Lightbulb,
 bgColor:'bg-primary/5',
 borderColor:'border-primary/20',
 iconColor:'text-primary',
 iconBg:'bg-primary/10',
 badgeColor:'bg-primary text-primary-foreground',
 defaultOpen: true,
},
 {
 title:'Possíveis',
 items: possible,
 icon: AlertCircle,
 bgColor:'bg-muted/50',
 borderColor:'border-border',
 iconColor:'text-muted-foreground',
 iconBg:'bg-muted',
 badgeColor:'bg-muted text-muted-foreground',
 defaultOpen: false,
},
 {
 title:'Não Pode Esquecer',
 items: cantMiss,
 icon: AlertTriangle,
 bgColor:'bg-destructive/5',
 borderColor:'border-destructive/20',
 iconColor:'text-destructive',
 iconBg:'bg-destructive/10',
 badgeColor:'bg-destructive text-destructive-foreground',
 defaultOpen: false,
},
 ];

 const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>(
 sections.reduce((acc, section) => {
 acc[section.title] = section.defaultOpen;
 return acc;
}, {} as Record<string, boolean>)
 );

 const [expandedDiagnoses, setExpandedDiagnoses] = useState<Record<string, boolean>>({});

 const toggleSection = (title: string) => {
 setExpandedSections(prev => ({
 ...prev,
 [title]: !prev[title]
}));
};

 const toggleDiagnosis = (section: string, index: number) => {
 const key = `${section}-${index}`;
 setExpandedDiagnoses(prev => ({
 ...prev,
 [key]: !prev[key]
}));
};

 return (
 <div className="space-y-4">
 {sections.map((section) => {
 if (!section.items || section.items.length === 0) return null;

 const Icon = section.icon;
 const isSectionExpanded = expandedSections[section.title];

 return (
 <motion.div
 key={section.title}
 initial={{ opacity: 0, y: 10}}
 animate={{ opacity: 1, y: 0}}
 transition={{ duration: 0.3}}
 >
 <Card className={`border ${section.borderColor} overflow-hidden`}>
 {/* Section Header */}
 <div className={section.bgColor}>
 <CardHeader
 className="cursor-pointer py-3"
 onClick={() => toggleSection(section.title)}
 >
 <div className="flex items-center justify-between gap-3">
 <div className="flex items-center gap-2.5 flex-1">
 <div className={`${section.iconBg} rounded-md p-1.5`}>
 <Icon className={`h-4 w-4 ${section.iconColor}`} />
 </div>
 <h3 className="font-semibold text-sm">{section.title}</h3>
 </div>
 <div className="flex items-center gap-2 shrink-0">
 <Badge className={`${section.badgeColor} text-xs`}>
 {section.items.length}
 </Badge>
 <motion.div
 animate={{ rotate: isSectionExpanded ? 180 : 0}}
 transition={{ duration: 0.2}}
 >
 <ChevronDown className="h-4 w-4 text-muted-foreground" />
 </motion.div>
 </div>
 </div>
 </CardHeader>
 </div>

 {/* Section Content */}
 <AnimatePresence>
 {isSectionExpanded && (
 <motion.div
 initial={{ opacity: 0, height: 0}}
 animate={{ opacity: 1, height:'auto'}}
 exit={{ opacity: 0, height: 0}}
 transition={{ duration: 0.3, ease:'easeInOut'}}
 >
 <CardContent className="pt-4 space-y-3">
 {section.items.map((item, idx) => {
 const key = `${section.title}-${idx}`;
 const isDiagnosisExpanded = expandedDiagnoses[key] || false;
 const probabilityConfig = getProbabilityConfig(item.probability);
 const severityConfig = getSeverityConfig(item.severity);
 const ProbabilityIcon = probabilityConfig.icon;
 const SeverityIcon = severityConfig.icon;

 return (
 <motion.div
 key={idx}
 initial={{ opacity: 0, x: -10}}
 animate={{ opacity: 1, x: 0}}
 transition={{ delay: idx * 0.05}}
 >
 <Card className="border transition-colors duration-200">
 {/* Collapsed View */}
 {!isDiagnosisExpanded ? (
 <button
 className="w-full text-left p-3 focus:outline-none"
 onClick={() => toggleDiagnosis(section.title, idx)}
 >
 <div className="space-y-2.5">
 {/* Title and expand button */}
 <div className="flex items-start justify-between gap-3">
 <h4 className="font-semibold text-sm leading-snug flex-1">
 {item.condition}
 </h4>
 <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
 </div>

 {/* Probability & Severity badges */}
 <div className="flex flex-wrap gap-1.5">
 {item.probability && (
 <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${probabilityConfig.color}`}>
 <span>{probabilityConfig.label}</span>
 </div>
 )}
 {item.severity && (
 <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${severityConfig.color}`}>
 <SeverityIcon className="h-3 w-3" />
 <span>{severityConfig.label}</span>
 </div>
 )}
 </div>

 {/* Brief explanation */}
 <p className="text-xs text-muted-foreground leading-relaxed">
 {item.explanation.length > 120
 ? `${item.explanation.substring(0, 120)}...`
 : item.explanation}
 </p>
 </div>
 </button>
 ) : (
 /* Expanded View */
 <div className="p-3 space-y-3">
 {/* Header */}
 <div className="flex items-start justify-between gap-3">
 <h4 className="font-semibold text-sm leading-snug flex-1">
 {item.condition}
 </h4>
 <button
 onClick={() => toggleDiagnosis(section.title, idx)}
 className="rounded-md p-1 transition-colors"
 >
 <ChevronUp className="h-4 w-4 text-muted-foreground" />
 </button>
 </div>

 {/* Badges */}
 <div className="flex flex-wrap gap-1.5">
 {item.probability && (
 <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${probabilityConfig.color}`}>
 <ProbabilityIcon className="h-3 w-3" />
 <span>{probabilityConfig.label}</span>
 <span className="text-[10px] opacity-70">({probabilityConfig.percentage}%)</span>
 </div>
 )}
 {item.severity && (
 <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium ${severityConfig.color}`}>
 <SeverityIcon className="h-3 w-3" />
 <span>{severityConfig.label}</span>
 </div>
 )}
 </div>

 {/* Explanation */}
 <p className="text-xs text-muted-foreground leading-relaxed bg-muted/30 rounded-md p-2.5">
 {item.explanation}
 </p>

 {/* Confirmatory Tests */}
 {item.confirmatoryTests && item.confirmatoryTests.length > 0 && (
 <div className="bg-success/5 rounded-md p-3 border border-success/20">
 <h5 className="font-semibold text-xs mb-2 flex items-center gap-1.5 text-success">
 <Check className="h-3.5 w-3.5" />
 Próximos passos
 </h5>
 <ul className="space-y-1.5">
 {item.confirmatoryTests.map((test, testIdx) => (
 <li key={testIdx} className="flex items-start gap-2 text-xs">
 <div className="h-4 w-4 rounded-full bg-success/20 flex items-center justify-center shrink-0 mt-0.5">
 <Check className="h-2.5 w-2.5 text-success" />
 </div>
 <span className="leading-relaxed">{test}</span>
 </li>
 ))}
 </ul>
 </div>
 )}

 {/* Exclusion Criteria */}
 {item.exclusionCriteria && item.exclusionCriteria.length > 0 && (
 <div className="bg-warning/5 rounded-md p-3 border border-warning/20">
 <h5 className="font-semibold text-xs mb-2 flex items-center gap-1.5 text-warning">
 <X className="h-3.5 w-3.5" />
 Critérios de exclusão
 </h5>
 <ul className="space-y-1.5">
 {item.exclusionCriteria.map((criteria, criteriaIdx) => (
 <li key={criteriaIdx} className="flex items-start gap-2 text-xs">
 <div className="h-4 w-4 rounded-full bg-warning/20 flex items-center justify-center shrink-0 mt-0.5">
 <X className="h-2.5 w-2.5 text-warning" />
 </div>
 <span className="leading-relaxed">{criteria}</span>
 </li>
 ))}
 </ul>
 </div>
 )}

 {/* Scientific Basis / Clinical Reasoning */}
 {item.scientificBasis && item.scientificBasis.length > 0 && (
 <div className="bg-primary/5 rounded-md p-3 border border-primary/20">
 <h5 className="font-semibold text-xs mb-2 flex items-center gap-1.5 text-primary">
 <Info className="h-3.5 w-3.5" />
 Raciocínio Clínico
 </h5>
 <ul className="space-y-1.5">
 {item.scientificBasis.map((basis, basisIdx) => (
 <li key={basisIdx} className="flex items-start gap-2 text-xs leading-relaxed">
 <div className="h-4 w-4 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
 <span className="text-[10px] font-semibold text-primary">{basisIdx + 1}</span>
 </div>
 <span className="text-foreground/90">{basis}</span>
 </li>
 ))}
 </ul>
 </div>
 )}

 {/* Bibliographic References */}
 {item.references && item.references.length > 0 && (
 <div className="bg-muted/50 rounded-md p-3 border border-border">
 <h5 className="font-semibold text-xs mb-2 flex items-center gap-1.5">
 <Info className="h-3.5 w-3.5" />
 Fontes / Referências
 </h5>
 <ul className="space-y-1">
 {item.references.map((reference, refIdx) => (
 <li key={refIdx} className="flex items-start gap-1.5 text-xs">
 <span className="text-muted-foreground shrink-0">•</span>
 <span className="text-muted-foreground italic">{reference}</span>
 </li>
 ))}
 </ul>
 </div>
 )}
 </div>
 )}
 </Card>
 </motion.div>
 );
})}
 </CardContent>
 </motion.div>
 )}
 </AnimatePresence>
 </Card>
 </motion.div>
 );
})}
 </div>
 );
}